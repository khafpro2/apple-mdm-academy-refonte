"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { getIllustratedVideoLessons, getRecommendedVideoLessons } from "@/src/lib/video-storyboards";
import {
  loadAllVideoProgress,
  loadLastContent,
  getContinueVideoProgress,
  getTotalWatchMinutes,
  formatWatchTime,
} from "@/lib/video/progress-storage";
import { ProgressBar } from "@/components/ui";
import { TrackLogo } from "@/components/ui/track-logo";
import type { LogoName } from "@/lib/navigation/logo-names";

const MODULE_LOGO: Record<string, LogoName> = {
  "Apple Business Manager": "apple",
  "ABM + Intune": "intune",
  "Jamf Pro": "jamf",
  "Jamf Smart Groups": "jamf",
  "Jamf Policies": "jamf",
  "Jamf Scripts": "jamf",
  "Jamf Patch Management": "jamf",
  "Jamf Protect": "shield",
  APNs: "shield",
  "Sécurité macOS": "shield",
};

function moduleLogo(module: string): LogoName {
  return MODULE_LOGO[module] ?? "video";
}

export function VideoProgressPanel() {
  const progressList = useSyncExternalStore(
    () => () => {},
    () => loadAllVideoProgress(),
    () => []
  );
  const lastContent = useSyncExternalStore(
    () => () => {},
    () => loadLastContent(),
    () => null
  );
  const continueVideo = useSyncExternalStore(
    () => () => {},
    () => getContinueVideoProgress(),
    () => null
  );

  const allLessons = getIllustratedVideoLessons();
  const durationBySlug = useMemo(
    () => Object.fromEntries(allLessons.map((l) => [l.slug, l.durationSeconds])),
    [allLessons]
  );
  const totalWatchMinutes = useSyncExternalStore(
    () => () => {},
    () => getTotalWatchMinutes(durationBySlug),
    () => 0
  );

  const recommended = getRecommendedVideoLessons(4);
  const lastVideo = lastContent?.type === "video" ? allLessons.find((l) => l.slug === lastContent.slug) : null;
  const continueLesson = continueVideo
    ? allLessons.find((l) => l.slug === continueVideo.videoSlug)
    : null;

  const completedCount = progressList.filter((p) => p.completed).length;
  const inProgress = progressList.filter((p) => !p.completed && p.currentSeconds > 0);

  return (
    <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-ink-tertiary">Vidéos illustrées</p>
          <h2 className="text-lg font-bold text-ink">Progression vidéos</h2>
          <p className="mt-1 text-sm text-ink-secondary">
            {completedCount}/{allLessons.length} terminées · {formatWatchTime(totalWatchMinutes)} de formation
          </p>
        </div>
        <Link href="/videos" className="text-sm font-semibold text-accent hover:underline">
          Bibliothèque →
        </Link>
      </div>

      {continueLesson && continueVideo && (
        <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/10 p-4">
          <p className="text-xs font-semibold uppercase text-accent">Continuer la vidéo</p>
          <Link href={`/videos/${continueLesson.slug}`} className="mt-1 block font-bold text-ink hover:text-accent">
            {continueLesson.title}
          </Link>
          <p className="text-xs text-ink-tertiary">
            Reprise à {Math.floor(continueVideo.currentSeconds / 60)}:
            {String(Math.floor(continueVideo.currentSeconds % 60)).padStart(2, "0")}
          </p>
          <ProgressBar
            value={Math.round((continueVideo.currentSeconds / continueLesson.durationSeconds) * 100)}
            className="mt-2"
          />
        </div>
      )}

      {lastVideo && lastVideo.slug !== continueLesson?.slug && (
        <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/5 p-4">
          <p className="text-xs font-semibold uppercase text-accent">Dernière vidéo ouverte</p>
          <Link href={`/videos/${lastVideo.slug}`} className="mt-1 block font-bold text-ink hover:text-accent">
            {lastVideo.title}
          </Link>
          <p className="text-xs text-ink-tertiary">{lastVideo.module} · {lastVideo.duration}</p>
        </div>
      )}

      {inProgress.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-bold text-ink">En cours</h3>
          {inProgress.slice(0, 3).map((p) => {
            const lesson = allLessons.find((l) => l.slug === p.videoSlug);
            if (!lesson) return null;
            const pct = Math.round((p.currentSeconds / lesson.durationSeconds) * 100);
            return (
              <Link key={p.videoSlug} href={`/videos/${p.videoSlug}`} className="block rounded-xl bg-surface p-3 hover:bg-surface-elevated">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-ink">{lesson.title}</span>
                  <span className="text-ink-tertiary">{pct}%</span>
                </div>
                <ProgressBar value={pct} className="mt-2" />
              </Link>
            );
          })}
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-sm font-bold text-ink">Vidéos recommandées</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {recommended.map((lesson) => (
            <Link
              key={lesson.slug}
              href={`/videos/${lesson.slug}`}
              className="flex items-start gap-3 rounded-xl border border-border-light bg-surface p-3 transition hover:border-accent/30"
            >
              <TrackLogo logo={moduleLogo(lesson.module)} size={22} alt={lesson.module} className="h-9 w-9" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{lesson.title}</p>
                <p className="text-xs text-ink-tertiary">{lesson.duration} · {lesson.scenes.length} scènes</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
