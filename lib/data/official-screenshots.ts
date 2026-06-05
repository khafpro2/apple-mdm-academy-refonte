/** Visuels officiels (Jamf, Apple, Microsoft) — voir public/images/courses/*-originals/SOURCES.md */

export type OfficialAssetSource = "jamf" | "apple" | "microsoft";

export type OfficialOriginalsFolder = "jamf-originals" | "apple-originals" | "intune-originals";

export type OfficialScreenshotAsset = {
  id: string;
  source: OfficialAssetSource;
  folder: OfficialOriginalsFolder;
  filename: string;
  sourceUrl: string;
};

export const OFFICIAL_SCREENSHOT_ASSETS: Record<string, OfficialScreenshotAsset> = {
  // —— Microsoft Intune (learn.microsoft.com) ——
  "29": {
    id: "29",
    source: "microsoft",
    folder: "intune-originals",
    filename: "29-apns-certificate-intune-official.png",
    sourceUrl: "https://learn.microsoft.com/en-us/mem/intune-service/enrollment/apple-mdm-push-certificate-get",
  },
  "30": {
    id: "30",
    source: "microsoft",
    folder: "intune-originals",
    filename: "30-ios-ade-token-intune-official.png",
    sourceUrl: "https://learn.microsoft.com/en-us/intune/device-enrollment/apple/setup-apple-token",
  },
  "37": {
    id: "37",
    source: "microsoft",
    folder: "intune-originals",
    filename: "37-platform-sso-device-profile-intune-official.png",
    sourceUrl: "https://learn.microsoft.com/en-us/intune/intune-service/configuration/platform-sso-macos",
  },
  "39": {
    id: "39",
    source: "microsoft",
    folder: "intune-originals",
    filename: "39-applicability-rules-intune-official.png",
    sourceUrl: "https://learn.microsoft.com/en-us/intune/intune-service/configuration/device-profile-create",
  },
  "60": {
    id: "60",
    source: "microsoft",
    folder: "intune-originals",
    filename: "60-platform-sso-settings-picker-intune-official.png",
    sourceUrl: "https://learn.microsoft.com/en-us/intune/intune-service/configuration/platform-sso-macos",
  },

  // —— Jamf Pro (jamf.com) ——
  "64": {
    id: "64",
    source: "jamf",
    folder: "jamf-originals",
    filename: "64-dashboard-jamf-official.webp",
    sourceUrl: "https://media.jamf.com/images/products/jamf-for-mac-dashboard-block-level.webp",
  },
  "66": {
    id: "66",
    source: "jamf",
    folder: "jamf-originals",
    filename: "66-mobile-devices-official.webp",
    sourceUrl: "https://media.jamf.com/images/products/jamf-pro-secure-devices-2x.webp",
  },
  "74": {
    id: "74",
    source: "jamf",
    folder: "jamf-originals",
    filename: "74-inventory-official.webp",
    sourceUrl: "https://media.jamf.com/images/products/jamf-pro-secure-devices-2x.webp",
  },
};

const SOURCE_LABELS: Record<OfficialAssetSource, string> = {
  jamf: "Jamf",
  apple: "Apple",
  microsoft: "Microsoft",
};

export function getOfficialAssetPath(id: string): string | undefined {
  const asset = OFFICIAL_SCREENSHOT_ASSETS[id];
  if (!asset) return undefined;
  return `/images/courses/${asset.folder}/${asset.filename}`;
}

export function getOfficialSourceLabel(source: OfficialAssetSource): string {
  return SOURCE_LABELS[source];
}

export function isOfficialScreenshot(id: string): boolean {
  return id in OFFICIAL_SCREENSHOT_ASSETS;
}

export function getOfficialAsset(id: string): OfficialScreenshotAsset | undefined {
  return OFFICIAL_SCREENSHOT_ASSETS[id];
}
