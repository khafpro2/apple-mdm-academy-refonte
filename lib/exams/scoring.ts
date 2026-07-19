import type { Question } from "@/lib/types";
import { isAnswerCorrect, type UserAnswer } from "@/lib/quiz/scoring";

export type ExamDomainScore = {
  domain: string;
  correct: number;
  incorrect: number;
  total: number;
  percent: number;
};

export type ExamScoreResult = {
  rawScore: number;
  total: number;
  percent: number;
  passed: boolean;
  passingScore: number;
  averageSecondsPerQuestion: number;
  elapsedSeconds: number;
  byDomain: ExamDomainScore[];
};

function domainFor(question: Question): string {
  return question.domain ?? question.relatedModuleSlug ?? "general";
}

function normalizePassingScore(value: number): number {
  return Number.isFinite(value) && value >= 0 && value <= 100 ? value : 70;
}

export function calculateExamScore({
  questions,
  answers,
  passingScore,
  elapsedSeconds,
}: {
  questions: Question[];
  answers: Record<string, UserAnswer>;
  passingScore: number;
  elapsedSeconds: number;
}): ExamScoreResult {
  const normalizedPassingScore = normalizePassingScore(passingScore);
  const domainMap = new Map<string, ExamDomainScore>();
  let rawScore = 0;

  for (const question of questions) {
    const domain = domainFor(question);
    const current = domainMap.get(domain) ?? { domain, correct: 0, incorrect: 0, total: 0, percent: 0 };
    const correct = isAnswerCorrect(question, answers[question.id]);
    if (correct) {
      rawScore++;
      current.correct++;
    } else {
      current.incorrect++;
    }
    current.total++;
    domainMap.set(domain, current);
  }

  const total = questions.length;
  const percent = total > 0 ? Math.round((rawScore / total) * 100) : 0;
  const byDomain = [...domainMap.values()].map((item) => ({
    ...item,
    percent: item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0,
  }));

  return {
    rawScore,
    total,
    percent,
    passed: percent >= normalizedPassingScore,
    passingScore: normalizedPassingScore,
    averageSecondsPerQuestion: total > 0 ? Math.round(elapsedSeconds / total) : 0,
    elapsedSeconds,
    byDomain,
  };
}
