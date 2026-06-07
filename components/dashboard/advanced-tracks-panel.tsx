import Link from "next/link";
import { Card, ProgressBar, ButtonLink } from "@/components/ui";
import { TrackLogo } from "@/components/ui/track-logo";
import { advancedTrackMeta } from "@/lib/data/advanced-tracks/module-definitions";
import { getExamRouteSlugs } from "@/lib/data/exams/pools";

const advancedExamRoutes = ["jamf-300", "jamf-400", "apple-enterprise-expert", "apple-enterprise-architect", "apple-deployment", "apple-security", "intune-apple-advanced"];

export function AdvancedTracksPanel() {
  return (
    <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-ink-tertiary">Expert</p>
          <h2 className="text-lg font-bold text-ink">Parcours avancés</h2>
          <p className="mt-1 text-sm text-ink-secondary">Jamf 300/400, Apple Enterprise Expert et Intune Apple Advanced.</p>
        </div>
        <ButtonLink href="/parcours" variant="secondary" size="sm">
          Catalogue
        </ButtonLink>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {advancedTrackMeta.map((track) => (
          <Card key={track.slug} hover className="p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <TrackLogo logo={track.logo} alt={track.title} />
                <h3 className="mt-2 font-bold text-ink">{track.title}</h3>
                <p className="mt-1 text-xs text-ink-tertiary">{track.level} · {track.lessons} modules · {track.duration}</p>
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
        <h3 className="text-sm font-bold text-ink">Examens avancés disponibles</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {advancedExamRoutes.filter((r) => getExamRouteSlugs().includes(r)).map((slug) => (
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
        <p className="text-sm font-semibold text-ink">Recommandations personnalisées</p>
        <ul className="mt-2 space-y-1 text-sm text-ink-secondary">
          <li>• Complétez Jamf 200 avant Jamf 300 Prep</li>
          <li>• Lab <Link href="/labs/jamf-api" className="text-accent hover:underline">jamf-api</Link> recommandé après module API</li>
          <li>• Badge <strong>Jamf API Expert</strong> via modules API et webhooks</li>
        </ul>
      </div>
    </section>
  );
}
