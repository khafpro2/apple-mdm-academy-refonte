import type { ApplePlatformName, OfficialSource, Question } from "@/lib/types";

export type ExamVendor = "Apple" | "Jamf" | "Microsoft";
export type ExamMode = "training" | "simulation";
export type ExamVerificationStatus = "official-verified" | "official-partial" | "needs-review" | "internal";
export type ExamDifficulty = "associate" | "professional" | "advanced" | "expert";
export type ExamQuestionType = "single-select" | "multi-select" | "practical-task" | "case-study";
export type ExamDisplayMode = "one-question" | "sectioned" | "review-grid";

export type ExamDomain = {
  id: string;
  label: string;
  weightPercent?: number;
  sourceVerified: boolean;
  courseSlugs?: string[];
  lessonHrefs?: string[];
};

export type ExamQuestionMetadata = {
  domain?: string;
  difficulty?: Question["difficulty"];
  appleVersion?: string;
  platforms?: ApplePlatformName[];
  providerTags?: Array<"apple" | "jamf" | "intune" | "entra">;
  level?: ExamDifficulty;
  disabled?: boolean;
  verificationStatus?: "verified" | "needs-review";
};

export type ExamModeBehavior = {
  questionCount?: number;
  durationMinutes?: number;
  timerRequired: boolean;
  timerCanPause: boolean;
  correctionTiming: "immediate" | "end-only";
  showExplanations: "always" | "after-answer" | "after-submit";
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  lockAnswers: boolean;
  allowResume: boolean;
};

export type ExamScoringConfig = {
  passingScore: number;
  scoreType: "percent" | "scaled";
  scaledPassingScore?: number;
  weighted: boolean;
};

export type ExamFormat = {
  id: string;
  routeSlug: string;
  quizSlug: string;
  officialName: string;
  vendor: ExamVendor;
  certification: string;
  durationMinutes: number | null;
  questionCount: number | null;
  passingScore: number | null;
  domains: ExamDomain[];
  difficulty: ExamDifficulty;
  questionTypes: ExamQuestionType[];
  displayMode: ExamDisplayMode;
  modes: Record<ExamMode, ExamModeBehavior>;
  scoring: ExamScoringConfig;
  verificationStatus: ExamVerificationStatus;
  sources: OfficialSource[];
  notes?: string[];
};

export type ExamAvailability = {
  available: number;
  required: number;
  deficit: number;
  fullSimulationAvailable: boolean;
  trainingAvailable: boolean;
  reason?: string;
};

export type ExamAttemptStatus = "in_progress" | "completed" | "expired";

export type ExamAttempt = {
  attemptId: string;
  examId: string;
  mode: ExamMode;
  status: ExamAttemptStatus;
  questions: ExamQuestion[];
  answers: Record<string, number | number[] | undefined>;
  startedAt: number;
  submittedAt?: number;
  elapsedSeconds: number;
  seed: string;
};

export type ExamSelectionCriteria = {
  seed: string;
  count: number;
  domains?: string[];
  domainWeights?: Record<string, number>;
  difficulties?: Question["difficulty"][];
  appleVersions?: string[];
  platforms?: ApplePlatformName[];
  providerTags?: Array<"apple" | "jamf" | "intune" | "entra">;
  level?: ExamDifficulty;
};

export type ExamQuestion = Question & ExamQuestionMetadata;
