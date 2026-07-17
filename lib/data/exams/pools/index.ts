export { appleItProPool } from "./apple-it-pro";
export { acitpExamPool200 } from "@/lib/data/acitp/exam-pool";
export { jamf100Pool } from "./jamf-100";
export { jamf200Pool } from "./jamf-200";
export { jamf300Pool } from "./jamf-300";
export { jamf400Pool } from "./jamf-400";
export { appleEnterpriseExpertPool } from "./apple-enterprise-expert";
export { intuneAppleAdvancedPool } from "./intune-apple-advanced";
export { aeaExamPool200 } from "@/lib/data/apple-enterprise-architect/exam-pool";
export { appleDeploymentExamPool100 } from "@/lib/data/apple-training/exam-apple-deployment";
export { appleSecurityExamPool100 } from "@/lib/data/apple-training/exam-apple-security";
export { intuneApplePool } from "./intune-apple";

import type { Question } from "@/lib/types";
import { appleItProPool } from "./apple-it-pro";
import { acitpExamPool200 } from "@/lib/data/acitp/exam-pool";
import { jamf100Pool } from "./jamf-100";
import { jamf200Pool } from "./jamf-200";
import { jamf300Pool } from "./jamf-300";
import { jamf400Pool } from "./jamf-400";
import { appleEnterpriseExpertPool } from "./apple-enterprise-expert";
import { intuneApplePool } from "./intune-apple";
import { intuneAppleAdvancedPool } from "./intune-apple-advanced";
import { aeaExamPool200 } from "@/lib/data/apple-enterprise-architect/exam-pool";
import { appleDeploymentExamPool100 } from "@/lib/data/apple-training/exam-apple-deployment";
import { appleSecurityExamPool100 } from "@/lib/data/apple-training/exam-apple-security";

export const examPools: Record<string, Question[]> = {
  "examen-apple-it-pro": acitpExamPool200,
  "examen-jamf-100-blanc": jamf100Pool,
  "examen-jamf-100": jamf100Pool,
  "examen-jamf-200": jamf200Pool,
  "examen-intune-apple": intuneApplePool,
  "examen-jamf-300": jamf300Pool,
  "examen-jamf-400": jamf400Pool,
  "examen-apple-enterprise-expert": appleEnterpriseExpertPool,
  "examen-apple-enterprise-architect": aeaExamPool200,
  "examen-apple-deployment": appleDeploymentExamPool100,
  "examen-apple-security": appleSecurityExamPool100,
  "examen-intune-apple-advanced": intuneAppleAdvancedPool,
};

export const examQuestionCounts: Record<string, number> = {
  "examen-apple-it-pro": 200,
  "examen-jamf-100-blanc": 100,
  "examen-jamf-100": 100,
  "examen-jamf-200": 200,
  "examen-intune-apple": 100,
  "examen-jamf-300": 125,
  "examen-jamf-400": 150,
  "examen-apple-enterprise-expert": 100,
  "examen-apple-enterprise-architect": 200,
  "examen-apple-deployment": 100,
  "examen-apple-security": 100,
  "examen-intune-apple-advanced": 100,
};

/** Slug URL /examens/[slug] → quiz slug interne */
export const examRouteToQuizSlug: Record<string, string> = {
  "apple-it-professional": "examen-apple-it-pro",
  "jamf-100": "examen-jamf-100-blanc",
  "jamf-200": "examen-jamf-200",
  "intune-apple": "examen-intune-apple",
  "jamf-300": "examen-jamf-300",
  "jamf-400": "examen-jamf-400",
  "apple-enterprise-expert": "examen-apple-enterprise-expert",
  "apple-enterprise-architect": "examen-apple-enterprise-architect",
  "apple-deployment": "examen-apple-deployment",
  "apple-security": "examen-apple-security",
  "intune-apple-advanced": "examen-intune-apple-advanced",
};

export function getQuizSlugFromExamRoute(routeSlug: string): string | undefined {
  return examRouteToQuizSlug[routeSlug];
}

export function getExamRouteSlugs(): string[] {
  return Object.keys(examRouteToQuizSlug);
}

/** Retourne le pool de questions pour un slug d'examen ou de route */
export function getExamPool(slugOrRoute: string): Question[] | undefined {
  // Chercher d'abord dans les quiz slugs directs
  if (examPools[slugOrRoute]) return examPools[slugOrRoute];
  // Essayer via la route slug
  const quizSlug = getQuizSlugFromExamRoute(slugOrRoute);
  if (quizSlug && examPools[quizSlug]) return examPools[quizSlug];
  return undefined;
}

/** Retourne la route /examens/[route] correspondant à un quiz slug interne */
export function getExamRouteFromQuizSlug(quizSlug: string): string | undefined {
  const entry = Object.entries(examRouteToQuizSlug).find(([, qs]) => qs === quizSlug);
  return entry?.[0];
}
