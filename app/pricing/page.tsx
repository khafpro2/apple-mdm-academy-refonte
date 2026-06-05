import { PageShell } from "@/components/layout";
import { SectionHeading } from "@/components/ui";
import { PricingCard } from "@/components/cards";
import { pricingPlans } from "@/lib/data";
import { stripeConfig, stripeApiRoutes } from "@/lib/pricing/stripe-config";

export const metadata = {
  title: "Pricing",
  description: "Offres gratuite, Pro et Entreprise — architecture Stripe prête.",
};

export default function PricingPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Monétisation"
          title="Choisissez votre offre"
          description="Découverte gratuite, Pro pour les professionnels IT, Entreprise pour les équipes. Paiement Stripe à connecter."
          align="center"
        />

        {!stripeConfig.enabled && (
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-900">
            Stripe non connecté — configurez{" "}
            <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> et les Price IDs pour activer le checkout.
          </div>
        )}

        <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.slug}
              name={plan.name}
              price={plan.price}
              period={plan.period}
              description={plan.description}
              features={plan.features}
              highlighted={plan.highlighted}
              cta={plan.slug === "decouverte" ? plan.cta : stripeConfig.enabled ? "S'abonner" : "Bientôt disponible"}
              href={
                plan.slug === "entreprise"
                  ? "/contact"
                  : plan.slug === "decouverte"
                    ? "/parcours"
                    : stripeConfig.enabled
                      ? `${stripeApiRoutes.checkout}?plan=${plan.slug}`
                      : "/contact"
              }
            />
          ))}
        </div>

        <section className="mx-auto mt-16 max-w-3xl">
          <h2 className="text-center text-xl font-bold text-ink">Architecture Stripe (préparée)</h2>
          <div className="mt-6 rounded-2xl border border-border-light bg-surface-elevated p-6 font-mono text-sm text-ink-secondary">
            <p>POST {stripeApiRoutes.checkout}</p>
            <p>POST {stripeApiRoutes.portal}</p>
            <p>POST {stripeApiRoutes.webhook}</p>
            <p className="mt-4 text-ink-tertiary">
              Price Pro: {stripeConfig.priceIds.pro}
              <br />
              Price Entreprise: {stripeConfig.priceIds.entreprise}
            </p>
          </div>
        </section>

        <div className="mx-auto mt-12 max-w-2xl text-center text-sm text-ink-secondary">
          <p>
            Vous préférez la page tarifs existante ?{" "}
            <a href="/tarifs" className="font-semibold text-accent hover:underline">
              Voir /tarifs
            </a>
          </p>
        </div>
      </div>
    </PageShell>
  );
}
