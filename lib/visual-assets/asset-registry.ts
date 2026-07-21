import type { VisualAsset } from "@/lib/visual-assets/asset-types";
import generatedManifest from "@/lib/visual-assets/generated-manifest.json";
import { BRAND_REGISTRY } from "@/lib/brands/registry";
import { illustrationRegistry } from "@/lib/assets/illustration-registry";

/** Maps brand registry entries to visual asset entries (official logos — no duplication) */
function brandAssetsFromRegistry(): VisualAsset[] {
  return BRAND_REGISTRY.map((brand) => ({
    id: `brand-${brand.id}`,
    name: brand.name,
    category: "brand",
    ecosystem:
      brand.id === "apple"
        ? "apple"
        : brand.id === "jamf"
          ? "jamf"
          : brand.id === "microsoft" ||
              brand.id === "intune" ||
              brand.id === "entra" ||
              brand.id === "microsoft-learn"
            ? "microsoft"
            : "neutral",
    type: "logo" as const,
    path: brand.logoPath,
    tags: ["official", "logo", brand.id],
    description: `Official ${brand.name} logo from public/brands or public/logos.`,
    freeformReady: false,
    verificationStatus: brand.isPlaceholder ? ("to-verify" as const) : ("official-asset" as const),
  }));
}

/** Maps pedagogical flow illustrations to visual asset entries */
function illustrationAssetsFromRegistry(): VisualAsset[] {
  return illustrationRegistry.map((ill) => ({
    id: ill.id,
    name: ill.alt.slice(0, 80),
    category: "illustrations",
    ecosystem: "neutral" as const,
    type: "component" as const,
    path: ill.src,
    tags: ["flow", "course", ...ill.usedIn],
    description: ill.alt,
    freeformReady: true,
    verificationStatus: "original" as const,
  }));
}

/** Generated SVG library from scripts/generate-visual-assets.mjs */
const generatedAssets = generatedManifest as VisualAsset[];

/** AMA project logos (existing — not proposals) */
const amaBrandAssets: VisualAsset[] = [
  {
    id: "ama-mark",
    name: "Apple MDM Academy Mark",
    category: "brand",
    ecosystem: "neutral",
    type: "logo",
    path: "/brand/apple-mdm-academy-mark.svg",
    tags: ["ama", "official", "mark"],
    description: "Current Apple MDM Academy brand mark.",
    freeformReady: false,
    verificationStatus: "original",
  },
  {
    id: "ama-logo",
    name: "Apple MDM Academy Logo",
    category: "brand",
    ecosystem: "neutral",
    type: "logo",
    path: "/logos/mdm-academy.svg",
    tags: ["ama", "official", "logo"],
    description: "Current Apple MDM Academy logo.",
    freeformReady: false,
    verificationStatus: "original",
  },
];

export const visualAssets: VisualAsset[] = [
  ...brandAssetsFromRegistry(),
  ...amaBrandAssets,
  ...illustrationAssetsFromRegistry(),
  ...generatedAssets,
];

export function getVisualAsset(id: string): VisualAsset | undefined {
  return visualAssets.find((a) => a.id === id);
}

export function getVisualAssetsByCategory(category: string): VisualAsset[] {
  return visualAssets.filter((a) => a.category === category);
}

export function getVisualAssetsByEcosystem(
  ecosystem: VisualAsset["ecosystem"]
): VisualAsset[] {
  return visualAssets.filter((a) => a.ecosystem === ecosystem);
}

export function searchVisualAssets(query: string): VisualAsset[] {
  const q = query.trim().toLowerCase();
  if (!q) return visualAssets;
  return visualAssets.filter(
    (a) =>
      a.id.includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q)) ||
      a.path.toLowerCase().includes(q)
  );
}

export function filterVisualAssets(filters: {
  query?: string;
  category?: string;
  ecosystem?: VisualAsset["ecosystem"];
  type?: VisualAsset["type"];
  freeformReady?: boolean;
  verificationStatus?: VisualAsset["verificationStatus"];
}): VisualAsset[] {
  let result = filters.query ? searchVisualAssets(filters.query) : [...visualAssets];

  if (filters.category) {
    result = result.filter((a) => a.category === filters.category);
  }
  if (filters.ecosystem) {
    result = result.filter((a) => a.ecosystem === filters.ecosystem);
  }
  if (filters.type) {
    result = result.filter((a) => a.type === filters.type);
  }
  if (filters.freeformReady !== undefined) {
    result = result.filter((a) => a.freeformReady === filters.freeformReady);
  }
  if (filters.verificationStatus) {
    result = result.filter((a) => a.verificationStatus === filters.verificationStatus);
  }

  return result;
}

export function getVisualAssetCategories(): string[] {
  return [...new Set(visualAssets.map((a) => a.category))].sort();
}

export const visualAssetStats = {
  total: visualAssets.length,
  byType: visualAssets.reduce<Record<string, number>>((acc, a) => {
    acc[a.type] = (acc[a.type] ?? 0) + 1;
    return acc;
  }, {}),
  byEcosystem: visualAssets.reduce<Record<string, number>>((acc, a) => {
    acc[a.ecosystem] = (acc[a.ecosystem] ?? 0) + 1;
    return acc;
  }, {}),
  byCategory: visualAssets.reduce<Record<string, number>>((acc, a) => {
    acc[a.category] = (acc[a.category] ?? 0) + 1;
    return acc;
  }, {}),
  freeformReady: visualAssets.filter((a) => a.freeformReady).length,
};
