"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { VideoTranscript } from "@/src/lib/video-transcripts";
import {
  loadVideoProgress,
  saveLastContent,
  saveVideoProgress,
} from "@/lib/video/progress-storage";
import { ProgressBar } from "@/components/ui";

type Props = {
  slug: string;
  title: string;
  mp4Url: string;
  poster?: string;
  durationSeconds: number;
  durationLabel: string;
  transcript?: VideoTranscript;
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function OfficialVideoPlayer({
  slug,
  title,
  mp4Url,
  poster,
  durationSeconds,
  durationLabel,
  transcript,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTranscript, setShowTranscript] = useState(true);
  const resumedRef = useRef(false);

  const savedProgress = useSyncExternalStore(
    () => () => {},
    () => loadVideoProgress(slug),
    () => null
  );

  const progressPercent = durationSeconds
    ? Math.min(100, Math.round((currentTime / durationSeconds) * 100))
    : 0;

  useEffect(() => {
    saveLastContent({
      type: "video",
      slug,
      title,
      href: `/videos/${slug}`,
      updatedAt: Date.now(),
    });
  }, [slug, title]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || resumedRef.current || !savedProgress?.currentSeconds) return;
    const resumeAt = savedProgress.currentSeconds;
    const applyResume = () => {
      if (resumeAt > 5 && resumeAt < durationSeconds * 0.98) {
        video.currentTime = resumeAt;
      }
      resumedRef.current = true;
    };
    if (video.readyState >= 1) {
      applyResume();
    } else {
      video.addEventListener("loadedmetadata", applyResume, { once: true });
      return () => video.removeEventListener("loadedmetadata", applyResume);
    }
  }, [savedProgress, durationSeconds]);

  const persistProgress = useCallback(
    (seconds: number, completed: boolean) => {
      saveVideoProgress({
        videoSlug: slug,
        currentSeconds: seconds,
        completed,
        updatedAt: Date.now(),
      });
    },
    [slug]
  );

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    persistProgress(video.currentTime, video.currentTime >= durationSeconds * 0.95);
  }, [durationSeconds, persistProgress]);

  const handleEnded = useCallback(() => {
    persistProgress(durationSeconds, true);
    setCurrentTime(durationSeconds);
  }, [durationSeconds, persistProgress]);

  const copyTranscript = useCallback(async () => {
    if (!transcript) return;
    try {
      await navigator.clipboard.writeText(transcript.fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [transcript]);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-border-light bg-black shadow-xl">
        <video
          ref={videoRef}
          src={mp4Url}
          controls
          className="aspect-video w-full"
          poster={poster}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          preload="metadata"
        >
          Votre navigateur ne supporte pas la lecture vidéo.
        </video>
        <div className="border-t border-border-light bg-surface-elevated px-5 py-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="font-semibold text-accent">Vidéo officielle LMS</span>
            <span className="text-ink-secondary">{durationLabel}</span>
            <span className="text-ink-tertiary">
              {formatTime(currentTime)} / {formatTime(durationSeconds)}
            </span>
            {savedProgress && savedProgress.currentSeconds > 5 && !savedProgress.completed && (
              <span className="text-xs text-ink-tertiary">Reprise automatique activée</span>
            )}
            {savedProgress?.completed && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
                Terminée
              </span>
            )}
            <span className="ml-auto font-medium text-accent">{progressPercent}%</span>
          </div>
          <ProgressBar value={progressPercent} className="mt-3" />
        </div>
      </div>

      {transcript && (
        <section className="rounded-2xl border border-border-light bg-surface-elevated p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowTranscript(!showTranscript)}
              className="font-bold text-ink"
            >
              Transcript {showTranscript ? "−" : "+"}
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={copyTranscript}
                className="rounded-lg border border-border-light px-3 py-1.5 text-sm font-medium text-ink-secondary hover:bg-surface"
              >
                {copied ? "Copié ✓" : "Copier transcript"}
              </button>
              <a
                href={`/transcripts#${slug}`}
                className="rounded-lg border border-border-light px-3 py-1.5 text-sm font-medium text-ink-secondary hover:bg-surface"
              >
                Voir dans /transcripts
              </a>
            </div>
          </div>
          {showTranscript && (
            <div className="mt-4 max-h-96 space-y-4 overflow-y-auto rounded-xl bg-surface p-5">
              {transcript.scenes.map((scene, i) => (
                <div key={i}>
                  <p className="text-xs font-semibold uppercase text-accent">{scene.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-secondary">{scene.text}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
