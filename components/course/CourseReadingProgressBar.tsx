"use client";

import { useSyncExternalStore } from "react";
import { CourseProgressBar } from "@/components/course/course-ui";
import { subscribeReadingProgress } from "@/lib/course/reading-progress-storage";
import { getCourseReadingStats } from "@/src/lib/courses/reading-stats";

type Props = {
  courseSlug: string;
  lessonSlugs: string[];
  label?: string;
};

export function CourseReadingProgressBar({ courseSlug, lessonSlugs, label }: Props) {
  const revision = useSyncExternalStore(subscribeReadingProgress, () => Date.now(), () => 0);
  void revision;

  const stats =
    typeof window !== "undefined"
      ? getCourseReadingStats(courseSlug, lessonSlugs)
      : { percent: 0, readCount: 0, totalLessons: lessonSlugs.length };

  return (
    <CourseProgressBar
      percent={stats.percent}
      label={label ?? `Progression lecture · ${stats.readCount}/${stats.totalLessons} leçons`}
    />
  );
}
