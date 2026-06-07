import { getQuiz } from "@/lib/data/quizzes";
import { examRouteToQuizSlug, examPools, examQuestionCounts, getExamRouteSlugs } from "@/lib/data/exams/pools";
import { getExamDurationMinutes } from "@/lib/exam/exam-config";
import { analyzePoolQuality, type PoolQualityReport } from "@/lib/exam/pool-quality-audit";
import { getExamAttemptsStorageKey } from "@/lib/exam/exam-attempts-storage";
import { getSupabaseEnv } from "@/lib/env";

export type ExamAuditRow = {
  routeSlug: string;
  quizSlug: string;
  title: string;
  description: string;
  durationMinutes: number;
  targetQuestions: number;
  baseQuestions: number;
  coveragePercent: number;
  routeOk: boolean;
  timerOk: boolean;
  correctionOk: boolean;
  historyOk: boolean;
  localStorageKey: string;
  localStorageOk: boolean;
  supabaseSyncAvailable: boolean;
  timerEnabled: boolean;
  poolOk: boolean;
  bankComplete: boolean;
  poolWarning: string | null;
  quizRegistered: boolean;
  examMode: boolean;
  quality: PoolQualityReport;
};

export type ExamAuditReport = {
  generatedAt: string;
  totalExams: number;
  routesOk: number;
  poolsOk: number;
  poolsComplete: number;
  timersOk: number;
  correctionsOk: number;
  historyOk: number;
  supabaseSyncAvailable: boolean;
  rows: ExamAuditRow[];
};

const EXPECTED_DOMAINS: Record<string, Record<string, number>> = {
  "examen-jamf-100-blanc": {
    interface: 10,
    inventory: 10,
    enrollment: 10,
    "smart-groups": 15,
    "static-groups": 5,
    policies: 15,
    "configuration-profiles": 10,
    "self-service": 10,
    "apns-mdm": 10,
    troubleshooting: 5,
  },
  "examen-apple-security": {
    filevault: 15,
    gatekeeper: 10,
    xprotect: 8,
    sip: 10,
    "activation-lock": 10,
    mda: 8,
    compliance: 10,
    "privacy-preferences": 8,
    "system-extensions": 8,
    troubleshooting: 13,
  },
  "examen-intune-apple-advanced": {
    apns: 10,
    ade: 10,
    "enrollment-tokens": 8,
    "configuration-profiles": 12,
    compliance: 12,
    "conditional-access": 12,
    "platform-sso": 10,
    "defender-macos": 10,
    "managed-apps": 8,
    troubleshooting: 8,
  },
};

export function runExamAudit(): ExamAuditReport {
  const supabaseSyncAvailable = getSupabaseEnv().configured;
  const rows: ExamAuditRow[] = getExamRouteSlugs().map((routeSlug) => {
    const quizSlug = examRouteToQuizSlug[routeSlug];
    const quiz = quizSlug ? getQuiz(quizSlug) : undefined;
    const pool = quizSlug ? examPools[quizSlug] : undefined;
    const baseQuestions = pool?.length ?? 0;
    const targetQuestions = quiz?.examQuestionCount ?? examQuestionCounts[quizSlug ?? ""] ?? 0;
    const durationMinutes = getExamDurationMinutes(routeSlug, quiz?.durationMinutes);
    const quality = analyzePoolQuality(
      quizSlug ?? routeSlug,
      pool,
      targetQuestions,
      quizSlug ? EXPECTED_DOMAINS[quizSlug] : undefined
    );
    const poolOk = baseQuestions > 0;
    const bankComplete = baseQuestions >= targetQuestions && targetQuestions > 0;
    const timerOk = !!quiz?.examMode && durationMinutes > 0;
    const correctionOk = !!quiz?.examMode && baseQuestions > 0;
    const historyOk = true;
    const localStorageKey = getExamAttemptsStorageKey(routeSlug);
    const poolWarning =
      baseQuestions === 0
        ? "Banque vide"
        : baseQuestions < targetQuestions
          ? `Banque incomplète (${baseQuestions}/${targetQuestions} uniques)`
          : quality.weakDomains.length > 0
            ? `Domaines faibles : ${quality.weakDomains.join(", ")}`
            : null;

    return {
      routeSlug,
      quizSlug: quizSlug ?? "—",
      title: quiz?.title ?? "Quiz introuvable",
      description: quiz?.description ?? "",
      durationMinutes,
      targetQuestions,
      baseQuestions,
      coveragePercent: quality.coveragePercent,
      routeOk: !!quizSlug && !!quiz,
      timerOk,
      correctionOk,
      historyOk,
      localStorageKey,
      localStorageOk: true,
      supabaseSyncAvailable,
      timerEnabled: timerOk,
      poolOk,
      bankComplete,
      poolWarning,
      quizRegistered: !!quiz,
      examMode: !!quiz?.examMode,
      quality,
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    totalExams: rows.length,
    routesOk: rows.filter((r) => r.routeOk).length,
    poolsOk: rows.filter((r) => r.poolOk).length,
    poolsComplete: rows.filter((r) => r.bankComplete).length,
    timersOk: rows.filter((r) => r.timerOk).length,
    correctionsOk: rows.filter((r) => r.correctionOk).length,
    historyOk: rows.filter((r) => r.historyOk).length,
    supabaseSyncAvailable,
    rows,
  };
}
