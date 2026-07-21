import { existsSync } from "node:fs";
import path from "node:path";
import type { AssetFormat } from "@/lib/motion/asset-types";

/** Public URL subfolders under `/motion/` (files live in `public/motion/...`). */
export const MOTION_PUBLIC_SUBDIRS = [
  "svg",
  "posters",
  "backgrounds",
  "icons",
  "thumbnails",
  "illustrations",
] as const;

export type MotionPublicSubdir = (typeof MOTION_PUBLIC_SUBDIRS)[number];

/** Preferred public subdir per raster/vector format (Lottie stays registry-only until wired). */
export const FORMAT_PREFERRED_SUBDIR: Partial<Record<AssetFormat, MotionPublicSubdir>> = {
  svg: "svg",
  png: "icons",
  webp: "illustrations",
  jpg: "illustrations",
};

/** Legacy V1 prefix kept for compatibility; new assets use `/motion/<subdir>/`. */
export const LEGACY_MOTION_ASSETS_PREFIX = "/media/motion/assets/";

const PUBLIC_MOTION_PATH_RE = new RegExp(
  `^/motion/(${MOTION_PUBLIC_SUBDIRS.join("|")})/[^/]+$`
);

export function isLegacyMotionAssetPath(assetPath: string): boolean {
  return assetPath.startsWith(LEGACY_MOTION_ASSETS_PREFIX);
}

export function isPublicMotionAssetPath(assetPath: string): boolean {
  return PUBLIC_MOTION_PATH_RE.test(assetPath);
}

export function isAllowedMotionAssetUrlPath(assetPath: string): boolean {
  return isPublicMotionAssetPath(assetPath) || isLegacyMotionAssetPath(assetPath);
}

/**
 * Map a registry URL path to an absolute disk path.
 * - `/motion/svg/foo.svg` → `<repo>/public/motion/svg/foo.svg`
 * - `/media/motion/assets/foo.svg` → `<repo>/media/motion/assets/foo.svg` (legacy)
 */
export function resolveMotionAssetDiskPath(repoRoot: string, assetPath: string): string {
  const relative = assetPath.replace(/^\//, "");
  if (isPublicMotionAssetPath(assetPath)) {
    return path.join(repoRoot, "public", relative);
  }
  return path.join(repoRoot, relative);
}

export function motionAssetFileExists(repoRoot: string, assetPath: string | undefined): boolean {
  if (!assetPath) return false;
  return existsSync(resolveMotionAssetDiskPath(repoRoot, assetPath));
}

/** Formats the admin gallery / `<img>` can preview today. */
export const PREVIEWABLE_MOTION_FORMATS: ReadonlySet<AssetFormat> = new Set([
  "svg",
  "png",
  "webp",
  "jpg",
]);

export function isPreviewableMotionFormat(format: AssetFormat): boolean {
  return PREVIEWABLE_MOTION_FORMATS.has(format);
}
