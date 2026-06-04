"use client";

import { useState } from "react";
import {
  abmIntuneArchitecture,
  abmIntuneBestPractices,
  abmIntuneObjectives,
  abmIntunePrerequisites,
  abmIntuneQuizQuestions,
  abmIntuneSteps,
  abmIntuneTheory,
  abmIntuneTroubleshooting,
  abmIntuneVerificationItems,
} from "@/lib/data/lessons/abm-intune-content";
import { ContentSection } from "@/components/course/course-ui";
import {
  AbmIntuneChecklist,
  AbmIntuneLessonProgress,
  AbmIntuneQuiz,
  AbmIntuneActions,
} from "@/components/course/lessons/abm-intune-interactive";

function ArchitectureDiagram() {
  return (
    <div className="rounded-3xl border border-border-light bg-gradient-to-b from-surface to-blue-50/30 p-6 shadow-sm md:p-10">
      <div className="mx-auto flex max-w-md flex-col items-center gap-0">
        {abmIntuneArchitecture.map((node, i) => (
          <div key={node.label} className="flex w-full flex-col items-center">
            <div
              className={`w-full rounded-2xl bg-gradient-to-r ${node.color} px-6 py-4 text-center shadow-md transition-transform duration-300 hover:scale-[1.02]`}
            >
              <span className="text-2xl" aria-hidden="true">
                {node.icon}
              </span>
              <p className="mt-2 text-sm font-semibold text-white">{node.label}</p>
            </div>
            {i < abmIntuneArchitecture.length - 1 && (
              <div className="flex flex-col items-center py-2 text-ink-tertiary" aria-hidden="true">
                <div className="h-6 w-px bg-border" />
                <span className="text-lg">↓</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StepCard({
  id,
  title,
  steps,
  alert,
  note,
  indicators,
}: {
  id: string;
  title: string;
  steps: string[];
  alert?: string;
  note?: string;
  indicators?: string[];
}) {
  return (
    <div id={id} className="scroll-mt-24 rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
      <h3 className="text-xl font-bold text-ink">{title}</h3>
      <ol className="mt-5 space-y-3">
        {steps.map((step, i) => (
          <li key={step} className="flex gap-3 text-sm leading-relaxed text-ink-secondary">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>

      {alert && (
        <div className="mt-5 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <span aria-hidden="true">⚠️</span>
          <p>{alert}</p>
        </div>
      )}

      {note && (
        <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/80 px-4 py-3 text-sm leading-relaxed text-blue-900">
          {note}
        </div>
      )}

      {indicators && (
        <div className="mt-5 flex flex-wrap gap-2">
          {indicators.map((ind) => (
            <span
              key={ind}
              className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 ring-1 ring-green-100"
            >
              <span aria-hidden="true">✓</span> {ind}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function AbmIntuneLesson() {
  const [quizKey, setQuizKey] = useState(0);
  const [checklistDone, setChecklistDone] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [markedComplete, setMarkedComplete] = useState(false);

  function markComplete() {
    if (quizScore < 80) return;
    setMarkedComplete(true);
    try {
      localStorage.setItem("lesson-abm-intune-complete", "true");
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="space-y-14">
      <AbmIntuneLessonProgress
        checklistDone={checklistDone}
        quizScore={quizScore}
        markedComplete={markedComplete}
      />

      <ContentSection id="objectifs" title="Objectifs">
        <p className="mb-4 text-sm text-ink-secondary">
          À la fin de cette leçon, l&apos;apprenant sera capable de :
        </p>
        <ul className="space-y-3">
          {abmIntuneObjectives.map((obj) => (
            <li
              key={obj}
              className="flex gap-3 rounded-2xl border border-border-light bg-surface px-5 py-4 text-sm leading-relaxed text-ink-secondary shadow-sm transition hover:shadow-md"
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
        <p className="mb-4 text-sm text-ink-secondary">Avant de commencer :</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {abmIntunePrerequisites.map((req) => (
            <li
              key={req}
              className="flex gap-2 rounded-xl bg-surface px-4 py-3 text-sm text-ink-secondary"
            >
              <span className="text-accent" aria-hidden="true">
                •
              </span>
              {req}
            </li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection id="architecture" title="Architecture">
        <p className="mb-6 text-sm text-ink-secondary">
          Flux de confiance entre Apple Business Manager, le serveur MDM et les appareils finaux.
        </p>
        <ArchitectureDiagram />
      </ContentSection>

      <ContentSection id="theorie" title="Théorie">
        <div className="space-y-6">
          {abmIntuneTheory.map((block) => (
            <div
              key={block.title}
              className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8"
            >
              <h3 className="text-lg font-semibold text-ink">{block.title}</h3>
              <div className="mt-4 space-y-4">
                {block.body.map((p) => (
                  <p key={p.slice(0, 48)} className="text-sm leading-7 text-ink-secondary md:text-base">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="etapes" title="Procédure pas à pas">
        <div className="space-y-6">
          {abmIntuneSteps.map((step) => (
            <StepCard key={step.id} {...step} />
          ))}
        </div>
      </ContentSection>

      <ContentSection id="verification" title="Vérification">
        <p className="mb-4 text-sm text-ink-secondary">
          Cochez chaque élément une fois validé dans votre environnement :
        </p>
        <AbmIntuneChecklist items={abmIntuneVerificationItems} onCompleteChange={setChecklistDone} />
      </ContentSection>

      <ContentSection id="depannage" title="Dépannage">
        <div className="grid gap-4 sm:grid-cols-2">
          {abmIntuneTroubleshooting.map((item) => (
            <div
              key={item.problem}
              className="rounded-2xl border border-border-light bg-surface-elevated p-5 shadow-sm transition hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-red-600">Erreur</p>
              <p className="mt-1 font-semibold text-ink">{item.problem}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-green-600">Solution</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-secondary">{item.solution}</p>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="bonnes-pratiques" title="Bonnes pratiques">
        <div className="rounded-3xl border border-green-100 bg-gradient-to-br from-green-50/80 to-emerald-50/50 p-6 shadow-sm md:p-8">
          <ul className="grid gap-3 sm:grid-cols-2">
            {abmIntuneBestPractices.map((tip) => (
              <li key={tip} className="flex gap-2 text-sm leading-relaxed text-ink-secondary">
                <span className="shrink-0 text-green-600" aria-hidden="true">
                  ✦
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </ContentSection>

      <ContentSection id="quiz" title="Quiz de validation">
        <p className="mb-6 text-sm text-ink-secondary">
          5 questions · Score minimum 80 % pour valider · 100 % = badge Expert ABM + Intune
        </p>
        <AbmIntuneQuiz
          key={quizKey}
          questions={abmIntuneQuizQuestions}
          onScoreChange={setQuizScore}
        />
        <div className="mt-6">
          <AbmIntuneActions
            quizScore={quizScore}
            onMarkComplete={markComplete}
            markedComplete={markedComplete}
            onResetQuiz={() => {
              setQuizKey((k) => k + 1);
              setQuizScore(0);
            }}
          />
        </div>
      </ContentSection>
    </div>
  );
}

export function AbmIntuneTableOfContents({ mobile = false }: { mobile?: boolean }) {
  const links = [
    { href: "#objectifs", label: "Objectifs" },
    { href: "#prerequis", label: "Prérequis" },
    { href: "#architecture", label: "Architecture" },
    { href: "#theorie", label: "Théorie" },
    { href: "#etapes", label: "Étapes" },
    { href: "#verification", label: "Vérification" },
    { href: "#depannage", label: "Dépannage" },
    { href: "#bonnes-pratiques", label: "Bonnes pratiques" },
    { href: "#quiz", label: "Quiz" },
  ];

  if (mobile) {
    return (
      <nav className="mb-6 lg:hidden" aria-label="Sommaire">
        <div className="-mx-1 flex gap-2 overflow-x-auto pb-2">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-full border border-border-light bg-surface-elevated px-3 py-1.5 text-xs font-medium text-ink-secondary transition hover:border-accent/30"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav className="hidden lg:block" aria-label="Sommaire">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">Sommaire</p>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="text-sm text-ink-secondary transition hover:text-accent">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
