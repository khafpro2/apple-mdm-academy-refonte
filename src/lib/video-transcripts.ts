import { getVideoStoryboard, getIllustratedVideoLessons } from "@/src/lib/video-storyboards";
import { OFFICIAL_LMS_VIDEOS } from "@/src/lib/video-production";

export type VideoTranscriptScene = {
  title: string;
  text: string;
  durationSeconds: number;
};

export type VideoTranscript = {
  slug: string;
  title: string;
  module: string;
  fullText: string;
  scenes: VideoTranscriptScene[];
  wordCount: number;
};

export function getVideoTranscript(slug: string): VideoTranscript | undefined {
  const storyboard = getVideoStoryboard(slug);
  if (!storyboard) return undefined;

  const fullText = storyboard.narration;
  const scenes = storyboard.scenes.map((s) => ({
    title: s.title,
    text: s.narration,
    durationSeconds: s.durationSeconds,
  }));

  return {
    slug,
    title: storyboard.title,
    module: storyboard.module,
    fullText,
    scenes,
    wordCount: fullText.split(/\s+/).filter(Boolean).length,
  };
}

export function getAllVideoTranscripts(): VideoTranscript[] {
  return getIllustratedVideoLessons()
    .map((s) => getVideoTranscript(s.slug))
    .filter(Boolean) as VideoTranscript[];
}

export function getOfficialVideoTranscripts(): VideoTranscript[] {
  return OFFICIAL_LMS_VIDEOS.map((v) => getVideoTranscript(v.slug)).filter(Boolean) as VideoTranscript[];
}

export function searchTranscripts(query: string, transcripts: VideoTranscript[]): VideoTranscript[] {
  const q = query.trim().toLowerCase();
  if (!q) return transcripts;
  return transcripts.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.module.toLowerCase().includes(q) ||
      t.fullText.toLowerCase().includes(q)
  );
}
