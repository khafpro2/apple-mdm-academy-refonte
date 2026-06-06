import Link from "next/link";
import { PageShell } from "@/components/layout";
import { SectionHeading, Card, ProgressBar, Badge } from "@/components/ui";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { runPedagogicalAudit } from "@/lib/audit/pedagogical-audit";
import type { ContentCompleteness } from "@/lib/audit/content-status";

export const metadata = buildPageMetadata({
  title: "Audit contenu pédagogique",
  description: "Tableau de bord qualité — cours, labs, examens, vidéos, ressources et captures.",
  path: "/admin/content-audit",
  noIndex: true,
});

const STATUS_VARIANT: Record<ContentCompleteness, "accent" | "dark" | "default"> = {
  complet: "dark",
  "partiellement complet": "accent",
  "à améliorer": "default",
  placeholder: "default",
  vide: "default",
};

function StatusBadge({ status }: { status: ContentCompleteness }) {
  return <Badge variant={STATUS_VARIANT[status]}>{status}</Badge>;
}

export default function ContentAuditPage() {
  const audit = runPedagogicalAudit();

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Admin"
          title="Audit pédagogique — contenu"
          description={`Généré le ${new Date(audit.generatedAt).toLocaleString("fr-FR")}`}
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/admin/pedagogical-report" className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-accent hover:underline">
            Rapport pédagogique →
          </Link>
          <Link href="/admin/quiz-quality" className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink">
            Audit QCM
          </Link>
          <Link href="/admin" className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink">
            ← Admin
          </Link>
        </div>

        <Card className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm text-ink-tertiary">Score qualité global</p>
              <p className="text-4xl font-bold text-accent">{audit.scores.global}/100</p>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-4">
              <span>{audit.counts.modules} modules</span>
              <span>{audit.counts.lessons} leçons</span>
              <span>{audit.counts.labs} labs</span>
              <span>{audit.counts.videos} vidéos</span>
              <span>{audit.counts.quizzes} quiz</span>
              <span>{audit.counts.questions} questions</span>
              <span>{audit.counts.resources} ressources</span>
              <span>{audit.counts.exams} examens</span>
            </div>
          </div>
          <ProgressBar value={audit.scores.global} className="mt-6" />
        </Card>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              ["Leçons", audit.scores.lessons],
              ["Labs", audit.scores.labs],
              ["Examens", audit.scores.exams],
              ["Vidéos", audit.scores.videos],
              ["Ressources", audit.scores.resources],
              ["Certifications", audit.scores.certifications],
              ["Captures", audit.scores.screenshots],
            ] as const
          ).map(([label, score]) => (
            <Card key={label} className="p-4">
              <p className="text-xs font-semibold uppercase text-ink-tertiary">{label}</p>
              <p className="mt-1 text-2xl font-bold text-ink">{score}/100</p>
              <ProgressBar value={score} className="mt-2" />
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <h3 className="text-lg font-bold text-ink">Leçons — répartition</h3>
          <dl className="mt-4 grid gap-3 sm:grid-cols-5">
            {Object.entries(audit.lessonStatusCounts).map(([status, count]) => (
              <div key={status}>
                <dt className="text-xs capitalize text-ink-tertiary">{status}</dt>
                <dd className="text-xl font-bold text-ink">{count}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card className="mt-8">
          <h3 className="text-lg font-bold text-ink">Captures d&apos;écran</h3>
          <p className="mt-2 text-sm text-ink-secondary">
            {audit.screenshots.present} présentes · {audit.screenshots.missing} manquantes ·{" "}
            {audit.screenshots.placeholderPaths} chemins placeholder
          </p>
          <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto text-sm">
            {audit.screenshots.entries
              .filter((e) => !e.exists || e.isPlaceholderPath)
              .slice(0, 20)
              .map((e) => (
                <li key={e.src} className="rounded-lg bg-amber-50 px-3 py-2 text-amber-950">
                  <span className="font-medium">Capture à ajouter</span> — {e.title}
                  <span className="block font-mono text-xs opacity-70">{e.src}</span>
                </li>
              ))}
          </ul>
        </Card>

        <Card className="mt-8">
          <h3 className="text-lg font-bold text-ink">Leçons à améliorer (top 15)</h3>
          <ul className="mt-4 divide-y divide-border-light">
            {audit.lessons
              .filter((l) => l.status !== "complet")
              .sort((a, b) => a.score - b.score)
              .slice(0, 15)
              .map((l) => (
                <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                  <span className="font-medium text-ink">{l.title}</span>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={l.status} />
                    <span className="text-ink-tertiary">{l.score}/100</span>
                  </div>
                </li>
              ))}
          </ul>
        </Card>

        <Card className="mt-8">
          <h3 className="text-lg font-bold text-ink">Certifications cibles</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-light text-left text-ink-tertiary">
                  <th className="py-2 pr-4">Certification</th>
                  <th className="py-2 pr-4">Modules</th>
                  <th className="py-2 pr-4">Labs</th>
                  <th className="py-2 pr-4">Examens</th>
                  <th className="py-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {audit.certifications.map((c) => (
                  <tr key={c.slug} className="border-b border-border-light">
                    <td className="py-3 pr-4 font-medium text-ink">{c.title}</td>
                    <td className="py-3 pr-4">{c.modulesLinked}</td>
                    <td className="py-3 pr-4">{c.labsLinked}</td>
                    <td className="py-3 pr-4">{c.examsLinked}</td>
                    <td className="py-3">
                      <StatusBadge status={c.status} /> {c.score}/100
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
