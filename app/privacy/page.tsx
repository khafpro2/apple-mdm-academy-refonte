import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Politique de confidentialité",
  description: "Politique de confidentialité, cookies et traitement des données RGPD — Apple MDM Academy.",
  path: "/privacy",
});

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    content: [
      "Apple MDM Academy (« nous ») s'engage à protéger vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.",
      "Cette politique décrit quelles données nous collectons, pourquoi, et vos droits.",
    ],
  },
  {
    id: "donnees",
    title: "Données collectées",
    content: [
      "Données de compte : email, nom (via Supabase Auth).",
      "Données de progression : scores quiz, labs terminés, badges, certificats.",
      "Données techniques : logs serveur, adresse IP (Vercel), navigateur.",
      "Données de paiement : traitées exclusivement par Stripe — nous ne stockons pas vos coordonnées bancaires.",
    ],
  },
  {
    id: "finalites",
    title: "Finalités du traitement",
    content: [
      "Fournir l'accès à la plateforme de formation et sauvegarder votre progression.",
      "Gérer les abonnements Pro et Entreprise.",
      "Émettre des certificats de réussite.",
      "Mesurer l'audience de manière agrégée (Vercel Analytics, first-party).",
      "Assurer la sécurité et la maintenance technique.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies et analytics",
    content: [
      "Nous utilisons des cookies strictement nécessaires pour l'authentification (Supabase).",
      "Vercel Analytics est un outil first-party qui ne dépose pas de cookies publicitaires tiers.",
      "Vous pouvez refuser les analytics via la bannière de consentement affichée à votre première visite.",
      "Aucun tracking publicitaire ou revente de données n'est effectué.",
    ],
  },
  {
    id: "conservation",
    title: "Conservation",
    content: [
      "Données de compte : conservées tant que votre compte est actif.",
      "Progression et certificats : conservés 3 ans après la dernière activité.",
      "Logs techniques : 30 jours maximum.",
    ],
  },
  {
    id: "droits",
    title: "Vos droits RGPD",
    content: [
      "Droit d'accès, de rectification, de suppression et de portabilité de vos données.",
      "Droit d'opposition au traitement à des fins d'analytics.",
      "Droit de déposer une réclamation auprès de la CNIL (www.cnil.fr).",
      "Pour exercer vos droits : kthiam@harmytech.com ou via /support.",
    ],
  },
  {
    id: "sous-traitants",
    title: "Sous-traitants",
    content: [
      "Vercel (hébergement, analytics) — USA, clauses contractuelles types.",
      "Supabase (authentification, base de données) — UE/USA selon région choisie.",
      "Stripe (paiements) — certifié PCI-DSS.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Politique de confidentialité"
      description="Transparence sur vos données, cookies et conformité RGPD."
      sections={sections}
      updatedAt="5 juin 2026"
    />
  );
}
