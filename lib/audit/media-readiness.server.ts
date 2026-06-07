import { readFileSync } from "fs";
import { join } from "path";
import { getVideoScript } from "@/src/lib/video-scripts";
import { getVideoTranscript } from "@/src/lib/video-transcripts";
import { getScreenshotsForVideo } from "@/src/lib/video-screenshots";
import { getAllVideoLibraryRecords } from "@/src/lib/video-production";
import { getMp4AvailabilityMap, getMp4UrlMap } from "@/src/lib/video-production.server";
import { getValidScreenshotFiles, getScreenshotInventory } from "@/src/lib/video-screenshot-inventory.server";
import { resolveVideoPublishStatus } from "@/src/lib/video-publish-status";

export type MediaEcosystem = "jamf" | "intune" | "apple";

export type MediaReadinessRow = {
  slug: string;
  title: string;
  ecosystem: MediaEcosystem;
  storyboardReady: boolean;
  transcriptReady: boolean;
  heygenScriptReady: boolean;
  capturesReady: boolean;
  capturesPresent: number;
  capturesTotal: number;
  mp4Present: boolean;
  published: boolean;
  inPilotManifest: boolean;
  blockers: string[];
};

export type MediaEcosystemSummary = {
  label: string;
  total: number;
  storyboardReady: number;
  transcriptReady: number;
  heygenScriptReady: number;
  capturesReady: number;
  mp4Present: number;
  published: number;
  rows: MediaReadinessRow[];
};

export type MediaReadinessReport = {
  generatedAt: string;
  lmsFrozen: true;
  ecosystems: Record<MediaEcosystem, MediaEcosystemSummary>;
  globalBlockers: string[];
  pilotManifestCount: number;
  catalogCaptureCount: number;
};

const ECOSYSTEM_LABELS: Record<MediaEcosystem, string> = {
  jamf: "Jamf",
  intune: "Intune",
  apple: "Apple",
};

const INTUNE_COURSE_SLUGS = new Set(["intune-mac"]);
const INTUNE_SLUG_HINTS = [
  "intune",
  "abm-intune",
  "ade-",
  "apns",
  "platform-sso",
  "defender-macos",
  "conditional-access",
  "enrollment-program",
  "ios-ipados",
  "macos-profiles",
  "automated-device",
];

const APPLE_COURSE_HINTS = ["apple-it-professional", "apple-fundamentals", "apple-platform"];
const APPLE_SLUG_HINTS = [
  "apple-business-manager",
  "managed-apple-ids",
  "filevault",
  "gatekeeper",
  "apps-books",
  "bienvenue-apple",
];

const ROOT = process.cwd();

function loadPilotManifestSlugs(): Set<string> {
  const raw = readFileSync(join(ROOT, "data/video-pilot-mp4.json"), "utf8");
  const manifest = JSON.parse(raw) as { videos: Array<{ slug: string }> };
  return new Set(manifest.videos.map((v) => v.slug));
}

function loadCatalogCaptureCount(): number {
  const raw = readFileSync(join(ROOT, "data/video-screenshot-catalog.json"), "utf8");
  const catalog = JSON.parse(raw) as {
    categories: Array<{ items: unknown[] }>;
  };
  return catalog.categories.reduce((acc, c) => acc + c.items.length, 0);
}

export function classifyMediaEcosystem(slug: string, courseSlug: string): MediaEcosystem | null {
  const s = slug.toLowerCase();
  const course = courseSlug.toLowerCase();

  if (s.includes("jamf") || course.includes("jamf")) return "jamf";

  if (
    INTUNE_COURSE_SLUGS.has(courseSlug) ||
    INTUNE_SLUG_HINTS.some((hint) => s.includes(hint) || s.startsWith(hint))
  ) {
    return "intune";
  }

  if (
    APPLE_COURSE_HINTS.some((hint) => course.includes(hint)) ||
    APPLE_SLUG_HINTS.some((hint) => s.includes(hint))
  ) {
    return "apple";
  }

  return null;
}

function emptySummary(label: string): MediaEcosystemSummary {
  return {
    label,
    total: 0,
    storyboardReady: 0,
    transcriptReady: 0,
    heygenScriptReady: 0,
    capturesReady: 0,
    mp4Present: 0,
    published: 0,
    rows: [],
  };
}

function buildRowBlockers(row: Omit<MediaReadinessRow, "blockers">): string[] {
  const blockers: string[] = [];
  if (!row.storyboardReady) blockers.push("Storyboard incomplet");
  if (!row.transcriptReady) blockers.push("Transcript absent");
  if (!row.heygenScriptReady) blockers.push("Script HeyGen absent");
  if (!row.capturesReady) blockers.push("Captures manquantes");
  if (!row.mp4Present) blockers.push("MP4 absent");
  if (!row.published) blockers.push("Non publié");
  return blockers;
}

export function runMediaReadinessAudit(): MediaReadinessReport {
  const inventory = getScreenshotInventory();
  const validFiles = getValidScreenshotFiles(inventory);
  const mp4Map = getMp4AvailabilityMap();
  const mp4UrlMap = getMp4UrlMap();
  const pilotSlugs = loadPilotManifestSlugs();

  const records = getAllVideoLibraryRecords({
    presentScreenshotFiles: validFiles,
    mp4AvailableBySlug: mp4Map,
    mp4UrlBySlug: mp4UrlMap,
  });

  const ecosystems: Record<MediaEcosystem, MediaEcosystemSummary> = {
    jamf: emptySummary(ECOSYSTEM_LABELS.jamf),
    intune: emptySummary(ECOSYSTEM_LABELS.intune),
    apple: emptySummary(ECOSYSTEM_LABELS.apple),
  };

  for (const record of records) {
    const ecosystem = classifyMediaEcosystem(record.slug, record.courseSlug);
    if (!ecosystem) continue;

    const heygen = getVideoScript(record.slug);
    const heygenScriptReady = Boolean(heygen?.script && heygen.script.trim().length > 200);
    const transcript = getVideoTranscript(record.slug);
    const transcriptReady = Boolean(transcript && transcript.wordCount >= 100);

    const requiredShots = getScreenshotsForVideo(record.slug);
    const capturesPresent = requiredShots.filter((s) => validFiles.has(s.file)).length;
    const capturesTotal = requiredShots.length;
    const capturesReady =
      capturesTotal > 0 ? capturesPresent === capturesTotal : record.score.captures;

    const publishMeta = resolveVideoPublishStatus(record.slug, {
      presentScreenshotFiles: validFiles,
      validScreenshotFiles: validFiles,
    });
    const published =
      record.status === "published" ||
      record.flags.published ||
      publishMeta.status === "published";

    const base = {
      slug: record.slug,
      title: record.title,
      ecosystem,
      storyboardReady: record.hasStoryboard,
      transcriptReady: transcriptReady || record.hasTranscript,
      heygenScriptReady: heygenScriptReady || record.score.script,
      capturesReady,
      capturesPresent,
      capturesTotal,
      mp4Present: Boolean(mp4Map[record.slug]),
      published,
      inPilotManifest: pilotSlugs.has(record.slug),
    };

    const row: MediaReadinessRow = {
      ...base,
      blockers: buildRowBlockers(base),
    };

    const summary = ecosystems[ecosystem];
    summary.rows.push(row);
    summary.total += 1;
    if (row.storyboardReady) summary.storyboardReady += 1;
    if (row.transcriptReady) summary.transcriptReady += 1;
    if (row.heygenScriptReady) summary.heygenScriptReady += 1;
    if (row.capturesReady) summary.capturesReady += 1;
    if (row.mp4Present) summary.mp4Present += 1;
    if (row.published) summary.published += 1;
  }

  for (const key of Object.keys(ecosystems) as MediaEcosystem[]) {
    ecosystems[key].rows.sort((a, b) => a.title.localeCompare(b.title, "fr"));
  }

  const globalBlockers: string[] = [];
  const allRows = Object.values(ecosystems).flatMap((e) => e.rows);

  const missingMp4 = allRows.filter((r) => !r.mp4Present);
  if (missingMp4.length) {
    globalBlockers.push(`${missingMp4.length} vidéo(s) sans MP4 dans /public/videos/`);
  }

  const missingCaptures = allRows.filter((r) => !r.capturesReady && r.capturesTotal > 0);
  if (missingCaptures.length) {
    globalBlockers.push(
      `${missingCaptures.length} vidéo(s) avec captures incomplètes (catalogue video-screenshot-catalog.json)`
    );
  }

  const missingScripts = allRows.filter((r) => !r.heygenScriptReady);
  if (missingScripts.length) {
    globalBlockers.push(`${missingScripts.length} vidéo(s) sans script HeyGen finalisé`);
  }

  const notPublished = allRows.filter((r) => !r.published);
  if (notPublished.length) {
    globalBlockers.push(`${notPublished.length} vidéo(s) non publiées dans le LMS`);
  }

  if (globalBlockers.length === 0) {
    globalBlockers.push("Aucun bloquant technique — production média terminée");
  }

  return {
    generatedAt: new Date().toISOString(),
    lmsFrozen: true,
    ecosystems,
    globalBlockers,
    pilotManifestCount: pilotSlugs.size,
    catalogCaptureCount: loadCatalogCaptureCount(),
  };
}
