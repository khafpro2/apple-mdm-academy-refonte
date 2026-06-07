import type { Question } from "@/lib/types";
import type { UserAnswer } from "@/lib/quiz/scoring";

export type ExamResultPayload = {
  routeSlug: string;
  quizSlug: string;
  quizTitle: string;
  passingScore: number;
  questions: Question[];
  answers: Record<string, UserAnswer>;
  percent: number;
  correct: number;
  total: number;
  passed: boolean;
  elapsedSeconds: number;
  completedAt: string;
  resultId?: string | null;
  tierLabel: string;
};

const PREFIX = "apple-mdm-exam-result-";

function key(routeSlug: string) {
  return `${PREFIX}${routeSlug}`;
}

export function saveExamResult(routeSlug: string, payload: ExamResultPayload): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(key(routeSlug), JSON.stringify(payload));
  } catch {
    /* quota */
  }
}

export function loadExamResult(routeSlug: string): ExamResultPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(key(routeSlug));
    if (!raw) return null;
    return JSON.parse(raw) as ExamResultPayload;
  } catch {
    return null;
  }
}

export function clearExamResult(routeSlug: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(key(routeSlug));
}
