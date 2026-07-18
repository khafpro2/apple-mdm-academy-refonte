import type { ModularLessonModule } from "@/lib/data/lessons/types";
import { macosFileVaultLesson } from "@/lib/data/lessons/apple/macos-filevault";

/** Apple family modular lessons — one file (or small group) per lesson. */
export const appleLessonModules: ModularLessonModule[] = [macosFileVaultLesson];

export function getAppleLessonModule(
  courseSlug: string,
  lessonSlug: string
): ModularLessonModule | undefined {
  return appleLessonModules.find(
    (entry) => entry.meta.courseSlug === courseSlug && entry.meta.slug === lessonSlug
  );
}
