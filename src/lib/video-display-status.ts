import type { VideoStoryboard } from "@/src/lib/video-lessons";
import { PILOT_VIDEO_SLUGS } from "@/src/lib/video-production";

export type VideoDisplayBadgeId = "published" | "in-production" | "storyboard-ready" | "script-ready";

export type VideoDisplayBadge = {
  id: VideoDisplayBadgeId;
  label: string;
};

const BADGE_LABELS: Record<VideoDisplayBadgeId, string> = {
  published: "Publiée",
  "in-production": "En production",
  "storyboard-ready": "Storyboard prêt",
  "script-ready": "Script prêt",
};

export function isPilotVideo(slug: string): boolean {
  return PILOT_VIDEO_SLUGS.includes(slug);
}

export function hasStoryboardReady(storyboard?: VideoStoryboard): boolean {
  return Boolean(storyboard && storyboard.scenes.length >= 3);
}

export function hasScriptReady(storyboard?: VideoStoryboard, scriptText?: string): boolean {
  const text = scriptText ?? storyboard?.narration ?? "";
  return text.trim().length > 200;
}

export function getVideoDisplayBadges(options: {
  slug: string;
  hasMp4: boolean;
  storyboard?: VideoStoryboard;
  scriptText?: string;
}): VideoDisplayBadge[] {
  const badges: VideoDisplayBadge[] = [];

  if (options.hasMp4) {
    badges.push({ id: "published", label: BADGE_LABELS.published });
    return badges;
  }

  badges.push({ id: "in-production", label: BADGE_LABELS["in-production"] });

  if (hasStoryboardReady(options.storyboard)) {
    badges.push({ id: "storyboard-ready", label: BADGE_LABELS["storyboard-ready"] });
  }

  if (hasScriptReady(options.storyboard, options.scriptText)) {
    badges.push({ id: "script-ready", label: BADGE_LABELS["script-ready"] });
  }

  return badges;
}

export const DEMO_VIDEO_MESSAGE =
  "Cette vidéo est en cours de production. Le cours, le script, le lab et les ressources sont déjà disponibles.";

export function countPublishedVideos(mp4BySlug: Record<string, boolean>, slugs: string[]): number {
  return slugs.filter((slug) => mp4BySlug[slug]).length;
}
