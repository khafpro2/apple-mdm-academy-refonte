import type { Course, OfficialSource, VersionDifference } from "@/lib/types";
import { PLATFORM_LAST_VERIFIED_AT } from "@/lib/platform-versions";

const APPLE_SUPPORT_SECURITY: OfficialSource = {
  title: "Apple security releases",
  publisher: "Apple",
  url: "https://support.apple.com/100100",
  checkedAt: PLATFORM_LAST_VERIFIED_AT,
};

const APPLE_PLATFORM_DEPLOYMENT: OfficialSource = {
  title: "Apple Platform Deployment",
  publisher: "Apple",
  url: "https://support.apple.com/guide/deployment/welcome/web",
  checkedAt: PLATFORM_LAST_VERIFIED_AT,
};

const APPLE_PLATFORM_SECURITY: OfficialSource = {
  title: "Apple Platform Security",
  publisher: "Apple",
  url: "https://support.apple.com/guide/security/welcome/web",
  checkedAt: PLATFORM_LAST_VERIFIED_AT,
};

/** Métadonnées de compatibilité appliquées progressivement aux cours Apple V1. */
export const courseCompatibilityDefaults: Record<
  string,
  Pick<
    Course,
    | "platforms"
    | "primaryVersion"
    | "minimumVersion"
    | "supportedVersions"
    | "versionStatus"
    | "lastVerifiedAt"
    | "officialSources"
    | "versionDifferences"
  >
> = {
  "apple-fundamentals": {
    platforms: ["macOS", "iOS", "iPadOS"],
    primaryVersion: "26",
    minimumVersion: "15",
    supportedVersions: ["26", "18", "17", "15", "14"],
    versionStatus: "compatible",
    lastVerifiedAt: PLATFORM_LAST_VERIFIED_AT,
    officialSources: [APPLE_SUPPORT_SECURITY, APPLE_PLATFORM_DEPLOYMENT, APPLE_PLATFORM_SECURITY],
    versionDifferences: [
      {
        platform: "macOS",
        fromVersion: "15",
        toVersion: "26",
        kind: "ui",
        summary: "Le numéro de version majeure macOS est aligné sur l’année (26 = Tahoe).",
        detail: "Les flottes encore en Sequoia 15 ou Sonoma 14 restent documentées pour la migration.",
      },
      {
        platform: "iPadOS",
        toVersion: "26",
        kind: "new-capability",
        summary: "iPadOS expose un multitâche et une gestion de fenêtres distincts d’iOS.",
        detail: "Ne pas traiter iPhone et iPad comme des interfaces identiques dans les procédures.",
      },
    ] satisfies VersionDifference[],
  },
  "apple-device-support": {
    platforms: ["macOS", "iOS", "iPadOS"],
    primaryVersion: "26",
    minimumVersion: "14",
    supportedVersions: ["26", "18", "17", "15", "14"],
    versionStatus: "compatible",
    lastVerifiedAt: PLATFORM_LAST_VERIFIED_AT,
    officialSources: [APPLE_SUPPORT_SECURITY, APPLE_PLATFORM_SECURITY],
    versionDifferences: [
      {
        platform: "macOS",
        kind: "hardware",
        summary: "RecoveryOS et démarrage sécurisé diffèrent entre Apple Silicon et Intel.",
        detail: "Les procédures de restauration doivent préciser l’architecture matérielle.",
      },
      {
        platform: "iOS",
        kind: "security",
        summary: "Managed Lost Mode et Activation Lock s’appliquent aux appareils supervisés iPhone.",
      },
    ],
  },
  "apple-it-professional": {
    platforms: ["macOS", "iOS", "iPadOS"],
    primaryVersion: "26",
    minimumVersion: "15",
    supportedVersions: ["26", "18", "17", "15"],
    versionStatus: "current",
    lastVerifiedAt: PLATFORM_LAST_VERIFIED_AT,
    officialSources: [APPLE_PLATFORM_DEPLOYMENT, APPLE_SUPPORT_SECURITY],
    versionDifferences: [
      {
        platform: "macOS",
        kind: "mdm",
        summary: "Declarative Device Management complète progressivement les profils classiques.",
        detail: "Vérifier les déclarations supportées par le serveur MDM et la version OS.",
      },
      {
        platform: "iPadOS",
        kind: "mdm",
        summary: "Shared iPad reste une capacité iPadOS, absente d’iPhone.",
      },
    ],
  },
  "apple-enterprise-expert": {
    platforms: ["macOS", "iOS", "iPadOS"],
    primaryVersion: "26",
    minimumVersion: "15",
    supportedVersions: ["26", "18", "15"],
    versionStatus: "current",
    lastVerifiedAt: PLATFORM_LAST_VERIFIED_AT,
    officialSources: [APPLE_PLATFORM_SECURITY, APPLE_PLATFORM_DEPLOYMENT],
  },
  "apple-enterprise-architect": {
    platforms: ["macOS", "iOS", "iPadOS"],
    primaryVersion: "26",
    minimumVersion: "15",
    supportedVersions: ["26", "18", "15"],
    versionStatus: "compatible",
    lastVerifiedAt: PLATFORM_LAST_VERIFIED_AT,
    officialSources: [APPLE_PLATFORM_DEPLOYMENT],
  },
  "intune-mac": {
    platforms: ["macOS", "iOS", "iPadOS"],
    primaryVersion: "26",
    minimumVersion: "15",
    supportedVersions: ["26", "18", "15"],
    versionStatus: "needs-review",
    lastVerifiedAt: PLATFORM_LAST_VERIFIED_AT,
    officialSources: [
      {
        title: "Microsoft Intune — Apple device management",
        publisher: "Microsoft",
        url: "https://learn.microsoft.com/mem/intune/",
        checkedAt: PLATFORM_LAST_VERIFIED_AT,
      },
      APPLE_PLATFORM_DEPLOYMENT,
    ],
  },
  "jamf-100": {
    platforms: ["macOS", "iOS", "iPadOS"],
    primaryVersion: "26",
    minimumVersion: "14",
    supportedVersions: ["26", "15", "14"],
    versionStatus: "compatible",
    lastVerifiedAt: PLATFORM_LAST_VERIFIED_AT,
    officialSources: [
      {
        title: "Jamf Learning Hub",
        publisher: "Jamf",
        url: "https://learn.jamf.com/",
        checkedAt: PLATFORM_LAST_VERIFIED_AT,
      },
      APPLE_PLATFORM_DEPLOYMENT,
    ],
  },
  // Contenu : Computers + Mobile Devices, policies et profils multi-plateformes (courses.ts).
  "jamf-fundamentals": {
    platforms: ["macOS", "iOS", "iPadOS"],
    primaryVersion: "26",
    minimumVersion: "14",
    supportedVersions: ["26", "18", "17", "15", "14"],
    versionStatus: "needs-review",
    lastVerifiedAt: PLATFORM_LAST_VERIFIED_AT,
    officialSources: [
      {
        title: "Jamf Learning Hub",
        publisher: "Jamf",
        url: "https://learn.jamf.com/",
        checkedAt: PLATFORM_LAST_VERIFIED_AT,
      },
      APPLE_PLATFORM_DEPLOYMENT,
    ],
  },
  // Contenu : administration Jamf Pro (EA, scripts, Self Service, enrollment) — macOS et mobile (courses.ts).
  "jamf-170": {
    platforms: ["macOS", "iOS", "iPadOS"],
    primaryVersion: "26",
    minimumVersion: "14",
    supportedVersions: ["26", "18", "17", "15", "14"],
    versionStatus: "needs-review",
    lastVerifiedAt: PLATFORM_LAST_VERIFIED_AT,
    officialSources: [
      {
        title: "Jamf Learning Hub",
        publisher: "Jamf",
        url: "https://learn.jamf.com/",
        checkedAt: PLATFORM_LAST_VERIFIED_AT,
      },
      APPLE_PLATFORM_DEPLOYMENT,
    ],
  },
  // Contenu : API Jamf Pro, patch management et intégrations enterprise multi-plateformes (courses.ts).
  "jamf-200": {
    platforms: ["macOS", "iOS", "iPadOS"],
    primaryVersion: "26",
    minimumVersion: "14",
    supportedVersions: ["26", "18", "17", "15", "14"],
    versionStatus: "needs-review",
    lastVerifiedAt: PLATFORM_LAST_VERIFIED_AT,
    officialSources: [
      {
        title: "Jamf Learning Hub",
        publisher: "Jamf",
        url: "https://learn.jamf.com/",
        checkedAt: PLATFORM_LAST_VERIFIED_AT,
      },
      APPLE_PLATFORM_DEPLOYMENT,
    ],
  },
  // Contenu : architecture/API Jamf Pro ; modules scripting et packages surtout macOS (module-definitions.ts).
  "jamf-300": {
    platforms: ["macOS", "iOS", "iPadOS"],
    primaryVersion: "26",
    minimumVersion: "14",
    supportedVersions: ["26", "18", "17", "15", "14"],
    versionStatus: "needs-review",
    lastVerifiedAt: PLATFORM_LAST_VERIFIED_AT,
    officialSources: [
      {
        title: "Jamf Learning Hub",
        publisher: "Jamf",
        url: "https://learn.jamf.com/",
        checkedAt: PLATFORM_LAST_VERIFIED_AT,
      },
      APPLE_PLATFORM_DEPLOYMENT,
    ],
  },
  // Contenu : automatisation Jamf Pro ; modules sécurité/scripts Bash et zero-touch centrés macOS (module-definitions.ts).
  "jamf-400": {
    platforms: ["macOS", "iOS", "iPadOS"],
    primaryVersion: "26",
    minimumVersion: "14",
    supportedVersions: ["26", "18", "17", "15", "14"],
    versionStatus: "needs-review",
    lastVerifiedAt: PLATFORM_LAST_VERIFIED_AT,
    officialSources: [
      {
        title: "Jamf Learning Hub",
        publisher: "Jamf",
        url: "https://learn.jamf.com/",
        checkedAt: PLATFORM_LAST_VERIFIED_AT,
      },
      APPLE_PLATFORM_DEPLOYMENT,
    ],
  },
  // Contenu : Entra ID, ABM, Intune et Defender pour flottes Apple ; leçons macOS dominantes (courses.ts).
  "azure-for-apple-admins": {
    platforms: ["macOS", "iOS", "iPadOS"],
    primaryVersion: "26",
    minimumVersion: "14",
    supportedVersions: ["26", "18", "17", "15", "14"],
    versionStatus: "needs-review",
    lastVerifiedAt: PLATFORM_LAST_VERIFIED_AT,
    officialSources: [
      {
        title: "Microsoft Intune — Apple device management",
        publisher: "Microsoft",
        url: "https://learn.microsoft.com/mem/intune/",
        checkedAt: PLATFORM_LAST_VERIFIED_AT,
      },
      APPLE_PLATFORM_DEPLOYMENT,
    ],
  },
  // Parcours méta modules 11–18 : Intune Apple, Jamf Pro, Protect et sécurité Apple (pro-modules/index.ts).
  "parcours-professionnel": {
    platforms: ["macOS", "iOS", "iPadOS"],
    primaryVersion: "26",
    minimumVersion: "14",
    supportedVersions: ["26", "18", "17", "15", "14"],
    versionStatus: "needs-review",
    lastVerifiedAt: PLATFORM_LAST_VERIFIED_AT,
    officialSources: [
      {
        title: "Jamf Learning Hub",
        publisher: "Jamf",
        url: "https://learn.jamf.com/",
        checkedAt: PLATFORM_LAST_VERIFIED_AT,
      },
      {
        title: "Microsoft Intune — Apple device management",
        publisher: "Microsoft",
        url: "https://learn.microsoft.com/mem/intune/",
        checkedAt: PLATFORM_LAST_VERIFIED_AT,
      },
      APPLE_PLATFORM_DEPLOYMENT,
    ],
  },
  // Contenu : Intune macOS avancé, CA, Defender, SCEP/VPN ; banque d’examens couvre aussi iOS/iPadOS (module-definitions.ts).
  "intune-apple-advanced": {
    platforms: ["macOS", "iOS", "iPadOS"],
    primaryVersion: "26",
    minimumVersion: "14",
    supportedVersions: ["26", "18", "17", "15", "14"],
    versionStatus: "needs-review",
    lastVerifiedAt: PLATFORM_LAST_VERIFIED_AT,
    officialSources: [
      {
        title: "Microsoft Intune — Apple device management",
        publisher: "Microsoft",
        url: "https://learn.microsoft.com/mem/intune/",
        checkedAt: PLATFORM_LAST_VERIFIED_AT,
      },
      APPLE_PLATFORM_DEPLOYMENT,
    ],
  },
};

export function withCourseCompatibility(course: Course): Course {
  const extra = courseCompatibilityDefaults[course.slug];
  if (!extra) return course;
  return {
    ...course,
    platforms: course.platforms ?? extra.platforms,
    primaryVersion: course.primaryVersion ?? extra.primaryVersion,
    minimumVersion: course.minimumVersion ?? extra.minimumVersion,
    supportedVersions: course.supportedVersions ?? extra.supportedVersions,
    versionStatus: course.versionStatus ?? extra.versionStatus,
    lastVerifiedAt: course.lastVerifiedAt ?? extra.lastVerifiedAt,
    officialSources: course.officialSources ?? extra.officialSources,
    versionDifferences: course.versionDifferences ?? extra.versionDifferences,
  };
}
