"use client";

import type { VideoChapterModel } from "@/components/video-experience/types";
import { formatVideoClock } from "@/components/video-experience/utils";

export function VideoChapters({
  chapters,
  activeId,
  onSelect,
  className = "",
}: {
  chapters: VideoChapterModel[];
  activeId?: string;
  onSelect?: (startSeconds: number) => void;
  className?: string;
}) {
  if (!chapters.length) {
    return (
      <div className={`rounded-2xl border border-dashed border-border-light bg-surface p-5 ${className}`}>
        <h2 className="font-bold text-ink">Chapitres</h2>
        <p className="mt-2 text-sm text-ink-tertiary">En attente des chapitres infrastructure.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-border-light bg-surface-elevated p-5 ${className}`}>
      <h2 className="font-bold text-ink">Chapitres</h2>
      <ol className="mt-3 space-y-1">
        {chapters.map((chapter, index) => {
          const active = chapter.id === activeId;
          return (
            <li key={chapter.id}>
              <button
                type="button"
                onClick={() => onSelect?.(chapter.startSeconds)}
                aria-current={active ? "true" : undefined}
                className={`flex w-full items-start justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  active ? "bg-accent/10 text-ink ring-1 ring-accent/30" : "text-ink-secondary hover:bg-surface"
                }`}
              >
                <span>
                  <span className="font-semibold">
                    {index + 1}. {chapter.title}
                  </span>
                  {chapter.summary && (
                    <span className="mt-1 block line-clamp-2 text-xs text-ink-tertiary">
                      {chapter.summary}
                    </span>
                  )}
                </span>
                <span className="shrink-0 text-xs text-ink-tertiary">
                  {formatVideoClock(chapter.startSeconds)}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
