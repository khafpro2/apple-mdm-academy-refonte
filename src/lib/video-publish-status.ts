import type { VideoStoryboard } from "@/src/lib/video-lessons";

export type VideoProductionPhase =
  | "draft"
  | "storyboard-ready"
  | "assets-ready"
  | "recording-needed"
  | "editing"
  | "published";

export type VideoPublishMeta = {
  status: VideoProductionPhase;
  videoUrl?: string;
};

const PHASE_LABELS: Record<VideoProductionPhase, string> = {
  draft: "Brouillon",
  "storyboard-ready": "Storyboard prêt",
  "assets-ready": "Assets prêts",
  "recording-needed": "Captures à enregistrer",
  editing: "Montage en cours",
  published: "Publiée",
};

/** Statut de production par vidéo illustrée */
export const VIDEO_PUBLISH_REGISTRY: Record<string, VideoPublishMeta> = {
  "apple-business-manager": { status: "assets-ready" },
  "abm-intune": { status: "recording-needed" },
  "ade-iphone": { status: "recording-needed" },
  "ade-mac": { status: "recording-needed" },
  apns: { status: "recording-needed" },
  "apps-books": { status: "recording-needed" },
  "managed-apple-ids": { status: "recording-needed" },
  "platform-sso": { status: "recording-needed" },
  "ios-ipados-profiles": { status: "recording-needed" },
  "macos-profiles": { status: "recording-needed" },
  filevault: { status: "recording-needed" },
  "gatekeeper-xprotect-sip": { status: "recording-needed" },
  "jamf-pro-fundamentals": { status: "recording-needed" },
  "jamf-smart-groups": { status: "recording-needed" },
  "jamf-policies": { status: "recording-needed" },
  "jamf-scripts": { status: "recording-needed" },
  "jamf-patch-management": { status: "recording-needed" },
  "jamf-protect": { status: "recording-needed" },
};

export function getVideoPublishMeta(slug: string): VideoPublishMeta {
  return VIDEO_PUBLISH_REGISTRY[slug] ?? { status: "storyboard-ready" };
}

export function getVideoPublishLabel(status: VideoProductionPhase): string {
  return PHASE_LABELS[status];
}

export function getExpectedVideoPath(slug: string): string {
  return `/videos/${slug}.mp4`;
}

export function enrichStoryboardWithPublishMeta(storyboard: VideoStoryboard): VideoStoryboard {
  const meta = getVideoPublishMeta(storyboard.slug);
  return {
    ...storyboard,
    status: meta.status,
    videoUrl: meta.videoUrl ?? (meta.status === "published" ? getExpectedVideoPath(storyboard.slug) : undefined),
  };
}
