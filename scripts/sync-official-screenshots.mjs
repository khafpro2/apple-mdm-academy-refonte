#!/usr/bin/env node
/**
 * Copie les visuels officiels (Apple, Microsoft Intune, Jamf)
 * vers les dossiers de cours correspondants.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const coursesDir = path.join(root, "public/images/courses");

/** id → { categoryDir, targetFile, originalsFolder, sourceFile } */
const SYNC_MAP = {
  // Apple
  "08": {
    dir: path.join(coursesDir, "apple-business-manager"),
    file: "08-apps-and-books.webp",
    folder: "apple-originals",
    source: "apple-business-devices-apps-books-official.png",
  },
  "11": {
    dir: path.join(coursesDir, "apple-business-manager"),
    file: "11-federation-entra-id.webp",
    folder: "apple-originals",
    source: "apple-business-federated-authentication-official.png",
  },
  // Intune
  "29": {
    dir: path.join(coursesDir, "intune"),
    file: "29-apns-configuration.webp",
    folder: "intune-originals",
    source: "29-apns-certificate-intune-official.png",
  },
  "30": {
    dir: path.join(coursesDir, "intune"),
    file: "30-enrollment-program-tokens.webp",
    folder: "intune-originals",
    source: "30-ios-ade-token-intune-official.png",
  },
  "32": {
    dir: path.join(coursesDir, "intune"),
    file: "32-configuration-profiles.webp",
    folder: "intune-originals",
    source: "32-devices-overview-intune-official.png",
  },
  "34": {
    dir: path.join(coursesDir, "intune"),
    file: "34-applications-macos.webp",
    folder: "intune-originals",
    source: "37-macos-account-settings-intune-official.png",
  },
  "37": {
    dir: path.join(coursesDir, "intune"),
    file: "37-platform-sso.webp",
    folder: "intune-originals",
    source: "37-platform-sso-device-profile-intune-official.png",
  },
  "39": {
    dir: path.join(coursesDir, "intune"),
    file: "39-device-configuration.webp",
    folder: "intune-originals",
    source: "39-applicability-rules-intune-official.png",
  },
  "60": {
    dir: path.join(coursesDir, "platform-sso"),
    file: "60-profil-intune-platform-sso.webp",
    folder: "intune-originals",
    source: "60-platform-sso-settings-picker-intune-official.png",
  },
  "61": {
    dir: path.join(coursesDir, "platform-sso"),
    file: "61-connexion-utilisateur.webp",
    folder: "intune-originals",
    source: "61-platform-sso-registration-required-official.png",
  },
  // Jamf
  "64": { dir: path.join(coursesDir, "jamf"), file: "64-dashboard-jamf.webp", folder: "jamf-originals", source: "64-dashboard-jamf-official.webp" },
  "65": { dir: path.join(coursesDir, "jamf"), file: "65-computers.webp", folder: "jamf-originals", source: "jamf-pro-screenshot-official.png" },
  "66": { dir: path.join(coursesDir, "jamf"), file: "66-mobile-devices.webp", folder: "jamf-originals", source: "66-mobile-devices-official.webp" },
  "67": { dir: path.join(coursesDir, "jamf"), file: "67-smart-groups.webp", folder: "jamf-originals", source: "jamf-pro-screenshot-official.png" },
  "68": { dir: path.join(coursesDir, "jamf"), file: "68-static-groups.webp", folder: "jamf-originals", source: "jamf-pro-screenshot-official.png" },
  "69": { dir: path.join(coursesDir, "jamf"), file: "69-policies.webp", folder: "jamf-originals", source: "69-policies-blueprints-official.webp" },
  "70": { dir: path.join(coursesDir, "jamf"), file: "70-configuration-profiles.webp", folder: "jamf-originals", source: "jamf-pro-screenshot-official.png" },
  "71": { dir: path.join(coursesDir, "jamf"), file: "71-packages.webp", folder: "jamf-originals", source: "jamf-pro-screenshot-official.png" },
  "72": { dir: path.join(coursesDir, "jamf"), file: "72-scripts.webp", folder: "jamf-originals", source: "jamf-pro-ai-assistant-official.webp" },
  "73": { dir: path.join(coursesDir, "jamf"), file: "73-patch-management.webp", folder: "jamf-originals", source: "jamf-pro-screenshot-official.png" },
  "74": { dir: path.join(coursesDir, "jamf"), file: "74-inventory.webp", folder: "jamf-originals", source: "74-inventory-official.webp" },
  "75": { dir: path.join(coursesDir, "jamf"), file: "75-enrollment.webp", folder: "jamf-originals", source: "jamf-pro-screenshot-official.png" },
  "76": { dir: path.join(coursesDir, "jamf"), file: "76-prestage-enrollment.webp", folder: "jamf-originals", source: "jamf-pro-screenshot-official.png" },
  "77": { dir: path.join(coursesDir, "jamf"), file: "77-self-service.webp", folder: "jamf-originals", source: "jamf-pro-screenshot-official.png" },
  "78": { dir: path.join(coursesDir, "jamf"), file: "78-jamf-protect.webp", folder: "jamf-originals", source: "jamf-pro-ai-assistant-official.webp" },
  "89": { dir: path.join(coursesDir, "exams"), file: "89-simulation-jamf-100.webp", folder: "jamf-originals", source: "jamf-pro-screenshot-official.png" },
  "90": { dir: path.join(coursesDir, "exams"), file: "90-simulation-jamf-200.webp", folder: "jamf-originals", source: "jamf-pro-screenshot-official.png" },
};

async function syncOne({ dir, file, folder, source }) {
  const srcPath = path.join(coursesDir, folder, source);
  const destPath = path.join(dir, file);

  if (!fs.existsSync(srcPath)) {
    console.warn(`⚠ Source manquante: ${folder}/${source}`);
    return;
  }

  await fs.promises.mkdir(dir, { recursive: true });

  if (source.endsWith(".webp")) {
    await fs.promises.copyFile(srcPath, destPath);
  } else {
    await sharp(srcPath).webp({ quality: 92 }).toFile(destPath);
  }
  console.log(`✓ ${file} ← ${folder}/${source}`);
}

async function main() {
  for (const entry of Object.values(SYNC_MAP)) {
    await syncOne(entry);
  }
  console.log("\nSync terminé — visuels officiels Apple, Intune et Jamf appliqués.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
