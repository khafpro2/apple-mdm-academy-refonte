/** Style global appliqué à toutes les captures pédagogiques (1920×1080 · 16:9) */
export const GLOBAL_SCREENSHOT_STYLE =
  "Apple Training official, Apple Business Manager real interface, Microsoft Intune real interface, Jamf Pro real interface, modern 2026 UI, professional screenshot, ultra realistic, Apple Enterprise documentation, clean Apple design, SF Pro typography, Microsoft Learn style, Jamf Training Catalog style, high resolution 1920x1080, 16:9 aspect ratio, neutral lighting, professional dashboard, no watermark, no stray text, no invented logos, credible modern interface";

export const SCREENSHOT_SPECS = {
  width: 1920,
  height: 1080,
  aspectRatio: "16:9" as const,
  format: "webp" as const,
};

/** Construit le prompt complet pour génération d'image (style global + scène) */
export function buildScreenshotPrompt(scenePrompt: string): string {
  return `${GLOBAL_SCREENSHOT_STYLE}. ${scenePrompt}`;
}
