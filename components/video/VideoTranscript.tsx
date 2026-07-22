"use client";

import type { VideoTranscript } from "@/lib/video/types";
import { formatVideoTime } from "@/lib/video/format-time";
import { MediaPlaceholder } from "@/components/video/placeholders/MediaPlaceholder";

type VideoTranscriptPanelProps = {
  transcript?: VideoTranscript | null;
  currentSeconds?: number;
  onSeek?: (seconds: number) => void;
  className?: string;
};

export function VideoTranscriptPanel({
  transcript,
  currentSeconds = 0,
  onSeek,
  className = "",
}: VideoTranscriptPanelProps) {
  const segments = transcript?.segments ?? [];
  const hasSegments = segments.length > 0;

  if (!hasSegments) {
    return (
      <section
        className={className}
        aria-labelledby="video-transcript-heading"
      >
        <h2 id="video-transcript-heading" className="sr-only">
          Transcription
        </h2>
        <MediaPlaceholder variant="transcript" compact />
      </section>
    );
  }

  return (
    <section
      className={`rounded-2xl border border-border-light bg-surface-elevated p-4 ${className}`}
      aria-labelledby="video-transcript-heading"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 id="video-transcript-heading" className="font-bold text-ink">
          Transcription
        </h2>
        {transcript?.label && (
          <span className="text-xs text-ink-tertiary">{transcript.label}</span>
        )}
      </div>

      <div
        className="mt-4 max-h-80 space-y-2 overflow-y-auto"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {segments.map((seg) => {
          const isActive =
            currentSeconds >= seg.startSeconds &&
            (seg.endSeconds == null || currentSeconds < seg.endSeconds);
          return (
            <button
              key={seg.id}
              type="button"
              onClick={() => onSeek?.(seg.startSeconds)}
              className={`w-full rounded-xl px-3 py-2 text-left text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                isActive ? "bg-accent/10 text-ink" : "text-ink-secondary hover:bg-surface"
              }`}
              aria-current={isActive ? "true" : undefined}
            >
              <time
                className="mr-2 text-xs font-semibold tabular-nums text-accent"
                dateTime={`PT${Math.floor(seg.startSeconds)}S`}
              >
                {formatVideoTime(seg.startSeconds)}
              </time>
              {seg.speaker && (
                <span className="mr-2 text-xs font-medium text-ink-tertiary">{seg.speaker}:</span>
              )}
              {seg.text}
            </button>
          );
        })}
      </div>
    </section>
  );
}
