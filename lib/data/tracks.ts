import type { Track } from "@/lib/types";

export const tracks: Track[] = [
  {
    slug: "apple-fundamentals",
    title: "Apple Fundamentals",
    category: "apple",
    hidden: false,
    level: "Débutant",
    lessons: 15,
    description:
      "Niveau 1 — écosystème Apple : macOS, iOS, iPadOS, Apple Silicon, Managed Apple Account et introduction au MDM.",
    duration: "12 h",
    logo: "apple",
    certification: "Apple Fundamentals",
    applePedagogyLevel: 1,
  },
  {
    slug: "apple-device-support",
    title: "Apple Device Support",
    category: "apple",
    hidden: false,
    level: "Intermédiaire",
    lessons: 19,
    description:
      "Niveau 2 — support macOS, iOS et iPadOS : diagnostics, RecoveryOS, FileVault, restauration et incidents MDM.",
    duration: "24 h",
    logo: "apple",
    certification: "Apple Device Support",
    applePedagogyLevel: 2,
  },
  {
    slug: "apple-it-professional",
    title: "Apple IT Professional",
    category: "apple",
    hidden: false,
    level: "Avancé",
    lessons: 18,
    description:
      "Niveau 3 — déploiement : Apple Business Manager, ADE, Device/User Enrollment, Configurator, profils et DDM.",
    duration: "30 h",
    logo: "shield",
    certification: "Apple IT Professional",
    applePedagogyLevel: 3,
  },
  {
    slug: "jamf-100",
    title: "Jamf 100",
    category: "jamf",
    hidden: false,
    level: "Pro",
    lessons: 20,
    description: "Fondamentaux Jamf Pro : inventaire, smart groups, configuration profiles et policies de base.",
    duration: "16 h",
    logo: "jamf",
    certification: "Jamf Certified Associate",
  },
  {
    slug: "jamf-170",
    title: "Jamf 170",
    category: "jamf",
    hidden: false,
    level: "Pro",
    lessons: 24,
    description: "Administration avancée Jamf Pro : extension attributes, scripts, Self Service et workflows.",
    duration: "20 h",
    logo: "jamf",
    certification: "Jamf Certified Admin",
  },
  {
    slug: "jamf-200",
    title: "Jamf 200",
    category: "jamf",
    hidden: false,
    level: "Expert",
    lessons: 28,
    description: "Expertise Jamf : API, patch management, integrations tierces et architecture à grande échelle.",
    duration: "24 h",
    logo: "jamf",
    certification: "Jamf Certified Expert",
  },
  {
    slug: "intune-mac",
    title: "Microsoft Intune pour Mac",
    category: "intune",
    hidden: false,
    level: "Pro",
    lessons: 26,
    description: "Gestion Apple avec Intune : enrollment ABM, conformité, Conditional Access et déploiement macOS/iOS.",
    duration: "18 h",
    logo: "intune",
    certification: "Intune Apple Admin",
  },
  {
    slug: "azure-for-apple-admins",
    title: "Azure essentiel pour Apple Administrators",
    category: "intune",
    hidden: false,
    level: "Intermédiaire",
    lessons: 8,
    description:
      "Compétences Microsoft Entra ID, Conditional Access, Platform SSO et Defender nécessaires aux admins Apple modernes.",
    duration: "10 h",
    logo: "microsoft",
    certification: "Apple IT Professional · Intune Administrator · Endpoint Administrator",
  },
  {
    slug: "parcours-professionnel",
    title: "Parcours Jamf Professionnel",
    category: "jamf",
    hidden: false,
    level: "Expert",
    lessons: 40,
    description:
      "Modules 11–18 : Intune Apple, Jamf Pro Fundamentals, Smart Groups, Policies, Scripts, Patch, Protect et sécurité Apple.",
    duration: "22 h",
    logo: "certificate",
    certification: "Jamf & Apple Enterprise",
  },
  {
    slug: "jamf-300",
    title: "Jamf 300 Prep",
    category: "jamf",
    hidden: false,
    level: "Expert",
    lessons: 10,
    description: "Architecture avancée, API, webhooks, patch management et dépannage Jamf Pro niveau entreprise.",
    duration: "28 h",
    logo: "jamf",
    certification: "Jamf 300 Ready",
  },
  {
    slug: "jamf-400",
    title: "Jamf 400 Prep",
    category: "jamf",
    hidden: false,
    level: "Expert",
    lessons: 10,
    description: "Automatisation, CI/CD, migration, reporting et projet final architecte Jamf.",
    duration: "32 h",
    logo: "jamf",
    certification: "Jamf 400 Ready",
  },
  {
    slug: "apple-enterprise-expert",
    title: "Apple Enterprise Expert",
    category: "apple",
    hidden: false,
    level: "Expert",
    lessons: 10,
    description:
      "Niveau 4 — sécurité Apple : Secure Enclave, FileVault, Gatekeeper, SIP, TCC, Activation Lock, conformité et correctifs.",
    duration: "30 h",
    logo: "apple",
    certification: "Apple Enterprise Expert",
    applePedagogyLevel: 4,
  },
  {
    slug: "apple-enterprise-architect",
    title: "Apple Enterprise Architect",
    category: "apple",
    hidden: false,
    level: "Expert",
    lessons: 8,
    description:
      "Niveau 5 — administration enterprise : architecture, choix MDM, identité, Shared iPad, BYOD, audit et reprise d’activité.",
    duration: "40 h",
    logo: "apple",
    certification: "Apple Enterprise Architect",
    applePedagogyLevel: 5,
  },
  {
    slug: "intune-apple-advanced",
    title: "Microsoft Intune Apple Advanced",
    category: "intune",
    hidden: false,
    level: "Expert",
    lessons: 10,
    description: "Intune macOS avancé, Conditional Access, Defender, SCEP, VPN et troubleshooting Apple.",
    duration: "26 h",
    logo: "intune",
    certification: "Intune Apple Advanced",
  },
];

export function getTrack(slug: string) {
  return tracks.find((t) => t.slug === slug);
}

export function getTrackBySlug(slug: string) {
  return getTrack(slug);
}

export function isTrackVisible(slug: string): boolean {
  return getTrack(slug)?.hidden === false;
}

export function getVisibleTracks(): Track[] {
  return tracks.filter((track) => !track.hidden);
}
