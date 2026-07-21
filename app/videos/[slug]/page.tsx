import "@/styles/video-experience.css";
import { PageShell } from "@/components/layout/page-shell";
import { VideoDetailExperience } from "@/components/video-experience";
import type { VideoExperienceModel } from "@/components/video-experience/types";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  // Aucun slug inventé — l’infra Codex alimentera cette liste plus tard.
  return [] as Array<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return buildPageMetadata({
    title: `Vidéo · ${slug}`,
    description:
      "Fiche vidéo Apple MDM Academy — player, chapitres, transcript et ressources (branchement infrastructure en cours).",
    path: `/videos/${slug}`,
  });
}

/**
 * UX V1 — props-only.
 * Sans contrat infra, on expose une fiche `missing` (slug URL uniquement, pas de média fictif).
 */
export default async function VideoDetailPage({ params }: Props) {
  const { slug } = await params;

  const experience: VideoExperienceModel = {
    slug,
    title: "Vidéo",
    description:
      "Fiche en attente de l’infrastructure vidéo Codex. Aucun MP4, poster ou transcript n’est inventé côté expérience.",
    availability: "missing",
    chapters: [],
    resources: [],
    playlist: [],
    related: [],
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <VideoDetailExperience experience={experience} />
      </div>
    </PageShell>
  );
}
