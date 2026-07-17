import Link from "next/link";
import { Card, ProgressBar, ButtonLink } from "@/components/ui";
import { TrackLogo } from "@/components/ui/track-logo";
import { altMdmTrackMeta } from "@/lib/data/alternative-mdm-tracks/module-definitions";
import { isTrackVisible } from "@/lib/data/tracks";

/**
 * Ancien panneau Phase 14 (MDM alternatifs).
 * V1 : ne rien afficher — Kandji/Mosyle/Addigy/WS1 retirés, comparatif masqué.
 */
export function AltMdmTracksPanel() {
  const visibleAltTracks = altMdmTrackMeta.filter((track) => isTrackVisible(track.slug));
  if (visibleAltTracks.length === 0) return null;

  return (
    <section className="mt-8 rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-ink-tertiary">Catalogue étendu</p>
          <h2 className="text-lg font-bold text-ink">Parcours MDM complémentaires</h2>
          <p className="mt-1 text-sm text-ink-secondary">
            Contenus additionnels liés à la gestion Apple Enterprise.
          </p>
        </div>
        <ButtonLink href="/parcours" variant="secondary" size="sm">
          Catalogue
        </ButtonLink>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {visibleAltTracks.map((track) => (
          <Card key={track.slug} hover className="p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <TrackLogo logo={track.logo} alt={track.title} />
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
    </section>
  );
}
