import Link from "next/link";
import { PageShell } from "@/components/layout";
import { SectionHeading, Card, ProgressBar, Badge } from "@/components/ui";
import { getFinalAuditItems, getFinalAuditScore, getProjectScores } from "@/lib/audit/final-audit";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Audit final",
  description: "Audit de lancement commercial — vérification Auth, Supabase, contenu, SEO et enterprise.",
  path: "/admin/final-audit",
  noIndex: true,
});

export default function FinalAuditPage() {
  const items = getFinalAuditItems();
  const score = getFinalAuditScore();
  const scores = getProjectScores();
  const categories = [...new Set(items.map((i) => i.category))];

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Admin"
          title="Audit final — Lancement commercial"
          description="Vérification complète avant mise en production SaaS."
        />
        <Card className="mt-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink-secondary">Avancement global</p>
              <p className="text-4xl font-bold text-ink">{score.percent}%</p>
              <p className="text-sm text-ink-tertiary">{score.done}/{score.total} critères validés</p>
            </div>
            <ProgressBar value={score.percent} className="w-48" />
          </div>
        </Card>
        {categories.map((cat) => (
          <div key={cat} className="mt-10">
            <h2 className="text-lg font-bold text-ink">{cat}</h2>
            <div className="mt-4 space-y-2">
              {items.filter((i) => i.category === cat).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-border-light bg-surface-elevated px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className={item.done ? "text-emerald-600" : "text-amber-500"}>
                      {item.done ? "✓" : "○"}
                    </span>
                    <div>
                      <p className="font-medium text-ink">{item.label}</p>
                      <p className="text-xs text-ink-tertiary">{item.detail}</p>
                    </div>
                  </div>
                  <Badge variant={item.done ? "accent" : "default"}>{item.done ? "OK" : "À vérifier"}</Badge>
                </div>
              ))}
            </div>
          </div>
        ))}
        <Card className="mt-12">
          <h3 className="font-bold text-ink">Scores projet /100</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {Object.entries(scores)
              .filter(([k]) => k !== "global")
              .map(([key, val]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-ink-secondary">{key}</span>
                  <span className="font-bold text-ink">{val}</span>
                </div>
              ))}
          </div>
          <p className="mt-6 border-t border-border-light pt-4 text-center text-2xl font-bold text-ink">
            Score global : {scores.global}/100
          </p>
        </Card>
        <p className="mt-8 text-center">
          <Link href="/admin" className="text-sm text-accent hover:underline">← Retour admin</Link>
        </p>
      </div>
    </PageShell>
  );
}
