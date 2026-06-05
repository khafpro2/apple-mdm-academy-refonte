import Link from "next/link";
import { Card, ProgressBar, ButtonLink } from "@/components/ui";
import { altMdmTrackMeta } from "@/lib/data/alternative-mdm-tracks/module-definitions";
import { getExamRouteSlugs } from "@/lib/data/exams/pools";

const altMdmExamRoutes = [
  "kandji-fundamentals",
  "mosyle-fundamentals",
  "addigy-fundamentals",
  "workspace-one-apple",
];

export function AltMdmTracksPanel() {
  return (
    <section className="mt-8 rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-ink-tertiary">Phase 14</p>
          <h2 className="text-lg font-bold text-ink">MDM alternatifs Apple</h2>
          <p className="mt-1 text-sm text-ink-secondary">
            Kandji, Mosyle, Addigy, Workspace ONE et comparatif MDM Enterprise.
          </p>
        </div>
        <ButtonLink href="/parcours" variant="secondary" size="sm">
          Catalogue
        </ButtonLink>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {altMdmTrackMeta.map((track) => (
          <Card key={track.slug} hover className="p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-2xl">{track.icon}</span>
                <h3 className="mt-2 font-bold text-ink">{track.title}</h3>
                <p className="mt-1 text-xs text-ink-tertiary">
                  {track.level} · {track.lessons} modules · {track.duration}
                </p>
              </div>
              <Link href={`/cours/${track.slug}`} className="text-sm font-semibold text-accent hover:underline">
                Commencer →
              </Link>
            </div>
            <ProgressBar value={0} className="mt-4" />
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <h3 className="text-sm font-bold text-ink">Examens MDM alternatifs</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {altMdmExamRoutes.filter((r) => getExamRouteSlugs().includes(r)).map((slug) => (
            <Link
              key={slug}
              href={`/examens/${slug}`}
              className="rounded-full border border-border-light bg-surface px-4 py-2 text-sm font-medium text-ink-secondary hover:border-accent hover:text-accent"
            >
              {slug.replace(/-/g, " ")}
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-6 rounded-2xl bg-surface p-4">
        <p className="text-sm font-semibold text-ink">Labs recommandés</p>
        <ul className="mt-2 space-y-1 text-sm text-ink-secondary">
          <li>
            • <Link href="/labs/kandji-blueprint" className="text-accent hover:underline">kandji-blueprint</Link> après module Blueprints
          </li>
          <li>
            • <Link href="/labs/mdm-comparison" className="text-accent hover:underline">mdm-comparison</Link> pour le parcours comparatif
          </li>
        </ul>
      </div>
    </section>
  );
}
