/**
 * Modèles de données du moteur vidéo — prêts à recevoir le contenu de production.
 * Aucun contenu fictif : les registres restent vides jusqu'à import.
 */

/** État de disponibilité d'un média vidéo */
export type VideoAvailabilityStatus =
  | "loading"
  | "ready"
  | "missing"
  | "coming-soon"
  | "error";

/** Source vidéo (streaming ou fichier local) */
export type VideoSourceFormat = "mp4" | "webm" | "hls" | "dash";

export type VideoSource = {
  src: string;
  format: VideoSourceFormat;
  /** Qualité ou label (ex. « 1080p », « auto ») */
  label?: string;
  /** Bande passante estimée en kbps pour le préchargement adaptatif */
  bandwidthKbps?: number;
};

/** Chapitre navigable dans une vidéo */
export type VideoChapter = {
  id: string;
  title: string;
  startSeconds: number;
  endSeconds?: number;
  description?: string;
  thumbnailUrl?: string;
};

/** Segment de transcription synchronisé */
export type VideoTranscriptSegment = {
  id: string;
  startSeconds: number;
  endSeconds?: number;
  text: string;
  speaker?: string;
};

/** Transcription complète d'une vidéo */
export type VideoTranscript = {
  language: string;
  label?: string;
  segments: VideoTranscriptSegment[];
  /** Texte brut complet (optionnel, pour recherche/export) */
  fullText?: string;
};

/** Piste de sous-titres (WebVTT ou équivalent) */
export type VideoSubtitle = {
  language: string;
  label: string;
  src: string;
  default?: boolean;
  kind?: "subtitles" | "captions" | "descriptions";
};

/** Ressource téléchargeable associée à une vidéo */
export type VideoResource = {
  id: string;
  title: string;
  description?: string;
  href: string;
  mimeType?: string;
  fileSizeBytes?: number;
  type?: "pdf" | "checklist" | "config" | "script" | "archive" | "other";
};

/** Laboratoire interactif lié à une vidéo */
export type VideoLab = {
  slug: string;
  title: string;
  description?: string;
  href: string;
  estimatedMinutes?: number;
  status?: "ready" | "coming-soon" | "draft";
};

/** Illustration ou visuel associé à une vidéo */
export type VideoIllustration = {
  id: string;
  title?: string;
  assetRef: string;
  caption?: string;
  timestampSeconds?: number;
};

/** Asset motion (Lottie, animation CSS, séquence) */
export type MotionAssetKind = "lottie" | "css" | "svg-sequence" | "video-loop";

export type MotionAsset = {
  id: string;
  kind: MotionAssetKind;
  src: string;
  title?: string;
  description?: string;
  loop?: boolean;
  autoplay?: boolean;
  posterUrl?: string;
};

/** Référence storyboard (production graphique) */
export type StoryboardReference = {
  id: string;
  title: string;
  status: "draft" | "review" | "approved" | "production";
  thumbnailUrl?: string;
  sceneCount?: number;
  updatedAt?: string;
  notes?: string;
};

/** Série ou collection de vidéos */
export type VideoSeries = {
  slug: string;
  title: string;
  description?: string;
  courseSlug?: string;
  trackSlug?: string;
  videoSlugs: string[];
  order?: number;
};

/** Métadonnées principales d'une vidéo pédagogique */
export type VideoMetadata = {
  slug: string;
  title: string;
  description?: string;
  status: VideoAvailabilityStatus;
  durationSeconds?: number;
  posterUrl?: string;
  sources?: VideoSource[];
  chapters?: VideoChapter[];
  transcript?: VideoTranscript;
  subtitles?: VideoSubtitle[];
  resources?: VideoResource[];
  lab?: VideoLab;
  quizSlug?: string;
  illustrations?: VideoIllustration[];
  storyboardRef?: StoryboardReference;
  seriesSlug?: string;
  courseSlug?: string;
  lessonSlug?: string;
  trackSlug?: string;
  tags?: string[];
  publishedAt?: string;
  updatedAt?: string;
  /** Message d'erreur si status === "error" */
  errorMessage?: string;
};

/** Bundle complet pour le lecteur et la page vidéo */
export type VideoLessonBundle = {
  metadata: VideoMetadata;
  relatedCourses?: { slug: string; title: string; href: string }[];
  certificateEligible?: boolean;
  certificateHref?: string;
};

/** Props communes aux composants layout vidéo */
export type VideoLayoutContext = {
  metadata: VideoMetadata;
  currentSeconds: number;
  durationSeconds: number;
  isPlaying: boolean;
  onSeek: (seconds: number) => void;
};
