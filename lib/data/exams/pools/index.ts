export { appleItProPool } from "./apple-it-pro";
export { jamf100Pool } from "./jamf-100";
export { jamf200Pool } from "./jamf-200";
export { jamf300Pool } from "./jamf-300";
export { jamf400Pool } from "./jamf-400";
export { appleEnterpriseExpertPool } from "./apple-enterprise-expert";
export { intuneAppleAdvancedPool } from "./intune-apple-advanced";
export {
  kandjiFundamentalsPool,
  mosyleFundamentalsPool,
  addigyFundamentalsPool,
  workspaceOneApplePool,
} from "@/lib/data/alternative-mdm-tracks/exam-pools";

export { intuneApplePool } from "./intune-apple";

import { appleItProPool } from "./apple-it-pro";
import { jamf100Pool } from "./jamf-100";
import { jamf200Pool } from "./jamf-200";
import { jamf300Pool } from "./jamf-300";
import { jamf400Pool } from "./jamf-400";
import { appleEnterpriseExpertPool } from "./apple-enterprise-expert";
import { intuneApplePool } from "./intune-apple";
import { intuneAppleAdvancedPool } from "./intune-apple-advanced";
import {
  kandjiFundamentalsPool,
  mosyleFundamentalsPool,
  addigyFundamentalsPool,
  workspaceOneApplePool,
} from "@/lib/data/alternative-mdm-tracks/exam-pools";
import type { Question } from "@/lib/types";

export const examPools: Record<string, Question[]> = {
  "examen-apple-it-pro": appleItProPool,
  "examen-jamf-100-blanc": jamf100Pool,
  "examen-jamf-100": jamf100Pool,
  "examen-jamf-200": jamf200Pool,
  "examen-intune-apple": intuneApplePool,
  "examen-jamf-300": jamf300Pool,
  "examen-jamf-400": jamf400Pool,
  "examen-apple-enterprise-expert": appleEnterpriseExpertPool,
  "examen-intune-apple-advanced": intuneAppleAdvancedPool,
  "examen-kandji-fundamentals": kandjiFundamentalsPool,
  "examen-mosyle-fundamentals": mosyleFundamentalsPool,
  "examen-addigy-fundamentals": addigyFundamentalsPool,
  "examen-workspace-one-apple": workspaceOneApplePool,
};

export const examQuestionCounts: Record<string, number> = {
  "examen-apple-it-pro": 100,
  "examen-jamf-100-blanc": 100,
  "examen-jamf-100": 100,
  "examen-jamf-200": 150,
  "examen-intune-apple": 100,
  "examen-jamf-300": 125,
  "examen-jamf-400": 150,
  "examen-apple-enterprise-expert": 100,
  "examen-intune-apple-advanced": 100,
  "examen-kandji-fundamentals": 75,
  "examen-mosyle-fundamentals": 75,
  "examen-addigy-fundamentals": 75,
  "examen-workspace-one-apple": 75,
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
  "intune-apple-advanced": "examen-intune-apple-advanced",
  "kandji-fundamentals": "examen-kandji-fundamentals",
  "mosyle-fundamentals": "examen-mosyle-fundamentals",
  "addigy-fundamentals": "examen-addigy-fundamentals",
  "workspace-one-apple": "examen-workspace-one-apple",
};

export function getQuizSlugFromExamRoute(routeSlug: string): string | undefined {
  return examRouteToQuizSlug[routeSlug];
}

export function getExamRouteSlugs(): string[] {
  return Object.keys(examRouteToQuizSlug);
}
