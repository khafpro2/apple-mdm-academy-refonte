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
  titleAs = "p",
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  recommendedLinks?: RecommendedLink[];
  /** Utiliser "h1" sur les pages dédiées (404, états vides pleine page). */
  titleAs?: "p" | "h1" | "h2";
}) {
  const TitleTag = titleAs;
  return (
    <div className="rounded-3xl border border-dashed border-border-light bg-surface-elevated px-5 py-10 text-center sm:px-6 sm:py-12">
      <TitleTag className="text-lg font-semibold text-ink sm:text-xl">{title}</TitleTag>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-secondary">{description}</p>
      {actionHref && actionLabel && (
        <ButtonLink href={actionHref} className="mt-6 min-h-11" variant="secondary">
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
                  className="inline-flex min-h-11 items-center rounded-full border border-border-light px-4 py-2 text-sm font-semibold text-ink-secondary transition hover:border-accent/40 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
