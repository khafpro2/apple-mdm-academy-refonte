/** Progression leçons — localStorage (fallback si Supabase indisponible) */

export type LessonProgressEntry = {
  lessonSlug: string;
  courseSlug: string;
  completedAt: string;
  score: number;
};

const STORAGE_KEY = "apple-mdm-lesson-progress";
const UPDATED_EVENT = "apple-mdm-lesson-progress-updated";
const EMPTY: LessonProgressEntry[] = [];

let cachedRaw: string | null = null;
let cachedEntries: LessonProgressEntry[] = EMPTY;

function readAll(): LessonProgressEntry[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedEntries;
    cachedRaw = raw;
    cachedEntries = raw ? (JSON.parse(raw) as LessonProgressEntry[]) : EMPTY;
    return cachedEntries;
  } catch {
    cachedRaw = null;
    cachedEntries = EMPTY;
    return EMPTY;
  }
}

function writeAll(entries: LessonProgressEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    const raw = JSON.stringify(entries);
    cachedRaw = raw;
    cachedEntries = entries;
    localStorage.setItem(STORAGE_KEY, raw);
    window.dispatchEvent(new CustomEvent(UPDATED_EVENT));
  } catch {
    /* quota */
  }
}

export function subscribeLessonProgress(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) callback();
  };
  const onCustom = () => callback();
  window.addEventListener("storage", onStorage);
  window.addEventListener(UPDATED_EVENT, onCustom);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(UPDATED_EVENT, onCustom);
  };
}

export function saveLessonProgressLocal(
  lessonSlug: string,
  courseSlug: string,
  score = 100
): void {
  const all = readAll().filter((e) => e.lessonSlug !== lessonSlug);
  all.unshift({
    lessonSlug,
    courseSlug,
    completedAt: new Date().toISOString(),
    score,
  });
  writeAll(all);
}

export function isLessonCompletedLocal(lessonSlug: string): boolean {
  return readAll().some((e) => e.lessonSlug === lessonSlug);
}

export function getCompletedLessonSlugsLocal(): string[] {
  return readAll().map((e) => e.lessonSlug);
}

export function getLessonProgressLocal(lessonSlug: string): LessonProgressEntry | null {
  return readAll().find((e) => e.lessonSlug === lessonSlug) ?? null;
}
