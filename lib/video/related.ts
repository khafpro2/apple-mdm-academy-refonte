import type { VideoCatalogEntry } from "@/lib/video/catalog";

/**
 * Vidéos liées pour la playlist (même track, puis même module, hors slug courant).
 */
export function getRelatedVideoEntries(
  catalog: VideoCatalogEntry[],
  current: Pick<VideoCatalogEntry, "slug" | "track" | "module">,
  limit = 8
): VideoCatalogEntry[] {
  const others = catalog.filter((entry) => entry.slug !== current.slug);
  const sameTrack = others.filter((entry) => entry.track === current.track);
  const sameModule = others.filter(
    (entry) => entry.module === current.module && entry.track !== current.track
  );
  const rest = others.filter(
    (entry) => entry.track !== current.track && entry.module !== current.module
  );
  return [...sameTrack, ...sameModule, ...rest].slice(0, limit);
}
