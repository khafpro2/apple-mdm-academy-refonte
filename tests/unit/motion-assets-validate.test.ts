/**
 * Unit tests for Motion Design asset validator.
 * Run: npx tsx tests/unit/motion-assets-validate.test.ts
 */
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { validateAssetId } from "../../lib/motion/asset-id";
import { validateMotionAssets, validateMotionScenes } from "../../lib/motion/validate-assets";
import assetsRegistry from "../../media/motion/registry/assets.json";
import scenesRegistry from "../../media/motion/registry/scenes.json";
import type { AssetMetadata, MotionScene } from "../../lib/motion/asset-types";

const scenes: MotionScene[] = [
  {
    id: "scene-002-filevault-encryption",
    slug: "filevault-encryption",
    title: "FileVault",
    status: "brief-ready",
    durationSeconds: 45,
    objective: "Illustrer FileVault.",
    mainMessage: "FileVault chiffre le volume.",
    courseIds: ["macos-filevault"],
    assetIds: ["security-lock-front-closed-cyan-v1"],
    accessibilityStatus: "brief-ready",
    technicalReviewStatus: "brief-ready",
    mediaStatus: "not-started",
    version: "v1",
    active: true,
  },
];

const validMissing = {
  id: "security-lock-front-closed-cyan-v1",
  category: "security",
  name: "Cadenas fermé — cyan",
  description: "Cadenas géométrique fermé représentant un état de protection des données.",
  status: "missing",
  format: "svg",
  dimensions: "256x256",
  aspectRatio: "1:1",
  transparentBackground: true,
  decorative: false,
  altText: "Cadenas fermé représentant la protection des données.",
  source: "mixed",
  version: "v1",
  sceneIds: ["scene-002-filevault-encryption"],
};

// id convention
{
  assert.equal(validateAssetId("security-lock-front-closed-cyan-v1").length, 0);
  assert.equal(validateAssetId("data-flow-encryption-transition-neutral-v1").length, 0);
  assert.ok(validateAssetId("lock-final").length > 0);
  assert.ok(validateAssetId("misc-thing-front-open-cyan-v1").some((m) => /category/i.test(m)));
  assert.ok(validateAssetId("security-lock-final-v2").some((m) => /forbidden/i.test(m)));
}

// valid missing asset (no path)
{
  const issues = validateMotionAssets([validMissing], { repoRoot: process.cwd(), scenes });
  assert.equal(
    issues.filter((i) => i.severity === "error").length,
    0,
    JSON.stringify(issues, null, 2)
  );
}

// invalid example from schema
{
  const invalid = {
    id: "lock-final",
    category: "misc",
    name: "",
    description: "",
    status: "todo",
    format: "sketch",
    dimensions: "medium",
    aspectRatio: "square",
    transparentBackground: "oui",
    decorative: false,
    source: "firefly",
    version: "final",
    path: "/assets/lock.svg",
    sceneIds: "scene-002",
  };
  const issues = validateMotionAssets([invalid], { repoRoot: process.cwd(), scenes });
  const codes = new Set(issues.map((i) => i.code));
  assert.ok(codes.has("id-convention") || [...codes].some((c) => c.startsWith("id-")));
  assert.ok(codes.has("enum-category") || codes.has("enum-status") || codes.has("enum-format"));
  assert.ok(codes.has("empty-name") || codes.has("empty-description"));
  assert.ok(codes.has("sceneids-type") || codes.has("sceneid-format"));
  assert.ok(codes.has("path-prefix") || codes.has("path-missing-file"));
}

// invalid category
{
  const invalid = { ...validMissing, category: "misc" };
  const issues = validateMotionAssets([invalid], { repoRoot: process.cwd(), scenes });
  assert.ok(issues.some((i) => i.code === "enum-category"));
}

// invalid status
{
  const invalid = { ...validMissing, status: "todo" };
  const issues = validateMotionAssets([invalid], { repoRoot: process.cwd(), scenes });
  assert.ok(issues.some((i) => i.code === "enum-status"));
}

// invalid format
{
  const invalid = { ...validMissing, format: "gif" };
  const issues = validateMotionAssets([invalid], { repoRoot: process.cwd(), scenes });
  assert.ok(issues.some((i) => i.code === "enum-format"));
}

// duplicate id
{
  const issues = validateMotionAssets([validMissing, validMissing], { repoRoot: process.cwd(), scenes });
  assert.ok(issues.some((i) => i.code === "id-duplicate"));
}

// invalid version
{
  const invalid = { ...validMissing, version: "latest" };
  const issues = validateMotionAssets([invalid], { repoRoot: process.cwd(), scenes });
  assert.ok(issues.some((i) => i.code === "version-format"));
}

// invalid dimensions
{
  const invalid = { ...validMissing, dimensions: "256 by 256" };
  const issues = validateMotionAssets([invalid], { repoRoot: process.cwd(), scenes });
  assert.ok(issues.some((i) => i.code === "dimensions-format"));
}

// a11y: decorative true requires empty altText
{
  const decorative = {
    ...validMissing,
    id: "background-grid-front-neutral-dark-v1",
    category: "background",
    name: "Grille",
    description: "Fond décoratif.",
    decorative: true,
    altText: "should be empty",
    version: "v1",
  };
  const issues = validateMotionAssets([decorative], { repoRoot: process.cwd(), scenes });
  assert.ok(issues.some((i) => i.code === "alttext-decorative"));
}

// a11y: informative requires altText
{
  const noAlt = { ...validMissing, altText: "" };
  const issues = validateMotionAssets([noAlt], { repoRoot: process.cwd(), scenes });
  assert.ok(issues.some((i) => i.code === "alttext-required"));
}

// path present but file missing → error
{
  const withPath = {
    ...validMissing,
    status: "review",
    path: "/motion/svg/security-lock-front-closed-cyan-v1.svg",
  };
  const issues = validateMotionAssets([withPath], { repoRoot: process.cwd(), scenes });
  assert.ok(issues.some((i) => i.code === "path-missing-file"));
}

// missing status cannot declare path
{
  const withPath = {
    ...validMissing,
    status: "missing",
    path: "/motion/svg/security-lock-front-closed-cyan-v1.svg",
  };
  const issues = validateMotionAssets([withPath], { repoRoot: process.cwd(), scenes });
  assert.ok(issues.some((i) => i.code === "path-status-mismatch"));
}

// approved asset must declare an existing path
{
  const approvedWithoutPath = { ...validMissing, status: "approved" };
  const issues = validateMotionAssets([approvedWithoutPath], { repoRoot: process.cwd(), scenes });
  assert.ok(issues.some((i) => i.code === "approved-path-required"));
}

// extension mismatch
{
  const withPath = {
    ...validMissing,
    status: "review",
    path: "/motion/svg/security-lock-front-closed-cyan-v1.png",
  };
  const issues = validateMotionAssets([withPath], { repoRoot: process.cwd(), scenes });
  assert.ok(issues.some((i) => i.code === "path-format-mismatch"));
}

// duplicate path
{
  const first = {
    ...validMissing,
    status: "review",
    path: "/motion/svg/security-lock-front-closed-cyan-v1.svg",
  };
  const second = {
    ...validMissing,
    id: "security-vault-front-closed-enterprise-v1",
    name: "Vault",
    path: "/motion/svg/security-lock-front-closed-cyan-v1.svg",
  };
  const issues = validateMotionAssets([first, second], { repoRoot: process.cwd(), scenes });
  assert.ok(issues.some((i) => i.code === "path-duplicate"));
}

// path present and file exists under public/motion → ok
{
  const root = mkdtempSync(path.join(tmpdir(), "motion-assets-"));
  try {
    const dir = path.join(root, "public/motion/svg");
    mkdirSync(dir, { recursive: true });
    const file = path.join(dir, "security-lock-front-closed-cyan-v1.svg");
    writeFileSync(file, "<svg xmlns='http://www.w3.org/2000/svg'></svg>\n");
    const withPath = {
      ...validMissing,
      status: "review",
      path: "/motion/svg/security-lock-front-closed-cyan-v1.svg",
    };
    const issues = validateMotionAssets([withPath], { repoRoot: root, scenes });
    assert.equal(
      issues.filter((i) => i.severity === "error").length,
      0,
      JSON.stringify(issues, null, 2)
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// legacy path under media/motion/assets still resolves
{
  const root = mkdtempSync(path.join(tmpdir(), "motion-assets-legacy-"));
  try {
    const dir = path.join(root, "media/motion/assets");
    mkdirSync(dir, { recursive: true });
    const file = path.join(dir, "security-lock-front-closed-cyan-v1.svg");
    writeFileSync(file, "<svg xmlns='http://www.w3.org/2000/svg'></svg>\n");
    const withPath = {
      ...validMissing,
      status: "review",
      path: "/media/motion/assets/security-lock-front-closed-cyan-v1.svg",
    };
    const issues = validateMotionAssets([withPath], { repoRoot: root, scenes });
    assert.equal(
      issues.filter((i) => i.severity === "error").length,
      0,
      JSON.stringify(issues, null, 2)
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// unknown scene id
{
  const badScene = {
    ...validMissing,
    sceneIds: ["scene-999-unknown-topic"],
  };
  const issues = validateMotionAssets([badScene], { repoRoot: process.cwd(), scenes });
  assert.ok(issues.some((i) => i.code === "sceneid-missing"));
}

// forbidden brand
{
  const brand = {
    ...validMissing,
    description: "Comparatif Kandji vs Apple",
  };
  const issues = validateMotionAssets([brand], { repoRoot: process.cwd(), scenes });
  assert.ok(issues.some((i) => i.code === "forbidden-brand"));
}

// scene validation
{
  const issues = validateMotionScenes(scenes, { assets: [validMissing as AssetMetadata] });
  assert.equal(
    issues.filter((i) => i.severity === "error").length,
    0,
    JSON.stringify(issues, null, 2)
  );
}

// scene references unknown asset
{
  const badScene = { ...scenes[0], assetIds: ["security-vault-front-closed-enterprise-v1"] };
  const issues = validateMotionScenes([badScene], { assets: [validMissing as AssetMetadata] });
  assert.ok(issues.some((i) => i.code === "scene-asset-missing"));
}

// FileVault pilot registry is valid
{
  const registryScenes = scenesRegistry.scenes as MotionScene[];
  const registryAssets = assetsRegistry.assets as AssetMetadata[];
  const assetIssues = validateMotionAssets(registryAssets, { repoRoot: process.cwd(), scenes: registryScenes });
  const sceneIssues = validateMotionScenes(registryScenes, { assets: registryAssets });
  const errors = [...assetIssues, ...sceneIssues].filter((i) => i.severity === "error");
  assert.equal(errors.length, 0, JSON.stringify(errors, null, 2));
  const fileVault = registryScenes.find((scene) => scene.id === "scene-002-filevault-encryption");
  assert.ok(fileVault);
  assert.equal(fileVault.assetIds.length, 8);
}

// JSON report
{
  const result = spawnSync("npx", ["--yes", "tsx", "scripts/audit-motion-assets.ts", "--json"], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const outputPath = result.stdout.trim();
  assert.ok(existsSync(outputPath), outputPath);
  const report = JSON.parse(readFileSync(outputPath, "utf8")) as { assetCount: number; sceneCount: number };
  assert.equal(report.assetCount, 8);
  assert.equal(report.sceneCount, 1);
}

console.log("motion-assets-validate: all assertions passed");
