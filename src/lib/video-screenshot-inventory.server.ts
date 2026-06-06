import { existsSync, statSync } from "fs";
import { join } from "path";
import sharp from "sharp";
import {
  getAllScreenshotSpecs,
  getScreenshotFilePath,
  getScreenshotsForVideo,
  SCREENSHOT_CATALOG,
  type ScreenshotCatalogItem,
} from "@/src/lib/video-screenshots";

export type ScreenshotFileStatus = "present" | "missing" | "invalid-format" | "invalid-size" | "invalid-dimensions";

export type ScreenshotInventoryItem = ScreenshotCatalogItem & {
  status: ScreenshotFileStatus;
  publicPath: string;
  sizeKb?: number;
  issues: string[];
};

const ROOT = process.cwd();
const MIN_BYTES = 500;

function classifyStatus(issues: string[]): ScreenshotFileStatus {
  if (issues.some((i) => i.includes("Extension") || i.includes("vide") || i.includes("illisible"))) {
    return "invalid-format";
  }
  if (issues.some((i) => i.includes("Dimensions") || i.includes("métadonnées"))) {
    return "invalid-dimensions";
  }
  if (issues.some((i) => i.includes("lourd"))) {
    return "invalid-size";
  }
  return "present";
}

export async function checkScreenshotFileAsync(file: string): Promise<ScreenshotInventoryItem> {
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
  if (stat.size < MIN_BYTES) {
    issues.push("Image vide ou corrompue");
  }
  if (stat.size > SCREENSHOT_CATALOG.maxSizeBytes) {
    issues.push(`Fichier trop lourd (${sizeKb} KB)`);
  }

  try {
    const meta = await sharp(abs).metadata();
    if (!meta.width || !meta.height) {
      issues.push("Métadonnées invalides");
    } else if (
      meta.width !== SCREENSHOT_CATALOG.expectedWidth ||
      meta.height !== SCREENSHOT_CATALOG.expectedHeight
    ) {
      issues.push(`Dimensions ${meta.width}×${meta.height}`);
    }
  } catch {
    issues.push("Fichier illisible");
  }

  const status = issues.length === 0 ? "present" : classifyStatus(issues);
  return { ...spec, status, publicPath, sizeKb, issues };
}

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
  if (stat.size < MIN_BYTES) {
    issues.push("Image vide ou corrompue");
  }
  if (stat.size > SCREENSHOT_CATALOG.maxSizeBytes) {
    issues.push(`Fichier trop lourd (${sizeKb} KB)`);
  }

  const status: ScreenshotFileStatus = issues.length === 0 ? "present" : classifyStatus(issues);
  return { ...spec, status, publicPath, sizeKb, issues };
}

export async function getScreenshotInventoryAsync(): Promise<ScreenshotInventoryItem[]> {
  return Promise.all(getAllScreenshotSpecs().map((s) => checkScreenshotFileAsync(s.file)));
}

export function getScreenshotInventory(): ScreenshotInventoryItem[] {
  return getAllScreenshotSpecs().map((s) => checkScreenshotFile(s.file));
}

export function getValidScreenshotFiles(inventory: ScreenshotInventoryItem[]): Set<string> {
  return new Set(inventory.filter((i) => i.status === "present").map((i) => i.file));
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

export function getScreenshotCompletionPercent(inventory?: ScreenshotInventoryItem[]): number {
  const items = inventory ?? getScreenshotInventory();
  const present = items.filter((i) => i.status === "present").length;
  return Math.round((present / items.length) * 100);
}
