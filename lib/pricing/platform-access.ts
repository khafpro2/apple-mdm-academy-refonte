/**
 * Mode accès gratuit intégral — phase de développement.
 * Passer à `false` pour réactiver Stripe, checkout et restrictions par tier.
 */
export const FREE_PLATFORM_MODE = true;

export const PLATFORM_ACCESS = {
  planName: "Développeur Preview",
  statusLabel: "Accès complet",
  freeMessage:
    "Apple MDM Academy est actuellement accessible gratuitement pendant sa phase de développement.",
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
