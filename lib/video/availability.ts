/** Lifecycle d’affichage LMS pour les vidéos (indépendant des phases de production internes). */

export const VIDEO_AVAILABILITY_STATES = [
  "loading",
  "processing",
  "available",
  "deprecated",
  "missing",
] as const;

export type VideoAvailabilityState = (typeof VIDEO_AVAILABILITY_STATES)[number];

export type VideoAvailabilityInput = {
  /** MP4 présent sur disque sous public/ */
  hasMp4: boolean;
  /** MP4 satisfaisant les critères de publication LMS (si applicable) */
  isPublishable?: boolean;
  /** Marqué déprécié dans le registre / storyboard */
  deprecated?: boolean;
  /** Résolution encore en cours (SSR streaming / client hydration) */
  loading?: boolean;
  /**
   * Entrée absente du catalogue / slug inconnu.
   * Distinct de `processing` (contenu prévu mais pas encore produit).
   */
  missing?: boolean;
};

export type VideoAvailability = {
  state: VideoAvailabilityState;
  label: string;
  /** true uniquement si un lecteur MP4 réel peut être monté */
  canPlay: boolean;
  description: string;
};

const LABELS: Record<VideoAvailabilityState, string> = {
  loading: "Chargement",
  processing: "En production",
  available: "Disponible",
  deprecated: "Dépréciée",
  missing: "Introuvable",
};

const DESCRIPTIONS: Record<VideoAvailabilityState, string> = {
  loading: "Vérification de la disponibilité du média…",
  processing: "La vidéo est en cours de production — le player MP4 n’est pas affiché.",
  available: "Vidéo complète disponible à la lecture.",
  deprecated: "Cette vidéo est dépréciée et n’est plus proposée en lecture.",
  missing: "Cette vidéo n’existe pas dans le catalogue ou a été retirée.",
};

/**
 * Ne jamais exposer un player pour un média incomplet.
 * `available` exige un MP4 (et publishable si le flag est fourni).
 */
export function resolveVideoAvailability(input: VideoAvailabilityInput): VideoAvailability {
  if (input.loading) {
    return {
      state: "loading",
      label: LABELS.loading,
      canPlay: false,
      description: DESCRIPTIONS.loading,
    };
  }

  if (input.missing) {
    return {
      state: "missing",
      label: LABELS.missing,
      canPlay: false,
      description: DESCRIPTIONS.missing,
    };
  }

  if (input.deprecated) {
    return {
      state: "deprecated",
      label: LABELS.deprecated,
      canPlay: false,
      description: DESCRIPTIONS.deprecated,
    };
  }

  const publishable =
    input.isPublishable === undefined ? input.hasMp4 : Boolean(input.isPublishable && input.hasMp4);

  if (publishable) {
    return {
      state: "available",
      label: LABELS.available,
      canPlay: true,
      description: DESCRIPTIONS.available,
    };
  }

  return {
    state: "processing",
    label: LABELS.processing,
    canPlay: false,
    description: DESCRIPTIONS.processing,
  };
}

export function isVideoPlayable(input: VideoAvailabilityInput): boolean {
  return resolveVideoAvailability(input).canPlay;
}
