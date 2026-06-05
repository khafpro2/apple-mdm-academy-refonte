#!/usr/bin/env node
/**
 * Génère les 90 captures pédagogiques (1920×1080 WebP) depuis generation-manifest.json
 * Usage: npm run generate:screenshots
 */
import { readFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";
import sharp from "sharp";
import { renderScreenshotHtml } from "./screenshots/render-html.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MANIFEST = join(ROOT, "public/images/courses/generation-manifest.json");
const WIDTH = 1920;
const HEIGHT = 1080;

async function main() {
  const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
  const shots = manifest.screenshots;

  console.log(`Génération de ${shots.length} captures (${WIDTH}×${HEIGHT})…`);

  const browser = await chromium.launch({ headless: true });

  let ok = 0;
  let fail = 0;

  for (const entry of shots) {
    const outDir = join(ROOT, "public/images/courses", entry.category);
    const outPath = join(outDir, entry.filename);

    mkdirSync(outDir, { recursive: true });

    try {
      const html = renderScreenshotHtml(entry);
      const page = await browser.newPage();
      await page.setViewportSize({ width: WIDTH, height: HEIGHT });
      await page.setContent(html, { waitUntil: "networkidle" });
      const png = await page.screenshot({ type: "png" });
      await page.close();

      await sharp(png).webp({ quality: 88 }).toFile(outPath);
      ok++;
      process.stdout.write(`✓ ${entry.id} ${entry.filename}\n`);
    } catch (err) {
      fail++;
      console.error(`✗ ${entry.id} ${entry.filename}:`, err.message);
    }
  }

  await browser.close();
  console.log(`\nTerminé: ${ok} OK, ${fail} erreurs → public/images/courses/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
