import type { VideoStoryboard } from "@/src/lib/video-lessons";
import { getScreenshotsForVideo } from "@/src/lib/video-screenshots";
import { getOfficialMp4Path } from "@/src/lib/video-production";

export type VideoProductionPhase =
  | "draft"
  | "storyboard-ready"
  | "assets-ready"
  | "screenshots-missing"
  | "screenshots-ready"
  | "recording-needed"
  | "editing"
  | "ready-to-publish"
  | "published";

export type VideoPublishMeta = {
  status: VideoProductionPhase;
  videoUrl?: string;
};

const PHASE_LABELS: Record<VideoProductionPhase, string> = {
  draft: "Brouillon",
  "storyboard-ready": "Storyboard prêt",
  "assets-ready": "Assets prêts",
  "screenshots-missing": "Captures manquantes",
  "screenshots-ready": "Captures prêtes",
  "recording-needed": "Narration à enregistrer",
  editing: "Montage en cours",
  "ready-to-publish": "Prête à publier",
  published: "Publiée",
};

/** Statut manuel (montage / publication) — les captures sont résolues automatiquement */
export const VIDEO_PUBLISH_REGISTRY: Record<string, VideoPublishMeta> = {
  "apple-business-manager": { status: "screenshots-missing" },
  "abm-intune": { status: "screenshots-missing" },
  "ade-iphone": { status: "screenshots-missing" },
  "ade-mac": { status: "screenshots-missing" },
  apns: { status: "screenshots-missing" },
  "apps-books": { status: "screenshots-missing" },
  "managed-apple-ids": { status: "screenshots-missing" },
  "platform-sso": { status: "screenshots-missing" },
  "ios-ipados-profiles": { status: "screenshots-missing" },
  "macos-profiles": { status: "screenshots-missing" },
  filevault: { status: "screenshots-missing" },
  "gatekeeper-xprotect-sip": { status: "screenshots-missing" },
  "jamf-pro-fundamentals": { status: "screenshots-missing" },
  "jamf-smart-groups": { status: "screenshots-missing" },
  "jamf-policies": { status: "screenshots-missing" },
  "jamf-scripts": { status: "screenshots-missing" },
  "jamf-patch-management": { status: "screenshots-missing" },
  "jamf-protect": { status: "screenshots-missing" },
};

const MANUAL_STATUSES: VideoProductionPhase[] = [
  "editing",
  "ready-to-publish",
  "published",
  "recording-needed",
];

export type ResolvePublishContext = {
  presentScreenshotFiles?: Set<string>;
  validScreenshotFiles?: Set<string>;
  mp4Available?: boolean;
  videoUrl?: string;
};

export function getExpectedVideoPath(slug: string): string {
  return getOfficialMp4Path(slug);
}

export function videoFileExists(_slug: string): boolean {
  return false;
}

/** Résout le statut effectif (captures auto → screenshots-ready) */
export function resolveVideoPublishStatus(
  slug: string,
  context?: ResolvePublishContext
): VideoPublishMeta {
  const manual = VIDEO_PUBLISH_REGISTRY[slug] ?? { status: "assets-ready" as VideoProductionPhase };
  const presentSet = context?.validScreenshotFiles ?? context?.presentScreenshotFiles;
  const resolvedVideoUrl = context?.videoUrl ?? manual.videoUrl;

  if (manual.status === "published") {
    if (!context?.mp4Available && !resolvedVideoUrl) {
      return { status: "ready-to-publish" };
    }
    return {
      status: "published",
      videoUrl: resolvedVideoUrl ?? getExpectedVideoPath(slug),
    };
  }

  if (manual.status === "ready-to-publish") {
    return {
      status: "ready-to-publish",
      videoUrl: resolvedVideoUrl,
    };
  }

  if (MANUAL_STATUSES.includes(manual.status) && manual.status !== "recording-needed") {
    return manual;
  }

  const required = getScreenshotsForVideo(slug);
  if (required.length > 0 && presentSet) {
    const allPresent = required.every((s) => presentSet.has(s.file));
    if (allPresent) {
      return { status: "screenshots-ready", videoUrl: resolvedVideoUrl };
    }
    return { status: "screenshots-missing", videoUrl: resolvedVideoUrl };
  }

  if (manual.status === "recording-needed") {
    return manual;
  }

  return manual;
}

export function getVideoPublishMeta(slug: string): VideoPublishMeta {
  return resolveVideoPublishStatus(slug);
}

export function getVideoPublishLabel(status: VideoProductionPhase): string {
  return PHASE_LABELS[status];
}

export function enrichStoryboardWithPublishMeta(
  storyboard: VideoStoryboard,
  context?: ResolvePublishContext
): VideoStoryboard {
  const meta = resolveVideoPublishStatus(storyboard.slug, context);
  return {
    ...storyboard,
    status: meta.status,
    videoUrl: meta.videoUrl,
  };
}

/** Prochaines étapes après captures complètes */
export const POST_SCREENSHOTS_WORKFLOW = [
  "Générer et copier les scripts HeyGen depuis /videos/[slug]",
  "Enregistrer la narration HeyGen (16:9 · fr-FR)",
  "Monter avec Screen Studio ou CapCut",
  "Exporter MP4 1080p → /public/videos/{slug}.mp4",
  "Passer le statut à ready-to-publish puis published dans video-publish-status.ts",
];
