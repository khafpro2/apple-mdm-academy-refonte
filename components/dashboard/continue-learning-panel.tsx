"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  getJamfVideoScripts,
  getLatestVideoScripts,
  getPopularVideoScripts,
  videoScripts,
} from "@/src/lib/video-scripts";
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
      const video = videoScripts.find((v) => v.slug === p.videoSlug);
      return video ? { video, progress: p } : null;
    })
    .filter(Boolean) as { video: (typeof videoScripts)[0]; progress: VideoProgress }[];

  const popular = getPopularVideoScripts().slice(0, 3);
  const latest = getLatestVideoScripts(4);
  const jamfLatest = getJamfVideoScripts().slice(0, 4);
  const recommended = videoScripts
    .filter((v) => !videoProgress.some((p) => p.videoSlug === v.slug && p.completed))
    .slice(0, 3);

  const lastVideo = lastContent?.type === "video"
    ? videoScripts.find((v) => v.slug === lastContent.slug)
    : null;

  return (
    <div className="space-y-6">
      {(lastContent && lastVideo) && (
        <section className="rounded-3xl border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-surface-elevated p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">Reprendre la dernière vidéo</p>
          <h2 className="mt-2 text-lg font-bold text-ink">{lastVideo.title}</h2>
          <p className="mt-1 text-sm text-ink-secondary">{lastVideo.module} · {lastVideo.duration}</p>
          <Link
            href={lastContent.href}
            className="mt-4 inline-flex rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Continuer →
          </Link>
        </section>
      )}

      {lastContent && !lastVideo && (
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
          <h2 className="text-lg font-bold text-ink">Progression vidéo</h2>
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
                    <p className="mt-1 text-xs text-ink-tertiary">{pct}% · {video.duration} · {video.level}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
        <h2 className="text-lg font-bold text-ink">Dernières vidéos Jamf</h2>
        <ul className="mt-4 space-y-3">
          {jamfLatest.map((v) => (
            <li key={v.slug}>
              <Link href={`/videos/${v.slug}`} className="flex items-center justify-between gap-4 text-sm hover:text-accent">
                <div>
                  <span className="font-medium text-ink">{v.title}</span>
                  <p className="text-xs text-ink-tertiary">{v.jamfTrack?.toUpperCase()} · {v.level}</p>
                </div>
                <span className="shrink-0 text-ink-tertiary">{v.duration}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
        <h2 className="text-lg font-bold text-ink">Dernières vidéos</h2>
        <ul className="mt-4 space-y-3">
          {latest.map((v) => (
            <li key={v.slug}>
              <Link href={`/videos/${v.slug}`} className="flex items-center justify-between gap-4 text-sm hover:text-accent">
                <div>
                  <span className="font-medium text-ink">{v.title}</span>
                  <p className="text-xs text-ink-tertiary">{v.module} · {v.level}</p>
                </div>
                <span className="shrink-0 text-ink-tertiary">{v.duration}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/videos" className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
          Voir toute la bibliothèque →
        </Link>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
          <h2 className="text-lg font-bold text-ink">Vidéos populaires</h2>
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
                  <p className="text-xs text-ink-tertiary">{v.module} · {v.level}</p>
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
      </section>
    </div>
  );
}
