import type { ExamMode, ExamVerificationStatus } from "@/lib/exams/exam-types";
import { calculateExamAvailability } from "@/lib/exams/availability";
import { getExamFormat } from "@/lib/exams/exam-config";

export type ExamBankStatus = "complete" | "incomplete" | "empty" | "unknown";

export type ExamDisplaySource = {
  title: string;
  publisher: string;
  url: string;
  checkedAt: string;
};

export type ExamCursorOfficialPanel = {
  title: string;
  provider: string;
  duration: number | null;
  questionCount: number | null;
  passingScore: number | null;
  verificationStatus: ExamVerificationStatus;
  verifiedAt: string | null;
  sources: ExamDisplaySource[];
};

export type ExamCursorSimulationPanel = {
  mode: ExamMode;
  duration: number | null;
  availableQuestions: number;
  targetQuestions: number;
  passingScore: number;
  fullSimulationAvailable: boolean;
  warning: string | null;
};

export type ExamOfficialDisplayMetadata = {
  officialName: string;
  certification: string;
  vendor: string;
  durationLabel: string;
  questionCountLabel: string;
  passingScoreLabel: string;
  questionTypesLabel: string;
  verificationStatus: ExamVerificationStatus;
  verifiedAt: string | null;
  sources: ExamDisplaySource[];
  notes: string[];
};

export type ExamSimulationDisplayMetadata = {
  durationMinutes: number | null;
  targetQuestionCount: number | null;
  availableQuestionCount: number | null;
  effectiveQuestionCount: number | null;
  passingScore: number;
  providerLabel: string;
  modes: ExamMode[];
  bankStatus: ExamBankStatus;
  fullSimulationAvailable: boolean;
  trainingAvailable: boolean;
  warning: string | null;
};

export type ExamDisplayMetadata = {
  routeSlug: string;
  official: ExamOfficialDisplayMetadata;
  simulation: ExamSimulationDisplayMetadata;
  officialPanel: ExamCursorOfficialPanel | null;
  simulationPanel: ExamCursorSimulationPanel;
  disclaimer: string;
};

function formatQuestionType(type: string): string {
  switch (type) {
    case "single-select":
      return "choix unique";
    case "multi-select":
      return "choix multiples";
    case "practical-task":
      return "tâche pratique";
    case "case-study":
      return "cas pratique";
    default:
      return type;
  }
}

function formatOfficialQuestionCount(count: number | null): string {
  return count === null ? "Non confirmé" : `environ ${count} questions`;
}

function formatOfficialDuration(minutes: number | null): string {
  return minutes === null ? "Non confirmée" : `${minutes} min`;
}

function formatOfficialPassingScore(value: number | null, scoreType: "percent" | "scaled", scaledPassingScore?: number): string {
  if (scoreType === "scaled" && scaledPassingScore) return `score scalé ${scaledPassingScore}`;
  return value === null ? "Non confirmé" : `${value}%`;
}

function getBankStatus(available: number | null, target: number | null): ExamBankStatus {
  if (available === null || target === null || target <= 0) return "unknown";
  if (available <= 0) return "empty";
  if (available < target) return "incomplete";
  return "complete";
}

export function getExamDisplayMetadata(routeSlug: string, availableQuestionCount?: number): ExamDisplayMetadata | null {
  const format = getExamFormat(routeSlug);
  if (!format) return null;

  const targetQuestionCount = format.modes.simulation.questionCount ?? format.questionCount;
  const available = typeof availableQuestionCount === "number" ? availableQuestionCount : targetQuestionCount;
  const availability = calculateExamAvailability(format, available ?? 0);
  const bankStatus = getBankStatus(availability.available, availability.required);
  const fullSimulationAvailable = availability.fullSimulationAvailable;
  const effectiveQuestionCount =
    targetQuestionCount === null ? availability.available : Math.min(availability.available, targetQuestionCount);
  const sources = format.sources.map((source) => ({
    title: source.title,
    publisher: source.publisher,
    url: source.url,
    checkedAt: source.checkedAt,
  }));
  const warning =
    bankStatus === "incomplete"
      ? `Banque en préparation : ${availability.available} questions uniques disponibles sur ${availability.required} visées.`
      : bankStatus === "empty"
        ? "Banque vide : aucun entraînement disponible."
        : null;
  const officialPanel =
    format.verificationStatus === "internal"
      ? null
      : {
          title: format.officialName,
          provider: format.vendor,
          duration: format.durationMinutes,
          questionCount: format.questionCount,
          passingScore: format.passingScore,
          verificationStatus: format.verificationStatus,
          verifiedAt: format.sources[0]?.checkedAt ?? null,
          sources,
        };

  return {
    routeSlug,
    official: {
      officialName: format.officialName,
      certification: format.certification,
      vendor: format.vendor,
      durationLabel: formatOfficialDuration(format.durationMinutes),
      questionCountLabel: formatOfficialQuestionCount(format.questionCount),
      passingScoreLabel: formatOfficialPassingScore(
        format.passingScore,
        format.scoring.scoreType,
        format.scoring.scaledPassingScore,
      ),
      questionTypesLabel: format.questionTypes.map(formatQuestionType).join(", "),
      verificationStatus: format.verificationStatus,
      verifiedAt: format.sources[0]?.checkedAt ?? null,
      sources,
      notes: format.notes ?? [],
    },
    simulation: {
      durationMinutes: format.modes.simulation.durationMinutes ?? null,
      targetQuestionCount,
      availableQuestionCount: availability.available,
      effectiveQuestionCount,
      passingScore: format.scoring.passingScore,
      providerLabel: format.vendor,
      modes: ["training", "simulation"],
      bankStatus,
      fullSimulationAvailable,
      trainingAvailable: availability.trainingAvailable,
      warning,
    },
    officialPanel,
    simulationPanel: {
      mode: "simulation",
      duration: format.modes.simulation.durationMinutes ?? null,
      availableQuestions: availability.available,
      targetQuestions: availability.required,
      passingScore: format.scoring.passingScore,
      fullSimulationAvailable,
      warning,
    },
    disclaimer:
      format.verificationStatus === "internal"
        ? "Examen interne Apple MDM Academy : ce format ne représente pas une certification officielle éditeur."
        : "Simulation de préparation indépendante : aucun contenu officiel d'examen n'est reproduit.",
  };
}
