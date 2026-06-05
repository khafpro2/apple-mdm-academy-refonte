"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SectionHeading, ButtonLink } from "@/components/ui";
import { commercialPlans, getPlanBySlug } from "@/lib/pricing/plans";
import { useSubscription } from "@/lib/pricing/use-subscription";
import { stripeConfig, stripeApiRoutes } from "@/lib/pricing/stripe-config";
import { trackEvent } from "@/lib/analytics/events";
import { TierBadge } from "@/components/subscription/tier-badge";

export function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planSlug = (searchParams.get("plan") ?? "pro") as "pro" | "enterprise";
  const cancelled = searchParams.get("cancelled");
  const plan = getPlanBySlug(planSlug === "enterprise" ? "enterprise" : "pro") ?? commercialPlans[1];
  const { tier, upgradeToPro, isPro } = useSubscription();

  useEffect(() => {
    if (cancelled) {
      /* cancelled checkout */
    }
  }, [cancelled]);

  const handleCheckout = async () => {
    if (plan.slug === "enterprise") {
      router.push("/contact-sales");
      return;
    }
    if (stripeConfig.enabled) {
      const res = await fetch(stripeApiRoutes.checkout, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planSlug: plan.slug }),
      });
      const data = (await res.json()) as { url?: string };
      if (data.url) {
        router.push(data.url);
        return;
      }
    }
    upgradeToPro();
    trackEvent("upgrade_pro");
    router.push("/checkout/success");
  };

  if (isPro && plan.slug === "pro") {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-green-200 bg-green-50 p-8 text-center">
        <TierBadge tier={tier} className="mb-4" />
        <h2 className="text-xl font-bold text-ink">Vous êtes déjà membre Pro</h2>
        <p className="mt-2 text-sm text-ink-secondary">Gérez votre abonnement depuis l&apos;espace facturation.</p>
        <ButtonLink href="/account/billing" className="mt-6">Mon abonnement</ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
      <div className="rounded-3xl border border-border-light bg-surface-elevated p-8">
        <h2 className="text-lg font-bold text-ink">Récapitulatif</h2>
        <div className="mt-6 space-y-4">
          <div className="flex justify-between">
            <span className="font-medium text-ink">{plan.name}</span>
            <span className="font-bold text-ink">{plan.priceLabel}{plan.period}</span>
          </div>
          <ul className="space-y-2 border-t border-border-light pt-4 text-sm text-ink-secondary">
            {plan.features.slice(0, 5).map((f) => (
              <li key={f}>✓ {f}</li>
            ))}
          </ul>
        </div>
        {!stripeConfig.enabled && (
          <p className="mt-6 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">
            Mode démo : le bouton ci-dessous active Pro localement (sans paiement Stripe).
          </p>
        )}
      </div>

      <div className="rounded-3xl border border-border-light bg-surface-elevated p-8">
        <h2 className="text-lg font-bold text-ink">Paiement</h2>
        <p className="mt-2 text-sm text-ink-secondary">
          {stripeConfig.enabled
            ? "Vous serez redirigé vers Stripe Checkout."
            : "Stripe non configuré — activation démo de l'abonnement Pro."}
        </p>
        {cancelled && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">Paiement annulé. Réessayez quand vous voulez.</p>
        )}
        <button
          type="button"
          onClick={handleCheckout}
          className="mt-6 w-full rounded-full bg-accent py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          {plan.slug === "enterprise" ? "Contacter les ventes" : `S'abonner — ${plan.priceLabel}${plan.period}`}
        </button>
        <Link href="/pricing" className="mt-4 block text-center text-sm text-ink-secondary hover:text-ink">
          ← Retour aux tarifs
        </Link>
      </div>
    </div>
  );
}
