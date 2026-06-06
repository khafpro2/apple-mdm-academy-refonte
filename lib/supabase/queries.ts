import { createClient } from "@/lib/supabase/server";
import { tracks } from "@/lib/data/tracks";
import { quizzes } from "@/lib/data/quizzes";
import { badgeCatalog } from "@/lib/badges-config";
import type { LeaderboardEntry, LearnerStats } from "@/lib/types";
import { premiumBadgeIds } from "@/lib/badges-config";
import { trackCertificates, evaluateCertification, evaluateAllCertificationPaths } from "@/lib/certifications";
import type { CertificationEligibility, PathCertificationEligibility } from "@/lib/certifications";
import { labs } from "@/lib/labs";

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
  stats: LearnerStats;
  leaderboard: LeaderboardEntry[];
  completedLabSlugs: string[];
  completedLessonSlugs: string[];
  maxExamScores: Record<string, number>;
  trackCertifications: CertificationEligibility[];
  pathCertifications: PathCertificationEligibility[];
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

  const [progressRes, resultsRes, badgesRes, lessonRes, studyRes] = await Promise.all([
    supabase.from("track_progress").select("track_slug, percent, updated_at").eq("user_id", userId),
    supabase
      .from("quiz_results")
      .select("quiz_slug, score, passed, completed_at, duration_seconds")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false })
      .limit(50),
    supabase.from("user_badges").select("badge_id, earned_at").eq("user_id", userId),
    supabase.from("lesson_progress").select("lesson_slug, course_slug, score, completed_at").eq("user_id", userId),
    supabase.from("study_sessions").select("duration_seconds").eq("user_id", userId),
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

  const allResults = resultsRes.data as (QuizResultRow & { duration_seconds?: number })[];
  const modulesCompleted = (lessonRes.data ?? []).filter(
    (r) => (r as { course_slug?: string }).course_slug !== "labs"
  ).length;

  const completedLabSlugs = (lessonRes.data ?? [])
    .filter((r) => (r as { course_slug?: string }).course_slug === "labs")
    .map((r) => r.lesson_slug as string);

  const completedLessonSlugs = new Set(
    (lessonRes.data ?? [])
      .filter((r) => (r as { course_slug?: string }).course_slug !== "labs")
      .map((r) => r.lesson_slug as string)
  );

  const examScores = new Map<string, number>();
  const maxExamScoresMap = new Map<string, number>();
  for (const r of resultsRes.data as QuizResultRow[]) {
    const prevMax = maxExamScoresMap.get(r.quiz_slug) ?? 0;
    maxExamScoresMap.set(r.quiz_slug, Math.max(prevMax, r.score));
    if (!r.passed) continue;
    const prev = examScores.get(r.quiz_slug) ?? 0;
    examScores.set(r.quiz_slug, Math.max(prev, r.score));
  }

  const trackCertifications = trackCertificates.map((cert) =>
    evaluateCertification(cert, completedLessonSlugs, new Set(completedLabSlugs), examScores)
  );
  const pathCertifications = evaluateAllCertificationPaths(
    completedLessonSlugs,
    new Set(completedLabSlugs),
    examScores
  );
  const quizMinutes = allResults.reduce((s, r) => s + (r.duration_seconds ?? 0), 0) / 60;
  const studyMinutes = (studyRes.data ?? []).reduce((s, r) => s + (r.duration_seconds ?? 0), 0) / 60;
  const timeSpentMinutes = Math.round(quizMinutes + studyMinutes + modulesCompleted * 15);
  const averageScore =
    allResults.length > 0
      ? Math.round(allResults.reduce((s, r) => s + r.score, 0) / allResults.length)
      : 0;
  const lastActivity = recentActivity[0]
    ? { label: recentActivity[0].label, date: recentActivity[0].date }
    : null;

  const stats: LearnerStats = {
    globalPercent,
    timeSpentMinutes,
    modulesCompleted,
    averageScore,
    lastActivity,
    certificatesCount:
      certificates.length +
      trackCertifications.filter((c) => c.eligible).length +
      pathCertifications.filter((c) => c.eligible).length,
    labsCompleted: completedLabSlugs.length,
    labsInProgress: Math.max(0, labs.length - completedLabSlugs.length),
    practicePercent:
      labs.length > 0 ? Math.round((completedLabSlugs.length / labs.length) * 100) : 0,
  };

  const leaderboard = await fetchLeaderboard(userId);

  return {
    fromDatabase: true,
    globalPercent,
    tracks: trackRows.filter((t) => t.percent > 0).slice(0, 6),
    recentActivity,
    badges: badges.filter((b) => premiumBadgeIds.includes(b.id) || b.earned),
    certificates,
    stats,
    leaderboard,
    completedLabSlugs,
    completedLessonSlugs: [...completedLessonSlugs],
    maxExamScores: Object.fromEntries(maxExamScoresMap),
    trackCertifications,
    pathCertifications,
  };
}

export async function fetchLeaderboard(currentUserId?: string): Promise<LeaderboardEntry[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data: results } = await supabase
    .from("quiz_results")
    .select("user_id, score, duration_seconds, passed")
    .order("score", { ascending: false })
    .limit(200);

  if (!results?.length) return [];

  const userIds = [...new Set(results.map((r) => r.user_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", userIds);

  const { data: lessons } = await supabase
    .from("lesson_progress")
    .select("user_id, lesson_slug, course_slug")
    .in("user_id", userIds);

  const nameMap = new Map((profiles ?? []).map((p) => [p.id, p.full_name ?? "Apprenant"]));

  const agg = new Map<
    string,
    { bestScore: number; scores: number[]; modules: number; labs: number; certs: number; fastest: number | null }
  >();

  for (const uid of userIds) {
    agg.set(uid, { bestScore: 0, scores: [], modules: 0, labs: 0, certs: 0, fastest: null });
  }

  for (const r of results) {
    const a = agg.get(r.user_id)!;
    a.bestScore = Math.max(a.bestScore, r.score);
    a.scores.push(r.score);
    if (r.passed) a.certs += 1;
    if (r.passed && r.duration_seconds && r.duration_seconds > 0) {
      a.fastest = a.fastest ? Math.min(a.fastest, r.duration_seconds) : r.duration_seconds;
    }
  }

  for (const l of lessons ?? []) {
    const a = agg.get(l.user_id);
    if (!a) continue;
    if ((l as { course_slug?: string }).course_slug === "labs") a.labs += 1;
    else a.modules += 1;
  }

  const entries = [...agg.entries()]
    .map(([userId, a]) => ({
      userId,
      name: nameMap.get(userId) ?? "Apprenant",
      bestScore: a.bestScore,
      avgScore: a.scores.length ? Math.round(a.scores.reduce((x, y) => x + y, 0) / a.scores.length) : 0,
      modulesCompleted: a.modules,
      labsCompleted: a.labs,
      certsEarned: a.certs,
      fastestMinutes: a.fastest ? Math.round(a.fastest / 60) : null,
      highlight: userId === currentUserId,
    }))
    .sort(
      (a, b) =>
        b.bestScore - a.bestScore ||
        (b.certsEarned ?? 0) - (a.certsEarned ?? 0) ||
        (b.labsCompleted ?? 0) - (a.labsCompleted ?? 0)
    )
    .slice(0, 10)
    .map((e, i) => ({ rank: i + 1, ...e }));

  return entries;
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
    answers: Record<string, number | number[]>;
    durationSeconds?: number;
    examMode?: boolean;
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
    duration_seconds: payload.durationSeconds ?? null,
    exam_mode: payload.examMode ?? false,
  });

  if (error) return { error: error.message };

  const { data: latest } = await supabase
    .from("quiz_results")
    .select("id")
    .eq("user_id", userId)
    .eq("quiz_slug", payload.quizSlug)
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return { error: null, id: latest?.id as string | undefined };
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

export async function countCompletedLabs(userId: string) {
  const supabase = await createClient();
  if (!supabase) return 0;

  const { count } = await supabase
    .from("lesson_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("course_slug", "labs");

  return count ?? 0;
}

export type TranscriptData = {
  modules: { slug: string; courseSlug: string; score: number; completedAt: string }[];
  labs: { slug: string; completedAt: string }[];
  badges: { id: string; name: string; icon: string; earnedAt: string }[];
  exams: {
    id: string;
    quizSlug: string;
    title: string;
    score: number;
    passed: boolean;
    completedAt: string;
    durationSeconds: number | null;
  }[];
  certificates: { quizSlug: string; title: string; score: number; date: string; resultId: string }[];
};

export async function fetchTranscriptData(userId: string): Promise<TranscriptData | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const [lessonRes, badgeRes, examRes] = await Promise.all([
    supabase
      .from("lesson_progress")
      .select("lesson_slug, course_slug, score, completed_at")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false }),
    supabase
      .from("user_badges")
      .select("badge_id, earned_at")
      .eq("user_id", userId)
      .order("earned_at", { ascending: false }),
    supabase
      .from("quiz_results")
      .select("id, quiz_slug, score, passed, completed_at, duration_seconds, exam_mode")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false }),
  ]);

  const modules = (lessonRes.data ?? [])
    .filter((r) => (r as { course_slug?: string }).course_slug !== "labs")
    .map((r) => ({
      slug: r.lesson_slug as string,
      courseSlug: (r as { course_slug?: string }).course_slug ?? "intune-mac",
      score: r.score as number,
      completedAt: r.completed_at as string,
    }));

  const labs = (lessonRes.data ?? [])
    .filter((r) => (r as { course_slug?: string }).course_slug === "labs")
    .map((r) => ({
      slug: r.lesson_slug as string,
      completedAt: r.completed_at as string,
    }));

  const badges = (badgeRes.data ?? []).map((b) => {
    const meta = badgeCatalog.find((x) => x.id === b.badge_id);
    return {
      id: b.badge_id as string,
      name: meta?.name ?? b.badge_id,
      icon: meta?.icon ?? "🏅",
      earnedAt: b.earned_at as string,
    };
  });

  const exams = (examRes.data ?? [])
    .filter((r) => r.exam_mode)
    .map((r) => ({
      id: r.id as string,
      quizSlug: r.quiz_slug as string,
      title: getQuizTitle(r.quiz_slug as string),
      score: r.score as number,
      passed: r.passed as boolean,
      completedAt: r.completed_at as string,
      durationSeconds: r.duration_seconds as number | null,
    }));

  const passedExams = new Map<string, (typeof exams)[0]>();
  for (const e of exams) {
    if (!e.passed) continue;
    const prev = passedExams.get(e.quizSlug);
    if (!prev || e.score > prev.score) passedExams.set(e.quizSlug, e);
  }

  const certificates = [...passedExams.values()].map((e) => ({
    quizSlug: e.quizSlug,
    title: e.title,
    score: e.score,
    date: e.completedAt,
    resultId: e.id,
  }));

  return { modules, labs, badges, exams, certificates };
}
