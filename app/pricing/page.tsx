import { PageShell } from "@/components/layout";
import { SectionHeading, ButtonLink } from "@/components/ui";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { isFreePlatformMode, PLATFORM_ACCESS } from "@/lib/pricing/platform-access";
import { commercialPlans, comparisonFeatures, PRICING_FAQ } from "@/lib/pricing/plans";
import { PricingCardPremium } from "@/components/pricing/pricing-card-premium";
import { PricingComparison } from "@/components/pricing/pricing-comparison";
import { stripeConfig } from "@/lib/pricing/stripe-config";

export const metadata = buildPageMetadata({
  title: "Tarifs",
  description: "Apple MDM Academy — formation Apple, Jamf Pro et Microsoft Intune en français.",
  path: "/pricing",
});

const FREE_INCLUDES = [
  "Accès complet à tous les cours et parcours",
  "Tous les labs pratiques",
  "Examens blancs inclus",
  "Certificats PDF inclus",
  "Ressources et vidéos pédagogiques",
  "Badges et dashboard apprenant",
];

export default function PricingPage() {
  if (isFreePlatformMode()) {
    return (
      <PageShell>
        <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            label="Accès"
            title="Plateforme en accès gratuit"
            description="Accès complet à tous les cours, examens blancs et certificats."
            align="center"
          />

          <div className="mt-10 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-surface-elevated p-8 shadow-sm">
            
            <ul className="mx-auto mt-8 max-w-md space-y-3">
              {FREE_INCLUDES.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink-secondary">
                  <span className="mt-0.5 text-emerald-600" aria-hidden="true">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <ButtonLink href="/auth/signup">Créer un compte</ButtonLink>
              <ButtonLink href="/parcours" variant="secondary">
                Explorer les parcours
              </ButtonLink>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-ink-tertiary">
            Les offres payantes (Pro / Entreprise) seront proposées ultérieurement. L&apos;architecture
            de facturation est préparée pour une activation future.
          </p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Abonnements"
          title="Formez vos équipes Apple MDM"
          description="Commencez gratuitement ou débloquez l'accès complet aux cours, labs, examens blancs et certificats PDF."
          align="center"
        />

        {!stripeConfig.enabled && (
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-900">
            Paiement Stripe en mode préparation — configurez{" "}
            <code className="rounded bg-amber-100 px-1">STRIPE_SECRET_KEY</code>,{" "}
            <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> et{" "}
            <code className="rounded bg-amber-100 px-1">STRIPE_WEBHOOK_SECRET</code>.
          </div>
        )}

        <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-3">
          {commercialPlans.map((plan) => (
            <PricingCardPremium key={plan.slug} plan={plan} />
          ))}
        </div>

        <section className="mt-20">
          <h2 className="text-center text-2xl font-bold text-ink">Comparaison des fonctionnalités</h2>
          <div className="mt-8">
            <PricingComparison features={comparisonFeatures} />
          </div>
        </section>

        <section className="mt-20 rounded-3xl bg-ink p-10 text-center text-white">
          <h2 className="text-2xl font-bold">Prêt à passer au niveau supérieur ?</h2>
          <p className="mx-auto mt-3 max-w-lg text-zinc-300">
            Rejoignez les administrateurs Apple qui se préparent aux certifications Jamf 100, Jamf 200 et Apple IT Professional.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/checkout?plan=pro" className="bg-white text-ink hover:bg-zinc-100">
              Passer à Pro — 29 €/mois
            </ButtonLink>
            <ButtonLink href="/enterprise" variant="secondary" className="border-white/30 text-white hover:bg-white/10">
              Offre Entreprise
            </ButtonLink>
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-2xl">
          <h2 className="text-center text-xl font-bold text-ink">Questions fréquentes</h2>
          <div className="mt-8 space-y-4">
            {PRICING_FAQ.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-border-light bg-surface-elevated p-5">
                <p className="font-semibold text-ink">{faq.q}</p>
                <p className="mt-2 text-sm text-ink-secondary">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
