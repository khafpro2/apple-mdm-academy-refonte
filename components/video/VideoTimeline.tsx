"use client";

import type { VideoChapter } from "@/lib/video/types";
import { formatVideoTime } from "@/lib/video/format-time";

type VideoTimelineProps = {
  chapters?: VideoChapter[];
  currentSeconds?: number;
  durationSeconds?: number;
  onSeek?: (seconds: number) => void;
  className?: string;
};

export function VideoTimeline({
  chapters = [],
  currentSeconds = 0,
  durationSeconds = 0,
  onSeek,
  className = "",
}: VideoTimelineProps) {
  const hasDuration = durationSeconds > 0;
  const progressPercent = hasDuration ? (currentSeconds / durationSeconds) * 100 : 0;

  return (
    <section
      className={`rounded-2xl border border-border-light bg-surface-elevated p-4 ${className}`}
      aria-labelledby="video-timeline-heading"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 id="video-timeline-heading" className="font-bold text-ink">
          Timeline
        </h2>
        {hasDuration && (
          <span className="text-xs tabular-nums text-ink-tertiary">
            {formatVideoTime(currentSeconds)} / {formatVideoTime(durationSeconds)}
          </span>
        )}
      </div>

      <div className="relative mt-4">
        <div
          className="h-2 rounded-full bg-border-light"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={durationSeconds}
          aria-valuenow={Math.round(currentSeconds)}
          aria-label="Progression globale"
        >
          <div
            className="h-2 rounded-full bg-accent transition-all duration-300"
            style={{ width: `${Math.min(100, progressPercent)}%` }}
          />
        </div>

        {hasDuration && chapters.length > 0 && (
          <div className="relative mt-1 h-6" aria-hidden="true">
            {chapters.map((ch) => {
              const left = (ch.startSeconds / durationSeconds) * 100;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => onSeek?.(ch.startSeconds)}
                  className="absolute top-0 h-4 w-0.5 -translate-x-1/2 rounded-full bg-ink-tertiary/50 hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                  style={{ left: `${left}%` }}
                  title={ch.title}
                  tabIndex={-1}
                />
              );
            })}
          </div>
        )}
      </div>

      {chapters.length === 0 && (
        <p className="mt-3 text-xs text-ink-tertiary">
          Les repères de chapitres apparaîtront une fois la vidéo finalisée.
        </p>
      )}
    </section>
  );
}
