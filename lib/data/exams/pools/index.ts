export { appleItProPool } from "./apple-it-pro";
export { jamf100Pool } from "./jamf-100";
export { jamf200Pool } from "./jamf-200";

import { appleItProPool } from "./apple-it-pro";
import { jamf100Pool } from "./jamf-100";
import { jamf200Pool } from "./jamf-200";
import type { Question } from "@/lib/types";

export const examPools: Record<string, Question[]> = {
  "examen-apple-it-pro": appleItProPool,
  "examen-jamf-100-blanc": jamf100Pool,
  "examen-jamf-100": jamf100Pool,
  "examen-jamf-200": jamf200Pool,
};

export const examQuestionCounts: Record<string, number> = {
  "examen-apple-it-pro": 100,
  "examen-jamf-100-blanc": 100,
  "examen-jamf-100": 100,
  "examen-jamf-200": 150,
};
