import type { ModularLessonModule } from "@/lib/data/lessons/types";

/** Intune-for-Apple family modular lessons — populated progressively from Claude drafts. */
export const intuneLessonModules: ModularLessonModule[] = [];

export function getIntuneLessonModule(
  courseSlug: string,
  lessonSlug: string
): ModularLessonModule | undefined {
  return intuneLessonModules.find(
    (entry) => entry.meta.courseSlug === courseSlug && entry.meta.slug === lessonSlug
  );
}
