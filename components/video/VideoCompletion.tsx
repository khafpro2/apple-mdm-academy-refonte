"use client";

import { ButtonLink } from "@/components/ui";

type VideoCompletionProps = {
  progressPercent?: number;
  completed?: boolean;
  onMarkComplete?: () => void;
  className?: string;
};

export function VideoCompletion({
  progressPercent = 0,
  completed = false,
  onMarkComplete,
  className = "",
}: VideoCompletionProps) {
  const rounded = Math.round(Math.min(100, Math.max(0, progressPercent)));

  return (
    <section
      className={`rounded-2xl border border-border-light bg-surface-elevated p-5 ${className}`}
      aria-labelledby="video-completion-heading"
    >
      <h2 id="video-completion-heading" className="font-bold text-ink">
        Progression
      </h2>
      <div
        className="mt-4 h-2 rounded-full bg-border-light"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={rounded}
        aria-label={`Progression vidéo : ${rounded} pour cent`}
      >
        <div
          className={`h-2 rounded-full transition-all duration-500 ${completed ? "bg-emerald-500" : "bg-accent"}`}
          style={{ width: `${rounded}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-ink-secondary">
        {completed
          ? "Vidéo terminée — félicitations !"
          : rounded >= 80
            ? "Vous êtes presque au bout — terminez la vidéo pour valider votre progression."
            : `${rounded} % visionné`}
      </p>
      {!completed && onMarkComplete && rounded >= 95 && (
        <button
          type="button"
          onClick={onMarkComplete}
          className="mt-4 min-h-11 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Marquer comme terminé
        </button>
      )}
    </section>
  );
}

type VideoCertificateCTAProps = {
  eligible?: boolean;
  certificateHref?: string;
  courseTitle?: string;
  className?: string;
};

export function VideoCertificateCTA({
  eligible = false,
  certificateHref,
  courseTitle,
  className = "",
}: VideoCertificateCTAProps) {
  if (!eligible || !certificateHref) {
    return (
      <section
        className={`rounded-2xl border border-dashed border-border-light bg-surface p-5 ${className}`}
        aria-labelledby="video-certificate-heading"
      >
        <h2 id="video-certificate-heading" className="font-bold text-ink">
          Certification
        </h2>
        <p className="mt-2 text-sm text-ink-secondary">
          Complétez le parcours associé pour débloquer votre attestation de compétences.
        </p>
      </section>
    );
  }

  return (
    <section
      className={`rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 ${className}`}
      aria-labelledby="video-certificate-heading"
    >
      <h2 id="video-certificate-heading" className="font-bold text-ink">
        Certification disponible
      </h2>
      <p className="mt-2 text-sm text-ink-secondary">
        {courseTitle
          ? `Vous pouvez obtenir votre attestation pour « ${courseTitle} ».`
          : "Votre attestation de compétences est prête à être générée."}
      </p>
      <ButtonLink href={certificateHref} className="mt-4" variant="secondary">
        Obtenir le certificat →
      </ButtonLink>
    </section>
  );
}
