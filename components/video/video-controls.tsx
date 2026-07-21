"use client";

import { PLAYBACK_RATES, formatVideoClock } from "@/hooks/use-video";

type Props = {
  playing: boolean;
  currentTime: number;
  durationSeconds: number;
  remainingSeconds: number;
  playbackRate: number;
  isFullscreen: boolean;
  isPiP: boolean;
  favorite: boolean;
  pipSupported?: boolean;
  onTogglePlay: () => void;
  onSeek: (seconds: number) => void;
  onPlaybackRateChange: (rate: number) => void;
  onToggleFullscreen: () => void;
  onTogglePiP: () => void;
  onToggleFavorite: () => void;
  onMarkComplete?: () => void;
};

/**
 * Barre de contrôles premium accessibles (clavier + labels ARIA).
 */
export function VideoControls({
  playing,
  currentTime,
  durationSeconds,
  remainingSeconds,
  playbackRate,
  isFullscreen,
  isPiP,
  favorite,
  pipSupported = true,
  onTogglePlay,
  onSeek,
  onPlaybackRateChange,
  onToggleFullscreen,
  onTogglePiP,
  onToggleFavorite,
  onMarkComplete,
}: Props) {
  const max = Math.max(durationSeconds, 1);

  return (
    <div className="border-t border-border-light bg-surface-elevated px-4 py-3 sm:px-5 sm:py-4">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onTogglePlay}
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          aria-label={playing ? "Pause" : "Lecture"}
        >
          {playing ? "Pause" : "Lecture"}
        </button>

        <label className="sr-only" htmlFor="video-seek">
          Position de lecture
        </label>
        <input
          id="video-seek"
          type="range"
          min={0}
          max={max}
          step={0.1}
          value={Math.min(currentTime, max)}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="min-w-[8rem] flex-1 accent-[var(--color-accent,#2563eb)]"
          aria-valuetext={`${formatVideoClock(currentTime)} sur ${formatVideoClock(durationSeconds)}`}
        />

        <span className="text-xs text-ink-secondary sm:text-sm" aria-live="off">
          {formatVideoClock(currentTime)} / {formatVideoClock(durationSeconds)}
        </span>
        <span className="text-xs text-ink-tertiary sm:text-sm">
          −{formatVideoClock(remainingSeconds)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-xs font-semibold text-ink-secondary">
          Vitesse
          <select
            value={playbackRate}
            onChange={(e) => onPlaybackRateChange(Number(e.target.value))}
            className="rounded-lg border border-border-light bg-surface px-2 py-1.5 text-xs text-ink"
            aria-label="Vitesse de lecture"
          >
            {PLAYBACK_RATES.map((rate) => (
              <option key={rate} value={rate}>
                {rate}×
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={onToggleFavorite}
          className="rounded-lg border border-border-light px-3 py-1.5 text-xs font-semibold text-ink-secondary hover:bg-surface"
          aria-pressed={favorite}
          aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          {favorite ? "★ Favori" : "☆ Favori"}
        </button>

        {pipSupported && (
          <button
            type="button"
            onClick={onTogglePiP}
            className="rounded-lg border border-border-light px-3 py-1.5 text-xs font-semibold text-ink-secondary hover:bg-surface"
            aria-pressed={isPiP}
            aria-label="Picture in Picture"
          >
            PiP
          </button>
        )}

        <button
          type="button"
          onClick={onToggleFullscreen}
          className="rounded-lg border border-border-light px-3 py-1.5 text-xs font-semibold text-ink-secondary hover:bg-surface"
          aria-pressed={isFullscreen}
          aria-label={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
        >
          {isFullscreen ? "Quitter plein écran" : "Plein écran"}
        </button>

        {onMarkComplete && (
          <button
            type="button"
            onClick={onMarkComplete}
            className="ml-auto rounded-lg border border-border-light px-3 py-1.5 text-xs font-semibold text-ink-secondary hover:bg-surface"
          >
            Marquer comme terminée
          </button>
        )}
      </div>
    </div>
  );
}
