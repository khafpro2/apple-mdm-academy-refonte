import { createClient, getUser } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/env";
import { isDemoUserEmail } from "@/lib/demo/demo-user";

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
  if (isDemoUserEmail(email)) return false;

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

export type AdminExamStat = {
  quizSlug: string;
  attempts: number;
  passRate: number;
  avgScore: number;
};

export type AdminSubscriptionStats = {
  freeUsers: number;
  proUsers: number;
  enterpriseUsers: number;
  estimatedMrr: number;
  conversionRate: number;
};

export type AdminStats = {
  totalUsers: number;
  totalQuizAttempts: number;
  passRate: number;
  avgDurationMinutes: number;
  totalLabsCompleted: number;
  totalCoursesCompleted: number;
  totalBadgesEarned: number;
  recentResults: AdminQuizResult[];
  trackStats: { track_slug: string; avg_percent: number; learners: number }[];
  popularModules: { lesson_slug: string; completions: number }[];
  popularLabs: { lesson_slug: string; completions: number }[];
  examStats: AdminExamStat[];
  subscriptionStats: AdminSubscriptionStats;
  advancedTrackStats: import("@/lib/data/advanced-tracks/admin-stats").AdvancedTrackAdminStat[];
  altMdmTrackStats: import("@/lib/data/alternative-mdm-tracks/admin-stats").AltMdmTrackAdminStat[];
};

import { estimateMrr } from "@/lib/pricing/stripe-config";
import { buildAdvancedTrackStats } from "@/lib/data/advanced-tracks/admin-stats";
import { buildAltMdmTrackStats } from "@/lib/data/alternative-mdm-tracks/admin-stats";

export async function fetchAdminStats(): Promise<AdminStats | null> {
  if (!getSupabaseEnv().configured) return null;

  const supabase = await createClient();
  if (!supabase) return null;

  await supabase.rpc("sync_admin_from_allowlist");

  const [usersRes, resultsRes, progressRes, lessonRes, durationRes, badgesRes] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("quiz_results").select("id, quiz_slug, passed, duration_seconds, score"),
    supabase.from("track_progress").select("track_slug, percent"),
    supabase.from("lesson_progress").select("lesson_slug, course_slug"),
    supabase.from("quiz_results").select("duration_seconds").not("duration_seconds", "is", null),
    supabase.from("user_badges").select("badge_id", { count: "exact", head: true }),
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

  const moduleCounts = new Map<string, number>();
  const labCounts = new Map<string, number>();
  let totalLabsCompleted = 0;
  let totalCoursesCompleted = 0;

  for (const row of lessonRes.data ?? []) {
    const slug = row.lesson_slug as string;
    const courseSlug = (row as { course_slug?: string }).course_slug;
    if (courseSlug === "labs") {
      labCounts.set(slug, (labCounts.get(slug) ?? 0) + 1);
      totalLabsCompleted++;
    } else {
      moduleCounts.set(slug, (moduleCounts.get(slug) ?? 0) + 1);
      totalCoursesCompleted++;
    }
  }

  const popularModules = [...moduleCounts.entries()]
    .map(([lesson_slug, completions]) => ({ lesson_slug, completions }))
    .sort((a, b) => b.completions - a.completions)
    .slice(0, 8);

  const popularLabs = [...labCounts.entries()]
    .map(([lesson_slug, completions]) => ({ lesson_slug, completions }))
    .sort((a, b) => b.completions - a.completions)
    .slice(0, 8);

  const durations = (durationRes.data ?? [])
    .map((r) => r.duration_seconds as number)
    .filter((d) => d > 0);
  const avgDurationMinutes =
    durations.length > 0
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length / 60)
      : 0;

  const examSlugs = [
    "examen-apple-it-pro",
    "examen-jamf-100-blanc",
    "examen-jamf-200",
    "examen-intune-apple",
    "examen-jamf-300",
    "examen-jamf-400",
    "examen-apple-enterprise-expert",
    "examen-apple-enterprise-architect",
  "examen-apple-deployment",
  "examen-apple-security",
    "examen-intune-apple-advanced",
  ];
  const examStats: AdminExamStat[] = examSlugs.map((quizSlug) => {
    const rows = allResults.filter((r) => (r as { quiz_slug?: string }).quiz_slug === quizSlug);
    const attempts = rows.length;
    const passedCount = rows.filter((r) => r.passed).length;
    const avgScore =
      attempts > 0 ? Math.round(rows.reduce((s, r) => s + r.score, 0) / attempts) : 0;
    return {
      quizSlug,
      attempts,
      passRate: attempts > 0 ? Math.round((passedCount / attempts) * 100) : 0,
      avgScore,
    };
  });

  const totalUsers = usersRes.count ?? 0;
  // Placeholder jusqu'à colonne subscription_tier dans profiles
  const proUsers = Math.max(0, Math.round(totalUsers * 0.12));
  const enterpriseUsers = Math.max(0, Math.round(totalUsers * 0.03));
  const freeUsers = Math.max(0, totalUsers - proUsers - enterpriseUsers);
  const subscriptionStats: AdminSubscriptionStats = {
    freeUsers,
    proUsers,
    enterpriseUsers,
    estimatedMrr: estimateMrr(proUsers, enterpriseUsers),
    conversionRate: totalUsers > 0 ? Math.round(((proUsers + enterpriseUsers) / totalUsers) * 100) : 0,
  };

  const advancedTrackStats = buildAdvancedTrackStats(trackStats, examStats, labCounts);
  const altMdmTrackStats = buildAltMdmTrackStats(trackStats, examStats, labCounts);

  return {
    totalUsers,
    totalQuizAttempts: allResults.length,
    passRate,
    avgDurationMinutes,
    totalLabsCompleted,
    totalCoursesCompleted,
    totalBadgesEarned: badgesRes.count ?? 0,
    recentResults,
    trackStats,
    popularModules,
    popularLabs,
    examStats,
    subscriptionStats,
    advancedTrackStats,
    altMdmTrackStats,
  };
}

export async function getBestPassedResult(userId: string, quizSlug: string) {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("quiz_results")
    .select("id, score, completed_at")
    .eq("user_id", userId)
    .eq("quiz_slug", quizSlug)
    .eq("passed", true)
    .order("score", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data;
}
