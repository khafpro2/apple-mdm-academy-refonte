/** Mode accès complet temporaire. */
export const FREE_PLATFORM_MODE = true;

export const PLATFORM_ACCESS = {
  planName: "Accès complet",
  statusLabel: "Accès complet",
  freeMessage: "Tous les parcours, labs, examens blancs et certificats sont inclus.",
} as const;

export function isFreePlatformMode(): boolean {
  return FREE_PLATFORM_MODE;
}

/** Tier effectif pour l'accès contenu — enterprise = tout débloqué en mode preview. */
export function getEffectiveTier(_storedTier?: string): "enterprise" {
  if (isFreePlatformMode()) return "enterprise";
  return "enterprise";
}

export function hasFullPlatformAccess(): boolean {
  return isFreePlatformMode();
}

export function arePaymentsEnabled(): boolean {
  return !isFreePlatformMode();
}
