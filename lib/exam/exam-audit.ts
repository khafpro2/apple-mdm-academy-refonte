import { getQuiz } from "@/lib/data/quizzes";
import { examRouteToQuizSlug, examPools, examQuestionCounts, getExamRouteSlugs } from "@/lib/data/exams/pools";
import { getExamDurationMinutes } from "@/lib/exam/exam-config";

export type ExamAuditRow = {
  routeSlug: string;
  quizSlug: string;
  title: string;
  description: string;
  durationMinutes: number;
  targetQuestions: number;
  baseQuestions: number;
  routeOk: boolean;
  timerEnabled: boolean;
  poolOk: boolean;
  poolWarning: string | null;
  quizRegistered: boolean;
  examMode: boolean;
};

export type ExamAuditReport = {
  generatedAt: string;
  totalExams: number;
  routesOk: number;
  poolsOk: number;
  rows: ExamAuditRow[];
};

export function runExamAudit(): ExamAuditReport {
  const rows: ExamAuditRow[] = getExamRouteSlugs().map((routeSlug) => {
    const quizSlug = examRouteToQuizSlug[routeSlug];
    const quiz = quizSlug ? getQuiz(quizSlug) : undefined;
    const pool = quizSlug ? examPools[quizSlug] : undefined;
    const baseQuestions = pool?.length ?? 0;
    const targetQuestions = quiz?.examQuestionCount ?? examQuestionCounts[quizSlug ?? ""] ?? 0;
    const durationMinutes = getExamDurationMinutes(routeSlug, quiz?.durationMinutes);
    const poolOk = baseQuestions > 0;
    const poolWarning =
      baseQuestions === 0
        ? "Banque vide"
        : baseQuestions < targetQuestions
          ? `Banque incomplète (${baseQuestions}/${targetQuestions} uniques)`
          : null;

    return {
      routeSlug,
      quizSlug: quizSlug ?? "—",
      title: quiz?.title ?? "Quiz introuvable",
      description: quiz?.description ?? "",
      durationMinutes,
      targetQuestions,
      baseQuestions,
      routeOk: !!quizSlug && !!quiz,
      timerEnabled: !!quiz?.examMode && durationMinutes > 0,
      poolOk,
      poolWarning,
      quizRegistered: !!quiz,
      examMode: !!quiz?.examMode,
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    totalExams: rows.length,
    routesOk: rows.filter((r) => r.routeOk).length,
    poolsOk: rows.filter((r) => r.poolOk).length,
    rows,
  };
}
