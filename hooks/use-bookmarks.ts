"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { VideoBookmarkModel } from "@/components/video-experience/types";

const STORAGE_KEY = "apple-mdm-video-bookmarks-v1";
const EVENT = "apple-mdm-video-bookmarks-updated";

function readAll(): VideoBookmarkModel[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as VideoBookmarkModel[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(items: VideoBookmarkModel[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
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
 * Favoris / marque-pages temporels — stockage local uniquement (pas d’API).
 */
export function useBookmarks(slug?: string) {
  const all = useSyncExternalStore(subscribe, readAll, () => [] as VideoBookmarkModel[]);
  const bookmarks = slug ? all.filter((b) => b.slug === slug) : all;

  const addBookmark = useCallback(
    (seconds: number, label?: string) => {
      if (!slug) return;
      const next: VideoBookmarkModel = {
        slug,
        seconds,
        label,
        createdAt: Date.now(),
      };
      writeAll([...readAll(), next]);
    },
    [slug]
  );

  const removeBookmark = useCallback((createdAt: number) => {
    writeAll(readAll().filter((b) => b.createdAt !== createdAt));
  }, []);

  const clearForSlug = useCallback(() => {
    if (!slug) return;
    writeAll(readAll().filter((b) => b.slug !== slug));
  }, [slug]);

  return { bookmarks, addBookmark, removeBookmark, clearForSlug };
}
