/**
 * Source de vérité centralisée — versions des plateformes Apple.
 * Dernière vérification : Apple Security Releases (support.apple.com/100100), 2026-07-17.
 * Version production courante : 26.5.2 (29 juin 2026). Les bêta (26.6 / 27) sont hors production.
 */

export type ApplePlatform = "macOS" | "iOS" | "iPadOS";

export type PlatformVersionInfo = {
  platform: ApplePlatform;
  /** Version majeure de production actuelle */
  current: string;
  /** Nom marketing si pertinent (ex. Tahoe) */
  currentName?: string;
  /** Patch / build de référence documenté lors de la vérification */
  currentRelease?: string;
  /** Versions majeures encore couvertes pédagogiquement */
  supportedPrevious: string[];
  lastVerifiedAt: string;
  /** Source officielle de vérification */
  sourceUrl: string;
  status: "supported" | "legacy" | "beta-only";
  notes?: string;
};

export const platformVersions: Record<ApplePlatform, PlatformVersionInfo> = {
  macOS: {
    platform: "macOS",
    current: "26",
    currentName: "Tahoe",
    currentRelease: "26.5.2",
    supportedPrevious: ["15", "14"],
    lastVerifiedAt: "2026-07-17",
    sourceUrl: "https://support.apple.com/100100",
    status: "supported",
    notes:
      "macOS Sequoia 15 et Sonoma 14 restent couverts pour les flottes enterprise en migration. Les versions bêta (26.6 / 27) ne sont pas la référence pédagogique de production.",
  },
  iOS: {
    platform: "iOS",
    current: "26",
    currentRelease: "26.5.2",
    supportedPrevious: ["18", "17"],
    lastVerifiedAt: "2026-07-17",
    sourceUrl: "https://support.apple.com/100100",
    status: "supported",
    notes: "iOS 18 et 17 restent documentés pour les appareils non éligibles à iOS 26.",
  },
  iPadOS: {
    platform: "iPadOS",
    current: "26",
    currentRelease: "26.5.2",
    supportedPrevious: ["18", "17"],
    lastVerifiedAt: "2026-07-17",
    sourceUrl: "https://support.apple.com/100100",
    status: "supported",
    notes:
      "iPadOS partage le numéro de version avec iOS mais expose des capacités distinctes (multitâche, Shared iPad, Apple Pencil).",
  },
};

export function getPlatformVersion(platform: ApplePlatform): PlatformVersionInfo {
  return platformVersions[platform];
}

export function getCurrentMajor(platform: ApplePlatform): string {
  return platformVersions[platform].current;
}

export function formatPlatformLabel(platform: ApplePlatform, major?: string): string {
  const info = platformVersions[platform];
  const version = major ?? info.current;
  if (platform === "macOS" && version === info.current && info.currentName) {
    return `macOS ${version} (${info.currentName})`;
  }
  return `${platform} ${version}`;
}

export const PLATFORM_LAST_VERIFIED_AT = "2026-07-17";
