"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";
import { PLAYBACK_RATES } from "@/components/video-experience/utils";

export type UsePlaybackOptions = {
  videoRef: RefObject<HTMLVideoElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  durationSeconds?: number;
  enabled?: boolean;
  onTimeUpdate?: (seconds: number) => void;
  onEnded?: () => void;
};

/**
 * Contrôles HTML5 purs (play, volume, rate, PiP, fullscreen).
 */
export function usePlayback({
  videoRef,
  containerRef,
  durationSeconds = 0,
  enabled = true,
  onTimeUpdate,
  onEnded,
}: UsePlaybackOptions) {
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState(1);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiP, setIsPiP] = useState(false);

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const remainingSeconds = Math.max(0, (durationSeconds || 0) - currentTime);

  const seekTo = useCallback(
    (seconds: number) => {
      if (!enabled) return;
      const video = videoRef.current;
      if (!video) return;
      const max = durationSeconds || video.duration || 0;
      const next = Math.min(Math.max(0, seconds), max);
      video.currentTime = next;
      setCurrentTime(next);
    },
    [durationSeconds, enabled, videoRef]
  );

  const togglePlay = useCallback(async () => {
    if (!enabled) return;
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      await video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }, [enabled, videoRef]);

  const setVolume = useCallback(
    (value: number) => {
      const video = videoRef.current;
      const next = Math.min(1, Math.max(0, value));
      if (video) {
        video.volume = next;
        video.muted = next === 0;
      }
      setVolumeState(next);
      setMuted(next === 0);
    },
    [videoRef]
  );

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
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
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (node.requestFullscreen) await node.requestFullscreen();
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
      /* unsupported */
    }
  }, [videoRef]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    onTimeUpdate?.(video.currentTime);
  }, [onTimeUpdate, videoRef]);

  return {
    currentTime,
    remainingSeconds,
    playing,
    volume,
    muted,
    playbackRate,
    playbackRates: PLAYBACK_RATES,
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
    handlePlay: () => setPlaying(true),
    handlePause: () => setPlaying(false),
    handleEnded: () => {
      setPlaying(false);
      onEnded?.();
    },
  };
}
