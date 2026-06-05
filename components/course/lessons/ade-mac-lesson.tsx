"use client";

import { useState } from "react";
import {
  adeMacAssignmentModes,
  adeMacAssignmentSteps,
  adeMacAutoProfiles,
  adeMacBestPractices,
  adeMacCaseStudy,
  adeMacExpectedMessage,
  adeMacFirstBootSteps,
  adeMacFlow,
  adeMacIntroduction,
  adeMacIntuneConfigSteps,
  adeMacObjectives,
  adeMacPrerequisiteChecklist,
  adeMacPrerequisites,
  adeMacProfileName,
  adeMacProfileSettings,
  adeMacQuizQuestions,
  adeMacRecommendedOptions,
  adeMacScoreTiers,
  adeMacTroubleshooting,
  adeMacVerificationItems,
  ADE_MAC_COMPLETE_KEY,
  ADE_MAC_LESSON_SLUG,
} from "@/lib/data/lessons/ade-mac-content";
import { ContentSection } from "@/components/course/course-ui";
import { CAPTURES_TOC_LINK, LessonCapturesSection } from "@/components/course/lesson-captures-section";
import { Button } from "@/components/ui";
import {
  LessonActions,
  LessonChecklist,
  LessonProgressBar,
  LessonQuiz,
  useLessonCompletion,
} from "@/components/course/lessons/lesson-interactive";

function FlowDiagram({ nodes }: { nodes: typeof adeMacFlow }) {
  return (
    <div className="rounded-3xl border border-border-light bg-gradient-to-b from-surface to-indigo-50/20 p-6 shadow-sm md:p-10">
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
  { href: "#introduction", label: "Introduction" },
  { href: "#prerequis", label: "Prérequis" },
  { href: "#configuration", label: "Configuration" },
  { href: "#profil-macos", label: "Profil macOS" },
  { href: "#assignation", label: "Assignation" },
  { href: "#premier-demarrage", label: "Premier démarrage" },
  { href: "#profils-appliques", label: "Profils" },
  { href: "#verification", label: "Vérification" },
  CAPTURES_TOC_LINK,
  { href: "#depannage", label: "Dépannage" },
  { href: "#bonnes-pratiques", label: "Bonnes pratiques" },
  { href: "#cas-pratique", label: "Cas pratique" },
  { href: "#quiz", label: "Quiz" },
];

export function AdeMacTableOfContents({ mobile = false }: { mobile?: boolean }) {
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

function CaseStudySection() {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
      <h3 className="text-xl font-bold text-ink">{adeMacCaseStudy.title}</h3>
      <p className="mt-4 text-sm leading-relaxed text-ink-secondary">{adeMacCaseStudy.scenario}</p>

      <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/5 p-5">
        <p className="text-sm font-semibold text-ink">À votre tour — planifiez le déploiement :</p>
        <ol className="mt-3 space-y-2">
          {adeMacCaseStudy.tasks.map((task, i) => (
            <li key={task} className="flex gap-2 text-sm text-ink-secondary">
              <span className="font-bold text-accent">{i + 1}.</span>
              {task}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-6">
        {!showSolution ? (
          <Button type="button" variant="secondary" onClick={() => setShowSolution(true)}>
            Afficher la solution détaillée
          </Button>
        ) : (
          <div className="rounded-2xl border border-green-200 bg-green-50/50 p-5">
            <p className="text-sm font-semibold text-green-800">Solution recommandée</p>
            <ol className="mt-4 space-y-3">
              {adeMacCaseStudy.solution.map((step, i) => (
                <li key={step.slice(0, 40)} className="flex gap-3 text-sm leading-relaxed text-ink-secondary">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

export function AdeMacLesson() {
  const [quizKey, setQuizKey] = useState(0);
  const [checklistDone, setChecklistDone] = useState(false);
  const [prereqDone, setPrereqDone] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const { markedComplete, markComplete } = useLessonCompletion(ADE_MAC_COMPLETE_KEY);

  const combinedChecklist = checklistDone && prereqDone;

  return (
    <div className="space-y-14">
      <LessonProgressBar
        checklistDone={combinedChecklist}
        quizScore={quizScore}
        markedComplete={markedComplete}
      />

      <ContentSection id="objectifs" title="Objectifs">
        <p className="mb-4 text-sm text-ink-secondary">
          À la fin de cette leçon, l&apos;apprenant sera capable de :
        </p>
        <ul className="space-y-3">
          {adeMacObjectives.map((obj) => (
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

      <ContentSection id="introduction" title="Introduction">
        <div className="space-y-6">
          <div className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
            <h3 className="text-lg font-semibold text-ink">Avant Apple Business Manager</h3>
            <p className="mt-3 text-sm leading-7 text-ink-secondary md:text-base">
              {adeMacIntroduction.before}
            </p>
          </div>
          <div className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
            <h3 className="text-lg font-semibold text-ink">Aujourd&apos;hui avec ABM</h3>
            <ul className="mt-4 space-y-2">
              {adeMacIntroduction.today.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-relaxed text-ink-secondary">
                  <span className="text-accent" aria-hidden="true">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mb-4 mt-8 text-sm font-medium text-ink-secondary">Parcours de déploiement Mac :</p>
        <FlowDiagram nodes={adeMacFlow} />
      </ContentSection>

      <ContentSection id="prerequis" title="Prérequis">
        <ul className="mb-6 grid gap-2 sm:grid-cols-2">
          {adeMacPrerequisites.map((req) => (
            <li key={req} className="rounded-xl bg-surface px-4 py-3 text-sm text-ink-secondary">
              • {req}
            </li>
          ))}
        </ul>
        <p className="mb-3 text-sm font-semibold text-ink">Checklist de préparation</p>
        <LessonChecklist
          items={adeMacPrerequisiteChecklist}
          onCompleteChange={setPrereqDone}
          successTitle="✓ Prérequis validés"
          successMessage="Votre environnement ABM + Intune est prêt pour configurer ADE macOS."
        />
      </ContentSection>

      <ContentSection id="configuration" title="Configuration Intune">
        <div className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
          <ol className="space-y-3">
            {adeMacIntuneConfigSteps.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm leading-relaxed text-ink-secondary">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <p className="text-sm font-semibold text-ink">Options recommandées</p>
            <div className="mt-4 space-y-3">
              {adeMacRecommendedOptions.map((opt) => (
                <div key={opt.label} className="rounded-2xl border border-green-200 bg-green-50/50 p-4">
                  <p className="flex items-center gap-2 font-semibold text-ink">
                    <span className="text-green-600" aria-hidden="true">✓</span>
                    {opt.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{opt.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection id="profil-macos" title="Création du profil macOS">
        <div className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
          <p className="text-sm text-ink-secondary">
            Profil recommandé :{" "}
            <strong className="text-ink">{adeMacProfileName}</strong>
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {adeMacProfileSettings.map((setting) => (
              <div
                key={setting.label}
                className="rounded-2xl border border-border-light bg-surface p-4"
              >
                <p className="flex items-center gap-2 font-semibold text-ink">
                  <span className={setting.enabled ? "text-green-600" : "text-ink-tertiary"}>
                    {setting.enabled ? "✓" : "✗"}
                  </span>
                  {setting.label}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-ink-secondary">{setting.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </ContentSection>

      <ContentSection id="assignation" title="Assignation des Mac">
        <ol className="mb-6 space-y-3 rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
          {adeMacAssignmentSteps.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm leading-relaxed text-ink-secondary">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        <div className="grid gap-4 md:grid-cols-3">
          {adeMacAssignmentModes.map((mode) => (
            <div key={mode.title} className="rounded-2xl border border-border-light bg-surface-elevated p-5 shadow-sm">
              <h3 className="font-semibold text-ink">{mode.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{mode.body}</p>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="premier-demarrage" title="Premier démarrage — scénario">
        <div className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
          <p className="mb-4 text-sm font-medium text-ink-secondary">
            Le Mac sort du carton. Voici le parcours utilisateur :
          </p>
          <ol className="space-y-3">
            {adeMacFirstBootSteps.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm leading-relaxed text-ink-secondary">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <div className="mt-8 rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Message attendu</p>
            <p className="mt-2 text-lg font-bold text-green-900">
              &laquo; {adeMacExpectedMessage} &raquo;
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection id="profils-appliques" title="Profils appliqués automatiquement">
        <p className="mb-6 text-sm text-ink-secondary">
          Intune peut déployer automatiquement les éléments suivants dès l&apos;enrôlement ADE :
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {adeMacAutoProfiles.map((group) => (
            <div key={group.category} className="rounded-2xl border border-border-light bg-surface-elevated p-5 shadow-sm">
              <h3 className="font-semibold text-ink">{group.category}</h3>
              <ul className="mt-3 space-y-1">
                {group.items.map((item) => (
                  <li key={item} className="text-sm text-ink-secondary">• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="verification" title="Checklist de vérification">
        <LessonChecklist
          items={adeMacVerificationItems}
          onCompleteChange={setChecklistDone}
          successTitle="🎉 Déploiement Mac ADE validé"
          successMessage="Votre chaîne ABM → Intune → macOS est opérationnelle."
        />
      </ContentSection>

      <LessonCapturesSection lessonSlug={ADE_MAC_LESSON_SLUG} />

      <ContentSection id="depannage" title="Dépannage">
        <div className="grid gap-4 sm:grid-cols-2">
          {adeMacTroubleshooting.map((item) => (
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
          <ul className="space-y-3">
            {adeMacBestPractices.map((tip) => (
              <li key={tip} className="flex gap-2 text-sm leading-relaxed text-ink-secondary">
                <span className="shrink-0 text-green-600" aria-hidden="true">✦</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </ContentSection>

      <ContentSection id="cas-pratique" title="Cas pratique">
        <CaseStudySection />
      </ContentSection>

      <ContentSection id="quiz" title="Quiz de validation">
        <p className="mb-6 text-sm text-ink-secondary">
          10 questions · 0–59 % À revoir · 60–79 % Correct · 80–99 % Validé · 100 % Expert macOS ADE
        </p>
        <LessonQuiz
          key={quizKey}
          questions={adeMacQuizQuestions}
          onScoreChange={setQuizScore}
          passingScore={80}
          scoreTiers={adeMacScoreTiers}
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
