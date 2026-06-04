import { createClient } from "@/lib/supabase/server";
import { tracks } from "@/lib/data/tracks";
import { quizzes } from "@/lib/data/quizzes";
import { badgeCatalog } from "@/lib/badges-config";

export type TrackProgressRow = {
  track_slug: string;
  percent: number;
  updated_at: string;
};

export type QuizResultRow = {
  quiz_slug: string;
  score: number;
  passed: boolean;
  completed_at: string;
};

export type UserBadgeRow = {
  badge_id: string;
  earned_at: string;
};

export type DashboardData = {
  fromDatabase: boolean;
  globalPercent: number;
  tracks: { slug: string; title: string; percent: number }[];
  recentActivity: { label: string; date: string; type: string }[];
  badges: { id: string; name: string; icon: string; description: string; earned: boolean; earnedAt?: string }[];
  certificates: { quizSlug: string; name: string; score: string; date: string; status: "available" | "locked" }[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getQuizTitle(slug: string) {
  return quizzes.find((q) => q.slug === slug)?.title ?? slug;
}

export async function fetchDashboardData(userId: string): Promise<DashboardData | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const [progressRes, resultsRes, badgesRes] = await Promise.all([
    supabase.from("track_progress").select("track_slug, percent, updated_at").eq("user_id", userId),
    supabase
      .from("quiz_results")
      .select("quiz_slug, score, passed, completed_at")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false })
      .limit(20),
    supabase.from("user_badges").select("badge_id, earned_at").eq("user_id", userId),
  ]);

  if (progressRes.error || resultsRes.error || badgesRes.error) {
    console.error("Dashboard fetch error:", progressRes.error || resultsRes.error || badgesRes.error);
    return null;
  }

  const progressMap = new Map(
    (progressRes.data as TrackProgressRow[]).map((p) => [p.track_slug, p.percent])
  );

  const trackRows = tracks.map((t) => ({
    slug: t.slug,
    title: t.title,
    percent: progressMap.get(t.slug) ?? 0,
  }));

  const startedTracks = trackRows.filter((t) => t.percent > 0);
  const globalPercent =
    startedTracks.length > 0
      ? Math.round(startedTracks.reduce((sum, t) => sum + t.percent, 0) / startedTracks.length)
      : 0;

  const recentActivity = (resultsRes.data as QuizResultRow[]).slice(0, 6).map((r) => {
    const quiz = quizzes.find((q) => q.slug === r.quiz_slug);
    return {
      label: `${quiz?.title ?? r.quiz_slug} — ${r.score}%`,
      date: formatDate(r.completed_at),
      type: quiz?.type === "examen" ? "examen" : "quiz",
    };
  });

  const earnedSet = new Set((badgesRes.data as UserBadgeRow[]).map((b) => b.badge_id));
  const earnedMap = new Map(
    (badgesRes.data as UserBadgeRow[]).map((b) => [b.badge_id, b.earned_at])
  );

  const badges = badgeCatalog.map((b) => ({
    ...b,
    earned: earnedSet.has(b.id),
    earnedAt: earnedMap.get(b.id) ? formatDate(earnedMap.get(b.id)!) : undefined,
  }));

  const passedByQuiz = new Map<string, QuizResultRow>();
  for (const r of resultsRes.data as QuizResultRow[]) {
    if (!r.passed) continue;
    const existing = passedByQuiz.get(r.quiz_slug);
    if (!existing || r.score > existing.score) {
      passedByQuiz.set(r.quiz_slug, r);
    }
  }

  const certificates = [...passedByQuiz.values()].map((r) => ({
    quizSlug: r.quiz_slug,
    name: getQuizTitle(r.quiz_slug),
    score: `${r.score}%`,
    date: formatDate(r.completed_at),
    status: "available" as const,
  }));

  return {
    fromDatabase: true,
    globalPercent,
    tracks: trackRows.filter((t) => t.percent > 0).slice(0, 6),
    recentActivity,
    badges,
    certificates,
  };
}

export async function upsertTrackProgress(userId: string, trackSlug: string, score: number) {
  const supabase = await createClient();
  if (!supabase) return;

  const { data: existing } = await supabase
    .from("track_progress")
    .select("percent")
    .eq("user_id", userId)
    .eq("track_slug", trackSlug)
    .maybeSingle();

  const newPercent = Math.max(existing?.percent ?? 0, score);

  await supabase.from("track_progress").upsert(
    {
      user_id: userId,
      track_slug: trackSlug,
      percent: newPercent,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,track_slug" }
  );
}

export async function insertQuizResult(
  userId: string,
  payload: {
    quizSlug: string;
    score: number;
    passed: boolean;
    answers: Record<string, number>;
  }
) {
  const supabase = await createClient();
  if (!supabase) return { error: "not_configured" as const };

  const { error } = await supabase.from("quiz_results").insert({
    user_id: userId,
    quiz_slug: payload.quizSlug,
    score: payload.score,
    passed: payload.passed,
    answers: payload.answers,
  });

  if (error) return { error: error.message };
  return { error: null };
}

export async function awardBadge(userId: string, badgeId: string): Promise<boolean> {
  const supabase = await createClient();
  if (!supabase) return false;

  const { data: existing } = await supabase
    .from("user_badges")
    .select("badge_id")
    .eq("user_id", userId)
    .eq("badge_id", badgeId)
    .maybeSingle();

  if (existing) return false;

  const { error } = await supabase.from("user_badges").insert({
    user_id: userId,
    badge_id: badgeId,
  });

  return !error;
}

export async function countPerfectQuizzes(userId: string) {
  const supabase = await createClient();
  if (!supabase) return 0;

  const { data } = await supabase
    .from("quiz_results")
    .select("quiz_slug")
    .eq("user_id", userId)
    .eq("score", 100);

  if (!data) return 0;
  return new Set(data.map((r) => r.quiz_slug)).size;
}

export async function countPassedQuizzes(userId: string) {
  const supabase = await createClient();
  if (!supabase) return 0;

  const { count } = await supabase
    .from("quiz_results")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("passed", true);

  return count ?? 0;
}
