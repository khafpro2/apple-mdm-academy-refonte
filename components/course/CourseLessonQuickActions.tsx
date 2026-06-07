"use client";

import Link from "next/link";

type Props = {
  courseSlug: string;
  lessonSlug: string;
  labSlug?: string;
  quizHref?: string;
  videoSlug?: string;
  resourceSlug?: string;
};

export function CourseLessonQuickActions({
  courseSlug,
  lessonSlug,
  labSlug,
  quizHref,
  videoSlug,
  resourceSlug,
}: Props) {
  const items = [
    {
      label: "Cours",
      hint: "Sommaire du parcours",
      href: `/cours/${courseSlug}`,
      show: true,
    },
    {
      label: "Lab",
      hint: "Exercice pratique",
      href: labSlug ? `/labs/${labSlug}` : undefined,
      show: Boolean(labSlug),
    },
    {
      label: "Quiz",
      hint: "Valider vos acquis",
      href: quizHref,
      show: Boolean(quizHref),
    },
    {
      label: "Vidéo",
      hint: videoSlug ? "Module illustré" : undefined,
      href: videoSlug ? `/videos/${videoSlug}` : undefined,
      show: Boolean(videoSlug),
    },
    {
      label: "PDF",
      hint: "Guide téléchargeable",
      href: resourceSlug ? `/resources/${resourceSlug}` : undefined,
      show: Boolean(resourceSlug),
    },
  ].filter((item) => item.show && item.href);

  if (items.length === 0) return null;

  return (
    <aside
      className="mt-6 rounded-2xl border border-border-light bg-surface-elevated p-4 shadow-sm"
      aria-label="Raccourcis d'apprentissage"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">
        Continuer l&apos;apprentissage
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href!}
            title={item.hint}
            className="inline-flex flex-col rounded-xl border border-border-light bg-surface px-3 py-2 transition hover:border-accent/40 hover:shadow-sm"
          >
            <span className="text-sm font-semibold text-ink">{item.label}</span>
            {item.hint && <span className="text-[10px] text-ink-tertiary">{item.hint}</span>}
          </Link>
        ))}
      </div>
      <p className="mt-3 text-xs text-ink-tertiary">
        Leçon en cours : <span className="font-medium text-ink-secondary">{lessonSlug}</span>
      </p>
    </aside>
  );
}
