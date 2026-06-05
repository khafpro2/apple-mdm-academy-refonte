"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Lab } from "@/lib/types";
import { Button, ProgressBar, Badge } from "@/components/ui";
import { saveLabProgress } from "@/app/actions/progress";
import { getBadgeById } from "@/lib/badges-config";
import { trackEvent } from "@/lib/analytics/events";
import {
  getLabPercent,
  getPrerequisiteId,
  markStepValidated,
  startLabLocal,
  togglePrerequisiteChecked,
  setLastOpenedLab,
} from "@/lib/labs/progress";
import { useLabProgressRecord } from "@/lib/labs/use-lab-progress";
import { LabSimulatorPanel } from "@/components/labs/lab-simulator-panel";
import { isExpertLabWithSimulator } from "@/lib/labs/simulator";
import { TECHNOLOGY_STYLES } from "@/lib/labs/badges";

type LabWorkspaceProps = {
  lab: Lab;
  isAuthenticated: boolean;
};

function firstOpenStepIndex(lab: Lab, validatedStepIds: string[]): number {
  const firstOpen = lab.steps.findIndex((s) => !validatedStepIds.includes(s.id));
  return firstOpen === -1 ? lab.steps.length - 1 : firstOpen;
}

function PrerequisitesChecklist({
  lab,
  checkedIds,
  onToggle,
  compact = false,
}: {
  lab: Lab;
  checkedIds: Set<string>;
  onToggle: (id: string) => void;
  compact?: boolean;
}) {
  return (
    <ul className={compact ? "mt-2 space-y-2" : "mt-4 space-y-3"}>
      {lab.prerequisites.map((text, index) => {
        const id = getPrerequisiteId(index);
        const checked = checkedIds.has(id);
        return (
          <li key={id}>
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 transition ${
                checked
                  ? "border-green-200 bg-green-50 text-green-900"
                  : "border-border-light bg-surface text-ink-secondary hover:border-accent/30"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(id)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-accent"
              />
              <span className={compact ? "text-xs leading-snug" : "text-sm leading-snug"}>{text}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}

export function LabWorkspace({ lab, isAuthenticated }: LabWorkspaceProps) {
  const totalSteps = lab.steps.length;
  const progress = useLabProgressRecord(lab.slug, totalSteps);
  const [manualIndex, setManualIndex] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [newBadgeIds, setNewBadgeIds] = useState<string[]>([]);

  const validatedSet = useMemo(() => new Set(progress?.validatedStepIds ?? []), [progress]);
  const checkedPrereqSet = useMemo(
    () => new Set(progress?.checkedPrerequisiteIds ?? []),
    [progress]
  );
  const percent = progress?.percent ?? 0;
  const allDone = validatedSet.size >= totalSteps;
  const allPrerequisitesChecked =
    lab.prerequisites.length === 0 ||
    checkedPrereqSet.size >= lab.prerequisites.length;

  const suggestedIndex = progress
    ? firstOpenStepIndex(lab, progress.validatedStepIds)
    : 0;
  const currentIndex = manualIndex ?? suggestedIndex;
  const currentStep = lab.steps[currentIndex];

  useEffect(() => {
    setLastOpenedLab(lab.slug);
  }, [lab.slug]);

  function notifyCatalog() {
    window.dispatchEvent(new Event("lab-progress-updated"));
  }

  function handleTogglePrerequisite(prereqId: string) {
    togglePrerequisiteChecked(lab.slug, prereqId, totalSteps);
    notifyCatalog();
  }

  function handleStart() {
    startLabLocal(lab.slug, totalSteps);
    setManualIndex(0);
    notifyCatalog();
  }

  async function syncToSupabase(record: NonNullable<typeof progress>) {
    setSaveStatus("saving");
    const res = await saveLabProgress({
      labSlug: lab.slug,
      trackSlug: lab.trackSlug,
      validatedStepIds: record.validatedStepIds,
      percent: record.percent,
    });
    if (res.ok) {
      setSaveStatus("saved");
      setNewBadgeIds(res.newBadges);
      if (record.percent >= 100 || record.completed) {
        trackEvent("lab_termine", { lab: lab.slug });
      }
    } else {
      setSaveStatus("error");
    }
  }

  async function handleValidateStep() {
    if (!currentStep || validatedSet.has(currentStep.id)) return;

    const p = markStepValidated(lab.slug, currentStep.id, totalSteps);
    notifyCatalog();

    const nextOpen = firstOpenStepIndex(lab, p.validatedStepIds);
    setManualIndex(nextOpen);

    if (p.completed && isAuthenticated) {
      await syncToSupabase(p);
    }
  }

  async function handleFinishLab() {
    if (!allDone || !progress) return;

    notifyCatalog();

    if (isAuthenticated && saveStatus !== "saved") {
      await syncToSupabase({ ...progress, percent: 100, completed: true });
    }
  }

  const started = progress?.started ?? false;

  if (!started) {
    return (
      <section id="session" className="scroll-mt-24 rounded-3xl border border-border-light bg-surface-elevated p-8 shadow-sm">
        <Badge variant="accent">Session pratique</Badge>
        <h2 className="mt-4 text-2xl font-bold text-ink">Démarrer le lab</h2>
        <p className="mt-3 text-ink-secondary">{lab.description}</p>

        <div className="mt-6">
          <p className="text-sm font-semibold text-ink">
            Prérequis — cochez chaque point avant de commencer
          </p>
          <PrerequisitesChecklist
            lab={lab}
            checkedIds={checkedPrereqSet}
            onToggle={handleTogglePrerequisite}
          />
          {!allPrerequisitesChecked && (
            <p className="mt-3 text-xs text-amber-700">
              {checkedPrereqSet.size}/{lab.prerequisites.length} prérequis validés
            </p>
          )}
        </div>

        <ul className="mt-6 space-y-2">
          {lab.objectives.map((obj) => (
            <li key={obj} className="flex gap-2 text-sm text-ink-secondary">
              <span className="text-accent">→</span> {obj}
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xs text-ink-tertiary">
          Votre progression est enregistrée localement sur cet appareil
          {isAuthenticated ? " et synchronisée en cloud à la complétion." : "."}
        </p>

        <Button
          type="button"
          className="mt-8"
          onClick={handleStart}
          disabled={!allPrerequisitesChecked}
        >
          Commencer le lab
        </Button>
      </section>
    );
  }

  return (
    <section id="session" className="scroll-mt-24 space-y-6">
      <div className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${TECHNOLOGY_STYLES[lab.technology]}`}>
              {lab.technology}
            </span>
            <h2 className="mt-3 text-xl font-bold text-ink">
              {allDone ? "Lab terminé" : `Étape ${currentIndex + 1} / ${totalSteps}`}
            </h2>
          </div>
          <span className="text-lg font-bold tabular-nums text-accent">{percent}%</span>
        </div>
        <ProgressBar value={percent} className="mt-4" />
        {!isAuthenticated && (
          <p className="mt-3 text-xs text-ink-tertiary">
            Progression sauvegardée localement ({lab.slug})
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {!allDone && currentStep && (
            <article className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                Étape {currentIndex + 1}
              </p>
              <h3 className="mt-2 text-xl font-bold text-ink">{currentStep.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-ink-secondary">{currentStep.instruction}</p>

              {isExpertLabWithSimulator(lab.slug) && (
                <LabSimulatorPanel labSlug={lab.slug} stepId={currentStep.id} />
              )}

              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                  Résultat attendu
                </p>
                <p className="mt-2 text-sm leading-relaxed text-amber-950">{currentStep.expectedResult}</p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  type="button"
                  onClick={handleValidateStep}
                  disabled={validatedSet.has(currentStep.id)}
                >
                  {validatedSet.has(currentStep.id) ? "Étape validée ✓" : "Valider l'étape"}
                </Button>
                {currentIndex < totalSteps - 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setManualIndex(Math.min(currentIndex + 1, totalSteps - 1))}
                  >
                    Étape suivante
                  </Button>
                )}
              </div>
            </article>
          )}

          {allDone && (
            <div className="rounded-3xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center shadow-sm">
              <p className="text-4xl" aria-hidden="true">🧪</p>
              <h3 className="mt-4 text-2xl font-bold text-green-900">Félicitations !</h3>
              <p className="mt-2 text-green-800">{lab.expectedResult}</p>
              <p className="mt-4 text-sm font-medium text-green-800">
                Progression locale enregistrée ({percent}%).
              </p>
              {isAuthenticated && saveStatus === "saved" && (
                <p className="mt-2 text-sm font-medium text-green-800">
                  Progression cloud synchronisée.
                </p>
              )}
              {isAuthenticated && saveStatus === "error" && (
                <p className="mt-2 text-sm text-red-700">
                  Échec sync cloud — votre progression reste en localStorage.
                </p>
              )}
              {newBadgeIds.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {newBadgeIds.map((id) => {
                    const b = getBadgeById(id);
                    return b ? (
                      <span key={id} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
                        {b.icon} {b.name}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
              <Button type="button" className="mt-6" onClick={handleFinishLab}>
                Terminer le lab
              </Button>
            </div>
          )}
        </div>

        <aside className="rounded-3xl border border-border-light bg-surface-elevated p-5 shadow-sm lg:sticky lg:top-28 lg:self-start">
          <h3 className="text-sm font-bold uppercase tracking-wide text-ink-tertiary">Checklist étapes</h3>
          <ol className="mt-4 space-y-2">
            {lab.steps.map((step, i) => {
              const done = validatedSet.has(step.id);
              const active = i === currentIndex && !allDone;
              return (
                <li key={step.id}>
                  <button
                    type="button"
                    onClick={() => setManualIndex(i)}
                    className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                      done
                        ? "bg-green-50 text-green-900"
                        : active
                          ? "bg-accent/10 text-ink ring-1 ring-accent/30"
                          : "text-ink-secondary hover:bg-surface"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        done ? "bg-green-600 text-white" : active ? "bg-accent text-white" : "bg-border-light text-ink-tertiary"
                      }`}
                    >
                      {done ? "✓" : i + 1}
                    </span>
                    <span className="leading-snug">{step.title}</span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mt-6 border-t border-border-light pt-4">
            <p className="text-xs font-semibold text-ink-tertiary">Prérequis cochés</p>
            <PrerequisitesChecklist
              lab={lab}
              checkedIds={checkedPrereqSet}
              onToggle={handleTogglePrerequisite}
              compact
            />
          </div>
        </aside>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/labs"
          className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-ink hover:bg-surface"
        >
          ← Retour aux labs
        </Link>
        {!allDone && (
          <Button type="button" variant="secondary" onClick={handleFinishLab} disabled={!allDone}>
            Terminer le lab
          </Button>
        )}
      </div>
    </section>
  );
}
