import type { VisualAsset } from "@/lib/visual-assets/asset-types";
import { visualAssets, visualAssetStats } from "@/lib/visual-assets/asset-registry";

export interface VisualAssetExportManifest {
  generatedAt: string;
  version: string;
  stats: typeof visualAssetStats;
  assets: VisualAsset[];
  categories: string[];
  ecosystems: VisualAsset["ecosystem"][];
}

export function buildExportManifest(): VisualAssetExportManifest {
  return {
    generatedAt: new Date().toISOString(),
    version: "1.0.0",
    stats: visualAssetStats,
    assets: visualAssets,
    categories: [...new Set(visualAssets.map((a) => a.category))].sort(),
    ecosystems: [...new Set(visualAssets.map((a) => a.ecosystem))].sort(),
  };
}
