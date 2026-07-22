import type { VideoLessonBundle, VideoMetadata } from "@/lib/video/types";
import type { VideoScript } from "@/src/lib/video-scripts";

/**
 * Convertit un script vidéo existant en bundle moteur — sans inventer de sources ou chapitres.
 */
export function videoScriptToMetadata(
  script: VideoScript,
  options?: {
    mp4Url?: string;
    posterUrl?: string;
  }
): VideoMetadata {
  const hasPlayback = Boolean(options?.mp4Url);
  return {
    slug: script.slug,
    title: script.title,
    description: script.description,
    durationSeconds: script.durationSeconds,
    status: hasPlayback ? "ready" : "coming-soon",
    courseSlug: script.relatedCourseSlug,
    lessonSlug: undefined,
    posterUrl: options?.posterUrl,
    sources: hasPlayback && options?.mp4Url
      ? [{ src: options.mp4Url, format: "mp4", label: "720p" }]
      : undefined,
    lab: script.relatedLabSlug
      ? {
          slug: script.relatedLabSlug,
          title: "Laboratoire associé",
          href: `/labs/${script.relatedLabSlug}`,
          status: "coming-soon",
        }
      : undefined,
    tags: script.jamfTrack ? [script.jamfTrack] : undefined,
  };
}

export function videoScriptToBundle(
  script: VideoScript,
  options?: {
    mp4Url?: string;
    posterUrl?: string;
    lessonSlug?: string;
  }
): VideoLessonBundle {
  const metadata = videoScriptToMetadata(script, options);
  if (options?.lessonSlug) {
    metadata.lessonSlug = options.lessonSlug;
  }
  return { metadata };
}
