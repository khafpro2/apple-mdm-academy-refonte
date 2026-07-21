"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { saveVideoProgressAction } from "@/app/actions/progress";
import {
  loadVideoProgress,
  markVideoComplete,
  saveLastContent,
  saveVideoProgress,
  subscribeVideoProgress,
  type VideoProgress,
} from "@/lib/video/progress-storage";

export type UseProgressOptions = {
  slug: string;
  title: string;
  courseSlug: string;
  durationSeconds: number;
};

/**
 * Progression locale + sync cloud optionnelle.
 */
export function useProgress({ slug, title, courseSlug, durationSeconds }: UseProgressOptions) {
  const lastSyncRef = useRef(0);
  const [syncing, setSyncing] = useState(false);

  const savedProgress = useSyncExternalStore(
    subscribeVideoProgress,
    () => loadVideoProgress(slug),
    () => null as VideoProgress | null
  );

  const percent = savedProgress
    ? Math.min(100, Math.round((savedProgress.currentSeconds / Math.max(durationSeconds, 1)) * 100))
    : 0;

  const rememberAsLast = useCallback(() => {
    saveLastContent({
      type: "video",
      slug,
      title,
      href: `/videos/${slug}`,
      updatedAt: Date.now(),
    });
  }, [slug, title]);

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

  const persist = useCallback(
    (seconds: number, completed = false) => {
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

  const complete = useCallback(() => {
    markVideoComplete(slug, durationSeconds);
    void syncToServer(durationSeconds, true);
  }, [slug, durationSeconds, syncToServer]);

  return {
    savedProgress,
    percent,
    completed: Boolean(savedProgress?.completed),
    resumeAt:
      savedProgress &&
      savedProgress.currentSeconds > 5 &&
      savedProgress.currentSeconds < durationSeconds * 0.98
        ? savedProgress.currentSeconds
        : null,
    persist,
    complete,
    rememberAsLast,
    syncing,
  };
}
