import type { Course, Lesson, LessonStatus } from "@/lib/types";

export type FlatLesson = {
  lesson: Lesson;
  moduleTitle: string;
  moduleIndex: number;
  lessonIndex: number;
  globalIndex: number;
};

export function getFlatLessons(course: Course): FlatLesson[] {
  const flat: FlatLesson[] = [];
  let globalIndex = 0;

  course.modules.forEach((mod, moduleIndex) => {
    mod.lessons.forEach((lesson, lessonIndex) => {
      flat.push({
        lesson,
        moduleTitle: mod.title,
        moduleIndex,
        lessonIndex,
        globalIndex,
      });
      globalIndex += 1;
    });
  });

  return flat;
}

export function getLessonPoints(lesson: Lesson, index: number): number {
  return lesson.points ?? 10 + (index % 4) * 5;
}

export function getTotalPoints(course: Course): number {
  return getFlatLessons(course).reduce(
    (sum, item) => sum + getLessonPoints(item.lesson, item.globalIndex),
    0
  );
}

export function getCourseProgressPercent(globalIndex: number, totalLessons: number): number {
  if (totalLessons <= 0) return 0;
  return Math.round(((globalIndex + 1) / totalLessons) * 100);
}

/** Progression séquentielle : leçons avant l'actuelle terminées, actuelle en cours, suivantes verrouillées. */
export function getLessonStatus(globalIndex: number, activeGlobalIndex: number): LessonStatus {
  if (globalIndex < activeGlobalIndex) return "termine";
  if (globalIndex === activeGlobalIndex) return "en-cours";
  return "verrouille";
}

export function parseDurationMinutes(duration: string): number {
  const match = duration.match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : 30;
}

export function formatLessonStatus(status: LessonStatus): string {
  switch (status) {
    case "en-cours":
      return "En cours";
    case "termine":
      return "Terminé";
    case "verrouille":
      return "Verrouillé";
  }
}
