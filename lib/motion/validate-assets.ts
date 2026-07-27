import { existsSync } from "node:fs";
import path from "node:path";
import {
  containsForbiddenBrand,
  parseAssetVersion,
  validateAssetId,
} from "@/lib/motion/asset-id";
import {
  ASSET_ASPECT_RATIOS,
  ASSET_CATEGORIES,
  ASSET_FORMATS,
  ASSET_SOURCES,
  ASSET_STATUSES,
  MOTION_REVIEW_STATUSES,
  MOTION_SCENE_STATUSES,
  STATUSES_MAY_HAVE_PATH,
  type AssetFormat,
  type AssetMetadata,
  type MotionScene,
  type ValidationIssue,
} from "@/lib/motion/asset-types";
import {
  FORMAT_PREFERRED_SUBDIR,
  isAllowedMotionAssetUrlPath,
  isPublicMotionAssetPath,
  MOTION_PUBLIC_SUBDIRS,
  resolveMotionAssetDiskPath,
} from "@/lib/motion/media-path";

const REQUIRED_FIELDS = [
  "id",
  "category",
  "name",
  "description",
  "status",
  "format",
  "dimensions",
  "aspectRatio",
  "transparentBackground",
  "decorative",
  "source",
  "version",
  "sceneIds",
] as const;

const DIMENSIONS_RE = /^[1-9]\d*x[1-9]\d*$/;
const VERSION_RE = /^v[1-9]\d*$/;
const SCENE_ID_RE = /^scene-\d{3}-[a-z0-9-]+$/;
const SCENE_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ALLOWED_PATH_HINT = `/motion/{${MOTION_PUBLIC_SUBDIRS.join("|")}}/… (or legacy /media/motion/assets/)`;

const FORMAT_EXTENSION: Record<AssetFormat, string> = {
  svg: ".svg",
  png: ".png",
  webp: ".webp",
  jpg: ".jpg",
  lottie: ".json",
};

function issue(
  code: string,
  message: string,
  extra: Partial<ValidationIssue> = {}
): ValidationIssue {
  return { code, severity: "error", message, ...extra };
}

function warn(
  code: string,
  message: string,
  extra: Partial<ValidationIssue> = {}
): ValidationIssue {
  return { code, severity: "warning", message, ...extra };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export type ValidateAssetsOptions = {
  /** Absolute path to repository root (for physical file checks). */
  repoRoot: string;
  scenes: MotionScene[];
};

const SCENE_REQUIRED_FIELDS = [
  "id",
  "slug",
  "title",
  "status",
  "durationSeconds",
  "objective",
  "mainMessage",
  "courseIds",
  "assetIds",
  "accessibilityStatus",
  "technicalReviewStatus",
  "mediaStatus",
  "version",
] as const;

/**
 * Pure validation of the Motion Design asset registry (20 control groups).
 */
export function validateMotionAssets(
  rawAssets: unknown[],
  options: ValidateAssetsOptions
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const sceneById = new Map(options.scenes.map((s) => [s.id, s]));
  const seenIds = new Set<string>();
  const seenPaths = new Map<string, string>();

  if (!Array.isArray(rawAssets)) {
    return [issue("registry-shape", "assets registry must be an array")];
  }

  for (const [index, raw] of rawAssets.entries()) {
    const prefix = `assets[${index}]`;
    if (!isPlainObject(raw)) {
      issues.push(issue("asset-shape", `${prefix} must be an object`));
      continue;
    }

    for (const field of REQUIRED_FIELDS) {
      if (!(field in raw) || raw[field] === undefined || raw[field] === null) {
        issues.push(
          issue("required-field", `${prefix}: missing required field "${field}"`, {
            assetId: typeof raw.id === "string" ? raw.id : undefined,
          })
        );
      }
    }

    const assetId = typeof raw.id === "string" ? raw.id : undefined;

    // Enums
    if (typeof raw.category === "string" && !ASSET_CATEGORIES.includes(raw.category as never)) {
      issues.push(issue("enum-category", `${prefix}: invalid category "${raw.category}"`, { assetId }));
    }
    if (typeof raw.status === "string" && !ASSET_STATUSES.includes(raw.status as never)) {
      issues.push(issue("enum-status", `${prefix}: invalid status "${raw.status}"`, { assetId }));
    }
    if (typeof raw.format === "string" && !ASSET_FORMATS.includes(raw.format as never)) {
      issues.push(issue("enum-format", `${prefix}: invalid format "${raw.format}"`, { assetId }));
    }
    if (
      typeof raw.aspectRatio === "string" &&
      !ASSET_ASPECT_RATIOS.includes(raw.aspectRatio as never)
    ) {
      issues.push(
        issue("enum-aspect", `${prefix}: invalid aspectRatio "${raw.aspectRatio}"`, { assetId })
      );
    }
    if (typeof raw.source === "string" && !ASSET_SOURCES.includes(raw.source as never)) {
      issues.push(issue("enum-source", `${prefix}: invalid source "${raw.source}"`, { assetId }));
    }

    // Booleans
    if ("transparentBackground" in raw && typeof raw.transparentBackground !== "boolean") {
      issues.push(
        issue("type-boolean", `${prefix}: transparentBackground must be boolean`, { assetId })
      );
    }
    if ("decorative" in raw && typeof raw.decorative !== "boolean") {
      issues.push(issue("type-boolean", `${prefix}: decorative must be boolean`, { assetId }));
    }

    // Strings non-empty where required
    if (typeof raw.name === "string" && raw.name.trim() === "") {
      issues.push(issue("empty-name", `${prefix}: name must be non-empty`, { assetId }));
    }
    if (typeof raw.description === "string" && raw.description.trim() === "") {
      issues.push(
        issue("empty-description", `${prefix}: description must be non-empty`, { assetId })
      );
    }

    // Version field
    if (typeof raw.version === "string") {
      if (!VERSION_RE.test(raw.version)) {
        issues.push(
          issue("version-format", `${prefix}: version must match vN (got "${raw.version}")`, {
            assetId,
          })
        );
      }
      const idVersion = typeof raw.id === "string" ? parseAssetVersion(raw.id) : null;
      if (idVersion && raw.version !== idVersion) {
        issues.push(
          issue(
            "version-mismatch",
            `${prefix}: version "${raw.version}" must match id suffix "${idVersion}"`,
            { assetId }
          )
        );
      }
    }

    // Dimensions
    if (typeof raw.dimensions === "string" && !DIMENSIONS_RE.test(raw.dimensions)) {
      issues.push(
        issue(
          "dimensions-format",
          `${prefix}: dimensions must be WxH pixels (got "${raw.dimensions}")`,
          { assetId }
        )
      );
    }

    // Id convention + uniqueness
    if (typeof raw.id === "string") {
      for (const msg of validateAssetId(raw.id)) {
        issues.push(issue("id-convention", `${prefix}: ${msg}`, { assetId: raw.id }));
      }
      if (seenIds.has(raw.id)) {
        issues.push(issue("id-duplicate", `${prefix}: duplicate id "${raw.id}"`, { assetId: raw.id }));
      }
      seenIds.add(raw.id);

      // category field must match id prefix
      if (typeof raw.category === "string" && !raw.id.startsWith(`${raw.category}-`)) {
        issues.push(
          issue(
            "id-category-mismatch",
            `${prefix}: id must start with category "${raw.category}-"`,
            { assetId: raw.id }
          )
        );
      }
    }

    // Accessibility
    if (raw.decorative === false) {
      if (typeof raw.altText !== "string" || raw.altText.trim() === "") {
        issues.push(
          issue(
            "alttext-required",
            `${prefix}: altText is required and non-empty when decorative is false`,
            { assetId }
          )
        );
      }
    }
    if (raw.decorative === true) {
      if (raw.altText !== "") {
        issues.push(
          issue(
            "alttext-decorative",
            `${prefix}: altText must be "" when decorative is true`,
            { assetId }
          )
        );
      }
    }

    // sceneIds
    if ("sceneIds" in raw) {
      if (!Array.isArray(raw.sceneIds)) {
        issues.push(
          issue("sceneids-type", `${prefix}: sceneIds must be an array of strings`, { assetId })
        );
      } else {
        for (const sceneId of raw.sceneIds) {
          if (typeof sceneId !== "string" || !SCENE_ID_RE.test(sceneId)) {
            issues.push(
              issue(
                "sceneid-format",
                `${prefix}: invalid scene id "${String(sceneId)}" (expect scene-NNN-slug)`,
                { assetId, sceneId: typeof sceneId === "string" ? sceneId : undefined }
              )
            );
            continue;
          }
          if (!sceneById.has(sceneId)) {
            issues.push(
              issue(
                "sceneid-missing",
                `${prefix}: scene "${sceneId}" is not in the scenes registry`,
                { assetId, sceneId }
              )
            );
          }
        }
      }
    }

    // path rules
    if ("path" in raw && raw.path !== undefined && raw.path !== null) {
        if (typeof raw.path !== "string") {
        issues.push(issue("path-type", `${prefix}: path must be a string`, { assetId }));
      } else {
        const assetPath = raw.path;
        if (
          typeof raw.status === "string" &&
          ASSET_STATUSES.includes(raw.status as never) &&
          !STATUSES_MAY_HAVE_PATH.has(raw.status as never)
        ) {
          issues.push(
            issue(
              "path-status-mismatch",
              `${prefix}: status "${raw.status}" cannot declare a path`,
              { assetId }
            )
          );
        }

        if (/^https?:\/\//i.test(assetPath) || assetPath.includes("://")) {
          issues.push(
            issue("path-external", `${prefix}: external paths are forbidden`, { assetId })
          );
        }

        if (!isAllowedMotionAssetUrlPath(assetPath)) {
          issues.push(
            issue(
              "path-prefix",
              `${prefix}: path must be ${ALLOWED_PATH_HINT}`,
              { assetId }
            )
          );
        }

        if (
          isPublicMotionAssetPath(assetPath) &&
          typeof raw.format === "string" &&
          ASSET_FORMATS.includes(raw.format as AssetFormat)
        ) {
          const preferred = FORMAT_PREFERRED_SUBDIR[raw.format as AssetFormat];
          const subdir = assetPath.split("/")[2];
          if (preferred && subdir && preferred !== subdir && raw.format === "svg" && subdir !== "svg") {
            issues.push(
              warn(
                "path-subdir-format",
                `${prefix}: format svg usually lives under /motion/svg/ (got /motion/${subdir}/)`,
                { assetId }
              )
            );
          }
        }

        const basename = path.posix.basename(assetPath);
        for (const word of ["final", "latest", "new", "test", "temp", "asset1", "image1", "final-v2"]) {
          if (basename.includes(word)) {
            issues.push(
              issue(
                "path-forbidden-name",
                `${prefix}: filename contains forbidden token "${word}"`,
                { assetId }
              )
            );
          }
        }

        if (typeof raw.format === "string" && ASSET_FORMATS.includes(raw.format as AssetFormat)) {
          const expectedExt = FORMAT_EXTENSION[raw.format as AssetFormat];
          if (!assetPath.toLowerCase().endsWith(expectedExt)) {
            issues.push(
              issue(
                "path-format-mismatch",
                `${prefix}: path extension must be ${expectedExt} for format ${raw.format}`,
                { assetId }
              )
            );
          }
        }

        if (typeof raw.id === "string") {
          const expectedBase = `${raw.id}${typeof raw.format === "string" && ASSET_FORMATS.includes(raw.format as AssetFormat) ? FORMAT_EXTENSION[raw.format as AssetFormat] : ""}`;
          if (
            typeof raw.format === "string" &&
            ASSET_FORMATS.includes(raw.format as AssetFormat) &&
            basename !== expectedBase
          ) {
            issues.push(
              issue(
                "path-id-mismatch",
                `${prefix}: path basename must be "${expectedBase}"`,
                { assetId }
              )
            );
          }
        }

        // Physical existence (public URLs resolve under public/)
        const absolute = resolveMotionAssetDiskPath(options.repoRoot, assetPath);
        if (!existsSync(absolute)) {
          issues.push(
            issue(
              "path-missing-file",
              `${prefix}: path "${assetPath}" does not exist on disk`,
              { assetId }
            )
          );
        }

        if (seenPaths.has(assetPath)) {
          issues.push(
            issue(
              "path-duplicate",
              `${prefix}: duplicate path "${assetPath}" (also used by ${seenPaths.get(assetPath)})`,
              { assetId }
            )
          );
        } else {
          seenPaths.set(assetPath, assetId ?? prefix);
        }
      }
    } else if (raw.status === "approved") {
      issues.push(
        issue("approved-path-required", `${prefix}: approved assets must declare an existing path`, {
          assetId,
        })
      );
    }

    // Brand denylist on text fields
    for (const field of ["id", "name", "description", "altText"] as const) {
      const value = raw[field];
      if (typeof value === "string") {
        const token = containsForbiddenBrand(value);
        if (token) {
          issues.push(
            issue(
              "forbidden-brand",
              `${prefix}: field "${field}" contains out-of-scope brand token "${token}"`,
              { assetId }
            )
          );
        }
      }
    }

    // Deprecated referenced by active scenes
    if (raw.status === "deprecated" && Array.isArray(raw.sceneIds)) {
      for (const sceneId of raw.sceneIds) {
        if (typeof sceneId !== "string") continue;
        const scene = sceneById.get(sceneId);
        if (scene && scene.active !== false) {
          issues.push(
            warn(
              "deprecated-active-scene",
              `${prefix}: deprecated asset is still linked to active scene "${sceneId}"`,
              { assetId, sceneId }
            )
          );
        }
      }
    }
  }

  return issues;
}

export type ValidateScenesOptions = {
  assets: AssetMetadata[];
};

export function validateMotionScenes(
  rawScenes: unknown[],
  options: ValidateScenesOptions
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seenIds = new Set<string>();
  const assetById = new Map(options.assets.map((asset) => [asset.id, asset]));

  if (!Array.isArray(rawScenes)) {
    return [issue("scene-registry-shape", "scenes registry must be an array")];
  }

  for (const [index, raw] of rawScenes.entries()) {
    const prefix = `scenes[${index}]`;
    if (!isPlainObject(raw)) {
      issues.push(issue("scene-shape", `${prefix} must be an object`));
      continue;
    }

    const sceneId = typeof raw.id === "string" ? raw.id : undefined;

    for (const field of SCENE_REQUIRED_FIELDS) {
      if (!(field in raw) || raw[field] === undefined || raw[field] === null) {
        issues.push(issue("scene-required-field", `${prefix}: missing required field "${field}"`, { sceneId }));
      }
    }

    if (typeof raw.id === "string") {
      if (!SCENE_ID_RE.test(raw.id)) {
        issues.push(issue("scene-id-format", `${prefix}: id must match scene-NNN-slug`, { sceneId: raw.id }));
      }
      if (seenIds.has(raw.id)) {
        issues.push(issue("scene-id-duplicate", `${prefix}: duplicate scene id "${raw.id}"`, { sceneId: raw.id }));
      }
      seenIds.add(raw.id);
    }

    if (typeof raw.slug === "string") {
      if (!SCENE_SLUG_RE.test(raw.slug)) {
        issues.push(issue("scene-slug-format", `${prefix}: slug must use lowercase kebab-case`, { sceneId }));
      }
      if (typeof raw.id === "string" && !raw.id.endsWith(raw.slug)) {
        issues.push(issue("scene-slug-mismatch", `${prefix}: id suffix must match slug "${raw.slug}"`, { sceneId }));
      }
    }

    if (typeof raw.status === "string" && !MOTION_SCENE_STATUSES.includes(raw.status as never)) {
      issues.push(issue("scene-status", `${prefix}: invalid status "${raw.status}"`, { sceneId }));
    }

    for (const field of ["accessibilityStatus", "technicalReviewStatus", "mediaStatus"] as const) {
      const value = raw[field];
      if (typeof value === "string" && !MOTION_REVIEW_STATUSES.includes(value as never)) {
        issues.push(issue("scene-review-status", `${prefix}: invalid ${field} "${value}"`, { sceneId }));
      }
    }

    if (typeof raw.durationSeconds !== "number" || !Number.isInteger(raw.durationSeconds) || raw.durationSeconds <= 0) {
      issues.push(issue("scene-duration", `${prefix}: durationSeconds must be a positive integer`, { sceneId }));
    }

    if (typeof raw.version === "string" && !VERSION_RE.test(raw.version)) {
      issues.push(issue("scene-version-format", `${prefix}: version must match vN`, { sceneId }));
    }

    for (const field of ["title", "objective", "mainMessage"] as const) {
      if (typeof raw[field] === "string" && raw[field].trim() === "") {
        issues.push(issue("scene-empty-text", `${prefix}: ${field} must be non-empty`, { sceneId }));
      }
    }

    if (!Array.isArray(raw.courseIds)) {
      issues.push(issue("scene-courseids-type", `${prefix}: courseIds must be an array`, { sceneId }));
    } else {
      for (const courseId of raw.courseIds) {
        if (typeof courseId !== "string" || courseId.trim() === "") {
          issues.push(issue("scene-courseid-format", `${prefix}: courseIds must contain non-empty strings`, { sceneId }));
        }
      }
    }

    if (!Array.isArray(raw.assetIds)) {
      issues.push(issue("scene-assetids-type", `${prefix}: assetIds must be an array`, { sceneId }));
    } else {
      const localAssetIds = new Set<string>();
      for (const assetId of raw.assetIds) {
        if (typeof assetId !== "string" || assetId.trim() === "") {
          issues.push(issue("scene-assetid-format", `${prefix}: assetIds must contain non-empty strings`, { sceneId }));
          continue;
        }
        if (localAssetIds.has(assetId)) {
          issues.push(issue("scene-assetid-duplicate", `${prefix}: duplicate asset reference "${assetId}"`, { sceneId }));
        }
        localAssetIds.add(assetId);
        const asset = assetById.get(assetId);
        if (!asset) {
          issues.push(issue("scene-asset-missing", `${prefix}: asset "${assetId}" is not in the asset registry`, { sceneId, assetId }));
        } else if (!asset.sceneIds.includes(String(raw.id))) {
          issues.push(issue("scene-asset-backref", `${prefix}: asset "${assetId}" does not reference this scene in sceneIds`, { sceneId, assetId }));
        }
      }
    }

    if ("media" in raw && raw.media !== undefined) {
      if (!isPlainObject(raw.media)) {
        issues.push(issue("scene-media-shape", `${prefix}: media must be an object when present`, { sceneId }));
      } else {
        for (const [key, value] of Object.entries(raw.media)) {
          if (typeof value !== "string" || value.trim() === "") {
            issues.push(issue("scene-media-value", `${prefix}: media.${key} must be a non-empty string when present`, { sceneId }));
          }
          if (typeof value === "string" && (/^https?:\/\//i.test(value) || value.includes("://"))) {
            issues.push(issue("scene-media-external", `${prefix}: external media paths are forbidden`, { sceneId }));
          }
        }
      }
    }
  }

  return issues;
}

/** Narrow helper for typed assets after structural checks. */
export function asAssetMetadata(value: unknown): AssetMetadata | null {
  if (!isPlainObject(value)) return null;
  if (typeof value.id !== "string") return null;
  return value as unknown as AssetMetadata;
}
