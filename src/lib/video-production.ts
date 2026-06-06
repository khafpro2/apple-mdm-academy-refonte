import { getVideoStoryboard, getIllustratedVideoLessons } from "@/src/lib/video-storyboards";
import { getScreenshotsForVideo } from "@/src/lib/video-screenshots";
import type { VideoStoryboard } from "@/src/lib/video-lessons";

/** Statuts pipeline publication LMS */
export type VideoProductionStatus =
  | "draft"
  | "storyboard-ready"
  | "screenshots-ready"
  | "voice-ready"
  | "editing"
  | "ready-to-publish"
  | "published";

export type VideoProductionFlags = {
  screenshotsReady: boolean;
  scriptReady: boolean;
  voiceReady: boolean;
  editingReady: boolean;
  published: boolean;
};

export type OfficialVideoMeta = {
  slug: string;
  title: string;
  mp4Alias: string;
  module: string;
  courseSlug: string;
  labSlug: string;
  quizSlug: string;
  certificationSlug: string;
  certificationLabel: string;
  resourceSlug?: string;
  priority: number;
};

export type VideoProductionRecord = OfficialVideoMeta & {
  status: VideoProductionStatus;
  flags: VideoProductionFlags;
  pipelinePercent: number;
  durationSeconds: number;
  durationLabel: string;
  hasStoryboard: boolean;
  hasTranscript: boolean;
  mp4Candidates: string[];
  quality: VideoQualityCheck;
};

export type VideoQualityCheck = {
  storyboard: boolean;
  transcript: boolean;
  quiz: boolean;
  lab: boolean;
  resource: boolean;
  certification: boolean;
  complete: boolean;
};

export type PipelineStageId =
  | "storyboards"
  | "captures"
  | "narration"
  | "montage"
  | "validation"
  | "publication";

export type PipelineStage = {
  id: PipelineStageId;
  label: string;
  complete: boolean;
};

export const PIPELINE_STAGES: { id: PipelineStageId; label: string }[] = [
  { id: "storyboards", label: "Storyboards" },
  { id: "captures", label: "Captures" },
  { id: "narration", label: "Narration" },
  { id: "montage", label: "Montage" },
  { id: "validation", label: "Validation" },
  { id: "publication", label: "Publication" },
];

/** 8 vidéos officielles prioritaires du LMS */
export const OFFICIAL_LMS_VIDEOS: OfficialVideoMeta[] = [
  {
    slug: "apple-business-manager",
    title: "Comprendre Apple Business Manager",
    mp4Alias: "abm",
    module: "Apple Business Manager",
    courseSlug: "apple-it-professional",
    labSlug: "abm-intune",
    quizSlug: "quiz-abm-certification",
    certificationSlug: "apple-certified-it-professional",
    certificationLabel: "Apple IT Professional",
    resourceSlug: "checklist-abm",
    priority: 1,
  },
  {
    slug: "abm-intune",
    title: "Relier Apple Business Manager à Intune",
    mp4Alias: "abm-intune",
    module: "ABM + Intune",
    courseSlug: "intune-mac",
    labSlug: "abm-intune",
    quizSlug: "quiz-abm-certification",
    certificationSlug: "apple-certified-it-professional",
    certificationLabel: "Apple IT Professional",
    resourceSlug: "checklist-intune-enrollment",
    priority: 2,
  },
  {
    slug: "ade-iphone",
    title: "Comprendre Automated Device Enrollment",
    mp4Alias: "ade",
    module: "ADE",
    courseSlug: "intune-mac",
    labSlug: "ade-iphone",
    quizSlug: "quiz-ade-certification",
    certificationSlug: "apple-certified-it-professional",
    certificationLabel: "Apple IT Professional",
    resourceSlug: "checklist-ade-iphone",
    priority: 3,
  },
  {
    slug: "apns",
    title: "Comprendre APNs",
    mp4Alias: "apns",
    module: "APNs",
    courseSlug: "apple-it-professional",
    labSlug: "apns",
    quizSlug: "quiz-abm-certification",
    certificationSlug: "apple-certified-it-professional",
    certificationLabel: "Apple IT Professional",
    priority: 4,
  },
  {
    slug: "managed-apple-ids",
    title: "Managed Apple IDs",
    mp4Alias: "managed-apple-id",
    module: "Managed Apple IDs",
    courseSlug: "apple-it-professional",
    labSlug: "managed-apple-ids",
    quizSlug: "quiz-abm-certification",
    certificationSlug: "apple-certified-it-professional",
    certificationLabel: "Apple IT Professional",
    priority: 5,
  },
  {
    slug: "platform-sso",
    title: "Platform SSO",
    mp4Alias: "platform-sso",
    module: "Platform SSO",
    courseSlug: "intune-mac",
    labSlug: "platform-sso",
    quizSlug: "quiz-ade-certification",
    certificationSlug: "apple-certified-it-professional",
    certificationLabel: "Apple IT Professional",
    priority: 6,
  },
  {
    slug: "jamf-pro-fundamentals",
    title: "Découvrir Jamf Pro",
    mp4Alias: "jamf-pro",
    module: "Jamf Pro",
    courseSlug: "jamf-100",
    labSlug: "jamf-discovery",
    quizSlug: "quiz-jamf-100",
    certificationSlug: "jamf-100",
    certificationLabel: "Jamf 100",
    priority: 7,
  },
  {
    slug: "filevault",
    title: "FileVault",
    mp4Alias: "filevault",
    module: "Sécurité macOS",
    courseSlug: "apple-it-professional",
    labSlug: "filevault",
    quizSlug: "quiz-abm-certification",
    certificationSlug: "apple-certified-it-professional",
    certificationLabel: "Apple IT Professional",
    priority: 8,
  },
];

/** Overrides manuels production (narration, montage, publication) */
export const VIDEO_PRODUCTION_OVERRIDES: Partial<
  Record<string, Partial<VideoProductionFlags> & { status?: VideoProductionStatus }>
> = {
  "apple-business-manager": { scriptReady: true },
  "abm-intune": { scriptReady: true },
  "ade-iphone": { scriptReady: true },
  apns: { scriptReady: true },
  "managed-apple-ids": { scriptReady: true },
  "platform-sso": { scriptReady: true },
  "jamf-pro-fundamentals": { scriptReady: true },
  filevault: { scriptReady: true },
};

const STATUS_LABELS: Record<VideoProductionStatus, string> = {
  draft: "Brouillon",
  "storyboard-ready": "Storyboard prêt",
  "screenshots-ready": "Captures prêtes",
  "voice-ready": "Narration prête",
  editing: "Montage en cours",
  "ready-to-publish": "Prête à publier",
  published: "Publiée",
};

export function getProductionStatusLabel(status: VideoProductionStatus): string {
  return STATUS_LABELS[status];
}

export function getMp4Candidates(slug: string): string[] {
  const official = OFFICIAL_LMS_VIDEOS.find((v) => v.slug === slug);
  const paths = [`/videos/${slug}.mp4`];
  if (official?.mp4Alias) paths.push(`/videos/${official.mp4Alias}.mp4`);
  return [...new Set(paths)];
}

export function getOfficialVideo(slug: string): OfficialVideoMeta | undefined {
  return OFFICIAL_LMS_VIDEOS.find((v) => v.slug === slug);
}

export function isOfficialLmsVideo(slug: string): boolean {
  return OFFICIAL_LMS_VIDEOS.some((v) => v.slug === slug);
}

export function getCertificationHref(certificationSlug: string): string {
  if (certificationSlug === "apple-certified-it-professional") {
    return `/certifications/${certificationSlug}`;
  }
  if (certificationSlug === "jamf-100") {
    return "/examens/jamf-100";
  }
  return `/certification/${certificationSlug}`;
}

function buildQuality(meta: OfficialVideoMeta, storyboard?: VideoStoryboard): VideoQualityCheck {
  const hasStoryboard = Boolean(storyboard && storyboard.scenes.length >= 5);
  const hasTranscript = Boolean(storyboard && storyboard.narration.length > 100);
  const quiz = Boolean(meta.quizSlug);
  const lab = Boolean(meta.labSlug);
  const resource = Boolean(meta.resourceSlug);
  const certification = Boolean(meta.certificationSlug);
  const complete = hasStoryboard && hasTranscript && quiz && lab && certification;
  return {
    storyboard: hasStoryboard,
    transcript: hasTranscript,
    quiz,
    lab,
    resource,
    certification,
    complete,
  };
}

function resolveFlags(
  slug: string,
  storyboard: VideoStoryboard | undefined,
  presentScreenshotFiles?: Set<string>
): VideoProductionFlags {
  const override = VIDEO_PRODUCTION_OVERRIDES[slug] ?? {};
  const requiredShots = getScreenshotsForVideo(slug);
  const screenshotsReady =
    override.screenshotsReady ??
    (requiredShots.length > 0
      ? requiredShots.every((s) => presentScreenshotFiles?.has(s.file))
      : false);
  const scriptReady = override.scriptReady ?? Boolean(storyboard && storyboard.narration.length > 200);

  return {
    screenshotsReady,
    scriptReady,
    voiceReady: override.voiceReady ?? false,
    editingReady: override.editingReady ?? false,
    published: override.published ?? false,
  };
}

function resolveStatus(flags: VideoProductionFlags, mp4Available: boolean): VideoProductionStatus {
  if (flags.published || mp4Available) return "published";
  if (flags.editingReady) return "ready-to-publish";
  if (flags.voiceReady) return "voice-ready";
  if (flags.screenshotsReady) return "screenshots-ready";
  if (flags.scriptReady) return "storyboard-ready";
  return "draft";
}

export function computePipelinePercent(flags: VideoProductionFlags, mp4Available: boolean): number {
  const steps = [
    flags.scriptReady,
    flags.screenshotsReady,
    flags.voiceReady,
    flags.editingReady,
    mp4Available || flags.published,
  ];
  return Math.round((steps.filter(Boolean).length / steps.length) * 100);
}

export function getPipelineStages(flags: VideoProductionFlags, mp4Available: boolean): PipelineStage[] {
  return [
    { id: "storyboards", label: "Storyboards", complete: flags.scriptReady },
    { id: "captures", label: "Captures", complete: flags.screenshotsReady },
    { id: "narration", label: "Narration", complete: flags.voiceReady },
    { id: "montage", label: "Montage", complete: flags.editingReady },
    {
      id: "validation",
      label: "Validation",
      complete: flags.editingReady && flags.voiceReady && flags.screenshotsReady,
    },
    { id: "publication", label: "Publication", complete: mp4Available || flags.published },
  ];
}

export function buildVideoProductionRecord(
  meta: OfficialVideoMeta,
  options?: { presentScreenshotFiles?: Set<string>; mp4Available?: boolean }
): VideoProductionRecord {
  const storyboard = getVideoStoryboard(meta.slug);
  const flags = resolveFlags(meta.slug, storyboard, options?.presentScreenshotFiles);
  const mp4Available = options?.mp4Available ?? false;
  const overrideStatus = VIDEO_PRODUCTION_OVERRIDES[meta.slug]?.status;
  const status = overrideStatus ?? resolveStatus(flags, mp4Available);

  return {
    ...meta,
    status,
    flags: { ...flags, published: status === "published" },
    pipelinePercent: computePipelinePercent(flags, mp4Available),
    durationSeconds: storyboard?.durationSeconds ?? 0,
    durationLabel: storyboard?.duration ?? "—",
    hasStoryboard: Boolean(storyboard),
    hasTranscript: Boolean(storyboard?.narration),
    mp4Candidates: getMp4Candidates(meta.slug),
    quality: buildQuality(meta, storyboard),
  };
}

export function getOfficialVideoProductionRecords(options?: {
  presentScreenshotFiles?: Set<string>;
  mp4AvailableBySlug?: Record<string, boolean>;
}): VideoProductionRecord[] {
  return OFFICIAL_LMS_VIDEOS.map((meta) =>
    buildVideoProductionRecord(meta, {
      presentScreenshotFiles: options?.presentScreenshotFiles,
      mp4Available: options?.mp4AvailableBySlug?.[meta.slug] ?? false,
    })
  );
}

export function getAllVideoLibraryRecords(options?: {
  presentScreenshotFiles?: Set<string>;
  mp4AvailableBySlug?: Record<string, boolean>;
}): VideoProductionRecord[] {
  const officialSlugs = new Set(OFFICIAL_LMS_VIDEOS.map((v) => v.slug));
  const official = getOfficialVideoProductionRecords(options);

  const others = getIllustratedVideoLessons()
    .filter((s) => !officialSlugs.has(s.slug))
    .map((sb) => {
      const meta: OfficialVideoMeta = {
        slug: sb.slug,
        title: sb.title,
        mp4Alias: sb.slug,
        module: sb.module,
        courseSlug: sb.courseSlug,
        labSlug: sb.labSlug,
        quizSlug: sb.quizSlug,
        certificationSlug: sb.courseSlug,
        certificationLabel: sb.courseSlug,
        priority: 99,
      };
      return buildVideoProductionRecord(meta, {
        presentScreenshotFiles: options?.presentScreenshotFiles,
        mp4Available: options?.mp4AvailableBySlug?.[sb.slug] ?? false,
      });
    });

  return [...official, ...others];
}

export type VideoCourseNotes = {
  slug: string;
  title: string;
  summary: string;
  commands: string[];
  checklist: string[];
  links: { label: string; href: string }[];
};

export function getVideoCourseNotes(slug: string): VideoCourseNotes | undefined {
  const storyboard = getVideoStoryboard(slug);
  const official = getOfficialVideo(slug);
  if (!storyboard) return undefined;

  const checklist = storyboard.scenes.flatMap((s) => s.checklistItems ?? []);
  const commands: string[] = [];

  if (slug.includes("filevault") || slug === "gatekeeper-xprotect-sip") {
    commands.push("fdesetup status", "spctl --status", "csrutil status");
  }
  if (slug.includes("jamf")) {
    commands.push("sudo jamf policy", "sudo jamf recon");
  }

  return {
    slug,
    title: storyboard.title,
    summary: storyboard.objective,
    commands,
    checklist: checklist.length ? checklist : storyboard.allScreenshots.slice(0, 6),
    links: [
      { label: "Cours associé", href: `/cours/${storyboard.courseSlug}` },
      { label: "Lab associé", href: `/labs/${storyboard.labSlug}` },
      { label: "Quiz", href: `/quiz/${storyboard.quizSlug}` },
      ...(official
        ? [{ label: official.certificationLabel, href: getCertificationHref(official.certificationSlug) }]
        : []),
    ],
  };
}
