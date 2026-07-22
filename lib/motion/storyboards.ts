/**
 * Registre des références storyboard (production graphique / Firefly).
 */

import type { StoryboardReference } from "@/lib/video/types";

export type StoryboardRegistryEntry = StoryboardReference & {
  slug: string;
  videoSlug?: string;
  courseSlug?: string;
  lessonSlug?: string;
  /** Chemin vers le dossier ou manifest storyboard */
  manifestPath?: string;
};

const registry = new Map<string, StoryboardRegistryEntry>();

export function registerStoryboard(entry: StoryboardRegistryEntry): void {
  registry.set(entry.slug, entry);
}

export function registerStoryboards(entries: StoryboardRegistryEntry[]): void {
  for (const entry of entries) registerStoryboard(entry);
}

export function getStoryboard(slug: string): StoryboardRegistryEntry | undefined {
  return registry.get(slug);
}

export function listStoryboards(): StoryboardRegistryEntry[] {
  return [...registry.values()].sort((a, b) => a.title.localeCompare(b.title));
}

export function getStoryboardForVideo(videoSlug: string): StoryboardRegistryEntry | undefined {
  return listStoryboards().find((s) => s.videoSlug === videoSlug);
}

export function getStoryboardsForCourse(courseSlug: string): StoryboardRegistryEntry[] {
  return listStoryboards().filter((s) => s.courseSlug === courseSlug);
}

export function hasStoryboard(slug: string): boolean {
  return registry.has(slug);
}

export function getStoryboardsByStatus(
  status: StoryboardReference["status"]
): StoryboardRegistryEntry[] {
  return listStoryboards().filter((s) => s.status === status);
}
