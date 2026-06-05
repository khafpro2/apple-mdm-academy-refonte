"use client";

import Link from "next/link";
import { useRef, useState, useSyncExternalStore } from "react";
import type { VideoScript } from "@/src/lib/video-scripts";
import { HEYGEN_VIDEO_DEFAULTS } from "@/src/lib/video-scripts";
import { PedagogicalAnimation } from "@/components/video/pedagogical-animation";
import { Badge, ButtonLink } from "@/components/ui";
import type { AnimationSlug } from "@/lib/types";
import {
  loadVideoProgress,
  saveLastContent,
  saveVideoProgress,
} from "@/lib/video/progress-storage";

const ANIMATION_BY_SLUG: Partial<Record<string, AnimationSlug>> = {
  "abm-intune": "abm-intune",
  "automated-device-enrollment": "ade-enrollment",
  apns: "apns-push",
  "apps-books": "apps-books",
  "platform-sso": "platform-sso",
  "jamf-pro-fundamentals": "jamf-policies",
  "macos-security": "filevault",
  "jamf-policies": "jamf-policies",
  "jamf-smart-groups": "jamf-policies",
  "jamf-packages": "jamf-policies",
  "jamf-scripts": "jamf-policies",
  "jamf-scope": "jamf-policies",
  "jamf-self-service": "jamf-policies",
  "jamf-enrollment": "ade-enrollment",
  "jamf-prestage": "ade-enrollment",
};

type Props = {
  video: VideoScript;
};

export function VideoScriptDetail({ video }: Props) {
  const [showScript, setShowScript] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [simTime, setSimTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const savedProgress = useSyncExternalStore(
    () => () => {},
    () => loadVideoProgress(video.slug),
    () => null
  );

  const progressPercent = savedProgress
    ? Math.round((savedProgress.currentSeconds / video.durationSeconds) * 100)
    : 0;

  const animationSlug = ANIMATION_BY_SLUG[video.slug];
  const animProgress = playing ? simTime / video.durationSeconds : progressPercent / 100;

  const handlePlay = () => {
    saveLastContent({
      type: "video",
      slug: video.slug,
      title: video.title,
      href: `/videos/${video.slug}`,
      updatedAt: Date.now(),
    });
    if (playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      setPlaying(false);
      return;
    }
    setPlaying(true);
    let elapsed = savedProgress?.currentSeconds ?? simTime;
    intervalRef.current = setInterval(() => {
      elapsed += 1;
      setSimTime(elapsed);
      saveVideoProgress({
        videoSlug: video.slug,
        currentSeconds: elapsed,
        completed: elapsed >= video.durationSeconds * 0.95,
        updatedAt: Date.now(),
      });
      if (elapsed >= video.durationSeconds && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setPlaying(false);
      }
    }, 1000);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <div className="overflow-hidden rounded-2xl border border-border-light bg-black shadow-xl">
          {animationSlug ? (
            <PedagogicalAnimation slug={animationSlug} playing={playing} progress={animProgress} />
          ) : (
            <div className="flex aspect-video flex-col items-center justify-center bg-gradient-to-br from-ink to-zinc-900 text-white">
              <span className="text-6xl opacity-90" aria-hidden="true">▶</span>
              <p className="mt-4 text-sm text-white/70">Vidéo HeyGen — génération à venir</p>
              <p className="mt-1 text-xs text-white/50">{HEYGEN_VIDEO_DEFAULTS.style} · {HEYGEN_VIDEO_DEFAULTS.format}</p>
            </div>
          )}
          <div className="flex items-center gap-4 border-t border-white/10 bg-ink px-5 py-4">
            <button
              type="button"
              onClick={handlePlay}
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-ink hover:bg-white/90"
            >
              {playing ? "Pause" : "Lecture"}
            </button>
            <span className="text-sm text-white/70">{video.duration}</span>
            {progressPercent > 0 && (
              <span className="ml-auto text-sm text-accent">{progressPercent}% visionné</span>
            )}
          </div>
        </div>

        <header className="rounded-2xl border border-border-light bg-surface-elevated p-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">{video.module}</Badge>
            <Badge variant="accent">{video.level}</Badge>
          </div>
          <h1 className="mt-3 text-2xl font-bold text-ink">{video.title}</h1>
          <p className="mt-2 text-sm text-ink-secondary">{video.description}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink href={`/cours/${video.relatedCourseSlug}`}>Voir le cours</ButtonLink>
            <ButtonLink href={`/labs/${video.relatedLabSlug}`} variant="secondary">
              Faire le lab
            </ButtonLink>
          </div>
        </header>

        <section className="rounded-2xl border border-border-light bg-surface-elevated p-6">
          <button
            type="button"
            onClick={() => setShowScript(!showScript)}
            className="flex w-full items-center justify-between font-bold text-ink"
          >
            Script HeyGen complet
            <span className="text-ink-tertiary">{showScript ? "−" : "+"}</span>
          </button>
          {showScript && (
            <div className="mt-4 rounded-xl bg-surface p-5">
              {video.script.split("\n").map((paragraph, i) => (
                <p key={i} className="mb-3 text-sm leading-relaxed text-ink-secondary last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </section>
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-border-light bg-surface-elevated p-5">
          <h2 className="font-bold text-ink">Informations</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-xs text-ink-tertiary">Module</dt>
              <dd className="font-medium text-ink">{video.module}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-tertiary">Durée</dt>
              <dd className="font-medium text-ink">{video.duration}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-tertiary">Niveau</dt>
              <dd className="font-medium text-ink">{video.level}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-tertiary">Cours associé</dt>
              <dd>
                <Link href={`/cours/${video.relatedCourseSlug}`} className="font-medium text-accent hover:underline">
                  {video.relatedCourseSlug}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-tertiary">Lab associé</dt>
              <dd>
                <Link href={`/labs/${video.relatedLabSlug}`} className="font-medium text-accent hover:underline">
                  {video.relatedLabSlug}
                </Link>
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-dashed border-border-light bg-surface p-5 text-sm">
          <p className="font-semibold text-ink">Prêt pour HeyGen</p>
          <dl className="mt-3 space-y-2 text-ink-secondary">
            <div><dt className="text-xs text-ink-tertiary">Avatar</dt><dd>{video.heygenAvatar}</dd></div>
            <div><dt className="text-xs text-ink-tertiary">Voix</dt><dd>{HEYGEN_VIDEO_DEFAULTS.voice}</dd></div>
            <div><dt className="text-xs text-ink-tertiary">Langue</dt><dd>{video.language}</dd></div>
            <div><dt className="text-xs text-ink-tertiary">Format</dt><dd>{HEYGEN_VIDEO_DEFAULTS.format}</dd></div>
            <div><dt className="text-xs text-ink-tertiary">Style</dt><dd>{video.heygenStyle ?? HEYGEN_VIDEO_DEFAULTS.style}</dd></div>
          </dl>
        </div>

        <Link href="/videos" className="block text-sm font-semibold text-accent hover:underline">
          ← Toutes les vidéos
        </Link>
      </aside>
    </div>
  );
}
