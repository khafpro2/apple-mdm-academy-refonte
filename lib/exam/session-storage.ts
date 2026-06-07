import type { Question } from "@/lib/types";
import type { UserAnswer } from "@/lib/quiz/scoring";

export type ExamSession = {
  routeSlug: string;
  quizSlug: string;
  questions: Question[];
  answers: Record<string, UserAnswer>;
  flagged: string[];
  currentIndex: number;
  secondsLeft: number;
  startedAt: number;
  sessionSeed: string;
};

const PREFIX = "apple-mdm-exam-session-";

function key(routeSlug: string) {
  return `${PREFIX}${routeSlug}`;
}

export function loadExamSession(routeSlug: string, quizSlug?: string): ExamSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key(routeSlug));
    if (raw) {
      const parsed = JSON.parse(raw) as ExamSession;
      if (parsed.routeSlug === routeSlug) return parsed;
    }
    if (quizSlug) {
      const legacy = localStorage.getItem(`${PREFIX}${quizSlug}`);
      if (legacy) {
        const parsed = JSON.parse(legacy) as ExamSession & { routeSlug?: string };
        if (parsed.quizSlug === quizSlug) {
          return { ...parsed, routeSlug };
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function saveExamSession(session: ExamSession): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key(session.routeSlug), JSON.stringify(session));
    window.dispatchEvent(new CustomEvent("exam-session-updated", { detail: { routeSlug: session.routeSlug } }));
  } catch {
    /* quota exceeded */
  }
}

export function clearExamSession(routeSlug: string, quizSlug?: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key(routeSlug));
  if (quizSlug) localStorage.removeItem(`${PREFIX}${quizSlug}`);
}
