import { existsSync, statSync } from "fs";
import { join } from "path";
import {
  getAllScreenshotSpecs,
  getScreenshotFilePath,
  getScreenshotsForVideo,
  SCREENSHOT_CATALOG,
  type ScreenshotCatalogItem,
} from "@/src/lib/video-screenshots";

export type ScreenshotFileStatus = "present" | "missing" | "invalid-format" | "invalid-size";

export type ScreenshotInventoryItem = ScreenshotCatalogItem & {
  status: ScreenshotFileStatus;
  publicPath: string;
  sizeKb?: number;
  issues: string[];
};

const ROOT = process.cwd();

export function checkScreenshotFile(file: string): ScreenshotInventoryItem {
  const spec = getAllScreenshotSpecs().find((s) => s.file === file)!;
  const abs = join(ROOT, getScreenshotFilePath(file));
  const publicPath = `/video-assets/screenshots/${file}`;
  const issues: string[] = [];

  if (!existsSync(abs)) {
    return { ...spec, status: "missing", publicPath, issues: ["Fichier absent"] };
  }

  const stat = statSync(abs);
  const sizeKb = Math.round(stat.size / 1024);
  const ext = file.slice(file.lastIndexOf(".")).toLowerCase();

  if (!SCREENSHOT_CATALOG.allowedExtensions.includes(ext)) {
    issues.push("Extension non autorisée");
  }
  if (stat.size > SCREENSHOT_CATALOG.maxSizeBytes) {
    issues.push(`Fichier trop lourd (${sizeKb} KB)`);
  }

  const status: ScreenshotFileStatus =
    issues.length === 0 ? "present" : issues.some((i) => i.includes("Extension")) ? "invalid-format" : "invalid-size";

  return { ...spec, status, publicPath, sizeKb, issues };
}

export function getScreenshotInventory(): ScreenshotInventoryItem[] {
  return getAllScreenshotSpecs().map((s) => checkScreenshotFile(s.file));
}

export function getVideoScreenshotStatus(slug: string): {
  required: ScreenshotCatalogItem[];
  present: ScreenshotCatalogItem[];
  missing: ScreenshotCatalogItem[];
} {
  const required = getScreenshotsForVideo(slug);
  const present: ScreenshotCatalogItem[] = [];
  const missing: ScreenshotCatalogItem[] = [];

  for (const spec of required) {
    const check = checkScreenshotFile(spec.file);
    if (check.status === "present") present.push(spec);
    else missing.push(spec);
  }

  return { required, present, missing };
}

export function getScreenshotCompletionPercent(): number {
  const inventory = getScreenshotInventory();
  const present = inventory.filter((i) => i.status === "present").length;
  return Math.round((present / inventory.length) * 100);
}
