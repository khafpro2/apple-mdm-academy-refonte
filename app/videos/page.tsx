import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/ui";
import { VideosCatalog } from "@/components/videos/videos-catalog";
import { buildVideoCatalog } from "@/lib/video/catalog";
import { getMp4AvailabilityMap } from "@/src/lib/video-production.server";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Vidéos",
  description:
    "Bibliothèque vidéo Apple MDM — Jamf Pro, ADE, FileVault, Intune et sécurité enterprise. Scripts, transcripts, posters et progression.",
  path: "/videos",
});

export default function VideosPage() {
  const mp4Map = getMp4AvailabilityMap();
  const catalog = buildVideoCatalog(mp4Map);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Formation vidéo"
          title="Bibliothèque vidéo pédagogique"
          description="Vidéos fondamentales Apple MDM et parcours Jamf 100 / 170 / 200 — recherche, filtres, posters, transcripts et progression. Les lecteurs MP4 ne s’affichent que pour les vidéos complètes."
        />
        <VideosCatalog entries={catalog} />
      </div>
    </PageShell>
  );
}
