import { examPools } from "@/lib/data/exams/pools";
import { getQuiz } from "@/lib/data/quizzes";
import { calculateExamAvailability } from "@/lib/exams/availability";
import { examFormats } from "@/lib/exams/exam-formats";
import { buildExamFinalReport } from "@/lib/exams/report";
import { selectExamQuestions } from "@/lib/exams/selection";
import type { ExamFinalReport } from "@/lib/exams/report";
import type { ExamAttempt, ExamMode, ExamQuestion } from "@/lib/exams/exam-types";

function createAttemptId(examId: string, now: number): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 10);
  return `${examId}-${now}-${random}`;
}

function getExamQuestionBank(examId: string): ExamQuestion[] {
  const format = examFormats[examId];
  if (!format) return [];
  return (examPools[format.quizSlug] ?? getQuiz(format.quizSlug)?.questions ?? []) as ExamQuestion[];
}

export function createExamAttempt(
  examId: string,
  mode: ExamMode,
  options: { questions?: ExamQuestion[]; seed?: string; now?: number } = {},
): ExamAttempt {
  const format = examFormats[examId];
  if (!format) throw new Error(`Unknown exam: ${examId}`);

  const sourceQuestions = options.questions ?? getExamQuestionBank(examId);
  const uniqueAvailable = new Set(sourceQuestions.map((question) => question.id)).size;
  const availability = calculateExamAvailability(format, uniqueAvailable, mode);
  if (mode === "simulation" && !availability.fullSimulationAvailable) {
    throw new Error(availability.reason ?? "Simulation complète indisponible.");
  }
  if (mode === "training" && !availability.trainingAvailable) {
    throw new Error(availability.reason ?? "Entraînement indisponible.");
  }

  const now = options.now ?? Date.now();
  const seed = options.seed ?? `${examId}-${mode}-${now}`;
  const requestedCount = format.modes[mode].questionCount ?? availability.required;
  const selected = selectExamQuestions(sourceQuestions, {
    seed,
    count: mode === "training" ? Math.min(requestedCount, uniqueAvailable) : requestedCount,
  });

  return {
    attemptId: createAttemptId(examId, now),
    examId,
    mode,
    status: "in_progress",
    questions: selected.selected,
    answers: {},
    startedAt: now,
    elapsedSeconds: 0,
    seed,
  };
}

export function scoreExamAttempt(attempt: ExamAttempt): ExamFinalReport {
  const format = examFormats[attempt.examId];
  const passingScore = format?.scoring.passingScore ?? 70;
  return buildExamFinalReport({
    questions: attempt.questions,
    answers: attempt.answers,
    passingScore,
    elapsedSeconds: attempt.elapsedSeconds,
  });
}
