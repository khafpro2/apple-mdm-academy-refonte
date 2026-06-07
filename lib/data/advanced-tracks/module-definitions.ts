/** Définitions des 40 modules expert — Jamf 300/400, Apple Enterprise, Intune Advanced */

import type { LogoName } from "@/lib/navigation/logo-names";

export type AdvancedModuleDef = {
  slug: string;
  title: string;
  trackSlug: string;
  quizSlug: string;
  labSlug: string | null;
  badgeId: string;
  resourceSlug: string;
  videoSlug: string;
  quizCount: 20 | 25;
  duration: string;
};

function mod(
  track: string,
  prefix: string,
  n: number,
  title: string,
  lab: string | null,
  badge: string,
  quizCount: 20 | 25 = 20
): AdvancedModuleDef {
  const slug = `${prefix}-m${String(n).padStart(2, "0")}`;
  return {
    slug,
    title,
    trackSlug: track,
    quizSlug: `quiz-${slug}`,
    labSlug: lab,
    badgeId: badge,
    resourceSlug: `resource-${slug}`,
    videoSlug: `video-${slug}`,
    quizCount,
    duration: quizCount === 25 ? "45 min" : "35 min",
  };
}

export const jamf300Modules: AdvancedModuleDef[] = [
  mod("jamf-300", "j300", 1, "Architecture Jamf Pro avancée", null, "badge-jamf-300-ready"),
  mod("jamf-300", "j300", 2, "Smart Groups avancés", null, "badge-jamf-300-ready"),
  mod("jamf-300", "j300", 3, "Extension Attributes", "jamf-extension-attributes", "badge-jamf-api-expert"),
  mod("jamf-300", "j300", 4, "Scripts avancés macOS", "jamf-advanced-scripts", "badge-jamf-api-expert"),
  mod("jamf-300", "j300", 5, "Packages avancés", null, "badge-jamf-300-ready"),
  mod("jamf-300", "j300", 6, "Policies complexes", null, "badge-jamf-300-ready"),
  mod("jamf-300", "j300", 7, "Jamf API", "jamf-api", "badge-jamf-api-expert"),
  mod("jamf-300", "j300", 8, "Webhooks Jamf", "jamf-webhooks", "badge-jamf-api-expert"),
  mod("jamf-300", "j300", 9, "Patch Management avancé", null, "badge-jamf-300-ready"),
  mod("jamf-300", "j300", 10, "Dépannage Jamf Pro", null, "badge-jamf-300-ready"),
];

export const jamf400Modules: AdvancedModuleDef[] = [
  mod("jamf-400", "j400", 1, "Automatisation avancée Jamf", null, "badge-jamf-400-ready", 25),
  mod("jamf-400", "j400", 2, "Workflows API", "jamf-api", "badge-jamf-api-expert", 25),
  mod("jamf-400", "j400", 3, "Intégration CI/CD", null, "badge-jamf-400-ready", 25),
  mod("jamf-400", "j400", 4, "Sécurité avancée macOS", null, "badge-apple-security-advanced", 25),
  mod("jamf-400", "j400", 5, "Déploiement zero-touch avancé", null, "badge-jamf-400-ready", 25),
  mod("jamf-400", "j400", 6, "Reporting avancé", null, "badge-jamf-400-ready", 25),
  mod("jamf-400", "j400", 7, "Scripts Bash avancés", "jamf-advanced-scripts", "badge-jamf-api-expert", 25),
  mod("jamf-400", "j400", 8, "Dépannage entreprise", null, "badge-jamf-400-ready", 25),
  mod("jamf-400", "j400", 9, "Migration Jamf", "jamf-migration", "badge-jamf-400-ready", 25),
  mod("jamf-400", "j400", 10, "Projet final Jamf 400", null, "badge-jamf-400-ready", 25),
];

export const appleEnterpriseModules: AdvancedModuleDef[] = [
  mod("apple-enterprise-expert", "aee", 1, "Apple Platform Deployment", null, "badge-apple-enterprise-expert"),
  mod("apple-enterprise-expert", "aee", 2, "Apple Business Manager avancé", null, "badge-apple-enterprise-expert"),
  mod("apple-enterprise-expert", "aee", 3, "Managed Apple IDs avancé", null, "badge-apple-enterprise-expert"),
  mod("apple-enterprise-expert", "aee", 4, "Platform SSO avancé", "platform-sso-advanced", "badge-platform-sso-expert"),
  mod("apple-enterprise-expert", "aee", 5, "Declarative Device Management", "declarative-device-management", "badge-ddm-specialist"),
  mod("apple-enterprise-expert", "aee", 6, "Managed Device Attestation", "managed-device-attestation", "badge-mda-specialist"),
  mod("apple-enterprise-expert", "aee", 7, "Return to Service", null, "badge-apple-enterprise-expert"),
  mod("apple-enterprise-expert", "aee", 8, "Apple Security Compliance", null, "badge-apple-security-advanced"),
  mod("apple-enterprise-expert", "aee", 9, "Apple Silicon en entreprise", null, "badge-apple-enterprise-expert"),
  mod("apple-enterprise-expert", "aee", 10, "Déploiement international", null, "badge-apple-enterprise-expert"),
];

export const appleEnterpriseArchitectModules: AdvancedModuleDef[] = [
  mod("apple-enterprise-architect", "aea", 1, "Architecture Apple Enterprise", "aea-architecture-stack", "badge-apple-enterprise-architect", 25),
  mod("apple-enterprise-architect", "aea", 2, "Identité Apple & Entra ID", "aea-identity-architecture", "badge-apple-enterprise-architect", 25),
  mod("apple-enterprise-architect", "aea", 3, "Jamf Pro Enterprise", "aea-jamf-500-mac", "badge-apple-enterprise-architect", 25),
  mod("apple-enterprise-architect", "aea", 4, "Intune Apple Enterprise", "aea-intune-global", "badge-apple-enterprise-architect", 25),
  mod("apple-enterprise-architect", "aea", 5, "Sécurité Apple Enterprise", "aea-security-audit", "badge-apple-enterprise-architect", 25),
  mod("apple-enterprise-architect", "aea", 6, "Automatisation des déploiements", "aea-automation-deploy", "badge-apple-enterprise-architect", 25),
  mod("apple-enterprise-architect", "aea", 7, "Dépannage avancé Apple MDM", "aea-troubleshooting-lab", "badge-apple-enterprise-architect", 25),
  mod("apple-enterprise-architect", "aea", 8, "Projets réels Enterprise", "aea-capstone-projects", "badge-apple-enterprise-architect", 25),
];

export const intuneAdvancedModules: AdvancedModuleDef[] = [
  mod("intune-apple-advanced", "iaa", 1, "Intune macOS avancé", null, "badge-intune-apple-advanced"),
  mod("intune-apple-advanced", "iaa", 2, "Conditional Access Apple", "intune-conditional-access", "badge-intune-apple-advanced"),
  mod("intune-apple-advanced", "iaa", 3, "Compliance avancée", null, "badge-intune-apple-advanced"),
  mod("intune-apple-advanced", "iaa", 4, "Microsoft Defender macOS", "microsoft-defender-macos", "badge-intune-apple-advanced"),
  mod("intune-apple-advanced", "iaa", 5, "SCEP et certificats", null, "badge-intune-apple-advanced"),
  mod("intune-apple-advanced", "iaa", 6, "Wi-Fi 802.1X", null, "badge-intune-apple-advanced"),
  mod("intune-apple-advanced", "iaa", 7, "VPN entreprise", null, "badge-intune-apple-advanced"),
  mod("intune-apple-advanced", "iaa", 8, "Platform SSO + Entra ID", "platform-sso-advanced", "badge-platform-sso-expert"),
  mod("intune-apple-advanced", "iaa", 9, "Reporting Intune", null, "badge-intune-apple-advanced"),
  mod("intune-apple-advanced", "iaa", 10, "Troubleshooting Intune Apple", null, "badge-intune-apple-advanced"),
];

export const allAdvancedModules = [
  ...jamf300Modules,
  ...jamf400Modules,
  ...appleEnterpriseModules,
  ...appleEnterpriseArchitectModules,
  ...intuneAdvancedModules,
];

export const advancedTrackMeta: {
  slug: string;
  title: string;
  level: string;
  lessons: number;
  description: string;
  duration: string;
  logo: LogoName;
  certification: string;
  modules: AdvancedModuleDef[];
}[] = [
  {
    slug: "jamf-300",
    title: "Jamf 300 Prep",
    level: "Expert",
    lessons: 10,
    description: "Architecture avancée, API, webhooks, patch management et dépannage Jamf Pro niveau entreprise.",
    duration: "28 h",
    logo: "jamf",
    certification: "Jamf 300 Ready",
    modules: jamf300Modules,
  },
  {
    slug: "jamf-400",
    title: "Jamf 400 Prep",
    level: "Expert",
    lessons: 10,
    description: "Automatisation, CI/CD, migration, reporting et projet final architecte Jamf.",
    duration: "32 h",
    logo: "jamf",
    certification: "Jamf 400 Ready",
    modules: jamf400Modules,
  },
  {
    slug: "apple-enterprise-expert",
    title: "Apple Enterprise Expert",
    level: "Expert",
    lessons: 10,
    description: "Platform Deployment, DDM, MDA, Platform SSO, compliance et déploiement international Apple.",
    duration: "30 h",
    logo: "apple",
    certification: "Apple Enterprise Expert",
    modules: appleEnterpriseModules,
  },
  {
    slug: "apple-enterprise-architect",
    title: "Apple Enterprise Architect",
    level: "Architect",
    lessons: 8,
    description:
      "Parcours architecte : stack Apple Enterprise, identité Entra, Jamf/Intune à l'échelle, sécurité, automatisation, dépannage et projets capstone.",
    duration: "40 h",
    logo: "apple",
    certification: "Apple Enterprise Architect",
    modules: appleEnterpriseArchitectModules,
  },
  {
    slug: "intune-apple-advanced",
    title: "Microsoft Intune Apple Advanced",
    level: "Expert",
    lessons: 10,
    description: "Intune macOS avancé, Conditional Access, Defender, SCEP, VPN et troubleshooting Apple.",
    duration: "26 h",
    logo: "intune",
    certification: "Intune Apple Advanced",
    modules: intuneAdvancedModules,
  },
];
