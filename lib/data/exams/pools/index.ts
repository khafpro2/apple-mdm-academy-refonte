export { appleItProPool } from "./apple-it-pro";
export { jamf100Pool } from "./jamf-100";
export { jamf200Pool } from "./jamf-200";

export { intuneApplePool } from "./intune-apple";

import { appleItProPool } from "./apple-it-pro";
import { jamf100Pool } from "./jamf-100";
import { jamf200Pool } from "./jamf-200";
import { intuneApplePool } from "./intune-apple";
import type { Question } from "@/lib/types";

export const examPools: Record<string, Question[]> = {
  "examen-apple-it-pro": appleItProPool,
  "examen-jamf-100-blanc": jamf100Pool,
  "examen-jamf-100": jamf100Pool,
  "examen-jamf-200": jamf200Pool,
  "examen-intune-apple": intuneApplePool,
};

export const examQuestionCounts: Record<string, number> = {
  "examen-apple-it-pro": 100,
  "examen-jamf-100-blanc": 100,
  "examen-jamf-100": 100,
  "examen-jamf-200": 150,
  "examen-intune-apple": 100,
};

/** Slug URL /examens/[slug] → quiz slug interne */
export const examRouteToQuizSlug: Record<string, string> = {
  "apple-it-professional": "examen-apple-it-pro",
  "jamf-100": "examen-jamf-100-blanc",
  "jamf-200": "examen-jamf-200",
  "intune-apple": "examen-intune-apple",
};

export function getQuizSlugFromExamRoute(routeSlug: string): string | undefined {
  return examRouteToQuizSlug[routeSlug];
}

export function getExamRouteSlugs(): string[] {
  return Object.keys(examRouteToQuizSlug);
}
