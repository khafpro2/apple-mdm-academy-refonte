/**
 * Registre des métadonnées vidéo (manifests futurs dans content/videos/).
 */

import type { VideoMetadata, VideoSeries } from "@/lib/video/types";

const videos = new Map<string, VideoMetadata>();
const series = new Map<string, VideoSeries>();

export function registerVideo(metadata: VideoMetadata): void {
  videos.set(metadata.slug, metadata);
}

export function registerVideos(entries: VideoMetadata[]): void {
  for (const entry of entries) registerVideo(entry);
}

export function getVideoMetadata(slug: string): VideoMetadata | undefined {
  return videos.get(slug);
}

export function listVideos(): VideoMetadata[] {
  return [...videos.values()].sort((a, b) => a.title.localeCompare(b.title));
}

export function getVideosForCourse(courseSlug: string): VideoMetadata[] {
  return listVideos().filter((v) => v.courseSlug === courseSlug);
}

export function getVideosForLesson(lessonSlug: string): VideoMetadata[] {
  return listVideos().filter((v) => v.lessonSlug === lessonSlug);
}

export function registerVideoSeries(entry: VideoSeries): void {
  series.set(entry.slug, entry);
}

export function getVideoSeries(slug: string): VideoSeries | undefined {
  return series.get(slug);
}

export function listVideoSeries(): VideoSeries[] {
  return [...series.values()].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function getVideosInSeries(seriesSlug: string): VideoMetadata[] {
  const s = series.get(seriesSlug);
  if (!s) return [];
  return s.videoSlugs
    .map((slug) => videos.get(slug))
    .filter((v): v is VideoMetadata => v != null);
}

export function hasVideo(slug: string): boolean {
  return videos.has(slug);
}
