"use client";

import type { AudioLessonPublic } from "@/lib/data/audio/types";

type AudioLessonPlayerProps = {
  lesson: AudioLessonPublic;
  compact?: boolean;
};

export function AudioLessonPlayer({ lesson, compact = false }: AudioLessonPlayerProps) {
  const trackLabel = `Piste ${String(lesson.trackNumber).padStart(2, "0")}`;

  return (
    <section
      className={
        compact
          ? "rounded-2xl border border-border-light bg-surface px-4 py-4"
          : "rounded-3xl border border-border-light bg-surface-elevated p-5 shadow-sm md:p-6"
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">
            {trackLabel} · {lesson.durationLabel} · MP3
          </p>
          {!compact && <h2 className="mt-1 text-lg font-bold text-ink">{lesson.title}</h2>}
        </div>
        <a
          href={lesson.audioSrc}
          download={lesson.downloadName}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink/90"
        >
          Télécharger le MP3
        </a>
      </div>
      <audio
        className="mt-4 w-full"
        controls
        preload="metadata"
        src={lesson.audioSrc}
        title={`${lesson.title} — piste audio téléchargeable`}
      >
        Votre navigateur ne lit pas l’audio. Téléchargez le fichier MP3.
      </audio>
    </section>
  );
}
