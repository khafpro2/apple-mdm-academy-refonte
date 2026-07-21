"use client";

import type { VideoChapterModel } from "@/components/video-experience/types";
import { formatVideoClock } from "@/components/video-experience/utils";

export function VideoTimeline({
  chapters,
  currentSeconds = 0,
  durationSeconds = 0,
  onSeek,
  className = "",
}: {
  chapters: VideoChapterModel[];
  currentSeconds?: number;
  durationSeconds?: number;
  onSeek?: (seconds: number) => void;
  className?: string;
}) {
  const total =
    durationSeconds ||
    chapters.reduce((max, chapter) => Math.max(max, chapter.endSeconds), 0) ||
    1;

  if (!chapters.length) {
    return (
      <div className={`rounded-2xl border border-dashed border-border-light bg-surface p-5 ${className}`}>
        <h2 className="font-bold text-ink">Timeline</h2>
        <p className="mt-2 text-sm text-ink-tertiary">Aucun chapitre fourni par l’infrastructure.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-border-light bg-surface-elevated p-5 ${className}`}>
      <h2 className="font-bold text-ink">Timeline</h2>
      <div
        className="mt-4 flex h-3 overflow-hidden rounded-full bg-surface"
        role="img"
        aria-label="Répartition des chapitres"
      >
        {chapters.map((chapter) => {
          const width = ((chapter.endSeconds - chapter.startSeconds) / total) * 100;
          const active =
            currentSeconds >= chapter.startSeconds && currentSeconds < chapter.endSeconds;
          return (
            <button
              key={chapter.id}
              type="button"
              title={chapter.title}
              aria-label={`Aller au chapitre ${chapter.title}`}
              aria-current={active ? "true" : undefined}
              className={`h-full border-r border-white/40 last:border-r-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                active ? "bg-accent" : "bg-accent/30 hover:bg-accent/50"
              }`}
              style={{ width: `${Math.max(width, 2)}%` }}
              onClick={() => onSeek?.(chapter.startSeconds)}
            />
          );
        })}
      </div>
      <p className="mt-2 text-xs text-ink-tertiary">
        Position {formatVideoClock(currentSeconds)} / {formatVideoClock(total)}
      </p>
    </div>
  );
}
