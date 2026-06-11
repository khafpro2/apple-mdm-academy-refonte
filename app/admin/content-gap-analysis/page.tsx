import Link from "next/link";
import { PageShell } from "@/components/layout";
import { SectionHeading, Badge, Card } from "@/components/ui";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { runJamfContentGapAnalysis } from "@/lib/audit/jamf-content-gap-analysis";
import { JAMF_TRAINING_PRIORITY_LABELS } from "@/lib/data/jamf/jamf-training-registry";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Analyse écarts contenu Jamf Training",
  description: "Couverture pédagogique vs chaîne Jamf Training & Support — sans intégration YouTube.",
  path: "/admin/content-gap-analysis",
  noIndex: true,
});

function OkBadge({ ok }: { ok: boolean }) {
  return <Badge variant={ok ? "dark" : "default"}>{ok ? "Oui" : "Non"}</Badge>;
}

export default function ContentGapAnalysisPage() {
  const report = runJamfContentGapAnalysis();

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Admin"
          title="Analyse écarts — Jamf Training"
          description={`Référence : ${report.channelReference} · Généré le ${new Date(report.generatedAt).toLocaleString("fr-FR")} · Contenu original Apple MDM Academy (pas d'intégration YouTube directe).`}
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/admin/content-audit" className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink">
            Audit pédagogique
          </Link>
          <Link href="/admin/exam-audit" className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink">
            Audit examens
          </Link>
          <Link href="/admin" className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink">
            ← Admin
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-5">
            <p className="text-sm text-ink-tertiary">Sujets</p>
            <p className="text-3xl font-bold text-accent">{report.totalTopics}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-ink-tertiary">Sujets couverts (cours)</p>
            <p className="text-3xl font-bold text-accent">{report.coveredCount}/{report.totalTopics}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-ink-tertiary">Livrables incomplets</p>
            <p className="text-3xl font-bold text-amber-700">{report.missingCount}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-ink-tertiary">Pack complet</p>
            <p className="text-3xl font-bold text-accent">{report.fullyCompleteCount}/{report.totalTopics}</p>
          </Card>
        </div>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-border-light">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase text-ink-tertiary">
              <tr>
                <th className="px-3 py-3">Sujet</th>
                <th className="px-3 py-3">Priorité</th>
                <th className="px-3 py-3">Couvert</th>
                <th className="px-3 py-3">Manquant</th>
                <th className="px-3 py-3">Vidéo source</th>
                <th className="px-3 py-3">Cours</th>
                <th className="px-3 py-3">Quiz</th>
                <th className="px-3 py-3">Lab</th>
                <th className="px-3 py-3">Storyboard</th>
                <th className="px-3 py-3">Script HeyGen</th>
                <th className="px-3 py-3">PDF</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {report.rows.map((row) => (
                <tr key={row.topicId} className="border-t border-border-light align-top">
                  <td className="px-3 py-3">
                    <p className="font-semibold text-ink">{row.title}</p>
                    <p className="mt-1 text-xs text-ink-tertiary">{row.videoSlug}</p>
                    <p className="mt-1 text-xs text-ink-tertiary">{row.sourceVideoTitle}</p>
                  </td>
                  <td className="px-3 py-3 text-xs">{JAMF_TRAINING_PRIORITY_LABELS[row.priority as keyof typeof JAMF_TRAINING_PRIORITY_LABELS] ?? row.priority}</td>
                  <td className="px-3 py-3"><OkBadge ok={row.topicCovered} /></td>
                  <td className="px-3 py-3"><OkBadge ok={!row.topicMissing} /></td>
                  <td className="px-3 py-3"><OkBadge ok={row.sourceVideoIdentified} /></td>
                  <td className="px-3 py-3">
                    <OkBadge ok={row.courseCreated} />
                    <p className="mt-1 text-xs text-ink-tertiary">{row.courseLessonCount} leçon(s)</p>
                  </td>
                  <td className="px-3 py-3">
                    <OkBadge ok={row.quizCreated} />
                    <p className="mt-1 text-xs text-ink-tertiary">{row.quizQuestionCount} Q</p>
                  </td>
                  <td className="px-3 py-3"><OkBadge ok={row.labCreated} /></td>
                  <td className="px-3 py-3"><OkBadge ok={row.storyboardCreated} /></td>
                  <td className="px-3 py-3"><OkBadge ok={row.heygenScriptCreated} /></td>
                  <td className="px-3 py-3"><OkBadge ok={row.pdfResourceCreated} /></td>
                  <td className="px-3 py-3">
                    <div className="flex flex-col gap-1 text-xs">
                      <Link href={`/videos#${row.videoSlug}`} className="font-semibold text-accent hover:underline">
                        Vidéo
                      </Link>
                      <Link href={`/quiz/${row.quizSlug}`} className="font-semibold text-accent hover:underline">
                        Quiz
                      </Link>
                      <Link href={`/labs/${row.labSlug}`} className="font-semibold text-accent hover:underline">
                        Lab
                      </Link>
                      <Link href={`/resources/${row.resourceSlug}`} className="font-semibold text-accent hover:underline">
                        PDF
                      </Link>
                      {row.lessonSlugs[0] ? (
                        <Link
                          href={`/cours/${row.courseSlug}/${row.lessonSlugs[0]}`}
                          className="text-ink-secondary hover:text-ink hover:underline"
                        >
                          Leçon
                        </Link>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Card className="mt-8 p-6 text-sm text-ink-secondary">
          <p className="font-semibold text-ink">Priorités d&apos;alignement</p>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>Jamf 100 — Smart Groups, Policies, Configuration Profiles, Self Service, Packages</li>
            <li>Jamf Pro Fundamentals — Inventory, Enrollment</li>
            <li>Jamf 200 — Scripts, Patch Management</li>
          </ol>
          <p className="mt-4">
            Les vidéos de la chaîne{" "}
            <a href={report.channelReference} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent hover:underline">
              Jamf Training &amp; Support
            </a>{" "}
            servent de référence pédagogique. Le contenu livré (résumé FR, script HeyGen, storyboard, quiz, lab, PDF) est original Apple MDM Academy.
          </p>
        </Card>
      </div>
    </PageShell>
  );
}
