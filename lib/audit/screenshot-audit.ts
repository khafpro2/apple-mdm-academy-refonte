import fs from "node:fs";
import path from "node:path";
import { courses } from "@/lib/data/courses";
import { getFlatLessons } from "@/lib/course/helpers";
import { getLessonContent } from "@/lib/data/lesson-content";
import { getTotalPoints } from "@/lib/course/helpers";
import { SCREENSHOT_LIBRARY_BY_ID } from "@/lib/data/screenshot-library";
import { LESSON_SCREENSHOT_IDS } from "@/lib/data/lesson-screenshot-mapping";

export type ScreenshotAuditEntry = {
  id: string;
  src: string;
  title: string;
  lessonSlug?: string;
  courseSlug?: string;
  exists: boolean;
  isPlaceholderPath: boolean;
  isMapped: boolean;
};

export type ScreenshotAuditReport = {
  total: number;
  present: number;
  missing: number;
  placeholderPaths: number;
  score: number;
  entries: ScreenshotAuditEntry[];
  missingByLesson: { lessonSlug: string; courseSlug: string; count: number }[];
};

function publicPath(src: string): string {
  const normalized = src.startsWith("/") ? src.slice(1) : src;
  return path.join(process.cwd(), "public", normalized);
}

function isPlaceholderSrc(src: string): boolean {
  return (
    src.includes("/01-console-principale") ||
    src.includes("/02-configuration") ||
    src.includes("/03-conformite") ||
    src.includes("placeholder") ||
    src.includes("à-ajouter")
  );
}

function fileExists(src: string): boolean {
  try {
    return fs.existsSync(publicPath(src));
  } catch {
    return false;
  }
}

/** Audit des captures utilisées dans les leçons + bibliothèque */
export function runScreenshotAudit(): ScreenshotAuditReport {
  const seen = new Map<string, ScreenshotAuditEntry>();
  const missingByLessonMap = new Map<string, { lessonSlug: string; courseSlug: string; count: number }>();

  for (const course of courses) {
    const flat = getFlatLessons(course);
    const totalLessons = flat.length;
    for (const item of flat) {
      const content = getLessonContent(
        course,
        course.modules[item.moduleIndex]!,
        item.lesson,
        item.globalIndex,
        totalLessons
      );
      for (const shot of content.screenshots) {
        const key = shot.src;
        if (seen.has(key)) continue;
        const exists = fileExists(shot.src);
        const isPlaceholderPath = isPlaceholderSrc(shot.src);
        seen.set(key, {
          id: shot.id ?? key,
          src: shot.src,
          title: shot.title,
          lessonSlug: item.lesson.slug,
          courseSlug: course.slug,
          exists,
          isPlaceholderPath,
          isMapped: Boolean(LESSON_SCREENSHOT_IDS[item.lesson.slug]),
        });
        if (!exists || isPlaceholderPath) {
          const k = `${course.slug}:${item.lesson.slug}`;
          const prev = missingByLessonMap.get(k) ?? {
            lessonSlug: item.lesson.slug,
            courseSlug: course.slug,
            count: 0,
          };
          prev.count++;
          missingByLessonMap.set(k, prev);
        }
      }
    }
  }

  for (const entry of Object.values(SCREENSHOT_LIBRARY_BY_ID)) {
    const src = `/images/courses/${entry.category}/${entry.filename}`;
    if (seen.has(src)) continue;
    seen.set(src, {
      id: entry.id,
      src,
      title: entry.title,
      exists: fileExists(src),
      isPlaceholderPath: false,
      isMapped: true,
    });
  }

  const entries = [...seen.values()];
  const present = entries.filter((e) => e.exists && !e.isPlaceholderPath).length;
  const missing = entries.filter((e) => !e.exists).length;
  const placeholderPaths = entries.filter((e) => e.isPlaceholderPath).length;
  const total = entries.length;
  const score = total > 0 ? Math.round((present / total) * 100) : 100;

  return {
    total,
    present,
    missing,
    placeholderPaths,
    score,
    entries: entries.sort((a, b) => Number(a.exists) - Number(b.exists)),
    missingByLesson: [...missingByLessonMap.values()].sort((a, b) => b.count - a.count).slice(0, 30),
  };
}
