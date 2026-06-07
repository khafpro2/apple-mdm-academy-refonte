"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ButtonLink, ProgressBar } from "@/components/ui";
import { subscribeReadingProgress } from "@/lib/course/reading-progress-storage";
import { getCourseReadingStats } from "@/src/lib/courses/reading-stats";

type Props = {
  courseSlug: string;
  courseTitle: string;
  lessonSlugs: string[];
  lessonTitles: Record<string, string>;
};

export function CourseContinueBanner({
  courseSlug,
  courseTitle,
  lessonSlugs,
  lessonTitles,
}: Props) {
  const revision = useSyncExternalStore(subscribeReadingProgress, () => Date.now(), () => 0);
  void revision;

  const stats =
    typeof window !== "undefined"
      ? getCourseReadingStats(courseSlug, lessonSlugs)
      : { readCount: 0, totalLessons: lessonSlugs.length, percent: 0, lastLesson: null };

  if (stats.readCount === 0 && !stats.lastLesson) return null;

  const resumeSlug = stats.lastLesson?.slug ?? lessonSlugs[0];
  const resumeTitle = resumeSlug ? lessonTitles[resumeSlug] : undefined;
  const resumeHref = resumeSlug ? `/cours/${courseSlug}/${resumeSlug}` : `/cours/${courseSlug}`;

  return (
    <section className="mt-8 rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 to-blue-50/60 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">Reprendre</p>
          <h2 className="mt-1 text-lg font-bold text-ink">{courseTitle}</h2>
          <p className="mt-2 text-sm text-ink-secondary">
            {stats.readCount} leçon{stats.readCount > 1 ? "s" : ""} lue{stats.readCount > 1 ? "s" : ""} sur{" "}
            {stats.totalLessons}
            {resumeTitle ? (
              <>
                {" "}
                · dernière activité : <span className="font-medium text-ink">{resumeTitle}</span>
              </>
            ) : null}
          </p>
          <div className="mt-4 max-w-md">
            <ProgressBar value={stats.percent} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href={resumeHref}>Continuer la lecture</ButtonLink>
          {lessonSlugs[0] && stats.readCount === 0 && (
            <Link
              href={`/cours/${courseSlug}/${lessonSlugs[0]}`}
              className="rounded-full border border-border-light bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-surface"
            >
              Depuis le début
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
