import type { Question, Quiz } from "@/lib/types";
import { normalizeCorrectIndexDistribution } from "@/lib/quiz/normalize-questions";
import { polishQuestions } from "@/lib/quiz/polish-questions";

/** Normalise un quiz (répartition A/B/C/D + polish qualité) sans mélange session. */
export function prepareQuiz(quiz: Quiz): Quiz {
  return {
    ...quiz,
    questions: polishQuestions(normalizeCorrectIndexDistribution(quiz.questions)),
  };
}

/** Normalise un pool d'examen. */
export function prepareExamPool(pool: Question[]): Question[] {
  return polishQuestions(normalizeCorrectIndexDistribution(pool));
}

export function prepareQuizBank(quizzes: Quiz[]): Quiz[] {
  return quizzes.map(prepareQuiz);
}
