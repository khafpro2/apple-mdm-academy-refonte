/** Motion Design System — asset metadata types (canonical enums). */

export const ASSET_CATEGORIES = [
  "environment",
  "device",
  "identity",
  "network",
  "cloud",
  "security",
  "management",
  "application",
  "policy",
  "compliance",
  "certificate",
  "data-flow",
  "status",
  "transition",
  "character",
  "diagram",
  "background",
] as const;

export type AssetCategory = (typeof ASSET_CATEGORIES)[number];
export type MotionCategory = AssetCategory;

export const ASSET_STATUSES = [
  "missing",
  "brief-ready",
  "generated",
  "selected",
  "retouch-required",
  "review",
  "approved",
  "deprecated",
] as const;

export type AssetStatus = (typeof ASSET_STATUSES)[number];
export type MotionAssetStatus = AssetStatus;

export const ASSET_FORMATS = ["svg", "png", "webp", "jpg", "lottie"] as const;
export type AssetFormat = (typeof ASSET_FORMATS)[number];
export type MotionFormat = AssetFormat;

export const ASSET_ASPECT_RATIOS = ["1:1", "16:9", "9:16", "4:3", "custom"] as const;
export type AssetAspectRatio = (typeof ASSET_ASPECT_RATIOS)[number];

export const ASSET_SOURCES = ["firefly", "vector", "manual", "mixed"] as const;
export type AssetSource = (typeof ASSET_SOURCES)[number];

export const MOTION_SCENE_STATUSES = [
  "brief-ready",
  "assets-in-production",
  "review",
  "approved",
  "deprecated",
] as const;
export type MotionSceneStatus = (typeof MOTION_SCENE_STATUSES)[number];

export const MOTION_REVIEW_STATUSES = [
  "not-started",
  "brief-ready",
  "needs-review",
  "approved",
] as const;
export type MotionReviewStatus = (typeof MOTION_REVIEW_STATUSES)[number];

export type MotionAccessibility = {
  status: MotionReviewStatus;
  notes?: string;
};

export type MotionMedia = {
  illustrationPath?: string;
  capturePath?: string;
  posterPath?: string;
  videoPath?: string;
  subtitlesPath?: string;
  transcriptPath?: string;
  heygenPayloadId?: string;
};

/** Statuses that may have a physical file (path still requires file existence). */
export const STATUSES_MAY_HAVE_PATH: ReadonlySet<AssetStatus> = new Set([
  "generated",
  "selected",
  "retouch-required",
  "review",
  "approved",
  "deprecated",
]);

export type MotionAsset = {
  id: string;
  category: AssetCategory;
  name: string;
  description: string;
  status: AssetStatus;
  format: AssetFormat;
  dimensions: string;
  aspectRatio: AssetAspectRatio;
  transparentBackground: boolean;
  altText: string;
  decorative: boolean;
  source: AssetSource;
  version: string;
  /** Present only when the file exists on disk. */
  path?: string;
  sceneIds: string[];
};

export type AssetMetadata = MotionAsset;

export type MotionScene = {
  id: string;
  slug: string;
  title: string;
  status: MotionSceneStatus;
  durationSeconds: number;
  objective: string;
  mainMessage: string;
  courseIds: string[];
  assetIds: string[];
  accessibilityStatus: MotionReviewStatus;
  technicalReviewStatus: MotionReviewStatus;
  mediaStatus: MotionReviewStatus;
  version: string;
  media?: MotionMedia;
  /** When false, deprecated assets referenced here are errors. Default true. */
  active?: boolean;
  courseLessonPath?: string;
  notes?: string;
};

export type AssetRegistryFile = {
  assets: AssetMetadata[];
};

export type SceneRegistryFile = {
  scenes: MotionScene[];
};

export type ValidationIssue = {
  code: string;
  severity: "error" | "warning";
  message: string;
  assetId?: string;
  sceneId?: string;
};
