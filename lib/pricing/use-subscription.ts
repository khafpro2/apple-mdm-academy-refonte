"use client";

import { useCallback, useSyncExternalStore } from "react";
import { getPlanByTier } from "@/lib/pricing/plans";
import {
  loadSubscriptionState,
  subscribeToStorage,
  notifySubscriptionChange,
  setSubscriptionTier,
} from "@/lib/pricing/subscription-storage";
import type { SubscriptionState, SubscriptionTier } from "@/lib/pricing/types";
import { tierMeetsRequirement } from "@/lib/pricing/access-control";

function getSnapshot(): SubscriptionState {
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
    setSubscriptionTier("pro");
    notifySubscriptionChange();
  }, []);

  const upgradeToEnterprise = useCallback(() => {
    setSubscriptionTier("enterprise");
    notifySubscriptionChange();
  }, []);

  const downgradeToFree = useCallback(() => {
    setSubscriptionTier("free");
    notifySubscriptionChange();
  }, []);

  const plan = getPlanByTier(state.tier);

  return {
    ...state,
    plan,
    isPro: tierMeetsRequirement(state.tier, "pro"),
    isEnterprise: state.tier === "enterprise",
    isFree: state.tier === "free",
    upgradeToPro,
    upgradeToEnterprise,
    downgradeToFree,
    canAccess: (required: SubscriptionTier) => tierMeetsRequirement(state.tier, required),
  };
}
