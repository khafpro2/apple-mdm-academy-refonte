#!/usr/bin/env npx tsx
/**
 * Métadonnées LMS pour validation MP4 pilotes (stdout JSON)
 */
import { buildVideoProductionRecord, OFFICIAL_LMS_VIDEOS } from "../src/lib/video-production";
import manifest from "../data/video-pilot-mp4.json";
import { getVideoTranscript } from "../src/lib/video-transcripts";
import { resolveMp4Url } from "../src/lib/video-production.server";
import { getScreenshotInventoryAsync, getValidScreenshotFiles } from "../src/lib/video-screenshot-inventory.server";
import { getVideoStoryboard } from "../src/lib/video-storyboards";
import type { OfficialVideoMeta } from "../src/lib/video-production";

async function main() {
  const inventory = await getScreenshotInventoryAsync();
  const validFiles = getValidScreenshotFiles(inventory);
  const officialBySlug = new Map(OFFICIAL_LMS_VIDEOS.map((video) => [video.slug, video]));
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

  for (const video of manifest.videos) {
    const storyboard = getVideoStoryboard(video.slug);
    const official = officialBySlug.get(video.slug);
    const meta: OfficialVideoMeta = {
      ...(official ?? {
        slug: video.slug,
        title: video.title,
        mp4Alias: video.slug,
        module: storyboard?.module ?? video.title,
        quizSlug: storyboard?.quizSlug ?? "",
        certificationSlug: storyboard?.courseSlug ?? video.courseSlug,
        certificationLabel: storyboard?.courseSlug ?? video.courseSlug,
        priority: 99,
      }),
      slug: video.slug,
      title: video.title,
      courseSlug: video.courseSlug,
      labSlug: video.labSlug,
      resourceSlug: video.resourceSlug,
    };
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
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
