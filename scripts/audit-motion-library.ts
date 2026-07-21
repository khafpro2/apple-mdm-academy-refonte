#!/usr/bin/env npx tsx
/**
 * Audit de la bibliothèque motion.
 *
 * Usage:
 *   npm run motion:audit
 *   npm run motion:audit -- --json
 *   npm run motion:audit -- --json --out=.tmp/motion-audit.json
 *
 * Code de sortie non nul si erreurs bloquantes.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { courses } from "@/lib/data/courses";
import { motionAssets, motionScenes } from "@/lib/motion/data";
import {
  auditMotionLibrary,
  toJsonAuditSummary,
} from "@/lib/motion/validation/validate-library";

function parseArgs(argv: string[]) {
  const json = argv.includes("--json");
  const outArg = argv.find((a) => a.startsWith("--out="));
  const out = outArg ? outArg.slice("--out=".length) : undefined;
  return { json, out };
}

function printHuman(report: ReturnType<typeof auditMotionLibrary>) {
  console.log("=== Motion library audit ===");
  console.log(`Generated: ${report.generatedAt}`);
  console.log(`Scenes: ${report.sceneCount} (valid: ${report.validScenes}, invalid: ${report.invalidScenes})`);
  console.log(`Assets: ${report.assetCount}`);
  console.log(`Missing asset refs: ${report.missingAssets.length}`);
  console.log(`Missing media paths: ${report.missingMedia.length}`);
  console.log("");

  if (report.errors.length === 0) {
    console.log("Errors: none");
  } else {
    console.log(`Errors (${report.errors.length}):`);
    for (const e of report.errors) {
      console.log(`  [ERROR] ${e.code} ${e.subjectId ? `(${e.subjectId})` : ""} ${e.message}`);
    }
  }

  console.log("");

  if (report.warnings.length === 0) {
    console.log("Warnings: none");
  } else {
    console.log(`Warnings (${report.warnings.length}):`);
    for (const w of report.warnings) {
      console.log(`  [WARN] ${w.code} ${w.subjectId ? `(${w.subjectId})` : ""} ${w.message}`);
    }
  }

  console.log("");
  console.log(
    report.blocking
      ? "RESULT: BLOCKED — corriger les erreurs avant publication."
      : "RESULT: OK — aucune erreur bloquante."
  );
}

function main() {
  const { json, out } = parseArgs(process.argv.slice(2));
  const knownCourseIds = new Set(courses.map((c) => c.slug));

  const report = auditMotionLibrary(motionScenes, motionAssets, { knownCourseIds });
  const summary = toJsonAuditSummary(report);

  if (json) {
    const payload = JSON.stringify(summary, null, 2);
    const target =
      out ??
      join(process.cwd(), ".tmp", `motion-audit-${Date.now()}.json`);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, `${payload}\n`, "utf8");
    console.log(payload);
    console.error(`JSON report written to ${target}`);
  } else {
    printHuman(report);
  }

  process.exitCode = report.blocking ? 1 : 0;
}

main();
