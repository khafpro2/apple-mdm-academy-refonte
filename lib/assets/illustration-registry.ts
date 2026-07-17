export type IllustrationSourceType = "original" | "lab-capture" | "licensed" | "generated";

export type IllustrationAsset = {
  id: string;
  src: string;
  sourceType: IllustrationSourceType;
  author: string;
  license: "project-owned" | "cc0" | "licensed-reuse";
  alt: string;
  usedIn: string[];
  sourceNote?: string;
};

/**
 * Registre des illustrations pédagogiques originales Apple MDM Academy.
 * Aucune image issue de salescoach.apple.com.
 */
export const illustrationRegistry: IllustrationAsset[] = [
  {
    id: "abm-to-mdm-flow",
    src: "/illustrations/flows/abm-to-mdm.svg",
    sourceType: "original",
    author: "Apple MDM Academy",
    license: "project-owned",
    alt: "Flux entre Apple Business Manager, le serveur MDM et l’appareil Apple géré",
    usedIn: ["apple-it-professional", "apple-fundamentals"],
  },
  {
    id: "automated-device-enrollment-flow",
    src: "/illustrations/flows/automated-device-enrollment.svg",
    sourceType: "original",
    author: "Apple MDM Academy",
    license: "project-owned",
    alt: "Séquence Automated Device Enrollment : ABM, MDM, activation et supervision",
    usedIn: ["apple-it-professional"],
  },
  {
    id: "enrollment-types-compare",
    src: "/illustrations/flows/enrollment-types.svg",
    sourceType: "original",
    author: "Apple MDM Academy",
    license: "project-owned",
    alt: "Comparaison Automated Device Enrollment, Device Enrollment et User Enrollment",
    usedIn: ["apple-it-professional", "apple-fundamentals"],
  },
  {
    id: "declarative-device-management",
    src: "/illustrations/flows/declarative-device-management.svg",
    sourceType: "original",
    author: "Apple MDM Academy",
    license: "project-owned",
    alt: "Boucle Declarative Device Management entre déclarations, statut et serveur MDM",
    usedIn: ["apple-it-professional", "apple-enterprise-expert"],
  },
  {
    id: "filevault-recovery",
    src: "/illustrations/flows/filevault-recovery.svg",
    sourceType: "original",
    author: "Apple MDM Academy",
    license: "project-owned",
    alt: "Schéma FileVault avec clé utilisateur et clé de récupération institutionnelle",
    usedIn: ["apple-fundamentals", "apple-device-support", "apple-enterprise-expert"],
  },
  {
    id: "device-lifecycle",
    src: "/illustrations/flows/device-lifecycle.svg",
    sourceType: "original",
    author: "Apple MDM Academy",
    license: "project-owned",
    alt: "Cycle de vie d’un appareil Apple en entreprise de l’achat au retrait",
    usedIn: ["apple-enterprise-architect", "apple-it-professional"],
  },
  {
    id: "abm-jamf-intune",
    src: "/illustrations/flows/abm-jamf-intune.svg",
    sourceType: "original",
    author: "Apple MDM Academy",
    license: "project-owned",
    alt: "Apple Business Manager connecté à Jamf Pro et Microsoft Intune",
    usedIn: ["apple-enterprise-architect", "intune-mac", "jamf-100"],
  },
  {
    id: "platform-sso-overview",
    src: "/illustrations/flows/platform-sso.svg",
    sourceType: "original",
    author: "Apple MDM Academy",
    license: "project-owned",
    alt: "Vue d’ensemble Platform SSO entre IdP, macOS et MDM",
    usedIn: ["apple-enterprise-expert", "azure-for-apple-admins"],
  },
  {
    id: "shared-ipad-sessions",
    src: "/illustrations/flows/shared-ipad.svg",
    sourceType: "original",
    author: "Apple MDM Academy",
    license: "project-owned",
    alt: "Sessions Shared iPad avec Managed Apple Accounts sur iPadOS",
    usedIn: ["apple-enterprise-architect", "apple-it-professional"],
  },
  {
    id: "compliance-loop",
    src: "/illustrations/flows/compliance-loop.svg",
    sourceType: "original",
    author: "Apple MDM Academy",
    license: "project-owned",
    alt: "Boucle de conformité appareil, MDM et accès conditionnel",
    usedIn: ["apple-enterprise-expert", "intune-mac"],
  },
  {
    id: "os-update-cycle",
    src: "/illustrations/flows/os-update-cycle.svg",
    sourceType: "original",
    author: "Apple MDM Academy",
    license: "project-owned",
    alt: "Cycle de mise à jour macOS, iOS et iPadOS géré par MDM",
    usedIn: ["apple-it-professional", "apple-device-support"],
  },
];

export function getIllustration(id: string) {
  return illustrationRegistry.find((a) => a.id === id);
}

export function getIllustrationsForCourse(courseSlug: string) {
  return illustrationRegistry.filter((a) => a.usedIn.includes(courseSlug));
}
