import { getQuiz } from "@/lib/data/quizzes";
import { examRouteToQuizSlug, examPools, examQuestionCounts } from "@/lib/data/exams/pools";
import { getExamDurationMinutes } from "@/lib/exam/exam-config";
import { isTrackVisible } from "@/lib/data/tracks";

export const PRIORITY_EXAM_ROUTES = [
  "apple-it-professional",
  "jamf-100",
  "jamf-200",
  "intune-apple",
  "apple-security",
] as const;

const EXAM_LEVEL_BY_ROUTE: Record<string, string> = {
  "apple-it-professional": "Avancé",
  "jamf-100": "Pro",
  "jamf-200": "Expert",
  "intune-apple": "Pro",
  "apple-security": "Expert",
};

export type ExamCatalogItem = {
  routeSlug: string;
  quizSlug: string;
  title: string;
  description: string;
  durationMinutes: number;
  durationLabel: string;
  questionCount: number;
  passingScore: number;
  level: string;
  baseQuestions: number;
  bankComplete: boolean;
  priority: boolean;
};

export function buildExamCatalogItem(routeSlug: string): ExamCatalogItem | null {
  const quizSlug = examRouteToQuizSlug[routeSlug];
  if (!quizSlug) return null;
  const quiz = getQuiz(quizSlug);
  if (!quiz?.examMode) return null;
  if (!isTrackVisible(quiz.trackSlug)) return null;

  const baseQuestions = examPools[quizSlug]?.length ?? 0;
  const questionCount = quiz.examQuestionCount ?? examQuestionCounts[quizSlug] ?? 0;
  const durationMinutes = getExamDurationMinutes(routeSlug, quiz.durationMinutes);

  return {
    routeSlug,
    quizSlug,
    title: quiz.title,
    description: quiz.description,
    durationMinutes,
    durationLabel: `${durationMinutes} min`,
    questionCount,
    passingScore: quiz.passingScore,
    level: EXAM_LEVEL_BY_ROUTE[routeSlug] ?? "Pro",
    baseQuestions,
    bankComplete: baseQuestions >= questionCount && questionCount > 0,
    priority: (PRIORITY_EXAM_ROUTES as readonly string[]).includes(routeSlug),
  };
}

export function buildExamCatalog(): ExamCatalogItem[] {
  const allSlugs = Object.keys(examRouteToQuizSlug);
  const prioritySet = new Set<string>(PRIORITY_EXAM_ROUTES);
  const priority = PRIORITY_EXAM_ROUTES.map((slug) => buildExamCatalogItem(slug)).filter(
    (item): item is ExamCatalogItem => item !== null
  );
  const others = allSlugs
    .filter((slug) => !prioritySet.has(slug))
    .map((slug) => buildExamCatalogItem(slug))
    .filter((item): item is ExamCatalogItem => item !== null);
  return [...priority, ...others];
}
