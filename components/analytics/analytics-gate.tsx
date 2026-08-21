"use client";

import { useSyncExternalStore } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { setAnalyticsEnabled } from "@/lib/analytics/events";

const STORAGE_KEY = "apple-mdm-analytics-consent";
const CONSENT_EVENT = "apple-mdm-analytics-consent-change";

function readConsent(): "accepted" | "declined" | "unknown" {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "accepted") return "accepted";
    if (stored === "declined") return "declined";
    return "unknown";
  } catch {
    return "unknown";
  }
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CONSENT_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function AnalyticsGate() {
  const consent = useSyncExternalStore(subscribe, readConsent, () => "unknown" as const);

  if (consent === "declined") {
    setAnalyticsEnabled(false);
    return null;
  }
  if (consent !== "accepted") {
    setAnalyticsEnabled(false);
    return null;
  }

  setAnalyticsEnabled(true);
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
