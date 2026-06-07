"use client";

/** Événements analytics non invasifs — Vercel Web Analytics (first-party, RGPD-friendly). */
export type AnalyticsEvent =
  | "inscription"
  | "connexion"
  | "connexion_demo"
  | "module_termine"
  | "lab_termine"
  | "quiz_termine"
  | "examen_reussi"
  | "clic_pricing"
  | "upgrade_pro";

type EventProps = Record<string, string | number | boolean>;

let analyticsEnabled = true;

export function setAnalyticsEnabled(enabled: boolean) {
  analyticsEnabled = enabled;
}

export function trackEvent(name: AnalyticsEvent, props?: EventProps) {
  if (typeof window === "undefined" || !analyticsEnabled) return;

  void import("@vercel/analytics")
    .then(({ track }) => track(name, props))
    .catch(() => {
      /* Analytics non disponible — ignoré silencieusement */
    });
}
