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

export default function ExamAuditPage() {
  const audit = runExamAudit();

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
            Banques OK : {audit.poolsOk}/{audit.totalExams}
          </p>
        </Card>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-border-light">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase text-ink-tertiary">
              <tr>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Questions</th>
                <th className="px-4 py-3">Durée</th>
                <th className="px-4 py-3">Timer</th>
                <th className="px-4 py-3">Route OK</th>
                <th className="px-4 py-3">Banque</th>
              </tr>
            </thead>
            <tbody>
              {audit.rows.map((row) => (
                <tr key={row.routeSlug} className="border-t border-border-light">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-ink">{row.title}</p>
                    <p className="text-xs text-ink-tertiary">/examens/{row.routeSlug}</p>
                    {row.poolWarning && (
                      <p className="mt-1 text-xs text-amber-700">{row.poolWarning}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {row.baseQuestions} / {row.targetQuestions}
                  </td>
                  <td className="px-4 py-3">{row.durationMinutes} min</td>
                  <td className="px-4 py-3">
                    <Badge variant={row.timerEnabled ? "dark" : "default"}>
                      {row.timerEnabled ? "Oui" : "Non"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={row.routeOk ? "dark" : "accent"}>
                      {row.routeOk ? "OK" : "KO"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={row.poolOk ? "dark" : "accent"}>
                      {row.poolOk ? "OK" : "Incomplète"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
