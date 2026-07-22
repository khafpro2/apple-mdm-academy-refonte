import type { ReactNode } from "react";

export type MediaPlaceholderVariant =
  | "video"
  | "illustration"
  | "storyboard"
  | "animation"
  | "lab"
  | "architecture"
  | "quiz"
  | "download"
  | "transcript"
  | "generic";

const VARIANT_CONFIG: Record<
  MediaPlaceholderVariant,
  { icon: string; defaultTitle: string; defaultDescription: string }
> = {
  video: {
    icon: "▶",
    defaultTitle: "Vidéo bientôt disponible",
    defaultDescription: "L'équipe de production finalise cette vidéo pédagogique.",
  },
  illustration: {
    icon: "◻",
    defaultTitle: "Illustration en cours de production",
    defaultDescription: "Un visuel pédagogique sera intégré ici prochainement.",
  },
  storyboard: {
    icon: "▦",
    defaultTitle: "Storyboard en validation",
    defaultDescription: "Le storyboard est en cours de revue par l'équipe pédagogique.",
  },
  animation: {
    icon: "◎",
    defaultTitle: "Animation en préparation",
    defaultDescription: "Une animation interactive sera disponible prochainement.",
  },
  lab: {
    icon: "⚗",
    defaultTitle: "Laboratoire à venir",
    defaultDescription: "Un exercice pratique guidé sera ajouté à cette leçon.",
  },
  architecture: {
    icon: "⬡",
    defaultTitle: "Schéma d'architecture en production",
    defaultDescription: "Un diagramme technique sera publié ici.",
  },
  quiz: {
    icon: "?",
    defaultTitle: "Quiz en préparation",
    defaultDescription: "Les questions d'évaluation seront disponibles avec la vidéo.",
  },
  download: {
    icon: "↓",
    defaultTitle: "Ressources à venir",
    defaultDescription: "Les fichiers téléchargeables seront publiés prochainement.",
  },
  transcript: {
    icon: "≡",
    defaultTitle: "Transcription en cours",
    defaultDescription: "La transcription sera disponible avec la publication de la vidéo.",
  },
  generic: {
    icon: "…",
    defaultTitle: "Contenu en préparation",
    defaultDescription: "Cette section sera complétée prochainement.",
  },
};

type MediaPlaceholderProps = {
  variant?: MediaPlaceholderVariant;
  title?: string;
  description?: string;
  compact?: boolean;
  className?: string;
  children?: ReactNode;
  /** Affiche un indicateur de chargement animé */
  loading?: boolean;
};

export function MediaPlaceholder({
  variant = "generic",
  title,
  description,
  compact = false,
  className = "",
  children,
  loading = false,
}: MediaPlaceholderProps) {
  const config = VARIANT_CONFIG[variant];
  const displayTitle = title ?? config.defaultTitle;
  const displayDescription = description ?? config.defaultDescription;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={displayTitle}
      className={`relative overflow-hidden rounded-2xl border border-dashed border-border-light bg-gradient-to-br from-surface via-surface-elevated to-indigo-50/30 ${
        compact ? "px-5 py-8" : "px-6 py-12 sm:px-10 sm:py-16"
      } ${className}`}
    >
      {loading && (
        <div
          className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent"
          aria-hidden="true"
        />
      )}
      <div className="relative mx-auto max-w-md text-center">
        <div
          className={`mx-auto flex items-center justify-center rounded-2xl bg-white/80 font-semibold text-ink-tertiary shadow-sm ring-1 ring-border-light/80 ${
            compact ? "h-12 w-12 text-lg" : "h-16 w-16 text-2xl"
          }`}
          aria-hidden="true"
        >
          {config.icon}
        </div>
        <p className={`mt-5 font-semibold text-ink ${compact ? "text-base" : "text-lg"}`}>
          {displayTitle}
        </p>
        <p className={`mt-2 leading-relaxed text-ink-secondary ${compact ? "text-xs" : "text-sm"}`}>
          {displayDescription}
        </p>
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
}

/** Placeholders pré-configurés pour usage direct */
export function VideoComingSoonPlaceholder(props: Omit<MediaPlaceholderProps, "variant">) {
  return <MediaPlaceholder variant="video" {...props} />;
}

export function IllustrationProductionPlaceholder(props: Omit<MediaPlaceholderProps, "variant">) {
  return <MediaPlaceholder variant="illustration" {...props} />;
}

export function StoryboardValidationPlaceholder(props: Omit<MediaPlaceholderProps, "variant">) {
  return <MediaPlaceholder variant="storyboard" {...props} />;
}
