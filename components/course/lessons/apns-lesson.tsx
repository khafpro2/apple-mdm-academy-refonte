"use client";

import { useState } from "react";
import {
  apnsArchitecture,
  apnsBestPractices,
  apnsCaseStudy,
  apnsCreationSteps,
  apnsInstallAppFlow,
  apnsObjectives,
  apnsPushFlow,
  apnsQuizQuestions,
  apnsRenewalBreakConsequences,
  apnsRenewalChecklist,
  apnsRenewalRules,
  apnsScoreTiers,
  apnsTroubleshooting,
  apnsVerificationItems,
  apnsWithoutConsequences,
  APNS_COMPLETE_KEY,
  APNS_LESSON_SLUG,
  getApnsHealthStatus,
} from "@/lib/data/lessons/apns-content";
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
    <div className={`rounded-3xl border border-border-light bg-gradient-to-b from-surface to-orange-50/20 p-6 shadow-sm md:p-10 ${className}`}>
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
  { href: "#apns", label: "Qu'est-ce qu'APNs ?" },
  { href: "#fonctionnement", label: "Fonctionnement" },
  { href: "#creation", label: "Création" },
  { href: "#renouvellement", label: "Renouvellement" },
  { href: "#verification", label: "Vérification" },
  CAPTURES_TOC_LINK,
  { href: "#depannage", label: "Dépannage" },
  { href: "#bonnes-pratiques", label: "Bonnes pratiques" },
  { href: "#cas-pratique", label: "Cas pratique" },
  { href: "#quiz", label: "Quiz" },
];

export function ApnsTableOfContents({ mobile = false }: { mobile?: boolean }) {
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

function HealthStatusCard({ checkedCount, total }: { checkedCount: number; total: number }) {
  const status = getApnsHealthStatus(checkedCount, total);
  const isHealthy = status === "healthy";

  return (
    <div
      className={`mt-6 rounded-2xl border px-6 py-5 text-center ${
        isHealthy
          ? "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50"
          : "border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">État du certificat APNs</p>
      <p className={`mt-2 text-xl font-bold ${isHealthy ? "text-green-800" : "text-amber-800"}`}>
        {isHealthy ? "✓ État : Sain" : "⚠ État : Attention requise"}
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
      <h3 className="text-xl font-bold text-ink">{apnsCaseStudy.title}</h3>
      <p className="mt-4 text-sm leading-relaxed text-ink-secondary">{apnsCaseStudy.scenario}</p>
      <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/5 p-5">
        <p className="text-sm font-semibold text-ink">Votre diagnostic :</p>
        <ol className="mt-3 space-y-2">
          {apnsCaseStudy.tasks.map((task, i) => (
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
            Afficher la correction détaillée
          </Button>
        ) : (
          <div className="rounded-2xl border border-green-200 bg-green-50/50 p-5">
            <p className="text-sm font-semibold text-green-800">Correction</p>
            <ol className="mt-4 space-y-3">
              {apnsCaseStudy.solution.map((step, i) => (
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

export function ApnsLesson() {
  const [quizKey, setQuizKey] = useState(0);
  const [checklistDone, setChecklistDone] = useState(false);
  const [renewalDone, setRenewalDone] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const { markedComplete, markComplete } = useLessonCompletion(APNS_COMPLETE_KEY);

  const combinedChecklist = checklistDone && renewalDone;

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
          {apnsObjectives.map((obj) => (
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

      <ContentSection id="apns" title="Qu'est-ce qu'APNs ?">
        <div className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
          <p className="text-sm leading-7 text-ink-secondary md:text-base">
            <strong className="text-ink">Apple Push Notification service (APNs)</strong> est le service Apple
            qui permet à un serveur MDM (Intune, Jamf Pro, etc.) de communiquer avec les appareils iPhone, iPad et Mac.
            C&apos;est le canal push obligatoire — sans lui, la gestion à distance est impossible.
          </p>
          <div className="mt-6">
            <p className="text-sm font-semibold text-red-700">Sans certificat APNs valide :</p>
            <ul className="mt-3 space-y-2">
              {apnsWithoutConsequences.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-ink-secondary">
                  <span className="text-red-500" aria-hidden="true">❌</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mb-4 mt-8 text-sm font-medium text-ink-secondary">Architecture :</p>
        <FlowDiagram nodes={apnsArchitecture} />
      </ContentSection>

      <ContentSection id="fonctionnement" title="Fonctionnement">
        <div className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
          <p className="mb-4 text-sm font-semibold text-ink">Quand un administrateur pousse une commande :</p>
          <ol className="space-y-3">
            {apnsPushFlow.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm leading-relaxed text-ink-secondary">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
        <p className="mb-4 mt-8 text-sm font-medium text-ink-secondary">
          Exemple — Installer une application :
        </p>
        <FlowDiagram nodes={apnsInstallAppFlow} />
      </ContentSection>

      <ContentSection id="creation" title="Création du certificat APNs">
        <div className="space-y-6">
          {apnsCreationSteps.map((block) => (
            <div
              key={block.title}
              id={block.title.includes("Étape 1") ? "creation" : undefined}
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
      </ContentSection>

      <ContentSection id="renouvellement" title="Renouvellement">
        <div className="rounded-3xl border border-amber-200 bg-amber-50/50 p-6 shadow-sm md:p-8">
          <p className="flex items-center gap-2 text-lg font-bold text-amber-900">
            <span aria-hidden="true">⚠️</span> IMPORTANT
          </p>
          <p className="mt-3 text-sm leading-relaxed text-amber-900">
            Toujours utiliser le <strong>même Apple ID</strong> que lors de la création initiale du certificat.
          </p>
          <p className="mt-4 text-sm font-semibold text-amber-900">
            Si le certificat est renouvelé avec un autre Apple ID :
          </p>
          <ul className="mt-2 space-y-1">
            {apnsRenewalBreakConsequences.map((c) => (
              <li key={c} className="flex gap-2 text-sm text-amber-800">
                <span aria-hidden="true">❌</span> {c}
              </li>
            ))}
          </ul>
        </div>
        <ul className="mt-6 space-y-2">
          {apnsRenewalRules.map((rule) => (
            <li key={rule} className="rounded-xl bg-surface px-4 py-3 text-sm text-ink-secondary">
              • {rule}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <p className="mb-3 text-sm font-semibold text-ink">Checklist renouvellement</p>
          <LessonChecklist
            items={apnsRenewalChecklist}
            onCompleteChange={setRenewalDone}
            successTitle="✓ Prêt pour le renouvellement"
            successMessage="Toutes les conditions sont remplies pour renouveler sans interruption."
          />
        </div>
      </ContentSection>

      <ContentSection id="verification" title="Vérification">
        <p className="mb-4 text-sm text-ink-secondary">
          Cochez chaque contrôle pour valider l&apos;état de votre certificat APNs :
        </p>
        <LessonChecklist
          items={apnsVerificationItems}
          onCompleteChange={setChecklistDone}
          successTitle="✓ Environnement APNs opérationnel"
          successMessage="Certificat actif, communication MDM et synchronisation confirmées."
        />
        <HealthStatusCard
          checkedCount={checklistDone ? apnsVerificationItems.length : 0}
          total={apnsVerificationItems.length}
        />
      </ContentSection>

      <LessonCapturesSection lessonSlug={APNS_LESSON_SLUG} />

      <ContentSection id="depannage" title="Dépannage">
        <div className="space-y-4">
          {apnsTroubleshooting.map((item) => (
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
            {apnsBestPractices.map((tip) => (
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
          10 questions · 0–59 % À revoir · 60–79 % Bon niveau · 80–99 % Validé · 100 % Expert APNs
        </p>
        <LessonQuiz
          key={quizKey}
          questions={apnsQuizQuestions}
          onScoreChange={setQuizScore}
          passingScore={80}
          scoreTiers={apnsScoreTiers}
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
