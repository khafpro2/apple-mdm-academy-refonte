"use client";

import { useTranscript } from "@/hooks/use-transcript";
import type { VideoTranscriptModel } from "@/components/video-experience/types";
import { formatVideoClock } from "@/components/video-experience/utils";

export function VideoTranscript({
  transcript,
  currentTime = 0,
  onSeek,
  className = "",
}: {
  transcript?: VideoTranscriptModel;
  currentTime?: number;
  onSeek?: (seconds: number) => void;
  className?: string;
}) {
  const state = useTranscript(transcript, currentTime);

  if (!state.hasTranscript) {
    return (
      <section className={`rounded-2xl border border-dashed border-border-light bg-surface p-5 ${className}`}>
        <h2 className="font-bold text-ink">Transcript</h2>
        <p className="mt-2 text-sm text-ink-tertiary">
          Aucun transcript fourni — branchement prévu lorsque l’infrastructure Codex exposera les cues.
        </p>
      </section>
    );
  }

  return (
    <section className={`rounded-2xl border border-border-light bg-surface-elevated p-5 sm:p-6 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-bold text-ink">Transcript synchronisé</h2>
        <label className="sr-only" htmlFor="vx-transcript-search">
          Rechercher dans le transcript
        </label>
        <input
          id="vx-transcript-search"
          type="search"
          value={state.query}
          onChange={(e) => state.setQuery(e.target.value)}
          placeholder="Rechercher dans la transcription…"
          className="w-full max-w-xs rounded-lg border border-border-light px-3 py-1.5 text-sm sm:w-auto"
        />
      </div>

      <div className="mt-4 max-h-96 space-y-3 overflow-y-auto rounded-xl bg-surface p-4">
        {state.filteredCues.length === 0 ? (
          <p className="text-sm text-ink-tertiary">Aucun résultat.</p>
        ) : (
          state.filteredCues.map((cue) => {
            const active = cue.id === state.activeCueId;
            return (
              <button
                key={cue.id}
                type="button"
                onClick={() => onSeek?.(cue.startSeconds)}
                aria-current={active ? "true" : undefined}
                className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  active ? "bg-accent/10 ring-1 ring-accent/30" : "hover:bg-surface-elevated"
                }`}
              >
                <span className="text-xs font-semibold text-ink-tertiary">
                  {formatVideoClock(cue.startSeconds)}
                </span>
                <span className="mt-1 block text-ink-secondary">{cue.text}</span>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}
