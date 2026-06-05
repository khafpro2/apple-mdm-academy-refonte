import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading, Badge } from "@/components/ui";
import {
  getFundamentalVideoScripts,
  getJamfVideoScripts,
  getJamfVideoScriptsByTrack,
  getPopularVideoScripts,
  videoScripts,
} from "@/src/lib/video-scripts";

export const metadata = {
  title: "Vidéos",
  description: "Bibliothèque vidéo Apple MDM et parcours Jamf 100 / 200 — scripts HeyGen prêts.",
};

export default function VideosPage() {
  const popular = getPopularVideoScripts();
  const jamfVideos = getJamfVideoScripts();
  const jamf100 = getJamfVideoScriptsByTrack("jamf-100");
  const jamf170 = getJamfVideoScriptsByTrack("jamf-170");
  const jamf200 = getJamfVideoScriptsByTrack("jamf-200");
  const fundamentals = getFundamentalVideoScripts();

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Formation vidéo"
          title="Bibliothèque vidéo pédagogique"
          description="Vidéos fondamentales Apple MDM et parcours Jamf 100 / 170 / 200 — scripts HeyGen complets, labs associés et progression."
        />

        <div className="mt-8 flex flex-wrap gap-3 text-sm text-ink-secondary">
          <span className="rounded-full border border-border-light bg-surface-elevated px-4 py-1.5">
            {videoScripts.length} vidéos
          </span>
          <span className="rounded-full border border-border-light bg-surface-elevated px-4 py-1.5">
            {jamfVideos.length} vidéos Jamf
          </span>
          <span className="rounded-full border border-border-light bg-surface-elevated px-4 py-1.5">
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
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-ink">Parcours Jamf 100 / 200</h2>
              <p className="mt-1 text-sm text-ink-secondary">
                Dashboard, enrollment, Smart Groups, policies, scripts, patch management et Jamf Protect.
              </p>
            </div>
            <Badge variant="accent">Jamf Training Catalog</Badge>
          </div>

          {jamf100.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-tertiary">Jamf 100</h3>
              <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {jamf100.map((video) => (
                  <VideoCard key={video.slug} video={video} jamf />
                ))}
              </div>
            </div>
          )}

          {jamf170.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-tertiary">Jamf 170</h3>
              <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {jamf170.map((video) => (
                  <VideoCard key={video.slug} video={video} jamf />
                ))}
              </div>
            </div>
          )}

          {jamf200.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-tertiary">Jamf 200</h3>
              <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {jamf200.map((video) => (
                  <VideoCard key={video.slug} video={video} jamf />
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="text-lg font-bold text-ink">Modules fondamentaux Apple MDM</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fundamentals.map((video) => (
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
  jamf,
}: {
  video: (typeof videoScripts)[0];
  featured?: boolean;
  jamf?: boolean;
}) {
  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-3xl border bg-surface-elevated shadow-sm transition hover:shadow-md ${
        featured
          ? "border-accent/40 ring-1 ring-accent/20"
          : jamf
            ? "border-indigo-200 ring-1 ring-indigo-100"
            : "border-border-light"
      }`}
    >
      <div className={`relative flex aspect-video items-center justify-center ${jamf ? "bg-gradient-to-br from-indigo-900 to-ink" : "bg-gradient-to-br from-ink to-zinc-800"}`}>
        <span className="text-5xl opacity-80 transition group-hover:scale-110" aria-hidden="true">
          ▶
        </span>
        <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
          {video.duration}
        </span>
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-ink">
          {video.level}
        </span>
        {video.jamfTrack && (
          <span className="absolute right-3 top-3 rounded-full bg-indigo-500/90 px-2 py-0.5 text-xs font-medium text-white">
            {video.jamfTrack.toUpperCase()}
          </span>
        )}
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
