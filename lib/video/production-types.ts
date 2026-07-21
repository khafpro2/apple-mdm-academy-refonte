export const VIDEO_PRODUCTION_STATUSES = [
  "idea",
  "brief",
  "technical-review",
  "script-ready",
  "lab-ready",
  "recording",
  "editing",
  "narration",
  "subtitles",
  "review",
  "approved",
  "published",
  "blocked",
  "deprecated",
] as const;

export type VideoProductionStatus = (typeof VIDEO_PRODUCTION_STATUSES)[number];

export const VIDEO_PLATFORMS = ["Apple", "Microsoft", "Jamf"] as const;
export type VideoPlatform = (typeof VIDEO_PLATFORMS)[number];

export const VIDEO_LEVELS = ["debutant", "intermediaire", "avance"] as const;
export type VideoLevel = (typeof VIDEO_LEVELS)[number];

export const VIDEO_PRIORITIES = ["P0", "P1", "P2"] as const;
export type VideoPriority = (typeof VIDEO_PRIORITIES)[number];

export const VIDEO_VALIDATION_STATUSES = [
  "pending",
  "pending-verification",
  "outline",
  "draft",
  "missing",
  "ready",
  "approved",
  "blocked",
] as const;
export type VideoValidationStatus = (typeof VIDEO_VALIDATION_STATUSES)[number];

export type VideoChapter = {
  id: string;
  title: string;
  startSeconds: number;
  endSeconds: number;
  objective: string;
};

export type VideoTechnicalClaim = {
  id: string;
  statement: string;
  status: "pending-verification" | "verified" | "rejected";
  sourceRequired: boolean;
  validatedAt?: string | null;
  sourceReference?: string;
  notes?: string;
  critical?: boolean;
};

export type VideoTechnicalVerification = {
  id: string;
  label: string;
  status: "pending-verification" | "verified" | "blocked";
  critical: boolean;
  notes?: string;
};

export type VideoCaptureRequirement = {
  id: string;
  chapter: string;
  objective: string;
  required: boolean;
  status: "missing" | "planned" | "captured" | "approved";
  platformArea: string;
  action: string;
  expectedResult: string;
  sensitiveFields: string[];
  maskingRequired: boolean;
  sourceMediaPath?: string;
  notes?: string;
};

export type VideoLabRequirement = {
  id: string;
  label: string;
  status: VideoValidationStatus;
  notes?: string;
};

export type VideoMediaFormat = {
  container: "MP4" | "WebVTT" | "WebP" | "Markdown";
  codec?: string;
  resolution?: string;
  fps?: number;
  audio?: string;
  language?: string;
  aspectRatio?: string;
};

export type VideoMediaAsset = {
  kind: "video" | "subtitles" | "poster" | "transcript";
  expectedFilename: string;
  format: VideoMediaFormat;
  path?: string;
  status: "missing" | "present" | "approved";
};

export type VideoMedia = {
  assets: VideoMediaAsset[];
};

export type VideoSecurityRequirement = {
  id: string;
  label: string;
  placeholder: string;
  blocking: boolean;
};

export type VideoStoryboardPlan = {
  id: string;
  startSeconds: number;
  endSeconds: number;
  durationSeconds: number;
  chapter: string;
  objective: string;
  captureIds: string[];
  narrationSummary: string;
  onScreenText: string[];
  zoom: string;
  annotation: string;
  avatar: "none" | "intro" | "transition" | "recap";
  transition: string;
  sensitiveData: string[];
  validationCriteria: string[];
};

export type VideoNarrationOutline = {
  hook: string;
  introduction: string;
  smartGroupsChapter: string;
  transition: string;
  fileVaultChapter: string;
  conclusion: string;
  finalSummary: string;
  heygenVersion: string;
  pronunciations: Record<string, string>;
  tone: string;
  pace: string;
  status: "outline" | "draft" | "script-ready";
};

export type VideoProductionEntry = {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  platform: VideoPlatform;
  level: VideoLevel;
  priority: VideoPriority;
  durationTarget: string;
  durationTargetMinSeconds: number;
  durationTargetMaxSeconds: number;
  status: VideoProductionStatus;
  version: string;
  courseIds: string[];
  lastValidatedAt?: string | null;
  parentVideoId?: string;
  chapterIds: string[];
  relatedVideoIds: string[];
  splitCandidate: boolean;
  splitRecommendation: string;
  technicalReviewStatus: VideoValidationStatus;
  labStatus: VideoValidationStatus;
  captureStatus: VideoValidationStatus;
  narrationStatus: VideoValidationStatus;
  subtitleStatus: VideoValidationStatus;
  mediaStatus: VideoValidationStatus;
  securityReviewStatus: VideoValidationStatus;
  courseIntegrationStatus: VideoValidationStatus;
  learningObjectives: string[];
  expectedOutcomes: string[];
  technicalClaims: VideoTechnicalClaim[];
  technicalVerifications: VideoTechnicalVerification[];
  chapters: VideoChapter[];
  captures: VideoCaptureRequirement[];
  labRequirements: VideoLabRequirement[];
  securityRequirements: VideoSecurityRequirement[];
  storyboard: VideoStoryboardPlan[];
  narration: VideoNarrationOutline;
  media: VideoMedia;
  officialSourcesToConsult: string[];
  validationCriteria: string[];
  notes?: string;
};

export type VideoValidationIssue = {
  code: string;
  severity: "error" | "warning";
  message: string;
  videoId?: string;
  planId?: string;
  captureId?: string;
  mediaKind?: string;
};

export type VideoValidationResult = {
  valid: boolean;
  errors: VideoValidationIssue[];
  warnings: VideoValidationIssue[];
};
