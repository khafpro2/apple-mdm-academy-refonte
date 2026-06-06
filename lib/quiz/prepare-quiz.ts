import type { Question, Quiz } from "@/lib/types";
import { normalizeCorrectIndexDistribution } from "@/lib/quiz/normalize-questions";

/** Normalise un quiz (répartition A/B/C/D) sans mélange session. */
export function prepareQuiz(quiz: Quiz): Quiz {
  return {
    ...quiz,
    questions: normalizeCorrectIndexDistribution(quiz.questions),
  };
}

/** Normalise un pool d'examen. */
export function prepareExamPool(pool: Question[]): Question[] {
  return normalizeCorrectIndexDistribution(pool);
}

export function prepareQuizBank(quizzes: Quiz[]): Quiz[] {
  return quizzes.map(prepareQuiz);
}
