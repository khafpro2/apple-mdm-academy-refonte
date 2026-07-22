"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { VideoAvailabilityStatus, VideoMetadata } from "@/lib/video/types";
import { loadVideoProgress, saveVideoProgress } from "@/lib/video/progress-storage";
import { preloadVideoAssets, selectPreferredSource } from "@/lib/video/preload";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const;
export type PlaybackSpeed = (typeof SPEEDS)[number];

export type UseVideoPlayerOptions = {
  metadata: VideoMetadata;
  autoResume?: boolean;
  onProgress?: (seconds: number, completed: boolean) => void;
};

export type UseVideoPlayerReturn = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  status: VideoAvailabilityStatus;
  isPlaying: boolean;
  currentSeconds: number;
  durationSeconds: number;
  progressPercent: number;
  speed: PlaybackSpeed;
  activeSubtitleIndex: number;
  supportsPiP: boolean;
  isPiPActive: boolean;
  hasSources: boolean;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  setSpeed: (speed: PlaybackSpeed) => void;
  toggleFullscreen: () => void;
  togglePiP: () => Promise<void>;
  setActiveSubtitleIndex: (index: number) => void;
  speeds: readonly PlaybackSpeed[];
};

function resolveStatus(metadata: VideoMetadata, hasSources: boolean): VideoAvailabilityStatus {
  if (metadata.status !== "ready") return metadata.status;
  return hasSources ? "ready" : "missing";
}

export function useVideoPlayer({
  metadata,
  autoResume = true,
  onProgress,
}: UseVideoPlayerOptions): UseVideoPlayerReturn {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const saved = autoResume ? loadVideoProgress(metadata.slug) : null;

  const preferredSource =
    typeof window !== "undefined"
      ? selectPreferredSource(metadata.sources, window.innerWidth)
      : metadata.sources?.[0];
  const hasSources = Boolean(preferredSource?.src);

  const baseStatus = resolveStatus(metadata, hasSources);
  const statusKey = `${metadata.slug}:${metadata.status}:${hasSources}`;
  const [playbackState, setPlaybackState] = useState<{
    key: string;
    eventStatus: VideoAvailabilityStatus | null;
  }>({ key: statusKey, eventStatus: null });
  const eventStatusForKey =
    playbackState.key === statusKey ? playbackState.eventStatus : null;
  const status = eventStatusForKey ?? baseStatus;

  const setEventStatus = useCallback(
    (next: VideoAvailabilityStatus | null) => {
      setPlaybackState({ key: statusKey, eventStatus: next });
    },
    [statusKey]
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(saved?.currentSeconds ?? 0);
  const [durationSeconds, setDurationSeconds] = useState(metadata.durationSeconds ?? 0);
  const [speed, setSpeedState] = useState<PlaybackSpeed>(1);
  const [activeSubtitleIndex, setActiveSubtitleIndex] = useState(
    metadata.subtitles?.findIndex((s) => s.default) ?? 0
  );
  const [supportsPiP] = useState(
    () => typeof document !== "undefined" && "pictureInPictureEnabled" in document
  );
  const [isPiPActive, setIsPiPActive] = useState(false);

  useEffect(() => {
    if (hasSources) preloadVideoAssets(metadata);
  }, [metadata, hasSources]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !autoResume || !saved?.currentSeconds) return;
    video.currentTime = saved.currentSeconds;
  }, [autoResume, saved?.currentSeconds]);

  const persistProgress = useCallback(
    (seconds: number, completed = false) => {
      saveVideoProgress({
        videoSlug: metadata.slug,
        currentSeconds: seconds,
        completed,
        updatedAt: Date.now(),
      });
      onProgress?.(seconds, completed);
    },
    [metadata.slug, onProgress]
  );

  const seek = useCallback(
    (seconds: number) => {
      const clamped = Math.max(0, Math.min(seconds, durationSeconds || seconds));
      setCurrentSeconds(clamped);
      if (videoRef.current) videoRef.current.currentTime = clamped;
      persistProgress(clamped);
    },
    [durationSeconds, persistProgress]
  );

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || status !== "ready") return;
    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  }, [status]);

  const setSpeed = useCallback((next: PlaybackSpeed) => {
    setSpeedState(next);
    if (videoRef.current) videoRef.current.playbackRate = next;
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void el.requestFullscreen();
    }
  }, []);

  const togglePiP = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !supportsPiP) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch {
      /* PiP refusé ou indisponible */
    }
  }, [supportsPiP]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      const t = video.currentTime;
      setCurrentSeconds(t);
      const dur = video.duration || durationSeconds;
      persistProgress(t, dur > 0 && t >= dur * 0.95);
    };
    const onDurationChange = () => {
      if (Number.isFinite(video.duration)) setDurationSeconds(video.duration);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setEventStatus("loading");
    const onCanPlay = () => setEventStatus("ready");
    const onError = () => setEventStatus("error");
    const onEnterPiP = () => setIsPiPActive(true);
    const onLeavePiP = () => setIsPiPActive(false);

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("durationchange", onDurationChange);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("error", onError);
    video.addEventListener("enterpictureinpicture", onEnterPiP);
    video.addEventListener("leavepictureinpicture", onLeavePiP);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("durationchange", onDurationChange);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("error", onError);
      video.removeEventListener("enterpictureinpicture", onEnterPiP);
      video.removeEventListener("leavepictureinpicture", onLeavePiP);
    };
  }, [durationSeconds, persistProgress, setEventStatus]);

  const progressPercent = durationSeconds > 0 ? (currentSeconds / durationSeconds) * 100 : 0;

  return {
    videoRef,
    containerRef,
    status,
    isPlaying,
    currentSeconds,
    durationSeconds,
    progressPercent,
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
    speeds: SPEEDS,
  };
}
