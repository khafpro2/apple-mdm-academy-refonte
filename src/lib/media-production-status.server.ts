import { readFileSync } from "fs";
import { join } from "path";
import { getMp4AvailabilityMap } from "@/src/lib/video-production.server";
import { getValidScreenshotFiles, getScreenshotInventory } from "@/src/lib/video-screenshot-inventory.server";

export const MEDIA_REQUIRED_MESSAGE =
  "Le LMS est prêt. Il reste uniquement à produire les médias réels : captures Screen Studio et vidéos MP4.";

export type PilotMp4Entry = {
  slug: string;
  filename: string;
  title: string;
  courseSlug: string;
  labSlug: string;
  resourceSlug: string;
};

export type ExpectedCaptureEntry = {
  id: string;
  file: string;
  label: string;
  category: string;
};

export type MediaProductionStatus = {
  mediaRequired: boolean;
  mp4Present: number;
  mp4Total: number;
  capturesPresent: number;
  capturesTotal: number;
  pilotMp4: Array<PilotMp4Entry & { present: boolean; publicPath: string }>;
  expectedCaptures: Array<ExpectedCaptureEntry & { present: boolean; publicPath: string }>;
};

const ROOT = process.cwd();

function loadPilotManifest(): PilotMp4Entry[] {
  const raw = readFileSync(join(ROOT, "data/video-pilot-mp4.json"), "utf8");
  const manifest = JSON.parse(raw) as { videos: PilotMp4Entry[] };
  return manifest.videos;
}

function loadExpectedCaptures(): ExpectedCaptureEntry[] {
  const raw = readFileSync(join(ROOT, "data/video-screenshot-catalog.json"), "utf8");
  const catalog = JSON.parse(raw) as {
    categories: Array<{ id: string; label: string; items: Array<{ id: string; file: string; label: string }> }>;
  };
  return catalog.categories.flatMap((c) =>
    c.items.map((item) => ({
      id: item.id,
      file: item.file,
      label: item.label,
      category: c.label,
    }))
  );
}

export function getMediaProductionStatus(): MediaProductionStatus {
  const inventory = getScreenshotInventory();
  const validFiles = getValidScreenshotFiles(inventory);
  const mp4Map = getMp4AvailabilityMap();

  const pilotManifest = loadPilotManifest();
  const pilotMp4 = pilotManifest.map((video) => {
    const publicPath = `/videos/${video.filename}`;
    const present = Boolean(mp4Map[video.slug]);
    return { ...video, present, publicPath };
  });

  const mp4Present = pilotMp4.filter((v) => v.present).length;
  const mp4Total = pilotMp4.length;

  const expectedCaptures = loadExpectedCaptures().map((capture) => ({
    ...capture,
    present: validFiles.has(capture.file),
    publicPath: `/video-assets/screenshots/${capture.file}`,
  }));

  const capturesPresent = expectedCaptures.filter((c) => c.present).length;
  const capturesTotal = expectedCaptures.length;

  const mediaRequired = mp4Present === 0 && capturesPresent === 0;

  return {
    mediaRequired,
    mp4Present,
    mp4Total,
    capturesPresent,
    capturesTotal,
    pilotMp4,
    expectedCaptures,
  };
}
