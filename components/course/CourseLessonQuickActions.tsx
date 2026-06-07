"use client";

import { VideoAlternateLearningLinks } from "@/components/videos/video-production-ux";

type Props = {
  courseSlug: string;
  lessonTitle: string;
  labSlug?: string;
  quizHref?: string;
  videoSlug?: string;
  resourceSlug?: string;
};

export function CourseLessonQuickActions({
  courseSlug,
  lessonTitle,
  labSlug,
  quizHref,
  videoSlug,
  resourceSlug,
}: Props) {
  const quizSlug = quizHref?.replace(/^\/quiz\//, "");
  const hasLinks = labSlug || quizSlug || resourceSlug;

  if (!hasLinks && !videoSlug) return null;

  return (
    <aside
      className="mt-6 rounded-2xl border border-border-light bg-surface-elevated p-4 shadow-sm"
      aria-label="Raccourcis d'apprentissage"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">
        Continuer l&apos;apprentissage
      </p>
      <p className="mt-1 text-sm font-medium text-ink">{lessonTitle}</p>
      {hasLinks && labSlug && quizSlug && (
        <div className="mt-3">
          <VideoAlternateLearningLinks
            courseSlug={courseSlug}
            labSlug={labSlug}
            quizSlug={quizSlug}
            resourceSlug={resourceSlug}
            variant="cards"
          />
        </div>
      )}
      {videoSlug && (
        <p className="mt-3 text-xs text-ink-tertiary">
          Vidéo associée :{" "}
          <a href={`/videos/${videoSlug}`} className="font-semibold text-accent hover:underline">
            Ouvrir le module vidéo
          </a>
        </p>
      )}
    </aside>
  );
}
