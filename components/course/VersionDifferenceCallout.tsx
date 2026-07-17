import type { VersionDifference } from "@/lib/types";

type Props = {
  differences?: VersionDifference[];
};

export function VersionDifferenceCallout({ differences }: Props) {
  if (!differences?.length) return null;

  return (
    <section
      className="mt-8 rounded-2xl border border-amber-200/80 bg-amber-50/60 px-5 py-5 dark:border-amber-900/40 dark:bg-amber-950/20"
      aria-labelledby="version-diff-heading"
    >
      <h2 id="version-diff-heading" className="text-base font-bold text-ink">
        Différences selon la version
      </h2>
      <p className="mt-1 text-sm text-ink-secondary">
        Points où le comportement ou l’interface varie réellement entre versions prises en charge.
      </p>
      <ul className="mt-4 space-y-3">
        {differences.map((diff, index) => (
          <li key={`${diff.platform}-${index}`} className="rounded-xl border border-border-light bg-surface-elevated px-4 py-3">
            <p className="text-sm font-semibold text-ink">
              {diff.platform}
              {diff.fromVersion || diff.toVersion
                ? ` · ${diff.fromVersion ?? "…"} → ${diff.toVersion ?? "…"}`
                : ""}
            </p>
            <p className="mt-1 text-sm text-ink-secondary">{diff.summary}</p>
            {diff.detail && <p className="mt-1 text-sm text-ink-tertiary">{diff.detail}</p>}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-ink-tertiary">
        Les versions bêta ne font pas partie de cette section de production.
      </p>
    </section>
  );
}
