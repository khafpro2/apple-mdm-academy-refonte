#!/usr/bin/env node
/**
 * Copie les visuels officiels Jamf vers public/images/courses/jamf/ et exams/
 * pour servir les fichiers au même chemin que la bibliothèque pédagogique.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const originalsDir = path.join(root, "public/images/courses/jamf-originals");
const jamfDir = path.join(root, "public/images/courses/jamf");
const examsDir = path.join(root, "public/images/courses/exams");

/** id → { targetCategory, targetFilename } */
const SYNC_MAP = {
  "64": { dir: jamfDir, file: "64-dashboard-jamf.webp", source: "64-dashboard-jamf-official.webp" },
  "65": { dir: jamfDir, file: "65-computers.webp", source: "jamf-pro-screenshot-official.png" },
  "66": { dir: jamfDir, file: "66-mobile-devices.webp", source: "66-mobile-devices-official.webp" },
  "67": { dir: jamfDir, file: "67-smart-groups.webp", source: "jamf-pro-screenshot-official.png" },
  "68": { dir: jamfDir, file: "68-static-groups.webp", source: "jamf-pro-screenshot-official.png" },
  "69": { dir: jamfDir, file: "69-policies.webp", source: "69-policies-blueprints-official.webp" },
  "70": { dir: jamfDir, file: "70-configuration-profiles.webp", source: "jamf-pro-screenshot-official.png" },
  "71": { dir: jamfDir, file: "71-packages.webp", source: "jamf-pro-screenshot-official.png" },
  "72": { dir: jamfDir, file: "72-scripts.webp", source: "jamf-pro-ai-assistant-official.webp" },
  "73": { dir: jamfDir, file: "73-patch-management.webp", source: "jamf-pro-screenshot-official.png" },
  "74": { dir: jamfDir, file: "74-inventory.webp", source: "74-inventory-official.webp" },
  "75": { dir: jamfDir, file: "75-enrollment.webp", source: "jamf-pro-screenshot-official.png" },
  "76": { dir: jamfDir, file: "76-prestage-enrollment.webp", source: "jamf-pro-screenshot-official.png" },
  "77": { dir: jamfDir, file: "77-self-service.webp", source: "jamf-pro-screenshot-official.png" },
  "78": { dir: jamfDir, file: "78-jamf-protect.webp", source: "jamf-pro-ai-assistant-official.webp" },
  "89": { dir: examsDir, file: "89-simulation-jamf-100.webp", source: "jamf-pro-screenshot-official.png" },
  "90": { dir: examsDir, file: "90-simulation-jamf-200.webp", source: "jamf-pro-screenshot-official.png" },
};

async function syncOne(targetDir, targetFile, sourceFile) {
  const srcPath = path.join(originalsDir, sourceFile);
  const destPath = path.join(targetDir, targetFile);

  if (!fs.existsSync(srcPath)) {
    console.warn(`⚠ Source manquante: ${sourceFile}`);
    return;
  }

  if (sourceFile.endsWith(".webp")) {
    await fs.promises.copyFile(srcPath, destPath);
  } else {
    await sharp(srcPath).webp({ quality: 92 }).toFile(destPath);
  }
  console.log(`✓ ${targetFile} ← ${sourceFile}`);
}

async function main() {
  for (const entry of Object.values(SYNC_MAP)) {
    await syncOne(entry.dir, entry.file, entry.source);
  }
  console.log("\nSync terminé — visuels officiels Jamf appliqués.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
