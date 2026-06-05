"use client";

import { useState } from "react";
import {
  getVppSyncHealthStatus,
  vppAppsArchitecture,
  vppAppsCapabilities,
  vppAppsExamples,
  vppAppsObjectives,
  vppBestPractices,
  vppCaseStudy,
  vppDeploymentMethods,
  vppIntuneSyncSteps,
  vppLicenseRecoveryBenefit,
  vppLicenseRecoverySteps,
  vppLicenseTypes,
  vppPurchaseSteps,
  vppQuizQuestions,
  vppScoreTiers,
  vppSilentInstallExample,
  vppSilentInstallFeatures,
  vppSyncVerificationItems,
  vppTroubleshooting,
  VPP_APPS_COMPLETE_KEY,
  VPP_APPS_LESSON_SLUG,
} from "@/lib/data/lessons/vpp-apps-content";
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
    <div className={`rounded-3xl border border-border-light bg-gradient-to-b from-surface to-blue-50/20 p-6 shadow-sm md:p-10 ${className}`}>
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
  { href: "#achat", label: "Achat de licences" },
  { href: "#sync-intune", label: "Sync Intune" },
  { href: "#deploiement", label: "Déploiement" },
  { href: "#installation-silencieuse", label: "Installation silencieuse" },
  { href: "#recuperation", label: "Récupération" },
  CAPTURES_TOC_LINK,
  { href: "#depannage", label: "Dépannage" },
  { href: "#bonnes-pratiques", label: "Bonnes pratiques" },
  { href: "#cas-pratique", label: "Cas pratique" },
  { href: "#quiz", label: "Quiz" },
];

export function VppAppsTableOfContents({ mobile = false }: { mobile?: boolean }) {
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

function SyncHealthCard({ checkedCount, total }: { checkedCount: number; total: number }) {
  const status = getVppSyncHealthStatus(checkedCount, total);
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
        État de synchronisation
      </p>
      <p className={`mt-2 text-xl font-bold ${isHealthy ? "text-green-800" : "text-amber-800"}`}>
        {isHealthy ? "✓ Token actif — Apps synchronisées" : "⚠ Attention requise"}
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
      <h3 className="text-xl font-bold text-ink">{vppCaseStudy.title}</h3>
      <p className="mt-4 text-sm leading-relaxed text-ink-secondary">{vppCaseStudy.scenario}</p>
      <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/5 p-5">
        <p className="text-sm font-semibold text-ink">Votre plan d&apos;action :</p>
        <ol className="mt-3 space-y-2">
          {vppCaseStudy.tasks.map((task, i) => (
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
            {vppCaseStudy.solution.map((step, i) => (
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

export function VppAppsLesson() {
  const [quizKey, setQuizKey] = useState(0);
  const [syncDone, setSyncDone] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const { markedComplete, markComplete } = useLessonCompletion(VPP_APPS_COMPLETE_KEY);

  return (
    <div className="space-y-14">
      <LessonProgressBar
        checklistDone={syncDone}
        quizScore={quizScore}
        markedComplete={markedComplete}
      />

      <ContentSection id="objectifs" title="Objectifs">
        <p className="mb-4 text-sm text-ink-secondary">
          À la fin de cette leçon, l&apos;apprenant sera capable de :
        </p>
        <ul className="space-y-3">
          {vppAppsObjectives.map((obj) => (
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

      <ContentSection id="theorie" title="Apps & Books — Théorie">
        <div className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
          <p className="text-sm leading-7 text-ink-secondary md:text-base">
            <strong className="text-ink">Apps & Books</strong> (anciennement Volume Purchase Program — VPP) est le
            service Apple Business Manager qui permet aux organisations d&apos;acheter, distribuer et gérer des
            applications en volume via un serveur MDM comme Intune ou Jamf Pro.
          </p>
          <p className="mt-4 text-sm font-semibold text-ink">Apps & Books permet de :</p>
          <ul className="mt-3 space-y-2">
            {vppAppsCapabilities.map((cap) => (
              <li key={cap} className="flex gap-2 text-sm text-ink-secondary">
                <span className="text-blue-600" aria-hidden="true">✓</span>
                {cap}
              </li>
            ))}
          </ul>
        </div>

        <p className="mb-4 mt-8 text-sm font-medium text-ink-secondary">Exemples d&apos;applications courantes :</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {vppAppsExamples.map((app) => (
            <div
              key={app.name}
              className="flex items-center gap-3 rounded-2xl border border-border-light bg-surface-elevated px-4 py-3 shadow-sm transition hover:shadow-md"
            >
              <span className="text-2xl" aria-hidden="true">{app.icon}</span>
              <div>
                <p className="text-sm font-semibold text-ink">{app.name}</p>
                <p className="text-xs text-ink-tertiary">{app.category}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mb-4 mt-8 text-sm font-medium text-ink-secondary">Architecture :</p>
        <FlowDiagram nodes={vppAppsArchitecture} />
      </ContentSection>

      <ContentSection id="achat" title="Achat de licences">
        <div className="space-y-6">
          {vppPurchaseSteps.map((block) => (
            <div
              key={block.title}
              className="scroll-mt-24 rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8"
            >
              <h3 className="text-lg font-bold text-ink">{block.title}</h3>
              {"link" in block && block.link && (
                <a
                  href={block.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-medium text-accent hover:underline"
                >
                  {block.link}
                </a>
              )}
              <ol className="mt-4 space-y-2">
                {block.steps.map((step, i) => (
                  <li key={step} className="flex gap-3 text-sm leading-relaxed text-ink-secondary">
                    <span className="font-bold text-ink-tertiary">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <p className="mb-4 mt-8 text-sm font-semibold text-ink">Types de licences</p>
        <div className="grid gap-4 md:grid-cols-3">
          {vppLicenseTypes.map((type) => (
            <div
              key={type.title}
              className="rounded-2xl border border-border-light bg-surface-elevated p-5 shadow-sm"
            >
              <span className="text-2xl" aria-hidden="true">{type.icon}</span>
              <p className="mt-3 font-semibold text-ink">{type.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{type.description}</p>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="sync-intune" title="Synchronisation Intune">
        <div className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
          <ol className="space-y-3">
            {vppIntuneSyncSteps.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm leading-relaxed text-ink-secondary">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6">
          <p className="mb-3 text-sm font-semibold text-ink">Vérification post-synchronisation</p>
          <LessonChecklist
            items={vppSyncVerificationItems}
            onCompleteChange={setSyncDone}
            successTitle="✓ Synchronisation Apps & Books validée"
            successMessage="Token actif, applications synchronisées et licences disponibles."
          />
          <SyncHealthCard
            checkedCount={syncDone ? vppSyncVerificationItems.length : 0}
            total={vppSyncVerificationItems.length}
          />
        </div>
      </ContentSection>

      <ContentSection id="deploiement" title="Déploiement d'applications">
        <div className="grid gap-6 md:grid-cols-2">
          {vppDeploymentMethods.map((method) => (
            <div
              key={method.title}
              className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8"
            >
              <div className={`inline-flex rounded-xl bg-gradient-to-r ${method.color} px-4 py-2`}>
                <span className="mr-2 text-xl" aria-hidden="true">{method.icon}</span>
                <div>
                  <p className="text-sm font-bold text-white">{method.title}</p>
                  <p className="text-xs text-white/80">{method.subtitle}</p>
                </div>
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-green-600">Avantages</p>
              <ul className="mt-2 space-y-1">
                {method.pros.map((pro) => (
                  <li key={pro} className="text-sm text-ink-secondary">✓ {pro}</li>
                ))}
              </ul>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-amber-600">Inconvénients</p>
              <ul className="mt-2 space-y-1">
                {method.cons.map((con) => (
                  <li key={con} className="text-sm text-ink-secondary">• {con}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="installation-silencieuse" title="Installation silencieuse">
        <div className="rounded-3xl border border-green-100 bg-gradient-to-br from-green-50/80 to-emerald-50/50 p-6 shadow-sm md:p-8">
          <p className="text-sm font-semibold text-ink">Une application VPP peut être :</p>
          <ul className="mt-4 space-y-3">
            {vppSilentInstallFeatures.map((feature) => (
              <li key={feature} className="flex gap-2 text-sm leading-relaxed text-ink-secondary">
                <span className="shrink-0 text-green-600" aria-hidden="true">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <p className="mb-4 mt-8 text-sm font-medium text-ink-secondary">
          Exemple — Déploiement automatique de Microsoft Teams :
        </p>
        <FlowDiagram nodes={vppSilentInstallExample} />
      </ContentSection>

      <ContentSection id="recuperation" title="Récupération des licences">
        <div className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
          <p className="text-sm leading-relaxed text-ink-secondary">
            Lorsqu&apos;un employé quitte l&apos;entreprise, récupérez la licence pour la réutiliser :
          </p>
          <ol className="mt-4 space-y-3">
            {vppLicenseRecoverySteps.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm leading-relaxed text-ink-secondary">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50/50 px-5 py-4">
            <p className="text-sm font-semibold text-blue-800">Avantage</p>
            <p className="mt-1 text-sm text-blue-900">{vppLicenseRecoveryBenefit}</p>
          </div>
        </div>
      </ContentSection>

      <LessonCapturesSection lessonSlug={VPP_APPS_LESSON_SLUG} />

      <ContentSection id="depannage" title="Dépannage">
        <div className="space-y-4">
          {vppTroubleshooting.map((item) => (
            <div
              key={item.problem}
              className="rounded-2xl border border-border-light bg-surface-elevated p-5 shadow-sm transition hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-red-600">Erreur</p>
              <p className="mt-1 font-semibold text-ink">{item.problem}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-tertiary">Causes possibles</p>
              <ul className="mt-2 space-y-1">
                {item.causes.map((cause) => (
                  <li key={cause} className="text-sm text-ink-secondary">• {cause}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-green-600">Solution</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-secondary">{item.solution}</p>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="bonnes-pratiques" title="Bonnes pratiques">
        <div className="rounded-3xl border border-green-100 bg-gradient-to-br from-green-50/80 to-emerald-50/50 p-6 shadow-sm md:p-8">
          <ul className="space-y-3">
            {vppBestPractices.map((tip) => (
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
          10 questions · 0–59 % À revoir · 60–79 % Correct · 80–99 % Validé · 100 % Expert Apps & Books
        </p>
        <LessonQuiz
          key={quizKey}
          questions={vppQuizQuestions}
          onScoreChange={setQuizScore}
          passingScore={80}
          scoreTiers={vppScoreTiers}
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
