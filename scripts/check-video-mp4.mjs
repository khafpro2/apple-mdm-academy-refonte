#!/usr/bin/env node
/**
 * Vérifie les MP4 pilotes dans public/videos/
 * Usage: node scripts/check-video-mp4.mjs
 */
import { readFileSync, existsSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const manifest = JSON.parse(readFileSync(join(ROOT, "data/video-pilot-mp4.json"), "utf8"));
const videosDir = join(ROOT, "public/videos");
const catalog = JSON.parse(readFileSync(join(ROOT, "data/video-screenshot-catalog.json"), "utf8"));

const MIN_BYTES = manifest.minSizeBytes ?? 1024 * 1024;

/** Charge métadonnées LMS via tsx (transcript, statut, videoUrl) */
function loadProductionMeta() {
  const metaScript = join(__dirname, "check-video-mp4-meta.ts");
  const result = spawnSync("npx", ["--yes", "tsx", metaScript], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.status !== 0) {
    console.warn("⚠️  Impossible de charger les métadonnées LMS (tsx)");
    if (result.stderr) console.warn(result.stderr.trim());
    return {};
  }

  try {
    const line = result.stdout.trim().split("\n").pop() ?? "{}";
    return JSON.parse(line);
  } catch {
    return {};
  }
}

const productionMeta = loadProductionMeta();

let ready = 0;
let incomplete = 0;
let missing = 0;

console.log("\n🎬 Vérification MP4 pilotes — Apple MDM Academy\n");
console.log("Dossier : public/videos/");
console.log(`Taille min : ${Math.round(MIN_BYTES / 1024 / 1024)} MB · ${manifest.videos.length} vidéos pilotes\n`);

for (const video of manifest.videos) {
  const filePath = join(videosDir, video.filename);
  const publicPath = `/videos/${video.filename}`;
  const meta = productionMeta[video.slug] ?? {};
  const issues = [];

  const expectedName = video.filename;
  if (video.filename !== expectedName) {
    issues.push("nom non conforme");
  }

  if (!video.courseSlug) issues.push("courseSlug manquant");
  if (!video.labSlug) issues.push("labSlug manquant");
  if (!video.resourceSlug) issues.push("resourceSlug manquant");
  if (!meta.hasTranscript) issues.push("transcript manquant");
  if (!meta.videoUrl && !existsSync(filePath)) issues.push("videoUrl absent");

  if (meta.status === "published" && !meta.canPublish) {
    issues.push("status published incohérent (bloquants)");
  }

  const requiredCaptureIds = catalog.videoScreenshotMap[video.slug] ?? [];
  const allItems = catalog.categories.flatMap((c) => c.items);
  const capturesDir = join(ROOT, catalog.screenshotsDir);
  let capturesPresent = 0;
  for (const id of requiredCaptureIds) {
    const item = allItems.find((i) => i.id === id);
    if (item && existsSync(join(capturesDir, item.file))) capturesPresent++;
  }
  if (requiredCaptureIds.length > 0 && capturesPresent < requiredCaptureIds.length) {
    issues.push(`captures ${capturesPresent}/${requiredCaptureIds.length}`);
  }

  if (!existsSync(filePath)) {
    console.log(`❌ Manquant          ${video.filename.padEnd(42)} ${video.title}`);
    if (issues.length) console.log(`   └─ ${issues.join(", ")}`);
    missing++;
    continue;
  }

  const stat = statSync(filePath);
  if (stat.size < MIN_BYTES) {
    issues.push(`taille ${Math.round(stat.size / 1024)} KB (< 1 MB)`);
  }

  const sizeMb = (stat.size / 1024 / 1024).toFixed(1);
  const statusLabel = meta.status ? ` · ${meta.status}` : "";

  if (issues.length === 0) {
    console.log(`✅ Prêt             ${video.filename.padEnd(42)} ${sizeMb} MB · ${publicPath}${statusLabel}`);
    ready++;
  } else if (stat.size >= MIN_BYTES) {
    console.log(`⚠️  Incomplet        ${video.filename.padEnd(42)} ${sizeMb} MB — ${issues.join(", ")}`);
    incomplete++;
  } else {
    console.log(`❌ Manquant         ${video.filename.padEnd(42)} — ${issues.join(", ")}`);
    missing++;
  }
}

console.log("\n── Résumé ──");
console.log(`✅ Prêt       : ${ready}/${manifest.videos.length}`);
console.log(`⚠️  Incomplet  : ${incomplete}/${manifest.videos.length}`);
console.log(`❌ Manquant   : ${missing}/${manifest.videos.length}`);
console.log(`📊 Publiable  : ${ready}/${manifest.videos.length}\n`);

process.exit(missing === manifest.videos.length ? 0 : 0);
