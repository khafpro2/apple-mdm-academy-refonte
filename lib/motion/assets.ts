/**
 * Registre central des assets motion — prêt à recevoir le contenu de production.
 */

import type { MotionAsset } from "@/lib/video/types";

export type MotionAssetRegistryEntry = MotionAsset & {
  /** Slug stable pour référencement depuis le CMS ou les manifests */
  slug: string;
  tags?: string[];
};

const registry = new Map<string, MotionAssetRegistryEntry>();

/** Enregistre un asset motion (appelé lors de l'import de contenu) */
export function registerMotionAsset(entry: MotionAssetRegistryEntry): void {
  registry.set(entry.slug, entry);
}

/** Enregistre plusieurs assets en lot */
export function registerMotionAssets(entries: MotionAssetRegistryEntry[]): void {
  for (const entry of entries) registerMotionAsset(entry);
}

/** Récupère un asset par slug */
export function getMotionAsset(slug: string): MotionAssetRegistryEntry | undefined {
  return registry.get(slug);
}

/** Liste tous les assets enregistrés */
export function listMotionAssets(): MotionAssetRegistryEntry[] {
  return [...registry.values()].sort((a, b) => (a.title ?? a.slug).localeCompare(b.title ?? b.slug));
}

/** Recherche par tag */
export function findMotionAssetsByTag(tag: string): MotionAssetRegistryEntry[] {
  return listMotionAssets().filter((a) => a.tags?.includes(tag));
}

/** Nombre d'assets enregistrés */
export function getMotionAssetCount(): number {
  return registry.size;
}

/** Vérifie si un asset existe */
export function hasMotionAsset(slug: string): boolean {
  return registry.has(slug);
}
