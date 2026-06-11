import Link from "next/link";
import { PageShell } from "@/components/layout";
import { SectionHeading, Badge, Card } from "@/components/ui";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { runExamAudit } from "@/lib/exam/exam-audit";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Audit examens",
  description: "État des routes, timers et banques de questions des examens blancs.",
  path: "/admin/exam-audit",
  noIndex: true,
});

function formatDistribution(dist: Record<number, number>): string {
  return ["A", "B", "C", "D"].map((label, i) => `${label}:${dist[i] ?? 0}`).join(" · ");
}

function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return <Badge variant={ok ? "dark" : "default"}>{label}</Badge>;
}

export default function ExamAuditPage() {
  const audit = runExamAudit();
  const prioritySlugs = new Set(["jamf-100", "apple-security", "intune-apple", "apple-it-professional"]);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
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

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-5">
            <p className="text-sm text-ink-tertiary">Routes OK</p>
            <p className="text-3xl font-bold text-accent">{audit.routesOk}/{audit.totalExams}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-ink-tertiary">Timers OK</p>
            <p className="text-3xl font-bold text-accent">{audit.timersOk}/{audit.totalExams}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-ink-tertiary">Banques complètes</p>
            <p className="text-3xl font-bold text-accent">{audit.poolsComplete}/{audit.totalExams}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-ink-tertiary">Sync Supabase</p>
            <p className="mt-1 text-lg font-bold text-ink">{audit.supabaseSyncAvailable ? "Disponible" : "Non configuré"}</p>
            <p className="text-xs text-ink-tertiary">localStorage actif en fallback</p>
          </Card>
        </div>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-border-light">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase text-ink-tertiary">
              <tr>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Questions</th>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Timer</th>
                <th className="px-4 py-3">Correction</th>
                <th className="px-4 py-3">Historique</th>
                <th className="px-4 py-3">localStorage</th>
                <th className="px-4 py-3">Banque</th>
              </tr>
            </thead>
            <tbody>
              {audit.rows.map((row) => {
                const isPriority = prioritySlugs.has(row.routeSlug);
                return (
                  <tr
                    key={row.routeSlug}
                    className={`border-t border-border-light ${isPriority ? "bg-accent/5" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ink">{row.title}</p>
                      <p className="text-xs text-ink-tertiary">/examens/{row.routeSlug}</p>
                      <p className="mt-1 font-mono text-xs text-ink-tertiary">{row.localStorageKey}</p>
                      {row.poolWarning && (
                        <p className="mt-1 text-xs text-amber-700">{row.poolWarning}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {row.baseQuestions} / {row.targetQuestions}
                      <p className="mt-1 text-xs text-ink-tertiary">{row.durationMinutes} min</p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge ok={row.routeOk} label={row.routeOk ? "OK" : "KO"} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge ok={row.timerOk} label={row.timerOk ? "OK" : "KO"} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge ok={row.correctionOk} label={row.correctionOk ? "OK" : "KO"} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge ok={row.historyOk} label={row.historyOk ? "OK" : "KO"} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge ok={row.localStorageOk} label={row.localStorageOk ? "OK" : "KO"} />
                      <p className="mt-1 text-xs text-ink-tertiary">
                        Supabase : {row.supabaseSyncAvailable ? "oui" : "non"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={row.bankComplete ? "dark" : "accent"}>
                        {row.bankComplete ? "Complète" : "Incomplète"}
                      </Badge>
                      <p className="mt-2 text-xs font-mono text-ink-secondary">
                        {formatDistribution(row.quality.correctIndexDistribution)}
                      </p>
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
