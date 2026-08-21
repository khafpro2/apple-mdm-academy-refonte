import type { SubscriptionTier } from "@/lib/pricing/types";

/**
 * Mode accès gratuit intégral — phase de développement.
 * Passer à `false` pour réactiver Stripe, checkout et restrictions par tier.
 */
export const FREE_PLATFORM_MODE = true;

export const PLATFORM_ACCESS = {
  planName: "Accès Pro",
  statusLabel: "Accès complet",
  freeMessage: "",
} as const;

export function isFreePlatformMode(): boolean {
  return FREE_PLATFORM_MODE;
}

export function getEffectiveTier(storedTier?: string): SubscriptionTier {
  if (isFreePlatformMode()) return "enterprise";
  if (storedTier === "pro" || storedTier === "enterprise") return storedTier;
  return "free";
}

export function hasFullPlatformAccess(): boolean {
  return isFreePlatformMode();
}

export function arePaymentsEnabled(): boolean {
  return !isFreePlatformMode();
}
