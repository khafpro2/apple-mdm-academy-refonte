"use client";

import { useEffect, useRef } from "react";
import { VideoBadge } from "@/components/video-experience/video-badge";
import { VideoControls } from "@/components/video-experience/video-controls";
import { VideoProgress } from "@/components/video-experience/video-progress";
import { usePlayback } from "@/hooks/use-playback";
import { useProgress } from "@/hooks/use-progress";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { usePrefersReducedMotion, useVideo } from "@/hooks/use-video";
import type { VideoExperienceModel } from "@/components/video-experience/types";

/**
 * Lecteur premium — ne monte un `<video>` que si availability=available ET mediaSrc réel.
 */
export function VideoPlayer({ experience }: { experience?: VideoExperienceModel | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const resumedRef = useRef(false);
  const reducedMotion = usePrefersReducedMotion();

  const model = useVideo({ experience });
  const progress = useProgress(model.slug, model.durationSeconds);
  const bookmarks = useBookmarks(model.slug);

  const {
    currentTime,
    remainingSeconds,
    playing,
    volume,
    muted,
    playbackRate,
    isFullscreen,
    isPiP,
    seekTo,
    togglePlay,
    setVolume,
    toggleMute,
    setPlaybackRate,
    enterFullscreen,
    togglePictureInPicture,
    handleTimeUpdate,
    handlePlay,
    handlePause,
    handleEnded,
  } = usePlayback({
    videoRef,
    containerRef,
    durationSeconds: model.durationSeconds,
    enabled: model.canPlay,
    onTimeUpdate: (seconds) => {
      progress.persist(seconds, model.durationSeconds > 0 && seconds >= model.durationSeconds * 0.95);
    },
    onEnded: () => progress.persist(model.durationSeconds, true),
  });

  useEffect(() => {
    resumedRef.current = false;
  }, [model.slug]);

  useEffect(() => {
    if (!model.canPlay || resumedRef.current || progress.resumeAt == null) return;
    const resumeAt = progress.resumeAt;
    const apply = () => {
      seekTo(resumeAt);
      resumedRef.current = true;
    };
    const el = videoRef.current;
    if (!el) return;
    if (el.readyState >= 1) apply();
    else el.addEventListener("loadedmetadata", apply, { once: true });
  }, [model.canPlay, progress.resumeAt, seekTo]);

  if (!model.canPlay || !model.mediaSrc) {
    return (
      <div
        className="video-experience-player overflow-hidden rounded-2xl border border-border-light bg-surface-elevated p-8 text-center shadow-sm"
        role="status"
        aria-live="polite"
        data-video-player-state={model.availability}
      >
        <VideoBadge state={model.availability} />
        <p className="mt-4 text-sm font-semibold text-ink">{model.title}</p>
        <p className="mt-2 text-sm text-ink-secondary">
          {model.availability === "processing" &&
            "Vidéo en production — le lecteur MP4 n’est pas affiché tant que le média n’est pas disponible."}
          {model.availability === "loading" && "Chargement de la disponibilité…"}
          {model.availability === "missing" &&
            "Fiche non fournie par l’infrastructure — aucun média fictif n’est affiché."}
          {model.availability === "deprecated" && "Cette vidéo est dépréciée."}
          {model.availability === "available" &&
            !model.mediaSrc &&
            "Statut available sans mediaSrc — le lecteur reste masqué."}
        </p>
      </div>
    );
  }

  const pipSupported =
    typeof document !== "undefined" ? document.pictureInPictureEnabled : true;

  return (
    <div
      className={`video-experience-player space-y-4 ${reducedMotion ? "video-experience-reduced-motion" : ""}`}
    >
      <div
        ref={containerRef}
        className="overflow-hidden rounded-2xl border border-border-light bg-black shadow-xl"
      >
        <video
          ref={videoRef}
          src={model.mediaSrc}
          poster={model.posterSrc}
          className="aspect-video w-full"
          preload="metadata"
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          aria-label={model.title}
        >
          {model.captionsSrc && (
            <track kind="captions" srcLang="fr" label="Français" src={model.captionsSrc} default />
          )}
          Votre navigateur ne supporte pas la lecture vidéo.
        </video>

        <VideoControls
          playing={playing}
          currentTime={currentTime}
          durationSeconds={model.durationSeconds}
          remainingSeconds={remainingSeconds}
          volume={volume}
          muted={muted}
          playbackRate={playbackRate}
          isFullscreen={isFullscreen}
          isPiP={isPiP}
          pipSupported={pipSupported}
          onTogglePlay={() => void togglePlay()}
          onSeek={seekTo}
          onVolumeChange={setVolume}
          onToggleMute={toggleMute}
          onPlaybackRateChange={setPlaybackRate}
          onToggleFullscreen={() => void enterFullscreen()}
          onTogglePiP={() => void togglePictureInPicture()}
          onAddBookmark={() =>
            bookmarks.addBookmark(currentTime, `À ${Math.floor(currentTime)}s`)
          }
          onMarkComplete={progress.complete}
        />
      </div>

      <VideoProgress
        value={
          model.durationSeconds
            ? Math.round((currentTime / model.durationSeconds) * 100)
            : progress.percent
        }
        completed={progress.completed}
        label={progress.resumeAt != null && !progress.completed ? "Reprise automatique active" : undefined}
      />
    </div>
  );
}
