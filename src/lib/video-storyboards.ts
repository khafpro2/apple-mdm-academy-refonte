import type { VideoStoryboard } from "@/src/lib/video-lessons";
import { productionVideoStoryboards } from "@/src/lib/video-storyboard-modules";

/** Alias slug legacy → storyboard production */
const SLUG_ALIASES: Record<string, string> = {
  "automated-device-enrollment": "ade-iphone",
  "ios-ipados-profiles": "ios-ipados-profiles",
  gatekeeper: "gatekeeper-xprotect-sip",
  xprotect: "gatekeeper-xprotect-sip",
};

export const illustratedVideoStoryboards: VideoStoryboard[] = productionVideoStoryboards;

export function getVideoStoryboard(slug: string): VideoStoryboard | undefined {
  const resolved = SLUG_ALIASES[slug] ?? slug;
  return illustratedVideoStoryboards.find((s) => s.slug === resolved);
}

export function getAllIllustratedVideoSlugs(): string[] {
  return illustratedVideoStoryboards.map((s) => s.slug);
}

export function getIllustratedVideoLessons(): VideoStoryboard[] {
  return illustratedVideoStoryboards;
}

export function getRecommendedVideoLessons(limit = 4): VideoStoryboard[] {
  return illustratedVideoStoryboards.slice(0, limit);
}

export function getVideosForCourse(courseSlug: string): VideoStoryboard[] {
  return illustratedVideoStoryboards.filter((s) => s.courseSlug === courseSlug);
}

export {
  exportStoryboardMarkdown,
  exportStoryboardToMarkdown,
} from "@/src/lib/video-lessons";
