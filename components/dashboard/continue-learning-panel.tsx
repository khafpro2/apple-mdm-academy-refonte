"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { academyVideos, getPopularVideos } from "@/lib/data/videos";
import { tracks } from "@/lib/data/tracks";
import { loadAllVideoProgress, loadLastContent, type LastContent, type VideoProgress } from "@/lib/video/progress-storage";

export function ContinueLearningPanel() {
  const lastContent = useSyncExternalStore<LastContent | null>(
    () => () => {},
    () => loadLastContent(),
    () => null
  );
  const videoProgress = useSyncExternalStore<VideoProgress[]>(
    () => () => {},
    () => loadAllVideoProgress(),
    () => []
  );

  const inProgressVideos = videoProgress
    .filter((p) => !p.completed && p.currentSeconds > 0)
    .slice(0, 3)
    .map((p) => {
      const video = academyVideos.find((v) => v.slug === p.videoSlug);
      return video ? { video, progress: p } : null;
    })
    .filter(Boolean) as { video: (typeof academyVideos)[0]; progress: VideoProgress }[];

  const popular = getPopularVideos().slice(0, 3);
  const recommended = academyVideos.filter((v) => !videoProgress.some((p) => p.videoSlug === v.slug && p.completed)).slice(0, 3);

  return (
    <div className="space-y-6">
      {lastContent && (
        <section className="rounded-3xl border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-surface-elevated p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">Reprendre où j&apos;ai arrêté</p>
          <h2 className="mt-2 text-lg font-bold text-ink">{lastContent.title}</h2>
          <Link
            href={lastContent.href}
            className="mt-4 inline-flex rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Continuer →
          </Link>
        </section>
      )}

      {inProgressVideos.length > 0 && (
        <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
          <h2 className="text-lg font-bold text-ink">Vidéos en cours</h2>
          <ul className="mt-4 space-y-3">
            {inProgressVideos.map(({ video, progress }) => {
              const pct = Math.round((progress.currentSeconds / video.durationSeconds) * 100);
              return (
                <li key={video.slug}>
                  <Link href={`/videos/${video.slug}`} className="block rounded-xl bg-surface p-4 hover:shadow-sm">
                    <p className="font-medium text-ink">{video.title}</p>
                    <div className="mt-2 h-1.5 rounded-full bg-border-light">
                      <div className="h-1.5 rounded-full bg-accent" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-ink-tertiary">{pct}% · {video.duration}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
          <h2 className="text-lg font-bold text-ink">Modules populaires</h2>
          <ul className="mt-4 space-y-3">
            {popular.map((v) => (
              <li key={v.slug}>
                <Link href={`/videos/${v.slug}`} className="flex justify-between text-sm hover:text-accent">
                  <span className="font-medium text-ink">{v.title}</span>
                  <span className="text-ink-tertiary">{v.duration}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
          <h2 className="text-lg font-bold text-ink">Recommandations</h2>
          <ul className="mt-4 space-y-3">
            {recommended.map((v) => (
              <li key={v.slug}>
                <Link href={`/videos/${v.slug}`} className="block text-sm">
                  <span className="font-medium text-ink">{v.title}</span>
                  <p className="text-xs text-ink-tertiary">{v.moduleTitle}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-3xl bg-ink p-6 text-white">
        <h2 className="text-lg font-bold">Continuer le parcours</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {tracks.slice(0, 3).map((track) => (
            <Link key={track.slug} href={`/parcours/${track.slug}`} className="rounded-2xl bg-white/10 p-4 backdrop-blur transition hover:bg-white/20">
              <p className="font-semibold">{track.title}</p>
              <p className="mt-1 text-sm text-zinc-400">{track.lessons} leçons</p>
            </Link>
          ))}
        </div>
        <Link href="/videos" className="mt-4 inline-block text-sm font-semibold text-accent-foreground underline">
          Voir toutes les vidéos →
        </Link>
      </section>
    </div>
  );
}
