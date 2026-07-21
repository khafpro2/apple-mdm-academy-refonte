import type { MotionScene } from "@/lib/motion/types";
import { filevaultScene } from "@/lib/motion/data/scenes/filevault";

/** Catalogue des scènes motion — source de vérité (Option A). */
export const motionScenes: MotionScene[] = [filevaultScene];

export { filevaultScene };
