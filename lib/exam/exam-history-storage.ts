import type { UserAnswer } from "@/lib/quiz/scoring";
import { recordExamAttempt } from "@/lib/exam/exam-attempts-storage";

export type ExamHistoryEntry = {
  routeSlug: string;
  quizSlug: string;
  quizTitle: string;
  percent: number;
  passed: boolean;
  elapsedSeconds: number;
  completedAt: string;
  status: "completed" | "in_progress";
};

const STORAGE_KEY = "apple-mdm-exam-history";
const HISTORY_UPDATED_EVENT = "exam-history-updated";
const EMPTY_HISTORY: ExamHistoryEntry[] = [];

let cachedRaw: string | null = null;
let cachedHistory: ExamHistoryEntry[] = EMPTY_HISTORY;
const routeHistoryCache = new Map<string, { source: ExamHistoryEntry[]; value: ExamHistoryEntry[] }>();

function readAll(): ExamHistoryEntry[] {
  if (typeof window === "undefined") return EMPTY_HISTORY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedHistory;

    cachedRaw = raw;
    cachedHistory = raw ? (JSON.parse(raw) as ExamHistoryEntry[]) : EMPTY_HISTORY;
    return cachedHistory;
  } catch {
    cachedRaw = null;
    cachedHistory = EMPTY_HISTORY;
    return EMPTY_HISTORY;
  }
}

function writeAll(entries: ExamHistoryEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    const nextEntries = entries.slice(0, 100);
    const raw = JSON.stringify(nextEntries);
    cachedRaw = raw;
    cachedHistory = nextEntries;
    localStorage.setItem(STORAGE_KEY, raw);
    window.dispatchEvent(new CustomEvent(HISTORY_UPDATED_EVENT));
  } catch {
    /* quota */
  }
}

export function subscribeToExamHistory(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) callback();
  };
  const onCustom = () => callback();
  window.addEventListener("storage", onStorage);
  window.addEventListener(HISTORY_UPDATED_EVENT, onCustom);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(HISTORY_UPDATED_EVENT, onCustom);
  };
}

export function upsertExamHistory(entry: ExamHistoryEntry): void {
  const all = readAll().filter(
    (e) => !(e.routeSlug === entry.routeSlug && e.status === entry.status)
  );
  all.unshift(entry);
  writeAll(all);
}

export function markExamInProgress(routeSlug: string, quizSlug: string, quizTitle: string): void {
  upsertExamHistory({
    routeSlug,
    quizSlug,
    quizTitle,
    percent: 0,
    passed: false,
    elapsedSeconds: 0,
    completedAt: new Date().toISOString(),
    status: "in_progress",
  });
}

export function recordExamCompletion(
  routeSlug: string,
  quizSlug: string,
  quizTitle: string,
  percent: number,
  passed: boolean,
  elapsedSeconds: number,
  detail?: { correct: number; total: number; answers: Record<string, UserAnswer> }
): void {
  const withoutProgress = readAll().filter(
    (e) => !(e.routeSlug === routeSlug && e.status === "in_progress")
  );
  withoutProgress.unshift({
    routeSlug,
    quizSlug,
    quizTitle,
    percent,
    passed,
    elapsedSeconds,
    completedAt: new Date().toISOString(),
    status: "completed",
  });
  writeAll(withoutProgress);

  recordExamAttempt(routeSlug, {
    score: percent,
    percent,
    elapsedSeconds,
    status: "completed",
    passed,
    correct: detail?.correct ?? 0,
    total: detail?.total ?? 0,
    answers: detail?.answers ?? {},
  });
}

export function getExamHistory(): ExamHistoryEntry[] {
  return readAll();
}

export function getExamHistoryForRoute(routeSlug: string): ExamHistoryEntry[] {
  const history = readAll();
  const cached = routeHistoryCache.get(routeSlug);
  if (cached?.source === history) return cached.value;

  const value = history.filter((e) => e.routeSlug === routeSlug);
  routeHistoryCache.set(routeSlug, { source: history, value });
  return value;
}

export function getBestScoreForRoute(routeSlug: string): number | null {
  const completed = getExamHistoryForRoute(routeSlug).filter((e) => e.status === "completed");
  if (completed.length === 0) return null;
  return Math.max(...completed.map((e) => e.percent));
}

export function getRecommendedExams(completedRouteSlugs: string[]): string[] {
  const priority = ["jamf-100", "jamf-200", "intune-apple", "apple-it-professional", "apple-security"];
  return priority.filter((slug) => !completedRouteSlugs.includes(slug)).slice(0, 3);
}
