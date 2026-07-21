import { isAllowedMotionPath } from "@/lib/motion/data/allowed-paths";
import {
  sceneAllowsMissingMedia,
  sceneRequiresPublishedMedia,
} from "@/lib/motion/publication";
import {
  isMotionSceneStatus,
} from "@/lib/motion/statuses";
import type { MotionAsset, MotionScene } from "@/lib/motion/types";
import { issue, type ValidationResult } from "@/lib/motion/validation/types";

const SEMVER_LIKE = /^\d+\.\d+\.\d+([.-][A-Za-z0-9.-]+)?$/;

export type ValidateSceneContext = {
  /** Tous les IDs de scènes du registre (pour unicité). */
  allSceneIds: string[];
  /** Tous les slugs de scènes du registre (pour unicité). */
  allSceneSlugs: string[];
  /** Assets du registre (pour vérifier les références). */
  assetsById: Map<string, MotionAsset>;
  /** Slugs de cours connus (optionnel). */
  knownCourseIds?: Set<string>;
};

function countOccurrences(values: string[], target: string): number {
  return values.filter((v) => v === target).length;
}

/**
 * Valide une scène motion contre les règles métier du pipeline.
 * Ne vérifie pas la présence physique des fichiers (voir check-files).
 */
export function validateScene(
  scene: MotionScene,
  context: ValidateSceneContext
): ValidationResult {
  const errors = [];
  const warnings = [];
  const subjectId = scene.id || scene.slug || "(unknown-scene)";

  if (!scene.id || !scene.id.trim()) {
    errors.push(issue("error", "scene-id-missing", "Identifiant de scène manquant.", { subjectId }));
  } else if (countOccurrences(context.allSceneIds, scene.id) > 1) {
    errors.push(
      issue("error", "scene-id-duplicate", `Identifiant de scène dupliqué: ${scene.id}`, {
        subjectId,
        path: "id",
      })
    );
  }

  if (!scene.slug || !scene.slug.trim()) {
    errors.push(issue("error", "scene-slug-missing", "Slug de scène manquant.", { subjectId, path: "slug" }));
  } else if (countOccurrences(context.allSceneSlugs, scene.slug) > 1) {
    errors.push(
      issue("error", "scene-slug-duplicate", `Slug de scène dupliqué: ${scene.slug}`, {
        subjectId,
        path: "slug",
      })
    );
  }

  if (!scene.title || !scene.title.trim()) {
    errors.push(issue("error", "scene-title-missing", "Titre de scène manquant.", { subjectId, path: "title" }));
  }

  if (!(typeof scene.durationSeconds === "number") || !(scene.durationSeconds > 0) || !Number.isFinite(scene.durationSeconds)) {
    errors.push(
      issue("error", "scene-duration-invalid", "La durée doit être un nombre positif (secondes).", {
        subjectId,
        path: "durationSeconds",
      })
    );
  }

  if (!isMotionSceneStatus(scene.status)) {
    errors.push(
      issue("error", "scene-status-invalid", `Statut de scène non autorisé: ${String(scene.status)}`, {
        subjectId,
        path: "status",
      })
    );
  }

  if (!Array.isArray(scene.objectives) || scene.objectives.length === 0) {
    errors.push(
      issue("error", "scene-objectives-missing", "Au moins un objectif pédagogique est requis.", {
        subjectId,
        path: "objectives",
      })
    );
  } else if (scene.objectives.some((o) => !o || !o.trim())) {
    errors.push(
      issue("error", "scene-objective-empty", "Un objectif ne peut pas être vide.", {
        subjectId,
        path: "objectives",
      })
    );
  }

  if (!scene.narration?.primaryMessage?.trim()) {
    errors.push(
      issue("error", "scene-primary-message-missing", "Message principal (narration) manquant.", {
        subjectId,
        path: "narration.primaryMessage",
      })
    );
  }

  if (!scene.accessibility?.altText?.trim() && !scene.accessibility?.decorative) {
    errors.push(
      issue("error", "scene-alt-text-missing", "Texte alternatif requis (ou marquer decorative).", {
        subjectId,
        path: "accessibility.altText",
      })
    );
  }

  if (!scene.version || !SEMVER_LIKE.test(scene.version)) {
    errors.push(
      issue("error", "scene-version-invalid", `Version invalide (attendu x.y.z): ${scene.version ?? "(vide)"}`, {
        subjectId,
        path: "version",
      })
    );
  }

  if (context.knownCourseIds && scene.courseIds?.length) {
    for (const courseId of scene.courseIds) {
      if (!context.knownCourseIds.has(courseId)) {
        warnings.push(
          issue(
            "warning",
            "scene-course-unknown",
            `Identifiant de cours inconnu du catalogue: ${courseId}`,
            { subjectId, path: "courseIds" }
          )
        );
      }
    }
  }

  for (const assetId of scene.assetIds ?? []) {
    if (!context.assetsById.has(assetId)) {
      errors.push(
        issue("error", "scene-asset-unknown", `Asset référencé introuvable dans le registre: ${assetId}`, {
          subjectId,
          path: "assetIds",
        })
      );
    }
  }

  const media = scene.media;
  const requiresMedia = isMotionSceneStatus(scene.status) && sceneRequiresPublishedMedia(scene.status);
  const allowsMissing = isMotionSceneStatus(scene.status) && sceneAllowsMissingMedia(scene.status);

  if (requiresMedia) {
    if (!media) {
      errors.push(
        issue("error", "scene-media-missing", "Média requis pour une scène approved/published.", {
          subjectId,
          path: "media",
        })
      );
    } else {
      if (!media.mp4Path && !media.webmPath) {
        errors.push(
          issue("error", "scene-media-video-missing", "MP4 ou WebM requis pour une scène published/approved.", {
            subjectId,
            path: "media.mp4Path",
          })
        );
      }
      if (!media.vttPath) {
        errors.push(
          issue("error", "scene-media-vtt-missing", "Sous-titres VTT obligatoires pour une scène published/approved.", {
            subjectId,
            path: "media.vttPath",
          })
        );
      }
      if (!media.transcriptPath) {
        errors.push(
          issue("error", "scene-media-transcript-missing", "Transcript obligatoire pour une scène published/approved.", {
            subjectId,
            path: "media.transcriptPath",
          })
        );
      }
      if (media.status !== "published" && media.status !== "ready") {
        warnings.push(
          issue(
            "warning",
            "scene-media-status-not-ready",
            `Statut média « ${media.status} » inhabituel pour une scène ${scene.status}.`,
            { subjectId, path: "media.status" }
          )
        );
      }
    }
  } else if (!media && !allowsMissing) {
    warnings.push(
      issue("warning", "scene-media-absent", "Aucun bloc média déclaré.", { subjectId, path: "media" })
    );
  }

  if (media) {
    const pathFields: Array<{ key: string; value?: string }> = [
      { key: "posterPath", value: media.posterPath },
      { key: "mp4Path", value: media.mp4Path },
      { key: "webmPath", value: media.webmPath },
      { key: "vttPath", value: media.vttPath },
      { key: "transcriptPath", value: media.transcriptPath },
    ];
    for (const field of pathFields) {
      if (!field.value) continue;
      if (!isAllowedMotionPath(field.value)) {
        errors.push(
          issue(
            "error",
            "scene-media-path-forbidden",
            `Chemin média non autorisé: ${field.value}`,
            { subjectId, path: `media.${field.key}` }
          )
        );
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateScenes(
  scenes: MotionScene[],
  assets: MotionAsset[],
  knownCourseIds?: Set<string>
): ValidationResult {
  const allSceneIds = scenes.map((s) => s.id);
  const allSceneSlugs = scenes.map((s) => s.slug);
  const assetsById = new Map(assets.map((a) => [a.id, a]));

  const results = scenes.map((scene) =>
    validateScene(scene, { allSceneIds, allSceneSlugs, assetsById, knownCourseIds })
  );

  const errors = results.flatMap((r) => r.errors);
  const warnings = results.flatMap((r) => r.warnings);
  return { valid: errors.length === 0, errors, warnings };
}

/** Helper tests / callers sans contexte complet. */
export function validateSceneStandalone(
  scene: MotionScene,
  assets: MotionAsset[] = [],
  siblings: MotionScene[] = []
): ValidationResult {
  const all = siblings.length ? siblings : [scene];
  return validateScenes(all, assets);
}
