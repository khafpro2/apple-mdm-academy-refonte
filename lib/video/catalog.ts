import type { VideoAvailabilityState } from "@/lib/video/availability";
import { resolveVideoAvailability } from "@/lib/video/availability";
import type { VideoDisplayBadge } from "@/src/lib/video-display-status";
import { getVideoDisplayBadges } from "@/src/lib/video-display-status";
import { getVideoAssets } from "@/src/lib/video-assets";
import type { VideoStoryboard } from "@/src/lib/video-lessons";
import {
  getFundamentalVideoScripts,
  getJamfVideoScriptsByTrack,
  getPopularVideoScripts,
  getVideoScript,
  videoScripts,
  type VideoScript,
} from "@/src/lib/video-scripts";
import { getIllustratedVideoLessons } from "@/src/lib/video-storyboards";

export type VideoCatalogTrack =
  | "popular"
  | "illustrated"
  | "jamf-100"
  | "jamf-170"
  | "jamf-200"
  | "fundamentals"
  | "other";

export type VideoCatalogEntry = {
  slug: string;
  title: string;
  description: string;
  module: string;
  duration: string;
  level?: string;
  track: VideoCatalogTrack;
  availability: VideoAvailabilityState;
  canPlay: boolean;
  hasMp4: boolean;
  poster?: string;
  thumbnailPath?: string;
  badges: VideoDisplayBadge[];
  href: string;
  featured?: boolean;
  jamf?: boolean;
  illustrated?: boolean;
  searchText: string;
};

function trackForScript(script: VideoScript, forced?: VideoCatalogTrack): VideoCatalogTrack {
  if (forced) return forced;
  if (script.jamfTrack === "jamf-100") return "jamf-100";
  if (script.jamfTrack === "jamf-170") return "jamf-170";
  if (script.jamfTrack === "jamf-200") return "jamf-200";
  if (script.popular) return "popular";
  if (!script.jamfTrack) return "fundamentals";
  return "other";
}

function entryFromScript(
  script: VideoScript,
  mp4Map: Record<string, boolean>,
  options: { track?: VideoCatalogTrack; featured?: boolean; jamf?: boolean } = {}
): VideoCatalogEntry {
  const hasMp4 = Boolean(mp4Map[script.slug]);
  const availability = resolveVideoAvailability({ hasMp4, isPublishable: hasMp4 });
  const pack = getVideoAssets(script.slug);
  const badges = getVideoDisplayBadges({
    slug: script.slug,
    hasMp4,
    scriptText: script.script,
  });
  const description = script.description ?? script.title;

  return {
    slug: script.slug,
    title: script.title,
    description,
    module: script.module,
    duration: script.duration,
    level: script.level,
    track: trackForScript(script, options.track),
    availability: availability.state,
    canPlay: availability.canPlay,
    hasMp4,
    poster: pack?.thumbnailPath,
    thumbnailPath: pack?.thumbnailPath,
    badges,
    href: `/videos/${script.slug}`,
    featured: options.featured,
    jamf: options.jamf,
    searchText: [script.title, description, script.module, script.slug].join(" ").toLowerCase(),
  };
}

function entryFromStoryboard(
  lesson: VideoStoryboard,
  mp4Map: Record<string, boolean>
): VideoCatalogEntry {
  const hasMp4 = Boolean(mp4Map[lesson.slug]);
  const availability = resolveVideoAvailability({
    hasMp4,
    isPublishable: hasMp4,
  });
  const pack = getVideoAssets(lesson.slug);
  const script = getVideoScript(lesson.slug);
  const badges = getVideoDisplayBadges({
    slug: lesson.slug,
    hasMp4,
    storyboard: lesson,
    scriptText: script?.script ?? lesson.narration,
  });

  return {
    slug: lesson.slug,
    title: lesson.title,
    description: lesson.objective,
    module: lesson.module,
    duration: lesson.duration,
    level: lesson.level,
    track: "illustrated",
    availability: availability.state,
    canPlay: availability.canPlay,
    hasMp4,
    poster: pack?.thumbnailPath,
    thumbnailPath: pack?.thumbnailPath,
    badges,
    href: `/videos/${lesson.slug}`,
    illustrated: true,
    searchText: [lesson.title, lesson.objective, lesson.module, lesson.slug]
      .join(" ")
      .toLowerCase(),
  };
}

/** Catalogue unifié pour la page /videos (recherche + filtres). */
export function buildVideoCatalog(mp4Map: Record<string, boolean>): VideoCatalogEntry[] {
  const bySlug = new Map<string, VideoCatalogEntry>();

  for (const lesson of getIllustratedVideoLessons()) {
    bySlug.set(lesson.slug, entryFromStoryboard(lesson, mp4Map));
  }

  const upsertScript = (
    script: VideoScript,
    options: { track?: VideoCatalogTrack; featured?: boolean; jamf?: boolean } = {}
  ) => {
    const existing = bySlug.get(script.slug);
    if (existing) {
      bySlug.set(script.slug, {
        ...existing,
        featured: existing.featured || options.featured,
        jamf: existing.jamf || options.jamf,
        track: options.track ?? existing.track,
      });
      return;
    }
    bySlug.set(script.slug, entryFromScript(script, mp4Map, options));
  };

  for (const script of getPopularVideoScripts()) {
    upsertScript(script, { track: "popular", featured: true });
  }
  for (const script of getJamfVideoScriptsByTrack("jamf-100")) {
    upsertScript(script, { track: "jamf-100", jamf: true });
  }
  for (const script of getJamfVideoScriptsByTrack("jamf-170")) {
    upsertScript(script, { track: "jamf-170", jamf: true });
  }
  for (const script of getJamfVideoScriptsByTrack("jamf-200")) {
    upsertScript(script, { track: "jamf-200", jamf: true });
  }
  for (const script of getFundamentalVideoScripts()) {
    upsertScript(script, { track: "fundamentals" });
  }
  for (const script of videoScripts) {
    upsertScript(script);
  }

  return [...bySlug.values()].sort((a, b) => a.title.localeCompare(b.title, "fr"));
}

export function filterVideoCatalog(
  entries: VideoCatalogEntry[],
  options: {
    query?: string;
    track?: VideoCatalogTrack | "all";
    availability?: VideoAvailabilityState | "all";
    playableOnly?: boolean;
  }
): VideoCatalogEntry[] {
  const q = options.query?.trim().toLowerCase() ?? "";
  return entries.filter((entry) => {
    if (options.playableOnly && !entry.canPlay) return false;
    if (options.track && options.track !== "all" && entry.track !== options.track) return false;
    if (
      options.availability &&
      options.availability !== "all" &&
      entry.availability !== options.availability
    ) {
      return false;
    }
    if (!q) return true;
    return entry.searchText.includes(q);
  });
}
