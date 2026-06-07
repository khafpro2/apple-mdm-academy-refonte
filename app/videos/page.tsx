import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading, Badge } from "@/components/ui";
import { VideoThumbnail } from "@/components/videos/VideoThumbnail";
import { VideoStatusBadges } from "@/components/videos/VideoStatusBadges";
import { getVideoAssets } from "@/src/lib/video-assets";
import type { VideoStoryboard } from "@/src/lib/video-lessons";
import { getVideoDisplayBadges } from "@/src/lib/video-display-status";
import { getMp4AvailabilityMap } from "@/src/lib/video-production.server";
import {
  getFundamentalVideoScripts,
  getJamfVideoScripts,
  getJamfVideoScriptsByTrack,
  getPopularVideoScripts,
  getVideoScript,
  videoScripts,
} from "@/src/lib/video-scripts";
import { getIllustratedVideoLessons } from "@/src/lib/video-storyboards";

export const metadata = {
  title: "Vidéos",
  description: "Bibliothèque vidéo Apple MDM et parcours Jamf 100 / 200 — scripts HeyGen prêts.",
};

export default function VideosPage() {
  const mp4Map = getMp4AvailabilityMap();
  const popular = getPopularVideoScripts();
  const jamfVideos = getJamfVideoScripts();
  const jamf100 = getJamfVideoScriptsByTrack("jamf-100");
  const jamf170 = getJamfVideoScriptsByTrack("jamf-170");
  const jamf200 = getJamfVideoScriptsByTrack("jamf-200");
  const fundamentals = getFundamentalVideoScripts();
  const illustrated = getIllustratedVideoLessons();
  const publishedCount = illustrated.filter((l) => mp4Map[l.slug]).length;
  const inProductionCount = illustrated.length - publishedCount;

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
          <span className="rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-green-800">
            {publishedCount} publiées
          </span>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-amber-900">
            {inProductionCount} en production
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
                <VideoCard key={video.slug} video={video} featured hasMp4={Boolean(mp4Map[video.slug])} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-ink">Vidéos illustrées — storyboards</h2>
              <p className="mt-1 text-sm text-ink-secondary">
                {illustrated.length} modules avec animations, diagrammes et scripts HeyGen scène par scène.
              </p>
            </div>
            <Badge variant="accent">Apple Training Premium</Badge>
          </div>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {illustrated.map((lesson) => (
              <IllustratedVideoCard key={lesson.slug} lesson={lesson} hasMp4={Boolean(mp4Map[lesson.slug])} />
            ))}
          </div>
        </section>

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
                  <VideoCard key={video.slug} video={video} jamf hasMp4={Boolean(mp4Map[video.slug])} />
                ))}
              </div>
            </div>
          )}

          {jamf170.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-tertiary">Jamf 170</h3>
              <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {jamf170.map((video) => (
                  <VideoCard key={video.slug} video={video} jamf hasMp4={Boolean(mp4Map[video.slug])} />
                ))}
              </div>
            </div>
          )}

          {jamf200.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-tertiary">Jamf 200</h3>
              <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {jamf200.map((video) => (
                  <VideoCard key={video.slug} video={video} jamf hasMp4={Boolean(mp4Map[video.slug])} />
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="text-lg font-bold text-ink">Modules fondamentaux Apple MDM</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fundamentals.map((video) => (
              <VideoCard key={video.slug} video={video} hasMp4={Boolean(mp4Map[video.slug])} />
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}

function IllustratedVideoCard({ lesson, hasMp4 }: { lesson: VideoStoryboard; hasMp4: boolean }) {
  const pack = getVideoAssets(lesson.slug);
  const script = getVideoScript(lesson.slug);
  const badges = getVideoDisplayBadges({
    slug: lesson.slug,
    hasMp4,
    storyboard: lesson,
    scriptText: script?.script ?? lesson.narration,
  });

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-accent/30 bg-surface-elevated shadow-sm transition hover:shadow-md">
      {pack ? (
        <VideoThumbnail
          title={lesson.title}
          module={lesson.module}
          icon={pack.icon}
          background={pack.background}
          level={lesson.level}
          thumbnailPath={pack.thumbnailPath}
          showProductionBadge={!hasMp4}
          className="rounded-none"
        />
      ) : (
        <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-6">
          <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
            {lesson.duration}
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <VideoStatusBadges badges={badges} className="mb-3" />
        <Badge variant="default" className="mb-2 self-start">{lesson.module}</Badge>
        <h3 className="font-bold text-ink group-hover:text-accent">{lesson.title}</h3>
        <p className="mt-2 flex-1 text-sm text-ink-secondary line-clamp-2">{lesson.objective}</p>
        <Link
          href={`/videos/${lesson.slug}`}
          className="mt-4 inline-flex rounded-full bg-accent px-4 py-2 text-center text-sm font-semibold text-white hover:opacity-90"
        >
          {hasMp4 ? "Regarder la vidéo" : "Découvrir le module"}
        </Link>
      </div>
    </article>
  );
}

function VideoCard({
  video,
  featured,
  jamf,
  hasMp4,
}: {
  video: (typeof videoScripts)[0];
  featured?: boolean;
  jamf?: boolean;
  hasMp4: boolean;
}) {
  const badges = getVideoDisplayBadges({
    slug: video.slug,
    hasMp4,
    scriptText: video.script,
  });

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
        {!hasMp4 && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-500/95 px-2 py-0.5 text-xs font-semibold text-white">
            En production
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <VideoStatusBadges badges={badges} className="mb-3" />
        <Badge variant="default" className="mb-2 self-start">{video.module}</Badge>
        <h3 className="font-bold text-ink group-hover:text-accent">{video.title}</h3>
        <p className="mt-2 flex-1 text-sm text-ink-secondary line-clamp-2">{video.description}</p>
        <Link
          href={`/videos/${video.slug}`}
          className="mt-4 inline-flex rounded-full bg-accent px-4 py-2 text-center text-sm font-semibold text-white hover:opacity-90"
        >
          {hasMp4 ? "Regarder la vidéo" : "Découvrir le module"}
        </Link>
      </div>
    </article>
  );
}
