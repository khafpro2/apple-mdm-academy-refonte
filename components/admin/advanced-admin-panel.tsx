"use client";

import { Button } from "@/components/ui";
import { advancedTrackAdminStats, advancedStatsToCsv, expertLabSlugs } from "@/lib/data/advanced-tracks/admin-stats";

export function AdvancedAdminPanel() {
  function exportCsv() {
    const csv = advancedStatsToCsv(advancedTrackAdminStats);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "advanced-tracks-stats.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="mt-10 rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-ink">Parcours avancés — Jamf 300 / 400 & Expert</h2>
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
            {advancedTrackAdminStats.map((s) => (
              <tr key={s.trackSlug} className="border-b border-border-light">
                <td className="py-3 pr-4 font-medium text-ink">{s.title}</td>
                <td className="py-3 pr-4 text-ink-secondary">{s.enrolled}</td>
                <td className="py-3 pr-4 text-ink-secondary">{s.avgProgress}%</td>
                <td className="py-3 pr-4 text-ink-secondary">{s.examPassRate}%</td>
                <td className="py-3 text-ink-secondary">{s.labsCompleted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-ink-tertiary">
        Labs experts ({expertLabSlugs.length}) : {expertLabSlugs.join(", ")}
      </p>
    </section>
  );
}
