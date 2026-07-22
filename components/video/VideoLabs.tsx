import type { VideoLab } from "@/lib/video/types";
import { ButtonLink } from "@/components/ui";
import { MediaPlaceholder } from "@/components/video/placeholders/MediaPlaceholder";

type VideoLabsProps = {
  lab?: VideoLab | null;
  className?: string;
};

export function VideoLabs({ lab, className = "" }: VideoLabsProps) {
  if (!lab) {
    return (
      <section className={className} aria-labelledby="video-lab-heading">
        <h2 id="video-lab-heading" className="sr-only">
          Laboratoire
        </h2>
        <MediaPlaceholder variant="lab" compact />
      </section>
    );
  }

  if (lab.status === "coming-soon" || lab.status === "draft") {
    return (
      <section
        className={`rounded-2xl border border-dashed border-border-light bg-surface-elevated p-5 ${className}`}
        aria-labelledby="video-lab-heading"
      >
        <h2 id="video-lab-heading" className="font-bold text-ink">
          {lab.title}
        </h2>
        <MediaPlaceholder
          variant="lab"
          compact
          className="mt-4 border-none bg-transparent"
          title={lab.status === "draft" ? "Laboratoire en rédaction" : undefined}
        />
      </section>
    );
  }

  return (
    <section
      className={`rounded-2xl border border-accent/20 bg-accent/5 p-5 ${className}`}
      aria-labelledby="video-lab-heading"
    >
      <h2 id="video-lab-heading" className="font-bold text-ink">
        {lab.title}
      </h2>
      {lab.description && (
        <p className="mt-2 text-sm text-ink-secondary">{lab.description}</p>
      )}
      {lab.estimatedMinutes != null && (
        <p className="mt-1 text-xs text-ink-tertiary">Durée estimée · {lab.estimatedMinutes} min</p>
      )}
      <ButtonLink href={lab.href} className="mt-4">
        Ouvrir le laboratoire →
      </ButtonLink>
    </section>
  );
}
