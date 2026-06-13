"use client";

import { useCallback, useSyncExternalStore } from "react";
import { getPlanByTier } from "@/lib/pricing/plans";
import {
  loadSubscriptionState,
  subscribeToStorage,
  notifySubscriptionChange,
  setSubscriptionTier,
} from "@/lib/pricing/subscription-storage";
import type { CommercialPlan, SubscriptionState, SubscriptionTier } from "@/lib/pricing/types";
import { tierMeetsRequirement } from "@/lib/pricing/access-control";
import { isFreePlatformMode, PLATFORM_ACCESS } from "@/lib/pricing/platform-access";

const PREVIEW_PLAN: CommercialPlan = {
  slug: "pro",
  name: PLATFORM_ACCESS.planName,
  price: 0,
  priceLabel: "Inclus",
  period: "",
  description: PLATFORM_ACCESS.freeMessage,
  tier: "enterprise",
  features: [
    "Tous les cours et parcours",
    "Tous les labs pratiques",
    "Examens blancs complets",
    "Certificats PDF",
    "Ressources et vidéos",
  ],
  cta: "Explorer",
  ctaHref: "/parcours",
};

const FREE_PLATFORM_SUBSCRIPTION: SubscriptionState = {
  tier: "enterprise",
  status: "active",
  planSlug: "enterprise",
};

function getSnapshot(): SubscriptionState {
  if (isFreePlatformMode()) {
    return FREE_PLATFORM_SUBSCRIPTION;
  }
  return loadSubscriptionState();
}

function subscribe(callback: () => void) {
  const unsubStorage = subscribeToStorage(callback);
  const onCustom = () => callback();
  window.addEventListener("subscription-change", onCustom);
  return () => {
    unsubStorage();
    window.removeEventListener("subscription-change", onCustom);
  };
}

export function useSubscription() {
  const state = useSyncExternalStore(subscribe, getSnapshot, () => getSnapshot());

  const upgradeToPro = useCallback(() => {
    if (isFreePlatformMode()) return;
    setSubscriptionTier("pro");
    notifySubscriptionChange();
  }, []);

  const upgradeToEnterprise = useCallback(() => {
    if (isFreePlatformMode()) return;
    setSubscriptionTier("enterprise");
    notifySubscriptionChange();
  }, []);

  const downgradeToFree = useCallback(() => {
    if (isFreePlatformMode()) return;
    setSubscriptionTier("free");
    notifySubscriptionChange();
  }, []);

  const plan = isFreePlatformMode() ? PREVIEW_PLAN : getPlanByTier(state.tier);

  return {
    ...state,
    plan,
    statusLabel: isFreePlatformMode() ? PLATFORM_ACCESS.statusLabel : undefined,
    isPreview: isFreePlatformMode(),
    isPro: isFreePlatformMode() || tierMeetsRequirement(state.tier, "pro"),
    isEnterprise: isFreePlatformMode() || state.tier === "enterprise",
    isFree: !isFreePlatformMode() && state.tier === "free",
    upgradeToPro,
    upgradeToEnterprise,
    downgradeToFree,
    canAccess: (_required: SubscriptionTier) => isFreePlatformMode() || tierMeetsRequirement(state.tier, _required),
  };
}
