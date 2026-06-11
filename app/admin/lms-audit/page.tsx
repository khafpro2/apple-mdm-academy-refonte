import Link from "next/link";
import { PageShell } from "@/components/layout";
import { SectionHeading, Card, ProgressBar, Badge } from "@/components/ui";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { runLmsAudit, type LmsModuleStatus } from "@/lib/audit/lms-audit";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Audit LMS Apple Platform Deployment",
  description: "Score LMS global, modules terminés, quiz, examens, labs et ressources.",
  path: "/admin/lms-audit",
  noIndex: true,
});

const STATUS_VARIANT: Record<LmsModuleStatus, "accent" | "dark" | "default"> = {
  complet: "dark",
  partiel: "accent",
  incomplet: "default",
};

export default function LmsAuditPage() {
  const audit = runLmsAudit();

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Admin"
          title="Audit LMS — Apple Platform Deployment"
          description={`Généré le ${new Date(audit.generatedAt).toLocaleString("fr-FR")} — 10 modules enterprise`}
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/admin/content-audit"
            className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink"
          >
            Audit pédagogique
          </Link>
          <Link
            href="/admin"
            className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink"
          >
            ← Admin
          </Link>
        </div>

        <Card className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm text-ink-tertiary">Score LMS global</p>
              <p className="text-4xl font-bold text-accent">{audit.globalScore}/100</p>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
              <span className="text-green-700">✓ {audit.modulesComplete} modules complets</span>
              <span className="text-amber-700">◐ {audit.modulesPartial} partiels</span>
              <span className="text-red-700">✗ {audit.modulesIncomplete} incomplets</span>
              <span>{audit.totals.quizzes} quiz</span>
              <span>{audit.totals.exams} examens</span>
              <span>{audit.totals.labs} labs</span>
              <span>{audit.totals.resources} ressources</span>
              <span>{audit.totals.platformTopicsEnriched} topics Apple enrichis</span>
            </div>
          </div>
          <ProgressBar value={audit.globalScore} className="mt-6" />
        </Card>

        {audit.blockers.length > 0 && (
          <Card className="mt-6 border-red-200 bg-red-50/50">
            <h3 className="font-semibold text-red-800">Bloquants restants</h3>
            <ul className="mt-2 list-inside list-disc text-sm text-red-700">
              {audit.blockers.slice(0, 8).map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </Card>
        )}

        <div className="mt-10 space-y-4">
          {audit.modules.map((mod) => (
            <Card key={mod.id} className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-ink">{mod.title}</h3>
                  <p className="text-sm text-ink-tertiary">{mod.id}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{mod.score}/100</span>
                  <Badge variant={STATUS_VARIANT[mod.status]}>{mod.status}</Badge>
                </div>
              </div>
              <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-5">
                <span>
                  Leçons {mod.lessons.found}/{mod.lessons.required}
                </span>
                <span>
                  Labs {mod.labs.found}/{mod.labs.required}
                </span>
                <span>
                  Quiz {mod.quizzes.found}/{mod.quizzes.required}
                </span>
                <span>
                  Examens {mod.exams.found}/{mod.exams.required}
                </span>
                <span>
                  Ressources {mod.resources.found}/{mod.resources.required}
                </span>
              </div>
              {mod.gaps.length > 0 && (
                <ul className="mt-3 list-inside list-disc text-xs text-ink-tertiary">
                  {mod.gaps.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
