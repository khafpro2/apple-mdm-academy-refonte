/**
 * Audit Motion Design asset registry.
 * Run: npm run audit:motion-assets
 */
import { readFileSync } from "node:fs";
import { writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateMotionAssets, validateMotionScenes } from "@/lib/motion/validate-assets";
import type { AssetMetadata, MotionScene, ValidationIssue } from "@/lib/motion/asset-types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

function loadJson<T>(relativePath: string): T {
  const absolute = path.join(repoRoot, relativePath);
  return JSON.parse(readFileSync(absolute, "utf8")) as T;
}

function main(): void {
  const jsonMode = process.argv.includes("--json");
  const assetsFile = loadJson<{ assets: unknown[] }>("media/motion/registry/assets.json");
  const scenesFile = loadJson<{ scenes: MotionScene[] }>("media/motion/registry/scenes.json");

  const assetIssues = validateMotionAssets(assetsFile.assets ?? [], {
    repoRoot,
    scenes: scenesFile.scenes ?? [],
  });
  const typedAssets = (assetsFile.assets ?? []).filter(
    (asset): asset is AssetMetadata =>
      typeof asset === "object" && asset !== null && typeof (asset as { id?: unknown }).id === "string"
  );
  const sceneIssues = validateMotionScenes(scenesFile.scenes ?? [], {
    assets: typedAssets,
  });
  const issues = [...assetIssues, ...sceneIssues];

  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");
  const invalidAssetIds = new Set(errors.map((i) => i.assetId).filter(Boolean));
  const invalidSceneIds = new Set(errors.map((i) => i.sceneId).filter(Boolean));
  const missingFiles = issues.filter((i) => i.code === "path-missing-file").length;
  const duplicateIds = issues.filter((i) => i.code === "id-duplicate" || i.code === "scene-id-duplicate").length;
  const duplicatePaths = issues.filter((i) => i.code === "path-duplicate").length;
  const report = {
    assetCount: assetsFile.assets?.length ?? 0,
    sceneCount: scenesFile.scenes?.length ?? 0,
    validAssets: Math.max((assetsFile.assets?.length ?? 0) - invalidAssetIds.size, 0),
    invalidAssets: invalidAssetIds.size,
    validScenes: Math.max((scenesFile.scenes?.length ?? 0) - invalidSceneIds.size, 0),
    invalidScenes: invalidSceneIds.size,
    missingFiles,
    duplicateIds,
    duplicatePaths,
    errors,
    warnings,
    generatedAt: new Date().toISOString(),
  };

  if (jsonMode) {
    const outputPath = path.join(os.tmpdir(), "apple-mdm-motion-assets-audit.json");
    writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
    console.log(outputPath);
    process.exit(errors.length === 0 ? 0 : 1);
  }

  console.log("=== Audit Motion Design assets ===\n");
  console.log(`Assets : ${report.assetCount}`);
  console.log(`Scènes : ${report.sceneCount}`);
  console.log(`Errors : ${errors.length} · Warnings : ${warnings.length}\n`);

  const print = (list: ValidationIssue[]) => {
    for (const item of list) {
      const where = item.assetId ? ` [${item.assetId}]` : "";
      console.log(`[${item.severity.toUpperCase()}] ${item.code}${where}`);
      console.log(`  ${item.message}`);
    }
  };

  if (errors.length) print(errors);
  if (warnings.length) print(warnings);

  if (errors.length === 0) {
    console.log("\n✅ Audit Motion Design terminé — 0 erreur");
    process.exit(0);
  }

  console.log("\n❌ Audit Motion Design échoué");
  process.exit(1);
}

main();
