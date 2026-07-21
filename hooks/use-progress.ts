"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { VideoProgressModel } from "@/components/video-experience/types";

const STORAGE_KEY = "apple-mdm-video-progress-ux-v1";
const EVENT = "apple-mdm-video-progress-ux-updated";

function readMap(): Record<string, VideoProgressModel> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, VideoProgressModel>;
  } catch {
    return {};
  }
}

function writeMap(map: Record<string, VideoProgressModel>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new CustomEvent(EVENT));
}

function subscribe(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * Progression / reprise locale — aucune sync serveur tant que Codex n’a pas branché l’API.
 */
export function useProgress(slug?: string, durationSeconds = 0) {
  const map = useSyncExternalStore(subscribe, readMap, () => ({} as Record<string, VideoProgressModel>));
  const saved = slug ? map[slug] ?? null : null;

  const percent = saved
    ? Math.min(100, Math.round((saved.currentSeconds / Math.max(durationSeconds || 1, 1)) * 100))
    : 0;

  const resumeAt =
    saved &&
    !saved.completed &&
    saved.currentSeconds > 5 &&
    saved.currentSeconds < (durationSeconds || Infinity) * 0.98
      ? saved.currentSeconds
      : null;

  const persist = useCallback(
    (currentSeconds: number, completed = false) => {
      if (!slug) return;
      const next: VideoProgressModel = {
        slug,
        currentSeconds,
        completed,
        updatedAt: Date.now(),
      };
      writeMap({ ...readMap(), [slug]: next });
    },
    [slug]
  );

  const complete = useCallback(() => {
    if (!slug) return;
    persist(durationSeconds, true);
  }, [durationSeconds, persist, slug]);

  return {
    saved,
    percent,
    completed: Boolean(saved?.completed),
    resumeAt,
    persist,
    complete,
  };
}
