import type { OfficialSource } from "@/lib/types";

type Props = {
  sources?: OfficialSource[];
};

export function OfficialSources({ sources }: Props) {
  if (!sources?.length) return null;

  return (
    <section
      className="mt-10 border-t border-border-light pt-8"
      aria-labelledby="official-sources-heading"
    >
      <h2 id="official-sources-heading" className="text-base font-bold text-ink">
        Sources officielles
      </h2>
      <p className="mt-1 text-sm text-ink-secondary">
        Références consultées pour valider ce contenu. Les libellés renvoient vers la documentation d’origine.
      </p>
      <ul className="mt-4 space-y-2">
        {sources.map((source) => (
          <li key={source.url}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex flex-col rounded-xl border border-border-light bg-surface px-4 py-3 transition hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:flex-row sm:items-center sm:gap-3"
            >
              <span className="text-sm font-semibold text-ink group-hover:text-accent">{source.title}</span>
              <span className="text-xs text-ink-tertiary">
                {source.publisher}
                {" · "}
                vérifié le{" "}
                <time dateTime={source.checkedAt}>
                  {new Date(source.checkedAt + "T12:00:00").toLocaleDateString("fr-FR")}
                </time>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
