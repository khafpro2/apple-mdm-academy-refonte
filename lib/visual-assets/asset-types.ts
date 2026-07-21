import type { BrandLogoVariant } from "@/lib/brands/types";

/** Ecosystem classification for visual assets */
export type VisualAssetEcosystem = "apple" | "jamf" | "microsoft" | "neutral";

/** Asset kind within the enterprise icon system */
export type VisualAssetType =
  | "icon"
  | "component"
  | "connector"
  | "badge"
  | "logo"
  | "freeform-board";

/** Brand verification status for compliance */
export type VisualAssetVerificationStatus =
  | "original"
  | "official-asset"
  | "to-verify";

export interface VisualAsset {
  id: string;
  name: string;
  category: string;
  ecosystem: VisualAssetEcosystem;
  type: VisualAssetType;
  path: string;
  tags: string[];
  description: string;
  freeformReady: boolean;
  verificationStatus: VisualAssetVerificationStatus;
}

export interface VisualAssetFilters {
  query?: string;
  category?: string;
  ecosystem?: VisualAssetEcosystem;
  type?: VisualAssetType;
  freeformReady?: boolean;
  verificationStatus?: VisualAssetVerificationStatus;
}

export interface VisualAssetCategoryGroup {
  category: string;
  assets: VisualAsset[];
}

/** Re-export brand variant type for gallery theme toggle compatibility */
export type { BrandLogoVariant };
