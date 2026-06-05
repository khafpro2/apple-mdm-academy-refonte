import type { Question } from "@/lib/types";

export type ExamSession = {
  quizSlug: string;
  questions: Question[];
  answers: Record<string, number>;
  flagged: string[];
  currentIndex: number;
  secondsLeft: number;
  startedAt: number;
  sessionSeed: string;
};

const PREFIX = "apple-mdm-exam-session-";

function key(quizSlug: string) {
  return `${PREFIX}${quizSlug}`;
}

export function loadExamSession(quizSlug: string): ExamSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key(quizSlug));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ExamSession;
    if (parsed.quizSlug !== quizSlug) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveExamSession(session: ExamSession): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key(session.quizSlug), JSON.stringify(session));
  } catch {
    /* quota exceeded — ignore */
  }
}

export function clearExamSession(quizSlug: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key(quizSlug));
}
