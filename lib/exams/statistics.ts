export type ExamAttemptSummary = {
  routeSlug: string;
  percent: number;
  passed: boolean;
  elapsedSeconds: number;
  completedAt: string;
  domainPercents?: Record<string, number>;
};

export type ExamProgressStats = {
  attempts: number;
  bestScore: number | null;
  lastScore: number | null;
  averageScore: number | null;
  averageSeconds: number | null;
  masteredDomains: string[];
  history: ExamAttemptSummary[];
};

export function summarizeExamAttempts(attempts: ExamAttemptSummary[]): ExamProgressStats {
  const ordered = [...attempts].sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  const scores = ordered.map((attempt) => attempt.percent);
  const domainTotals = new Map<string, { sum: number; count: number }>();

  for (const attempt of ordered) {
    for (const [domain, percent] of Object.entries(attempt.domainPercents ?? {})) {
      const current = domainTotals.get(domain) ?? { sum: 0, count: 0 };
      current.sum += percent;
      current.count++;
      domainTotals.set(domain, current);
    }
  }

  return {
    attempts: ordered.length,
    bestScore: scores.length ? Math.max(...scores) : null,
    lastScore: ordered[0]?.percent ?? null,
    averageScore: scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : null,
    averageSeconds: ordered.length
      ? Math.round(ordered.reduce((sum, attempt) => sum + attempt.elapsedSeconds, 0) / ordered.length)
      : null,
    masteredDomains: [...domainTotals.entries()]
      .filter(([, value]) => value.count > 0 && value.sum / value.count >= 80)
      .map(([domain]) => domain),
    history: ordered,
  };
}
