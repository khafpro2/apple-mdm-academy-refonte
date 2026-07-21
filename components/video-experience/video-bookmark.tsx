"use client";

import { formatVideoClock } from "@/components/video-experience/utils";
import type { VideoBookmarkModel } from "@/components/video-experience/types";

export function VideoBookmark({
  bookmarks,
  onSeek,
  onRemove,
  onAdd,
  className = "",
}: {
  bookmarks: VideoBookmarkModel[];
  onSeek?: (seconds: number) => void;
  onRemove?: (createdAt: number) => void;
  onAdd?: () => void;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-border-light bg-surface-elevated p-5 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-bold text-ink">Marque-pages</h2>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="rounded-lg border border-border-light px-3 py-1.5 text-xs font-semibold text-ink-secondary hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Ajouter
          </button>
        )}
      </div>
      {bookmarks.length === 0 ? (
        <p className="mt-3 text-sm text-ink-tertiary">Aucun marque-page pour cette vidéo.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {bookmarks.map((bookmark) => (
            <li
              key={bookmark.createdAt}
              className="flex items-center justify-between gap-3 rounded-xl bg-surface px-3 py-2 text-sm"
            >
              <button
                type="button"
                onClick={() => onSeek?.(bookmark.seconds)}
                className="font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {bookmark.label ?? formatVideoClock(bookmark.seconds)}
              </button>
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(bookmark.createdAt)}
                  className="text-xs text-ink-tertiary hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  aria-label="Supprimer le marque-page"
                >
                  Retirer
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
