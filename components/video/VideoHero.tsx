import type { VideoMetadata } from "@/lib/video/types";
import { Badge } from "@/components/ui";

type VideoHeroProps = {
  metadata?: VideoMetadata | null;
  title?: string;
  description?: string;
  moduleLabel?: string;
  className?: string;
};

export function VideoHero({
  metadata,
  title,
  description,
  moduleLabel,
  className = "",
}: VideoHeroProps) {
  const displayTitle = title ?? metadata?.title;
  const displayDescription = description ?? metadata?.description;
  const hasContent = Boolean(displayTitle);

  if (!hasContent) {
    return (
      <header
        className={`overflow-hidden rounded-[2rem] border border-dashed border-border-light bg-surface-elevated px-6 py-10 md:px-10 ${className}`}
        aria-label="En-tête vidéo"
      >
        <p className="text-sm font-medium text-ink-tertiary">Titre et description à définir</p>
      </header>
    );
  }

  return (
    <header
      className={`overflow-hidden rounded-[2rem] border border-border-light bg-gradient-to-br from-surface via-surface-elevated to-indigo-50/40 px-6 py-8 shadow-sm md:px-10 md:py-10 ${className}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        {moduleLabel && <Badge variant="accent">{moduleLabel}</Badge>}
        {metadata?.tags?.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
        {metadata?.status === "coming-soon" && <Badge variant="warning">Bientôt disponible</Badge>}
      </div>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink md:text-3xl lg:text-4xl">
        {displayTitle}
      </h1>
      {displayDescription && (
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-secondary">{displayDescription}</p>
      )}
    </header>
  );
}
