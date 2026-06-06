#!/usr/bin/env node
/**
 * Convertit PNG/JPG/JPEG depuis screenshots/raw/ vers .webp 1920×1080
 * Usage: node scripts/convert-screenshots-to-webp.mjs
 */
import { existsSync, mkdirSync, readdirSync, statSync } from "fs";
import { join, dirname, parse, basename } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const RAW_DIR = join(ROOT, "public/video-assets/screenshots/raw");
const OUT_DIR = join(ROOT, "public/video-assets/screenshots");

const WIDTH = 1920;
const HEIGHT = 1080;
const QUALITY = 85;
const INPUT_EXT = new Set([".png", ".jpg", ".jpeg"]);

mkdirSync(RAW_DIR, { recursive: true });
mkdirSync(OUT_DIR, { recursive: true });

const files = readdirSync(RAW_DIR).filter((f) => INPUT_EXT.has(parse(f).ext.toLowerCase()));

if (files.length === 0) {
  console.log("\n📁 Aucun fichier dans public/video-assets/screenshots/raw/");
  console.log("   Déposez des .png, .jpg ou .jpeg puis relancez ce script.\n");
  process.exit(0);
}

async function main() {
  console.log(`\n🔄 Conversion → .webp (${WIDTH}×${HEIGHT}, qualité ${QUALITY})\n`);

  let converted = 0;
  let failed = 0;

  for (const file of files) {
    const input = join(RAW_DIR, file);
    const base = basename(file, parse(file).ext);
    const output = join(OUT_DIR, `${base}.webp`);

    try {
      await sharp(input)
        .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre" })
        .webp({ quality: QUALITY })
        .toFile(output);

      const sizeKb = Math.round(statSync(output).size / 1024);
      console.log(`✅ ${file} → ${base}.webp (${sizeKb} KB)`);
      converted++;
    } catch (err) {
      console.log(`❌ ${file} — ${err instanceof Error ? err.message : err}`);
      failed++;
    }
  }

  console.log("\n── Résumé ──");
  console.log(`✅ Convertis : ${converted}`);
  console.log(`❌ Échecs    : ${failed}`);
  console.log("\nValider : node scripts/check-video-screenshots.mjs\n");

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
