import type { Question } from "@/lib/types";
import {
  kandjiModules,
  mosyleModules,
  addigyModules,
  workspaceOneModules,
} from "@/lib/data/alternative-mdm-tracks/module-definitions";
import { createModuleQuiz } from "@/lib/data/alternative-mdm-tracks/quiz-factory";

function buildExamPool(modules: typeof kandjiModules, examPrefix: string): Question[] {
  const allQuestions = modules.flatMap((m) => createModuleQuiz(m).questions);
  const result: Question[] = [];
  for (let i = 0; i < 75; i++) {
    const base = allQuestions[i % allQuestions.length];
    result.push({
      ...base,
      id: `${examPrefix}-${String(i + 1).padStart(3, "0")}`,
    });
  }
  return result;
}

export const kandjiFundamentalsPool = buildExamPool(kandjiModules, "kfd-exam");
export const mosyleFundamentalsPool = buildExamPool(mosyleModules, "msl-exam");
export const addigyFundamentalsPool = buildExamPool(addigyModules, "adg-exam");
export const workspaceOneApplePool = buildExamPool(workspaceOneModules, "wsa-exam");
