#!/usr/bin/env node
/**
 * Vérifie les captures vidéo dans public/video-assets/screenshots/
 * Usage: node scripts/check-video-screenshots.mjs
 */
import { readFileSync, existsSync, statSync, readdirSync } from "fs";
import { join, dirname, extname, basename } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const catalog = JSON.parse(readFileSync(join(ROOT, "data/video-screenshot-catalog.json"), "utf8"));
const dir = join(ROOT, catalog.screenshotsDir);

const allItems = catalog.categories.flatMap((c) =>
  c.items.map((item) => ({ ...item, category: c.label }))
);

const catalogFiles = new Set(allItems.map((i) => i.file));
const MIN_BYTES = 500;

let ok = 0;
let missing = 0;
let invalid = 0;

console.log("\n📸 Vérification captures vidéo — Apple MDM Academy\n");
console.log(`Dossier : ${catalog.screenshotsDir}`);
console.log(
  `Attendu  : ${catalog.expectedWidth}×${catalog.expectedHeight} · .webp · max ${Math.round(catalog.maxSizeBytes / 1024)} KB\n`
);

async function validateItem(item) {
  const filePath = join(dir, item.file);
  const ext = extname(item.file).toLowerCase();

  if (!existsSync(filePath)) {
    console.log(`⚠️  Manquant         ${item.file.padEnd(40)} ${item.label}`);
    missing++;
    return;
  }

  const stat = statSync(filePath);
  const issues = [];

  if (basename(filePath) !== item.file) {
    issues.push("nom non conforme");
  }
  if (!catalog.allowedExtensions.includes(ext)) {
    issues.push("extension incorrecte");
  }
  if (stat.size < MIN_BYTES) {
    issues.push("image vide ou corrompue");
  }
  if (stat.size > catalog.maxSizeBytes) {
    issues.push(`poids ${Math.round(stat.size / 1024)} KB (> ${Math.round(catalog.maxSizeBytes / 1024)} KB)`);
  }

  try {
    const meta = await sharp(filePath).metadata();
    if (!meta.width || !meta.height) {
      issues.push("métadonnées invalides");
    } else if (meta.width !== catalog.expectedWidth || meta.height !== catalog.expectedHeight) {
      issues.push(`dimensions ${meta.width}×${meta.height}`);
    }
  } catch {
    issues.push("fichier illisible");
  }

  if (issues.length) {
    console.log(`❌ Format incorrect ${item.file.padEnd(35)} — ${issues.join(", ")}`);
    invalid++;
  } else {
    const sizeKb = Math.round(stat.size / 1024);
    const warn = stat.size > catalog.maxSizeBytes * 0.9 ? " (proche limite)" : "";
    console.log(`✅ OK             ${item.file.padEnd(40)} ${sizeKb} KB${warn}`);
    ok++;
  }
}

async function main() {
  for (const item of allItems) {
    await validateItem(item);
  }

  if (existsSync(dir)) {
    for (const name of readdirSync(dir)) {
      if (name.startsWith(".") || name.endsWith(".md") || name === "raw" || catalogFiles.has(name)) continue;
      if (statSync(join(dir, name)).isDirectory()) continue;
      console.log(`⚠️  Fichier non catalogué : ${name}`);
    }
  }

  const rawDir = join(dir, "raw");
  if (existsSync(rawDir)) {
    const rawCount = readdirSync(rawDir).filter((f) => !f.startsWith(".")).length;
    if (rawCount > 0) {
      console.log(`\n💡 ${rawCount} fichier(s) dans raw/ — lancer : node scripts/convert-screenshots-to-webp.mjs`);
    }
  }

  console.log("\n── Résumé ──");
  console.log(`✅ OK           : ${ok}/${allItems.length}`);
  console.log(`⚠️  Manquants    : ${missing}/${allItems.length}`);
  console.log(`❌ Incorrects   : ${invalid}`);
  console.log(`📊 Complétion   : ${Math.round((ok / allItems.length) * 100)}%\n`);

  process.exit(invalid > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
