/** Progression lecture cours — localStorage */

export const READING_PROGRESS_EVENT = "apple-mdm-reading-progress-updated";
const PREFIX = "apple-mdm-reading-";
const MODE_PREFIX = "apple-mdm-reading-mode-";

export type ReadingProgress = {
  courseSlug: string;
  lessonSlug: string;
  read: boolean;
  scrollPercent: number;
  updatedAt: number;
};

function key(courseSlug: string, lessonSlug: string): string {
  return `${PREFIX}${courseSlug}-${lessonSlug}`;
}

export function loadReadingProgressSnapshot(courseSlug: string, lessonSlug: string): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(key(courseSlug, lessonSlug)) ?? "";
}

export function subscribeReadingProgress(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => onStoreChange();
  window.addEventListener(READING_PROGRESS_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(READING_PROGRESS_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function loadReadingProgress(courseSlug: string, lessonSlug: string): ReadingProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key(courseSlug, lessonSlug));
    return raw ? (JSON.parse(raw) as ReadingProgress) : null;
  } catch {
    return null;
  }
}

export function saveReadingProgress(progress: ReadingProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key(progress.courseSlug, progress.lessonSlug), JSON.stringify(progress));
  window.dispatchEvent(new CustomEvent(READING_PROGRESS_EVENT));
}

export function markLessonRead(courseSlug: string, lessonSlug: string): void {
  saveReadingProgress({
    courseSlug,
    lessonSlug,
    read: true,
    scrollPercent: 100,
    updatedAt: Date.now(),
  });
}

export function isLessonRead(courseSlug: string, lessonSlug: string): boolean {
  return loadReadingProgress(courseSlug, lessonSlug)?.read ?? false;
}

export function loadReadingModeEnabled(courseSlug: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(`${MODE_PREFIX}${courseSlug}`) === "true";
}

export function loadReadingModeSnapshot(courseSlug: string): string {
  if (typeof window === "undefined") return "false";
  return localStorage.getItem(`${MODE_PREFIX}${courseSlug}`) ?? "false";
}

export function saveReadingModeEnabled(courseSlug: string, enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${MODE_PREFIX}${courseSlug}`, enabled ? "true" : "false");
  window.dispatchEvent(new CustomEvent(READING_PROGRESS_EVENT));
}

export function isCoursePathStepDone(videoSlug: string, step: "course" | "lab" | "quiz"): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(`apple-mdm-path-${step}-${videoSlug}`) === "true";
}

export function loadCoursePathSnapshot(videoSlug: string): string {
  if (typeof window === "undefined") return "false:false:false";
  return [
    localStorage.getItem(`apple-mdm-path-course-${videoSlug}`) === "true",
    localStorage.getItem(`apple-mdm-path-lab-${videoSlug}`) === "true",
    localStorage.getItem(`apple-mdm-path-quiz-${videoSlug}`) === "true",
  ].join(":");
}

export function markCoursePathStep(videoSlug: string, step: "course" | "lab" | "quiz"): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`apple-mdm-path-${step}-${videoSlug}`, "true");
  window.dispatchEvent(new CustomEvent(READING_PROGRESS_EVENT));
}
