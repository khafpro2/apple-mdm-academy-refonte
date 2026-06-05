import type { SubscriptionState, SubscriptionTier } from "@/lib/pricing/types";

const STORAGE_KEY = "apple-mdm-subscription";

const DEFAULT_STATE: SubscriptionState = {
  tier: "free",
  status: "none",
  planSlug: "free",
};

export function loadSubscriptionState(): SubscriptionState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SubscriptionState) : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveSubscriptionState(state: SubscriptionState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function setSubscriptionTier(tier: SubscriptionTier): SubscriptionState {
  const state: SubscriptionState = {
    tier,
    planSlug: tier === "free" ? "free" : tier,
    status: tier === "free" ? "none" : "active",
    currentPeriodEnd: tier !== "free"
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      : undefined,
    cancelAtPeriodEnd: false,
  };
  saveSubscriptionState(state);
  return state;
}

export function subscribeToStorage(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

export function notifySubscriptionChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("subscription-change"));
}
