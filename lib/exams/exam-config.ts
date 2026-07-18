import { examFormats } from "@/lib/exams/exam-formats";
import { examPools, examRouteToQuizSlug } from "@/lib/data/exams/pools";
import { getQuiz } from "@/lib/data/quizzes";
import { calculateExamAvailability } from "@/lib/exams/availability";
import type { ExamAvailability, ExamFormat, ExamMode } from "@/lib/exams/exam-types";

export const EXAM_ROUTE_SLUGS = Object.keys(examRouteToQuizSlug);

export function getExamConfig(examId: string): ExamFormat | undefined {
  return getExamFormat(examId);
}

export function getExamFormat(routeSlug: string): ExamFormat | undefined {
  return examFormats[routeSlug];
}

export function getExamFormatByQuizSlug(quizSlug: string): ExamFormat | undefined {
  return Object.values(examFormats).find((format) => format.quizSlug === quizSlug);
}

export function getExamDurationMinutes(routeSlug: string, fallback?: number, mode: ExamMode = "simulation"): number {
  const format = getExamFormat(routeSlug);
  return format?.modes[mode].durationMinutes ?? format?.durationMinutes ?? fallback ?? 120;
}

export function getExamQuestionCount(routeSlug: string, fallback: number, mode: ExamMode = "simulation"): number {
  const format = getExamFormat(routeSlug);
  return format?.modes[mode].questionCount ?? format?.questionCount ?? fallback;
}

export function getExamPassingScore(routeSlug: string, fallback: number): number {
  return getExamFormat(routeSlug)?.scoring.passingScore ?? getExamFormat(routeSlug)?.passingScore ?? fallback;
}

export function getExamOfficialFormat(examId: string) {
  const format = getExamConfig(examId);
  if (!format) return null;

  return {
    id: format.id,
    title: format.officialName,
    provider: format.vendor,
    certification: format.certification,
    durationMinutes: format.durationMinutes,
    questionCount: format.questionCount,
    passingScore: format.passingScore,
    questionTypes: format.questionTypes,
    domains: format.domains,
    verificationStatus: format.verificationStatus,
    verifiedAt: format.sources[0]?.checkedAt ?? null,
    sources: format.sources,
    notes: format.notes ?? [],
  };
}

export function getExamSimulationConfig(examId: string, mode: ExamMode = "simulation") {
  const format = getExamConfig(examId);
  if (!format) return null;

  return {
    id: format.id,
    mode,
    behavior: format.modes[mode],
    durationMinutes: format.modes[mode].durationMinutes ?? null,
    questionCount: format.modes[mode].questionCount ?? null,
    passingScore: format.scoring.passingScore,
    scoreType: format.scoring.scoreType,
    scaledPassingScore: format.scoring.scaledPassingScore,
    weighted: format.scoring.weighted,
  };
}

export function getExamAvailability(examId: string, availableQuestionCount?: number, mode: ExamMode = "simulation"): ExamAvailability | null {
  const format = getExamConfig(examId);
  if (!format) return null;

  const quizSlug = format.quizSlug;
  const pool = examPools[quizSlug] ?? getQuiz(quizSlug)?.questions ?? [];
  const uniqueQuestions = new Set(pool.map((question) => question.id)).size;
  return calculateExamAvailability(format, availableQuestionCount ?? uniqueQuestions, mode);
}

export function shouldShowExplanations(mode: ExamMode, submitted: boolean, answered = false): boolean {
  if (mode === "simulation") return submitted;
  return submitted || answered;
}

export { createExamAttempt, scoreExamAttempt } from "@/lib/exams/attempts";
export { getExamDisplayMetadata } from "@/lib/exams/ui-metadata-adapter";
