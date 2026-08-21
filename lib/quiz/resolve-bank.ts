import { getExamPool, getQuiz } from "@/lib/data/quizzes";
import { getExamQuestionCount, getExamPassingScore } from "@/lib/exam/exam-config";
import { getExamRouteFromQuizSlug } from "@/lib/data/exams/pools";
import { uniqueQuestionCount } from "@/lib/quiz/score-attempt";
import type { Question } from "@/lib/types";

export function getOfficialQuestionBank(quizSlug: string, examMode: boolean): Question[] {
  if (examMode) {
    return getExamPool(quizSlug) ?? getQuiz(quizSlug)?.questions ?? [];
  }
  return getQuiz(quizSlug)?.questions ?? [];
}

export function getAttemptExpectations(quizSlug: string, examMode: boolean): {
  bank: Question[];
  expectedTotal: number;
  passingScore: number;
} | null {
  const quiz = getQuiz(quizSlug);
  if (!quiz) return null;
  const bank = getOfficialQuestionBank(quizSlug, examMode || Boolean(quiz.examMode));
  if (bank.length === 0) return null;
  const routeSlug = getExamRouteFromQuizSlug(quizSlug);
  const unique = uniqueQuestionCount(bank);
  const target = quiz.examMode
    ? (routeSlug ? getExamQuestionCount(routeSlug, quiz.examQuestionCount ?? unique) : (quiz.examQuestionCount ?? unique))
    : quiz.questions.length;
  const passingScore = quiz.examMode && routeSlug
    ? getExamPassingScore(routeSlug, quiz.passingScore)
    : quiz.passingScore;
  return {
    bank,
    expectedTotal: Math.min(Math.max(1, target), unique),
    passingScore,
  };
}
