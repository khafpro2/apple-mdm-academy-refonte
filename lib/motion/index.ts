export type {
  MotionAccessibility,
  MotionAsset,
  MotionMedia,
  MotionNarration,
  MotionRegistryEntry,
  MotionScene,
} from "@/lib/motion/types";

export type {
  MotionAssetCategory,
  MotionAssetFormat,
  MotionAssetStatus,
  MotionMediaStatus,
  MotionSceneStatus,
} from "@/lib/motion/statuses";

export {
  MOTION_ASSET_CATEGORIES,
  MOTION_ASSET_FORMATS,
  MOTION_ASSET_STATUSES,
  MOTION_MEDIA_STATUSES,
  MOTION_SCENE_STATUSES,
  isMotionAssetCategory,
  isMotionAssetFormat,
  isMotionAssetStatus,
  isMotionMediaStatus,
  isMotionSceneStatus,
} from "@/lib/motion/statuses";

export {
  canDisplayScenePublicly,
  canPreviewScene,
  isSceneHidden,
  isSceneInternalOnly,
  sceneAllowsMissingMedia,
  sceneRequiresPublishedMedia,
  shouldWarnAboutScene,
} from "@/lib/motion/publication";

export {
  getAllMotionAssets,
  getAllMotionScenes,
  getAssetsForScene,
  getMotionAssetById,
  getMotionSceneById,
  getMotionSceneBySlug,
  getPreviewableMotionScenes,
  getPublicMotionScenes,
  getRegistryEntries,
  listInternalMotionScenes,
  motionAssets,
  motionScenes,
} from "@/lib/motion/registry";

export { auditMotionLibrary, toJsonAuditSummary } from "@/lib/motion/validation/validate-library";
export { validateScene, validateScenes } from "@/lib/motion/validation/validate-scene";
export { validateAsset, validateAssets } from "@/lib/motion/validation/validate-asset";
export { checkMotionFiles } from "@/lib/motion/validation/check-files";
