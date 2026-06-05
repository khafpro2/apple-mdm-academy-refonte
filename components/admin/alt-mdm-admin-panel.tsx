"use client";

import { Button } from "@/components/ui";
import {
  altMdmStatsToCsv,
  demoAltMdmTrackAdminStats,
  altMdmLabSlugs,
  type AltMdmTrackAdminStat,
} from "@/lib/data/alternative-mdm-tracks/admin-stats";

type Props = {
  stats?: AltMdmTrackAdminStat[];
  fromDatabase?: boolean;
};

export function AltMdmAdminPanel({ stats, fromDatabase = false }: Props) {
  const rows = stats && stats.length > 0 ? stats : demoAltMdmTrackAdminStats;

  function exportCsv() {
    const csv = altMdmStatsToCsv(rows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "alt-mdm-tracks-stats.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="mt-10 rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-ink">MDM alternatifs — Kandji, Mosyle, Addigy, WS1</h2>
          <p className="mt-1 text-xs text-ink-tertiary">
            {fromDatabase ? "Données Supabase" : "Données démo — Supabase non connecté"}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={exportCsv}>
          Export CSV
        </Button>
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
            {rows.map((row) => (
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
      <p className="mt-4 text-xs text-ink-tertiary">
        Labs Phase 14 : {altMdmLabSlugs.join(", ")}
      </p>
    </section>
  );
}
