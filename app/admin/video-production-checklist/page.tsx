import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading, Badge, ProgressBar } from "@/components/ui";
import { requireAdmin } from "@/lib/supabase/admin";
import {
  getVideoProductionChecklistReport,
  PILOT_PRODUCTION_ORDER,
  PRODUCTION_CHECKLIST_LABELS,
} from "@/src/lib/video-production-checklist.server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checklist production média vidéos pilotes",
  robots: { index: false, follow: false },
};

const CONTROL_COMMANDS = [
  "npm run check:screenshots",
  "npm run check:mp4",
  "npm run lint",
  "npm run build",
] as const;

function StepIcon({ done }: { done: boolean }) {
  return (
    <span className={done ? "text-green-700" : "text-ink-tertiary"} aria-hidden>
      {done ? "✓" : "□"}
    </span>
  );
}

export default async function VideoProductionChecklistPage() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    redirect(
      auth.reason === "unauthenticated"
        ? "/auth/login?redirect=/admin/video-production-checklist"
        : "/dashboard"
    );
  }

  const report = getVideoProductionChecklistReport();

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            label="Production média"
            title="Checklist des 8 vidéos pilotes"
            description={`MP4 ${report.mp4Present}/${report.mp4Total} · Captures uniques ${report.capturesPresent}/${report.capturesTotal} · ordre de production défini`}
          />
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/video-pipeline/production-packs" className="text-sm font-semibold text-accent hover:underline">
              Production packs →
            </Link>
            <Link href="/admin/media-production-plan" className="text-sm font-semibold text-accent hover:underline">
              Plan médias →
            </Link>
            <Link href="/admin" className="text-sm font-semibold text-accent hover:underline">
              ← Admin
            </Link>
          </div>
        </div>

        <section className="mb-8 rounded-2xl border border-border-light bg-surface-elevated p-6">
          <h2 className="text-lg font-bold text-ink">Ordre de production</h2>
          <ol className="mt-4 flex flex-wrap gap-2">
            {PILOT_PRODUCTION_ORDER.map((slug, i) => {
              const video = report.videos.find((v) => v.slug === slug);
              const published = video?.status === "published";
              return (
                <li
                  key={slug}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    published
                      ? "bg-green-100 text-green-800"
                      : "border border-border-light bg-surface text-ink-secondary"
                  }`}
                >
                  {i + 1}. {video?.title ?? slug}
                </li>
              );
            })}
          </ol>
        </section>

        <section className="mb-8 rounded-2xl border border-border-light bg-surface-elevated p-6">
          <h2 className="text-lg font-bold text-ink">Commandes de contrôle</h2>
          <p className="mt-1 text-sm text-ink-secondary">
            Exécuter localement après chaque vidéo produite, puis avant push sur main.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {CONTROL_COMMANDS.map((cmd) => (
              <code key={cmd} className="rounded-lg bg-surface px-4 py-2 text-sm text-ink-secondary">
                {cmd}
              </code>
            ))}
          </div>
        </section>

        <section className="mb-6 rounded-2xl border border-dashed border-accent/30 bg-accent/5 p-5 text-sm text-ink-secondary">
          <p className="font-semibold text-ink">Checklist par vidéo ({PRODUCTION_CHECKLIST_LABELS.length} étapes)</p>
          <ul className="mt-2 grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTION_CHECKLIST_LABELS.map((label) => (
              <li key={label}>□ {label}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-ink-tertiary">
            Les cases se cochent automatiquement selon les fichiers présents et le statut LMS. Les étapes HeyGen /
            montage se valident via le production pack ou les overrides admin.
          </p>
        </section>

        <div className="space-y-8">
          {report.videos.map((video) => (
            <article
              key={video.slug}
              id={video.slug}
              className="scroll-mt-24 rounded-[2rem] border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">
                    Priorité {video.order} · {video.checklistDone}/{video.checklistSteps.length} étapes
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-ink">{video.title}</h2>
                  <p className="mt-2 text-sm text-ink-secondary">
                    <span className="font-semibold text-ink">Prochaine action :</span> {video.nextAction}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={video.status === "published" ? "accent" : "default"}>{video.statusLabel}</Badge>
                  <p className="mt-2 text-2xl font-bold text-accent">{video.pipelinePercent}%</p>
                </div>
              </div>

              <ProgressBar value={video.pipelinePercent} className="mt-4" />

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl bg-surface p-4 text-sm">
                  <p className="font-semibold text-ink">Fichier MP4 attendu</p>
                  <code className="mt-2 block font-mono text-accent">/public/videos/{video.mp4Filename}</code>
                  <p className="mt-1 text-xs text-ink-tertiary">URL LMS : {video.mp4PublicPath}</p>
                </div>

                <div className="rounded-xl bg-surface p-4 text-sm">
                  <p className="font-semibold text-ink">
                    Captures nécessaires ({video.capturesPresent}/{video.capturesTotal})
                  </p>
                  {video.capturesRequired.length === 0 ? (
                    <p className="mt-2 text-ink-tertiary">Aucune capture cataloguée.</p>
                  ) : (
                    <ul className="mt-2 max-h-32 space-y-1 overflow-y-auto">
                      {video.capturesRequired.map((capture) => (
                        <li key={capture.file} className="flex items-center gap-2 text-xs">
                          <StepIcon done={capture.present} />
                          <code className="font-mono text-ink-secondary">{capture.file}</code>
                          <span className="text-ink-tertiary">{capture.label}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-bold text-ink">Progression production</h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {video.checklistSteps.map((step) => (
                    <li
                      key={step.label}
                      className={`flex items-start gap-2 rounded-lg px-3 py-2 text-sm ${
                        step.done ? "bg-green-50 text-green-900" : "bg-surface text-ink-secondary"
                      }`}
                    >
                      <StepIcon done={step.done} />
                      <span>{step.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/admin/video-pipeline/production-packs#${video.slug}`}
                  className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
                >
                  Production pack
                </Link>
                <Link
                  href={`/videos/${video.slug}`}
                  className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink"
                >
                  Page vidéo
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
