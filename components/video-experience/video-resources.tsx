import Link from "next/link";
import type { VideoResourceModel } from "@/components/video-experience/types";

export function VideoResources({
  title = "Ressources",
  resources,
  className = "",
}: {
  title?: string;
  resources: VideoResourceModel[];
  className?: string;
}) {
  if (!resources.length) {
    return (
      <div className={`rounded-2xl border border-dashed border-border-light bg-surface p-5 ${className}`}>
        <h2 className="font-bold text-ink">{title}</h2>
        <p className="mt-2 text-sm text-ink-tertiary">Aucune ressource associée fournie.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-border-light bg-surface-elevated p-5 ${className}`}>
      <h2 className="font-bold text-ink">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {resources.map((resource) => (
          <li key={resource.id}>
            <Link
              href={resource.href}
              className="font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              {...(resource.downloadable ? { download: true } : {})}
            >
              {resource.label}
              {resource.downloadable ? " (télécharger)" : ""}
            </Link>
            {resource.kind && (
              <p className="mt-0.5 text-xs text-ink-tertiary">{resource.kind}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
