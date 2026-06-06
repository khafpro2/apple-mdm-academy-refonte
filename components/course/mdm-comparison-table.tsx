import type { MdmComparisonRow } from "@/lib/data/alternative-mdm-tracks/comparison-table";

type Props = {
  rows: MdmComparisonRow[];
  highlightVendor?: string;
};

export function MdmComparisonTable({ rows, highlightVendor }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border-light shadow-sm">
      <table className="w-full min-w-[880px] text-left text-sm">
        <thead>
          <tr className="border-b border-border-light bg-surface text-xs font-semibold uppercase tracking-wide text-ink-tertiary">
            <th className="px-4 py-3">Solution</th>
            <th className="px-4 py-3">Points forts</th>
            <th className="px-4 py-3">Limites</th>
            <th className="px-4 py-3">Cas d&apos;usage</th>
            <th className="px-4 py-3">Coût indicatif*</th>
            <th className="px-4 py-3">Difficulté déploiement</th>
            <th className="px-4 py-3">Public cible</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const highlighted = highlightVendor && row.vendor.toLowerCase().includes(highlightVendor.toLowerCase());
            return (
              <tr
                key={row.vendor}
                className={`border-b border-border-light/70 align-top ${highlighted ? "bg-accent/5" : "bg-surface-elevated"}`}
              >
                <td className="px-4 py-4 font-semibold text-ink">{row.vendor}</td>
                <td className="px-4 py-4 text-ink-secondary">{row.strengths}</td>
                <td className="px-4 py-4 text-ink-secondary">{row.limits}</td>
                <td className="px-4 py-4 text-ink-secondary">{row.useCases}</td>
                <td className="px-4 py-4 text-ink-secondary">{row.costPlaceholder}</td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      row.deployDifficulty === "Faible"
                        ? "bg-green-100 text-green-800"
                        : row.deployDifficulty === "Moyenne"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {row.deployDifficulty}
                  </span>
                </td>
                <td className="px-4 py-4 text-ink-secondary">{row.targetAudience}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="border-t border-border-light bg-surface px-4 py-2 text-xs text-ink-tertiary">
        * Coûts indicatifs placeholder — contacter les éditeurs pour un devis réel. TCO = licences + admin + migration + formation.
      </p>
    </div>
  );
}
