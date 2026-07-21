"use client";

import { useMemo, useState } from "react";
import type { VideoTranscriptModel } from "@/components/video-experience/types";

/**
 * Transcript synchronisé + recherche locale (aucune API).
 */
export function useTranscript(transcript: VideoTranscriptModel | undefined, currentTime = 0) {
  const [query, setQuery] = useState("");

  const activeCue = useMemo(() => {
    if (!transcript?.cues.length) return undefined;
    return (
      transcript.cues.find(
        (cue) => currentTime >= cue.startSeconds && currentTime < cue.endSeconds
      ) ?? transcript.cues[transcript.cues.length - 1]
    );
  }, [currentTime, transcript]);

  const filteredCues = useMemo(() => {
    if (!transcript) return [];
    const q = query.trim().toLowerCase();
    if (!q) return transcript.cues;
    return transcript.cues.filter((cue) => cue.text.toLowerCase().includes(q));
  }, [query, transcript]);

  return {
    query,
    setQuery,
    cues: transcript?.cues ?? [],
    filteredCues,
    activeCue,
    activeCueId: activeCue?.id,
    language: transcript?.language ?? "fr",
    hasTranscript: Boolean(transcript?.cues.length),
  };
}
