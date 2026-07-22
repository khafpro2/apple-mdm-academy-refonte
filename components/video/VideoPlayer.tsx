"use client";

import { useMemo } from "react";
import type { VideoMetadata } from "@/lib/video/types";
import { useVideoPlayer } from "@/lib/video/use-video-player";
import { formatVideoTime } from "@/lib/video/format-time";
import { selectPreferredSource } from "@/lib/video/preload";
import { MediaPlaceholder } from "@/components/video/placeholders/MediaPlaceholder";
import { ButtonLink } from "@/components/ui";

export type VideoPlayerProps = {
  metadata: VideoMetadata;
  autoResume?: boolean;
  className?: string;
  onProgress?: (seconds: number, completed: boolean) => void;
};

export function VideoPlayer({ metadata, autoResume = true, className = "", onProgress }: VideoPlayerProps) {
  const {
    videoRef,
    containerRef,
    status,
    isPlaying,
    currentSeconds,
    durationSeconds,
    speed,
    activeSubtitleIndex,
    supportsPiP,
    isPiPActive,
    hasSources,
    togglePlay,
    seek,
    setSpeed,
    toggleFullscreen,
    togglePiP,
    setActiveSubtitleIndex,
    speeds,
  } = useVideoPlayer({ metadata, autoResume, onProgress });

  const source = useMemo(() => {
    if (typeof window === "undefined") return metadata.sources?.[0];
    return selectPreferredSource(metadata.sources, window.innerWidth);
  }, [metadata.sources]);

  if (status === "coming-soon") {
    return <MediaPlaceholder variant="video" loading />;
  }

  if (status === "missing") {
    return <MediaPlaceholder variant="video" />;
  }

  if (status === "error") {
    return (
      <MediaPlaceholder
        variant="video"
        title="Erreur de lecture"
        description={metadata.errorMessage ?? "Impossible de charger cette vidéo. Réessayez plus tard."}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={`group relative overflow-hidden rounded-2xl border border-border-light bg-black shadow-xl ${className}`}
      role="region"
      aria-label={`Lecteur vidéo : ${metadata.title}`}
    >
      {hasSources && source ? (
        <video
          ref={videoRef}
          className="aspect-video w-full bg-black"
          poster={metadata.posterUrl}
          preload="metadata"
          playsInline
          aria-label={metadata.title}
        >
          <source src={source.src} type={source.format === "webm" ? "video/webm" : "video/mp4"} />
          {metadata.subtitles?.map((sub, index) => (
            <track
              key={sub.language}
              kind={sub.kind ?? "subtitles"}
              src={sub.src}
              srcLang={sub.language}
              label={sub.label}
              default={index === activeSubtitleIndex}
            />
          ))}
        </video>
      ) : (
        <div className="aspect-video w-full bg-ink" aria-hidden="true" />
      )}

      {status === "loading" && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/50"
          aria-busy="true"
          aria-label="Chargement de la vidéo"
        >
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 opacity-100 transition-opacity focus-within:opacity-100 group-hover:opacity-100 sm:opacity-95">
        <label className="sr-only" htmlFor={`video-progress-${metadata.slug}`}>
          Progression de la vidéo
        </label>
        <input
          id={`video-progress-${metadata.slug}`}
          type="range"
          min={0}
          max={durationSeconds || 100}
          step={0.1}
          value={currentSeconds}
          onChange={(e) => seek(Number(e.target.value))}
          className="w-full accent-accent"
          aria-valuemin={0}
          aria-valuemax={durationSeconds}
          aria-valuenow={Math.round(currentSeconds)}
          aria-valuetext={`${formatVideoTime(currentSeconds)} sur ${formatVideoTime(durationSeconds)}`}
        />

        <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="min-h-11 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-ink hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label={isPlaying ? "Pause" : "Lecture"}
            disabled={status !== "ready"}
          >
            {isPlaying ? "Pause" : "Lecture"}
          </button>

          <span className="text-xs tabular-nums text-white/90" aria-live="off">
            {formatVideoTime(currentSeconds)} / {formatVideoTime(durationSeconds)}
          </span>

          <label className="sr-only" htmlFor={`video-speed-${metadata.slug}`}>
            Vitesse de lecture
          </label>
          <select
            id={`video-speed-${metadata.slug}`}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value) as typeof speed)}
            className="min-h-11 rounded-lg border-0 bg-white/20 px-2 py-1 text-xs text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="Vitesse de lecture"
          >
            {speeds.map((s) => (
              <option key={s} value={s} className="text-ink">
                {s}x
              </option>
            ))}
          </select>

          {metadata.subtitles && metadata.subtitles.length > 1 && (
            <>
              <label className="sr-only" htmlFor={`video-subtitles-${metadata.slug}`}>
                Sous-titres
              </label>
              <select
                id={`video-subtitles-${metadata.slug}`}
                value={activeSubtitleIndex}
                onChange={(e) => setActiveSubtitleIndex(Number(e.target.value))}
                className="min-h-11 rounded-lg border-0 bg-white/20 px-2 py-1 text-xs text-white"
                aria-label="Piste de sous-titres"
              >
                {metadata.subtitles.map((sub, i) => (
                  <option key={sub.language} value={i} className="text-ink">
                    {sub.label}
                  </option>
                ))}
              </select>
            </>
          )}

          <div className="ml-auto flex flex-wrap gap-2">
            {supportsPiP && (
              <button
                type="button"
                onClick={() => void togglePiP()}
                className="min-h-11 rounded-lg bg-white/20 px-3 py-1 text-xs text-white hover:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label={isPiPActive ? "Quitter Picture-in-Picture" : "Picture-in-Picture"}
                aria-pressed={isPiPActive}
              >
                PiP
              </button>
            )}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="min-h-11 rounded-lg bg-white/20 px-3 py-1 text-xs text-white hover:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="Plein écran"
            >
              Plein écran
            </button>
          </div>
        </div>
      </div>

      {(metadata.lab?.href || metadata.quizSlug) && (
        <div className="absolute right-3 top-3 flex flex-wrap gap-2">
          {metadata.lab?.href && metadata.lab.status !== "coming-soon" && (
            <ButtonLink
              href={metadata.lab.href}
              size="sm"
              variant="secondary"
              className="!min-h-9 bg-white/95 text-xs shadow-md backdrop-blur"
            >
              Laboratoire
            </ButtonLink>
          )}
          {metadata.quizSlug && (
            <ButtonLink
              href={`/quiz/${metadata.quizSlug}`}
              size="sm"
              className="!min-h-9 text-xs shadow-md"
            >
              Quiz
            </ButtonLink>
          )}
        </div>
      )}
    </div>
  );
}
