"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui";
import { saveLastContent } from "@/lib/video/progress-storage";
import { isLessonCompletedLocal, saveLessonProgressLocal } from "@/lib/lesson/progress-storage";
import { saveLessonProgress } from "@/app/actions/progress";
import { trackEvent } from "@/lib/analytics/events";
import { useSyncExternalStore } from "react";

const LESSON_COMPLETION_EVENT = "apple-mdm-lesson-completion-change";

function subscribe(storageKey: string, onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener(LESSON_COMPLETION_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(LESSON_COMPLETION_EVENT, handler);
  };
}

type Props = {
  courseSlug: string;
  lessonSlug: string;
  lessonTitle: string;
  showMarkComplete?: boolean;
};

export function LessonProgressTracker({
  courseSlug,
  lessonSlug,
  lessonTitle,
  showMarkComplete = true,
}: Props) {
  const storageKey = `lesson-${lessonSlug}-complete`;
  const href = `/cours/${courseSlug}/${lessonSlug}`;

  useEffect(() => {
    saveLastContent({
      type: "lesson",
      slug: lessonSlug,
      title: lessonTitle,
      href,
      updatedAt: Date.now(),
    });
  }, [courseSlug, lessonSlug, lessonTitle, href]);

  const markedComplete = useSyncExternalStore(
    (onStoreChange) => subscribe(storageKey, onStoreChange),
    () => {
      if (typeof window === "undefined") return false;
      try {
        return (
          localStorage.getItem(storageKey) === "true" || isLessonCompletedLocal(lessonSlug)
        );
      } catch {
        return isLessonCompletedLocal(lessonSlug);
      }
    },
    () => false
  );

  function notifyChange() {
    window.dispatchEvent(new Event(LESSON_COMPLETION_EVENT));
  }

  async function handleMarkComplete() {
    try {
      localStorage.setItem(storageKey, "true");
    } catch {
      /* ignore */
    }
    saveLessonProgressLocal(lessonSlug, courseSlug);
    notifyChange();
    void saveLessonProgress({ lessonSlug, courseSlug, score: 100 });
    trackEvent("module_termine", { lesson: lessonSlug });
  }

  if (!showMarkComplete) return null;

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-border-light bg-surface px-5 py-4">
      <p className="flex-1 text-sm text-ink-secondary">
        {markedComplete
          ? "Cette leçon est marquée comme terminée."
          : "Terminez la lecture puis marquez la leçon pour suivre votre progression."}
      </p>
      <Button
        type="button"
        onClick={handleMarkComplete}
        disabled={markedComplete}
        aria-label={markedComplete ? "Leçon déjà terminée" : "Marquer cette leçon comme terminée"}
      >
        {markedComplete ? "✓ Leçon terminée" : "Marquer comme terminé"}
      </Button>
    </div>
  );
}
