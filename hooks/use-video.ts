"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore, type RefObject } from "react";
import {
  resolveVideoAvailability,
  type VideoAvailabilityState,
} from "@/lib/video/availability";
import {
  isVideoFavorite,
  subscribeVideoFavorites,
  toggleVideoFavorite,
} from "@/lib/video/favorites-storage";

export const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 1.75, 2] as const;

export type UseVideoOptions = {
  slug: string;
  mp4Url?: string;
  durationSeconds: number;
  videoRef: RefObject<HTMLVideoElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  availabilityState?: VideoAvailabilityState;
  deprecated?: boolean;
  missing?: boolean;
  onTimeUpdate?: (seconds: number) => void;
  onEnded?: () => void;
};

export function formatVideoClock(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Contrôle bas niveau du lecteur HTML5 (play, seek, rate, PiP, fullscreen).
 * Les refs restent dans le composant parent (compat React Compiler).
 */
export function useVideo(options: UseVideoOptions) {
  const {
    slug,
    mp4Url,
    durationSeconds,
    videoRef,
    containerRef,
    availabilityState,
    deprecated = false,
    missing = false,
    onTimeUpdate,
    onEnded,
  } = options;

  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const favorite = useSyncExternalStore(
    subscribeVideoFavorites,
    () => isVideoFavorite(slug),
    () => false
  );

  const availability = useMemo(() => {
    if (availabilityState !== undefined) {
      return resolveVideoAvailability({
        loading: availabilityState === "loading",
        missing: availabilityState === "missing" || missing,
        deprecated: availabilityState === "deprecated" || deprecated,
        hasMp4: availabilityState === "available",
        isPublishable: availabilityState === "available",
      });
    }
    return resolveVideoAvailability({
      hasMp4: Boolean(mp4Url),
      isPublishable: Boolean(mp4Url),
      deprecated,
      missing,
    });
  }, [availabilityState, deprecated, missing, mp4Url]);

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const remainingSeconds = Math.max(0, durationSeconds - currentTime);
  const progressPercent = durationSeconds
    ? Math.min(100, Math.round((currentTime / durationSeconds) * 100))
    : 0;

  const seekTo = useCallback(
    (seconds: number) => {
      const video = videoRef.current;
      if (!video) return;
      const next = Math.min(Math.max(0, seconds), durationSeconds || video.duration || 0);
      video.currentTime = next;
      setCurrentTime(next);
    },
    [durationSeconds, videoRef]
  );

  const togglePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      await video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }, [videoRef]);

  const setPlaybackRate = useCallback(
    (rate: number) => {
      const video = videoRef.current;
      if (video) video.playbackRate = rate;
      setPlaybackRateState(rate);
    },
    [videoRef]
  );

  const enterFullscreen = useCallback(async () => {
    const node = containerRef.current ?? videoRef.current;
    if (!node) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (node.requestFullscreen) {
      await node.requestFullscreen();
    }
  }, [containerRef, videoRef]);

  const togglePictureInPicture = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !document.pictureInPictureEnabled) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiP(false);
      } else {
        await video.requestPictureInPicture();
        setIsPiP(true);
      }
    } catch {
      /* ignore unsupported */
    }
  }, [videoRef]);

  const toggleFavorite = useCallback(() => {
    toggleVideoFavorite(slug);
  }, [slug]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    onTimeUpdate?.(video.currentTime);
  }, [onTimeUpdate, videoRef]);

  const handlePlay = useCallback(() => setPlaying(true), []);
  const handlePause = useCallback(() => setPlaying(false), []);
  const handleEnded = useCallback(() => {
    setPlaying(false);
    onEnded?.();
  }, [onEnded]);

  return {
    availability,
    canPlay: availability.canPlay && Boolean(mp4Url),
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
    formatClock: formatVideoClock,
  };
}
