import type { MotionScene } from "@/lib/motion/types";
import type { MotionSceneStatus } from "@/lib/motion/statuses";

/**
 * Règles de publication centralisées.
 * Ne pas disperser ces listes dans les composants UI.
 */

const INTERNAL_ONLY: ReadonlySet<MotionSceneStatus> = new Set([
  "draft",
  "needs-technical-review",
  "brief-ready",
  "assets-in-production",
  "animation-in-production",
  "review",
  "blocked",
]);

const PREVIEWABLE: ReadonlySet<MotionSceneStatus> = new Set(["approved", "published"]);

const PUBLIC_COURSE_VISIBLE: ReadonlySet<MotionSceneStatus> = new Set(["published"]);

const HIDDEN: ReadonlySet<MotionSceneStatus> = new Set(["deprecated"]);

/** Scène visible dans les parcours / cours publics. */
export function canDisplayScenePublicly(scene: Pick<MotionScene, "status">): boolean {
  return PUBLIC_COURSE_VISIBLE.has(scene.status);
}

/** Scène prévisualisable (équipe + preview interne approuvée). */
export function canPreviewScene(scene: Pick<MotionScene, "status">): boolean {
  return PREVIEWABLE.has(scene.status);
}

/** Scène réservée à l'usage interne (pipeline / admin). */
export function isSceneInternalOnly(scene: Pick<MotionScene, "status">): boolean {
  return INTERNAL_ONLY.has(scene.status);
}

/** Scène masquée (dépréciée). */
export function isSceneHidden(scene: Pick<MotionScene, "status">): boolean {
  return HIDDEN.has(scene.status);
}

/** Afficher un avertissement (scène bloquée). */
export function shouldWarnAboutScene(scene: Pick<MotionScene, "status">): boolean {
  return scene.status === "blocked";
}

/** Statuts pour lesquels le média vidéo + VTT + transcript sont obligatoires. */
export function sceneRequiresPublishedMedia(status: MotionSceneStatus): boolean {
  return status === "published" || status === "approved";
}

/** Statuts pour lesquels l'absence de média n'est pas bloquante. */
export function sceneAllowsMissingMedia(status: MotionSceneStatus): boolean {
  return (
    status === "draft" ||
    status === "needs-technical-review" ||
    status === "brief-ready" ||
    status === "assets-in-production" ||
    status === "animation-in-production" ||
    status === "review" ||
    status === "blocked" ||
    status === "deprecated"
  );
}
