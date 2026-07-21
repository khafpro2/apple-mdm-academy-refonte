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
      <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Tarifs"
          title="C'est gratuit pour le moment"
          description="Profitez d'un accès complet à Apple MDM Academy — cours, labs, examens blancs et certificats, sans abonnement."
          align="center"
        />

        <div
          className="mx-auto mt-10 flex justify-center"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 320 200"
            className="h-44 w-full max-w-sm text-emerald-600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Illustration — accès gratuit à la plateforme"
          >
            <rect
              x="24"
              y="40"
              width="272"
              height="140"
              rx="20"
              className="fill-emerald-50 stroke-emerald-200"
              strokeWidth="2"
            />
            <rect
              x="48"
              y="64"
              width="80"
              height="56"
              rx="10"
              className="fill-white stroke-emerald-300"
              strokeWidth="2"
            />
            <path
              d="M60 88h64M60 100h48M60 112h56"
              className="stroke-emerald-400"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="200" cy="92" r="36" className="fill-emerald-100 stroke-emerald-400" strokeWidth="2" />
            <path
              d="M182 92c0-10 8-18 18-18s18 8 18 18-8 18-18 18"
              className="stroke-emerald-600"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <text
              x="200"
              y="100"
              textAnchor="middle"
              className="fill-emerald-700 text-[22px] font-bold"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              0 €
            </text>
            <path
              d="M148 148l12-12 16 16 28-28"
              className="stroke-emerald-500"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="88" cy="36" r="10" className="fill-amber-300" />
            <circle cx="248" cy="44" r="6" className="fill-emerald-300" />
            <circle cx="268" cy="160" r="8" className="fill-emerald-200" />
          </svg>
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
