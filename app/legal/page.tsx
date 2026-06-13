import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site-config";

export const metadata = buildPageMetadata({
  title: "Mentions légales",
  description: "Mentions légales, éditeur et hébergeur — Apple MDM Academy.",
  path: "/legal",
});

const sections = [
  {
    id: "editeur",
    title: "Éditeur du site",
    content: [
      "Apple MDM Academy",
      "Formation professionnelle Apple MDM, Jamf Pro et Microsoft Intune",
      "Email : kthiam@harmytech.com",
      "Directeur de la publication : Apple MDM Academy",
    ],
  },
  {
    id: "hebergeur",
    title: "Hébergeur",
    content: [
      "Vercel Inc.",
      "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
      "https://vercel.com",
    ],
  },
  {
    id: "donnees",
    title: "Données personnelles",
    content: [
      "Le traitement des données est décrit dans notre politique de confidentialité.",
      "Responsable du traitement : Apple MDM Academy.",
      "Hébergement des données utilisateur : Supabase (PostgreSQL).",
    ],
  },
  {
    id: "cookies",
    title: "Cookies",
    content: [
      "Cookies strictement nécessaires : session d'authentification Supabase.",
      "Analytics first-party : Vercel Analytics (avec consentement).",
      "Aucun cookie publicitaire tiers.",
    ],
  },
  {
    id: "marques",
    title: "Marques et propriété intellectuelle tierces",
    content: [
      "Jamf® est une marque déposée de Jamf Software, LLC.",
      "Microsoft, Microsoft Intune, Microsoft Entra ID et Microsoft Learn sont des marques de Microsoft Corporation.",
      "Apple MDM Academy est une plateforme indépendante et n'est pas affiliée à Jamf, Microsoft ou Apple Inc.",
      "Les logos et marques cités appartiennent à leurs propriétaires respectifs.",
    ],
  },
  {
    id: "propriete",
    title: "Propriété intellectuelle",
    content: [
      `L'ensemble du contenu pédagogique original du site ${siteConfig.url} est protégé.`,
      "Toute reproduction non autorisée est interdite.",
      "Apple, Jamf, Microsoft et leurs logos sont des marques déposées de leurs propriétaires respectifs.",
    ],
  },
  {
    id: "support",
    title: "Support",
    content: [
      "Centre d'aide : /support",
      "Statut des services : /status",
      "Contact commercial : /contact-sales",
    ],
  },
];

export default function LegalPage() {
  return (
    <LegalPageShell
      title="Mentions légales"
      description="Informations légales sur l'éditeur, l'hébergeur et la propriété intellectuelle."
      sections={sections}
      updatedAt="5 juin 2026"
    />
  );
}
