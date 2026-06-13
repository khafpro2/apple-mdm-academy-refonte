import { examRouteToQuizSlug } from "@/lib/data/exams/pools";

export function getExamRouteFromQuizSlug(quizSlug: string): string | undefined {
  for (const [route, slug] of Object.entries(examRouteToQuizSlug)) {
    if (slug === quizSlug) return route;
  }
  return undefined;
}

export function getExamLoginRedirect(quizSlug: string): string {
  return resolveQuizHref(quizSlug);
}

/** Lien public vers un quiz ou un examen blanc (/examens si mappé). */
export function resolveQuizHref(quizSlug: string): string {
  const route = getExamRouteFromQuizSlug(quizSlug);
  return route ? `/examens/${route}` : `/quiz/${quizSlug}`;
}
