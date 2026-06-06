"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { VideoTranscript } from "@/src/lib/video-transcripts";
import { VideoTranscriptPanel } from "@/components/videos/VideoTranscriptPanel";
import { saveVideoProgressAction } from "@/app/actions/progress";
import {
  loadVideoProgress,
  saveLastContent,
  saveVideoProgress,
  markVideoComplete,
  subscribeVideoProgress,
} from "@/lib/video/progress-storage";
import { ProgressBar } from "@/components/ui";

type Props = {
  slug: string;
  title: string;
  mp4Url: string;
  poster?: string;
  durationSeconds: number;
  durationLabel: string;
  courseSlug: string;
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
  courseSlug,
  transcript,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const resumedRef = useRef(false);
  const lastSyncRef = useRef(0);

  const savedProgress = useSyncExternalStore(
    subscribeVideoProgress,
    () => loadVideoProgress(slug),
    () => null
  );

  const sceneStartTimes = useMemo(() => {
    if (!transcript?.scenes.length) return undefined;
    let elapsed = 0;
    return transcript.scenes.map((s) => {
      const start = elapsed;
      elapsed += s.durationSeconds;
      return start;
    });
  }, [transcript]);

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
        setCurrentTime(resumeAt);
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

  const syncToServer = useCallback(
    async (seconds: number, completed: boolean) => {
      const now = Date.now();
      if (now - lastSyncRef.current < 15000 && !completed) return;
      lastSyncRef.current = now;
      setSyncing(true);
      try {
        await saveVideoProgressAction({
          videoSlug: slug,
          courseSlug,
          currentSeconds: seconds,
          completed,
          durationSeconds,
        });
      } finally {
        setSyncing(false);
      }
    },
    [slug, courseSlug, durationSeconds]
  );

  const persistProgress = useCallback(
    (seconds: number, completed: boolean) => {
      saveVideoProgress({
        videoSlug: slug,
        currentSeconds: seconds,
        completed,
        updatedAt: Date.now(),
      });
      void syncToServer(seconds, completed);
    },
    [slug, syncToServer]
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

  const handleMarkComplete = useCallback(() => {
    markVideoComplete(slug, durationSeconds);
    setCurrentTime(durationSeconds);
    void syncToServer(durationSeconds, true);
  }, [slug, durationSeconds, syncToServer]);

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
              <span className="text-xs text-ink-tertiary">Reprise automatique</span>
            )}
            {savedProgress?.completed && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
                Terminée
              </span>
            )}
            {syncing && <span className="text-xs text-ink-tertiary">Sync cloud…</span>}
            <span className="ml-auto font-medium text-accent">{progressPercent}%</span>
          </div>
          <ProgressBar value={progressPercent} className="mt-3" />
          <div className="mt-3">
            <button
              type="button"
              onClick={handleMarkComplete}
              className="rounded-lg border border-border-light px-3 py-1.5 text-xs font-semibold text-ink-secondary hover:bg-surface"
            >
              Marquer comme terminée
            </button>
          </div>
        </div>
      </div>

      {transcript && (
        <VideoTranscriptPanel
          transcript={transcript}
          slug={slug}
          currentTime={currentTime}
          sceneStartTimes={sceneStartTimes}
        />
      )}
    </div>
  );
}
