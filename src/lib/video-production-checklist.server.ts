import { existsSync, statSync } from "fs";
import { join } from "path";
import pilotManifest from "@/data/video-pilot-mp4.json";
import {
  buildVideoProductionRecord,
  getNextPipelineAction,
  getOfficialVideo,
  getProductionStatusLabel,
  OFFICIAL_MP4_FILENAMES,
} from "@/src/lib/video-production";
import { getMp4AvailabilityMap, getMp4UrlMap, resolveMp4Url } from "@/src/lib/video-production.server";
import { getValidScreenshotFiles, getScreenshotInventory } from "@/src/lib/video-screenshot-inventory.server";
import { getScreenshotsForVideo } from "@/src/lib/video-screenshots";

/** Ordre de production recommandé (8 vidéos pilotes) */
export const PILOT_PRODUCTION_ORDER = [
  "apple-business-manager",
  "abm-intune",
  "apns",
  "ade-iphone",
  "managed-apple-ids",
  "platform-sso",
  "filevault",
  "jamf-pro-fundamentals",
] as const;

export const PRODUCTION_CHECKLIST_LABELS = [
  "Captures enregistrées",
  "Captures converties en .webp",
  "Script HeyGen copié",
  "Narration HeyGen générée",
  "Montage Screen Studio / CapCut terminé",
  "Export MP4 1080p",
  "Fichier déposé dans /public/videos/",
  "Validation npm run check:mp4 OK",
  "Statut passé à published",
] as const;

export type ProductionChecklistStep = {
  label: string;
  done: boolean;
};

export type VideoProductionChecklistEntry = {
  order: number;
  slug: string;
  title: string;
  mp4Filename: string;
  mp4PublicPath: string;
  statusLabel: string;
  status: string;
  nextAction: string;
  capturesRequired: Array<{ file: string; label: string; present: boolean }>;
  capturesPresent: number;
  capturesTotal: number;
  checklistSteps: ProductionChecklistStep[];
  checklistDone: number;
  pipelinePercent: number;
};

export type VideoProductionChecklistReport = {
  videos: VideoProductionChecklistEntry[];
  mp4Present: number;
  mp4Total: number;
  capturesPresent: number;
  capturesTotal: number;
};

const ROOT = process.cwd();
const MIN_MP4_BYTES = pilotManifest.minSizeBytes ?? 1024 * 1024;

function mp4MeetsMinSize(slug: string): boolean {
  const url = resolveMp4Url(slug);
  if (!url) return false;
  const filePath = join(ROOT, "public", url.replace(/^\//, ""));
  if (!existsSync(filePath)) return false;
  return statSync(filePath).size >= MIN_MP4_BYTES;
}

export function getVideoProductionChecklistReport(): VideoProductionChecklistReport {
  const inventory = getScreenshotInventory();
  const validFiles = getValidScreenshotFiles(inventory);
  const mp4Map = getMp4AvailabilityMap();
  const mp4UrlMap = getMp4UrlMap();

  const manifestBySlug = Object.fromEntries(pilotManifest.videos.map((v) => [v.slug, v]));

  const videos: VideoProductionChecklistEntry[] = PILOT_PRODUCTION_ORDER.map((slug, index) => {
    const meta = getOfficialVideo(slug);
    const manifest = manifestBySlug[slug];
    const mp4Filename = manifest?.filename ?? OFFICIAL_MP4_FILENAMES[slug] ?? `${slug}.mp4`;
    const mp4PublicPath = `/videos/${mp4Filename}`;

    const record = meta
      ? buildVideoProductionRecord(meta, {
          presentScreenshotFiles: validFiles,
          mp4Available: Boolean(mp4Map[slug]),
          mp4Url: mp4UrlMap[slug],
        })
      : null;

    const requiredShots = getScreenshotsForVideo(slug);
    const capturesRequired = requiredShots.map((shot) => ({
      file: shot.file,
      label: shot.label,
      present: validFiles.has(shot.file),
    }));
    const capturesPresent = capturesRequired.filter((c) => c.present).length;
    const capturesTotal = capturesRequired.length;
    const allCapturesReady = capturesTotal > 0 && capturesPresent === capturesTotal;
    const someCapturesReady = capturesPresent > 0;
    const mp4Present = Boolean(mp4Map[slug]);
    const mp4Valid = mp4MeetsMinSize(slug);

    const checklistSteps: ProductionChecklistStep[] = [
      { label: PRODUCTION_CHECKLIST_LABELS[0], done: someCapturesReady },
      { label: PRODUCTION_CHECKLIST_LABELS[1], done: allCapturesReady },
      { label: PRODUCTION_CHECKLIST_LABELS[2], done: record?.score.script ?? false },
      { label: PRODUCTION_CHECKLIST_LABELS[3], done: record?.score.narration ?? false },
      { label: PRODUCTION_CHECKLIST_LABELS[4], done: record?.score.montage ?? false },
      { label: PRODUCTION_CHECKLIST_LABELS[5], done: mp4Valid },
      { label: PRODUCTION_CHECKLIST_LABELS[6], done: mp4Present },
      { label: PRODUCTION_CHECKLIST_LABELS[7], done: record?.canPublish ?? false },
      { label: PRODUCTION_CHECKLIST_LABELS[8], done: record?.status === "published" },
    ];

    const nextAction = record
      ? getNextPipelineAction(record, { presentScreenshotFiles: validFiles })
      : "Configurer la vidéo pilote dans le manifest";

    return {
      order: index + 1,
      slug,
      title: manifest?.title ?? meta?.title ?? slug,
      mp4Filename,
      mp4PublicPath,
      statusLabel: record ? getProductionStatusLabel(record.status) : "Non configurée",
      status: record?.status ?? "draft",
      nextAction,
      capturesRequired,
      capturesPresent,
      capturesTotal,
      checklistSteps,
      checklistDone: checklistSteps.filter((s) => s.done).length,
      pipelinePercent: record?.pipelinePercent ?? 0,
    };
  });

  const mp4Present = videos.filter((v) => v.checklistSteps[6]?.done).length;
  const capturesPresent = new Set(
    videos.flatMap((v) => v.capturesRequired.filter((c) => c.present).map((c) => c.file))
  ).size;
  const capturesTotal = new Set(videos.flatMap((v) => v.capturesRequired.map((c) => c.file))).size;

  return {
    videos,
    mp4Present,
    mp4Total: videos.length,
    capturesPresent,
    capturesTotal,
  };
}
