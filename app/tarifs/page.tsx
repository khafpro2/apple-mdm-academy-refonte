import { PageShell } from "@/components/layout";
import { SectionHeading } from "@/components/ui";
import { PricingCard } from "@/components/cards";
import { pricingPlans } from "@/lib/data";

export const metadata = { title: "Tarifs" };

export default function TarifsPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Abonnements"
          title="Choisis ton plan"
          description="Commence gratuitement ou débloque l'accès complet à tous les parcours, labs et examens blancs."
          align="center"
        />

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
              cta={plan.cta}
              href={plan.slug === "entreprise" ? "/contact" : "/parcours"}
            />
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-2xl text-center">
          <h2 className="text-xl font-bold text-ink">Questions fréquentes</h2>
          <div className="mt-8 space-y-6 text-left">
            {[
              {
                q: "Puis-je annuler à tout moment ?",
                a: "Oui, les abonnements Pro et Entreprise sont sans engagement. Annule depuis ton dashboard.",
              },
              {
                q: "Les certificats sont-ils reconnus ?",
                a: "Nos examens blancs préparent aux certifications officielles Apple, Jamf et Microsoft. Les certificats PDF seront disponibles prochainement.",
              },
              {
                q: "Le plan Entreprise inclut-il du support ?",
                a: "Oui, support prioritaire par email et sessions live mensuelles pour votre équipe IT.",
              },
            ].map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-border-light bg-surface-elevated p-5">
                <p className="font-semibold text-ink">{faq.q}</p>
                <p className="mt-2 text-sm text-ink-secondary">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
