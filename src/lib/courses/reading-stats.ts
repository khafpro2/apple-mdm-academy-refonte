import {
  loadReadingProgress,
  type ReadingProgress,
} from "@/lib/course/reading-progress-storage";

export type CourseReadingStats = {
  readCount: number;
  totalLessons: number;
  percent: number;
  lastLesson: { slug: string; title?: string; progress: ReadingProgress } | null;
};

/** Agrège la progression lecture locale pour un cours (client-side). */
export function getCourseReadingStats(
  courseSlug: string,
  lessonSlugs: string[]
): CourseReadingStats {
  if (typeof window === "undefined" || lessonSlugs.length === 0) {
    return { readCount: 0, totalLessons: lessonSlugs.length, percent: 0, lastLesson: null };
  }

  let readCount = 0;
  let lastLesson: CourseReadingStats["lastLesson"] = null;

  for (const lessonSlug of lessonSlugs) {
    const progress = loadReadingProgress(courseSlug, lessonSlug);
    if (progress?.read) readCount += 1;
    if (
      progress &&
      (!lastLesson || progress.updatedAt > lastLesson.progress.updatedAt)
    ) {
      lastLesson = { slug: lessonSlug, progress };
    }
  }

  const percent = Math.round((readCount / lessonSlugs.length) * 100);

  return { readCount, totalLessons: lessonSlugs.length, percent, lastLesson };
}
