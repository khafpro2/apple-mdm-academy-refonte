import Link from "next/link";
import type { AcademyResource } from "@/src/lib/resources";

export type VideoResourceLink = {
  href: string;
  label: string;
  download?: boolean;
  description?: string;
};

export function VideoResources({
  title = "Ressources associées",
  links,
  academyResources = [],
}: {
  title?: string;
  links: VideoResourceLink[];
  academyResources?: AcademyResource[];
}) {
  return (
    <div className="rounded-2xl border border-border-light bg-surface-elevated p-5">
      <h2 className="font-bold text-ink">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-medium text-accent hover:underline"
              {...(link.download ? { download: true } : {})}
            >
              {link.label}
            </Link>
            {link.description && (
              <p className="mt-0.5 text-xs text-ink-tertiary">{link.description}</p>
            )}
          </li>
        ))}
        {academyResources.map((resource) => (
          <li key={resource.slug}>
            <Link href={`/resources/${resource.slug}`} className="font-medium text-accent hover:underline">
              {resource.title}
            </Link>
            <p className="mt-0.5 text-xs text-ink-tertiary">{resource.category}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
