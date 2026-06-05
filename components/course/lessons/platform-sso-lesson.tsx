"use client";

import { useState } from "react";
import {
  getPlatformSsoDeployStatus,
  platformSsoArchitecture,
  platformSsoBeforeAfter,
  platformSsoBestPractices,
  platformSsoCaseStudy,
  platformSsoDeploymentProfile,
  platformSsoEntraIntegrationSteps,
  platformSsoIntroduction,
  platformSsoLabChecklist,
  platformSsoLabExercises,
  platformSsoMechanisms,
  platformSsoObjectives,
  platformSsoParameters,
  platformSsoPrerequisiteChecklist,
  platformSsoPrerequisites,
  platformSsoQuizQuestions,
  platformSsoScoreTiers,
  platformSsoSecurityFlow,
  platformSsoSecurityMeasures,
  platformSsoTroubleshooting,
  platformSsoUserExperience,
  platformSsoUserResult,
  PLATFORM_SSO_COMPLETE_KEY,
  PLATFORM_SSO_LESSON_SLUG,
} from "@/lib/data/lessons/platform-sso-content";
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

function FlowDiagram({
  nodes,
  className = "",
}: {
  nodes: { label: string; icon: string; color: string }[];
  className?: string;
}) {
  return (
    <div className={`rounded-3xl border border-border-light bg-gradient-to-b from-surface to-indigo-50/20 p-6 shadow-sm md:p-10 ${className}`}>
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
  { href: "#fonctionnement", label: "Fonctionnement" },
  { href: "#entra-id", label: "Entra ID" },
  { href: "#deploiement", label: "Déploiement" },
  { href: "#experience", label: "Expérience utilisateur" },
  { href: "#securite", label: "Sécurité" },
  CAPTURES_TOC_LINK,
  { href: "#depannage", label: "Dépannage" },
  { href: "#bonnes-pratiques", label: "Bonnes pratiques" },
  { href: "#cas-pratique", label: "Cas pratique" },
  { href: "#quiz", label: "Quiz" },
  { href: "#laboratoire", label: "Laboratoire" },
];

export function PlatformSsoTableOfContents({ mobile = false }: { mobile?: boolean }) {
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

function DeployStatusCard({ checkedCount, total }: { checkedCount: number; total: number }) {
  const status = getPlatformSsoDeployStatus(checkedCount, total);
  const isHealthy = status === "healthy";

  return (
    <div
      className={`mt-6 rounded-2xl border px-6 py-5 text-center ${
        isHealthy
          ? "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50"
          : "border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50"
      }`}
    >
      <p className={`text-xs font-semibold uppercase tracking-wide ${isHealthy ? "text-green-700" : "text-amber-700"}`}>
        État Platform SSO
      </p>
      <p className={`mt-2 text-xl font-bold ${isHealthy ? "text-green-800" : "text-amber-800"}`}>
        {isHealthy ? "✓ Platform SSO opérationnel" : "⚠ Configuration en cours"}
      </p>
      <p className="mt-1 text-sm text-ink-secondary">
        {checkedCount} / {total} contrôles validés
      </p>
    </div>
  );
}

function CaseStudySection() {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
      <h3 className="text-xl font-bold text-ink">{platformSsoCaseStudy.title}</h3>
      <p className="mt-4 text-sm leading-relaxed text-ink-secondary">{platformSsoCaseStudy.scenario}</p>
      <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/5 p-5">
        <p className="text-sm font-semibold text-ink">Votre plan :</p>
        <ol className="mt-3 space-y-2">
          {platformSsoCaseStudy.tasks.map((task, i) => (
            <li key={task} className="flex gap-3 text-sm text-ink-secondary">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                {i + 1}
              </span>
              {task}
            </li>
          ))}
        </ol>
      </div>
      {!showSolution ? (
        <Button className="mt-6" onClick={() => setShowSolution(true)}>
          Afficher la correction détaillée
        </Button>
      ) : (
        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50/50 p-5">
          <p className="text-sm font-semibold text-green-800">Correction détaillée</p>
          <ol className="mt-3 space-y-3">
            {platformSsoCaseStudy.solution.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm leading-relaxed text-green-900">
                <span className="shrink-0 font-bold text-green-600">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export function PlatformSsoLesson() {
  const [quizKey, setQuizKey] = useState(0);
  const [prereqDone, setPrereqDone] = useState(false);
  const [labDone, setLabDone] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const { markedComplete, markComplete } = useLessonCompletion(PLATFORM_SSO_COMPLETE_KEY);

  const combinedChecklist = prereqDone && labDone;

  return (
    <div className="space-y-14">
      <LessonProgressBar
        checklistDone={combinedChecklist}
        quizScore={quizScore}
        markedComplete={markedComplete}
      />

      <ContentSection id="objectifs" title="Objectifs">
        <ul className="space-y-3">
          {platformSsoObjectives.map((obj) => (
            <li
              key={obj}
              className="flex gap-3 rounded-2xl border border-border-light bg-surface px-5 py-4 text-sm leading-relaxed text-ink-secondary shadow-sm"
            >
              <span className="mt-0.5 shrink-0 font-bold text-accent" aria-hidden="true">✓</span>
              {obj}
            </li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection id="introduction" title="Introduction — Platform SSO">
        <div className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
          <p className="text-sm leading-7 text-ink-secondary md:text-base">{platformSsoIntroduction.summary}</p>
          <ul className="mt-6 space-y-2">
            {platformSsoIntroduction.benefits.map((b) => (
              <li key={b} className="flex gap-2 text-sm text-ink-secondary">
                <span className="text-indigo-600">✓</span> {b}
              </li>
            ))}
          </ul>
        </div>
        <p className="mb-4 mt-8 text-sm font-medium text-ink-secondary">Architecture :</p>
        <FlowDiagram nodes={platformSsoArchitecture} />
      </ContentSection>

      <ContentSection id="prerequis" title="Prérequis">
        <div className="grid gap-4 md:grid-cols-2">
          {platformSsoPrerequisites.map((p) => (
            <div key={p.item} className="rounded-2xl border border-border-light bg-surface-elevated p-5 shadow-sm">
              <p className="font-semibold text-ink">{p.item}</p>
              <p className="mt-2 text-sm text-ink-secondary">{p.detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <p className="mb-3 text-sm font-semibold text-ink">Checklist prérequis</p>
          <LessonChecklist
            items={platformSsoPrerequisiteChecklist}
            onCompleteChange={setPrereqDone}
            successTitle="✓ Prérequis validés"
            successMessage="Environnement prêt pour Platform SSO."
          />
        </div>
      </ContentSection>

      <ContentSection id="fonctionnement" title="Fonctionnement">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-red-100 bg-red-50/30 p-5">
            <p className="font-bold text-red-900">{platformSsoBeforeAfter.before.title}</p>
            <ul className="mt-3 space-y-2">
              {platformSsoBeforeAfter.before.items.map((item) => (
                <li key={item} className="text-sm text-red-800">• {item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-green-100 bg-green-50/30 p-5">
            <p className="font-bold text-green-900">{platformSsoBeforeAfter.after.title}</p>
            <ol className="mt-3 space-y-2">
              {platformSsoBeforeAfter.after.flow.map((item, i) => (
                <li key={item} className="flex gap-2 text-sm text-green-800">
                  <span className="font-bold">{i + 1}.</span> {item}
                </li>
              ))}
            </ol>
          </div>
        </div>
        <p className="mb-4 mt-8 text-sm font-semibold text-ink">Mécanismes Platform SSO :</p>
        <div className="grid gap-4 md:grid-cols-2">
          {platformSsoMechanisms.map((m) => (
            <div key={m.title} className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5">
              <span className="text-2xl" aria-hidden="true">{m.icon}</span>
              <p className="mt-2 font-semibold text-ink">{m.title}</p>
              <p className="mt-2 text-sm text-ink-secondary">{m.description}</p>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="entra-id" title="Intégration Microsoft Entra ID">
        <ol className="space-y-3 rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
          {platformSsoEntraIntegrationSteps.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm text-ink-secondary">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        <p className="mb-4 mt-8 text-sm font-semibold text-ink">Paramètres clés :</p>
        <div className="space-y-3">
          {platformSsoParameters.map((p) => (
            <div key={p.param} className="rounded-2xl border border-border-light bg-surface-elevated p-5 shadow-sm">
              <p className="font-semibold text-ink">{p.param}</p>
              <p className="mt-1 text-sm text-ink-secondary">{p.description}</p>
              <p className="mt-2 font-mono text-xs text-accent">Ex. {p.example}</p>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="deploiement" title="Déploiement — Profil Production">
        <div className="rounded-3xl border border-indigo-200 bg-indigo-50/30 p-6 shadow-sm md:p-8">
          <h3 className="text-lg font-bold text-ink">{platformSsoDeploymentProfile.name}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {platformSsoDeploymentProfile.settings.map((s) => (
              <div key={s.label} className="rounded-xl border border-indigo-100 bg-white/80 px-4 py-3">
                <p className="text-xs font-semibold uppercase text-ink-tertiary">{s.label}</p>
                <p className="mt-1 text-sm font-medium text-ink">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </ContentSection>

      <ContentSection id="experience" title="Expérience utilisateur">
        <ol className="space-y-3">
          {platformSsoUserExperience.map((ux) => (
            <li key={ux.step} className="rounded-2xl border border-border-light bg-surface-elevated p-5 shadow-sm">
              <p className="font-semibold text-ink">{ux.step}</p>
              <p className="mt-1 text-sm text-ink-secondary">{ux.detail}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50/50 p-5">
          <p className="text-sm font-semibold text-green-800">Résultat :</p>
          <ul className="mt-2 space-y-1">
            {platformSsoUserResult.map((r) => (
              <li key={r} className="text-sm text-green-900">✓ {r}</li>
            ))}
          </ul>
        </div>
      </ContentSection>

      <ContentSection id="securite" title="Sécurité">
        <FlowDiagram nodes={platformSsoSecurityFlow} className="mb-8" />
        <div className="grid gap-4 md:grid-cols-2">
          {platformSsoSecurityMeasures.map((m) => (
            <div key={m.measure} className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5">
              <p className="font-semibold text-amber-900">{m.measure}</p>
              <p className="mt-2 text-sm text-amber-800">{m.detail}</p>
            </div>
          ))}
        </div>
      </ContentSection>

      <LessonCapturesSection lessonSlug={PLATFORM_SSO_LESSON_SLUG} />

      <ContentSection id="depannage" title="Dépannage">
        <div className="space-y-4">
          {platformSsoTroubleshooting.map((item) => (
            <div key={item.problem} className="rounded-2xl border border-border-light bg-surface-elevated p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase text-red-600">Erreur</p>
              <p className="mt-1 font-semibold text-ink">{item.problem}</p>
              <ul className="mt-3 space-y-1">
                {item.causes.map((c) => (
                  <li key={c} className="text-sm text-ink-secondary">• {c}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs font-semibold uppercase text-green-600">Solution</p>
              <p className="mt-1 text-sm text-ink-secondary">{item.solution}</p>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="bonnes-pratiques" title="Bonnes pratiques">
        <div className="rounded-3xl border border-green-100 bg-green-50/40 p-6 shadow-sm md:p-8">
          <ul className="space-y-3">
            {platformSsoBestPractices.map((tip) => (
              <li key={tip} className="flex gap-2 text-sm text-ink-secondary">
                <span className="text-green-600">✦</span> {tip}
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
          15 questions · 0–59 % À revoir · 60–79 % Correct · 80–99 % Validé · 100 % Expert Platform SSO
        </p>
        <LessonQuiz
          key={quizKey}
          questions={platformSsoQuizQuestions}
          onScoreChange={setQuizScore}
          passingScore={80}
          scoreTiers={platformSsoScoreTiers}
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

      <ContentSection id="laboratoire" title="Laboratoire pratique">
        <p className="mb-6 text-sm text-ink-secondary">
          TP complet Platform SSO — tenant Entra ID et Mac de labo requis.
        </p>
        <div className="space-y-6">
          {platformSsoLabExercises.map((ex) => (
            <div key={ex.title} className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
              <h3 className="text-lg font-bold text-ink">{ex.title}</h3>
              <p className="mt-2 text-sm text-ink-secondary">{ex.goal}</p>
              <ol className="mt-4 space-y-2">
                {ex.steps.map((step, i) => (
                  <li key={step} className="flex gap-3 text-sm text-ink-secondary">
                    <span className="font-bold text-accent">{i + 1}.</span> {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <LessonChecklist
            items={platformSsoLabChecklist}
            onCompleteChange={setLabDone}
            successTitle="✓ Laboratoire Platform SSO terminé"
            successMessage="Profil déployé, SSO et Password Sync validés."
          />
          <DeployStatusCard
            checkedCount={combinedChecklist ? platformSsoLabChecklist.length : 0}
            total={platformSsoLabChecklist.length}
          />
        </div>
      </ContentSection>
    </div>
  );
}
