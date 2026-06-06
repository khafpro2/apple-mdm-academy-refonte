import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading, Badge, ProgressBar } from "@/components/ui";
import { requireAdmin } from "@/lib/supabase/admin";
import {
  getAllVideoLibraryRecords,
  getProductionStatusLabel,
} from "@/src/lib/video-production";
import { getMp4AvailabilityMap, getMp4UrlMap } from "@/src/lib/video-production.server";
import { getValidScreenshotFiles, getScreenshotInventoryAsync } from "@/src/lib/video-screenshot-inventory.server";

export const metadata = { title: "Bibliothèque vidéo", robots: { index: false, follow: false } };

function QualityBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold ${
        ok ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
      }`}
    >
      {ok ? "✓" : "○"} {label}
    </span>
  );
}

export default async function VideoLibraryAdminPage() {
  const auth = await requireAdmin();
  if (!auth.ok) redirect(auth.reason === "unauthenticated" ? "/auth/login?redirect=/admin/video-library" : "/dashboard");

  const inventory = await getScreenshotInventoryAsync();
  const validFiles = getValidScreenshotFiles(inventory);
  const mp4Map = getMp4AvailabilityMap();
  const mp4UrlMap = getMp4UrlMap();
  const records = getAllVideoLibraryRecords({
    presentScreenshotFiles: validFiles,
    mp4AvailableBySlug: mp4Map,
    mp4UrlBySlug: mp4UrlMap,
  });

  const qualityComplete = records.filter((r) => r.quality.complete).length;
  const published = records.filter((r) => r.status === "published").length;

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            label="Admin"
            title="Bibliothèque vidéo LMS"
            description={`${records.length} vidéos · ${published} publiées · ${qualityComplete} qualité 100 %`}
          />
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/video-pipeline" className="text-sm font-semibold text-accent hover:underline">
              Pipeline →
            </Link>
            <Link href="/transcripts" className="text-sm font-semibold text-accent hover:underline">
              Transcripts →
            </Link>
            <Link href="/admin" className="text-sm font-semibold text-accent hover:underline">
              ← Admin
            </Link>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border-light bg-surface-elevated p-5">
            <p className="text-sm text-ink-tertiary">Publiées</p>
            <p className="text-3xl font-bold text-ink">{published}</p>
          </div>
          <div className="rounded-2xl border border-border-light bg-surface-elevated p-5">
            <p className="text-sm text-ink-tertiary">Qualité complète</p>
            <p className="text-3xl font-bold text-ink">{qualityComplete}/{records.length}</p>
          </div>
          <div className="rounded-2xl border border-border-light bg-surface-elevated p-5">
            <p className="text-sm text-ink-tertiary">Captures OK</p>
            <p className="text-3xl font-bold text-ink">{validFiles.size}</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border-light bg-surface-elevated">
          <table className="w-full min-w-[960px] text-sm">
            <thead>
              <tr className="border-b border-border-light text-left text-xs text-ink-tertiary">
                <th className="p-4">Vidéo</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Durée</th>
                <th className="p-4">Production</th>
                <th className="p-4">Qualité</th>
                <th className="p-4">Liens</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.slug} className="border-b border-border-light last:border-0">
                  <td className="p-4">
                    <Link href={`/videos/${r.slug}`} className="font-semibold text-ink hover:text-accent">
                      {r.title}
                    </Link>
                    <p className="text-xs text-ink-tertiary">{r.module}</p>
                  </td>
                  <td className="p-4">
                    <Badge variant={r.status === "published" ? "accent" : "default"}>
                      {getProductionStatusLabel(r.status)}
                    </Badge>
                  </td>
                  <td className="p-4 text-ink-secondary">{r.durationLabel}</td>
                  <td className="p-4">
                    <ProgressBar value={r.pipelinePercent} className="w-24" />
                    <p className="mt-1 text-xs text-ink-tertiary">{r.pipelinePercent}%</p>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      <QualityBadge ok={r.quality.storyboard} label="SB" />
                      <QualityBadge ok={r.quality.transcript} label="TR" />
                      <QualityBadge ok={r.quality.quiz} label="QZ" />
                      <QualityBadge ok={r.quality.lab} label="LB" />
                      <QualityBadge ok={r.quality.resource} label="RS" />
                      <QualityBadge ok={r.quality.certification} label="CF" />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1 text-xs">
                      <Link href={`/transcripts#${r.slug}`} className="text-accent hover:underline">
                        Transcript
                      </Link>
                      <Link href={`/admin/video-production`} className="text-accent hover:underline">
                        Captures
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
