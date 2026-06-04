import Link from "next/link";
import type { LessonContent } from "@/lib/types";
import { ButtonLink } from "@/components/ui";
import { ContentSection } from "@/components/course/course-ui";

type LessonContentViewProps = {
  content: LessonContent;
  lessonTitle: string;
  quizHref?: string;
};

export function LessonContentView({ content, lessonTitle, quizHref }: LessonContentViewProps) {
  return (
    <div className="space-y-14">
      <ContentSection id="objectifs" title="Objectifs">
        <ul className="space-y-3">
          {content.objectives.map((obj) => (
            <li
              key={obj}
              className="flex gap-3 rounded-2xl border border-border-light bg-surface px-5 py-4 text-sm leading-relaxed text-ink-secondary shadow-sm"
            >
              <span className="mt-0.5 shrink-0 font-bold text-accent" aria-hidden="true">
                ✓
              </span>
              {obj}
            </li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection id="prerequis" title="Prérequis">
        <ul className="space-y-2">
          {content.prerequisites.map((req) => (
            <li key={req} className="flex gap-2 text-sm leading-relaxed text-ink-secondary">
              <span className="text-ink-tertiary" aria-hidden="true">
                •
              </span>
              {req}
            </li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection id="theorie" title="Théorie">
        <div className="space-y-8">
          {content.theory.map((block) => (
            <div
              key={block.title}
              className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8"
            >
              <h3 className="text-lg font-semibold text-ink">{block.title}</h3>
              <div className="mt-4 space-y-4">
                {block.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="text-sm leading-7 text-ink-secondary md:text-base">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="etapes" title="Étapes détaillées">
        <ol className="space-y-4">
          {content.steps.map((step, i) => (
            <li
              key={step.title}
              className="flex gap-4 rounded-2xl border border-border-light bg-surface-elevated p-5 shadow-sm"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </ContentSection>

      <ContentSection id="captures" title="Captures d'écran">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.screenshots.map((shot) => (
            <figure
              key={shot.caption}
              className="overflow-hidden rounded-3xl border border-border-light bg-surface-elevated shadow-sm"
            >
              <div
                className={`flex aspect-[4/3] flex-col items-center justify-center bg-gradient-to-br ${shot.gradient} p-6`}
                role="img"
                aria-label={shot.alt}
              >
                <span className="text-4xl" aria-hidden="true">
                  {shot.icon}
                </span>
                <p className="mt-4 max-w-[200px] text-center text-xs font-medium text-ink-secondary">
                  {lessonTitle}
                </p>
              </div>
              <figcaption className="border-t border-border-light px-4 py-3 text-xs font-medium text-ink-secondary">
                {shot.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="bonnes-pratiques" title="Bonnes pratiques">
        <ul className="grid gap-3 sm:grid-cols-2">
          {content.bestPractices.map((tip) => (
            <li
              key={tip}
              className="rounded-2xl border border-green-100 bg-green-50/50 px-5 py-4 text-sm leading-relaxed text-ink-secondary"
            >
              <span className="mr-2 text-green-600" aria-hidden="true">
                ✦
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection id="depannage" title="Dépannage">
        <div className="space-y-3">
          {content.troubleshooting.map((item) => (
            <details
              key={item.problem}
              className="group rounded-2xl border border-border-light bg-surface-elevated shadow-sm"
            >
              <summary className="cursor-pointer list-none px-5 py-4 text-sm font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-3">
                  {item.problem}
                  <span className="text-ink-tertiary transition group-open:rotate-180" aria-hidden="true">
                    ▾
                  </span>
                </span>
              </summary>
              <div className="border-t border-border-light px-5 py-4 text-sm leading-relaxed text-ink-secondary">
                {item.solution}
              </div>
            </details>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="quiz-final" title="Quiz final">
        <div className="rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/5 to-blue-50 p-8 shadow-sm">
          <p className="text-sm leading-relaxed text-ink-secondary">
            Validez vos acquis sur « {lessonTitle} » et le parcours complet avec un quiz interactif
            chronométré. Un score suffisant débloque votre certificat PDF.
          </p>
          {quizHref ? (
            <ButtonLink href={quizHref} className="mt-6">
              Lancer le quiz final
            </ButtonLink>
          ) : (
            <p className="mt-4 text-sm text-ink-tertiary">
              Quiz disponible à la fin du parcours.
            </p>
          )}
        </div>
      </ContentSection>
    </div>
  );
}

export function LessonTableOfContents({ mobile = false }: { mobile?: boolean }) {
  const links = [
    { href: "#objectifs", label: "Objectifs" },
    { href: "#prerequis", label: "Prérequis" },
    { href: "#theorie", label: "Théorie" },
    { href: "#etapes", label: "Étapes" },
    { href: "#captures", label: "Captures" },
    { href: "#bonnes-pratiques", label: "Bonnes pratiques" },
    { href: "#depannage", label: "Dépannage" },
    { href: "#quiz-final", label: "Quiz" },
  ];

  if (mobile) {
    return (
      <nav className="lg:hidden" aria-label="Sommaire de la leçon">
        <div className="-mx-1 flex gap-2 overflow-x-auto pb-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-full border border-border-light bg-surface-elevated px-3 py-1.5 text-xs font-medium text-ink-secondary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav
      className="hidden lg:block"
      aria-label="Sommaire de la leçon"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">Sommaire</p>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-ink-secondary transition hover:text-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
