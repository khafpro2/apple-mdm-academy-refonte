"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { saveLessonProgress } from "@/app/actions/progress";
import {
  loadReadingModeEnabled,
  loadReadingProgress,
  markLessonRead,
  saveReadingModeEnabled,
  saveReadingProgress,
  subscribeReadingProgress,
} from "@/lib/course/reading-progress-storage";
import { ProgressBar } from "@/components/ui";

type Props = {
  courseSlug: string;
  lessonSlug: string;
  children: React.ReactNode;
};

export function CourseReadingModeShell({ courseSlug, lessonSlug, children }: Props) {
  const readingMode = useSyncExternalStore(
    subscribeReadingProgress,
    () => loadReadingModeEnabled(courseSlug),
    () => false
  );

  const progress = useSyncExternalStore(
    subscribeReadingProgress,
    () => loadReadingProgress(courseSlug, lessonSlug),
    () => null
  );

  const scrollPercent = progress?.scrollPercent ?? 0;
  const isRead = progress?.read ?? false;

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const pct = total > 0 ? Math.min(100, Math.round((window.scrollY / total) * 100)) : 0;
      const current = loadReadingProgress(courseSlug, lessonSlug);
      if (pct > (current?.scrollPercent ?? 0)) {
        saveReadingProgress({
          courseSlug,
          lessonSlug,
          read: current?.read ?? false,
          scrollPercent: pct,
          updatedAt: Date.now(),
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [courseSlug, lessonSlug]);

  const toggleMode = useCallback(() => {
    saveReadingModeEnabled(courseSlug, !readingMode);
  }, [courseSlug, readingMode]);

  const handleMarkRead = useCallback(async () => {
    markLessonRead(courseSlug, lessonSlug);
    await saveLessonProgress({ lessonSlug, courseSlug, score: 100 });
  }, [courseSlug, lessonSlug]);

  return (
    <div className={readingMode ? "reading-mode-active" : ""}>
      <div className="sticky top-20 z-10 mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-border-light bg-surface-elevated/95 p-4 shadow-sm backdrop-blur">
        <button
          type="button"
          onClick={toggleMode}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            readingMode ? "bg-accent text-white" : "border border-border-light text-ink-secondary"
          }`}
        >
          {readingMode ? "Mode lecture actif" : "Activer le mode lecture"}
        </button>
        <div className="min-w-[140px] flex-1">
          <div className="flex justify-between text-xs text-ink-tertiary">
            <span>Progression de lecture</span>
            <span>{scrollPercent}%</span>
          </div>
          <ProgressBar value={scrollPercent} className="mt-1" />
        </div>
        <button
          type="button"
          onClick={handleMarkRead}
          disabled={isRead}
          className="rounded-full border border-border-light px-4 py-2 text-sm font-semibold text-ink-secondary hover:bg-surface disabled:opacity-60"
        >
          {isRead ? "✓ Marqué comme lu" : "Marquer comme lu"}
        </button>
      </div>

      <div
        className={
          readingMode
            ? "mx-auto max-w-3xl text-[1.05rem] leading-8 [&_p]:text-ink-secondary [&_h2]:text-2xl [&_h3]:text-xl"
            : ""
        }
      >
        {children}
      </div>
    </div>
  );
}
