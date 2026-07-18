import type { ExamMode } from "@/lib/exams/exam-types";

export type ExamTimerState = {
  attemptId?: string;
  examId?: string;
  mode: ExamMode;
  durationSeconds: number;
  secondsLeft: number;
  elapsedSeconds: number;
  startedAt: number;
  endedAt?: number;
  updatedAt: number;
  paused: boolean;
  expired: boolean;
  submitted: boolean;
};

export function createExamTimer(
  mode: ExamMode,
  durationMinutes: number,
  now = Date.now(),
  metadata: { attemptId?: string; examId?: string } = {},
): ExamTimerState {
  const durationSeconds = Math.max(0, durationMinutes * 60);
  return {
    attemptId: metadata.attemptId,
    examId: metadata.examId,
    mode,
    durationSeconds,
    secondsLeft: durationSeconds,
    elapsedSeconds: 0,
    startedAt: now,
    updatedAt: now,
    paused: false,
    expired: durationSeconds === 0,
    submitted: false,
  };
}

export function tickExamTimer(state: ExamTimerState, now = Date.now()): ExamTimerState {
  if (state.paused || state.expired || state.submitted) return { ...state, updatedAt: now };
  const delta = Math.max(0, Math.floor((now - state.updatedAt) / 1000));
  const secondsLeft = Math.max(0, state.secondsLeft - delta);
  return {
    ...state,
    secondsLeft,
    elapsedSeconds: Math.min(state.durationSeconds, state.elapsedSeconds + delta),
    updatedAt: now,
    expired: secondsLeft === 0,
  };
}

export function submitExamTimer(state: ExamTimerState, now = Date.now()): ExamTimerState {
  if (state.submitted) return state;
  const ticked = tickExamTimer(state, now);
  return {
    ...ticked,
    secondsLeft: Math.max(0, ticked.secondsLeft),
    endedAt: now,
    updatedAt: now,
    submitted: true,
  };
}

export function pauseExamTimer(state: ExamTimerState, now = Date.now()): ExamTimerState {
  if (state.mode !== "training") return state;
  const ticked = tickExamTimer(state, now);
  return { ...ticked, paused: true, updatedAt: now };
}

export function resumeExamTimer(state: ExamTimerState, now = Date.now()): ExamTimerState {
  if (state.mode !== "training") return state;
  return { ...state, paused: false, updatedAt: now };
}

export function serializeExamTimer(state: ExamTimerState): string {
  return JSON.stringify(state);
}

export function restoreExamTimer(raw: string | null, now = Date.now()): ExamTimerState | null {
  if (!raw) return null;
  try {
    return tickExamTimer(JSON.parse(raw) as ExamTimerState, now);
  } catch {
    return null;
  }
}

export function restoreExamTimerForAttempt(
  raw: string | null,
  expected: { attemptId: string; examId: string },
  now = Date.now(),
): ExamTimerState | null {
  const restored = restoreExamTimer(raw, now);
  if (!restored) return null;
  if (restored.attemptId !== expected.attemptId || restored.examId !== expected.examId) return null;
  return restored;
}
