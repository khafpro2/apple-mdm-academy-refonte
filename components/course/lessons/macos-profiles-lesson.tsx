"use client";

import { useState } from "react";
import {
  getMacosProfileDeployStatus,
  macosFileVaultDetails,
  macosIntuneDeploySteps,
  macosIntuneVerificationItems,
  macosJamfDeploySteps,
  macosJamfScopeExplanation,
  macosPppcExplanation,
  macosProfilesArchitecture,
  macosProfilesBenefits,
  macosProfilesBestPractices,
  macosProfilesCaseStudy,
  macosProfilesObjectives,
  macosProfilesQuizQuestions,
  macosProfileTypes,
  macosProfilesScoreTiers,
  macosRestrictionsList,
  macosSystemExtensionsInfo,
  macosTroubleshooting,
  macosVpnProfileExample,
  macosWifiProfileExample,
  MACOS_PROFILES_COMPLETE_KEY,
  MACOS_PROFILES_LESSON_SLUG,
} from "@/lib/data/lessons/macos-profiles-content";
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
    <div className={`rounded-3xl border border-border-light bg-gradient-to-b from-surface to-slate-50/30 p-6 shadow-sm md:p-10 ${className}`}>
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
  { href: "#types", label: "Types de profils" },
  { href: "#wifi", label: "Wi-Fi" },
  { href: "#vpn", label: "VPN" },
  { href: "#filevault", label: "FileVault" },
  { href: "#restrictions", label: "Restrictions" },
  { href: "#pppc", label: "PPPC" },
  { href: "#system-extensions", label: "System Extensions" },
  { href: "#deploiement-intune", label: "Intune" },
  { href: "#deploiement-jamf", label: "Jamf" },
  CAPTURES_TOC_LINK,
  { href: "#depannage", label: "Dépannage" },
  { href: "#bonnes-pratiques", label: "Bonnes pratiques" },
  { href: "#cas-pratique", label: "Cas pratique" },
  { href: "#quiz", label: "Quiz" },
];

export function MacosProfilesTableOfContents({ mobile = false }: { mobile?: boolean }) {
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
  const status = getMacosProfileDeployStatus(checkedCount, total);
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
        {isHealthy ? "✓ Profils macOS déployés et validés" : "⚠ Vérifications en cours"}
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
      <h3 className="text-xl font-bold text-ink">{macosProfilesCaseStudy.title}</h3>
      <p className="mt-4 text-sm leading-relaxed text-ink-secondary">{macosProfilesCaseStudy.scenario}</p>
      <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/5 p-5">
        <p className="text-sm font-semibold text-ink">Votre plan d&apos;action :</p>
        <ol className="mt-3 space-y-2">
          {macosProfilesCaseStudy.tasks.map((task, i) => (
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
          Afficher la solution détaillée
        </Button>
      ) : (
        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50/50 p-5">
          <p className="text-sm font-semibold text-green-800">Solution détaillée</p>
          <ol className="mt-3 space-y-3">
            {macosProfilesCaseStudy.solution.map((step, i) => (
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

export function MacosProfilesLesson() {
  const [quizKey, setQuizKey] = useState(0);
  const [deployDone, setDeployDone] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const { markedComplete, markComplete } = useLessonCompletion(MACOS_PROFILES_COMPLETE_KEY);

  return (
    <div className="space-y-14">
      <LessonProgressBar
        checklistDone={deployDone}
        quizScore={quizScore}
        markedComplete={markedComplete}
      />

      <ContentSection id="objectifs" title="Objectifs">
        <p className="mb-4 text-sm text-ink-secondary">
          À la fin de cette leçon, l&apos;apprenant sera capable de :
        </p>
        <ul className="space-y-3">
          {macosProfilesObjectives.map((obj) => (
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

      <ContentSection id="introduction" title="Introduction">
        <div className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
          <p className="text-sm leading-7 text-ink-secondary md:text-base">
            Les <strong className="text-ink">profils de configuration macOS</strong> permettent de gérer
            les Mac sans intervention utilisateur. Envoyés via Intune ou Jamf Pro, ils standardisent
            et sécurisent l&apos;ensemble du parc.
          </p>
          <p className="mt-4 text-sm font-semibold text-ink">Ils servent à :</p>
          <ul className="mt-3 space-y-2">
            {macosProfilesBenefits.map((b) => (
              <li key={b} className="flex gap-2 text-sm text-ink-secondary">
                <span className="text-slate-700" aria-hidden="true">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
        <p className="mb-4 mt-8 text-sm font-medium text-ink-secondary">Architecture :</p>
        <FlowDiagram nodes={macosProfilesArchitecture} />
      </ContentSection>

      <ContentSection id="types" title="Types de profils macOS">
        <div className="space-y-4">
          {macosProfileTypes.map((profile) => (
            <details
              key={profile.id}
              className="group rounded-2xl border border-border-light bg-surface-elevated shadow-sm open:shadow-md"
            >
              <summary className="flex cursor-pointer items-center gap-3 px-5 py-4 font-semibold text-ink transition hover:bg-surface">
                <span className="text-2xl" aria-hidden="true">{profile.icon}</span>
                <span>{profile.title}</span>
                <span className="ml-auto text-ink-tertiary transition group-open:rotate-180">▼</span>
              </summary>
              <div className="border-t border-border-light px-5 pb-5 pt-4">
                <p className="text-sm leading-relaxed text-ink-secondary">{profile.description}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Cas d&apos;usage</p>
                <p className="mt-1 text-sm text-ink-secondary">{profile.useCase}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-red-600">Risques</p>
                <ul className="mt-1 space-y-1">
                  {profile.risks.map((risk) => (
                    <li key={risk} className="text-sm text-ink-secondary">• {risk}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-green-600">Bonnes pratiques</p>
                <ul className="mt-1 space-y-1">
                  {profile.bestPractices.map((bp) => (
                    <li key={bp} className="text-sm text-ink-secondary">✓ {bp}</li>
                  ))}
                </ul>
              </div>
            </details>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="wifi" title="Profil Wi-Fi — Corporate WiFi">
        <div className="rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-50/80 to-blue-50/50 p-6 shadow-sm md:p-8">
          <h3 className="text-lg font-bold text-ink">{macosWifiProfileExample.name}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {macosWifiProfileExample.settings.map((s) => (
              <div key={s.label} className="rounded-xl border border-sky-100 bg-white/80 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">{s.label}</p>
                <p className="mt-1 text-sm font-medium text-ink">{s.value}</p>
              </div>
            ))}
          </div>
          <ul className="mt-6 space-y-2">
            {macosWifiProfileExample.benefits.map((b) => (
              <li key={b} className="flex gap-2 text-sm text-ink-secondary">
                <span className="shrink-0 text-sky-600" aria-hidden="true">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </ContentSection>

      <ContentSection id="vpn" title="Profil VPN">
        <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-violet-50/50 p-6 shadow-sm md:p-8">
          <h3 className="text-lg font-bold text-ink">{macosVpnProfileExample.name}</h3>
          <p className="mt-1 text-sm text-indigo-700">Type : {macosVpnProfileExample.type}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {macosVpnProfileExample.settings.map((s) => (
              <div key={s.label} className="rounded-xl border border-indigo-100 bg-white/80 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">{s.label}</p>
                <p className="mt-1 text-sm font-medium text-ink">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {macosVpnProfileExample.modes.map((mode) => (
            <div key={mode.title} className="rounded-2xl border border-border-light bg-surface-elevated p-5 shadow-sm">
              <span className="text-2xl" aria-hidden="true">{mode.icon}</span>
              <p className="mt-3 font-semibold text-ink">{mode.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{mode.description}</p>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="filevault" title="FileVault">
        <div className="rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50/80 to-violet-50/50 p-6 shadow-sm md:p-8">
          <h3 className="text-lg font-bold text-ink">{macosFileVaultDetails.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{macosFileVaultDetails.description}</p>
          <p className="mt-6 text-sm font-semibold text-ink">Avantages :</p>
          <ul className="mt-3 space-y-2">
            {macosFileVaultDetails.advantages.map((a) => (
              <li key={a} className="flex gap-2 text-sm text-ink-secondary">
                <span className="shrink-0 text-purple-600" aria-hidden="true">✓</span>
                {a}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm font-semibold text-ink">Configuration :</p>
          <div className="mt-3 space-y-3">
            {macosFileVaultDetails.configuration.map((c) => (
              <div key={c.step} className="rounded-xl border border-purple-100 bg-white/80 px-4 py-3">
                <p className="text-sm font-semibold text-ink">{c.step}</p>
                <p className="mt-1 text-sm text-ink-secondary">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </ContentSection>

      <ContentSection id="restrictions" title="Restrictions macOS">
        <div className="rounded-3xl border border-amber-200 bg-amber-50/30 p-6 shadow-sm md:p-8">
          <div className="space-y-3">
            {macosRestrictionsList.map((item) => (
              <div key={item.feature} className="flex gap-3 rounded-xl border border-amber-100 bg-white/80 px-4 py-3">
                <span className="shrink-0 text-red-500" aria-hidden="true">✓</span>
                <div>
                  <p className="text-sm font-semibold text-ink">Désactiver {item.feature}</p>
                  <p className="mt-0.5 text-sm text-ink-secondary">{item.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ContentSection>

      <ContentSection id="pppc" title="PPPC — Privacy Preferences">
        <div className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
          <h3 className="text-lg font-bold text-ink">{macosPppcExplanation.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{macosPppcExplanation.description}</p>
          <p className="mt-6 text-sm font-semibold text-ink">Permissions gérées :</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {macosPppcExplanation.permissions.map((p) => (
              <div key={p.permission} className="rounded-xl border border-border-light bg-surface px-4 py-3">
                <p className="text-sm font-semibold text-ink">{p.permission}</p>
                <p className="mt-0.5 text-xs text-ink-tertiary">Ex. {p.example}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm font-semibold text-ink">Exemple — Microsoft Teams :</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[320px] text-left text-sm">
              <thead>
                <tr className="border-b border-border-light text-xs uppercase text-ink-tertiary">
                  <th className="py-2 pr-4">Application</th>
                  <th className="py-2 pr-4">Caméra</th>
                  <th className="py-2 pr-4">Micro</th>
                  <th className="py-2">Bundle ID</th>
                </tr>
              </thead>
              <tbody>
                {macosPppcExplanation.teamsExample.map((row) => (
                  <tr key={row.bundleId} className="border-b border-border-light/50 text-ink-secondary">
                    <td className="py-3 pr-4 font-medium text-ink">{row.app}</td>
                    <td className="py-3 pr-4 text-green-700">{row.camera}</td>
                    <td className="py-3 pr-4 text-green-700">{row.microphone}</td>
                    <td className="py-3 font-mono text-xs">{row.bundleId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ContentSection>

      <ContentSection id="system-extensions" title="System Extensions">
        <div className="rounded-3xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm md:p-8">
          <h3 className="text-lg font-bold text-ink">{macosSystemExtensionsInfo.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{macosSystemExtensionsInfo.description}</p>
          <div className="mt-6 space-y-3">
            {macosSystemExtensionsInfo.examples.map((ext) => (
              <div
                key={ext.name}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
              >
                <span className="text-xl" aria-hidden="true">🛡️</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">{ext.name}</p>
                  <p className="text-xs text-ink-tertiary">{ext.type} · Team ID: {ext.teamId}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-ink-secondary">
            {macosSystemExtensionsInfo.deploymentNote}
          </p>
        </div>
      </ContentSection>

      <ContentSection id="deploiement-intune" title="Déploiement Intune">
        <div className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
          <ol className="space-y-3">
            {macosIntuneDeploySteps.map((step, i) => (
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
          <p className="mb-3 text-sm font-semibold text-ink">Vérifications post-déploiement</p>
          <LessonChecklist
            items={macosIntuneVerificationItems}
            onCompleteChange={setDeployDone}
            successTitle="✓ Profils macOS validés"
            successMessage="Profil actif, Mac synchronisé et paramètres appliqués."
          />
          <DeployStatusCard
            checkedCount={deployDone ? macosIntuneVerificationItems.length : 0}
            total={macosIntuneVerificationItems.length}
          />
        </div>
      </ContentSection>

      <ContentSection id="deploiement-jamf" title="Déploiement Jamf Pro">
        <div className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
          <ol className="space-y-3">
            {macosJamfDeploySteps.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm leading-relaxed text-ink-secondary">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-violet-200 bg-violet-50/50 p-5">
            <p className="text-sm font-semibold text-violet-900">Scope</p>
            <p className="mt-2 text-sm leading-relaxed text-violet-800">{macosJamfScopeExplanation.scope}</p>
          </div>
          <div className="rounded-2xl border border-violet-200 bg-violet-50/50 p-5">
            <p className="text-sm font-semibold text-violet-900">Exclusions</p>
            <p className="mt-2 text-sm leading-relaxed text-violet-800">{macosJamfScopeExplanation.exclusions}</p>
          </div>
          <div className="rounded-2xl border border-violet-200 bg-violet-50/50 p-5">
            <p className="text-sm font-semibold text-violet-900">Smart Groups</p>
            <p className="mt-2 text-sm leading-relaxed text-violet-800">{macosJamfScopeExplanation.smartGroups}</p>
          </div>
        </div>
      </ContentSection>

      <LessonCapturesSection lessonSlug={MACOS_PROFILES_LESSON_SLUG} />

      <ContentSection id="depannage" title="Dépannage">
        <div className="space-y-4">
          {macosTroubleshooting.map((item) => (
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
            {macosProfilesBestPractices.map((tip) => (
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
          10 questions · 0–59 % À revoir · 60–79 % Correct · 80–99 % Validé · 100 % Expert Profils macOS
        </p>
        <LessonQuiz
          key={quizKey}
          questions={macosProfilesQuizQuestions}
          onScoreChange={setQuizScore}
          passingScore={80}
          scoreTiers={macosProfilesScoreTiers}
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
