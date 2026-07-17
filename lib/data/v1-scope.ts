/**
 * Périmètre V1 — Apple Enterprise, Jamf, Microsoft Intune uniquement.
 * Les parcours listés ici sont retirés du produit (pas seulement masqués).
 */
export const V1_REMOVED_TRACK_SLUGS = [
  "kandji-fundamentals",
  "mosyle-fundamentals",
  "addigy-fundamentals",
  "workspace-one-apple",
] as const;

export type V1RemovedTrackSlug = (typeof V1_REMOVED_TRACK_SLUGS)[number];

const removedSet = new Set<string>(V1_REMOVED_TRACK_SLUGS);

/** Track slug explicitement retiré de la V1 (données / routes mortes). */
export function isV1RemovedTrack(slug: string | undefined | null): boolean {
  if (!slug) return false;
  return removedSet.has(slug);
}

/** Catégories catalogue V1. */
export const V1_TRACK_CATEGORIES = ["apple", "jamf", "intune"] as const;
