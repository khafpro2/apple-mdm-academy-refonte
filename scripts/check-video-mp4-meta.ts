#!/usr/bin/env npx tsx
/**
 * Métadonnées LMS pour validation MP4 pilotes (stdout JSON)
 */
import { buildVideoProductionRecord, OFFICIAL_LMS_VIDEOS } from "../src/lib/video-production";
import { getVideoTranscript } from "../src/lib/video-transcripts";
import { resolveMp4Url } from "../src/lib/video-production.server";
import { getScreenshotInventory, getValidScreenshotFiles } from "../src/lib/video-screenshot-inventory.server";

const inventory = getScreenshotInventory();
const validFiles = getValidScreenshotFiles(inventory);
const out: Record<
  string,
  {
    status: string;
    canPublish: boolean;
    hasTranscript: boolean;
    videoUrl: string | null;
    resourceSlug: string | null;
    courseSlug: string | null;
    labSlug: string | null;
  }
> = {};

for (const meta of OFFICIAL_LMS_VIDEOS) {
  const mp4Url = resolveMp4Url(meta.slug);
  const record = buildVideoProductionRecord(meta, {
    presentScreenshotFiles: validFiles,
    mp4Available: Boolean(mp4Url),
    mp4Url,
  });
  const transcript = getVideoTranscript(meta.slug);
  out[meta.slug] = {
    status: record.status,
    canPublish: record.canPublish,
    hasTranscript: Boolean(transcript?.fullText?.length),
    videoUrl: mp4Url ?? null,
    resourceSlug: meta.resourceSlug ?? null,
    courseSlug: meta.courseSlug ?? null,
    labSlug: meta.labSlug ?? null,
  };
}

console.log(JSON.stringify(out));
