"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Lab } from "@/lib/types";
import { Button, ProgressBar, Badge } from "@/components/ui";
import { saveLabProgress } from "@/app/actions/progress";
import { getBadgeById } from "@/lib/badges-config";

type LabEngineProps = {
  lab: Lab;
  isAuthenticated: boolean;
  autoStart?: boolean;
};

export function LabEngine({ lab, isAuthenticated, autoStart = false }: LabEngineProps) {
  const [userStarted, setUserStarted] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [checkedPrereqs, setCheckedPrereqs] = useState<Record<number, boolean>>({});
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [newBadgeIds, setNewBadgeIds] = useState<string[]>([]);
  const savedRef = useRef(false);
  const sessionRef = useRef<HTMLDivElement>(null);

  const started = autoStart || userStarted;
  const stepsDone = lab.steps.filter((_, i) => checkedSteps[i]).length;
  const progressPercent = lab.steps.length > 0 ? Math.round((stepsDone / lab.steps.length) * 100) : 0;
  const allStepsDone = stepsDone === lab.steps.length;
  const allPrereqsDone = lab.prerequisites.every((_, i) => checkedPrereqs[i]);

  const phase = !started ? "intro" : allStepsDone ? "completed" : "active";

  useLayoutEffect(() => {
    if (autoStart && sessionRef.current) {
      sessionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [autoStart]);

  async function persistCompletion() {
    if (savedRef.current) return;
    savedRef.current = true;

    if (!isAuthenticated) {
      setSaveStatus("idle");
      return;
    }

    setSaveStatus("saving");
    const res = await saveLabProgress({ labSlug: lab.slug, trackSlug: lab.trackSlug });
    if (res.ok) {
      setSaveStatus("saved");
      setNewBadgeIds(res.newBadges);
    } else {
      setSaveStatus("error");
    }
  }

  function startLab() {
    setUserStarted(true);
    sessionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function toggleStep(index: number) {
    if (phase === "completed" || (!allPrereqsDone && started)) return;

    const next = { ...checkedSteps, [index]: !checkedSteps[index] };
    setCheckedSteps(next);

    const complete = lab.steps.every((_, i) => next[i]);
    if (complete) {
      void persistCompletion();
    }
  }

  function togglePrereq(index: number) {
    setCheckedPrereqs((prev) => ({ ...prev, [index]: !prev[index] }));
  }

  if (phase === "intro") {
    return (
      <div ref={sessionRef} id="session" className="scroll-mt-24 rounded-3xl border border-border-light bg-surface-elevated p-8 shadow-sm">
        <Badge variant="accent">Lab guidé</Badge>
        <h2 className="mt-4 text-2xl font-bold text-ink">Prêt à démarrer ?</h2>
        <p className="mt-3 text-ink-secondary">
          Suivez les {lab.steps.length} étapes une par une. Cochez chaque action réalisée dans votre environnement
          (Jamf Pro, Intune ou ABM).
        </p>
        <ul className="mt-6 space-y-2 text-sm text-ink-secondary">
          <li>✓ Durée estimée : {lab.duration}</li>
          <li>✓ Niveau : {lab.difficulty}</li>
          <li>✓ {lab.prerequisites.length} prérequis à valider</li>
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button type="button" onClick={startLab}>
            Démarrer le lab
          </Button>
          <Link
            href={`/parcours/${lab.trackSlug}`}
            className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-ink hover:bg-surface"
          >
            Voir le parcours associé
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={sessionRef} id="session" className="scroll-mt-24 space-y-6">
      <div className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Badge variant="accent">{phase === "completed" ? "Lab terminé" : "En cours"}</Badge>
            <h2 className="mt-3 text-xl font-bold text-ink">
              {phase === "completed" ? "Félicitations !" : "Session pratique"}
            </h2>
          </div>
          <span className="text-sm font-semibold tabular-nums text-ink-secondary">{progressPercent} %</span>
        </div>
        <ProgressBar value={progressPercent} className="mt-4" />
      </div>

      {phase === "active" && (
        <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
          <h3 className="text-lg font-bold text-ink">Prérequis</h3>
          <p className="mt-1 text-sm text-ink-secondary">Validez chaque prérequis avant de passer aux étapes.</p>
          <ul className="mt-4 space-y-2">
            {lab.prerequisites.map((req, i) => (
              <li key={req}>
                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border-light bg-surface px-4 py-3 transition hover:bg-accent/[0.03]">
                  <input
                    type="checkbox"
                    checked={Boolean(checkedPrereqs[i])}
                    onChange={() => togglePrereq(i)}
                    className="mt-0.5 h-5 w-5 rounded border-border accent-accent"
                  />
                  <span className="text-sm text-ink-secondary">{req}</span>
                </label>
              </li>
            ))}
          </ul>
          {!allPrereqsDone && (
            <p className="mt-3 text-xs text-amber-700">Complétez les prérequis pour débloquer la validation des étapes.</p>
          )}
        </section>
      )}

      <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
        <h3 className="text-lg font-bold text-ink">Étapes du lab</h3>
        <ol className="mt-4 space-y-3">
          {lab.steps.map((step, i) => {
            const done = Boolean(checkedSteps[i]);
            const canToggle = phase === "completed" || allPrereqsDone;
            return (
              <li key={step}>
                <label
                  className={`flex gap-3 rounded-2xl border px-4 py-4 transition ${
                    done
                      ? "border-green-200 bg-green-50/80"
                      : canToggle
                        ? "cursor-pointer border-border-light bg-surface hover:bg-accent/[0.03]"
                        : "border-border-light bg-surface opacity-60"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={done}
                    disabled={!canToggle || phase === "completed"}
                    onChange={() => toggleStep(i)}
                    className="mt-1 h-5 w-5 shrink-0 rounded border-border accent-accent"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-semibold uppercase text-ink-tertiary">Étape {i + 1}</span>
                    <p className={`mt-1 text-sm leading-relaxed ${done ? "text-green-900" : "text-ink-secondary"}`}>
                      {step}
                    </p>
                  </div>
                </label>
              </li>
            );
          })}
        </ol>
      </section>

      {phase === "completed" && (
        <div className="rounded-3xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center shadow-sm">
          <p className="text-4xl" aria-hidden="true">
            🧪
          </p>
          <h3 className="mt-4 text-2xl font-bold text-green-900">Lab validé</h3>
          <p className="mt-2 text-green-800">Vous avez complété toutes les étapes de « {lab.title} ».</p>
          {!isAuthenticated && (
            <p className="mt-4 text-sm text-green-800">
              <Link href={`/auth/login?redirect=/labs/${lab.slug}`} className="font-semibold underline">
                Connectez-vous
              </Link>{" "}
              pour sauvegarder votre progression et débloquer les badges.
            </p>
          )}
          {isAuthenticated && saveStatus === "saved" && (
            <p className="mt-4 text-sm font-medium text-green-800">Progression enregistrée dans votre dashboard.</p>
          )}
          {isAuthenticated && saveStatus === "error" && (
            <p className="mt-4 text-sm text-red-700">Erreur de sauvegarde — réessayez depuis le dashboard.</p>
          )}
          {newBadgeIds.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {newBadgeIds.map((id) => {
                const badge = getBadgeById(id);
                return badge ? (
                  <span key={id} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
                    {badge.icon} Badge : {badge.name}
                  </span>
                ) : null;
              })}
            </div>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/labs"
              className="inline-flex items-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-ink/90"
            >
              Autres labs
            </Link>
            <Link
              href={`/parcours/${lab.trackSlug}`}
              className="inline-flex items-center rounded-full border border-green-300 bg-white px-6 py-3 text-sm font-semibold text-green-900 hover:bg-green-50"
            >
              Continuer le parcours
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
