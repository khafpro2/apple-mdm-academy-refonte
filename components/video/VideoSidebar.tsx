"use client";

import type { ReactNode } from "react";
import type { VideoChapter } from "@/lib/video/types";
import { formatVideoTime } from "@/lib/video/format-time";
import { MediaPlaceholder } from "@/components/video/placeholders/MediaPlaceholder";

type VideoSidebarProps = {
  chapters?: VideoChapter[];
  currentSeconds?: number;
  onSeek?: (seconds: number) => void;
  children?: ReactNode;
  className?: string;
};

export function VideoSidebar({
  chapters = [],
  currentSeconds = 0,
  onSeek,
  children,
  className = "",
}: VideoSidebarProps) {
  const hasChapters = chapters.length > 0;

  return (
    <aside
      className={`space-y-4 ${className}`}
      aria-label="Panneau latéral vidéo"
    >
      <section
        className="rounded-2xl border border-border-light bg-surface-elevated p-4"
        aria-labelledby="video-chapters-heading"
      >
        <h2 id="video-chapters-heading" className="font-bold text-ink">
          Chapitres
        </h2>
        {hasChapters ? (
          <nav aria-label="Navigation par chapitres" className="mt-3">
            <ul className="space-y-1">
              {chapters.map((ch) => {
                const isActive = currentSeconds >= ch.startSeconds;
                return (
                  <li key={ch.id}>
                    <button
                      type="button"
                      onClick={() => onSeek?.(ch.startSeconds)}
                      className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                        isActive
                          ? "bg-accent/10 font-medium text-accent"
                          : "text-ink-secondary hover:bg-surface"
                      }`}
                      aria-current={isActive ? "true" : undefined}
                    >
                      <span className="tabular-nums">{formatVideoTime(ch.startSeconds)}</span>
                      <span aria-hidden="true"> · </span>
                      {ch.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : (
          <MediaPlaceholder variant="generic" compact className="mt-3 border-none bg-transparent p-0" title="Chapitres à venir" description="Les marqueurs de chapitres seront ajoutés avec la vidéo." />
        )}
      </section>
      {children}
    </aside>
  );
}
