import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading, Badge, ProgressBar } from "@/components/ui";
import { requireAdmin } from "@/lib/supabase/admin";
import {
  getOfficialVideoProductionRecords,
  getProductionStatusLabel,
  getPipelineStages,
  PIPELINE_STAGES,
  OFFICIAL_LMS_VIDEOS,
} from "@/src/lib/video-production";
import { getMp4AvailabilityMap } from "@/src/lib/video-production.server";
import { getValidScreenshotFiles, getScreenshotInventoryAsync } from "@/src/lib/video-screenshot-inventory.server";

export const metadata = { title: "Pipeline vidéo", robots: { index: false, follow: false } };

export default async function VideoPipelineAdminPage() {
  const auth = await requireAdmin();
  if (!auth.ok) redirect(auth.reason === "unauthenticated" ? "/auth/login?redirect=/admin/video-pipeline" : "/dashboard");

  const inventory = await getScreenshotInventoryAsync();
  const validFiles = getValidScreenshotFiles(inventory);
  const mp4Map = getMp4AvailabilityMap();
  const records = getOfficialVideoProductionRecords({
    presentScreenshotFiles: validFiles,
    mp4AvailableBySlug: mp4Map,
  });

  const avgPercent = Math.round(records.reduce((s, r) => s + r.pipelinePercent, 0) / records.length);
  const publishedCount = records.filter((r) => r.status === "published").length;

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            label="Publication LMS"
            title="Pipeline vidéo officiel"
            description={`${OFFICIAL_LMS_VIDEOS.length} vidéos prioritaires · ${publishedCount} publiées · ${avgPercent} % progression moyenne`}
          />
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/video-library" className="text-sm font-semibold text-accent hover:underline">
              Bibliothèque vidéo →
            </Link>
            <Link href="/admin/video-production" className="text-sm font-semibold text-accent hover:underline">
              Captures →
            </Link>
            <Link href="/admin" className="text-sm font-semibold text-accent hover:underline">
              ← Admin
            </Link>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-border-light bg-surface-elevated p-6">
          <p className="text-sm font-semibold text-ink">Étapes du pipeline</p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-ink-secondary">
            {PIPELINE_STAGES.map((stage, i) => (
              <span key={stage.id} className="flex items-center gap-2">
                {i > 0 && <span className="text-ink-tertiary">↓</span>}
                <span className="rounded-full border border-border-light px-3 py-1">{stage.label}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {records.map((record) => {
            const stages = getPipelineStages(record.flags, mp4Map[record.slug] ?? false);
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
                  </div>
                  <div className="text-right">
                    <Badge variant={record.status === "published" ? "accent" : "default"}>
                      {getProductionStatusLabel(record.status)}
                    </Badge>
                    <p className="mt-2 text-2xl font-bold text-accent">{record.pipelinePercent}%</p>
                  </div>
                </div>

                <ProgressBar value={record.pipelinePercent} className="mt-4" />

                <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {stages.map((stage) => (
                    <div
                      key={stage.id}
                      className={`rounded-xl border p-3 text-center text-xs ${
                        stage.complete
                          ? "border-green-200 bg-green-50 text-green-800"
                          : "border-border-light bg-surface text-ink-tertiary"
                      }`}
                    >
                      <p className="font-semibold">{stage.label}</p>
                      <p className="mt-1">{stage.complete ? "✓" : "—"}</p>
                    </div>
                  ))}
                </div>

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
