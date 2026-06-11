import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/ui";
import { requireAdmin } from "@/lib/supabase/admin";
import { getAllProductionPacks } from "@/src/lib/video-production-pack";
import { getMp4AvailabilityMap, getMp4UrlMap } from "@/src/lib/video-production.server";
import { getValidScreenshotFiles, getScreenshotInventoryAsync } from "@/src/lib/video-screenshot-inventory.server";
import { ProductionPackPanel } from "@/components/admin/production-pack-panel";
import { OFFICIAL_LMS_VIDEOS } from "@/src/lib/video-production";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Production packs HeyGen + Screen Studio",
  robots: { index: false, follow: false },
};

export default async function ProductionPacksAdminPage() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    redirect(
      auth.reason === "unauthenticated"
        ? "/auth/login?redirect=/admin/video-pipeline/production-packs"
        : "/dashboard"
    );
  }

  const inventory = await getScreenshotInventoryAsync();
  const validFiles = getValidScreenshotFiles(inventory);
  const mp4Map = getMp4AvailabilityMap();
  const mp4UrlMap = getMp4UrlMap();
  const packs = getAllProductionPacks({
    presentScreenshotFiles: validFiles,
    mp4AvailableBySlug: mp4Map,
    mp4UrlBySlug: mp4UrlMap,
  });

  const avgPercent = Math.round(packs.reduce((s, p) => s + p.record.pipelinePercent, 0) / Math.max(packs.length, 1));

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            label="Production HeyGen + Screen Studio"
            title="Packs de production vidéo"
            description={`${packs.length} vidéos prioritaires · ${avgPercent} % progression moyenne · scripts, captures, montage`}
          />
          <div className="flex flex-wrap gap-3">
            <Link
              href="/resources/heygen-screen-studio-workflow"
              className="text-sm font-semibold text-accent hover:underline"
            >
              Guide workflow →
            </Link>
            <Link href="/admin/video-pipeline" className="text-sm font-semibold text-accent hover:underline">
              ← Pipeline
            </Link>
          </div>
        </div>

        <nav className="mb-8 flex flex-wrap gap-2">
          {OFFICIAL_LMS_VIDEOS.map((v) => (
            <a
              key={v.slug}
              href={`#${v.slug}`}
              className="rounded-full border border-border-light px-3 py-1 text-xs font-medium text-ink-secondary hover:border-accent/40 hover:text-accent"
            >
              {v.priority}. {v.title.split(" ").slice(0, 3).join(" ")}…
            </a>
          ))}
        </nav>

        <div className="space-y-10">
          {packs.map((pack) => (
            <ProductionPackPanel key={pack.slug} pack={pack} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}
