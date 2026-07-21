"use client";

import { useMemo, useState } from "react";
import type { VideoAvailabilityState, VideoLibraryItemModel } from "@/components/video-experience/types";

export function useVideoLibrarySearch(items: VideoLibraryItemModel[]) {
  const [query, setQuery] = useState("");
  const [availability, setAvailability] = useState<VideoAvailabilityState | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (availability !== "all" && item.availability !== availability) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.module?.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q)
      );
    });
  }, [availability, items, query]);

  return {
    query,
    setQuery,
    availability,
    setAvailability,
    filtered,
    reset: () => {
      setQuery("");
      setAvailability("all");
    },
  };
}

export function VideoSearch({
  search,
  className = "",
}: {
  search: ReturnType<typeof useVideoLibrarySearch>;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-border-light bg-surface-elevated p-5 ${className}`}>
      <label className="sr-only" htmlFor="vx-library-search">
        Rechercher une vidéo
      </label>
      <input
        id="vx-library-search"
        type="search"
        placeholder="Rechercher une vidéo…"
        value={search.query}
        onChange={(e) => search.setQuery(e.target.value)}
        className="w-full rounded-xl border border-border-light px-4 py-2.5 text-sm"
        autoComplete="off"
      />
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filtrer par disponibilité">
        {(
          [
            ["all", "Tous"],
            ["available", "Disponibles"],
            ["processing", "En production"],
            ["loading", "Chargement"],
            ["deprecated", "Dépréciées"],
            ["missing", "Introuvables"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={search.availability === id}
            onClick={() => search.setAvailability(id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              search.availability === id
                ? "border-accent bg-accent text-white"
                : "border-border-light bg-surface text-ink-secondary hover:border-accent/40"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-ink-secondary" aria-live="polite">
        {search.filtered.length} résultat{search.filtered.length > 1 ? "s" : ""}
      </p>
    </div>
  );
}
