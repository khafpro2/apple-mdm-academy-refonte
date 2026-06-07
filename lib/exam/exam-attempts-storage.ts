import type { UserAnswer } from "@/lib/quiz/scoring";

export type ExamAttemptRecord = {
  id: string;
  date: string;
  score: number;
  percent: number;
  elapsedSeconds: number;
  status: "completed" | "abandoned";
  passed: boolean;
  correct: number;
  total: number;
  answers: Record<string, UserAnswer>;
};

export type ExamAttemptStats = {
  lastAttempt: ExamAttemptRecord | null;
  bestScore: number | null;
  attemptCount: number;
};

const PREFIX = "apple-mdm-exam-attempts-";
const MAX_ATTEMPTS = 50;

function storageKey(routeSlug: string): string {
  return `${PREFIX}${routeSlug}`;
}

function readAttempts(routeSlug: string): ExamAttemptRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(routeSlug));
    if (!raw) return [];
    return JSON.parse(raw) as ExamAttemptRecord[];
  } catch {
    return [];
  }
}

function writeAttempts(routeSlug: string, attempts: ExamAttemptRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(routeSlug), JSON.stringify(attempts.slice(0, MAX_ATTEMPTS)));
    window.dispatchEvent(new CustomEvent("exam-attempts-updated", { detail: { routeSlug } }));
  } catch {
    /* quota */
  }
}

export function recordExamAttempt(
  routeSlug: string,
  payload: Omit<ExamAttemptRecord, "id" | "date"> & { date?: string }
): ExamAttemptRecord {
  const attempt: ExamAttemptRecord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    date: payload.date ?? new Date().toISOString(),
    score: payload.score,
    percent: payload.percent,
    elapsedSeconds: payload.elapsedSeconds,
    status: payload.status,
    passed: payload.passed,
    correct: payload.correct,
    total: payload.total,
    answers: payload.answers,
  };
  writeAttempts(routeSlug, [attempt, ...readAttempts(routeSlug)]);
  return attempt;
}

export function getExamAttempts(routeSlug: string): ExamAttemptRecord[] {
  return readAttempts(routeSlug);
}

export function getExamAttemptStats(routeSlug: string): ExamAttemptStats {
  const completed = readAttempts(routeSlug).filter((a) => a.status === "completed");
  if (completed.length === 0) {
    return { lastAttempt: null, bestScore: null, attemptCount: 0 };
  }
  return {
    lastAttempt: completed[0] ?? null,
    bestScore: Math.max(...completed.map((a) => a.percent)),
    attemptCount: completed.length,
  };
}

export function getExamAttemptsStorageKey(routeSlug: string): string {
  return storageKey(routeSlug);
}
