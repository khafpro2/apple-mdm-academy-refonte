import type { MotionAsset } from "@/lib/motion/types";
import { filevaultAssets } from "@/lib/motion/data/assets/filevault";

/** Catalogue des assets motion — source de vérité (Option A). */
export const motionAssets: MotionAsset[] = [...filevaultAssets];

export { filevaultAssets };
