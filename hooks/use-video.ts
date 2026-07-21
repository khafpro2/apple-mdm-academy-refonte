"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { VideoAvailabilityState, VideoExperienceModel } from "@/components/video-experience/types";
import { canMountMediaPlayer } from "@/components/video-experience/utils";

export type UseVideoInput = {
  experience?: VideoExperienceModel | null;
  /** Override explicite (ex. résolution page encore en cours). */
  availabilityOverride?: VideoAvailabilityState;
};

/**
 * Vue modèle UX d’une fiche vidéo — sans fetch API.
 */
export function useVideo({ experience, availabilityOverride }: UseVideoInput) {
  const availability: VideoAvailabilityState =
    availabilityOverride ?? experience?.availability ?? "missing";

  const canPlay = canMountMediaPlayer(availability, experience?.mediaSrc);

  return useMemo(
    () => ({
      experience: experience ?? null,
      slug: experience?.slug,
      title: experience?.title ?? "Vidéo",
      description: experience?.description,
      availability,
      canPlay,
      mediaSrc: canPlay ? experience?.mediaSrc : undefined,
      posterSrc: experience?.posterSrc,
      captionsSrc: experience?.captionsSrc,
      durationSeconds: experience?.durationSeconds ?? 0,
      durationLabel: experience?.durationLabel,
      chapters: experience?.chapters ?? [],
      transcript: experience?.transcript,
      resources: experience?.resources ?? [],
      playlist: experience?.playlist ?? [],
      related: experience?.related ?? [],
    }),
    [availability, canPlay, experience]
  );
}

/** Prefers-reduced-motion (SSR-safe). */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined" || !window.matchMedia) return () => {};
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () =>
      typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false,
    () => false
  );
}
