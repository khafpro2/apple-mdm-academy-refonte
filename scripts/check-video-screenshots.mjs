#!/usr/bin/env node
/**
 * Vérifie les captures vidéo dans public/video-assets/screenshots/
 * Usage: node scripts/check-video-screenshots.mjs
 */
import { readFileSync, existsSync, statSync, readdirSync } from "fs";
import { join, dirname, extname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const catalog = JSON.parse(readFileSync(join(ROOT, "data/video-screenshot-catalog.json"), "utf8"));
const dir = join(ROOT, catalog.screenshotsDir);

const allItems = catalog.categories.flatMap((c) =>
  c.items.map((item) => ({ ...item, category: c.label }))
);

let present = 0;
let missing = 0;
let invalid = 0;

console.log("\n📸 Vérification captures vidéo — Apple MDM Academy\n");
console.log(`Dossier : ${catalog.screenshotsDir}`);
console.log(`Attendu  : ${catalog.expectedWidth}×${catalog.expectedHeight} · .webp · max ${Math.round(catalog.maxSizeBytes / 1024)} KB\n`);

async function main() {
for (const item of allItems) {
  const filePath = join(dir, item.file);
  const ext = extname(item.file).toLowerCase();

  if (!existsSync(filePath)) {
    console.log(`⚠️  Manquant    ${item.file.padEnd(42)} ${item.label} (${item.category})`);
    missing++;
    continue;
  }

  const stat = statSync(filePath);
  const issues = [];

  if (!catalog.allowedExtensions.includes(ext)) {
    issues.push("format incorrect");
  }
  if (stat.size > catalog.maxSizeBytes) {
    issues.push(`trop lourd (${Math.round(stat.size / 1024)} KB)`);
  }

  try {
    const meta = await sharp(filePath).metadata();
    if (meta.width !== catalog.expectedWidth || meta.height !== catalog.expectedHeight) {
      issues.push(`dimensions ${meta.width}×${meta.height}`);
    }
  } catch {
    issues.push("fichier illisible");
  }

  if (issues.length) {
    console.log(`❌ Format incorrect ${item.file.padEnd(35)} — ${issues.join(", ")}`);
    invalid++;
  } else {
    console.log(`✅ Présent      ${item.file.padEnd(42)} ${item.label}`);
    present++;
  }
}

// Fichiers non catalogués
const catalogFiles = new Set(allItems.map((i) => i.file));
if (existsSync(dir)) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".") || name.endsWith(".md") || catalogFiles.has(name)) continue;
    console.log(`⚠️  Fichier non catalogué : ${name}`);
  }
}

console.log("\n── Résumé ──");
console.log(`✅ Présents     : ${present}/${allItems.length}`);
console.log(`⚠️  Manquants    : ${missing}/${allItems.length}`);
console.log(`❌ Incorrects   : ${invalid}`);
console.log(`📊 Complétion   : ${Math.round((present / allItems.length) * 100)}%\n`);

process.exit(invalid > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
