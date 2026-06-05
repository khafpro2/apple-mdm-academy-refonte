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

export type SaveQuizResultPayload = {
  quizSlug: string;
  trackSlug: string;
  score: number;
  passed: boolean;
  answers: Record<string, number>;
  durationSeconds?: number;
  examMode?: boolean;
};

export type SaveLessonProgressPayload = {
  lessonSlug: string;
  courseSlug?: string;
  score: number;
};

export async function saveLessonProgress(payload: SaveLessonProgressPayload): Promise<{ ok: boolean; newBadges: string[] }> {
  const user = await getUser();
  if (!user) return { ok: false, newBadges: [] };

  const supabase = await createClient();
  if (!supabase) return { ok: false, newBadges: [] };

  const { error } = await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_slug: payload.lessonSlug,
      course_slug: payload.courseSlug ?? "intune-mac",
      score: payload.score,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_slug" }
  );

  if (error) return { ok: false, newBadges: [] };

  const newBadges: string[] = [];
  if (payload.score >= 80) {
    const { lessonBadgeMap } = await import("@/lib/badges-config");
    const badgeId = lessonBadgeMap[payload.lessonSlug];
    if (badgeId && (await awardBadge(user.id, badgeId))) {
      newBadges.push(badgeId);
    }
  }

  revalidatePath("/dashboard");
  return { ok: true, newBadges };
}

async function createClient() {
  const { createClient: create } = await import("@/lib/supabase/server");
  return create();
}

export type SaveQuizResultResponse =
  | { ok: true; newBadges: string[] }
  | { ok: false; reason: "not_authenticated" | "not_configured" | "error"; message?: string };

export async function saveQuizResult(payload: SaveQuizResultPayload): Promise<SaveQuizResultResponse> {
  const user = await getUser();
  if (!user) {
    return { ok: false, reason: "not_authenticated" };
  }

  const insertResult = await insertQuizResult(user.id, {
    quizSlug: payload.quizSlug,
    score: payload.score,
    passed: payload.passed,
    answers: payload.answers,
    durationSeconds: payload.durationSeconds,
    examMode: payload.examMode,
  });

  if (insertResult.error === "not_configured") {
    return { ok: false, reason: "not_configured" };
  }
  if (insertResult.error) {
    return { ok: false, reason: "error", message: insertResult.error };
  }

  await upsertTrackProgress(user.id, payload.trackSlug, payload.score);

  const newBadges: string[] = [];

  if (payload.passed) {
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
  revalidatePath("/quiz");

  return { ok: true, newBadges };
}
