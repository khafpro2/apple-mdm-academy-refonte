import {
  ASSET_CATEGORIES,
  type AssetCategory,
} from "@/lib/motion/asset-types";

export const FORBIDDEN_ID_WORDS = [
  "final",
  "latest",
  "new",
  "test",
  "temp",
  "draft-file",
  "asset1",
  "image1",
  "final-v2",
] as const;

const CATEGORY_SET = new Set<string>(ASSET_CATEGORIES);

/** Out-of-scope MDM / brand tokens forbidden in asset ids and text fields. */
export const FORBIDDEN_BRAND_TOKENS = [
  "kandji",
  "mosyle",
  "addigy",
  "workspace-one",
  "workspaceone",
  "vmware",
] as const;

export function isAssetCategory(value: string): value is AssetCategory {
  return CATEGORY_SET.has(value);
}

function getAssetCategoryPrefix(id: string): AssetCategory | null {
  const categoriesByLength = [...ASSET_CATEGORIES].sort((a, b) => b.length - a.length);
  return categoriesByLength.find((category) => id.startsWith(`${category}-`)) ?? null;
}

export function parseAssetVersion(id: string): string | null {
  const match = id.match(/-v([1-9]\d*)$/);
  return match ? `v${match[1]}` : null;
}

/**
 * Validates id convention:
 * - lowercase letters, digits, hyphens only
 * - starts with allowed category
 * - ends with vN
 * - no forbidden words as whole segments
 * - minimum segments by category family
 */
export function validateAssetId(id: string): string[] {
  const errors: string[] = [];

  if (!id || typeof id !== "string") {
    errors.push("id is required");
    return errors;
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    errors.push(
      "id must be lowercase letters, digits and hyphens only (no spaces or accents)"
    );
  }

  const version = parseAssetVersion(id);
  if (!version) {
    errors.push("id must end with version suffix vN (positive integer)");
  }

  const segments = id.split("-");
  const category = getAssetCategoryPrefix(id);
  if (!category) {
    errors.push("id must start with an allowed AssetCategory followed by a hyphen");
  }

  for (const word of FORBIDDEN_ID_WORDS) {
    if (segments.includes(word) || id.includes(word)) {
      // draft-file is multi-segment; also catch version-final as contiguous
      if (word.includes("-")) {
        if (id.includes(word)) errors.push(`id contains forbidden word "${word}"`);
      } else if (segments.includes(word)) {
        errors.push(`id contains forbidden word "${word}"`);
      }
    }
  }

  // Minimum segments (category + … + version)
  const minSegments =
    category === "status" || category === "transition"
      ? 4
      : category === "background"
        ? 5
        : 6;

  if (segments.length < minSegments) {
    errors.push(
      `id for category "${category ?? "unknown"}" must have at least ${minSegments} hyphen-separated segments (got ${segments.length})`
    );
  }

  return errors;
}

export function containsForbiddenBrand(text: string): string | null {
  const lower = text.toLowerCase();
  for (const token of FORBIDDEN_BRAND_TOKENS) {
    if (lower.includes(token)) return token;
  }
  return null;
}
