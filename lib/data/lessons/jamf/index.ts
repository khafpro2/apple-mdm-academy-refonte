import type { ModularLessonModule } from "@/lib/data/lessons/types";

/** Jamf family modular lessons — populated progressively from Claude drafts. */
export const jamfLessonModules: ModularLessonModule[] = [];

export function getJamfLessonModule(
  courseSlug: string,
  lessonSlug: string
): ModularLessonModule | undefined {
  return jamfLessonModules.find(
    (entry) => entry.meta.courseSlug === courseSlug && entry.meta.slug === lessonSlug
  );
}
