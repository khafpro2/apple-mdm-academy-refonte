import type { ValidationIssue } from "@/lib/motion/asset-types";

export function MotionValidationSummary({ issues }: { issues: ValidationIssue[] }) {
  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warning");

  return (
    <section className="rounded-lg border border-border-light bg-surface-elevated p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-ink">Validation</h2>
          <p className="mt-1 text-sm text-ink-secondary">
            {errors.length} erreur · {warnings.length} avertissement
          </p>
        </div>
        <code className="rounded-lg bg-surface px-3 py-2 text-xs text-ink-secondary">
          npm run audit:motion-assets
        </code>
      </div>

      {issues.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {issues.map((issue, index) => (
            <li
              key={`${issue.code}-${issue.assetId ?? issue.sceneId ?? "registry"}-${index}`}
              className={`rounded-lg border p-3 text-sm ${
                issue.severity === "error"
                  ? "border-red-200 bg-red-50 text-red-900"
                  : "border-amber-200 bg-amber-50 text-amber-900"
              }`}
            >
              <p className="font-semibold">{issue.code}</p>
              <p className="mt-1">{issue.message}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
          Aucun probleme bloquant detecte pour cette vue.
        </p>
      )}
    </section>
  );
}
