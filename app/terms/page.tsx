import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Conditions d'utilisation",
  description: "Conditions générales d'utilisation de la plateforme Apple MDM Academy.",
  path: "/terms",
});

const sections = [
  {
    id: "objet",
    title: "Objet",
    content: [
      "Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme Apple MDM Academy.",
      "En créant un compte ou en utilisant le service, vous acceptez ces conditions.",
    ],
  },
  {
    id: "acces",
    title: "Accès au service",
    content: [
      "Offre Gratuite : accès limité aux modules d'introduction, quiz et aperçu labs.",
      "Offre Pro : accès complet aux cours, labs, examens blancs, certificats PDF et ressources.",
      "Offre Entreprise : accès multi-utilisateurs sur devis, avec dashboard admin dédié.",
      "L'accès nécessite un compte utilisateur valide et le respect des présentes CGU.",
    ],
  },
  {
    id: "compte",
    title: "Compte utilisateur",
    content: [
      "Vous êtes responsable de la confidentialité de vos identifiants.",
      "Un compte par personne physique — le partage de compte est interdit.",
      "Nous nous réservons le droit de suspendre un compte en cas de violation des CGU.",
    ],
  },
  {
    id: "contenu",
    title: "Propriété intellectuelle",
    content: [
      "Tous les contenus (cours, vidéos, labs, quiz, ressources) sont protégés par le droit d'auteur.",
      "L'accès ne confère aucun droit de reproduction, redistribution ou revente.",
      "Les certificats PDF sont personnels et non transférables.",
    ],
  },
  {
    id: "abonnement",
    title: "Abonnement et paiement",
    content: [
      "L'abonnement Pro est facturé mensuellement via Stripe.",
      "Vous pouvez annuler à tout moment depuis votre espace facturation.",
      "Aucun remboursement au prorata n'est garanti sauf disposition légale contraire.",
      "Les prix sont indiqués TTC en euros.",
    ],
  },
  {
    id: "responsabilite",
    title: "Limitation de responsabilité",
    content: [
      "Apple MDM Academy est un outil de formation — les certifications officielles Apple/Jamf/Microsoft sont délivrées par les éditeurs respectifs.",
      "Nous ne garantissons pas la réussite aux examens officiels.",
      "Le service est fourni « en l'état » sans garantie d' disponibilité ininterrompue.",
    ],
  },
  {
    id: "contact",
    title: "Contact",
    content: [
      "Pour toute question relative aux CGU : kthiam@harmytech.com ou /support.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Conditions d'utilisation"
      description="Règles d'accès, abonnements et propriété intellectuelle."
      sections={sections}
      updatedAt="5 juin 2026"
    />
  );
}
