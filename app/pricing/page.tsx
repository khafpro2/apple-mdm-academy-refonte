import { PageShell } from "@/components/layout";
import { SectionHeading, ButtonLink } from "@/components/ui";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Tarifs",
  description:
    "Apple MDM Academy — formation Apple, Jamf Pro et Microsoft Intune en français. Accès 100 % gratuit pour le moment.",
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

/**
 * Page tarifs — version autonome et anti-crash.
 * Aucune dépendance à Stripe, aux plans commerciaux ni aux cartes de prix :
 * la page ne peut donc pas échouer au rendu côté serveur.
 * Quand les offres payantes seront prêtes, réintroduire la branche commerciale.
 */
export default function PricingPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <SectionHeading
              label="Tarifs"
              title="C'est gratuit pour le moment"
              description="Profitez d'un accès complet à Apple MDM Academy — cours, labs, examens blancs et certificats, sans abonnement."
              align="left"
            />
            <p className="-mt-4 text-sm font-medium text-ink-secondary lg:max-w-md">
              Moins de configuration manuelle. Plus de temps pour les vrais projets.
            </p>
          </div>

          <figure className="mx-auto w-full max-w-md lg:max-w-none">
            {/* SVG local : img plutôt que next/image (convention du projet pour les SVG) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/illustrations/pricing-admin-relief.svg"
              alt="Administrateur IT soulagé après avoir automatisé la gestion de ses appareils"
              width={800}
              height={520}
              className="h-auto w-full max-w-full"
              decoding="async"
              fetchPriority="high"
            />
            <figcaption className="sr-only">
              Illustration humoristique d&apos;un administrateur qui automatise la gestion de plusieurs appareils.
            </figcaption>
          </figure>
        </div>

        <div className="mt-10 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-surface-elevated p-8 shadow-sm">
          <p className="text-center text-lg font-semibold text-emerald-800">
            Accès 100&nbsp;% gratuit — aucune carte bancaire requise
          </p>

          <ul className="mx-auto mt-8 max-w-md space-y-3">
            {FREE_INCLUDES.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-ink-secondary">
                <span className="mt-0.5 text-emerald-600" aria-hidden="true">
                  ✓
                </span>
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
