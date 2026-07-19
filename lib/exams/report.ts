import type { Question } from "@/lib/types";
import type { UserAnswer } from "@/lib/quiz/scoring";
import { calculateExamScore, type ExamDomainScore, type ExamScoreResult } from "@/lib/exams/scoring";

export type ExamRecommendation = {
  href: string;
  label: string;
  reason: string;
};

export type ExamFinalReport = ExamScoreResult & {
  strongDomains: ExamDomainScore[];
  weakDomains: ExamDomainScore[];
  recommendations: ExamRecommendation[];
};

export function buildExamFinalReport({
  questions,
  answers,
  passingScore,
  elapsedSeconds,
}: {
  questions: Question[];
  answers: Record<string, UserAnswer>;
  passingScore: number;
  elapsedSeconds: number;
}): ExamFinalReport {
  const score = calculateExamScore({ questions, answers, passingScore, elapsedSeconds });
  const strongDomains = score.byDomain.filter((domain) => domain.total >= 1 && domain.percent >= 80);
  const weakDomains = score.byDomain.filter((domain) => domain.total >= 1 && domain.percent < 70);
  const weakDomainIds = new Set(weakDomains.map((domain) => domain.domain));
  const recommendations = questions
    .filter((question) => weakDomainIds.has(question.domain ?? question.relatedModuleSlug ?? "general"))
    .map((question) => ({
      href: question.moduleHref,
      label: question.moduleLabel ?? "Revoir le module",
      reason: question.domain ?? question.relatedModuleSlug ?? "general",
    }))
    .filter((item): item is ExamRecommendation => Boolean(item.href))
    .filter((item, index, all) => all.findIndex((other) => other.href === item.href) === index)
    .slice(0, 8);

  return {
    ...score,
    strongDomains,
    weakDomains,
    recommendations,
  };
}
