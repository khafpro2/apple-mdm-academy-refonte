import type { Question } from "@/lib/types";
import type { UserAnswer } from "@/lib/quiz/scoring";

export type ExamSession = {
  attemptId: string;
  routeSlug: string;
  quizSlug: string;
  mode: "training" | "simulation";
  status: "in_progress" | "completed" | "expired";
  questions: Question[];
  answers: Record<string, UserAnswer>;
  flagged: string[];
  currentIndex: number;
  secondsLeft: number;
  startedAt: number;
  expiresAt: number | null;
  updatedAt: number;
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
      if (parsed.routeSlug === routeSlug) value = normalizeSession(parsed);
    }
    if (!value && quizSlug && legacyRaw) {
      const parsed = JSON.parse(legacyRaw) as ExamSession & { routeSlug?: string };
      if (parsed.quizSlug === quizSlug) {
        value = normalizeSession({ ...parsed, routeSlug });
      }
    }
    if (value?.status === "in_progress" && value.expiresAt && Date.now() >= value.expiresAt) {
      value = {
        ...value,
        secondsLeft: 0,
        status: "expired",
        updatedAt: Date.now(),
      };
    } else if (value?.expiresAt && value.status === "in_progress") {
      value = {
        ...value,
        secondsLeft: Math.max(0, Math.ceil((value.expiresAt - Date.now()) / 1000)),
        updatedAt: Date.now(),
      };
    }
    sessionCache.set(cacheKey, { raw, legacyRaw, value });
    return value;
  } catch {
    return null;
  }
}

function normalizeSession(session: ExamSession & Partial<Pick<ExamSession, "attemptId" | "mode" | "status" | "expiresAt" | "updatedAt">>): ExamSession {
  const startedAt = session.startedAt || Date.now();
  const secondsLeft = Math.max(0, session.secondsLeft ?? 0);
  return {
    ...session,
    attemptId: session.attemptId ?? `${session.quizSlug}-${startedAt}`,
    mode: session.mode ?? "simulation",
    status: session.status ?? "in_progress",
    secondsLeft,
    startedAt,
    expiresAt: session.expiresAt ?? (secondsLeft > 0 ? startedAt + secondsLeft * 1000 : null),
    updatedAt: session.updatedAt ?? Date.now(),
  };
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
