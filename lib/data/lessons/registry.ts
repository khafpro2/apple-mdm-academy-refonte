import type { ModularLessonModule } from "@/lib/data/lessons/types";
import { getAppleLessonModule, appleLessonModules } from "@/lib/data/lessons/apple";
import { getJamfLessonModule, jamfLessonModules } from "@/lib/data/lessons/jamf";
import { getIntuneLessonModule, intuneLessonModules } from "@/lib/data/lessons/intune";

/** Central export for modular lessons — avoids growing lesson-content.ts monolith. */
export function getModularLesson(
  courseSlug: string,
  lessonSlug: string
): ModularLessonModule | undefined {
  return (
    getAppleLessonModule(courseSlug, lessonSlug) ??
    getJamfLessonModule(courseSlug, lessonSlug) ??
    getIntuneLessonModule(courseSlug, lessonSlug)
  );
}

export function listModularLessons(): ModularLessonModule[] {
  return [...appleLessonModules, ...jamfLessonModules, ...intuneLessonModules];
}
