import type { MotionAsset, MotionScene } from "@/lib/motion/types";
import { validateAssets } from "@/lib/motion/validation/validate-asset";
import { validateScenes } from "@/lib/motion/validation/validate-scene";
import {
  checkMotionFiles,
  type FileCheckOptions,
  type FileCheckReport,
} from "@/lib/motion/validation/check-files";
import { mergeValidationResults, type ValidationIssue, type ValidationResult } from "@/lib/motion/validation/types";
import { sceneRequiresPublishedMedia } from "@/lib/motion/publication";
import { isMotionSceneStatus } from "@/lib/motion/statuses";

export type MotionAuditReport = {
  generatedAt: string;
  sceneCount: number;
  assetCount: number;
  validScenes: number;
  invalidScenes: number;
  missingAssets: string[];
  missingMedia: string[];
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  fileCheck: FileCheckReport;
  blocking: boolean;
};

export type AuditLibraryOptions = FileCheckOptions & {
  knownCourseIds?: Set<string>;
  /** Si true, ignore les fichiers absents pour les scènes draft-like (déjà le comportement par défaut). */
  lenientDraftMedia?: boolean;
};

function detectDuplicateIds(scenes: MotionScene[], assets: MotionAsset[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const sceneIds = new Map<string, number>();
  const sceneSlugs = new Map<string, number>();
  const assetIds = new Map<string, number>();

  for (const s of scenes) {
    sceneIds.set(s.id, (sceneIds.get(s.id) ?? 0) + 1);
    sceneSlugs.set(s.slug, (sceneSlugs.get(s.slug) ?? 0) + 1);
  }
  for (const a of assets) {
    assetIds.set(a.id, (assetIds.get(a.id) ?? 0) + 1);
  }

  for (const [id, count] of sceneIds) {
    if (count > 1) {
      issues.push({
        severity: "error",
        code: "duplicate-scene-id",
        message: `Doublon d'identifiant de scène: ${id} (${count})`,
        subjectId: id,
      });
    }
  }
  for (const [slug, count] of sceneSlugs) {
    if (count > 1) {
      issues.push({
        severity: "error",
        code: "duplicate-scene-slug",
        message: `Doublon de slug de scène: ${slug} (${count})`,
        subjectId: slug,
      });
    }
  }
  for (const [id, count] of assetIds) {
    if (count > 1) {
      issues.push({
        severity: "error",
        code: "duplicate-asset-id",
        message: `Doublon d'identifiant d'asset: ${id} (${count})`,
        subjectId: id,
      });
    }
  }

  return issues;
}

/**
 * Audit complet de la bibliothèque motion.
 * Erreurs bloquantes : données invalides, doublons, published sans média,
 * chemins invalides, VTT/transcript absents quand obligatoires.
 * Les médias absents sur draft ne bloquent pas.
 */
export function auditMotionLibrary(
  scenes: MotionScene[],
  assets: MotionAsset[],
  options: AuditLibraryOptions = {}
): MotionAuditReport {
  const generatedAt = new Date().toISOString();
  const duplicateIssues = detectDuplicateIds(scenes, assets);

  const sceneResult = validateScenes(scenes, assets, options.knownCourseIds);
  const assetResult = validateAssets(assets, scenes);
  const fileCheck = checkMotionFiles(scenes, assets, options);
  const metaResult = mergeValidationResults(sceneResult, assetResult, {
    valid: duplicateIssues.length === 0,
    errors: duplicateIssues,
    warnings: [],
  });

  const assetsById = new Set(assets.map((a) => a.id));
  const missingAssets: string[] = [];
  for (const scene of scenes) {
    for (const id of scene.assetIds ?? []) {
      if (!assetsById.has(id)) missingAssets.push(id);
    }
  }

  const missingMedia = fileCheck.missingPaths.filter(
    (p) =>
      p.endsWith(".mp4") ||
      p.endsWith(".webm") ||
      p.endsWith(".vtt") ||
      p.includes("transcript")
  );

  let validScenes = 0;
  let invalidScenes = 0;
  for (const scene of scenes) {
    const local = validateScenes([scene], assets, options.knownCourseIds);
    const mediaRequired =
      isMotionSceneStatus(scene.status) && sceneRequiresPublishedMedia(scene.status);
    const sceneFileErrors = fileCheck.errors.filter((e) => e.subjectId === scene.id);
    const blockingFile = mediaRequired && sceneFileErrors.length > 0;
    if (local.valid && !blockingFile) validScenes += 1;
    else invalidScenes += 1;
  }

  const allErrors = [...metaResult.errors, ...fileCheck.errors];
  const allWarnings = [...metaResult.warnings, ...fileCheck.warnings];

  // Deduplicate identical codes+messages+subjects
  const dedupe = (items: ValidationIssue[]) => {
    const seen = new Set<string>();
    return items.filter((i) => {
      const key = `${i.severity}|${i.code}|${i.subjectId ?? ""}|${i.path ?? ""}|${i.message}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const errors = dedupe(allErrors);
  const warnings = dedupe(allWarnings);

  return {
    generatedAt,
    sceneCount: scenes.length,
    assetCount: assets.length,
    validScenes,
    invalidScenes,
    missingAssets: [...new Set(missingAssets)],
    missingMedia: [...new Set(missingMedia)],
    errors,
    warnings,
    fileCheck,
    blocking: errors.length > 0,
  };
}

export function toJsonAuditSummary(report: MotionAuditReport) {
  return {
    sceneCount: report.sceneCount,
    assetCount: report.assetCount,
    validScenes: report.validScenes,
    invalidScenes: report.invalidScenes,
    missingAssets: report.missingAssets,
    missingMedia: report.missingMedia,
    errors: report.errors,
    warnings: report.warnings,
    generatedAt: report.generatedAt,
  };
}
