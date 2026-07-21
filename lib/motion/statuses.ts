/**
 * Statuts centralisés du pipeline motion.
 * Source unique — ne pas redéfinir ces unions ailleurs.
 */

export const MOTION_SCENE_STATUSES = [
  "draft",
  "needs-technical-review",
  "brief-ready",
  "assets-in-production",
  "animation-in-production",
  "review",
  "approved",
  "published",
  "deprecated",
  "blocked",
] as const;

export type MotionSceneStatus = (typeof MOTION_SCENE_STATUSES)[number];

export const MOTION_ASSET_STATUSES = [
  "planned",
  "in-production",
  "ready",
  "missing",
  "deprecated",
  "blocked",
] as const;

export type MotionAssetStatus = (typeof MOTION_ASSET_STATUSES)[number];

export const MOTION_MEDIA_STATUSES = [
  "planned",
  "recording",
  "editing",
  "ready",
  "published",
  "missing",
  "deprecated",
] as const;

export type MotionMediaStatus = (typeof MOTION_MEDIA_STATUSES)[number];

export const MOTION_ASSET_CATEGORIES = [
  "icon",
  "diagram",
  "thumbnail",
  "poster",
  "screenshot",
  "illustration",
  "lower-third",
  "background",
  "other",
] as const;

export type MotionAssetCategory = (typeof MOTION_ASSET_CATEGORIES)[number];

export const MOTION_ASSET_FORMATS = [
  "svg",
  "png",
  "webp",
  "jpg",
  "jpeg",
  "mp4",
  "webm",
  "vtt",
  "txt",
  "md",
  "json",
] as const;

export type MotionAssetFormat = (typeof MOTION_ASSET_FORMATS)[number];

export function isMotionSceneStatus(value: string): value is MotionSceneStatus {
  return (MOTION_SCENE_STATUSES as readonly string[]).includes(value);
}

export function isMotionAssetStatus(value: string): value is MotionAssetStatus {
  return (MOTION_ASSET_STATUSES as readonly string[]).includes(value);
}

export function isMotionMediaStatus(value: string): value is MotionMediaStatus {
  return (MOTION_MEDIA_STATUSES as readonly string[]).includes(value);
}

export function isMotionAssetCategory(value: string): value is MotionAssetCategory {
  return (MOTION_ASSET_CATEGORIES as readonly string[]).includes(value);
}

export function isMotionAssetFormat(value: string): value is MotionAssetFormat {
  return (MOTION_ASSET_FORMATS as readonly string[]).includes(value);
}
