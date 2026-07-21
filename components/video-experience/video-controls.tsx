"use client";

import { formatVideoClock, PLAYBACK_RATES } from "@/components/video-experience/utils";

type Props = {
  playing: boolean;
  currentTime: number;
  durationSeconds: number;
  remainingSeconds: number;
  volume: number;
  muted: boolean;
  playbackRate: number;
  isFullscreen: boolean;
  isPiP: boolean;
  pipSupported?: boolean;
  onTogglePlay: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onPlaybackRateChange: (rate: number) => void;
  onToggleFullscreen: () => void;
  onTogglePiP: () => void;
  onAddBookmark?: () => void;
  onMarkComplete?: () => void;
};

export function VideoControls({
  playing,
  currentTime,
  durationSeconds,
  remainingSeconds,
  volume,
  muted,
  playbackRate,
  isFullscreen,
  isPiP,
  pipSupported = true,
  onTogglePlay,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onPlaybackRateChange,
  onToggleFullscreen,
  onTogglePiP,
  onAddBookmark,
  onMarkComplete,
}: Props) {
  const max = Math.max(durationSeconds, 1);

  return (
    <div className="video-experience-controls border-t border-border-light bg-surface-elevated px-3 py-3 sm:px-5 sm:py-4">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onTogglePlay}
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label={playing ? "Pause" : "Lecture"}
        >
          {playing ? "Pause" : "Lecture"}
        </button>

        <label className="sr-only" htmlFor="vx-seek">
          Position de lecture
        </label>
        <input
          id="vx-seek"
          type="range"
          min={0}
          max={max}
          step={0.1}
          value={Math.min(currentTime, max)}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="min-w-[7rem] flex-1"
          aria-valuetext={`${formatVideoClock(currentTime)} sur ${formatVideoClock(durationSeconds)}`}
        />

        <span className="text-xs text-ink-secondary sm:text-sm">
          {formatVideoClock(currentTime)} / {formatVideoClock(durationSeconds)}
        </span>
        <span className="text-xs text-ink-tertiary">−{formatVideoClock(remainingSeconds)}</span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onToggleMute}
          className="rounded-lg border border-border-light px-3 py-1.5 text-xs font-semibold text-ink-secondary hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-pressed={muted}
          aria-label={muted ? "Activer le son" : "Couper le son"}
        >
          {muted ? "Son coupé" : "Son"}
        </button>

        <label className="flex items-center gap-2 text-xs font-semibold text-ink-secondary">
          Volume
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            aria-label="Volume"
            className="w-20"
          />
        </label>

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

        {onAddBookmark && (
          <button
            type="button"
            onClick={onAddBookmark}
            className="rounded-lg border border-border-light px-3 py-1.5 text-xs font-semibold text-ink-secondary hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Marque-page
          </button>
        )}

        {pipSupported && (
          <button
            type="button"
            onClick={onTogglePiP}
            className="rounded-lg border border-border-light px-3 py-1.5 text-xs font-semibold text-ink-secondary hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-pressed={isPiP}
            aria-label="Picture in Picture"
          >
            PiP
          </button>
        )}

        <button
          type="button"
          onClick={onToggleFullscreen}
          className="rounded-lg border border-border-light px-3 py-1.5 text-xs font-semibold text-ink-secondary hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-pressed={isFullscreen}
          aria-label={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
        >
          {isFullscreen ? "Quitter plein écran" : "Plein écran"}
        </button>

        {onMarkComplete && (
          <button
            type="button"
            onClick={onMarkComplete}
            className="ml-auto rounded-lg border border-border-light px-3 py-1.5 text-xs font-semibold text-ink-secondary hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Marquer terminée
          </button>
        )}
      </div>
    </div>
  );
}
