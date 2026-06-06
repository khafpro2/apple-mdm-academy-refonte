import { collectAllQuizSets } from "@/lib/quiz/collect-questions";
import { normalizeCorrectIndexDistribution } from "@/lib/quiz/normalize-questions";
import { auditAllQuizSets, type GlobalQuizAudit } from "@/lib/quiz/quality-audit";
import { quizzes } from "@/lib/data/quizzes";

export type QuizQualityReport = {
  source: GlobalQuizAudit;
  prepared: GlobalQuizAudit;
  runtime: GlobalQuizAudit;
};

export function runQuizQualityAudit(): QuizQualityReport {
  const rawSets = collectAllQuizSets();
  const source = auditAllQuizSets(rawSets);

  const preparedSets = rawSets.map((s) => ({
    slug: s.slug,
    questions: normalizeCorrectIndexDistribution(s.questions),
  }));
  const prepared = auditAllQuizSets(preparedSets);

  const runtimeSets = quizzes.map((q) => ({ slug: q.slug, questions: q.questions }));
  const runtime = auditAllQuizSets(runtimeSets);

  return { source, prepared, runtime };
}
