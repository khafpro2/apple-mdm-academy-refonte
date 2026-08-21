"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/supabase/server";
import {
  insertQuizResult,
  upsertTrackProgress,
  awardBadge,
  countPerfectQuizzes,
  countPassedQuizzes,
} from "@/lib/supabase/queries";
import { quizBadgeMap } from "@/lib/badges-config";
import { blockDemoWrite } from "@/lib/demo/demo-write-guard";
import { scoreAttemptByLabels, type AnswerLabels, type AttemptScore } from "@/lib/quiz/score-attempt";
import { getAttemptExpectations } from "@/lib/quiz/resolve-bank";

export type SaveQuizResultPayload = {
  quizSlug: string;
  trackSlug: string;
  answers: Record<string, number | number[]>;
  answerLabels: AnswerLabels;
  durationSeconds?: number;
  examMode?: boolean;
};

export type SaveVideoProgressPayload = {
  videoSlug: string;
  courseSlug: string;
  currentSeconds: number;
  completed: boolean;
  durationSeconds: number;
};

async function createClient() {
  const { createClient: create } = await import("@/lib/supabase/server");
  return create();
}

async function rejectDemoWrite(): Promise<boolean> {
  const guard = await blockDemoWrite();
  return guard.blocked;
}

export async function saveVideoProgressAction(
  payload: SaveVideoProgressPayload
): Promise<{ ok: boolean }> {
  try {
    if (await rejectDemoWrite()) return { ok: false };
    const user = await getUser();
    if (!user) return { ok: false };

    const supabase = await createClient();
    if (!supabase) return { ok: false };

    const score = payload.durationSeconds
      ? Math.min(100, Math.round((payload.currentSeconds / payload.durationSeconds) * 100))
      : payload.completed
        ? 100
        : 0;

    const { error } = await supabase.from("lesson_progress").upsert(
      {
        user_id: user.id,
        lesson_slug: `video:${payload.videoSlug}`,
        course_slug: payload.courseSlug || "videos",
        score: payload.completed ? 100 : score,
        completed_at: payload.completed ? new Date().toISOString() : null,
      },
      { onConflict: "user_id,lesson_slug" }
    );

    if (error) return { ok: false };

    revalidatePath("/dashboard");
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export type SaveLabProgressPayload = {
  labSlug: string;
  trackSlug: string;
  /** Étapes validées — pour sync future détaillée en base */
  validatedStepIds?: string[];
  percent?: number;
};

export async function saveLabProgress(payload: SaveLabProgressPayload): Promise<{ ok: boolean; newBadges: string[] }> {
  try {
    if (await rejectDemoWrite()) return { ok: false, newBadges: [] };
    const user = await getUser();
    if (!user) return { ok: false, newBadges: [] };

    const supabase = await createClient();
    if (!supabase) return { ok: false, newBadges: [] };

    const { error } = await supabase.from("lesson_progress").upsert(
      {
        user_id: user.id,
        lesson_slug: payload.labSlug,
        course_slug: "labs",
        score: 100,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_slug" }
    );

    if (error) return { ok: false, newBadges: [] };

    await upsertTrackProgress(user.id, payload.trackSlug, 100);

    const newBadges: string[] = [];
    const { countCompletedLabs } = await import("@/lib/supabase/queries");
    const labCount = await countCompletedLabs(user.id);

    if (labCount === 1 && (await awardBadge(user.id, "first-lab"))) {
      newBadges.push("first-lab");
    }
    if (labCount >= 6 && (await awardBadge(user.id, "lab-expert"))) {
      newBadges.push("lab-expert");
    }

    revalidatePath("/dashboard");
    revalidatePath("/labs");
    return { ok: true, newBadges };
  } catch {
    return { ok: false, newBadges: [] };
  }
}

export type SaveLessonProgressPayload = {
  lessonSlug: string;
  courseSlug?: string;
  score: number;
};

export async function saveLessonProgress(payload: SaveLessonProgressPayload): Promise<{ ok: boolean; newBadges: string[] }> {
  if (await rejectDemoWrite()) return { ok: false, newBadges: [] };
  const user = await getUser();
  if (!user) return { ok: false, newBadges: [] };

  const supabase = await createClient();
  if (!supabase) return { ok: false, newBadges: [] };

  const score = Math.max(0, Math.min(100, Math.round(payload.score)));

  const { error } = await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_slug: payload.lessonSlug,
      course_slug: payload.courseSlug ?? "intune-mac",
      score,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_slug" }
  );

  if (error) return { ok: false, newBadges: [] };

  const newBadges: string[] = [];
  if (score >= 80) {
    const { lessonBadgeMap } = await import("@/lib/badges-config");
    const badgeId = lessonBadgeMap[payload.lessonSlug];
    if (badgeId && (await awardBadge(user.id, badgeId))) {
      newBadges.push(badgeId);
    }
  }

  revalidatePath("/dashboard");
  return { ok: true, newBadges };
}

export type SaveQuizResultResponse =
  | ({ ok: true; newBadges: string[]; resultId?: string } & AttemptScore)
  | ({ ok: false; reason: "not_authenticated" | "not_configured" | "demo_readonly" | "invalid_attempt" | "error"; message?: string } & Partial<AttemptScore>);

function scorePayload(payload: SaveQuizResultPayload): AttemptScore | null {
  const examMode = Boolean(payload.examMode);
  const expectations = getAttemptExpectations(payload.quizSlug, examMode);
  if (!expectations) return null;
  return scoreAttemptByLabels(
    expectations.bank,
    payload.answerLabels ?? {},
    expectations.expectedTotal,
    expectations.passingScore
  );
}

export async function saveQuizResult(payload: SaveQuizResultPayload): Promise<SaveQuizResultResponse> {
  const scored = scorePayload(payload);
  if (!scored) {
    return { ok: false, reason: "invalid_attempt", message: "Quiz ou banque introuvable." };
  }

  if (await rejectDemoWrite()) {
    return { ok: false, reason: "demo_readonly", message: "Compte démo en lecture seule.", ...scored };
  }

  const user = await getUser();
  if (!user) {
    return { ok: false, reason: "not_authenticated", ...scored };
  }

  const insertResult = await insertQuizResult(user.id, {
    quizSlug: payload.quizSlug,
    score: scored.percent,
    passed: scored.passed,
    answers: payload.answers,
    durationSeconds: payload.durationSeconds,
    examMode: payload.examMode,
  });

  if (insertResult.error === "not_configured") {
    return { ok: false, reason: "not_configured", ...scored };
  }
  if (insertResult.error) {
    return { ok: false, reason: "error", message: insertResult.error, ...scored };
  }

  await upsertTrackProgress(user.id, payload.trackSlug, scored.percent);

  const newBadges: string[] = [];

  if (scored.passed) {
    const mappedBadge = quizBadgeMap[payload.quizSlug];
    if (mappedBadge && (await awardBadge(user.id, mappedBadge))) {
      newBadges.push(mappedBadge);
    }

    const passedCount = await countPassedQuizzes(user.id);
    if (passedCount === 1 && (await awardBadge(user.id, "first-quiz"))) {
      newBadges.push("first-quiz");
    }

    const perfectCount = await countPerfectQuizzes(user.id);
    if (perfectCount >= 3 && (await awardBadge(user.id, "quiz-master"))) {
      newBadges.push("quiz-master");
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transcript");
  revalidatePath("/quiz");

  return { ok: true, newBadges, resultId: insertResult.id ?? undefined, ...scored };
}
