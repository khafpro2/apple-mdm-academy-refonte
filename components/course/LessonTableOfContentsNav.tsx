"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ButtonLink } from "@/components/ui";

const SECTION_IDS = [
  "objectifs",
  "prerequis",
  "theorie",
  "comparatif",
  "etapes",
  "captures",
  "bonnes-pratiques",
  "depannage",
  "resume",
  "quiz-final",
] as const;

type TocLink = { href: string; label: string; id: string };

function buildLinks(showComparison: boolean): TocLink[] {
  return [
    { id: "objectifs", href: "#objectifs", label: "Objectifs" },
    { id: "prerequis", href: "#prerequis", label: "Prérequis" },
    { id: "theorie", href: "#theorie", label: "Théorie" },
    ...(showComparison ? [{ id: "comparatif", href: "#comparatif", label: "Comparatif" }] : []),
    { id: "etapes", href: "#etapes", label: "Étapes" },
    { id: "captures", href: "#captures", label: "Captures" },
    { id: "bonnes-pratiques", href: "#bonnes-pratiques", label: "Bonnes pratiques" },
    { id: "depannage", href: "#depannage", label: "Dépannage" },
    { id: "resume", href: "#resume", label: "Résumé" },
    { id: "quiz-final", href: "#quiz-final", label: "Quiz" },
  ];
}

function linkClass(active: boolean, variant: "sidebar" | "pill"): string {
  if (variant === "pill") {
    return active
      ? "shrink-0 rounded-full border border-accent bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent"
      : "shrink-0 rounded-full border border-border-light bg-surface-elevated px-3 py-1.5 text-xs font-medium text-ink-secondary";
  }
  return active
    ? "text-sm font-semibold text-accent"
    : "text-sm text-ink-secondary transition hover:text-accent";
}

export function LessonTableOfContentsNav({
  mobile = false,
  showComparison = false,
}: {
  mobile?: boolean;
  showComparison?: boolean;
}) {
  const links = useMemo(() => buildLinks(showComparison), [showComparison]);
  const [activeId, setActiveId] = useState<string>("objectifs");

  useEffect(() => {
    const ids = links.map((l) => l.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [links]);

  if (mobile) {
    return (
      <nav className="lg:hidden" aria-label="Sommaire de la leçon">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-tertiary">
          Sections · {links.find((l) => l.id === activeId)?.label ?? "Navigation"}
        </p>
        <div className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 [mask-image:linear-gradient(to_right,transparent,black_12px,black_calc(100%-12px),transparent)]">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`snap-start ${linkClass(link.id === activeId, "pill")}`}
              aria-current={link.id === activeId ? "location" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav className="hidden lg:block" aria-label="Sommaire de la leçon">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">Sommaire</p>
      <ul className="mt-4 space-y-2 border-l border-border-light pl-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`block border-l-2 py-0.5 pl-3 -ml-3 ${
                link.id === activeId ? "border-accent" : "border-transparent"
              } ${linkClass(link.id === activeId, "sidebar")}`}
              aria-current={link.id === activeId ? "location" : undefined}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-6 rounded-xl border border-border-light bg-surface p-3">
        <p className="text-xs font-semibold text-ink">Astuce lecture</p>
        <p className="mt-1 text-xs leading-relaxed text-ink-tertiary">
          Activez le mode lecture pour une colonne plus étroite et une meilleure concentration.
        </p>
        <ButtonLink href="#lecture-toolbar" variant="secondary" className="mt-3 w-full text-xs">
          Aller aux outils
        </ButtonLink>
      </div>
    </nav>
  );
}

export { SECTION_IDS };
