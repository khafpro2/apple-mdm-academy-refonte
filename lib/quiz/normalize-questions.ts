import type { Question } from "@/lib/types";
import { shuffleArray } from "@/lib/quiz/seeded-random";
import { placeCorrectAtIndex, shuffleQuestionOptions } from "@/lib/quiz/shuffle-options";

const TARGET_CYCLE: (0 | 1 | 2 | 3)[] = [0, 1, 2, 3];

/** Répartit les bonnes réponses ~25 % par position (A/B/C/D). */
export function normalizeCorrectIndexDistribution(questions: Question[]): Question[] {
  return questions.map((q, i) => {
    const target = TARGET_CYCLE[i % TARGET_CYCLE.length]!;
    return placeCorrectAtIndex(q, target, `${q.id}-norm-${i}`);
  });
}

/** Prépare les questions pour une session (normalisation + mélange session). */
export function prepareQuestionsForSession(
  questions: Question[],
  sessionSeed: string
): Question[] {
  const publicOnly = questions.every((q) => q.correctIndex < 0 && !q.correctIndices);
  if (publicOnly) {
    return questions.map((q, i) => ({
      ...q,
      options: shuffleArray(q.options, `${sessionSeed}-${q.id}-${i}`),
    }));
  }
  const normalized = normalizeCorrectIndexDistribution(questions);
  return normalized.map((q, i) => shuffleQuestionOptions(q, `${sessionSeed}-${q.id}-${i}`));
}

/** Variante d'examen avec options mélangées. */
export function variantQuestion(q: Question, variantIndex: number): Question {
  return shuffleQuestionOptions(q, `${q.id}-v${variantIndex}`);
}
