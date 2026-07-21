"use client";

import { useMemo, useState } from "react";
import {
  filterVideoCatalog,
  type VideoCatalogEntry,
  type VideoCatalogTrack,
} from "@/lib/video/catalog";
import type { VideoAvailabilityState } from "@/lib/video/availability";

type Props = {
  entries: VideoCatalogEntry[];
  className?: string;
};

/**
 * Recherche + filtres parcours / disponibilité.
 * Retourne aussi la liste filtrée via render children pattern optionnel —
 * ici expose `filtered` pour composition dans VideosCatalog.
 */
export function useVideoSearch(entries: VideoCatalogEntry[]) {
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState<VideoCatalogTrack | "all">("all");
  const [availability, setAvailability] = useState<VideoAvailabilityState | "all">("all");
  const [playableOnly, setPlayableOnly] = useState(false);

  const filtered = useMemo(
    () =>
      filterVideoCatalog(entries, {
        query,
        track,
        availability,
        playableOnly,
      }),
    [entries, query, track, availability, playableOnly]
  );

  return {
    query,
    setQuery,
    track,
    setTrack,
    availability,
    setAvailability,
    playableOnly,
    setPlayableOnly,
    filtered,
    reset: () => {
      setQuery("");
      setTrack("all");
      setAvailability("all");
      setPlayableOnly(false);
    },
  };
}

export function VideoSearch({
  entries,
  className = "",
  search,
}: Props & {
  search: ReturnType<typeof useVideoSearch>;
}) {
  return (
    <div className={`rounded-2xl border border-border-light bg-surface-elevated p-5 ${className}`}>
      <label className="sr-only" htmlFor="premium-video-search">
        Rechercher une vidéo
      </label>
      <input
        id="premium-video-search"
        type="search"
        placeholder="Rechercher une vidéo, un module ou un slug…"
        value={search.query}
        onChange={(e) => search.setQuery(e.target.value)}
        className="w-full rounded-xl border border-border-light px-4 py-2.5 text-sm"
        autoComplete="off"
      />

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filtrer par parcours">
        {(
          [
            ["all", "Tous les parcours"],
            ["popular", "Populaires"],
            ["illustrated", "Illustrées"],
            ["jamf-100", "Jamf 100"],
            ["jamf-170", "Jamf 170"],
            ["jamf-200", "Jamf 200"],
            ["fundamentals", "Fondamentaux"],
          ] as const
        ).map(([id, label]) => (
          <Chip key={id} active={search.track === id} onClick={() => search.setTrack(id)}>
            {label}
          </Chip>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filtrer par disponibilité">
        {(
          [
            ["all", "Tous statuts"],
            ["available", "Disponibles"],
            ["processing", "En production"],
            ["deprecated", "Dépréciées"],
            ["missing", "Introuvables"],
          ] as const
        ).map(([id, label]) => (
          <Chip
            key={id}
            active={search.availability === id}
            onClick={() => search.setAvailability(id)}
          >
            {label}
          </Chip>
        ))}
        <Chip active={search.playableOnly} onClick={() => search.setPlayableOnly((v) => !v)}>
          Lecture MP4 uniquement
        </Chip>
      </div>

      <p className="mt-4 text-sm text-ink-secondary" aria-live="polite">
        {search.filtered.length} résultat{search.filtered.length > 1 ? "s" : ""}
        {entries.length ? ` / ${entries.length}` : ""}
      </p>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? "border-accent bg-accent text-white"
          : "border-border-light bg-surface text-ink-secondary hover:border-accent/40"
      }`}
    >
      {children}
    </button>
  );
}
