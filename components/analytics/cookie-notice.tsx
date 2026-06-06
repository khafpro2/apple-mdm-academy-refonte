"use client";

import { useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import { setAnalyticsEnabled } from "@/lib/analytics/events";

const STORAGE_KEY = "apple-mdm-analytics-consent";
const CONSENT_EVENT = "apple-mdm-analytics-consent-change";

function readShouldShowNotice(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "declined") {
      setAnalyticsEnabled(false);
      return false;
    }
    return !stored;
  } catch {
    return false;
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

function notifyConsentChange() {
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function CookieNotice() {
  const visible = useSyncExternalStore(subscribe, readShouldShowNotice, () => false);

  const accept = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      /* ignore */
    }
    setAnalyticsEnabled(true);
    notifyConsentChange();
  }, []);

  const decline = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "declined");
    } catch {
      /* ignore */
    }
    setAnalyticsEnabled(false);
    notifyConsentChange();
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentement cookies et analytics"
      className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-2xl rounded-2xl border border-border-light bg-surface-elevated p-5 shadow-xl"
    >
      <p className="text-sm leading-relaxed text-ink-secondary">
        Nous utilisons Vercel Analytics (first-party, sans cookies publicitaires) pour mesurer
        l&apos;audience et améliorer la plateforme. Consultez notre{" "}
        <Link href="/privacy" className="font-medium text-accent hover:underline">
          politique de confidentialité
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={accept}
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Accepter
        </button>
        <button
          type="button"
          onClick={decline}
          className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Refuser
        </button>
      </div>
    </div>
  );
}
