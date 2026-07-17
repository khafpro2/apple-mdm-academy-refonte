"use client";

import type { AltMdmTrackAdminStat } from "@/lib/data/alternative-mdm-tracks/admin-stats";

type Props = {
  stats?: AltMdmTrackAdminStat[];
  fromDatabase?: boolean;
};

/**
 * Panneau admin Phase 14 — V1 : parcours MDM alternatifs retirés du produit.
 * Conservé pour éviter de casser l'import admin ; n'affiche rien tant qu'il n'y a pas de stats.
 */
export function AltMdmAdminPanel({ stats }: Props) {
  if (!stats || stats.length === 0) return null;

  return (
    <section className="mt-10 rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-bold text-ink">Parcours complémentaires (hors V1 publique)</h2>
        <p className="mt-1 text-xs text-ink-tertiary">
          Contenus masqués ou archivés — non exposés sur le catalogue public.
        </p>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-light text-left text-ink-tertiary">
              <th className="py-2 pr-4">Parcours</th>
              <th className="py-2 pr-4">Inscrits</th>
              <th className="py-2 pr-4">Progression moy.</th>
              <th className="py-2 pr-4">Réussite examen</th>
              <th className="py-2">Labs complétés</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((row) => (
              <tr key={row.trackSlug} className="border-b border-border-light/60">
                <td className="py-3 pr-4 font-medium text-ink">{row.title}</td>
                <td className="py-3 pr-4">{row.enrolled}</td>
                <td className="py-3 pr-4">{row.avgProgress}%</td>
                <td className="py-3 pr-4">{row.examPassRate}%</td>
                <td className="py-3">{row.labsCompleted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
