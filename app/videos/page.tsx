import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading, Badge } from "@/components/ui";
import { getPopularVideoScripts, videoScripts } from "@/src/lib/video-scripts";

export const metadata = {
  title: "Vidéos",
  description: "Bibliothèque de vidéos pédagogiques Apple MDM — scripts HeyGen prêts pour génération.",
};

export default function VideosPage() {
  const popular = getPopularVideoScripts();

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Formation vidéo"
          title="Bibliothèque vidéo pédagogique"
          description="10 vidéos fondamentales avec scripts HeyGen complets — Apple Business Manager, Intune, Jamf Pro et sécurité macOS."
        />

        <div className="mt-8 flex flex-wrap gap-3 text-sm text-ink-secondary">
          <span className="rounded-full bg-surface-elevated px-4 py-1.5 border border-border-light">
            {videoScripts.length} vidéos
          </span>
          <span className="rounded-full bg-surface-elevated px-4 py-1.5 border border-border-light">
            HeyGen · fr-FR · 16:9
          </span>
        </div>

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
          <h2 className="text-lg font-bold text-ink">Modules fondamentaux</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videoScripts.map((video) => (
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
  video: (typeof videoScripts)[0];
  featured?: boolean;
}) {
  return (
    <article
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
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-ink">
          {video.level}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Badge variant="default" className="mb-2 self-start">{video.module}</Badge>
        <h3 className="font-bold text-ink group-hover:text-accent">{video.title}</h3>
        <p className="mt-2 flex-1 text-sm text-ink-secondary line-clamp-2">{video.description}</p>
        <Link
          href={`/videos/${video.slug}`}
          className="mt-4 inline-flex rounded-full bg-accent px-4 py-2 text-center text-sm font-semibold text-white hover:opacity-90"
        >
          Voir la vidéo
        </Link>
      </div>
    </article>
  );
}
