"use client";

import Link from "next/link";
import { VideoLibraryCard } from "@/components/video-experience/video-library-card";
import { VideoSearch, useVideoLibrarySearch } from "@/components/video-experience/video-search";
import type { VideoLibraryItemModel } from "@/components/video-experience/types";

/**
 * Bibliothèque UX — reçoit uniquement des items typés (aucune donnée mockée ici).
 */
export function VideoLibraryExperience({ items }: { items: VideoLibraryItemModel[] }) {
  const search = useVideoLibrarySearch(items);

  return (
    <div className="video-experience-library">
      <div className="mt-8 flex flex-wrap gap-3 text-sm text-ink-secondary">
        <span className="rounded-full border border-border-light bg-surface-elevated px-4 py-1.5">
          {items.length} vidéo{items.length > 1 ? "s" : ""}
        </span>
        <span className="rounded-full border border-border-light bg-surface-elevated px-4 py-1.5">
          Expérience UX V1 — en attente infrastructure
        </span>
      </div>

      <div className="mt-8">
        <VideoSearch search={search} />
      </div>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border-light bg-surface p-8 text-center">
          <p className="text-sm font-semibold text-ink">Catalogue non branché</p>
          <p className="mt-2 text-sm text-ink-secondary">
            Aucune entrée fournie. Cette page n’invente pas de vidéos — Codex branchera le registre
            lorsque l’infrastructure sera prête.
          </p>
        </div>
      ) : search.filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border-light bg-surface p-8 text-center">
          <p className="text-sm font-semibold text-ink">Aucun résultat</p>
          <button
            type="button"
            onClick={search.reset}
            className="mt-4 text-sm font-semibold text-accent hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {search.filtered.map((item) => (
            <VideoLibraryCard key={item.slug} item={item} />
          ))}
        </div>
      )}

      <p className="mt-8 text-center text-sm text-ink-tertiary">
        <Link href="/videos" className="font-semibold text-accent hover:underline">
          Bibliothèque vidéo
        </Link>
      </p>
    </div>
  );
}
