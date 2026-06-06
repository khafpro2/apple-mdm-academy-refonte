"use client";

import Link from "next/link";
import { useSubscription } from "@/lib/pricing/use-subscription";
import { isFreePlatformMode, PLATFORM_ACCESS } from "@/lib/pricing/platform-access";
import { TierBadge } from "@/components/subscription/tier-badge";

export function SubscriptionStatusBanner() {
  const { tier, plan, isPro, statusLabel, isPreview } = useSubscription();

  if (isFreePlatformMode() || isPreview) {
    return (
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-ink-secondary">Plan actuel :</span>
          <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-emerald-800">
            Preview
          </span>
          <span className="text-sm font-medium text-ink">{PLATFORM_ACCESS.planName}</span>
          <span className="text-sm text-ink-tertiary">· Statut : {PLATFORM_ACCESS.statusLabel}</span>
        </div>
        <Link href="/pricing" className="text-sm font-semibold text-accent hover:underline">
          Accès gratuit →
        </Link>
      </div>
    );
  }

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border-light bg-surface-elevated px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-sm text-ink-secondary">Votre plan :</span>
        <TierBadge tier={tier} />
        <span className="text-sm font-medium text-ink">{plan.name}</span>
        {statusLabel && <span className="text-sm text-ink-tertiary">· {statusLabel}</span>}
      </div>
      <Link
        href={isPro ? "/account/billing" : "/checkout?plan=pro"}
        className="text-sm font-semibold text-accent hover:underline"
      >
        {isPro ? "Gérer l'abonnement →" : "Passer à Pro →"}
      </Link>
    </div>
  );
}
