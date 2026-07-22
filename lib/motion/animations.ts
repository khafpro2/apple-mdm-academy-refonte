/**
 * Registre des animations pédagogiques (Lottie, CSS, séquences).
 * Contenu injecté ultérieurement via registerAnimation().
 */

import type { MotionAssetRegistryEntry } from "@/lib/motion/assets";
import { getMotionAsset, listMotionAssets, registerMotionAsset } from "@/lib/motion/assets";

export type AnimationRegistryEntry = MotionAssetRegistryEntry & {
  courseSlug?: string;
  lessonSlug?: string;
};

const animationIndex = new Map<string, string>();

/** Enregistre une animation et l'indexe par slug */
export function registerAnimation(entry: AnimationRegistryEntry): void {
  registerMotionAsset(entry);
  animationIndex.set(entry.slug, entry.slug);
}

/** Récupère une animation par slug */
export function getAnimation(slug: string): AnimationRegistryEntry | undefined {
  const ref = animationIndex.get(slug);
  if (!ref) return undefined;
  return getMotionAsset(ref) as AnimationRegistryEntry | undefined;
}

/** Liste toutes les animations (kind lottie | css | svg-sequence) */
export function listAnimations(): AnimationRegistryEntry[] {
  return listMotionAssets().filter(
    (a) => a.kind === "lottie" || a.kind === "css" || a.kind === "svg-sequence"
  ) as AnimationRegistryEntry[];
}

/** Animations liées à un cours */
export function getAnimationsForCourse(courseSlug: string): AnimationRegistryEntry[] {
  return listAnimations().filter((a) => a.courseSlug === courseSlug);
}

/** Animations liées à une leçon */
export function getAnimationsForLesson(lessonSlug: string): AnimationRegistryEntry[] {
  return listAnimations().filter((a) => a.lessonSlug === lessonSlug);
}
