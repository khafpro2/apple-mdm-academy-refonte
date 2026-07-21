import type {
  MotionAssetCategory,
  MotionAssetFormat,
  MotionAssetStatus,
  MotionMediaStatus,
  MotionSceneStatus,
} from "@/lib/motion/statuses";

export type {
  MotionAssetCategory,
  MotionAssetFormat,
  MotionAssetStatus,
  MotionMediaStatus,
  MotionSceneStatus,
};

/** Texte alternatif / accessibilité d'une scène ou d'un asset. */
export type MotionAccessibility = {
  /** Texte alternatif obligatoire pour les assets non décoratifs. */
  altText: string;
  /** Description longue optionnelle (ARIA / transcript enrichi). */
  longDescription?: string;
  /** true si l'asset est purement décoratif (alt vide autorisé). */
  decorative?: boolean;
};

/** Pistes de narration associées à une scène. */
export type MotionNarration = {
  /** Message principal affiché / lu. */
  primaryMessage: string;
  /** Script de voix-off (texte). */
  voiceoverScript?: string;
  /** Locale BCP-47 (ex. fr-FR). */
  locale?: string;
};

/**
 * Média vidéo / sous-titres / transcript d'une scène.
 * Chemins relatifs à la racine publique (commencent par `/`).
 */
export type MotionMedia = {
  status: MotionMediaStatus;
  /** Poster / vignette (webp, png, svg, jpg). */
  posterPath?: string;
  /** Fichier MP4. */
  mp4Path?: string;
  /** Fichier WebM (optionnel mais recommandé). */
  webmPath?: string;
  /** Sous-titres WebVTT. */
  vttPath?: string;
  /** Transcript texte (md/txt). */
  transcriptPath?: string;
  /** Durée déclarée du média en secondes (si connue). */
  durationSeconds?: number;
};

/** Asset graphique ou média référencé par une ou plusieurs scènes. */
export type MotionAsset = {
  id: string;
  title: string;
  category: MotionAssetCategory;
  status: MotionAssetStatus;
  format: MotionAssetFormat;
  /** Chemin public (`/media/motion/...` ou `/video-assets/...`). Absent si status=missing|planned. */
  path?: string;
  version: string;
  accessibility: MotionAccessibility;
  /** Scènes qui référencent cet asset. */
  sceneIds: string[];
  notes?: string;
};

/** Métadonnées structurées d'une scène motion (source de vérité). */
export type MotionScene = {
  id: string;
  slug: string;
  title: string;
  /** Durée cible en secondes (> 0). */
  durationSeconds: number;
  status: MotionSceneStatus;
  version: string;
  /** Au moins un objectif pédagogique. */
  objectives: string[];
  narration: MotionNarration;
  accessibility: MotionAccessibility;
  /** Slugs de cours LMS liés (validés contre le catalogue quand possible). */
  courseIds: string[];
  /** Identifiants d'assets du registre. */
  assetIds: string[];
  media?: MotionMedia;
  /** Module / thème libre. */
  module?: string;
  level?: string;
  labSlug?: string;
  quizSlug?: string;
  notes?: string;
};

/** Entrée du registre agrégé (scène + assets résolus). */
export type MotionRegistryEntry = {
  scene: MotionScene;
  assets: MotionAsset[];
};
