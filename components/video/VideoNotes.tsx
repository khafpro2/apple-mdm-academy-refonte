"use client";

import { useCallback, useState } from "react";
import type { VideoNote } from "@/lib/video/progress-storage";
import { formatVideoTime } from "@/lib/video/format-time";
import { loadVideoNotes, saveVideoNotes } from "@/lib/video/progress-storage";

type VideoNotesProps = {
  videoSlug: string;
  currentSeconds?: number;
  onSeek?: (seconds: number) => void;
  className?: string;
};

export function VideoNotes({
  videoSlug,
  currentSeconds = 0,
  onSeek,
  className = "",
}: VideoNotesProps) {
  const [notes, setNotes] = useState<VideoNote[]>(() =>
    typeof window !== "undefined" ? loadVideoNotes(videoSlug) : []
  );
  const [draft, setDraft] = useState("");

  const addNote = useCallback(() => {
    const text = draft.trim();
    if (!text) return;
    const note: VideoNote = {
      id: crypto.randomUUID(),
      videoSlug,
      timestampSeconds: currentSeconds,
      text,
      createdAt: Date.now(),
    };
    const updated = [...notes, note];
    setNotes(updated);
    saveVideoNotes(videoSlug, updated);
    setDraft("");
  }, [draft, currentSeconds, notes, videoSlug]);

  return (
    <section
      className={`rounded-2xl border border-border-light bg-surface-elevated p-4 ${className}`}
      aria-labelledby="video-notes-heading"
    >
      <h2 id="video-notes-heading" className="font-bold text-ink">
        Notes personnelles
      </h2>
      <div className="mt-3 flex gap-2">
        <label className="sr-only" htmlFor={`video-note-input-${videoSlug}`}>
          Ajouter une note à {formatVideoTime(currentSeconds)}
        </label>
        <input
          id={`video-note-input-${videoSlug}`}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Note à ${formatVideoTime(currentSeconds)}…`}
          className="min-h-11 flex-1 rounded-lg border border-border-light px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          onKeyDown={(e) => e.key === "Enter" && addNote()}
        />
        <button
          type="button"
          onClick={addNote}
          className="min-h-11 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label="Ajouter la note"
        >
          +
        </button>
      </div>
      <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto" aria-live="polite">
        {notes.length === 0 ? (
          <li className="text-xs text-ink-tertiary">Aucune note pour le moment</li>
        ) : (
          notes.map((n) => (
            <li key={n.id} className="rounded-lg bg-surface p-3 text-sm">
              <button
                type="button"
                onClick={() => onSeek?.(n.timestampSeconds)}
                className="text-xs font-semibold tabular-nums text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {formatVideoTime(n.timestampSeconds)}
              </button>
              <p className="mt-1 text-ink-secondary">{n.text}</p>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
