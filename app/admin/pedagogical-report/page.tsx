import Link from "next/link";
import { PageShell } from "@/components/layout";
import { SectionHeading, Card, ProgressBar, Badge } from "@/components/ui";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { runPedagogicalAudit } from "@/lib/audit/pedagogical-audit";
import { buildPedagogicalReport } from "@/lib/audit/pedagogical-report";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Rapport pédagogique",
  description: "Forces, faiblesses, modules incomplets et recommandations avant nouvelles fonctionnalités.",
  path: "/admin/pedagogical-report",
  noIndex: true,
});

export default function PedagogicalReportPage() {
  const audit = runPedagogicalAudit();
  const report = buildPedagogicalReport(audit);

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Admin"
          title="Rapport pédagogique"
          description="Synthèse qualitative avant extension fonctionnelle — objectif 95/100 par axe."
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/admin/content-audit" className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-accent hover:underline">
            Audit contenu détaillé →
          </Link>
          <Link href="/admin" className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink">
            ← Admin
          </Link>
        </div>

        <Card className="mt-8">
          <h3 className="text-lg font-bold text-ink">Objectifs qualité</h3>
          <ul className="mt-4 space-y-4">
            {report.targets.map((t) => (
              <li key={t.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-ink">{t.label}</span>
                  <span className={t.met ? "text-emerald-700" : "text-amber-700"}>
                    {t.current}/100 → cible {t.target}
                    {t.met ? " ✓" : ""}
                  </span>
                </div>
                <ProgressBar value={t.current} className="h-2" />
              </li>
            ))}
          </ul>
        </Card>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="text-lg font-bold text-emerald-800">Forces</h3>
            <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-ink-secondary">
              {report.strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3 className="text-lg font-bold text-amber-800">Faiblesses</h3>
            <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-ink-secondary">
              {report.weaknesses.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </Card>
        </div>

        <Card className="mt-8">
          <h3 className="text-lg font-bold text-ink">Recommandations prioritaires</h3>
          <ol className="mt-4 list-inside list-decimal space-y-2 text-sm text-ink-secondary">
            {report.recommendations.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ol>
        </Card>

        {report.blockers.length > 0 && (
          <Card className="mt-8 border-amber-200 bg-amber-50">
            <h3 className="text-lg font-bold text-amber-900">Bloquants restants</h3>
            <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-amber-950">
              {report.blockers.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </Card>
        )}

        <Card className="mt-8">
          <h3 className="text-lg font-bold text-ink">Modules incomplets (leçons)</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {report.incompleteLessons.map((l) => (
              <li key={l.id} className="flex justify-between rounded-lg bg-surface px-3 py-2">
                <span className="font-medium text-ink">{l.title}</span>
                <span>
                  <Badge variant="default">{l.status}</Badge> {l.score}/100
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="mt-8">
          <h3 className="text-lg font-bold text-ink">Labs incomplets</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {report.incompleteLabs.map((l) => (
              <li key={l.id} className="flex justify-between rounded-lg bg-surface px-3 py-2">
                <span className="font-medium text-ink">{l.title}</span>
                <span>
                  <Badge variant="default">{l.status}</Badge> {l.score}/100
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </PageShell>
  );
}
