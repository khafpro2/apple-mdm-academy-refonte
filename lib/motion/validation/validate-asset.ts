import { isAllowedMotionPath } from "@/lib/motion/data/allowed-paths";
import {
  isMotionAssetCategory,
  isMotionAssetFormat,
  isMotionAssetStatus,
} from "@/lib/motion/statuses";
import type { MotionAsset, MotionScene } from "@/lib/motion/types";
import {
  hasForbiddenAssetName,
  isTemporaryFileName,
} from "@/lib/motion/validation/forbidden-names";
import { issue, type ValidationResult } from "@/lib/motion/validation/types";

const SEMVER_LIKE = /^\d+\.\d+\.\d+([.-][A-Za-z0-9.-]+)?$/;

const FORMAT_EXTENSIONS: Record<string, string[]> = {
  svg: [".svg"],
  png: [".png"],
  webp: [".webp"],
  jpg: [".jpg", ".jpeg"],
  jpeg: [".jpg", ".jpeg"],
  mp4: [".mp4"],
  webm: [".webm"],
  vtt: [".vtt"],
  txt: [".txt"],
  md: [".md"],
  json: [".json"],
};

export type ValidateAssetContext = {
  allAssetIds: string[];
  scenesById: Map<string, MotionScene>;
};

function countOccurrences(values: string[], target: string): number {
  return values.filter((v) => v === target).length;
}

function extensionOf(path: string): string {
  const base = path.split("/").pop() ?? path;
  const dot = base.lastIndexOf(".");
  return dot >= 0 ? base.slice(dot).toLowerCase() : "";
}

/**
 * Valide un asset motion (métadonnées uniquement — pas de FS).
 */
export function validateAsset(asset: MotionAsset, context: ValidateAssetContext): ValidationResult {
  const errors = [];
  const warnings = [];
  const subjectId = asset.id || "(unknown-asset)";

  if (!asset.id || !asset.id.trim()) {
    errors.push(issue("error", "asset-id-missing", "Identifiant d'asset manquant.", { subjectId }));
  } else if (countOccurrences(context.allAssetIds, asset.id) > 1) {
    errors.push(
      issue("error", "asset-id-duplicate", `Identifiant d'asset dupliqué: ${asset.id}`, {
        subjectId,
        path: "id",
      })
    );
  }

  if (!asset.title?.trim()) {
    errors.push(issue("error", "asset-title-missing", "Titre d'asset manquant.", { subjectId, path: "title" }));
  }

  if (!isMotionAssetCategory(asset.category)) {
    errors.push(
      issue("error", "asset-category-unknown", `Catégorie inconnue: ${String(asset.category)}`, {
        subjectId,
        path: "category",
      })
    );
  }

  if (!isMotionAssetStatus(asset.status)) {
    errors.push(
      issue("error", "asset-status-invalid", `État d'asset non autorisé: ${String(asset.status)}`, {
        subjectId,
        path: "status",
      })
    );
  }

  if (!isMotionAssetFormat(asset.format)) {
    errors.push(
      issue("error", "asset-format-invalid", `Format non autorisé: ${String(asset.format)}`, {
        subjectId,
        path: "format",
      })
    );
  }

  if (!asset.version || !SEMVER_LIKE.test(asset.version)) {
    errors.push(
      issue("error", "asset-version-invalid", `Version invalide (attendu x.y.z): ${asset.version ?? "(vide)"}`, {
        subjectId,
        path: "version",
      })
    );
  }

  const needsAlt =
    !asset.accessibility?.decorative &&
    asset.category !== "background" &&
    asset.status !== "planned" &&
    asset.status !== "missing";

  if (needsAlt && !asset.accessibility?.altText?.trim()) {
    errors.push(
      issue("error", "asset-alt-text-missing", "Texte alternatif requis pour cet asset.", {
        subjectId,
        path: "accessibility.altText",
      })
    );
  }

  const pathRequired = asset.status === "ready" || asset.status === "in-production";
  const pathForbiddenWhenMissing = asset.status === "missing" || asset.status === "planned";

  if (pathRequired && !asset.path) {
    errors.push(
      issue("error", "asset-path-missing", "Chemin requis lorsque l'asset est ready/in-production.", {
        subjectId,
        path: "path",
      })
    );
  }

  if (pathForbiddenWhenMissing && asset.path) {
    warnings.push(
      issue(
        "warning",
        "asset-path-while-missing",
        "Un chemin est déclaré alors que le statut est planned/missing — vérifier la cohérence.",
        { subjectId, path: "path" }
      )
    );
  }

  if (asset.path) {
    if (!isAllowedMotionPath(asset.path)) {
      errors.push(
        issue("error", "asset-path-forbidden", `Chemin asset non autorisé: ${asset.path}`, {
          subjectId,
          path: "path",
        })
      );
    }

    if (isTemporaryFileName(asset.path)) {
      errors.push(
        issue("error", "asset-temporary-name", `Nom de fichier temporaire interdit: ${asset.path}`, {
          subjectId,
          path: "path",
        })
      );
    }

    if (hasForbiddenAssetName(asset.path)) {
      errors.push(
        issue(
          "error",
          "asset-forbidden-name",
          `Nom d'asset interdit (final, new, latest, test, image1…): ${asset.path}`,
          { subjectId, path: "path" }
        )
      );
    }

    if (isMotionAssetFormat(asset.format)) {
      const allowedExts = FORMAT_EXTENSIONS[asset.format] ?? [];
      const ext = extensionOf(asset.path);
      if (allowedExts.length > 0 && !allowedExts.includes(ext)) {
        errors.push(
          issue(
            "error",
            "asset-extension-mismatch",
            `Extension « ${ext || "(aucune)"} » incohérente avec le format « ${asset.format} ».`,
            { subjectId, path: "path" }
          )
        );
      }
    }
  }

  if (hasForbiddenAssetName(asset.id)) {
    errors.push(
      issue("error", "asset-id-forbidden-name", `Identifiant d'asset utilise un nom interdit: ${asset.id}`, {
        subjectId,
        path: "id",
      })
    );
  }

  for (const sceneId of asset.sceneIds ?? []) {
    if (!context.scenesById.has(sceneId)) {
      errors.push(
        issue("error", "asset-scene-unknown", `Scène référencée introuvable: ${sceneId}`, {
          subjectId,
          path: "sceneIds",
        })
      );
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validateAssets(assets: MotionAsset[], scenes: MotionScene[]): ValidationResult {
  const allAssetIds = assets.map((a) => a.id);
  const scenesById = new Map(scenes.map((s) => [s.id, s]));
  const results = assets.map((asset) => validateAsset(asset, { allAssetIds, scenesById }));
  const errors = results.flatMap((r) => r.errors);
  const warnings = results.flatMap((r) => r.warnings);
  return { valid: errors.length === 0, errors, warnings };
}
