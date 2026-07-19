import { notFound } from "next/navigation";
import { getQuiz, getExamPool } from "@/lib/data";
import { getQuizSlugFromExamRoute } from "@/lib/data/exams/pools";
import { getRequiredTierForExam } from "@/lib/pricing/access-control";
import { getExamDurationMinutes, getExamFormat, getExamPassingScore, getExamQuestionCount } from "@/lib/exams/exam-config";
import { getUser } from "@/lib/supabase/server";

export async function getExamPageContext(routeSlug: string) {
  const quizSlug = getQuizSlugFromExamRoute(routeSlug);
  if (!quizSlug) return null;

  const quiz = getQuiz(quizSlug);
  if (!quiz?.examMode || !quiz.examQuestionCount) return null;

  const user = await getUser();
  const basePool = getExamPool(quiz.slug) ?? quiz.questions;
  const durationMinutes = getExamDurationMinutes(routeSlug, quiz.durationMinutes);
  const questionCount = getExamQuestionCount(routeSlug, quiz.examQuestionCount);
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
