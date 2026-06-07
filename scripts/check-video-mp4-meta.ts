#!/usr/bin/env npx tsx
/**
 * Métadonnées LMS pour validation MP4 pilotes (stdout JSON)
 */
import { getAllVideoLibraryRecords } from "../src/lib/video-production";
import { getVideoTranscript } from "../src/lib/video-transcripts";
import { resolveMp4Url } from "../src/lib/video-production.server";
import { getScreenshotInventory, getValidScreenshotFiles } from "../src/lib/video-screenshot-inventory.server";

const inventory = getScreenshotInventory();
const validFiles = getValidScreenshotFiles(inventory);
const initialRecords = getAllVideoLibraryRecords();
const mp4UrlBySlug = Object.fromEntries(
  initialRecords.map((record) => [record.slug, resolveMp4Url(record.slug)])
);
const mp4AvailableBySlug = Object.fromEntries(
  Object.entries(mp4UrlBySlug).map(([slug, mp4Url]) => [slug, Boolean(mp4Url)])
);
const records = getAllVideoLibraryRecords({
  presentScreenshotFiles: validFiles,
  mp4AvailableBySlug,
  mp4UrlBySlug: Object.fromEntries(
    Object.entries(mp4UrlBySlug).filter((entry): entry is [string, string] => Boolean(entry[1]))
  ),
});
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

for (const record of records) {
  const mp4Url = mp4UrlBySlug[record.slug] ?? null;
  const transcript = getVideoTranscript(record.slug);
  out[record.slug] = {
    status: record.status,
    canPublish: record.canPublish,
    hasTranscript: Boolean(transcript?.fullText?.length),
    videoUrl: mp4Url ?? null,
    resourceSlug: record.resourceSlug ?? null,
    courseSlug: record.courseSlug ?? null,
    labSlug: record.labSlug ?? null,
  };
}

console.log(JSON.stringify(out));
