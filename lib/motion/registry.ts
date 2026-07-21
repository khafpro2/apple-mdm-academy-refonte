import { motionAssets, motionScenes } from "@/lib/motion/data";
import type { MotionAsset, MotionRegistryEntry, MotionScene } from "@/lib/motion/types";
import {
  canDisplayScenePublicly,
  canPreviewScene,
  isSceneHidden,
  isSceneInternalOnly,
} from "@/lib/motion/publication";

/**
 * Registre motion — import direct de la source de vérité TypeScript.
 * Pas de fichier généré : une seule source (`lib/motion/data/**`) évite la duplication.
 */

const scenesById = new Map(motionScenes.map((s) => [s.id, s]));
const scenesBySlug = new Map(motionScenes.map((s) => [s.slug, s]));
const assetsById = new Map(motionAssets.map((a) => [a.id, a]));

export function getAllMotionScenes(): MotionScene[] {
  return [...motionScenes].sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getAllMotionAssets(): MotionAsset[] {
  return [...motionAssets].sort((a, b) => a.id.localeCompare(b.id));
}

export function getMotionSceneById(id: string): MotionScene | undefined {
  return scenesById.get(id);
}

export function getMotionSceneBySlug(slug: string): MotionScene | undefined {
  return scenesBySlug.get(slug);
}

export function getMotionAssetById(id: string): MotionAsset | undefined {
  return assetsById.get(id);
}

export function getAssetsForScene(sceneId: string): MotionAsset[] {
  const scene = scenesById.get(sceneId);
  if (!scene) return [];
  return scene.assetIds
    .map((id) => assetsById.get(id))
    .filter((a): a is MotionAsset => Boolean(a));
}

export function getPublicMotionScenes(): MotionScene[] {
  return getAllMotionScenes().filter(canDisplayScenePublicly);
}

export function getPreviewableMotionScenes(): MotionScene[] {
  return getAllMotionScenes().filter(canPreviewScene);
}

export function getRegistryEntries(): MotionRegistryEntry[] {
  return getAllMotionScenes()
    .filter((s) => !isSceneHidden(s))
    .map((scene) => ({
      scene,
      assets: getAssetsForScene(scene.id),
    }));
}

export function listInternalMotionScenes(): MotionScene[] {
  return getAllMotionScenes().filter(isSceneInternalOnly);
}

export {
  canDisplayScenePublicly,
  canPreviewScene,
  motionAssets,
  motionScenes,
};
