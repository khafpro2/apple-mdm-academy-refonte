import type { Question } from "@/lib/types";
import { countByDomain, countCorrectIndexDistribution } from "@/lib/data/exams/pools/banks/exam-bank-builder";

export type PoolQualityReport = {
  quizSlug: string;
  uniqueCount: number;
  targetCount: number;
  coveragePercent: number;
  domainCounts: Record<string, number>;
  weakDomains: string[];
  missingExplanation: number;
  correctIndexDistribution: Record<number, number>;
};

export function analyzePoolQuality(
  quizSlug: string,
  pool: Question[] | undefined,
  targetCount: number,
  expectedDomains?: Record<string, number>
): PoolQualityReport {
  const questions = pool ?? [];
  const domainCounts = countByDomain(questions);
  const weakDomains: string[] = [];

  if (expectedDomains) {
    for (const [domain, min] of Object.entries(expectedDomains)) {
      if ((domainCounts[domain] ?? 0) < min) {
        weakDomains.push(`${domain} (${domainCounts[domain] ?? 0}/${min})`);
      }
    }
  } else if (questions.length < targetCount) {
    weakDomains.push(`total (${questions.length}/${targetCount})`);
  }

  return {
    quizSlug,
    uniqueCount: questions.length,
    targetCount,
    coveragePercent: targetCount > 0 ? Math.round((questions.length / targetCount) * 100) : 0,
    domainCounts,
    weakDomains,
    missingExplanation: questions.filter((q) => !q.explanation?.trim()).length,
    correctIndexDistribution: countCorrectIndexDistribution(questions),
  };
}
