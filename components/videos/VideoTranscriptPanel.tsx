"use client";

import { useMemo, useState } from "react";
import type { VideoTranscript } from "@/src/lib/video-transcripts";

type Props = {
  transcript: VideoTranscript;
  slug: string;
  currentTime?: number;
  sceneStartTimes?: number[];
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VideoTranscriptPanel({ transcript, slug, currentTime = 0, sceneStartTimes }: Props) {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const q = query.trim().toLowerCase();
  const filteredScenes = useMemo(() => {
    if (!q) return transcript.scenes;
    return transcript.scenes.filter(
      (s) => s.title.toLowerCase().includes(q) || s.text.toLowerCase().includes(q)
    );
  }, [q, transcript.scenes]);

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(transcript.fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <section className="rounded-2xl border border-border-light bg-surface-elevated p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => setExpanded(!expanded)} className="font-bold text-ink">
          Transcript {expanded ? "−" : "+"}
        </button>
        <div className="flex flex-wrap gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher…"
            className="rounded-lg border border-border-light px-3 py-1.5 text-sm"
          />
          <button
            type="button"
            onClick={copyAll}
            className="rounded-lg border border-border-light px-3 py-1.5 text-sm font-medium text-ink-secondary hover:bg-surface"
          >
            {copied ? "Copié ✓" : "Copier transcript"}
          </button>
          <a
            href={`/transcripts#${slug}`}
            className="rounded-lg border border-border-light px-3 py-1.5 text-sm font-medium text-ink-secondary hover:bg-surface"
          >
            Bibliothèque
          </a>
        </div>
      </div>
      {expanded && (
        <div className="mt-4 max-h-96 space-y-4 overflow-y-auto rounded-xl bg-surface p-5">
          {filteredScenes.length === 0 ? (
            <p className="text-sm text-ink-tertiary">Aucun résultat pour « {query} »</p>
          ) : (
            filteredScenes.map((scene, i) => {
              const sceneIndex = transcript.scenes.indexOf(scene);
              const startTime = sceneStartTimes?.[sceneIndex];
              const isActive =
                startTime !== undefined &&
                sceneStartTimes?.[sceneIndex + 1] !== undefined &&
                currentTime >= startTime &&
                currentTime < (sceneStartTimes[sceneIndex + 1] ?? Infinity);
              return (
                <div
                  key={sceneIndex}
                  className={isActive ? "rounded-lg bg-accent/10 p-3 ring-1 ring-accent/30" : ""}
                >
                  <p className="text-xs font-semibold uppercase text-accent">
                    {scene.title}
                    {startTime !== undefined && (
                      <span className="ml-2 font-normal text-ink-tertiary">~ {formatTime(startTime)}</span>
                    )}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-secondary">{scene.text}</p>
                </div>
              );
            })
          )}
        </div>
      )}
    </section>
  );
}
