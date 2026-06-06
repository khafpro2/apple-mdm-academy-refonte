import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading, Badge, ProgressBar } from "@/components/ui";
import { requireAdmin } from "@/lib/supabase/admin";
import {
  getOfficialVideoProductionRecords,
  getProductionStatusLabel,
  getPipelineStages,
  PIPELINE_CRITERIA_LABELS,
  MANUAL_PIPELINE_ACTIONS,
  PIPELINE_ADMIN_COMMANDS,
  OFFICIAL_LMS_VIDEOS,
  getNextPipelineAction,
} from "@/src/lib/video-production";
import { getMp4AvailabilityMap, getMp4UrlMap } from "@/src/lib/video-production.server";
import { getValidScreenshotFiles, getScreenshotInventoryAsync } from "@/src/lib/video-screenshot-inventory.server";
import { VideoPipelineExportButton } from "@/components/admin/video-pipeline-export-button";

export const metadata = { title: "Pipeline vidéo", robots: { index: false, follow: false } };

function CriterionCell({ ok, label, weight }: { ok: boolean; label: string; weight: number }) {
  return (
    <div
      className={`rounded-xl border p-3 text-center text-xs ${
        ok ? "border-green-200 bg-green-50 text-green-800" : "border-border-light bg-surface text-ink-tertiary"
      }`}
    >
      <p className="font-semibold">{label}</p>
      <p className="mt-0.5 text-[10px] opacity-80">{weight} %</p>
      <p className="mt-1 text-sm">{ok ? "✓" : "—"}</p>
    </div>
  );
}

export default async function VideoPipelineAdminPage() {
  const auth = await requireAdmin();
  if (!auth.ok) redirect(auth.reason === "unauthenticated" ? "/auth/login?redirect=/admin/video-pipeline" : "/dashboard");

  const inventory = await getScreenshotInventoryAsync();
  const validFiles = getValidScreenshotFiles(inventory);
  const mp4Map = getMp4AvailabilityMap();
  const mp4UrlMap = getMp4UrlMap();
  const records = getOfficialVideoProductionRecords({
    presentScreenshotFiles: validFiles,
    mp4AvailableBySlug: mp4Map,
    mp4UrlBySlug: mp4UrlMap,
  });

  const avgPercent = Math.round(records.reduce((s, r) => s + r.pipelinePercent, 0) / records.length);
  const publishedCount = records.filter((r) => r.status === "published").length;
  const qualityComplete = records.filter((r) => r.quality.complete).length;

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            label="Publication LMS"
            title="Pipeline vidéo officiel"
            description={`${OFFICIAL_LMS_VIDEOS.length} vidéos · ${publishedCount} publiées · ${qualityComplete} qualité 100 % · ${avgPercent} % progression moyenne`}
          />
          <div className="flex flex-wrap items-center gap-3">
            <VideoPipelineExportButton records={records} presentScreenshotFiles={[...validFiles]} />
            <Link href="/admin/video-pipeline/production-packs" className="text-sm font-semibold text-accent hover:underline">
              Production packs →
            </Link>
            <Link href="/admin/video-library" className="text-sm font-semibold text-accent hover:underline">
              Bibliothèque →
            </Link>
            <Link href="/admin/video-production" className="text-sm font-semibold text-accent hover:underline">
              Captures →
            </Link>
            <Link href="/admin" className="text-sm font-semibold text-accent hover:underline">
              ← Admin
            </Link>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Progression moyenne" value={`${avgPercent} %`} highlight />
          <StatCard label="Publiées" value={`${publishedCount}/${records.length}`} />
          <StatCard label="Qualité 100 %" value={`${qualityComplete}/${records.length}`} />
          <StatCard label="Captures OK" value={`${validFiles.size}/29`} />
        </div>

        <section className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-lg font-bold text-ink">Actions manuelles restantes</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-ink-secondary">
            {MANUAL_PIPELINE_ACTIONS.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ol>
        </section>

        <section className="mb-8 rounded-2xl border border-border-light bg-surface-elevated p-6">
          <h2 className="text-lg font-bold text-ink">Commandes utiles</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {PIPELINE_ADMIN_COMMANDS.map((cmd) => (
              <code key={cmd} className="rounded-lg bg-surface px-3 py-2 text-xs text-ink-secondary">
                {cmd}
              </code>
            ))}
          </div>
        </section>

        <div className="space-y-6">
          {records.map((record) => {
            const stages = getPipelineStages(record.score, record.canPublish);
            return (
              <article
                key={record.slug}
                className="rounded-2xl border border-border-light bg-surface-elevated p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase text-ink-tertiary">
                      Priorité {record.priority} · {record.module}
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-ink">
                      <Link href={`/videos/${record.slug}`} className="hover:text-accent">
                        {record.title}
                      </Link>
                    </h2>
                    <p className="mt-1 text-sm text-ink-secondary">
                      MP4 : {record.mp4Candidates.join(" · ")} · {record.durationLabel}
                    </p>
                    {record.resourceSlug && (
                      <Link
                        href={`/resources/${record.resourceSlug}`}
                        className="mt-1 inline-block text-sm font-medium text-accent hover:underline"
                      >
                        Ressource : {record.resourceSlug} →
                      </Link>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge variant={record.status === "published" ? "accent" : "default"}>
                      {getProductionStatusLabel(record.status)}
                    </Badge>
                    <p className="mt-2 text-2xl font-bold text-accent">{record.pipelinePercent}%</p>
                  </div>
                </div>

                <ProgressBar value={record.pipelinePercent} className="mt-4" />

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                  {PIPELINE_CRITERIA_LABELS.map(({ key, label, weight }) => (
                    <CriterionCell key={key} ok={record.score[key]} label={label} weight={weight} />
                  ))}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {stages.map((stage) => (
                    <div
                      key={stage.id}
                      className={`rounded-xl border p-2 text-center text-[10px] ${
                        stage.complete
                          ? "border-green-200 bg-green-50 text-green-800"
                          : "border-border-light bg-surface text-ink-tertiary"
                      }`}
                    >
                      {stage.label} {stage.complete ? "✓" : "—"}
                    </div>
                  ))}
                </div>

                {!record.canPublish && record.publishBlockers.length > 0 && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
                    <p className="font-semibold">Publication impossible — éléments manquants</p>
                    <ul className="mt-2 list-disc pl-5">
                      {record.publishBlockers.map((b) => (
                        <li key={b.id}>{b.label}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="mt-4 text-sm text-ink-secondary">
                  <span className="font-semibold text-ink">Prochaine action :</span>{" "}
                  {getNextPipelineAction(record, { presentScreenshotFiles: validFiles })}
                </p>

                <div className="mt-4 flex flex-wrap gap-4 text-xs text-ink-secondary">
                  <span>Quiz : {record.quizSlug}</span>
                  <span>Lab : {record.labSlug}</span>
                  <span>Certif : {record.certificationLabel}</span>
                  <Link href={`/transcripts#${record.slug}`} className="font-semibold text-accent hover:underline">
                    Transcript →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}

function StatCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${highlight ? "border-accent/30 bg-accent/5" : "border-border-light bg-surface-elevated"}`}
    >
      <p className="text-sm text-ink-tertiary">{label}</p>
      <p className="mt-1 text-3xl font-bold text-ink">{value}</p>
      {sub && <p className="mt-1 text-xs text-ink-tertiary">{sub}</p>}
    </div>
  );
}
