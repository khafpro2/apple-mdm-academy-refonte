import { existsSync } from "fs";
import { join } from "path";
import {
  getMp4Candidates,
  OFFICIAL_LMS_VIDEOS,
  type VideoProductionRecord,
} from "@/src/lib/video-production";
import { getIllustratedVideoLessons } from "@/src/lib/video-storyboards";

const ROOT = process.cwd();

export function mp4FileExists(publicPath: string): boolean {
  return existsSync(join(ROOT, "public", publicPath.replace(/^\//, "")));
}

export function resolveMp4Url(slug: string): string | undefined {
  for (const candidate of getMp4Candidates(slug)) {
    if (mp4FileExists(candidate)) return candidate;
  }
  return undefined;
}

export function getMp4AvailabilityMap(): Record<string, boolean> {
  const slugs = [
    ...OFFICIAL_LMS_VIDEOS.map((v) => v.slug),
    ...getIllustratedVideoLessons().map((s) => s.slug),
  ];
  const map: Record<string, boolean> = {};
  for (const slug of slugs) {
    map[slug] = Boolean(resolveMp4Url(slug));
  }
  return map;
}

export function enrichRecordsWithMp4(records: VideoProductionRecord[]): VideoProductionRecord[] {
  return records.map((r) => {
    const mp4 = resolveMp4Url(r.slug);
    if (!mp4) return r;
    return {
      ...r,
      status: "published" as const,
      flags: { ...r.flags, published: true },
      pipelinePercent: 100,
    };
  });
}
