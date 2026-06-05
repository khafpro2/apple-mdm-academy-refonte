import type { CommercialPlan, ComparisonFeature, PlanSlug, SubscriptionTier } from "@/lib/pricing/types";

export const commercialPlans: CommercialPlan[] = [
  {
    slug: "free",
    name: "Gratuit",
    price: 0,
    priceLabel: "0 €",
    period: "Gratuit",
    description: "Découvrez Apple MDM Academy avec les modules d'introduction.",
    tier: "free",
    features: [
      "Modules d'introduction",
      "Quelques quiz d'évaluation",
      "Aperçu des labs pratiques",
      "Dashboard apprenant basique",
      "Pas de certificats PDF",
    ],
    cta: "Commencer gratuitement",
    ctaHref: "/parcours",
  },
  {
    slug: "pro",
    name: "Pro",
    price: 29,
    priceLabel: "29 €",
    period: "/ mois",
    description: "Accès complet pour les professionnels IT Apple, Jamf et Intune.",
    tier: "pro",
    highlighted: true,
    features: [
      "Tous les cours et parcours",
      "Tous les labs pratiques",
      "Examens blancs complets",
      "Certificats PDF",
      "Ressources téléchargeables",
      "Vidéos pédagogiques HeyGen",
      "Support communautaire",
    ],
    cta: "Passer à Pro",
    ctaHref: "/checkout?plan=pro",
  },
  {
    slug: "enterprise",
    name: "Entreprise",
    price: null,
    priceLabel: "Sur devis",
    period: "",
    description: "Formation Apple MDM pour équipes IT avec reporting et support dédié.",
    tier: "enterprise",
    features: [
      "Accès multi-utilisateurs",
      "Dashboard admin entreprise",
      "Suivi des équipes",
      "Reporting progression RH",
      "Support prioritaire",
      "Personnalisation parcours",
      "Sessions live mensuelles",
    ],
    cta: "Contacter les ventes",
    ctaHref: "/contact-sales",
  },
];

export const comparisonFeatures: ComparisonFeature[] = [
  { label: "Modules d'introduction", free: true, pro: true, enterprise: true },
  { label: "Tous les cours", free: false, pro: true, enterprise: true },
  { label: "Labs pratiques", free: "Aperçu", pro: true, enterprise: true },
  { label: "Quiz d'évaluation", free: "Limité", pro: true, enterprise: true },
  { label: "Examens blancs", free: false, pro: true, enterprise: true },
  { label: "Certificats PDF", free: false, pro: true, enterprise: true },
  { label: "Ressources téléchargeables", free: "3 checklists", pro: true, enterprise: true },
  { label: "Vidéos pédagogiques", free: "Aperçu", pro: true, enterprise: true },
  { label: "Multi-utilisateurs", free: false, pro: false, enterprise: true },
  { label: "Reporting équipe", free: false, pro: false, enterprise: true },
  { label: "Support prioritaire", free: false, pro: false, enterprise: true },
];

export function getPlanBySlug(slug: PlanSlug): CommercialPlan | undefined {
  return commercialPlans.find((p) => p.slug === slug);
}

export function getPlanByTier(tier: SubscriptionTier): CommercialPlan {
  return commercialPlans.find((p) => p.tier === tier) ?? commercialPlans[0];
}

export const PRICING_FAQ = [
  {
    q: "Puis-je annuler mon abonnement Pro à tout moment ?",
    a: "Oui, l'abonnement Pro est sans engagement. Vous pouvez annuler depuis votre espace facturation.",
  },
  {
    q: "Les certificats sont-ils inclus dans l'offre gratuite ?",
    a: "Non, les certificats PDF sont réservés aux membres Pro et Entreprise.",
  },
  {
    q: "Comment fonctionne l'offre Entreprise ?",
    a: "Contactez notre équipe commerciale pour un devis personnalisé selon la taille de votre équipe IT.",
  },
  {
    q: "Quand Stripe sera-t-il activé ?",
    a: "L'architecture de paiement est prête. Activez vos clés Stripe pour lancer les abonnements réels.",
  },
];
