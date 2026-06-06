import catalog from "@/data/video-screenshot-catalog.json";

export type ScreenshotCategoryId = "abm" | "intune" | "jamf" | "macos";

export type ScreenshotCatalogItem = {
  id: string;
  file: string;
  label: string;
};

export type ScreenshotCategory = {
  id: ScreenshotCategoryId;
  label: string;
  items: ScreenshotCatalogItem[];
};

export const SCREENSHOT_CATALOG = catalog as {
  screenshotsDir: string;
  expectedWidth: number;
  expectedHeight: number;
  maxSizeBytes: number;
  allowedExtensions: string[];
  categories: ScreenshotCategory[];
  videoScreenshotMap: Record<string, string[]>;
};

export const SCREENSHOTS_PUBLIC_DIR = "/video-assets/screenshots";

export function getAllScreenshotSpecs(): ScreenshotCatalogItem[] {
  return SCREENSHOT_CATALOG.categories.flatMap((c) => c.items);
}

export function getScreenshotPublicPath(file: string): string {
  return `${SCREENSHOTS_PUBLIC_DIR}/${file}`;
}

export function getScreenshotFilePath(file: string): string {
  return `${SCREENSHOT_CATALOG.screenshotsDir}/${file}`;
}

export function getScreenshotsForVideo(slug: string): ScreenshotCatalogItem[] {
  const ids = SCREENSHOT_CATALOG.videoScreenshotMap[slug] ?? [];
  const all = getAllScreenshotSpecs();
  return ids.map((id) => all.find((s) => s.id === id)).filter(Boolean) as ScreenshotCatalogItem[];
}

export function getScreenshotIdFromStoryboardLabel(label: string): string | undefined {
  const normalized = label.toLowerCase();
  const match = getAllScreenshotSpecs().find(
    (s) =>
      normalized.includes(s.label.toLowerCase()) ||
      normalized.includes(s.id.replace(/-/g, " "))
  );
  return match?.id;
}
