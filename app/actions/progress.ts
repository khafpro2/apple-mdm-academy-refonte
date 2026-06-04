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
};

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
