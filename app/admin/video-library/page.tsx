import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/ui";
import { VideoLibraryAdminTable } from "@/components/admin/video-library-admin-table";
import { requireAdmin } from "@/lib/supabase/admin";
import { getAllVideoLibraryRecords } from "@/src/lib/video-production";
import { getMp4AvailabilityMap, getMp4UrlMap } from "@/src/lib/video-production.server";
import { getValidScreenshotFiles, getScreenshotInventoryAsync } from "@/src/lib/video-screenshot-inventory.server";

export const metadata = { title: "Bibliothèque vidéo", robots: { index: false, follow: false } };

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
  const mp4Present = Object.values(mp4Map).filter(Boolean).length;
  const readyToPublish = records.filter((r) => r.status === "ready-to-publish").length;

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            label="Admin"
            title="Bibliothèque vidéo LMS"
            description={`${records.length} vidéos · ${published} publiées · ${readyToPublish} prêtes · ${mp4Present} MP4`}
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

        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-border-light bg-surface-elevated p-5">
            <p className="text-sm text-ink-tertiary">Publiées</p>
            <p className="text-3xl font-bold text-ink">{published}</p>
          </div>
          <div className="rounded-2xl border border-border-light bg-surface-elevated p-5">
            <p className="text-sm text-ink-tertiary">Prêtes à publier</p>
            <p className="text-3xl font-bold text-ink">{readyToPublish}</p>
          </div>
          <div className="rounded-2xl border border-border-light bg-surface-elevated p-5">
            <p className="text-sm text-ink-tertiary">Qualité complète</p>
            <p className="text-3xl font-bold text-ink">
              {qualityComplete}/{records.length}
            </p>
          </div>
          <div className="rounded-2xl border border-border-light bg-surface-elevated p-5">
            <p className="text-sm text-ink-tertiary">MP4 présents</p>
            <p className="text-3xl font-bold text-ink">{mp4Present}</p>
          </div>
        </div>

        <VideoLibraryAdminTable
          records={records}
          mp4Map={mp4Map}
          presentScreenshotFiles={[...validFiles]}
        />
      </div>
    </PageShell>
  );
}
