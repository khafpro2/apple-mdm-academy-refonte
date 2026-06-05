"use client";

import { useState } from "react";
import {
  appleIdComparison,
  getManagedAppleIdsDeployStatus,
  managedAppleIdsAdvantages,
  managedAppleIdsBestPractices,
  managedAppleIdsCaseStudy,
  managedAppleIdsDefinition,
  managedAppleIdsDomainCapture,
  managedAppleIdsFederationArchitecture,
  managedAppleIdsFederationBenefits,
  managedAppleIdsFederationSteps,
  managedAppleIdsLabChecklist,
  managedAppleIdsLabExercises,
  managedAppleIdsLimitations,
  managedAppleIdsManualCreationSteps,
  managedAppleIdsObjectives,
  managedAppleIdsQuizQuestions,
  managedAppleIdsScoreTiers,
  managedAppleIdsSecurityMeasures,
  managedAppleIdsSyncLifecycle,
  managedAppleIdsTroubleshooting,
  managedAppleIdsUseCases,
  MANAGED_APPLE_IDS_COMPLETE_KEY,
  MANAGED_APPLE_IDS_LESSON_SLUG,
} from "@/lib/data/lessons/managed-apple-ids-content";
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
    <div className={`rounded-3xl border border-border-light bg-gradient-to-b from-surface to-gray-50/30 p-6 shadow-sm md:p-10 ${className}`}>
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
  { href: "#definition", label: "Définition" },
  { href: "#avantages", label: "Avantages" },
  { href: "#creation-manuelle", label: "Création manuelle" },
  { href: "#federation", label: "Fédération Entra ID" },
  { href: "#domain-capture", label: "Domain Capture" },
  { href: "#synchronisation", label: "Synchronisation" },
  { href: "#limitations", label: "Limitations" },
  { href: "#securite", label: "Sécurité" },
  CAPTURES_TOC_LINK,
  { href: "#depannage", label: "Dépannage" },
  { href: "#bonnes-pratiques", label: "Bonnes pratiques" },
  { href: "#cas-pratique", label: "Cas pratique" },
  { href: "#quiz", label: "Quiz" },
  { href: "#laboratoire", label: "Laboratoire" },
];

export function ManagedAppleIdsTableOfContents({ mobile = false }: { mobile?: boolean }) {
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
  const status = getManagedAppleIdsDeployStatus(checkedCount, total);
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
        État du déploiement
      </p>
      <p className={`mt-2 text-xl font-bold ${isHealthy ? "text-green-800" : "text-amber-800"}`}>
        {isHealthy ? "✓ Managed Apple IDs opérationnels" : "⚠ Configuration en cours"}
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
      <h3 className="text-xl font-bold text-ink">{managedAppleIdsCaseStudy.title}</h3>
      <p className="mt-4 text-sm leading-relaxed text-ink-secondary">{managedAppleIdsCaseStudy.scenario}</p>
      <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/5 p-5">
        <p className="text-sm font-semibold text-ink">Votre plan :</p>
        <ol className="mt-3 space-y-2">
          {managedAppleIdsCaseStudy.tasks.map((task, i) => (
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
            {managedAppleIdsCaseStudy.solution.map((step, i) => (
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

export function ManagedAppleIdsLesson() {
  const [quizKey, setQuizKey] = useState(0);
  const [labDone, setLabDone] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const { markedComplete, markComplete } = useLessonCompletion(MANAGED_APPLE_IDS_COMPLETE_KEY);

  return (
    <div className="space-y-14">
      <LessonProgressBar checklistDone={labDone} quizScore={quizScore} markedComplete={markedComplete} />

      <ContentSection id="objectifs" title="Objectifs">
        <ul className="space-y-3">
          {managedAppleIdsObjectives.map((obj) => (
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

      <ContentSection id="definition" title="Qu'est-ce qu'un Managed Apple ID ?">
        <div className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
          <p className="text-sm leading-7 text-ink-secondary md:text-base">{managedAppleIdsDefinition.summary}</p>
          <p className="mt-4 text-sm font-semibold text-ink">Administré depuis :</p>
          <ul className="mt-2 space-y-1">
            {managedAppleIdsDefinition.adminSources.map((s) => (
              <li key={s} className="text-sm text-ink-secondary">✓ {s}</li>
            ))}
          </ul>
        </div>

        <p className="mb-4 mt-10 text-lg font-bold text-ink">Apple ID personnel vs Managed Apple ID</p>
        <div className="overflow-x-auto rounded-3xl border border-border-light bg-surface-elevated shadow-sm">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-border-light bg-surface">
                <th className="px-5 py-3 font-semibold text-ink">Critère</th>
                <th className="px-5 py-3 font-semibold text-sky-700">Apple ID personnel</th>
                <th className="px-5 py-3 font-semibold text-gray-900">Managed Apple ID</th>
              </tr>
            </thead>
            <tbody>
              {appleIdComparison.map((row) => (
                <tr key={row.aspect} className="border-b border-border-light/50">
                  <td className="px-5 py-3 font-medium text-ink">{row.aspect}</td>
                  <td className="px-5 py-3 text-ink-secondary">{row.personal}</td>
                  <td className="px-5 py-3 text-ink-secondary">{row.managed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ContentSection>

      <ContentSection id="avantages" title="Avantages">
        <div className="rounded-3xl border border-green-100 bg-green-50/40 p-6 shadow-sm md:p-8">
          <ul className="space-y-3">
            {managedAppleIdsAdvantages.map((a) => (
              <li key={a} className="flex gap-2 text-sm text-ink-secondary">
                <span className="text-green-600">✓</span> {a}
              </li>
            ))}
          </ul>
        </div>
        <p className="mb-4 mt-8 text-sm font-semibold text-ink">Cas d&apos;usage :</p>
        <div className="grid gap-4 md:grid-cols-3">
          {managedAppleIdsUseCases.map((uc) => (
            <div key={uc.sector} className="rounded-2xl border border-border-light bg-surface-elevated p-5 shadow-sm">
              <span className="text-3xl" aria-hidden="true">{uc.icon}</span>
              <p className="mt-3 font-bold text-ink">{uc.sector}</p>
              <p className="mt-2 text-sm text-ink-secondary">{uc.examples}</p>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="creation-manuelle" title="Création manuelle dans ABM">
        <div className="space-y-4">
          {managedAppleIdsManualCreationSteps.map((item) => (
            <div key={item.step} className="rounded-2xl border border-border-light bg-surface-elevated p-5 shadow-sm">
              <p className="font-semibold text-ink">{item.step}</p>
              <p className="mt-2 text-sm text-ink-secondary">{item.detail}</p>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="federation" title="Fédération Microsoft Entra ID">
        <FlowDiagram nodes={managedAppleIdsFederationArchitecture} />
        <ul className="mt-6 space-y-2">
          {managedAppleIdsFederationBenefits.map((b) => (
            <li key={b} className="flex gap-2 text-sm text-ink-secondary">
              <span className="text-blue-600">✓</span> {b}
            </li>
          ))}
        </ul>
        <ol className="mt-6 space-y-3">
          {managedAppleIdsFederationSteps.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm text-ink-secondary">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </ContentSection>

      <ContentSection id="domain-capture" title="Domain Capture">
        <div className="rounded-3xl border border-amber-200 bg-amber-50/40 p-6 shadow-sm md:p-8">
          <h3 className="text-lg font-bold text-ink">{managedAppleIdsDomainCapture.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{managedAppleIdsDomainCapture.description}</p>
          <div className="mt-6 rounded-xl border border-amber-100 bg-white/80 p-4 font-mono text-sm">
            <p><span className="text-ink-tertiary">Host:</span> {managedAppleIdsDomainCapture.txtRecordExample.host}</p>
            <p className="mt-1"><span className="text-ink-tertiary">Type:</span> {managedAppleIdsDomainCapture.txtRecordExample.type}</p>
            <p className="mt-1 break-all"><span className="text-ink-tertiary">Value:</span> {managedAppleIdsDomainCapture.txtRecordExample.value}</p>
          </div>
          <p className="mt-4 text-sm font-semibold text-red-700">Risques :</p>
          <ul className="mt-2 space-y-1">
            {managedAppleIdsDomainCapture.risks.map((r) => (
              <li key={r} className="text-sm text-ink-secondary">• {r}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink-secondary">{managedAppleIdsDomainCapture.resolution}</p>
        </div>
      </ContentSection>

      <ContentSection id="synchronisation" title="Synchronisation utilisateurs">
        <div className="grid gap-4 md:grid-cols-2">
          {managedAppleIdsSyncLifecycle.map((item) => (
            <div key={item.event} className="rounded-2xl border border-border-light bg-surface-elevated p-5 shadow-sm">
              <p className="font-semibold text-ink">{item.event}</p>
              <p className="mt-2 text-sm text-ink-secondary">{item.description}</p>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="limitations" title="Limitations officielles">
        <div className="rounded-3xl border border-red-100 bg-red-50/30 p-6 shadow-sm md:p-8">
          <p className="mb-4 text-sm font-semibold text-ink">Un Managed Apple ID ne peut pas :</p>
          <div className="space-y-3">
            {managedAppleIdsLimitations.map((lim) => (
              <div key={lim.limitation} className="flex gap-3 rounded-xl border border-red-100 bg-white/80 px-4 py-3">
                <span className="shrink-0 text-red-500" aria-hidden="true">✗</span>
                <div>
                  <p className="text-sm font-semibold text-ink">{lim.limitation}</p>
                  <p className="mt-0.5 text-sm text-ink-secondary">{lim.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ContentSection>

      <ContentSection id="securite" title="Sécurité">
        <div className="grid gap-4 md:grid-cols-2">
          {managedAppleIdsSecurityMeasures.map((m) => (
            <div key={m.measure} className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5">
              <p className="font-semibold text-indigo-900">{m.measure}</p>
              <p className="mt-2 text-sm text-indigo-800">{m.detail}</p>
            </div>
          ))}
        </div>
      </ContentSection>

      <LessonCapturesSection lessonSlug={MANAGED_APPLE_IDS_LESSON_SLUG} />

      <ContentSection id="depannage" title="Dépannage">
        <div className="space-y-4">
          {managedAppleIdsTroubleshooting.map((item) => (
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
            {managedAppleIdsBestPractices.map((tip) => (
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
          15 questions · 0–59 % À revoir · 60–79 % Correct · 80–99 % Validé · 100 % Expert Managed Apple ID
        </p>
        <LessonQuiz
          key={quizKey}
          questions={managedAppleIdsQuizQuestions}
          onScoreChange={setQuizScore}
          passingScore={80}
          scoreTiers={managedAppleIdsScoreTiers}
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
          TP complet — exécutez chaque exercice dans un tenant ABM / Entra ID de labo (ou sandbox).
        </p>
        <div className="space-y-6">
          {managedAppleIdsLabExercises.map((ex) => (
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
            items={managedAppleIdsLabChecklist}
            onCompleteChange={setLabDone}
            successTitle="✓ Laboratoire Managed Apple ID terminé"
            successMessage="DNS, fédération, SCIM et SSO validés."
          />
          <DeployStatusCard
            checkedCount={labDone ? managedAppleIdsLabChecklist.length : 0}
            total={managedAppleIdsLabChecklist.length}
          />
        </div>
      </ContentSection>
    </div>
  );
}
