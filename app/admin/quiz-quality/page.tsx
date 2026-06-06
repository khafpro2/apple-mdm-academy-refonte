import Link from "next/link";
import { PageShell } from "@/components/layout";
import { SectionHeading, Card, ProgressBar, Badge } from "@/components/ui";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { runQuizQualityAudit } from "@/lib/quiz/run-audit";

export const metadata = buildPageMetadata({
  title: "Audit qualité QCM",
  description: "Analyse anti-patterns des QCM : position, longueur, distracteurs et score qualité.",
  path: "/admin/quiz-quality",
  noIndex: true,
});

function pct(n: number, total: number) {
  return total > 0 ? `${((n / total) * 100).toFixed(1)} %` : "—";
}

function AuditSummary({
  title,
  audit,
}: {
  title: string;
  audit: ReturnType<typeof runQuizQualityAudit>["prepared"];
}) {
  const dist = audit.globalPositionDistribution;
  const total = audit.totalQuestions;

  return (
    <Card className="mt-6">
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="text-3xl font-bold text-accent">{audit.qualityScore}/100</div>
        <div className="text-sm text-ink-secondary">
          {audit.totalQuizzes} quiz · {audit.totalQuestions} questions
        </div>
      </div>
      <ProgressBar value={audit.qualityScore} className="mt-4" />

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-xs font-semibold uppercase text-ink-tertiary">Position A</dt>
          <dd className="text-lg font-semibold text-ink">{dist[0] ?? 0} ({pct(dist[0] ?? 0, total)})</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase text-ink-tertiary">Position B</dt>
          <dd className="text-lg font-semibold text-ink">{dist[1] ?? 0} ({pct(dist[1] ?? 0, total)})</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase text-ink-tertiary">Position C</dt>
          <dd className="text-lg font-semibold text-ink">{dist[2] ?? 0} ({pct(dist[2] ?? 0, total)})</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase text-ink-tertiary">Position D</dt>
          <dd className="text-lg font-semibold text-ink">{dist[3] ?? 0} ({pct(dist[3] ?? 0, total)})</dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <Badge variant="dark">Biais position : {audit.positionBiasScore}/100</Badge>
        <Badge variant="accent">Longueur : {audit.lengthImbalanceCount} issues</Badge>
        <Badge variant="accent">Distracteurs faibles : {audit.weakDistractorCount}</Badge>
        <Badge variant="accent">Trop faciles : {audit.tooEasyCount}</Badge>
      </div>
    </Card>
  );
}

export default function QuizQualityAuditPage() {
  const report = runQuizQualityAudit();

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Admin"
          title="Audit qualité QCM"
          description="Détection des anti-patterns : réponses toujours en B, longueurs déséquilibrées, distracteurs faibles."
        />

        <AuditSummary title="Après normalisation (runtime)" audit={report.runtime} />
        <AuditSummary title="Source brute (avant normalisation)" audit={report.source} />

        <Card className="mt-8">
          <h3 className="text-lg font-bold text-ink">Quiz les plus faibles</h3>
          <ul className="mt-4 space-y-3">
            {report.runtime.quizResults.slice(0, 10).map((r) => (
              <li key={r.quizSlug} className="flex items-center justify-between rounded-xl border border-border-light px-4 py-3 text-sm">
                <span className="font-medium text-ink">{r.quizSlug}</span>
                <span className="text-ink-secondary">
                  {r.questionCount} Q · score {r.qualityScore}/100 · {r.issues.length} issues
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="mt-8">
          <h3 className="text-lg font-bold text-ink">Issues prioritaires</h3>
          <ul className="mt-4 space-y-2 text-sm text-ink-secondary">
            {report.source.topIssues.slice(0, 15).map((issue, i) => (
              <li key={`${issue.questionId}-${issue.type}-${i}`} className="rounded-lg bg-surface px-3 py-2">
                <span className="font-medium text-ink">{issue.questionId}</span>
                {" — "}
                {issue.message}
                <Badge variant={issue.severity === "high" ? "dark" : "accent"} className="ml-2">
                  {issue.severity}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Link href="/admin" className="mt-8 inline-block text-sm font-semibold text-accent hover:underline">
          ← Retour admin
        </Link>
      </div>
    </PageShell>
  );
}
