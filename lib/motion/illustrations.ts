/**
 * Registre des illustrations (SVG, PNG, WebP, Lottie, vidéo).
 * Contenu injecté ultérieurement via registerIllustration().
 */

import type { MotionAssetKind } from "@/lib/video/types";

export type IllustrationFormat = "svg" | "png" | "webp" | "lottie" | "mp4" | "webm";

export type IllustrationRegistryEntry = {
  id: string;
  slug: string;
  title?: string;
  description?: string;
  format: IllustrationFormat;
  src: string;
  posterUrl?: string;
  alt?: string;
  width?: number;
  height?: number;
  courseSlug?: string;
  lessonSlug?: string;
  tags?: string[];
  /** Pour Lottie / vidéo loop */
  loop?: boolean;
  autoplay?: boolean;
};

const registry = new Map<string, IllustrationRegistryEntry>();

export function registerIllustration(entry: IllustrationRegistryEntry): void {
  registry.set(entry.slug, entry);
}

export function registerIllustrations(entries: IllustrationRegistryEntry[]): void {
  for (const entry of entries) registerIllustration(entry);
}

export function getIllustration(slug: string): IllustrationRegistryEntry | undefined {
  return registry.get(slug);
}

export function listIllustrations(): IllustrationRegistryEntry[] {
  return [...registry.values()].sort((a, b) => (a.title ?? a.slug).localeCompare(b.title ?? b.slug));
}

export function getIllustrationsForCourse(courseSlug: string): IllustrationRegistryEntry[] {
  return listIllustrations().filter((i) => i.courseSlug === courseSlug);
}

export function getIllustrationsForLesson(lessonSlug: string): IllustrationRegistryEntry[] {
  return listIllustrations().filter((i) => i.lessonSlug === lessonSlug);
}

export function hasIllustration(slug: string): boolean {
  return registry.has(slug);
}

/** Convertit le format illustration en kind motion asset */
export function illustrationFormatToMotionKind(format: IllustrationFormat): MotionAssetKind {
  switch (format) {
    case "lottie":
      return "lottie";
    case "mp4":
    case "webm":
      return "video-loop";
    default:
      return "svg-sequence";
  }
}
