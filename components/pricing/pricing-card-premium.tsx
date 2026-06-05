"use client";

import Link from "next/link";
import type { CommercialPlan } from "@/lib/pricing/types";
import { ButtonLink, Badge } from "@/components/ui";
import { trackEvent } from "@/lib/analytics/events";

export function PricingCardPremium({ plan }: { plan: CommercialPlan }) {
  function handleCtaClick() {
    trackEvent("clic_pricing", { plan: plan.slug });
  }

  return (
    <div
      className={`flex flex-col rounded-3xl p-8 ${
        plan.highlighted
          ? "border-2 border-accent bg-surface-elevated shadow-xl ring-1 ring-accent/20 scale-[1.02]"
          : "border border-border-light bg-surface-elevated shadow-sm"
      }`}
    >
      {plan.highlighted && (
        <Badge variant="accent" className="mb-4 self-start">Populaire</Badge>
      )}
      <h3 className="text-xl font-bold text-ink">{plan.name}</h3>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-bold text-ink">{plan.priceLabel}</span>
        {plan.period && <span className="text-ink-secondary">{plan.period}</span>}
      </div>
      <p className="mt-3 text-sm text-ink-secondary">{plan.description}</p>
      <ul className="mt-6 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-ink-secondary">
            <span className="mt-0.5 text-accent" aria-hidden="true">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <ButtonLink
        href={plan.ctaHref}
        variant={plan.highlighted ? "primary" : "secondary"}
        className="mt-8 w-full text-center"
        onClick={handleCtaClick}
      >
        {plan.cta}
      </ButtonLink>
      {plan.slug === "enterprise" && (
        <Link href="/contact-sales" className="mt-3 text-center text-xs text-accent hover:underline">
          Demander un devis →
        </Link>
      )}
    </div>
  );
}
