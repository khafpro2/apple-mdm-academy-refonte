import "@/styles/video-experience.css";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/ui";
import { VideoLibraryExperience } from "@/components/video-experience";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Vidéos",
  description:
    "Bibliothèque vidéo Apple MDM Academy — expérience de lecture premium. Catalogue branché lorsque l’infrastructure vidéo est prête.",
  path: "/videos",
});

/**
 * UX V1 — aucun fetch registre / pipeline.
 * Passe un tableau typé vide jusqu’au branchement Codex.
 */
export default function VideosPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Formation vidéo"
          title="Bibliothèque vidéo pédagogique"
          description="Expérience utilisateur premium (recherche, filtres, fiches). Les médias ne s’affichent que lorsqu’ils sont fournis par l’infrastructure — aucun contenu fictif."
        />
        <VideoLibraryExperience items={[]} />
      </div>
    </PageShell>
  );
}
