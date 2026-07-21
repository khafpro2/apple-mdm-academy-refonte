import assetsRegistry from "@/media/motion/registry/assets.json";
import scenesRegistry from "@/media/motion/registry/scenes.json";
import { validateMotionAssets, validateMotionScenes } from "@/lib/motion/validate-assets";
import type { AssetMetadata, MotionScene, ValidationIssue } from "@/lib/motion/asset-types";

export const motionAssets = assetsRegistry.assets as AssetMetadata[];
export const motionScenes = scenesRegistry.scenes as MotionScene[];

export function getMotionScenes(): MotionScene[] {
  return motionScenes;
}

export function getMotionSceneBySlug(slug: string): MotionScene | undefined {
  return motionScenes.find((scene) => scene.slug === slug);
}

export function getMotionAssetsForScene(scene: MotionScene): AssetMetadata[] {
  const assetById = new Map(motionAssets.map((asset) => [asset.id, asset]));
  return scene.assetIds.map((assetId) => assetById.get(assetId)).filter(Boolean) as AssetMetadata[];
}

export function getMotionValidationIssues(repoRoot = process.cwd()): ValidationIssue[] {
  const assetIssues = validateMotionAssets(motionAssets, { repoRoot, scenes: motionScenes });
  const sceneIssues = validateMotionScenes(motionScenes, { assets: motionAssets });
  return [...assetIssues, ...sceneIssues];
}

export function getMotionIssuesForScene(scene: MotionScene): ValidationIssue[] {
  const assetIds = new Set(scene.assetIds);
  return getMotionValidationIssues().filter(
    (issue) => issue.sceneId === scene.id || (issue.assetId ? assetIds.has(issue.assetId) : false)
  );
}
