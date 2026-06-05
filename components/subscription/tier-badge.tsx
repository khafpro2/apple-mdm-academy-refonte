"use client";

import type { SubscriptionTier } from "@/lib/pricing/types";

const STYLES: Record<SubscriptionTier, string> = {
  free: "bg-gray-100 text-gray-700",
  pro: "bg-accent/10 text-accent",
  enterprise: "bg-indigo-100 text-indigo-800",
};

const LABELS: Record<SubscriptionTier, string> = {
  free: "Free",
  pro: "Pro",
  enterprise: "Enterprise",
};

export function TierBadge({ tier, className = "" }: { tier: SubscriptionTier; className?: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${STYLES[tier]} ${className}`}>
      {LABELS[tier]}
    </span>
  );
}
