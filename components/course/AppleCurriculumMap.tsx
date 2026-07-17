import Link from "next/link";
import { applePedagogyLevels } from "@/lib/data/apple-curriculum";

type Props = {
  currentTrackSlug?: string;
};

export function AppleCurriculumMap({ currentTrackSlug }: Props) {
  return (
    <section className="mt-10 rounded-[2rem] border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8" aria-labelledby="apple-curriculum-heading">
      <h2 id="apple-curriculum-heading" className="text-lg font-bold text-ink">
        Parcours Apple en 5 niveaux
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-ink-secondary">
        De l’écosystème macOS, iOS et iPadOS jusqu’à l’architecture enterprise — sans se limiter au seul MDM.
      </p>
      <ol className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {applePedagogyLevels.map((level) => {
          const active = currentTrackSlug === level.trackSlug;
          return (
            <li key={level.level}>
              <Link
                href={`/parcours/${level.trackSlug}`}
                className={`block h-full rounded-2xl border px-4 py-4 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  active
                    ? "border-accent bg-accent/5 shadow-sm"
                    : "border-border-light bg-surface hover:border-accent/40"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">
                  Niveau {level.level}
                </p>
                <p className="mt-1 font-bold text-ink">{level.title}</p>
                <ul className="mt-3 space-y-1 text-xs text-ink-secondary">
                  {level.focus.slice(0, 3).map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
