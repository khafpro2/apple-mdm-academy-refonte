"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
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

const FONT_SCALES = [1, 1.05, 1.12] as const;

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

  const [fontScaleIndex, setFontScaleIndex] = useState(1);

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "r" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        saveReadingModeEnabled(courseSlug, !readingMode);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [courseSlug, readingMode]);

  const toggleMode = useCallback(() => {
    saveReadingModeEnabled(courseSlug, !readingMode);
  }, [courseSlug, readingMode]);

  const handleMarkRead = useCallback(async () => {
    markLessonRead(courseSlug, lessonSlug);
    await saveLessonProgress({ lessonSlug, courseSlug, score: 100 });
  }, [courseSlug, lessonSlug]);

  const fontScale = FONT_SCALES[fontScaleIndex];

  return (
    <div className={readingMode ? "reading-mode-active rounded-2xl bg-[#f5f5f7]/80 p-2 sm:p-4" : ""}>
      <div
        id="lecture-toolbar"
        className="sticky top-16 z-10 mb-6 flex flex-col gap-3 rounded-2xl border border-border-light bg-surface-elevated/95 p-3 shadow-sm backdrop-blur sm:top-20 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 sm:p-4"
      >
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggleMode}
            title="Raccourci clavier : R"
            className={`rounded-full px-3 py-2 text-xs font-semibold sm:px-4 sm:text-sm ${
              readingMode ? "bg-accent text-white" : "border border-border-light text-ink-secondary"
            }`}
          >
            {readingMode ? "Mode lecture actif" : "Activer le mode lecture"}
          </button>
          {readingMode && (
            <div className="flex items-center gap-1 rounded-full border border-border-light bg-surface px-2 py-1">
            <button
              type="button"
              aria-label="Réduire la taille du texte"
              disabled={fontScaleIndex === 0}
              onClick={() => setFontScaleIndex((i) => Math.max(0, i - 1))}
              className="rounded-full px-2 py-1 text-xs font-bold text-ink-secondary disabled:opacity-40"
            >
              A−
            </button>
            <span className="px-1 text-xs text-ink-tertiary">Texte</span>
            <button
              type="button"
              aria-label="Augmenter la taille du texte"
              disabled={fontScaleIndex === FONT_SCALES.length - 1}
              onClick={() => setFontScaleIndex((i) => Math.min(FONT_SCALES.length - 1, i + 1))}
              className="rounded-full px-2 py-1 text-xs font-bold text-ink-secondary disabled:opacity-40"
            >
              A+
            </button>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 sm:min-w-[140px]">
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
          className="w-full rounded-full border border-border-light px-4 py-2 text-xs font-semibold text-ink-secondary hover:bg-surface disabled:opacity-60 sm:w-auto sm:text-sm"
        >
          {isRead ? "✓ Marqué comme lu" : "Marquer comme lu"}
        </button>
      </div>

      {readingMode && (
        <p className="mb-4 rounded-xl bg-blue-50 px-4 py-3 text-sm text-ink-secondary">
          Mode lecture : colonne étroite, texte agrandi, moins de distractions. Appuyez sur{" "}
          <kbd className="rounded border border-border-light bg-white px-1.5 py-0.5 text-xs font-semibold">R</kbd>{" "}
          pour basculer.
        </p>
      )}

      <div
        style={readingMode ? { fontSize: `${fontScale}rem` } : undefined}
        className={
          readingMode
            ? "mx-auto max-w-3xl leading-8 [&_p]:text-ink-secondary [&_h2]:text-2xl [&_h3]:text-xl"
            : ""
        }
      >
        {children}
      </div>
    </div>
  );
}
