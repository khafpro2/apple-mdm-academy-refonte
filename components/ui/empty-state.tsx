import Link from "next/link";
import { ButtonLink } from "@/components/ui";

type RecommendedLink = {
  href: string;
  label: string;
};

const DEFAULT_RECOMMENDED: RecommendedLink[] = [
  { href: "/parcours", label: "Parcours" },
  { href: "/cours", label: "Cours" },
  { href: "/examens", label: "Examens blancs" },
];

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
  recommendedLinks = DEFAULT_RECOMMENDED,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  recommendedLinks?: RecommendedLink[];
}) {
  return (
    <div className="rounded-3xl border border-dashed border-border-light bg-surface-elevated px-6 py-12 text-center">
      <p className="text-lg font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-secondary">{description}</p>
      {actionHref && actionLabel && (
        <ButtonLink href={actionHref} className="mt-6" variant="secondary">
          {actionLabel}
        </ButtonLink>
      )}
      {recommendedLinks.length > 0 && (
        <nav aria-label="Contenu recommandé" className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">Contenu recommandé</p>
          <ul className="mt-3 flex flex-wrap justify-center gap-2">
            {recommendedLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex rounded-full border border-border-light px-4 py-2 text-sm font-semibold text-ink-secondary transition hover:border-accent/40 hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

/** Fallback standard — contenu pas encore publié */
export function ContentPreparationFallback({
  backHref = "/parcours",
  backLabel = "Retour aux parcours",
}: {
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <EmptyState
      title="Contenu en préparation"
      description="Ce module sera disponible prochainement. En attendant, explorez nos parcours, cours et examens blancs."
      actionHref={backHref}
      actionLabel={backLabel}
    />
  );
}
