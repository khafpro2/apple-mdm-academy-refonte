/** Parcours certifiants commerciaux — V2 SaaS */

import type { LogoName } from "@/lib/navigation/logo-names";

export type CommercialCertPath = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  level: string;
  duration: string;
  logo: LogoName;
  modulesCount: number;
  labsCount: number;
  examsCount: number;
  certificateName: string;
  trackSlug: string;
  certificationPathSlug?: string;
  examRouteSlug?: string;
  color: string;
};

export const commercialCertificationPaths: CommercialCertPath[] = [
  {
    slug: "apple-certified-it-professional",
    title: "Apple Certified IT Professional",
    shortTitle: "Apple IT Pro",
    description: "Maîtrisez MDM Apple, ABM, ADE, APNs et l'architecture de sécurité entreprise.",
    level: "Avancé",
    duration: "30 h",
    logo: "shield",
    modulesCount: 17,
    labsCount: 10,
    examsCount: 1,
    certificateName: "Apple IT Professional Ready",
    trackSlug: "apple-it-professional",
    examRouteSlug: "apple-it-professional",
    color: "from-blue-600/10 to-indigo-600/10",
  },
  {
    slug: "apple-deployment",
    title: "Apple Deployment & Management",
    shortTitle: "Apple Deployment",
    description:
      "ABM, ADE, APNs, Apps & Books, Managed Apple Account (anciennement Managed Apple ID), Platform SSO, DDM et attestation — examen 100 Q.",
    level: "Avancé",
    duration: "20 h",
    logo: "apple",
    modulesCount: 8,
    labsCount: 8,
    examsCount: 1,
    certificateName: "Apple Deployment Specialist",
    trackSlug: "apple-it-professional",
    examRouteSlug: "apple-deployment",
    color: "from-green-600/10 to-emerald-600/10",
  },
  {
    slug: "apple-security",
    title: "Apple Security Enterprise",
    shortTitle: "Apple Security",
    description: "FileVault, Gatekeeper, SIP, XProtect, Activation Lock, MDA — scénarios enterprise et examen 100 Q.",
    level: "Expert",
    duration: "18 h",
    logo: "shield",
    modulesCount: 6,
    labsCount: 2,
    examsCount: 1,
    certificateName: "Apple Security Enterprise Ready",
    trackSlug: "apple-it-professional",
    examRouteSlug: "apple-security",
    color: "from-red-600/10 to-rose-600/10",
  },
  {
    slug: "jamf-100",
    title: "Jamf 100 — Certified Associate",
    shortTitle: "Jamf 100",
    description: "Fondamentaux Jamf Pro 11.16 : inventaire, Smart Groups, policies, packages et Self Service.",
    level: "Pro",
    duration: "16 h",
    logo: "jamf",
    modulesCount: 6,
    labsCount: 5,
    examsCount: 1,
    certificateName: "Certificat Jamf 100",
    trackSlug: "jamf-100",
    certificationPathSlug: "parcours-jamf-100",
    examRouteSlug: "jamf-100",
    color: "from-emerald-600/10 to-teal-600/10",
  },
  {
    slug: "jamf-200",
    title: "Jamf 200 — Certified Admin",
    shortTitle: "Jamf 200",
    description: "Expertise Jamf Pro 11.16 : scripts, patch management, packages, Self Service et Jamf Protect.",
    level: "Expert",
    duration: "24 h",
    logo: "jamf",
    modulesCount: 3,
    labsCount: 4,
    examsCount: 1,
    certificateName: "Certificat Jamf 200",
    trackSlug: "jamf-200",
    certificationPathSlug: "parcours-jamf-200",
    examRouteSlug: "jamf-200",
    color: "from-violet-600/10 to-purple-600/10",
  },
  {
    slug: "intune-apple-specialist",
    title: "Intune Apple Specialist",
    shortTitle: "Intune Apple",
    description: "Déploiement Apple avec Microsoft Intune : APNs, ADE, profils, compliance et Platform SSO.",
    level: "Pro",
    duration: "20 h",
    logo: "intune",
    modulesCount: 19,
    labsCount: 16,
    examsCount: 1,
    certificateName: "Certificat Intune Apple Specialist",
    trackSlug: "intune-mac",
    examRouteSlug: "intune-apple",
    color: "from-sky-600/10 to-blue-600/10",
  },
  {
    slug: "azure-for-apple-admins",
    title: "Azure essentiel pour Apple Administrators",
    shortTitle: "Azure Apple Admin",
    description:
      "Microsoft Entra ID, MFA, groupes, ABM federation, Intune, Conditional Access, Platform SSO et Defender pour admins Apple.",
    level: "Débutant → Intermédiaire",
    duration: "10 h",
    logo: "microsoft",
    modulesCount: 8,
    labsCount: 8,
    examsCount: 1,
    certificateName: "Apple IT Professional · Intune Administrator · Endpoint Administrator",
    trackSlug: "azure-for-apple-admins",
    color: "from-blue-600/10 to-cyan-600/10",
  },
  {
    slug: "apple-enterprise-architect",
    title: "Apple Enterprise Architect",
    shortTitle: "Enterprise Architect",
    description:
      "Parcours architecte : stack Apple Enterprise, identité Entra, Jamf/Intune à l'échelle, sécurité, automatisation, 50 scénarios dépannage et projets capstone.",
    level: "Architect",
    duration: "40 h",
    logo: "apple",
    modulesCount: 8,
    labsCount: 8,
    examsCount: 1,
    certificateName: "Certificat Apple Enterprise Architect",
    trackSlug: "apple-enterprise-architect",
    examRouteSlug: "apple-enterprise-architect",
    color: "from-amber-600/10 to-orange-600/10",
  },
  {
    slug: "apple-security-expert",
    title: "Apple Security Expert",
    shortTitle: "Apple Security",
    description: "FileVault, Platform SSO, conformité, sécurité endpoint et durcissement macOS/iOS.",
    level: "Expert",
    duration: "18 h",
    logo: "shield",
    modulesCount: 6,
    labsCount: 1,
    examsCount: 1,
    certificateName: "Certificat Apple Security Expert",
    trackSlug: "apple-it-professional",
    examRouteSlug: "apple-security",
    certificationPathSlug: "parcours-apple-enterprise",
    color: "from-rose-600/10 to-orange-600/10",
  },
];

export function getCommercialCertPath(slug: string) {
  return commercialCertificationPaths.find((p) => p.slug === slug);
}
