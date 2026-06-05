"use client";

import Link from "next/link";
import { useSubscription } from "@/lib/pricing/use-subscription";
import { TierBadge } from "@/components/subscription/tier-badge";

export function SubscriptionStatusBanner() {
  const { tier, plan, isPro } = useSubscription();

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border-light bg-surface-elevated px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-sm text-ink-secondary">Votre plan :</span>
        <TierBadge tier={tier} />
        <span className="text-sm font-medium text-ink">{plan.name}</span>
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
