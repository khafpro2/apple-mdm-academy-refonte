"use client";

import type { TranscriptChapter } from "@/hooks/use-transcript";
import { formatVideoClock } from "@/hooks/use-video";

export function VideoChapter({
  chapter,
  active = false,
  onSelect,
}: {
  chapter: TranscriptChapter;
  active?: boolean;
  onSelect?: (startSeconds: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(chapter.startSeconds)}
      aria-current={active ? "true" : undefined}
      className={`flex w-full items-start justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
        active ? "bg-accent/10 text-ink ring-1 ring-accent/30" : "text-ink-secondary hover:bg-surface"
      }`}
    >
      <span>
        <span className="font-semibold">
          {chapter.index + 1}. {chapter.title}
        </span>
        <span className="mt-1 block line-clamp-2 text-xs text-ink-tertiary">{chapter.text}</span>
      </span>
      <span className="shrink-0 text-xs text-ink-tertiary">
        {formatVideoClock(chapter.startSeconds)}
      </span>
    </button>
  );
}
