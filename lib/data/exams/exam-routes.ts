import { examRouteToQuizSlug } from "@/lib/data/exams/pools";

export function getExamRouteFromQuizSlug(quizSlug: string): string | undefined {
  for (const [route, slug] of Object.entries(examRouteToQuizSlug)) {
    if (slug === quizSlug) return route;
  }
  return undefined;
}

export function getExamLoginRedirect(quizSlug: string): string {
  const route = getExamRouteFromQuizSlug(quizSlug);
  return route ? `/examens/${route}` : `/quiz/${quizSlug}`;
}
