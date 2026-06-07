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

function readAll(): ExamHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ExamHistoryEntry[];
  } catch {
    return [];
  }
}

function writeAll(entries: ExamHistoryEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, 100)));
  } catch {
    /* quota */
  }
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
  return readAll().filter((e) => e.routeSlug === routeSlug);
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
