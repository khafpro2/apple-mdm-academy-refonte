"use client";

import { VideoCard } from "@/components/video/video-card";
import { VideoSearch, useVideoSearch } from "@/components/video/video-search";
import type { VideoCatalogEntry } from "@/lib/video/catalog";

export function VideosCatalog({ entries }: { entries: VideoCatalogEntry[] }) {
  const search = useVideoSearch(entries);
  const availableCount = entries.filter((e) => e.canPlay).length;
  const processingCount = entries.filter((e) => e.availability === "processing").length;

  return (
    <div>
      <div className="mt-8 flex flex-wrap gap-3 text-sm text-ink-secondary">
        <span className="rounded-full border border-border-light bg-surface-elevated px-4 py-1.5">
          {entries.length} vidéos
        </span>
        <span className="rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-green-800">
          {availableCount} disponibles
        </span>
        <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-amber-900">
          {processingCount} en production
        </span>
        <span className="rounded-full border border-border-light bg-surface-elevated px-4 py-1.5">
          HeyGen · fr-FR · 16:9
        </span>
      </div>

      <div className="mt-8">
        <VideoSearch entries={entries} search={search} />
      </div>

      {search.filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border-light bg-surface p-8 text-center">
          <p className="text-sm font-semibold text-ink">Aucune vidéo ne correspond</p>
          <p className="mt-2 text-sm text-ink-secondary">
            Élargissez la recherche ou retirez les filtres.
          </p>
          <button
            type="button"
            className="mt-4 text-sm font-semibold text-accent hover:underline"
            onClick={search.reset}
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {search.filtered.map((entry) => (
            <VideoCard key={entry.slug} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
