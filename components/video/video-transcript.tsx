"use client";

import { VideoTranscriptPanel } from "@/components/videos/VideoTranscriptPanel";
import type { VideoTranscript } from "@/src/lib/video-transcripts";

export function VideoTranscript({
  transcript,
  slug,
  currentTime,
  sceneStartTimes,
}: {
  transcript: VideoTranscript;
  slug: string;
  currentTime?: number;
  sceneStartTimes?: number[];
}) {
  return (
    <VideoTranscriptPanel
      transcript={transcript}
      slug={slug}
      currentTime={currentTime}
      sceneStartTimes={sceneStartTimes}
    />
  );
}
