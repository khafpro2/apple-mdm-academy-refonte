"use client";

import { useMemo, useState } from "react";
import type { VideoTranscript } from "@/src/lib/video-transcripts";

export type TranscriptChapter = {
  index: number;
  title: string;
  text: string;
  startSeconds: number;
  endSeconds: number;
  durationSeconds: number;
};

function buildChapters(transcript: VideoTranscript): TranscriptChapter[] {
  let cursor = 0;
  return transcript.scenes.map((scene, index) => {
    const startSeconds = cursor;
    const durationSeconds = Math.max(scene.durationSeconds, 1);
    const endSeconds = startSeconds + durationSeconds;
    cursor = endSeconds;
    return {
      index,
      title: scene.title,
      text: scene.text,
      startSeconds,
      endSeconds,
      durationSeconds,
    };
  });
}

/**
 * Transcript synchronisé + recherche + chapitre actif.
 */
export function useTranscript(transcript: VideoTranscript | undefined, currentTime = 0) {
  const [query, setQuery] = useState("");

  const chapters = useMemo(
    () => (transcript ? buildChapters(transcript) : []),
    [transcript]
  );

  const sceneStartTimes = useMemo(
    () => chapters.map((chapter) => chapter.startSeconds),
    [chapters]
  );

  const activeChapter = useMemo(() => {
    if (!chapters.length) return undefined;
    return (
      chapters.find(
        (chapter) => currentTime >= chapter.startSeconds && currentTime < chapter.endSeconds
      ) ?? chapters[chapters.length - 1]
    );
  }, [chapters, currentTime]);

  const filteredChapters = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chapters;
    return chapters.filter(
      (chapter) =>
        chapter.title.toLowerCase().includes(q) || chapter.text.toLowerCase().includes(q)
    );
  }, [chapters, query]);

  return {
    chapters,
    sceneStartTimes,
    activeChapter,
    activeIndex: activeChapter?.index ?? 0,
    query,
    setQuery,
    filteredChapters,
    wordCount: transcript?.wordCount ?? 0,
    fullText: transcript?.fullText ?? "",
  };
}
