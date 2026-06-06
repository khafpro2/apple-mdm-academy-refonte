import type { HeyGenGenerationStatus } from "@/lib/types";

export type HeyGenVideoResult = {
  slug: string;
  status: HeyGenGenerationStatus;
  videoUrl?: string;
  sessionUrl?: string;
  heygenVideoId?: string;
  updatedAt: string;
};

export const heygenVideoResults: Record<string, HeyGenVideoResult> = {};

export function getHeyGenVideoResult(slug: string): HeyGenVideoResult | undefined {
  return heygenVideoResults[slug];
}
