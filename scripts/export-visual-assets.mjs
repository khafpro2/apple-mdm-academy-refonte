#!/usr/bin/env node
/**
 * Validates visual assets, exports PNGs and builds export manifest.
 * Run: node scripts/export-visual-assets.mjs
 *
 * Never silently overwrites existing PNG/PDF exports — skips with warning.
 */
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
} from "fs";
import { join, dirname, relative, extname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC_VISUAL = join(ROOT, "public", "visual-assets");
const EXPORT_PNG = join(PUBLIC_VISUAL, "exports", "png");
const EXPORT_SVG = join(PUBLIC_VISUAL, "exports", "svg");
const MANIFEST_JSON = join(PUBLIC_VISUAL, "exports", "manifest.json");
const ERROR_REPORT = join(PUBLIC_VISUAL, "exports", "validation-report.json");
const GENERATED_MANIFEST = join(ROOT, "lib", "visual-assets", "generated-manifest.json");

mkdirSync(EXPORT_PNG, { recursive: true });
mkdirSync(EXPORT_SVG, { recursive: true });

const errors = [];
const warnings = [];
const exported = [];

function walkSvgFiles(dir, base = dir) {
  const results = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === "exports") continue;
      results.push(...walkSvgFiles(full, base));
    } else if (extname(entry) === ".svg") {
      results.push(relative(base, full));
    }
  }
  return results;
}

function validateSvg(content, filePath) {
  const issues = [];
  if (!content.includes('viewBox="')) issues.push("missing viewBox");
  if (/<script/i.test(content)) issues.push("contains script");
  if (/data:image/i.test(content)) issues.push("contains base64 raster");
  if (!/<title[\s>]/i.test(content)) issues.push("missing accessible title");
  const idMatches = [...content.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  const dupIds = idMatches.filter((id, i) => idMatches.indexOf(id) !== i);
  if (dupIds.length) issues.push(`duplicate ids: ${[...new Set(dupIds)].join(", ")}`);
  if (!/^[a-z0-9-]+\.svg$/.test(filePath.split("/").pop())) {
    issues.push("invalid filename (use lowercase, hyphens)");
  }
  return issues;
}

async function exportPng(svgPath, relPath) {
  const pngRel = relPath.replace(/\.svg$/, ".png");
  const pngOut = join(EXPORT_PNG, pngRel);
  mkdirSync(dirname(pngOut), { recursive: true });

  if (existsSync(pngOut)) {
    warnings.push(`SKIP PNG (exists): ${pngRel}`);
    return false;
  }

  const svgContent = readFileSync(svgPath, "utf8");
  const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
  let width = 256;
  let height = 256;
  if (viewBoxMatch) {
    const parts = viewBoxMatch[1].split(/\s+/).map(Number);
    if (parts.length === 4) {
      width = Math.min(1024, Math.max(64, parts[2] * 2));
      height = Math.min(1024, Math.max(64, parts[3] * 2));
    }
  }

  await sharp(Buffer.from(svgContent)).resize(width, height).png().toFile(pngOut);
  exported.push({ type: "png", path: `/visual-assets/exports/png/${pngRel.replace(/\\/g, "/")}` });
  return true;
}

function copySvgExport(svgPath, relPath) {
  const out = join(EXPORT_SVG, relPath);
  mkdirSync(dirname(out), { recursive: true });
  if (existsSync(out)) {
    warnings.push(`SKIP SVG export (exists): ${relPath}`);
    return false;
  }
  writeFileSync(out, readFileSync(svgPath, "utf8"));
  exported.push({ type: "svg", path: `/visual-assets/exports/svg/${relPath.replace(/\\/g, "/")}` });
  return true;
}

// Ensure generated assets exist
if (!existsSync(GENERATED_MANIFEST)) {
  console.log("Running generate:visual-assets first…");
  const { execSync } = await import("child_process");
  execSync("node scripts/generate-visual-assets.mjs", { cwd: ROOT, stdio: "inherit" });
}

const manifest = JSON.parse(readFileSync(GENERATED_MANIFEST, "utf8"));
const manifestPaths = new Set(manifest.map((m) => m.path.replace(/^\/visual-assets\//, "")));
const svgFiles = walkSvgFiles(PUBLIC_VISUAL);
const orphanFiles = [];

for (const rel of svgFiles) {
  const full = join(PUBLIC_VISUAL, rel);
  const content = readFileSync(full, "utf8");
  const publicPath = `/visual-assets/${rel.replace(/\\/g, "/")}`;

  const issues = validateSvg(content, rel);
  if (issues.length) {
    errors.push({ file: publicPath, issues });
  }

  if (!manifestPaths.has(rel.replace(/\\/g, "/"))) {
    orphanFiles.push(publicPath);
  }

  try {
    await copySvgExport(full, rel);
    await exportPng(full, rel);
  } catch (e) {
    errors.push({ file: publicPath, issues: [`export failed: ${e.message}`] });
  }
}

// Registry paths not found on disk
for (const entry of manifest) {
  const diskPath = join(ROOT, "public", entry.path.replace(/^\//, ""));
  if (!existsSync(diskPath)) {
    errors.push({ file: entry.path, issues: ["declared in registry but file missing"] });
  }
}

const exportManifest = {
  generatedAt: new Date().toISOString(),
  version: "1.0.0",
  sourceManifest: GENERATED_MANIFEST,
  stats: {
    svgScanned: svgFiles.length,
    registryEntries: manifest.length,
    pngExported: exported.filter((e) => e.type === "png").length,
    svgCopied: exported.filter((e) => e.type === "svg").length,
    errors: errors.length,
    warnings: warnings.length,
    orphans: orphanFiles.length,
  },
  exported,
  orphans: orphanFiles,
};

writeFileSync(MANIFEST_JSON, JSON.stringify(exportManifest, null, 2) + "\n");
writeFileSync(
  ERROR_REPORT,
  JSON.stringify({ generatedAt: new Date().toISOString(), errors, warnings, orphans: orphanFiles }, null, 2) + "\n"
);

console.log(`\nExport complete:`);
console.log(`  SVG scanned: ${svgFiles.length}`);
console.log(`  PNG exported: ${exportManifest.stats.pngExported}`);
console.log(`  Errors: ${errors.length}`);
console.log(`  Warnings: ${warnings.length}`);
console.log(`  Orphans: ${orphanFiles.length}`);
console.log(`  Manifest: ${MANIFEST_JSON}`);

if (errors.length > 0) {
  process.exitCode = 1;
}
