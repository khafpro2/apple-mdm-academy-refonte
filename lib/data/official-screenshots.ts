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
  // —— Apple Business Manager (support.apple.com) ——
  "08": {
    id: "08",
    source: "apple",
    folder: "apple-originals",
    filename: "apple-business-devices-apps-books-official.png",
    sourceUrl: "https://support.apple.com/guide/apple-business-manager/",
  },
  "11": {
    id: "11",
    source: "apple",
    folder: "apple-originals",
    filename: "apple-business-federated-authentication-official.png",
    sourceUrl: "https://support.apple.com/guide/apple-business-manager/",
  },

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
  "32": {
    id: "32",
    source: "microsoft",
    folder: "intune-originals",
    filename: "32-devices-overview-intune-official.png",
    sourceUrl: "https://learn.microsoft.com/en-us/intune/intune-service/configuration/device-profile-create",
  },
  "34": {
    id: "34",
    source: "microsoft",
    folder: "intune-originals",
    filename: "37-macos-account-settings-intune-official.png",
    sourceUrl: "https://learn.microsoft.com/en-us/intune/intune-service/enrollment/device-enrollment-program-enroll-macos",
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
  "61": {
    id: "61",
    source: "microsoft",
    folder: "intune-originals",
    filename: "61-platform-sso-registration-required-official.png",
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
  "65": {
    id: "65",
    source: "jamf",
    folder: "jamf-originals",
    filename: "jamf-pro-screenshot-official.png",
    sourceUrl: "https://media.jamf.com/images/jamf-pro-screenshot_@2x.png",
  },
  "66": {
    id: "66",
    source: "jamf",
    folder: "jamf-originals",
    filename: "66-mobile-devices-official.webp",
    sourceUrl: "https://media.jamf.com/images/products/jamf-pro-secure-devices-2x.webp",
  },
  "67": {
    id: "67",
    source: "jamf",
    folder: "jamf-originals",
    filename: "jamf-pro-screenshot-official.png",
    sourceUrl: "https://media.jamf.com/images/jamf-pro-screenshot_@2x.png",
  },
  "68": {
    id: "68",
    source: "jamf",
    folder: "jamf-originals",
    filename: "jamf-pro-screenshot-official.png",
    sourceUrl: "https://media.jamf.com/images/jamf-pro-screenshot_@2x.png",
  },
  "69": {
    id: "69",
    source: "jamf",
    folder: "jamf-originals",
    filename: "69-policies-blueprints-official.webp",
    sourceUrl: "https://media.jamf.com/images/products/jamf-pro-everything-management-2x.webp",
  },
  "70": {
    id: "70",
    source: "jamf",
    folder: "jamf-originals",
    filename: "jamf-pro-screenshot-official.png",
    sourceUrl: "https://media.jamf.com/images/jamf-pro-screenshot_@2x.png",
  },
  "71": {
    id: "71",
    source: "jamf",
    folder: "jamf-originals",
    filename: "jamf-pro-screenshot-official.png",
    sourceUrl: "https://media.jamf.com/images/jamf-pro-screenshot_@2x.png",
  },
  "72": {
    id: "72",
    source: "jamf",
    folder: "jamf-originals",
    filename: "jamf-pro-ai-assistant-official.webp",
    sourceUrl: "https://media.jamf.com/images/products/jamf-pro-harness-the-power-of-ai_copy.webp",
  },
  "73": {
    id: "73",
    source: "jamf",
    folder: "jamf-originals",
    filename: "jamf-pro-screenshot-official.png",
    sourceUrl: "https://media.jamf.com/images/jamf-pro-screenshot_@2x.png",
  },
  "74": {
    id: "74",
    source: "jamf",
    folder: "jamf-originals",
    filename: "74-inventory-official.webp",
    sourceUrl: "https://media.jamf.com/images/products/jamf-pro-secure-devices-2x.webp",
  },
  "75": {
    id: "75",
    source: "jamf",
    folder: "jamf-originals",
    filename: "jamf-pro-screenshot-official.png",
    sourceUrl: "https://media.jamf.com/images/jamf-pro-screenshot_@2x.png",
  },
  "76": {
    id: "76",
    source: "jamf",
    folder: "jamf-originals",
    filename: "jamf-pro-screenshot-official.png",
    sourceUrl: "https://media.jamf.com/images/jamf-pro-screenshot_@2x.png",
  },
  "77": {
    id: "77",
    source: "jamf",
    folder: "jamf-originals",
    filename: "jamf-pro-screenshot-official.png",
    sourceUrl: "https://media.jamf.com/images/jamf-pro-screenshot_@2x.png",
  },
  "78": {
    id: "78",
    source: "jamf",
    folder: "jamf-originals",
    filename: "jamf-pro-ai-assistant-official.webp",
    sourceUrl: "https://media.jamf.com/images/products/jamf-pro-harness-the-power-of-ai_copy.webp",
  },
  "89": {
    id: "89",
    source: "jamf",
    folder: "jamf-originals",
    filename: "jamf-pro-screenshot-official.png",
    sourceUrl: "https://media.jamf.com/images/jamf-pro-screenshot_@2x.png",
  },
  "90": {
    id: "90",
    source: "jamf",
    folder: "jamf-originals",
    filename: "jamf-pro-screenshot-official.png",
    sourceUrl: "https://media.jamf.com/images/jamf-pro-screenshot_@2x.png",
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
