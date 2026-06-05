"use client";

import { useState } from "react";
import {
  adeIphoneAssignmentChecks,
  adeIphoneAssignmentTopics,
  adeIphoneBestPractices,
  adeIphoneConfigSteps,
  adeIphoneExpectedResult,
  adeIphoneFlow,
  adeIphoneObjectives,
  adeIphoneQuizQuestions,
  adeIphoneRecommendedSettings,
  adeIphoneScoreTiers,
  adeIphoneTestSteps,
  adeIphoneTheory,
  adeIphoneTroubleshooting,
  adeIphoneVerificationItems,
  ADE_IPHONE_COMPLETE_KEY,
  ADE_IPHONE_LESSON_SLUG,
} from "@/lib/data/lessons/ade-iphone-content";
import { ContentSection } from "@/components/course/course-ui";
import { CAPTURES_TOC_LINK, LessonCapturesSection } from "@/components/course/lesson-captures-section";
import {
  LessonActions,
  LessonChecklist,
  LessonProgressBar,
  LessonQuiz,
  useLessonCompletion,
} from "@/components/course/lessons/lesson-interactive";

function FlowDiagram({ nodes }: { nodes: typeof adeIphoneFlow }) {
  return (
    <div className="rounded-3xl border border-border-light bg-gradient-to-b from-surface to-sky-50/30 p-6 shadow-sm md:p-10">
      <div className="mx-auto flex max-w-md flex-col items-center">
        {nodes.map((node, i) => (
          <div key={node.label} className="flex w-full flex-col items-center">
            <div
              className={`w-full rounded-2xl bg-gradient-to-r ${node.color} px-6 py-4 text-center shadow-md transition-transform duration-300 hover:scale-[1.02]`}
            >
              <span className="text-2xl" aria-hidden="true">{node.icon}</span>
              <p className="mt-2 text-sm font-semibold text-white">{node.label}</p>
            </div>
            {i < nodes.length - 1 && (
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

const TOC_LINKS = [
  { href: "#objectifs", label: "Objectifs" },
  { href: "#theorie", label: "Théorie" },
  { href: "#configuration", label: "Configuration" },
  { href: "#assignation", label: "Assignation" },
  { href: "#test", label: "Test" },
  { href: "#verification", label: "Vérification" },
  { href: "#bonnes-pratiques", label: "Bonnes pratiques" },
  CAPTURES_TOC_LINK,
  { href: "#depannage", label: "Dépannage" },
  { href: "#quiz", label: "Quiz" },
];

export function AdeIphoneTableOfContents({ mobile = false }: { mobile?: boolean }) {
  if (mobile) {
    return (
      <nav className="mb-6 lg:hidden" aria-label="Sommaire">
        <div className="-mx-1 flex gap-2 overflow-x-auto pb-2">
          {TOC_LINKS.map((link) => (
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
        {TOC_LINKS.map((link) => (
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

export function AdeIphoneLesson() {
  const [quizKey, setQuizKey] = useState(0);
  const [checklistDone, setChecklistDone] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const { markedComplete, markComplete } = useLessonCompletion(ADE_IPHONE_COMPLETE_KEY);

  return (
    <div className="space-y-14">
      <LessonProgressBar
        checklistDone={checklistDone}
        quizScore={quizScore}
        markedComplete={markedComplete}
      />

      <ContentSection id="objectifs" title="Objectifs">
        <p className="mb-4 text-sm text-ink-secondary">
          À la fin de cette leçon, l&apos;apprenant sera capable de :
        </p>
        <ul className="space-y-3">
          {adeIphoneObjectives.map((obj) => (
            <li
              key={obj}
              className="flex gap-3 rounded-2xl border border-border-light bg-surface px-5 py-4 text-sm leading-relaxed text-ink-secondary shadow-sm transition hover:shadow-md"
            >
              <span className="mt-0.5 shrink-0 font-bold text-accent" aria-hidden="true">✓</span>
              {obj}
            </li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection id="theorie" title="Théorie">
        <div className="mb-8 space-y-6">
          {adeIphoneTheory.map((block) => (
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
        <p className="mb-4 text-sm font-medium text-ink-secondary">Parcours d&apos;enrôlement ADE :</p>
        <FlowDiagram nodes={adeIphoneFlow} />
      </ContentSection>

      <ContentSection id="configuration" title="Configuration ADE">
        <div className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
          <h3 className="text-lg font-semibold text-ink">Créer le profil d&apos;enrôlement</h3>
          <ol className="mt-5 space-y-3">
            {adeIphoneConfigSteps.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm leading-relaxed text-ink-secondary">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>

          <div className="mt-8">
            <p className="text-sm font-semibold text-ink">Paramètres recommandés</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {adeIphoneRecommendedSettings.map((setting) => (
                <div
                  key={setting.label}
                  className={`rounded-2xl border p-4 ${
                    setting.enabled
                      ? "border-green-200 bg-green-50/50"
                      : "border-border-light bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={setting.enabled ? "text-green-600" : "text-ink-tertiary"}>
                      {setting.enabled ? "✓" : "✗"}
                    </span>
                    <span className="font-semibold text-ink">{setting.label}</span>
                    {!setting.enabled && (
                      <span className="text-xs text-ink-tertiary">(désactivé)</span>
                    )}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-ink-secondary">{setting.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection id="assignation" title="Assignation des appareils">
        <div className="grid gap-4 md:grid-cols-3">
          {adeIphoneAssignmentTopics.map((topic) => (
            <div
              key={topic.title}
              className="rounded-2xl border border-border-light bg-surface-elevated p-5 shadow-sm"
            >
              <h3 className="font-semibold text-ink">{topic.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{topic.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
          <p className="text-sm font-semibold text-ink">Vérifications obligatoires</p>
          <ul className="mt-3 space-y-2">
            {adeIphoneAssignmentChecks.map((check) => (
              <li key={check} className="flex gap-2 text-sm text-ink-secondary">
                <span className="text-green-600" aria-hidden="true">✓</span>
                {check}
              </li>
            ))}
          </ul>
        </div>
      </ContentSection>

      <ContentSection id="test" title="Test de déploiement">
        <div className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
          <ol className="space-y-3">
            {adeIphoneTestSteps.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm leading-relaxed text-ink-secondary">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <div className="mt-8 rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Résultat attendu</p>
            <p className="mt-2 text-lg font-bold text-green-900">
              &laquo; {adeIphoneExpectedResult} &raquo;
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection id="verification" title="Checklist de vérification">
        <LessonChecklist
          items={adeIphoneVerificationItems}
          onCompleteChange={setChecklistDone}
          successTitle="🎉 Prêt pour le déploiement iPhone en production"
          successMessage="Tous les contrôles ADE sont validés. Vous pouvez étendre le déploiement à votre parc."
        />
      </ContentSection>

      <ContentSection id="bonnes-pratiques" title="Bonnes pratiques">
        <div className="rounded-3xl border border-green-100 bg-gradient-to-br from-green-50/80 to-emerald-50/50 p-6 shadow-sm md:p-8">
          <ul className="grid gap-3 sm:grid-cols-2">
            {adeIphoneBestPractices.map((tip) => (
              <li key={tip} className="flex gap-2 text-sm leading-relaxed text-ink-secondary">
                <span className="shrink-0 text-green-600" aria-hidden="true">✦</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </ContentSection>

      <LessonCapturesSection lessonSlug={ADE_IPHONE_LESSON_SLUG} />

      <ContentSection id="depannage" title="Dépannage">
        <div className="space-y-4">
          {adeIphoneTroubleshooting.map((item) => (
            <div
              key={item.problem}
              className="rounded-2xl border border-border-light bg-surface-elevated p-5 shadow-sm transition hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-red-600">Erreur</p>
              <p className="mt-1 font-semibold text-ink">{item.problem}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-tertiary">Vérifier</p>
              <ul className="mt-2 space-y-1">
                {item.checks.map((check) => (
                  <li key={check} className="text-sm text-ink-secondary">• {check}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-green-600">Solution</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-secondary">{item.solution}</p>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="quiz" title="Quiz de validation">
        <p className="mb-6 text-sm text-ink-secondary">
          10 questions · 0–59 % À revoir · 60–79 % Bon niveau · 80–99 % Validé · 100 % Expert ADE
        </p>
        <LessonQuiz
          key={quizKey}
          questions={adeIphoneQuizQuestions}
          onScoreChange={setQuizScore}
          passingScore={80}
          scoreTiers={adeIphoneScoreTiers}
        />
        <div className="mt-6">
          <LessonActions
            quizScore={quizScore}
            onMarkComplete={() => markComplete(quizScore)}
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
