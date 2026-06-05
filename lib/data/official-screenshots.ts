/** Visuels officiels Jamf Pro (sources publiques jamf.com) — voir public/images/courses/jamf-originals/SOURCES.md */

export type OfficialAssetSource = "jamf";

export type OfficialScreenshotAsset = {
  id: string;
  source: OfficialAssetSource;
  /** Fichier dans public/images/courses/jamf-originals/ */
  filename: string;
  /** URL source publique Jamf */
  sourceUrl: string;
};

/** IDs bibliothèque → asset officiel Jamf */
export const OFFICIAL_SCREENSHOT_ASSETS: Record<string, OfficialScreenshotAsset> = {
  "64": {
    id: "64",
    source: "jamf",
    filename: "64-dashboard-jamf-official.webp",
    sourceUrl: "https://media.jamf.com/images/products/jamf-for-mac-dashboard-block-level.webp",
  },
  "65": {
    id: "65",
    source: "jamf",
    filename: "jamf-pro-screenshot-official.png",
    sourceUrl: "https://media.jamf.com/images/jamf-pro-screenshot_@2x.png",
  },
  "66": {
    id: "66",
    source: "jamf",
    filename: "66-mobile-devices-official.webp",
    sourceUrl: "https://media.jamf.com/images/products/jamf-pro-secure-devices-2x.webp",
  },
  "67": {
    id: "67",
    source: "jamf",
    filename: "jamf-pro-screenshot-official.png",
    sourceUrl: "https://media.jamf.com/images/jamf-pro-screenshot_@2x.png",
  },
  "68": {
    id: "68",
    source: "jamf",
    filename: "jamf-pro-screenshot-official.png",
    sourceUrl: "https://media.jamf.com/images/jamf-pro-screenshot_@2x.png",
  },
  "69": {
    id: "69",
    source: "jamf",
    filename: "69-policies-blueprints-official.webp",
    sourceUrl: "https://media.jamf.com/images/products/jamf-pro-everything-management-2x.webp",
  },
  "70": {
    id: "70",
    source: "jamf",
    filename: "jamf-pro-screenshot-official.png",
    sourceUrl: "https://media.jamf.com/images/jamf-pro-screenshot_@2x.png",
  },
  "71": {
    id: "71",
    source: "jamf",
    filename: "jamf-pro-screenshot-official.png",
    sourceUrl: "https://media.jamf.com/images/jamf-pro-screenshot_@2x.png",
  },
  "72": {
    id: "72",
    source: "jamf",
    filename: "jamf-pro-ai-assistant-official.webp",
    sourceUrl: "https://media.jamf.com/images/products/jamf-pro-harness-the-power-of-ai_copy.webp",
  },
  "73": {
    id: "73",
    source: "jamf",
    filename: "jamf-pro-screenshot-official.png",
    sourceUrl: "https://media.jamf.com/images/jamf-pro-screenshot_@2x.png",
  },
  "74": {
    id: "74",
    source: "jamf",
    filename: "74-inventory-official.webp",
    sourceUrl: "https://media.jamf.com/images/products/jamf-pro-secure-devices-2x.webp",
  },
  "75": {
    id: "75",
    source: "jamf",
    filename: "jamf-pro-screenshot-official.png",
    sourceUrl: "https://media.jamf.com/images/jamf-pro-screenshot_@2x.png",
  },
  "76": {
    id: "76",
    source: "jamf",
    filename: "jamf-pro-screenshot-official.png",
    sourceUrl: "https://media.jamf.com/images/jamf-pro-screenshot_@2x.png",
  },
  "77": {
    id: "77",
    source: "jamf",
    filename: "jamf-pro-screenshot-official.png",
    sourceUrl: "https://media.jamf.com/images/jamf-pro-screenshot_@2x.png",
  },
  "78": {
    id: "78",
    source: "jamf",
    filename: "jamf-pro-ai-assistant-official.webp",
    sourceUrl: "https://media.jamf.com/images/products/jamf-pro-harness-the-power-of-ai_copy.webp",
  },
  "89": {
    id: "89",
    source: "jamf",
    filename: "jamf-pro-screenshot-official.png",
    sourceUrl: "https://media.jamf.com/images/jamf-pro-screenshot_@2x.png",
  },
  "90": {
    id: "90",
    source: "jamf",
    filename: "jamf-pro-screenshot-official.png",
    sourceUrl: "https://media.jamf.com/images/jamf-pro-screenshot_@2x.png",
  },
};

export function getOfficialAssetPath(id: string): string | undefined {
  const asset = OFFICIAL_SCREENSHOT_ASSETS[id];
  if (!asset) return undefined;
  return `/images/courses/jamf-originals/${asset.filename}`;
}

export function isOfficialScreenshot(id: string): boolean {
  return id in OFFICIAL_SCREENSHOT_ASSETS;
}

export function getOfficialAsset(id: string): OfficialScreenshotAsset | undefined {
  return OFFICIAL_SCREENSHOT_ASSETS[id];
}
