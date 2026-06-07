"use client";

import { getExamHistory, getBestScoreForRoute, getRecommendedExams } from "@/lib/exam/exam-history-storage";
import { examRouteToQuizSlug } from "@/lib/data/exams/pools";
import { getQuiz } from "@/lib/data/quizzes";
import { formatDuration } from "@/lib/data/exams/exam-utils";
import Link from "next/link";
import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return getExamHistory();
}

export function ExamProgressPanel() {
  const history = useSyncExternalStore(subscribe, getSnapshot, () => []);

  const inProgress = history.filter((e) => e.status === "in_progress");
  const completed = history.filter((e) => e.status === "completed");
  const completedRoutes = completed.map((e) => e.routeSlug);
  const recommended = getRecommendedExams(completedRoutes);

  if (history.length === 0) {
    return (
      <section className="mb-8 rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
        <h2 className="text-lg font-bold text-ink">Examens blancs</h2>
        <p className="mt-2 text-sm text-ink-secondary">
          Aucune tentative enregistrée. Passez un examen blanc pour suivre vos scores ici.
        </p>
        <Link href="/examens" className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
          Voir les examens →
        </Link>
      </section>
    );
  }

  return (
    <section className="mb-8 rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-ink">Examens blancs</h2>
          <p className="mt-1 text-sm text-ink-secondary">
            {inProgress.length} en cours · {completed.length} terminés
          </p>
        </div>
        <Link href="/examens" className="text-sm font-semibold text-accent hover:underline">
          Tous les examens →
        </Link>
      </div>

      {inProgress.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-ink">En cours</h3>
          <ul className="mt-2 space-y-2">
            {inProgress.map((e) => (
              <li key={e.routeSlug} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-surface px-4 py-3 text-sm">
                <span className="font-medium text-ink">{e.quizTitle}</span>
                <Link href={`/examens/${e.routeSlug}/start`} className="font-semibold text-accent hover:underline">
                  Reprendre
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {completed.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-ink">Dernières tentatives</h3>
          <ul className="mt-2 space-y-2">
            {completed.slice(0, 5).map((e) => {
              const best = getBestScoreForRoute(e.routeSlug);
              return (
                <li key={`${e.routeSlug}-${e.completedAt}`} className="rounded-xl bg-surface px-4 py-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-ink">{e.quizTitle}</span>
                    <span className={e.passed ? "font-bold text-green-700" : "font-bold text-amber-700"}>
                      {e.percent}%
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink-tertiary">
                    {new Date(e.completedAt).toLocaleDateString("fr-FR")} · {formatDuration(e.elapsedSeconds)}
                    {best !== null && best !== e.percent ? ` · Meilleur : ${best}%` : best !== null ? " · Meilleur score" : ""}
                  </p>
                  <Link href={`/examens/${e.routeSlug}/result`} className="mt-1 inline-block text-xs font-semibold text-accent hover:underline">
                    Voir le résultat
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {recommended.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-ink">Examens recommandés</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {recommended.map((routeSlug) => {
              const quizSlug = examRouteToQuizSlug[routeSlug];
              const quiz = quizSlug ? getQuiz(quizSlug) : undefined;
              return (
                <li key={routeSlug}>
                  <Link
                    href={`/examens/${routeSlug}`}
                    className="inline-block rounded-full border border-border-light px-4 py-2 text-xs font-semibold text-ink-secondary hover:text-ink"
                  >
                    {quiz?.title ?? routeSlug}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
