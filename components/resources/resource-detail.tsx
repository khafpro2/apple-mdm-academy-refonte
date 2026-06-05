"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { AcademyResource } from "@/src/lib/resources";
import { getCategoryLabel, getResource, resourceToPlainText } from "@/src/lib/resources";
import { downloadResourcePdf } from "@/lib/resources/export-pdf";
import { saveResourceView } from "@/lib/resources/progress-storage";
import { Badge, ButtonLink } from "@/components/ui";

type Props = {
  resource: AcademyResource;
};

export function ResourceDetail({ resource }: Props) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    saveResourceView({
      resourceSlug: resource.slug,
      title: resource.title,
      href: `/resources/${resource.slug}`,
    });
  }, [resource.slug, resource.title]);

  const related = (resource.relatedResourceSlugs ?? [])
    .map((slug) => getResource(slug))
    .filter(Boolean) as AcademyResource[];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(resourceToPlainText(resource));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePdf = async () => {
    setExporting(true);
    try {
      await downloadResourcePdf(resource);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <div className="space-y-6">
        <header className="rounded-2xl border border-border-light bg-surface-elevated p-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="accent">{resource.badge}</Badge>
            <Badge variant="default">{getCategoryLabel(resource.category)}</Badge>
            <Badge variant="default">{resource.level}</Badge>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-ink">{resource.title}</h1>
          <p className="mt-2 text-ink-secondary">{resource.description}</p>
          <p className="mt-2 text-sm text-ink-tertiary">Module : {resource.module}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handlePdf}
              disabled={exporting}
              className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {exporting ? "Export…" : "Télécharger PDF"}
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink hover:bg-surface"
            >
              {copied ? "Copié ✓" : "Copier"}
            </button>
            <ButtonLink href={`/cours/${resource.relatedCourseSlug}`} variant="secondary">
              Voir le cours
            </ButtonLink>
            <ButtonLink href={`/labs/${resource.relatedLabSlug}`} variant="secondary">
              Faire le lab
            </ButtonLink>
          </div>
        </header>

        <div className="space-y-6">
          {resource.sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-border-light bg-surface-elevated p-6">
              <h2 className="text-lg font-bold text-ink">{section.title}</h2>
              <ul className="mt-4 space-y-3">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-ink-secondary">
                    <span className="mt-0.5 shrink-0 text-accent" aria-hidden="true">☐</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-border-light bg-surface-elevated p-5">
          <h3 className="font-bold text-ink">Actions rapides</h3>
          <div className="mt-4 flex flex-col gap-2">
            <button type="button" onClick={handlePdf} disabled={exporting} className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">
              PDF
            </button>
            <button type="button" onClick={handleCopy} className="rounded-xl border border-border-light px-4 py-2 text-sm font-semibold">
              Copier le contenu
            </button>
          </div>
        </div>

        {related.length > 0 && (
          <div className="rounded-2xl border border-border-light bg-surface-elevated p-5">
            <h3 className="font-bold text-ink">Ressources liées</h3>
            <ul className="mt-4 space-y-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/resources/${r.slug}`} className="text-sm font-medium text-accent hover:underline">
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link href="/resources" className="block text-sm font-semibold text-accent hover:underline">
          ← Toutes les ressources
        </Link>
      </aside>
    </div>
  );
}
