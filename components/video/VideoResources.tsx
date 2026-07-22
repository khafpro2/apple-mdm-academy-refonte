import type { VideoResource } from "@/lib/video/types";
import { formatFileSize } from "@/lib/video/format-time";
import { MediaPlaceholder } from "@/components/video/placeholders/MediaPlaceholder";

type VideoResourcesProps = {
  resources?: VideoResource[];
  className?: string;
};

export function VideoResources({ resources = [], className = "" }: VideoResourcesProps) {
  if (resources.length === 0) {
    return (
      <section className={className} aria-labelledby="video-resources-heading">
        <h2 id="video-resources-heading" className="sr-only">
          Ressources téléchargeables
        </h2>
        <MediaPlaceholder variant="download" compact />
      </section>
    );
  }

  return (
    <section
      className={`rounded-2xl border border-border-light bg-surface-elevated p-5 ${className}`}
      aria-labelledby="video-resources-heading"
    >
      <h2 id="video-resources-heading" className="font-bold text-ink">
        Ressources téléchargeables
      </h2>
      <ul className="mt-4 space-y-3">
        {resources.map((r) => (
          <li
            key={r.id}
            className="flex flex-col gap-3 rounded-xl bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="font-medium text-ink">{r.title}</p>
              {r.description && (
                <p className="mt-1 text-xs text-ink-tertiary">{r.description}</p>
              )}
              <p className="mt-1 text-xs text-ink-tertiary">
                {[r.type?.toUpperCase(), formatFileSize(r.fileSizeBytes)].filter(Boolean).join(" · ")}
              </p>
            </div>
            <a
              href={r.href}
              download
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-border-light px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Télécharger
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
