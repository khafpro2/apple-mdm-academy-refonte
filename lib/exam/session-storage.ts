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
const EXAM_SESSION_UPDATED_EVENT = "exam-session-updated";
const sessionCache = new Map<string, { raw: string | null; legacyRaw: string | null; value: ExamSession | null }>();

function key(routeSlug: string) {
  return `${PREFIX}${routeSlug}`;
}

export function loadExamSession(routeSlug: string, quizSlug?: string): ExamSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key(routeSlug));
    const legacyRaw = quizSlug ? localStorage.getItem(`${PREFIX}${quizSlug}`) : null;
    const cacheKey = `${routeSlug}:${quizSlug ?? ""}`;
    const cached = sessionCache.get(cacheKey);
    if (cached?.raw === raw && cached.legacyRaw === legacyRaw) return cached.value;

    let value: ExamSession | null = null;
    if (raw) {
      const parsed = JSON.parse(raw) as ExamSession;
      if (parsed.routeSlug === routeSlug) value = parsed;
    }
    if (!value && quizSlug && legacyRaw) {
      const parsed = JSON.parse(legacyRaw) as ExamSession & { routeSlug?: string };
      if (parsed.quizSlug === quizSlug) {
        value = { ...parsed, routeSlug };
      }
    }
    sessionCache.set(cacheKey, { raw, legacyRaw, value });
    return value;
  } catch {
    return null;
  }
}

export function saveExamSession(session: ExamSession): void {
  if (typeof window === "undefined") return;
  try {
    const raw = JSON.stringify(session);
    localStorage.setItem(key(session.routeSlug), raw);
    sessionCache.clear();
    window.dispatchEvent(new CustomEvent(EXAM_SESSION_UPDATED_EVENT, { detail: { routeSlug: session.routeSlug } }));
  } catch {
    /* quota exceeded */
  }
}

export function clearExamSession(routeSlug: string, quizSlug?: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key(routeSlug));
  if (quizSlug) localStorage.removeItem(`${PREFIX}${quizSlug}`);
  sessionCache.clear();
  window.dispatchEvent(new CustomEvent(EXAM_SESSION_UPDATED_EVENT, { detail: { routeSlug } }));
}

export function subscribeToExamSession(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key.startsWith(PREFIX)) callback();
  };
  const onCustom = () => callback();
  window.addEventListener("storage", onStorage);
  window.addEventListener(EXAM_SESSION_UPDATED_EVENT, onCustom);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(EXAM_SESSION_UPDATED_EVENT, onCustom);
  };
}
