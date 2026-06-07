"use client";

import Link from "next/link";
import { ProgressBar } from "@/components/ui";
import { computeAppleTrainingProgress } from "@/lib/data/apple-training/coverage";

type Props = {
  completedLessonSlugs: string[];
  completedLabSlugs: string[];
  examScores: Map<string, number>;
};

export function AppleTrainingProgressPanel({
  completedLessonSlugs,
  completedLabSlugs,
  examScores,
}: Props) {
  const progress = computeAppleTrainingProgress({
    completedLessonSlugs: new Set(completedLessonSlugs),
    completedLabSlugs: new Set(completedLabSlugs),
    examScores,
  });

  const axes = [
    progress.itProfessional,
    progress.enterprise,
    progress.security,
    progress.deployment,
  ];

  return (
    <section className="mb-8 rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">Apple Training</p>
          <h2 className="text-xl font-bold text-ink">Progression parcours Apple</h2>
          <p className="mt-1 text-sm text-ink-secondary">
            IT Professional · Enterprise · Sécurité · Déploiement — aligné ressources Apple Training.
          </p>
        </div>
        <Link href="/certifications" className="text-sm font-semibold text-accent hover:underline">
          Couverture certifications →
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {axes.map((axis) => (
          <Link
            key={axis.label}
            href={axis.href}
            className="rounded-2xl border border-border-light bg-surface p-4 transition hover:border-accent/40"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-ink">{axis.label}</h3>
              <span className="text-sm font-bold text-accent">{axis.overall}%</span>
            </div>
            <p className="mt-1 text-xs text-ink-tertiary">
              Couverture contenu {axis.coveragePercent}% · leçons {axis.lessonsPct}% · labs {axis.labsPct}%
              {axis.examScore !== null ? ` · examen ${axis.examScore}%` : ""}
            </p>
            <ProgressBar value={axis.overall} className="mt-3" />
          </Link>
        ))}
      </div>
    </section>
  );
}
