import type { Question } from "@/lib/types";
import { enrichQuestionWithModule } from "@/lib/data/exams/question-modules";
import { shuffleArray } from "@/lib/quiz/seeded-random";
import { variantQuestion } from "@/lib/quiz/normalize-questions";

/** Étend un pool de base jusqu'à targetCount via variantes */
export function expandQuestionPool(base: Question[], targetCount: number): Question[] {
  const pool: Question[] = [...base];
  let variant = 0;
  while (pool.length < targetCount) {
    for (const q of base) {
      if (pool.length >= targetCount) break;
      pool.push(variantQuestion(q, variant));
    }
    variant++;
  }
  return pool;
}

/** Sélection aléatoire (seed session) pour mode examen */
export function pickExamQuestions(
  base: Question[],
  count: number,
  sessionSeed: string
): Question[] {
  const expanded = expandQuestionPool(base, Math.max(count, base.length * 3));
  const shuffled = shuffleArray(expanded, sessionSeed);
  return shuffled.slice(0, count).map((q, i) =>
    enrichQuestionWithModule({
      ...q,
      id: `exam-${sessionSeed.slice(0, 8)}-${i}-${q.id}`,
    })
  );
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
