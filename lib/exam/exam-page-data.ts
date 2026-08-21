import { notFound } from "next/navigation";
import { getQuiz, getExamPool } from "@/lib/data";
import { getQuizSlugFromExamRoute } from "@/lib/data/exams/pools";
import { getRequiredTierForExam } from "@/lib/pricing/access-control";
import { getExamDurationMinutes, getExamFormat, getExamPassingScore, getExamQuestionCount } from "@/lib/exam/exam-config";
import { getUser } from "@/lib/supabase/server";
import { toPublicQuestions } from "@/lib/quiz/public-question";
import { uniqueQuestionCount } from "@/lib/quiz/score-attempt";

export async function getExamPageContext(routeSlug: string) {
  const quizSlug = getQuizSlugFromExamRoute(routeSlug);
  if (!quizSlug) return null;

  const quiz = getQuiz(quizSlug);
  if (!quiz?.examMode || !quiz.examQuestionCount) return null;

  const user = await getUser();
  const rawPool = getExamPool(quiz.slug) ?? quiz.questions;
  const basePool = toPublicQuestions(rawPool);
  const durationMinutes = getExamDurationMinutes(routeSlug, quiz.durationMinutes);
  const available = uniqueQuestionCount(rawPool);
  const questionCount = Math.min(
    getExamQuestionCount(routeSlug, quiz.examQuestionCount),
    Math.max(1, available)
  );
  const passingScore = getExamPassingScore(routeSlug, quiz.passingScore);
  const examFormat = getExamFormat(routeSlug);

  return {
    routeSlug,
    quizSlug,
    quiz: { ...quiz, durationMinutes, passingScore, examQuestionCount: questionCount },
    examFormat,
    basePool,
    questionCount,
    examTier: getRequiredTierForExam(routeSlug),
    isAuthenticated: !!user,
  };
}

export type ExamPageContext = NonNullable<Awaited<ReturnType<typeof getExamPageContext>>>;

export async function requireExamPageContext(routeSlug: string): Promise<ExamPageContext> {
  const ctx = await getExamPageContext(routeSlug);
  if (!ctx) notFound();
  return ctx;
}
