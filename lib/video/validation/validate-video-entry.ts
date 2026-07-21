import { existsSync, statSync } from "node:fs";
import path from "node:path";
import {
  VIDEO_LEVELS,
  VIDEO_PLATFORMS,
  VIDEO_PRIORITIES,
  VIDEO_PRODUCTION_STATUSES,
  VIDEO_VALIDATION_STATUSES,
  type VideoCaptureRequirement,
  type VideoMediaAsset,
  type VideoProductionEntry,
  type VideoValidationIssue,
  type VideoValidationResult,
} from "@/lib/video/production-types";

const VERSION_RE = /^v[1-9]\d*$/;
const ID_RE = /^video-[a-z0-9]+(?:-[a-z0-9]+)*-v[1-9]\d*$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const ALLOWED_SENSITIVE_PLACEHOLDERS = [
  "[CLÉ MASQUÉE]",
  "[COMPTE DE LABORATOIRE]",
  "[TENANT DE DÉMONSTRATION]",
  "[URL MASQUÉE]",
  "[NUMÉRO DE SÉRIE FICTIF]",
  "[APPAREIL DE TEST]",
] as const;

const PLACEHOLDER_SET = new Set<string>(ALLOWED_SENSITIVE_PLACEHOLDERS);
const PATH_PREFIXES = ["/public/videos/", "/public/video-assets/", "/public/media/video-production/"];

const MEDIA_EXTENSION: Record<VideoMediaAsset["kind"], string> = {
  video: ".mp4",
  subtitles: ".vtt",
  poster: ".webp",
  transcript: ".md",
};

const FORBIDDEN_SECRET_PATTERNS = [
  /-----BEGIN [A-Z ]+PRIVATE KEY-----/i,
  /\bsk-[A-Za-z0-9_-]{12,}\b/,
  /\b[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}\b/i,
  /\b[A-Z0-9]{4,}-[A-Z0-9]{4,}-[A-Z0-9]{4,}\b/,
  /https:\/\/[a-z0-9.-]+\.jamfcloud\.com/i,
];

function error(code: string, message: string, extra: Partial<VideoValidationIssue> = {}): VideoValidationIssue {
  return { code, severity: "error", message, ...extra };
}

function warning(code: string, message: string, extra: Partial<VideoValidationIssue> = {}): VideoValidationIssue {
  return { code, severity: "warning", message, ...extra };
}

function hasValidPathPrefix(value: string): boolean {
  return PATH_PREFIXES.some((prefix) => value.startsWith(prefix));
}

function pathToDisk(repoRoot: string, publicPath: string): string {
  return path.join(repoRoot, publicPath.replace(/^\//, ""));
}

function checkTextForSecrets(text: string): boolean {
  return FORBIDDEN_SECRET_PATTERNS.some((pattern) => pattern.test(text));
}

function getCaptureById(captures: VideoCaptureRequirement[]): Map<string, VideoCaptureRequirement> {
  return new Map(captures.map((capture) => [capture.id, capture]));
}

export type ValidateVideoProductionOptions = {
  repoRoot: string;
};

export function validateVideoProductionEntries(
  entries: VideoProductionEntry[],
  options: ValidateVideoProductionOptions
): VideoValidationResult {
  const issues: VideoValidationIssue[] = [];
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();

  for (const entry of entries) {
    if (seenIds.has(entry.id)) {
      issues.push(error("video-id-duplicate", `Duplicate video id "${entry.id}"`, { videoId: entry.id }));
    }
    seenIds.add(entry.id);

    if (seenSlugs.has(entry.slug)) {
      issues.push(error("video-slug-duplicate", `Duplicate video slug "${entry.slug}"`, { videoId: entry.id }));
    }
    seenSlugs.add(entry.slug);

    issues.push(...validateVideoProductionEntry(entry, options));
  }

  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warning");
  return { valid: errors.length === 0, errors, warnings };
}

export function validateVideoProductionEntry(
  entry: VideoProductionEntry,
  options: ValidateVideoProductionOptions
): VideoValidationIssue[] {
  const issues: VideoValidationIssue[] = [];
  const captureById = getCaptureById(entry.captures);
  const chapterIds = new Set(entry.chapters.map((chapter) => chapter.id));
  const isApprovedLike = entry.status === "approved" || entry.status === "published";

  if (!ID_RE.test(entry.id)) {
    issues.push(error("video-id-format", "Video id must match video-*-vN.", { videoId: entry.id }));
  }
  if (!SLUG_RE.test(entry.slug)) {
    issues.push(error("video-slug-format", "Slug must be lowercase kebab-case.", { videoId: entry.id }));
  }
  if (!VIDEO_PLATFORMS.includes(entry.platform)) {
    issues.push(error("video-platform", `Invalid platform "${entry.platform}".`, { videoId: entry.id }));
  }
  if (!VIDEO_LEVELS.includes(entry.level)) {
    issues.push(error("video-level", `Invalid level "${entry.level}".`, { videoId: entry.id }));
  }
  if (!VIDEO_PRIORITIES.includes(entry.priority)) {
    issues.push(error("video-priority", `Invalid priority "${entry.priority}".`, { videoId: entry.id }));
  }
  if (!VIDEO_PRODUCTION_STATUSES.includes(entry.status)) {
    issues.push(error("video-status", `Invalid status "${entry.status}".`, { videoId: entry.id }));
  }
  if (!VERSION_RE.test(entry.version)) {
    issues.push(error("video-version", "Version must match vN.", { videoId: entry.id }));
  }
  if (!Array.isArray(entry.courseIds) || entry.courseIds.length === 0) {
    issues.push(error("video-courseids", "courseIds must be a non-empty array.", { videoId: entry.id }));
  }

  if (entry.lastValidatedAt && !ISO_DATE_RE.test(entry.lastValidatedAt)) {
    issues.push(error("video-last-validated-format", "lastValidatedAt must use YYYY-MM-DD.", { videoId: entry.id }));
  }
  if (isApprovedLike && !entry.lastValidatedAt) {
    issues.push(error("video-last-validated-required", "lastValidatedAt is required for approved or published videos.", { videoId: entry.id }));
  }

  for (const statusField of [
    "technicalReviewStatus",
    "labStatus",
    "captureStatus",
    "narrationStatus",
    "subtitleStatus",
    "mediaStatus",
    "securityReviewStatus",
    "courseIntegrationStatus",
  ] as const) {
    if (!VIDEO_VALIDATION_STATUSES.includes(entry[statusField])) {
      issues.push(error("video-validation-status", `${statusField} has invalid value "${entry[statusField]}".`, { videoId: entry.id }));
    }
  }

  issues.push(...validateTechnicalClaims(entry));
  issues.push(...validateSecurity(entry));
  issues.push(...validateCaptures(entry, chapterIds, options.repoRoot));
  issues.push(...validateStoryboard(entry, captureById, chapterIds));
  issues.push(...validateMedia(entry, options.repoRoot));

  if (isApprovedLike) {
    if (entry.technicalReviewStatus !== "approved") {
      issues.push(error("approval-technical-review", "Approved videos require approved technical review.", { videoId: entry.id }));
    }
    if (entry.securityReviewStatus !== "approved") {
      issues.push(error("approval-security-review", "Approved videos require approved security review.", { videoId: entry.id }));
    }
    if (entry.mediaStatus !== "approved") {
      issues.push(error("approval-media-review", "Approved videos require approved media status.", { videoId: entry.id }));
    }
  }

  if (entry.status === "published" && entry.courseIntegrationStatus !== "approved") {
    issues.push(error("video-published-without-approved-state", "Published videos require approved course integration.", { videoId: entry.id }));
  }

  for (const text of JSON.stringify(entry).split(/[,{}[\]"]/).filter(Boolean)) {
    if (checkTextForSecrets(text)) {
      issues.push(error("secret-like-token", "Entry contains a secret-like token or private URL pattern.", { videoId: entry.id }));
      break;
    }
  }

  return issues;
}

function validateTechnicalClaims(entry: VideoProductionEntry): VideoValidationIssue[] {
  const issues: VideoValidationIssue[] = [];
  for (const claim of entry.technicalClaims) {
    if (claim.sourceRequired && claim.status === "verified" && !claim.sourceReference) {
      issues.push(error("claim-source-required", `Claim "${claim.id}" is verified without sourceReference.`, { videoId: entry.id }));
    }
    if (claim.status === "pending-verification") {
      issues.push(warning("claim-pending-verification", `Claim "${claim.id}" still needs official verification.`, { videoId: entry.id }));
      if ((entry.status === "approved" || entry.status === "published") && claim.critical) {
        issues.push(error("approval-blocked-pending-claim", `Critical claim "${claim.id}" blocks approval.`, { videoId: entry.id }));
      }
    }
  }

  for (const verification of entry.technicalVerifications) {
    if (verification.status === "pending-verification") {
      issues.push(warning("technical-check-pending", `Technical check pending: ${verification.label}.`, { videoId: entry.id }));
      if ((entry.status === "approved" || entry.status === "published") && verification.critical) {
        issues.push(error("approval-blocked-pending-technical-check", `Critical technical check "${verification.id}" blocks approval.`, { videoId: entry.id }));
      }
    }
  }
  return issues;
}

function validateSecurity(entry: VideoProductionEntry): VideoValidationIssue[] {
  const issues: VideoValidationIssue[] = [];
  for (const requirement of entry.securityRequirements) {
    if (!PLACEHOLDER_SET.has(requirement.placeholder)) {
      issues.push(error("security-placeholder-invalid", `Invalid placeholder for ${requirement.id}.`, { videoId: entry.id }));
    }
  }
  if ((entry.status === "approved" || entry.status === "published") && entry.securityReviewStatus !== "approved") {
    issues.push(error("security-review-required", "Security review blocks approved or published state.", { videoId: entry.id }));
  }
  return issues;
}

function validateCaptures(
  entry: VideoProductionEntry,
  chapterIds: Set<string>,
  repoRoot: string
): VideoValidationIssue[] {
  const issues: VideoValidationIssue[] = [];
  const seen = new Set<string>();

  for (const capture of entry.captures) {
    if (seen.has(capture.id)) {
      issues.push(error("capture-id-duplicate", `Duplicate capture id "${capture.id}".`, { videoId: entry.id, captureId: capture.id }));
    }
    seen.add(capture.id);

    if (capture.required && capture.status === "missing") {
      issues.push(warning("capture-required-missing", `Required capture "${capture.id}" is not recorded yet.`, { videoId: entry.id, captureId: capture.id }));
    }
    if (!chapterIds.has(capture.chapter)) {
      issues.push(error("capture-chapter-missing", `Capture "${capture.id}" references unknown chapter "${capture.chapter}".`, { videoId: entry.id, captureId: capture.id }));
    }
    for (const field of capture.sensitiveFields) {
      if (!PLACEHOLDER_SET.has(field)) {
        issues.push(error("capture-sensitive-placeholder", `Capture "${capture.id}" uses non-approved sensitive placeholder "${field}".`, { videoId: entry.id, captureId: capture.id }));
      }
    }
    if (capture.sourceMediaPath) {
      validateDeclaredPath(capture.sourceMediaPath, ".webp", repoRoot, issues, {
        videoId: entry.id,
        captureId: capture.id,
      });
    }
  }

  if ((entry.status === "approved" || entry.status === "published") && entry.captures.some((capture) => capture.required && capture.status !== "approved")) {
    issues.push(error("approval-captures-required", "Approved videos require every required capture to be approved.", { videoId: entry.id }));
  }
  return issues;
}

function validateStoryboard(
  entry: VideoProductionEntry,
  captureById: Map<string, VideoCaptureRequirement>,
  chapterIds: Set<string>
): VideoValidationIssue[] {
  const issues: VideoValidationIssue[] = [];
  let expectedStart = 0;

  for (const plan of entry.storyboard) {
    if (!chapterIds.has(plan.chapter)) {
      issues.push(error("storyboard-chapter-missing", `Plan ${plan.id} references unknown chapter "${plan.chapter}".`, { videoId: entry.id, planId: plan.id }));
    }
    if (plan.startSeconds !== expectedStart) {
      const code = plan.startSeconds < expectedStart ? "storyboard-overlap" : "storyboard-gap";
      issues.push(error(code, `Plan ${plan.id} starts at ${plan.startSeconds}s, expected ${expectedStart}s.`, { videoId: entry.id, planId: plan.id }));
    }
    if (plan.endSeconds <= plan.startSeconds) {
      issues.push(error("storyboard-time-order", `Plan ${plan.id} endSeconds must be greater than startSeconds.`, { videoId: entry.id, planId: plan.id }));
    }
    const actualDuration = plan.endSeconds - plan.startSeconds;
    if (actualDuration !== plan.durationSeconds) {
      issues.push(error("storyboard-duration-mismatch", `Plan ${plan.id} duration is ${actualDuration}s but declares ${plan.durationSeconds}s.`, { videoId: entry.id, planId: plan.id }));
    }
    for (const captureId of plan.captureIds) {
      const capture = captureById.get(captureId);
      if (!capture) {
        issues.push(error("storyboard-capture-missing", `Plan ${plan.id} references missing capture "${captureId}".`, { videoId: entry.id, planId: plan.id, captureId }));
      } else if (capture.required && capture.status === "missing") {
        issues.push(warning("storyboard-capture-not-ready", `Plan ${plan.id} depends on missing capture "${captureId}".`, { videoId: entry.id, planId: plan.id, captureId }));
      }
    }
    expectedStart = plan.endSeconds;
  }

  const totalDuration = entry.storyboard.at(-1)?.endSeconds ?? 0;
  if (totalDuration < entry.durationTargetMinSeconds || totalDuration > entry.durationTargetMaxSeconds) {
    issues.push(error("storyboard-target-duration", `Storyboard duration ${totalDuration}s is outside target ${entry.durationTarget}.`, { videoId: entry.id }));
  }
  if (totalDuration !== 600) {
    issues.push(warning("storyboard-not-ten-minutes", `Storyboard duration is ${totalDuration}s; pilot document expects 600s.`, { videoId: entry.id }));
  }
  return issues;
}

function validateMedia(entry: VideoProductionEntry, repoRoot: string): VideoValidationIssue[] {
  const issues: VideoValidationIssue[] = [];
  const seenPaths = new Set<string>();
  const byKind = new Map(entry.media.assets.map((asset) => [asset.kind, asset]));

  for (const kind of ["video", "subtitles", "poster", "transcript"] as const) {
    if (!byKind.has(kind)) {
      issues.push(error("media-kind-missing", `Missing media declaration for ${kind}.`, { videoId: entry.id, mediaKind: kind }));
    }
  }

  for (const asset of entry.media.assets) {
    if (!asset.expectedFilename.endsWith(MEDIA_EXTENSION[asset.kind])) {
      issues.push(error("media-expected-extension", `${asset.expectedFilename} does not match ${asset.kind} extension.`, { videoId: entry.id, mediaKind: asset.kind }));
    }
    if (asset.path) {
      if (seenPaths.has(asset.path)) {
        issues.push(error("media-path-duplicate", `Duplicate media path "${asset.path}".`, { videoId: entry.id, mediaKind: asset.kind }));
      }
      seenPaths.add(asset.path);
      validateDeclaredPath(asset.path, MEDIA_EXTENSION[asset.kind], repoRoot, issues, {
        videoId: entry.id,
        mediaKind: asset.kind,
      });
    }
  }

  if (entry.status === "brief") {
    return issues;
  }

  if (entry.status === "approved" || entry.status === "published") {
    for (const kind of ["video", "subtitles", "poster", "transcript"] as const) {
      const asset = byKind.get(kind);
      if (!asset?.path) {
        issues.push(error(`approved-${kind}-missing`, `Approved videos require ${kind} path.`, { videoId: entry.id, mediaKind: kind }));
      } else if (asset.status !== "approved") {
        issues.push(error(`approved-${kind}-status`, `Approved videos require ${kind} status approved.`, { videoId: entry.id, mediaKind: kind }));
      }
    }
  }

  return issues;
}

function validateDeclaredPath(
  publicPath: string,
  expectedExtension: string,
  repoRoot: string,
  issues: VideoValidationIssue[],
  extra: Partial<VideoValidationIssue>
) {
  if (/^https?:\/\//i.test(publicPath) || publicPath.includes("://")) {
    issues.push(error("path-external", `External path forbidden: ${publicPath}.`, extra));
  }
  if (!hasValidPathPrefix(publicPath)) {
    issues.push(error("path-prefix", `Path must stay under an approved public media folder: ${publicPath}.`, extra));
  }
  if (!publicPath.toLowerCase().endsWith(expectedExtension)) {
    issues.push(error("path-extension", `Path must end with ${expectedExtension}: ${publicPath}.`, extra));
  }
  const diskPath = pathToDisk(repoRoot, publicPath);
  if (!existsSync(diskPath)) {
    issues.push(error("path-missing-file", `Declared path does not exist: ${publicPath}.`, extra));
    return;
  }
  const stat = statSync(diskPath);
  if (!stat.isFile()) {
    issues.push(error("path-not-file", `Declared path is not a file: ${publicPath}.`, extra));
  }
  if (stat.size === 0) {
    issues.push(error("path-empty-file", `Declared file is empty: ${publicPath}.`, extra));
  }
}
