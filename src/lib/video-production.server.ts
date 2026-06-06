import { existsSync } from "fs";
import { join } from "path";
import {
  getMp4Candidates,
  OFFICIAL_LMS_VIDEOS,
  type VideoProductionRecord,
  canPublishVideo,
  buildVideoProductionRecord,
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

export function getMp4UrlMap(): Record<string, string | undefined> {
  const slugs = [
    ...OFFICIAL_LMS_VIDEOS.map((v) => v.slug),
    ...getIllustratedVideoLessons().map((s) => s.slug),
  ];
  const map: Record<string, string | undefined> = {};
  for (const slug of slugs) {
    map[slug] = resolveMp4Url(slug);
  }
  return map;
}

/** Résout le statut published uniquement si tous les critères LMS sont remplis */
export function resolvePublishableMp4Url(slug: string): string | undefined {
  const mp4Url = resolveMp4Url(slug);
  if (!mp4Url) return undefined;

  const meta = OFFICIAL_LMS_VIDEOS.find((v) => v.slug === slug);
  if (!meta) return mp4Url;

  const record = buildVideoProductionRecord(meta, { mp4Available: true, mp4Url });
  const publish = canPublishVideo(record, { mp4Available: true, videoUrl: mp4Url });
  return publish.ok ? mp4Url : undefined;
}

export function enrichRecordsWithMp4(records: VideoProductionRecord[]): VideoProductionRecord[] {
  return records.map((r) => {
    const mp4Url = resolveMp4Url(r.slug);
    if (!mp4Url) return r;
    const publish = canPublishVideo(r, { mp4Available: true, videoUrl: mp4Url });
    if (!publish.ok) {
      return {
        ...r,
        publishBlockers: publish.blockers,
        canPublish: false,
      };
    }
    return {
      ...r,
      status: "published" as const,
      flags: { ...r.flags, published: true },
      pipelinePercent: 100,
      score: { ...r.score, mp4: true },
      canPublish: true,
      publishBlockers: [],
    };
  });
}
