import Link from "next/link";
import { PageShell } from "@/components/layout";
import { SectionHeading, Badge, Card } from "@/components/ui";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { runExamAudit } from "@/lib/exam/exam-audit";

export const metadata = buildPageMetadata({
  title: "Audit examens",
  description: "État des routes, timers et banques de questions des examens blancs.",
  path: "/admin/exam-audit",
  noIndex: true,
});

function formatDistribution(dist: Record<number, number>): string {
  return ["A", "B", "C", "D"].map((label, i) => `${label}:${dist[i] ?? 0}`).join(" · ");
}

export default function ExamAuditPage() {
  const audit = runExamAudit();
  const prioritySlugs = new Set(["jamf-100", "apple-security", "intune-apple-advanced"]);

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Admin"
          title="Audit examens"
          description={`Généré le ${new Date(audit.generatedAt).toLocaleString("fr-FR")}`}
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/admin/certification-audit" className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink">
            Audit certification
          </Link>
          <Link href="/admin" className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink">
            ← Admin
          </Link>
        </div>

        <Card className="mt-8 p-6">
          <p className="text-sm text-ink-tertiary">Examens routés</p>
          <p className="text-4xl font-bold text-accent">{audit.routesOk}/{audit.totalExams}</p>
          <p className="mt-2 text-sm text-ink-secondary">
            Banques complètes : {audit.poolsComplete}/{audit.totalExams} · Banques non vides : {audit.poolsOk}/{audit.totalExams}
          </p>
        </Card>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-border-light">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase text-ink-tertiary">
              <tr>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Uniques / Objectif</th>
                <th className="px-4 py-3">Couverture</th>
                <th className="px-4 py-3">Timer</th>
                <th className="px-4 py-3">Qualité</th>
                <th className="px-4 py-3">Réponses A–D</th>
              </tr>
            </thead>
            <tbody>
              {audit.rows.map((row) => {
                const isPriority = prioritySlugs.has(row.routeSlug);
                const complete = row.baseQuestions >= row.targetQuestions;
                return (
                  <tr
                    key={row.routeSlug}
                    className={`border-t border-border-light ${isPriority ? "bg-accent/5" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ink">{row.title}</p>
                      <p className="text-xs text-ink-tertiary">/examens/{row.routeSlug}</p>
                      {row.poolWarning && (
                        <p className="mt-1 text-xs text-amber-700">{row.poolWarning}</p>
                      )}
                      {row.quality.weakDomains.length > 0 && (
                        <p className="mt-1 text-xs text-amber-700">
                          Domaines faibles : {row.quality.weakDomains.join(", ")}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {row.baseQuestions} / {row.targetQuestions}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={complete ? "dark" : "accent"}>{row.coveragePercent}%</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={row.timerEnabled ? "dark" : "default"}>
                        {row.timerEnabled ? "Oui" : "Non"}
                      </Badge>
                      <p className="mt-1 text-xs text-ink-tertiary">{row.durationMinutes} min</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-secondary">
                      <p>Sans explication : {row.quality.missingExplanation}</p>
                      <p className="mt-1">Route : {row.routeOk ? "OK" : "KO"}</p>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-ink-secondary">
                      {formatDistribution(row.quality.correctIndexDistribution)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
