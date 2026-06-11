import Link from "next/link";
import { JamfLogo } from "@/components/brands/JamfLogo";
import { PageShell } from "@/components/layout";
import { SectionHeading, Badge, Card } from "@/components/ui";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { runJamfContentStatusAudit } from "@/lib/audit/jamf-content-status";
import type { JamfContentStatus } from "@/lib/data/jamf/jamf-fundamentals-premium";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Statut contenu Jamf Premium",
  description: "Suivi parcours Jamf Fundamentals Premium — cours, quiz, labs, scripts, storyboards, captures, vidéos.",
  path: "/admin/jamf-content-status",
  noIndex: true,
});

const STATUS_LABEL: Record<JamfContentStatus, string> = {
  todo: "À faire",
  "in-progress": "En cours",
  done: "Terminé",
};

const STATUS_VARIANT: Record<JamfContentStatus, "default" | "accent" | "dark"> = {
  todo: "default",
  "in-progress": "accent",
  done: "dark",
};

function StatusBadge({ status }: { status: JamfContentStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>;
}

export default function JamfContentStatusPage() {
  const report = runJamfContentStatusAudit();

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Admin — Jamf Premium Academy"
          title="Statut contenu Jamf Fundamentals"
          description={`Parcours 15 modules · Généré le ${new Date(report.generatedAt).toLocaleString("fr-FR")}`}
        />

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <JamfLogo variant="full" size={28} alt="Jamf" />
          <Link href="/admin/content-gap-analysis" className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink">
            Analyse écarts Jamf Training
          </Link>
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

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card className="p-5">
            <p className="text-sm text-ink-tertiary">Modules</p>
            <p className="text-3xl font-bold text-accent">{report.totalModules}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-ink-tertiary">Terminés</p>
            <p className="text-3xl font-bold text-accent">{report.doneCount}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-ink-tertiary">En cours</p>
            <p className="text-3xl font-bold text-amber-700">{report.inProgressCount}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-ink-tertiary">Préparation Jamf 100</p>
            <p className="text-3xl font-bold text-accent">{report.jamf100Readiness}/100</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-ink-tertiary">Préparation Jamf 200</p>
            <p className="text-3xl font-bold text-accent">{report.jamf200Readiness}/100</p>
          </Card>
        </div>

        <Card className="mt-8 p-6">
          <p className="font-semibold text-ink">Vidéos pilotes Jamf</p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase text-ink-tertiary">
                <tr>
                  <th className="px-3 py-2">Vidéo</th>
                  <th className="px-3 py-2">Script HeyGen</th>
                  <th className="px-3 py-2">Storyboard</th>
                  <th className="px-3 py-2">Quiz</th>
                </tr>
              </thead>
              <tbody>
                {report.pilotVideos.map((v) => (
                  <tr key={v.slug} className="border-t border-border-light">
                    <td className="px-3 py-2">
                      <Link href={`/videos/${v.slug}`} className="font-semibold text-accent hover:underline">
                        {v.slug}
                      </Link>
                    </td>
                    <td className="px-3 py-2"><StatusBadge status={v.script} /></td>
                    <td className="px-3 py-2"><StatusBadge status={v.storyboard} /></td>
                    <td className="px-3 py-2"><StatusBadge status={v.quiz} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-border-light">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase text-ink-tertiary">
              <tr>
                <th className="px-3 py-3">#</th>
                <th className="px-3 py-3">Module</th>
                <th className="px-3 py-3">Cours</th>
                <th className="px-3 py-3">Quiz</th>
                <th className="px-3 py-3">Lab</th>
                <th className="px-3 py-3">Script</th>
                <th className="px-3 py-3">Storyboard</th>
                <th className="px-3 py-3">Capture</th>
                <th className="px-3 py-3">Vidéo</th>
                <th className="px-3 py-3">PDF</th>
                <th className="px-3 py-3">Global</th>
              </tr>
            </thead>
            <tbody>
              {report.rows.map((row) => (
                <tr key={row.moduleId} className="border-t border-border-light align-top">
                  <td className="px-3 py-3 text-ink-tertiary">{row.order}</td>
                  <td className="px-3 py-3">
                    <p className="font-semibold text-ink">{row.title}</p>
                    <Link href={`/cours/jamf-fundamentals/${row.lessonSlug}`} className="mt-1 block text-xs text-accent hover:underline">
                      {row.lessonSlug}
                    </Link>
                  </td>
                  <td className="px-3 py-3"><StatusBadge status={row.courseStatus} /></td>
                  <td className="px-3 py-3">
                    <StatusBadge status={row.quizStatus} />
                    <p className="mt-1 text-xs text-ink-tertiary">{row.quizQuestionCount} Q</p>
                  </td>
                  <td className="px-3 py-3"><StatusBadge status={row.labStatus} /></td>
                  <td className="px-3 py-3"><StatusBadge status={row.scriptStatus} /></td>
                  <td className="px-3 py-3"><StatusBadge status={row.storyboardStatus} /></td>
                  <td className="px-3 py-3"><StatusBadge status={row.screenshotStatus} /></td>
                  <td className="px-3 py-3"><StatusBadge status={row.videoStatus} /></td>
                  <td className="px-3 py-3"><StatusBadge status={row.pdfStatus} /></td>
                  <td className="px-3 py-3"><StatusBadge status={row.overallStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Card className="mt-8 p-6 text-sm text-ink-secondary">
          <p className="font-semibold text-ink">Légende qualité</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>Objectif préparation Jamf 100 / 200 : 95+/100</li>
            <li>Captures placeholder dans <code className="text-xs">public/video-assets/screenshots/</code> — production Screen Studio requise</li>
            <li>MP4 HeyGen : pipeline production vidéo</li>
          </ul>
        </Card>
      </div>
    </PageShell>
  );
}
