"use client";

import Link from "next/link";
import { useSubscription } from "@/lib/pricing/use-subscription";
import type { SubscriptionTier } from "@/lib/pricing/types";
import { tierMeetsRequirement } from "@/lib/pricing/access-control";
import { isFreePlatformMode } from "@/lib/pricing/platform-access";
import { ButtonLink } from "@/components/ui";

type Props = {
  requiredTier?: SubscriptionTier;
  featureLabel?: string;
  children: React.ReactNode;
};

export function SubscriptionGate({ requiredTier = "pro", featureLabel, children }: Props) {
  const { tier } = useSubscription();

  if (isFreePlatformMode() || tierMeetsRequirement(tier, requiredTier)) {
    return <>{children}</>;
  }

  return (
    <div className="rounded-3xl border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-surface-elevated p-8 text-center shadow-sm">
      <span className="text-4xl" aria-hidden="true">🔒</span>
      <h2 className="mt-4 text-xl font-bold text-ink">Contenu réservé aux membres Pro</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-secondary">
        {featureLabel
          ? `Ce contenu (${featureLabel}) est réservé aux membres Pro.`
          : "Ce contenu est réservé aux membres Pro."}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/checkout?plan=pro">Passer à Pro</ButtonLink>
        <Link href="/pricing" className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink">
          Voir les offres
        </Link>
      </div>
    </div>
  );
}
