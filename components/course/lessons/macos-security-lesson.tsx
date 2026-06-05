"use client";

import { useState } from "react";
import {
  getMacosSecurityStatus,
  macosActivationLockDetails,
  macosEnterpriseStrategy,
  macosFileVaultDetails,
  macosGatekeeperDetails,
  macosNotarizationDetails,
  macosSecurityArchitecture,
  macosSecurityCaseStudy,
  macosSecurityLabExercises,
  macosSecurityLayers,
  macosSecurityObjectives,
  macosSecurityQuizQuestions,
  macosSecurityScoreTiers,
  macosSecurityTroubleshooting,
  macosSecurityVerificationItems,
  macosSipDetails,
  macosXProtectDetails,
  MACOS_SECURITY_COMPLETE_KEY,
} from "@/lib/data/lessons/macos-security-content";
import { ContentSection } from "@/components/course/course-ui";
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
  { href: "#architecture", label: "Architecture" },
  { href: "#filevault", label: "FileVault" },
  { href: "#gatekeeper", label: "Gatekeeper" },
  { href: "#xprotect", label: "XProtect" },
  { href: "#sip", label: "SIP" },
  { href: "#activation-lock", label: "Activation Lock" },
  { href: "#notarization", label: "Notarization" },
  { href: "#entreprise", label: "Entreprise" },
  { href: "#depannage", label: "Dépannage" },
  { href: "#cas-pratique", label: "Cas pratique" },
  { href: "#quiz", label: "Quiz" },
  { href: "#laboratoire", label: "Laboratoire" },
];

export function MacosSecurityTableOfContents({ mobile = false }: { mobile?: boolean }) {
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

function SecurityStatusCard({ checkedCount, total }: { checkedCount: number; total: number }) {
  const status = getMacosSecurityStatus(checkedCount, total);
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
        Posture de sécurité
      </p>
      <p className={`mt-2 text-xl font-bold ${isHealthy ? "text-green-800" : "text-amber-800"}`}>
        {isHealthy ? "✓ Mac conforme — sécurité validée" : "⚠ Contrôles en cours"}
      </p>
      <p className="mt-1 text-sm text-ink-secondary">
        {checkedCount} / {total} vérifications validées
      </p>
    </div>
  );
}

function CaseStudySection() {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
      <h3 className="text-xl font-bold text-ink">{macosSecurityCaseStudy.title}</h3>
      <p className="mt-4 text-sm leading-relaxed text-ink-secondary">{macosSecurityCaseStudy.scenario}</p>
      <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/5 p-5">
        <p className="text-sm font-semibold text-ink">Votre plan de conformité :</p>
        <ol className="mt-3 space-y-2">
          {macosSecurityCaseStudy.tasks.map((task, i) => (
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
            {macosSecurityCaseStudy.solution.map((step, i) => (
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

function TerminalBlock({ cmd }: { cmd: string }) {
  return (
    <code className="block rounded-lg bg-gray-900 px-4 py-2.5 font-mono text-sm text-green-400">
      {cmd}
    </code>
  );
}

export function MacosSecurityLesson() {
  const [quizKey, setQuizKey] = useState(0);
  const [labDone, setLabDone] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const { markedComplete, markComplete } = useLessonCompletion(MACOS_SECURITY_COMPLETE_KEY);

  return (
    <div className="space-y-14">
      <LessonProgressBar
        checklistDone={labDone}
        quizScore={quizScore}
        markedComplete={markedComplete}
      />

      <ContentSection id="objectifs" title="Objectifs">
        <ul className="space-y-3">
          {macosSecurityObjectives.map((obj) => (
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

      <ContentSection id="architecture" title="Architecture de sécurité Apple">
        <p className="mb-6 text-sm text-ink-secondary">
          macOS empile plusieurs couches de sécurité — de l&apos;hardware (Secure Enclave) aux politiques logicielles (Gatekeeper, SIP).
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {macosSecurityLayers.map((layer) => (
            <div
              key={layer.id}
              className={`rounded-2xl bg-gradient-to-br ${layer.color} p-5 text-white shadow-md`}
            >
              <span className="text-2xl" aria-hidden="true">{layer.icon}</span>
              <p className="mt-2 font-bold">{layer.title}</p>
              <p className="mt-2 text-xs leading-relaxed text-white/90">{layer.description}</p>
            </div>
          ))}
        </div>
        <p className="mb-4 mt-10 text-sm font-medium text-ink-secondary">Flux de défense :</p>
        <FlowDiagram nodes={macosSecurityArchitecture} />
      </ContentSection>

      <ContentSection id="filevault" title="FileVault">
        <div className="rounded-3xl border border-purple-200 bg-purple-50/30 p-6 shadow-sm md:p-8">
          <p className="text-sm leading-relaxed text-ink-secondary">
            FileVault chiffre intégralement le volume de démarrage. Sans mot de passe ou clé escrow, les données sont illisibles.
          </p>
          <ul className="mt-4 space-y-2">
            {macosFileVaultDetails.advantages.map((a) => (
              <li key={a} className="flex gap-2 text-sm text-ink-secondary">
                <span className="text-purple-600">✓</span> {a}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm font-semibold text-ink">Fonctionnement :</p>
          <div className="mt-3 space-y-2">
            {macosFileVaultDetails.workflow.map((w) => (
              <div key={w.step} className="rounded-xl border border-purple-100 bg-white/80 px-4 py-3">
                <p className="text-sm font-semibold text-ink">{w.step}</p>
                <p className="text-sm text-ink-secondary">{w.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-violet-200 bg-violet-50/50 p-5">
            <p className="font-semibold text-violet-900">Configuration Jamf</p>
            <ul className="mt-3 space-y-1">
              {macosFileVaultDetails.jamfConfig.map((s) => (
                <li key={s} className="text-sm text-violet-800">• {s}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5">
            <p className="font-semibold text-indigo-900">Configuration Intune</p>
            <ul className="mt-3 space-y-1">
              {macosFileVaultDetails.intuneConfig.map((s) => (
                <li key={s} className="text-sm text-indigo-800">• {s}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {macosFileVaultDetails.escrowNote}
        </p>
        <p className="mt-3 text-sm text-ink-secondary">
          <strong>Rotation des clés :</strong> {macosFileVaultDetails.keyRotation}
        </p>
      </ContentSection>

      <ContentSection id="gatekeeper" title="Gatekeeper">
        <div className="rounded-3xl border border-blue-200 bg-blue-50/30 p-6 shadow-sm md:p-8">
          <p className="text-sm leading-relaxed text-ink-secondary">{macosGatekeeperDetails.description}</p>
          <p className="mt-4 text-sm font-semibold text-ink">Sources autorisées :</p>
          <ul className="mt-2 space-y-1">
            {macosGatekeeperDetails.allowedSources.map((s) => (
              <li key={s} className="text-sm text-ink-secondary">✓ {s}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm font-semibold text-red-700">Risques :</p>
          <ul className="mt-2 space-y-1">
            {macosGatekeeperDetails.risks.map((r) => (
              <li key={r} className="text-sm text-ink-secondary">• {r}</li>
            ))}
          </ul>
        </div>
        <p className="mb-3 mt-6 text-sm font-semibold text-ink">Commandes spctl :</p>
        <div className="space-y-3">
          {macosGatekeeperDetails.spctlCommands.map((c) => (
            <div key={c.command} className="rounded-xl border border-border-light bg-surface-elevated p-4">
              <TerminalBlock cmd={c.command} />
              <p className="mt-2 text-sm text-ink-secondary">{c.description}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-ink-secondary">{macosGatekeeperDetails.mdmNote}</p>
      </ContentSection>

      <ContentSection id="xprotect" title="XProtect">
        <div className="rounded-3xl border border-green-200 bg-green-50/30 p-6 shadow-sm md:p-8">
          <p className="text-sm leading-relaxed text-ink-secondary">{macosXProtectDetails.description}</p>
          <ul className="mt-4 space-y-2">
            {macosXProtectDetails.features.map((f) => (
              <li key={f} className="flex gap-2 text-sm text-ink-secondary">
                <span className="text-green-600">✓</span> {f}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm font-semibold text-ink">Fonctionnement réel :</p>
          <ol className="mt-3 space-y-2">
            {macosXProtectDetails.howItWorks.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm text-ink-secondary">
                <span className="font-bold text-green-700">{i + 1}.</span> {step}
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-4 space-y-3">
          {macosXProtectDetails.terminalCommands.map((c) => (
            <div key={c.command} className="rounded-xl border border-border-light bg-surface-elevated p-4">
              <TerminalBlock cmd={c.command} />
              <p className="mt-2 text-sm text-ink-secondary">{c.description}</p>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="sip" title="SIP — System Integrity Protection">
        <div className="rounded-3xl border border-orange-200 bg-orange-50/30 p-6 shadow-sm md:p-8">
          <p className="text-sm leading-relaxed text-ink-secondary">{macosSipDetails.description}</p>
          <p className="mt-4 text-sm font-semibold text-ink">SIP empêche :</p>
          <ul className="mt-2 space-y-1">
            {macosSipDetails.protections.map((p) => (
              <li key={p} className="text-sm text-ink-secondary">✓ {p}</li>
            ))}
          </ul>
        </div>
        <div className="mt-4 space-y-3">
          {macosSipDetails.csrutilCommands.map((c) => (
            <div key={c.command} className="rounded-xl border border-border-light bg-surface-elevated p-4">
              <TerminalBlock cmd={c.command} />
              <p className="mt-2 text-sm text-ink-secondary">{c.description}</p>
            </div>
          ))}
        </div>
        <ul className="mt-4 space-y-2 rounded-xl border border-orange-100 bg-orange-50/50 p-4">
          {macosSipDetails.impacts.map((imp) => (
            <li key={imp} className="text-sm text-ink-secondary">• {imp}</li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection id="activation-lock" title="Activation Lock">
        <div className="rounded-3xl border border-red-200 bg-red-50/30 p-6 shadow-sm md:p-8">
          <p className="text-sm leading-relaxed text-ink-secondary">{macosActivationLockDetails.description}</p>
        </div>
        <p className="mb-4 mt-6 text-sm font-medium text-ink-secondary">Fonctionnement :</p>
        <FlowDiagram nodes={macosActivationLockDetails.flow} />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {macosActivationLockDetails.management.map((m) => (
            <div key={m.platform} className="rounded-2xl border border-border-light bg-surface-elevated p-5">
              <p className="font-semibold text-ink">{m.platform}</p>
              <ul className="mt-3 space-y-1">
                {m.steps.map((s) => (
                  <li key={s} className="text-sm text-ink-secondary">• {s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="notarization" title="Notarization">
        <div className="rounded-3xl border border-cyan-200 bg-cyan-50/30 p-6 shadow-sm md:p-8">
          <p className="text-sm leading-relaxed text-ink-secondary">{macosNotarizationDetails.why}</p>
        </div>
        <p className="mb-4 mt-6 text-sm font-medium text-ink-secondary">Processus :</p>
        <FlowDiagram nodes={macosNotarizationDetails.process} />
        <p className="mt-6 text-sm text-ink-secondary">{macosNotarizationDetails.enterpriseNote}</p>
      </ContentSection>

      <ContentSection id="entreprise" title="Sécurité en entreprise">
        <div className="overflow-x-auto rounded-3xl border border-border-light bg-surface-elevated shadow-sm">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-border-light bg-surface text-xs uppercase text-ink-tertiary">
                <th className="px-5 py-3">Composant</th>
                <th className="px-5 py-3">Action</th>
                <th className="px-5 py-3">Priorité</th>
              </tr>
            </thead>
            <tbody>
              {macosEnterpriseStrategy.map((row) => (
                <tr key={row.component} className="border-b border-border-light/50">
                  <td className="px-5 py-3 font-semibold text-ink">{row.component}</td>
                  <td className="px-5 py-3 text-ink-secondary">{row.action}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        row.priority === "Critique"
                          ? "bg-red-100 text-red-700"
                          : row.priority === "Haute"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {row.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ContentSection>

      <ContentSection id="depannage" title="Dépannage">
        <div className="space-y-4">
          {macosSecurityTroubleshooting.map((item) => (
            <div
              key={item.problem}
              className="rounded-2xl border border-border-light bg-surface-elevated p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-red-600">Cas</p>
              <p className="mt-1 font-semibold text-ink">{item.problem}</p>
              <p className="mt-3 text-xs font-semibold uppercase text-ink-tertiary">Causes</p>
              <ul className="mt-1 space-y-1">
                {item.causes.map((c) => (
                  <li key={c} className="text-sm text-ink-secondary">• {c}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs font-semibold uppercase text-green-600">Solution</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-secondary">{item.solution}</p>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="cas-pratique" title="Cas pratique">
        <CaseStudySection />
      </ContentSection>

      <ContentSection id="quiz" title="Quiz de validation">
        <p className="mb-6 text-sm text-ink-secondary">
          15 questions · 0–59 % À revoir · 60–79 % Correct · 80–99 % Validé · 100 % Expert Sécurité macOS
        </p>
        <LessonQuiz
          key={quizKey}
          questions={macosSecurityQuizQuestions}
          onScoreChange={setQuizScore}
          passingScore={80}
          scoreTiers={macosSecurityScoreTiers}
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
          Exécutez ces commandes sur un Mac de test (ou VM macOS). Cochez les vérifications une fois les exercices complétés.
        </p>
        <div className="space-y-6">
          {macosSecurityLabExercises.map((ex) => (
            <div
              key={ex.title}
              className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-ink">{ex.title}</h3>
              <p className="mt-2 text-sm text-ink-secondary">{ex.goal}</p>
              <div className="mt-4 space-y-3">
                {ex.commands.map((c) => (
                  <div key={c.cmd}>
                    <TerminalBlock cmd={c.cmd} />
                    <p className="mt-1.5 text-xs text-green-700">Attendu : {c.expected}</p>
                  </div>
                ))}
              </div>
              {"note" in ex && ex.note && (
                <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                  {ex.note}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8">
          <LessonChecklist
            items={macosSecurityVerificationItems}
            onCompleteChange={setLabDone}
            successTitle="✓ Laboratoire terminé"
            successMessage="Toutes les vérifications de sécurité macOS sont validées."
          />
          <SecurityStatusCard
            checkedCount={labDone ? macosSecurityVerificationItems.length : 0}
            total={macosSecurityVerificationItems.length}
          />
        </div>
      </ContentSection>
    </div>
  );
}
