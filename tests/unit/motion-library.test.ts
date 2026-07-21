import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import type { MotionAsset, MotionScene } from "../../lib/motion/types.ts";
import { validateScene, validateScenes } from "../../lib/motion/validation/validate-scene.ts";
import { validateAsset, validateAssets } from "../../lib/motion/validation/validate-asset.ts";
import { checkMotionFiles } from "../../lib/motion/validation/check-files.ts";
import {
  auditMotionLibrary,
  toJsonAuditSummary,
} from "../../lib/motion/validation/validate-library.ts";
import { canDisplayScenePublicly, canPreviewScene } from "../../lib/motion/publication.ts";
import { filevaultScene } from "../../lib/motion/data/scenes/filevault.ts";
import { filevaultAssets } from "../../lib/motion/data/assets/filevault.ts";
import { motionScenes, motionAssets } from "../../lib/motion/data/index.ts";

function baseScene(overrides: Partial<MotionScene> = {}): MotionScene {
  return {
    id: "scene-demo",
    slug: "demo",
    title: "Scène démo",
    durationSeconds: 60,
    status: "draft",
    version: "1.0.0",
    objectives: ["Comprendre le pipeline"],
    narration: { primaryMessage: "Message principal" },
    accessibility: { altText: "Alt scène démo" },
    courseIds: [],
    assetIds: [],
    ...overrides,
  };
}

function baseAsset(overrides: Partial<MotionAsset> = {}): MotionAsset {
  return {
    id: "asset-demo-icon",
    title: "Icône démo",
    category: "icon",
    status: "ready",
    format: "svg",
    path: "/media/motion/demo/demo-icon.svg",
    version: "1.0.0",
    accessibility: { altText: "Icône démo" },
    sceneIds: ["scene-demo"],
    ...overrides,
  };
}

test("1 — scène valide", () => {
  const scene = baseScene();
  const asset = baseAsset();
  const result = validateScenes([scene], [asset]);
  assert.equal(result.valid, true);
  assert.equal(result.errors.length, 0);
});

test("2 — identifiant de scène dupliqué", () => {
  const a = baseScene({ id: "scene-same", slug: "a" });
  const b = baseScene({ id: "scene-same", slug: "b" });
  const result = validateScenes([a, b], []);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.code === "scene-id-duplicate"));
});

test("3 — slug de scène dupliqué", () => {
  const a = baseScene({ id: "scene-a", slug: "same-slug" });
  const b = baseScene({ id: "scene-b", slug: "same-slug" });
  const result = validateScenes([a, b], []);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.code === "scene-slug-duplicate"));
});

test("4 — asset inconnu référencé par une scène", () => {
  const scene = baseScene({ assetIds: ["asset-does-not-exist"] });
  const result = validateScenes([scene], []);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.code === "scene-asset-unknown"));
});

test("5 — fichier absent (required sur asset ready)", () => {
  const root = mkdtempSync(join(tmpdir(), "motion-audit-"));
  const publicDir = join(root, "public");
  mkdirSync(publicDir, { recursive: true });
  try {
    const asset = baseAsset({ path: "/media/motion/demo/missing.svg", status: "ready" });
    const report = checkMotionFiles([], [asset], { projectRoot: root, publicDir });
    assert.equal(report.valid, false);
    assert.ok(report.errors.some((e) => e.code === "file-missing"));
    assert.ok(report.missingPaths.includes("/media/motion/demo/missing.svg"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("6 — extension incorrecte vs format", () => {
  const asset = baseAsset({ format: "svg", path: "/media/motion/demo/demo-icon.png" });
  const scene = baseScene();
  const result = validateAssets([asset], [scene]);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.code === "asset-extension-mismatch"));
});

test("7 — durée invalide", () => {
  const scene = baseScene({ durationSeconds: 0 });
  const result = validateScenes([scene], []);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.code === "scene-duration-invalid"));
});

test("8 — statut invalide", () => {
  const scene = baseScene({ status: "nope" as MotionScene["status"] });
  const result = validateScenes([scene], []);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.code === "scene-status-invalid"));
});

test("9 — scène published sans média", () => {
  const scene = baseScene({ status: "published", media: undefined });
  const result = validateScenes([scene], []);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.code === "scene-media-missing"));
});

test("10 — scène draft avec média absent autorisée (métadonnées)", () => {
  const scene = baseScene({
    status: "draft",
    media: {
      status: "planned",
      mp4Path: "/media/motion/demo/demo.mp4",
      vttPath: "/media/motion/demo/demo.fr-FR.vtt",
      transcriptPath: "/media/motion/demo/demo.fr-FR.transcript.md",
    },
  });
  const meta = validateScenes([scene], []);
  assert.equal(meta.valid, true);

  const root = mkdtempSync(join(tmpdir(), "motion-draft-"));
  const publicDir = join(root, "public");
  mkdirSync(publicDir, { recursive: true });
  try {
    const files = checkMotionFiles([scene], [], { projectRoot: root, publicDir });
    // missing media is warning, not error, for draft
    assert.equal(files.errors.length, 0);
    assert.ok(files.warnings.some((w) => w.code === "file-missing-optional"));
    const audit = auditMotionLibrary([scene], [], { projectRoot: root, publicDir });
    assert.equal(audit.blocking, false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("11 — absence de VTT sur scène publiée", () => {
  const scene = baseScene({
    status: "published",
    media: {
      status: "published",
      mp4Path: "/media/motion/demo/demo.mp4",
      transcriptPath: "/media/motion/demo/demo.fr-FR.transcript.md",
    },
  });
  const result = validateScenes([scene], []);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.code === "scene-media-vtt-missing"));
});

test("12 — absence de transcript sur scène publiée", () => {
  const scene = baseScene({
    status: "published",
    media: {
      status: "published",
      mp4Path: "/media/motion/demo/demo.mp4",
      vttPath: "/media/motion/demo/demo.fr-FR.vtt",
    },
  });
  const result = validateScenes([scene], []);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.code === "scene-media-transcript-missing"));
});

test("13 — noms d'assets interdits", () => {
  const scene = baseScene();
  const asset = baseAsset({ path: "/media/motion/demo/final.svg" });
  const result = validateAssets([asset], [scene]);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.code === "asset-forbidden-name"));
});

test("14 — rapport JSON contient les champs requis", () => {
  const report = auditMotionLibrary(motionScenes, motionAssets, {
    projectRoot: process.cwd(),
  });
  const json = toJsonAuditSummary(report);
  for (const key of [
    "sceneCount",
    "assetCount",
    "validScenes",
    "invalidScenes",
    "missingAssets",
    "missingMedia",
    "errors",
    "warnings",
    "generatedAt",
  ] as const) {
    assert.ok(key in json, `missing key ${key}`);
  }
  assert.equal(typeof json.generatedAt, "string");
  assert.equal(json.sceneCount, motionScenes.length);
});

test("15 — sortie non nulle (blocking) en cas d'erreur", () => {
  const bad = baseScene({ id: "", title: "", durationSeconds: -1, status: "published" });
  const report = auditMotionLibrary([bad], []);
  assert.equal(report.blocking, true);
  assert.ok(report.errors.length > 0);
});

test("publication — draft non public, approved previewable", () => {
  assert.equal(canDisplayScenePublicly(baseScene({ status: "draft" })), false);
  assert.equal(canPreviewScene(baseScene({ status: "approved" })), true);
  assert.equal(canDisplayScenePublicly(baseScene({ status: "published" })), true);
  assert.equal(canPreviewScene(baseScene({ status: "review" })), false);
});

test("FileVault référence — métadonnées valides ; médias motion absents non bloquants", () => {
  const meta = validateScenes([filevaultScene], filevaultAssets);
  assert.equal(meta.valid, true, meta.errors.map((e) => e.message).join("; "));

  const assetMeta = validateAssets(filevaultAssets, [filevaultScene]);
  assert.equal(assetMeta.valid, true, assetMeta.errors.map((e) => e.message).join("; "));

  const audit = auditMotionLibrary([filevaultScene], filevaultAssets, {
    projectRoot: process.cwd(),
  });
  assert.equal(audit.blocking, false, audit.errors.map((e) => `${e.code}:${e.message}`).join("; "));
  // Planned motion media under /media/motion/filevault/ are warnings only
  assert.ok(audit.missingMedia.length > 0 || audit.warnings.some((w) => w.code === "file-missing-optional"));
});

test("fichier présent avec bonne extension passe le check", () => {
  const root = mkdtempSync(join(tmpdir(), "motion-ok-"));
  const publicDir = join(root, "public");
  const dir = join(publicDir, "media/motion/demo");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "demo-icon.svg"), "<svg xmlns='http://www.w3.org/2000/svg'/>\n");
  try {
    const asset = baseAsset({ path: "/media/motion/demo/demo-icon.svg" });
    const report = checkMotionFiles([], [asset], { projectRoot: root, publicDir });
    assert.equal(report.valid, true);
    assert.ok(report.presentPaths.includes("/media/motion/demo/demo-icon.svg"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("validateScene contexte unicité", () => {
  const scene = baseScene();
  const result = validateScene(scene, {
    allSceneIds: [scene.id, scene.id],
    allSceneSlugs: [scene.slug],
    assetsById: new Map(),
  });
  assert.equal(result.valid, false);
});

test("asset scène inconnue", () => {
  const asset = baseAsset({ sceneIds: ["scene-missing"] });
  const result = validateAsset(asset, {
    allAssetIds: [asset.id],
    scenesById: new Map(),
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.code === "asset-scene-unknown"));
});
