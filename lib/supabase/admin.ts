import { createClient, getUser } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/env";

function getAdminEmailsFromEnv(): string[] {
  return (
    process.env.ADMIN_EMAILS?.split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean) ?? []
  );
}

async function syncAdminRole(userId: string): Promise<boolean> {
  const supabase = await createClient();
  if (!supabase) return false;

  await supabase.rpc("sync_admin_from_allowlist");

  const { data } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", userId)
    .maybeSingle();

  return data?.is_admin === true;
}

export async function checkIsAdmin(userId: string, email?: string | null): Promise<boolean> {
  const adminEmails = getAdminEmailsFromEnv();

  const synced = await syncAdminRole(userId);
  if (synced) return true;

  if (email && adminEmails.includes(email.toLowerCase())) {
    return true;
  }

  return false;
}

export async function requireAdmin() {
  const user = await getUser();
  if (!user) return { ok: false as const, reason: "unauthenticated" as const };
  const isAdmin = await checkIsAdmin(user.id, user.email);
  if (!isAdmin) return { ok: false as const, reason: "forbidden" as const };
  return { ok: true as const, user };
}

export type AdminQuizResult = {
  id: string;
  quiz_slug: string;
  score: number;
  passed: boolean;
  completed_at: string;
  user_id: string;
  profile_name: string | null;
};

export type AdminStats = {
  totalUsers: number;
  totalQuizAttempts: number;
  passRate: number;
  recentResults: AdminQuizResult[];
  trackStats: { track_slug: string; avg_percent: number; learners: number }[];
};

export async function fetchAdminStats(): Promise<AdminStats | null> {
  if (!getSupabaseEnv().configured) return null;

  const supabase = await createClient();
  if (!supabase) return null;

  await supabase.rpc("sync_admin_from_allowlist");

  const [usersRes, resultsRes, progressRes] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("quiz_results").select("id, passed"),
    supabase.from("track_progress").select("track_slug, percent"),
  ]);

  if (usersRes.error || resultsRes.error || progressRes.error) {
    console.error("Admin stats error:", usersRes.error || resultsRes.error || progressRes.error);
    return null;
  }

  const allResults = resultsRes.data ?? [];
  const passed = allResults.filter((r) => r.passed).length;
  const passRate = allResults.length > 0 ? Math.round((passed / allResults.length) * 100) : 0;

  const { data: recentRaw } = await supabase
    .from("quiz_results")
    .select("id, quiz_slug, score, passed, completed_at, user_id")
    .order("completed_at", { ascending: false })
    .limit(20);

  const userIds = [...new Set((recentRaw ?? []).map((r) => r.user_id))];
  const { data: profiles } = userIds.length
    ? await supabase.from("profiles").select("id, full_name").in("id", userIds)
    : { data: [] };

  const nameMap = new Map((profiles ?? []).map((p) => [p.id, p.full_name]));

  const recentResults: AdminQuizResult[] = (recentRaw ?? []).map((r) => ({
    ...r,
    profile_name: nameMap.get(r.user_id) ?? null,
  }));

  const progressByTrack = new Map<string, number[]>();
  for (const row of progressRes.data ?? []) {
    const list = progressByTrack.get(row.track_slug) ?? [];
    list.push(row.percent);
    progressByTrack.set(row.track_slug, list);
  }

  const trackStats = [...progressByTrack.entries()].map(([track_slug, percents]) => ({
    track_slug,
    avg_percent: Math.round(percents.reduce((a, b) => a + b, 0) / percents.length),
    learners: percents.length,
  }));

  return {
    totalUsers: usersRes.count ?? 0,
    totalQuizAttempts: allResults.length,
    passRate,
    recentResults,
    trackStats,
  };
}

export async function getBestPassedResult(userId: string, quizSlug: string) {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("quiz_results")
    .select("score, completed_at")
    .eq("user_id", userId)
    .eq("quiz_slug", quizSlug)
    .eq("passed", true)
    .order("score", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data;
}
