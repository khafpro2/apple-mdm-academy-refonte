import type { ComparisonFeature } from "@/lib/pricing/types";

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <span className="text-accent font-bold">✓</span>;
  if (value === false) return <span className="text-ink-tertiary">—</span>;
  return <span className="text-sm text-ink-secondary">{value}</span>;
}

export function PricingComparison({ features }: { features: ComparisonFeature[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border-light bg-surface-elevated">
      <table className="w-full min-w-[540px] text-sm">
        <thead>
          <tr className="border-b border-border-light text-left">
            <th className="p-4 font-semibold text-ink">Fonctionnalité</th>
            <th className="p-4 font-semibold text-ink">Gratuit</th>
            <th className="p-4 font-semibold text-accent">Pro</th>
            <th className="p-4 font-semibold text-ink">Entreprise</th>
          </tr>
        </thead>
        <tbody>
          {features.map((f) => (
            <tr key={f.label} className="border-b border-border-light last:border-0">
              <td className="p-4 font-medium text-ink">{f.label}</td>
              <td className="p-4"><Cell value={f.free} /></td>
              <td className="p-4 bg-accent/5"><Cell value={f.pro} /></td>
              <td className="p-4"><Cell value={f.enterprise} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
