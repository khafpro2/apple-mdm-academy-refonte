import { jamfVideoPilot } from "@/lib/video/data/jamf-video-pilot";
import type { VideoProductionEntry } from "@/lib/video/production-types";

export const videoProductionEntries: VideoProductionEntry[] = [jamfVideoPilot];

export function getVideoProductionEntries(): VideoProductionEntry[] {
  return videoProductionEntries;
}

export function getVideoProductionEntryBySlug(slug: string): VideoProductionEntry | undefined {
  return videoProductionEntries.find((entry) => entry.slug === slug);
}

export function getVideoProductionEntryById(id: string): VideoProductionEntry | undefined {
  return videoProductionEntries.find((entry) => entry.id === id);
}
