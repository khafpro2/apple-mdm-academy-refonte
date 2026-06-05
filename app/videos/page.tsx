import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading, Badge } from "@/components/ui";
import { academyVideos, getPopularVideos } from "@/lib/data/videos";

export const metadata = {
  title: "Vidéos",
  description: "Vidéos pédagogiques Apple MDM, Jamf et Intune avec animations premium.",
};

export default function VideosPage() {
  const popular = getPopularVideos();

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Formation vidéo"
          title="Vidéos & animations premium"
          description="Leçons vidéo avec player avancé, chapitres, notes et ressources téléchargeables. Structure prête pour génération HeyGen."
        />

        {popular.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold text-ink">Populaires</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {popular.map((video) => (
                <VideoCard key={video.slug} video={video} featured />
              ))}
            </div>
          </section>
        )}

        <section className="mt-12">
          <h2 className="text-lg font-bold text-ink">Catalogue complet</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {academyVideos.map((video) => (
              <VideoCard key={video.slug} video={video} />
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}

function VideoCard({
  video,
  featured,
}: {
  video: (typeof academyVideos)[0];
  featured?: boolean;
}) {
  return (
    <Link
      href={`/videos/${video.slug}`}
      className={`group flex flex-col overflow-hidden rounded-3xl border bg-surface-elevated shadow-sm transition hover:shadow-md ${
        featured ? "border-accent/40 ring-1 ring-accent/20" : "border-border-light"
      }`}
    >
      <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-ink to-zinc-800">
        <span className="text-5xl opacity-80 transition group-hover:scale-110" aria-hidden="true">
          ▶
        </span>
        <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
          {video.duration}
        </span>
        {video.animationSlug && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-ink">
            Animation
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap gap-2">
          <Badge variant="default">{video.moduleTitle}</Badge>
          {video.heygen.status === "ready" && <Badge variant="accent">HeyGen</Badge>}
        </div>
        <h3 className="font-bold text-ink group-hover:text-accent">{video.title}</h3>
        <p className="mt-2 flex-1 text-sm text-ink-secondary line-clamp-2">{video.description}</p>
        <p className="mt-4 text-sm font-semibold text-accent">Lancer la lecture →</p>
      </div>
    </Link>
  );
}
