/** Parcours certifiants commerciaux — V2 SaaS */

export type CommercialCertPath = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  level: string;
  duration: string;
  icon: string;
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
    icon: "🔐",
    modulesCount: 17,
    labsCount: 10,
    examsCount: 1,
    certificateName: "Apple IT Professional Ready",
    trackSlug: "apple-it-professional",
    examRouteSlug: "apple-it-professional",
    color: "from-blue-600/10 to-indigo-600/10",
  },
  {
    slug: "jamf-100",
    title: "Jamf 100 — Certified Associate",
    shortTitle: "Jamf 100",
    description: "Fondamentaux Jamf Pro : inventaire, Smart Groups, policies et configuration profiles.",
    level: "Pro",
    duration: "16 h",
    icon: "📱",
    modulesCount: 6,
    labsCount: 3,
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
    description: "Expertise Jamf : API, patch management, Jamf Protect et architecture à grande échelle.",
    level: "Expert",
    duration: "24 h",
    icon: "🏆",
    modulesCount: 3,
    labsCount: 2,
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
    icon: "☁️",
    modulesCount: 15,
    labsCount: 11,
    examsCount: 1,
    certificateName: "Certificat Intune Apple Specialist",
    trackSlug: "intune-mac",
    examRouteSlug: "intune-apple",
    color: "from-sky-600/10 to-blue-600/10",
  },
  {
    slug: "apple-security-expert",
    title: "Apple Security Expert",
    shortTitle: "Apple Security",
    description: "FileVault, Platform SSO, conformité, sécurité endpoint et durcissement macOS/iOS.",
    level: "Expert",
    duration: "18 h",
    icon: "🛡️",
    modulesCount: 6,
    labsCount: 1,
    examsCount: 1,
    certificateName: "Certificat Apple Security Expert",
    trackSlug: "apple-it-professional",
    certificationPathSlug: "parcours-apple-enterprise",
    color: "from-rose-600/10 to-orange-600/10",
  },
];

export function getCommercialCertPath(slug: string) {
  return commercialCertificationPaths.find((p) => p.slug === slug);
}
