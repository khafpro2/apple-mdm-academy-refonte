import { getVideoStoryboard, getIllustratedVideoLessons } from "@/src/lib/video-storyboards";
import { getScreenshotsForVideo } from "@/src/lib/video-screenshots";
import { getResource } from "@/src/lib/resources";
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
  score: VideoPipelineScore;
  canPublish: boolean;
  publishBlockers: PublishBlocker[];
  durationSeconds: number;
  durationLabel: string;
  hasStoryboard: boolean;
  hasTranscript: boolean;
  mp4Candidates: string[];
  quality: VideoQualityCheck;
};

export type VideoPipelineScore = {
  storyboard: boolean;
  script: boolean;
  resource: boolean;
  captures: boolean;
  narration: boolean;
  montage: boolean;
  mp4: boolean;
};

export type PublishBlocker = {
  id: "storyboard" | "transcript" | "resource" | "script" | "captures" | "mp4" | "videoUrl";
  label: string;
};

export const PIPELINE_SCORE_WEIGHTS: Record<keyof VideoPipelineScore, number> = {
  storyboard: 15,
  script: 15,
  resource: 10,
  captures: 25,
  narration: 15,
  montage: 10,
  mp4: 10,
};

export const MANUAL_PIPELINE_ACTIONS = [
  "Capturer les écrans avec Screen Studio",
  "Exporter les captures en 1920×1080",
  "Convertir en .webp : node scripts/convert-screenshots-to-webp.mjs",
  "Générer la narration HeyGen (script sur /videos/[slug])",
  "Monter la vidéo dans CapCut ou Screen Studio",
  "Exporter en MP4 1080p H.264",
  "Déposer dans /public/videos/{slug-canonical}.mp4 (ex. apple-business-manager.mp4)",
  "Relancer : node scripts/check-video-screenshots.mjs",
] as const;

export const PIPELINE_ADMIN_COMMANDS = [
  "node scripts/check-video-screenshots.mjs",
  "node scripts/convert-screenshots-to-webp.mjs",
  "npm run lint",
  "npm run build",
] as const;

export const PIPELINE_CRITERIA_LABELS: { key: keyof VideoPipelineScore; label: string; weight: number }[] = [
  { key: "storyboard", label: "Storyboard prêt", weight: 15 },
  { key: "script", label: "Script HeyGen prêt", weight: 15 },
  { key: "resource", label: "Ressource associée", weight: 10 },
  { key: "captures", label: "Captures présentes", weight: 25 },
  { key: "narration", label: "Narration produite", weight: 15 },
  { key: "montage", label: "Montage terminé", weight: 10 },
  { key: "mp4", label: "MP4 publié", weight: 10 },
];

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
    slug: "ade-mac",
    title: "Déployer un Mac avec ADE",
    mp4Alias: "ade-mac",
    module: "Automated Device Enrollment — macOS",
    courseSlug: "intune-mac",
    labSlug: "ade-macos",
    quizSlug: "quiz-intune-mac",
    certificationSlug: "intune-administrator",
    certificationLabel: "Intune Administrator",
    resourceSlug: "intune-ade-guide",
    priority: 4,
  },
  {
    slug: "enrollment-program-token",
    title: "Importer l'Enrollment Program Token",
    mp4Alias: "enrollment-program-token",
    module: "Automated Device Enrollment",
    courseSlug: "intune-mac",
    labSlug: "enrollment-program-token",
    quizSlug: "quiz-intune-mac",
    certificationSlug: "intune-administrator",
    certificationLabel: "Intune Administrator",
    resourceSlug: "intune-ade-guide",
    priority: 5,
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
    resourceSlug: "apns-checklist",
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
    resourceSlug: "managed-apple-ids-checklist",
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
    resourceSlug: "platform-sso-checklist",
    priority: 6,
  },
  {
    slug: "defender-macos",
    title: "Microsoft Defender pour macOS",
    mp4Alias: "defender-macos",
    module: "Sécurité macOS avec Intune",
    courseSlug: "intune-mac",
    labSlug: "defender-macos-intune",
    quizSlug: "quiz-intune-mac",
    certificationSlug: "intune-administrator",
    certificationLabel: "Intune Administrator",
    resourceSlug: "intune-defender-guide",
    priority: 7,
  },
  {
    slug: "conditional-access-apple",
    title: "Conditional Access pour appareils Apple",
    mp4Alias: "conditional-access-apple",
    module: "Conformité et accès Microsoft",
    courseSlug: "intune-mac",
    labSlug: "intune-conditional-access-mac",
    quizSlug: "quiz-intune-mac",
    certificationSlug: "intune-administrator",
    certificationLabel: "Intune Administrator",
    resourceSlug: "intune-conditional-access-guide",
    priority: 8,
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
    resourceSlug: "checklist-jamf-fundamentals",
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
    resourceSlug: "filevault-checklist",
    priority: 8,
  },
];

export const PILOT_VIDEO_SLUGS = OFFICIAL_LMS_VIDEOS.map((v) => v.slug);

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

/** Noms MP4 canoniques dans /public/videos/ */
export const OFFICIAL_MP4_FILENAMES: Record<string, string> = {
  "apple-business-manager": "apple-business-manager.mp4",
  "abm-intune": "abm-intune.mp4",
  "ade-iphone": "automated-device-enrollment.mp4",
  "ade-mac": "automated-device-enrollment-mac.mp4",
  "enrollment-program-token": "enrollment-program-token.mp4",
  apns: "apns.mp4",
  "managed-apple-ids": "managed-apple-ids.mp4",
  "platform-sso": "platform-sso.mp4",
  "defender-macos": "defender-macos-intune.mp4",
  "conditional-access-apple": "conditional-access-apple.mp4",
  "jamf-pro-fundamentals": "jamf-pro-fundamentals.mp4",
  filevault: "filevault.mp4",
};

export function getOfficialMp4Path(slug: string): string {
  const filename = OFFICIAL_MP4_FILENAMES[slug] ?? `${slug}.mp4`;
  return `/videos/${filename}`;
}

export function getMp4Candidates(slug: string): string[] {
  const paths = [getOfficialMp4Path(slug), `/videos/${slug}.mp4`];
  const official = OFFICIAL_LMS_VIDEOS.find((v) => v.slug === slug);
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
  const hasStoryboard = hasValidStoryboard(storyboard);
  const hasTranscript = hasValidTranscript(storyboard);
  const quiz = Boolean(meta.quizSlug);
  const lab = Boolean(meta.labSlug);
  const resource = hasValidResource(meta);
  const certification = Boolean(meta.certificationSlug);
  const complete = hasStoryboard && hasTranscript && quiz && lab && resource && certification;
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

function hasValidStoryboard(storyboard?: VideoStoryboard): boolean {
  return Boolean(storyboard && storyboard.scenes.length >= 5);
}

function hasValidTranscript(storyboard?: VideoStoryboard): boolean {
  return Boolean(storyboard && storyboard.narration.length > 100);
}

function hasValidResource(meta: OfficialVideoMeta): boolean {
  return Boolean(meta.resourceSlug && getResource(meta.resourceSlug));
}

export function computePipelineScore(
  meta: OfficialVideoMeta,
  flags: VideoProductionFlags,
  storyboard: VideoStoryboard | undefined,
  mp4Available: boolean
): VideoPipelineScore {
  return {
    storyboard: hasValidStoryboard(storyboard),
    script: flags.scriptReady,
    resource: hasValidResource(meta),
    captures: flags.screenshotsReady,
    narration: flags.voiceReady,
    montage: flags.editingReady,
    mp4: mp4Available,
  };
}

export function computeWeightedPipelinePercent(score: VideoPipelineScore): number {
  let total = 0;
  for (const { key, weight } of PIPELINE_CRITERIA_LABELS) {
    if (score[key]) total += weight;
  }
  return total;
}

export function getPublishBlockers(
  record: {
    slug: string;
    resourceSlug?: string;
    hasStoryboard: boolean;
    hasTranscript: boolean;
    score: VideoPipelineScore;
  },
  options?: { mp4Available?: boolean; videoUrl?: string }
): PublishBlocker[] {
  const blockers: PublishBlocker[] = [];
  if (!record.hasStoryboard) {
    blockers.push({ id: "storyboard", label: "Storyboard absent ou incomplet (< 5 scènes)" });
  }
  if (!record.score.script) {
    blockers.push({ id: "script", label: "Script HeyGen absent ou incomplet" });
  }
  if (!record.hasTranscript) {
    blockers.push({ id: "transcript", label: "Transcript absent ou trop court" });
  }
  if (!record.resourceSlug || !getResource(record.resourceSlug)) {
    blockers.push({
      id: "resource",
      label: `Ressource associée absente (${record.resourceSlug ?? "resourceSlug non défini"})`,
    });
  }
  if (!record.score.captures) {
    blockers.push({ id: "captures", label: "Captures requises absentes (.webp 1920×1080)" });
  }
  if (!options?.mp4Available) {
    blockers.push({ id: "mp4", label: `Fichier MP4 absent (${getOfficialMp4Path(record.slug)})` });
  }
  if (options?.mp4Available && !options?.videoUrl) {
    blockers.push({ id: "videoUrl", label: "videoUrl non résolu malgré MP4 détecté" });
  }
  return blockers;
}

export function canPublishVideo(
  record: Parameters<typeof getPublishBlockers>[0],
  options?: { mp4Available?: boolean; videoUrl?: string }
): { ok: boolean; message: string; blockers: PublishBlocker[] } {
  const blockers = getPublishBlockers(record, options);
  if (blockers.length === 0) {
    return { ok: true, message: "Prêt à publier", blockers: [] };
  }
  return {
    ok: false,
    message: "Publication impossible — éléments manquants",
    blockers,
  };
}

export function getNextPipelineAction(
  record: VideoProductionRecord,
  options?: { presentScreenshotFiles?: Set<string> }
): string {
  if (!record.score.storyboard) return "Compléter le storyboard (5 scènes minimum)";
  if (!record.score.script) return "Finaliser le script HeyGen sur /videos/" + record.slug;
  if (!record.score.resource) return `Créer ou lier la ressource /resources/${record.resourceSlug ?? "?"}`;
  if (!record.score.captures) {
    const missing = getScreenshotsForVideo(record.slug).filter(
      (s) => !options?.presentScreenshotFiles?.has(s.file)
    ).length;
    return `Produire ${missing} capture(s) Screen Studio → convertir en .webp`;
  }
  if (!record.score.narration) return "Enregistrer la narration HeyGen";
  if (!record.score.montage) return "Monter la vidéo (CapCut / Screen Studio)";
  if (!record.score.mp4) return `Exporter MP4 → /public/videos/${record.mp4Alias}.mp4`;
  return "Vidéo prête — publication LMS active";
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

export function isReadyToPublishRecord(
  meta: OfficialVideoMeta,
  storyboard: VideoStoryboard | undefined,
  mp4Available: boolean
): boolean {
  if (!mp4Available) return false;
  if (!hasValidTranscript(storyboard)) return false;
  if (!hasValidResource(meta)) return false;
  if (!meta.courseSlug || !meta.labSlug) return false;
  return true;
}

function resolveStatus(
  flags: VideoProductionFlags,
  mp4Available: boolean,
  publishOk: boolean,
  readyToPublish: boolean
): VideoProductionStatus {
  if (publishOk && mp4Available) return "published";
  if (readyToPublish) return "ready-to-publish";
  if (flags.editingReady) return "ready-to-publish";
  if (flags.voiceReady) return "editing";
  if (flags.screenshotsReady) return "screenshots-ready";
  if (flags.scriptReady) return "storyboard-ready";
  return "draft";
}

/** @deprecated Utiliser computeWeightedPipelinePercent */
export function computePipelinePercent(flags: VideoProductionFlags, mp4Available: boolean): number {
  const score: VideoPipelineScore = {
    storyboard: flags.scriptReady,
    script: flags.scriptReady,
    resource: false,
    captures: flags.screenshotsReady,
    narration: flags.voiceReady,
    montage: flags.editingReady,
    mp4: mp4Available,
  };
  return computeWeightedPipelinePercent(score);
}

export function getPipelineStages(
  score: VideoPipelineScore,
  publishOk: boolean
): PipelineStage[] {
  return [
    { id: "storyboards", label: "Storyboards", complete: score.storyboard && score.script },
    { id: "captures", label: "Captures", complete: score.captures },
    { id: "narration", label: "Narration", complete: score.narration },
    { id: "montage", label: "Montage", complete: score.montage },
    {
      id: "validation",
      label: "Validation",
      complete: score.resource && score.storyboard && score.captures && score.narration,
    },
    { id: "publication", label: "Publication", complete: publishOk && score.mp4 },
  ];
}

export function buildVideoProductionRecord(
  meta: OfficialVideoMeta,
  options?: { presentScreenshotFiles?: Set<string>; mp4Available?: boolean; mp4Url?: string }
): VideoProductionRecord {
  const storyboard = getVideoStoryboard(meta.slug);
  const flags = resolveFlags(meta.slug, storyboard, options?.presentScreenshotFiles);
  const mp4Available = options?.mp4Available ?? false;
  const hasStoryboard = hasValidStoryboard(storyboard);
  const hasTranscript = hasValidTranscript(storyboard);
  const score = computePipelineScore(meta, flags, storyboard, mp4Available);
  const pipelinePercent = computeWeightedPipelinePercent(score);
  const publish = canPublishVideo(
    { slug: meta.slug, resourceSlug: meta.resourceSlug, hasStoryboard, hasTranscript, score },
    { mp4Available, videoUrl: options?.mp4Url }
  );
  const readyToPublish = isReadyToPublishRecord(meta, storyboard, mp4Available);
  const overrideStatus = VIDEO_PRODUCTION_OVERRIDES[meta.slug]?.status;
  let status = resolveStatus(flags, mp4Available, publish.ok, readyToPublish);
  if (overrideStatus === "published") {
    status = publish.ok ? "published" : readyToPublish ? "ready-to-publish" : status;
  } else if (overrideStatus) {
    status = overrideStatus;
  }

  const publishBlockers = publish.blockers;

  return {
    ...meta,
    status,
    flags: {
      ...flags,
      published: status === "published",
    },
    pipelinePercent,
    score,
    canPublish: publish.ok,
    publishBlockers,
    durationSeconds: storyboard?.durationSeconds ?? 0,
    durationLabel: storyboard?.duration ?? "—",
    hasStoryboard,
    hasTranscript,
    mp4Candidates: getMp4Candidates(meta.slug),
    quality: buildQuality(meta, storyboard),
  };
}

export function getOfficialVideoProductionRecords(options?: {
  presentScreenshotFiles?: Set<string>;
  mp4AvailableBySlug?: Record<string, boolean>;
  mp4UrlBySlug?: Record<string, string | undefined>;
}): VideoProductionRecord[] {
  return OFFICIAL_LMS_VIDEOS.map((meta) =>
    buildVideoProductionRecord(meta, {
      presentScreenshotFiles: options?.presentScreenshotFiles,
      mp4Available: options?.mp4AvailableBySlug?.[meta.slug] ?? false,
      mp4Url: options?.mp4UrlBySlug?.[meta.slug],
    })
  );
}

export function getAllVideoLibraryRecords(options?: {
  presentScreenshotFiles?: Set<string>;
  mp4AvailableBySlug?: Record<string, boolean>;
  mp4UrlBySlug?: Record<string, string | undefined>;
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
        mp4Url: options?.mp4UrlBySlug?.[sb.slug],
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
      ...(official?.resourceSlug
        ? [{ label: "Ressource checklist", href: `/resources/${official.resourceSlug}` }]
        : []),
      ...(official
        ? [{ label: official.certificationLabel, href: getCertificationHref(official.certificationSlug) }]
        : []),
    ],
  };
}
