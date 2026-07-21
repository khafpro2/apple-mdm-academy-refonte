"use client";

import { useEffect, useRef } from "react";
import { VideoBadge } from "@/components/video/video-badge";
import { VideoControls } from "@/components/video/video-controls";
import { VideoProgress } from "@/components/video/video-progress";
import { VideoTranscript } from "@/components/video/video-transcript";
import { VideoChapter } from "@/components/video/video-chapter";
import { useVideo } from "@/hooks/use-video";
import { useTranscript } from "@/hooks/use-transcript";
import { useProgress } from "@/hooks/use-progress";
import type { VideoAvailabilityState } from "@/lib/video/availability";
import type { VideoTranscript as VideoTranscriptData } from "@/src/lib/video-transcripts";

type Props = {
  slug: string;
  title: string;
  mp4Url?: string;
  poster?: string;
  captionsSrc?: string;
  durationSeconds: number;
  durationLabel: string;
  courseSlug: string;
  transcript?: VideoTranscriptData;
  availabilityState?: VideoAvailabilityState;
  deprecated?: boolean;
  missing?: boolean;
};

/**
 * Lecteur vidéo premium — ne monte jamais un `<video>` si le média n’est pas `available`.
 */
export function VideoPlayer({
  slug,
  title,
  mp4Url,
  poster,
  captionsSrc,
  durationSeconds,
  durationLabel,
  courseSlug,
  transcript,
  availabilityState,
  deprecated = false,
  missing = false,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const resumedRef = useRef(false);

  const progress = useProgress({ slug, title, courseSlug, durationSeconds });
  const {
    availability,
    canPlay,
    currentTime,
    remainingSeconds,
    progressPercent,
    playing,
    playbackRate,
    isFullscreen,
    isPiP,
    favorite,
    seekTo,
    togglePlay,
    setPlaybackRate,
    enterFullscreen,
    togglePictureInPicture,
    toggleFavorite,
    handleTimeUpdate,
    handlePlay,
    handlePause,
    handleEnded,
  } = useVideo({
    slug,
    mp4Url,
    durationSeconds,
    videoRef,
    containerRef,
    availabilityState,
    deprecated,
    missing,
    onTimeUpdate: (seconds) => {
      progress.persist(seconds, seconds >= durationSeconds * 0.95);
    },
    onEnded: () => {
      progress.persist(durationSeconds, true);
    },
  });
  const transcriptState = useTranscript(transcript, currentTime);

  useEffect(() => {
    progress.rememberAsLast();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per video
  }, [slug, title]);

  useEffect(() => {
    resumedRef.current = false;
  }, [slug]);

  useEffect(() => {
    if (resumedRef.current || progress.resumeAt == null) return;
    const resumeAt = progress.resumeAt;
    const apply = () => {
      seekTo(resumeAt);
      resumedRef.current = true;
    };
    const el = videoRef.current;
    if (!el) return;
    if (el.readyState >= 1) apply();
    else el.addEventListener("loadedmetadata", apply, { once: true });
  }, [progress.resumeAt, seekTo]);

  if (!canPlay || !mp4Url) {
    return (
      <div
        className="overflow-hidden rounded-2xl border border-border-light bg-surface-elevated p-8 text-center shadow-sm"
        role="status"
        aria-live="polite"
        data-video-player-state={availability.state}
      >
        <VideoBadge state={availability.state} />
        <p className="mt-4 text-sm font-semibold text-ink">{title}</p>
        <p className="mt-2 text-sm text-ink-secondary">{availability.description}</p>
        <p className="mt-4 text-xs text-ink-tertiary">
          Le lecteur MP4 n’est affiché que lorsque la vidéo est complète (fichier + publication).
        </p>
      </div>
    );
  }

  const pipSupported =
    typeof document !== "undefined" ? document.pictureInPictureEnabled : true;

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="overflow-hidden rounded-2xl border border-border-light bg-black shadow-xl"
      >
        <video
          ref={videoRef}
          src={mp4Url}
          className="aspect-video w-full"
          poster={poster}
          preload="metadata"
          crossOrigin="anonymous"
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          aria-label={title}
        >
          {captionsSrc && (
            <track kind="captions" srcLang="fr" label="Français" src={captionsSrc} default />
          )}
          Votre navigateur ne supporte pas la lecture vidéo.
        </video>

        <VideoControls
          playing={playing}
          currentTime={currentTime}
          durationSeconds={durationSeconds}
          remainingSeconds={remainingSeconds}
          playbackRate={playbackRate}
          isFullscreen={isFullscreen}
          isPiP={isPiP}
          favorite={favorite}
          pipSupported={pipSupported}
          onTogglePlay={() => void togglePlay()}
          onSeek={seekTo}
          onPlaybackRateChange={setPlaybackRate}
          onToggleFullscreen={() => void enterFullscreen()}
          onTogglePiP={() => void togglePictureInPicture()}
          onToggleFavorite={toggleFavorite}
          onMarkComplete={progress.complete}
        />

        <div className="border-t border-border-light bg-surface-elevated px-5 py-3">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold text-accent">Vidéo officielle LMS</span>
            <span className="text-ink-secondary">{durationLabel}</span>
            {progress.resumeAt != null && !progress.completed && (
              <span className="text-xs text-ink-tertiary">Reprise automatique</span>
            )}
          </div>
          <VideoProgress
            value={progressPercent}
            syncing={progress.syncing}
            completed={progress.completed}
            className="mt-3"
          />
        </div>
      </div>

      {transcriptState.chapters.length > 0 && (
        <div className="rounded-2xl border border-border-light bg-surface-elevated p-5">
          <h2 className="font-bold text-ink">Chapitres</h2>
          <div className="mt-3 space-y-1">
            {transcriptState.chapters.map((chapter) => (
              <VideoChapter
                key={chapter.index}
                chapter={chapter}
                active={chapter.index === transcriptState.activeIndex}
                onSelect={seekTo}
              />
            ))}
          </div>
        </div>
      )}

      {transcript && (
        <VideoTranscript
          transcript={transcript}
          slug={slug}
          currentTime={currentTime}
          sceneStartTimes={transcriptState.sceneStartTimes}
        />
      )}
    </div>
  );
}
