import type { ReactNode } from "react";
import type { CourseEnrichedContent } from "@/src/lib/course-enriched-content";

type Props = {
  content: CourseEnrichedContent;
};

export function CourseEnrichedSections({ content }: Props) {
  return (
    <section className="mt-10 space-y-8">
      <div className="rounded-[2rem] border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
        <h2 className="text-lg font-bold text-ink">Apprendre sans attendre la vidéo</h2>
        <p className="mt-2 text-sm text-ink-secondary">
          Ce cours est complet en mode texte : objectifs, architecture, procédures, dépannage et bonnes pratiques.
        </p>
      </div>

      <EnrichedBlock title="Objectifs approfondis" id="objectifs-enrichis">
        <ul className="grid gap-3 sm:grid-cols-2">
          {content.objectives.map((item) => (
            <li key={item} className="rounded-2xl bg-surface px-4 py-3 text-sm text-ink-secondary">
              {item}
            </li>
          ))}
        </ul>
      </EnrichedBlock>

      <EnrichedBlock title="Prérequis" id="prerequis-enrichis">
        <ul className="space-y-2 text-sm text-ink-secondary">
          {content.prerequisites.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </EnrichedBlock>

      <EnrichedBlock title="Architecture" id="architecture">
        <div className="space-y-6">
          {content.architecture.map((block) => (
            <div key={block.title} className="rounded-2xl border border-border-light bg-surface p-5">
              <h3 className="font-semibold text-ink">{block.title}</h3>
              {block.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="mt-3 text-sm leading-relaxed text-ink-secondary">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      </EnrichedBlock>

      <EnrichedBlock title="Procédures" id="procedures">
        <div className="space-y-6">
          {content.procedure.map((proc) => (
            <div key={proc.title}>
              <h3 className="font-semibold text-ink">{proc.title}</h3>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-ink-secondary">
                {proc.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </EnrichedBlock>

      <EnrichedBlock title="Erreurs fréquentes" id="erreurs">
        <div className="space-y-3">
          {content.commonErrors.map((item) => (
            <details key={item.problem} className="rounded-2xl border border-border-light bg-surface p-4">
              <summary className="cursor-pointer text-sm font-semibold text-ink">{item.problem}</summary>
              <p className="mt-3 text-sm text-ink-secondary">{item.solution}</p>
            </details>
          ))}
        </div>
      </EnrichedBlock>

      <EnrichedBlock title="Bonnes pratiques" id="bonnes-pratiques-cours">
        <ul className="grid gap-3 sm:grid-cols-2">
          {content.bestPractices.map((tip) => (
            <li key={tip} className="rounded-2xl bg-green-50/60 px-4 py-3 text-sm text-ink-secondary">
              ✦ {tip}
            </li>
          ))}
        </ul>
      </EnrichedBlock>

      <EnrichedBlock title="Résumé final" id="resume-cours">
        <div className="space-y-3">
          {content.summary.map((p) => (
            <p key={p.slice(0, 40)} className="text-sm leading-relaxed text-ink-secondary">
              {p}
            </p>
          ))}
        </div>
      </EnrichedBlock>
    </section>
  );
}

function EnrichedBlock({
  title,
  id,
  children,
}: {
  title: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <div id={id} className="rounded-[2rem] border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}
