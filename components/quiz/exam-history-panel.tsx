"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  getExamHistoryForRoute,
  subscribeToExamHistory,
  type ExamHistoryEntry,
} from "@/lib/exam/exam-history-storage";
import { formatDuration } from "@/lib/data/exams/exam-utils";

type Props = {
  routeSlug: string;
  isAuthenticated: boolean;
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function ExamHistoryPanel({ routeSlug, isAuthenticated }: Props) {
  const history = useSyncExternalStore<ExamHistoryEntry[]>(
    subscribeToExamHistory,
    () => getExamHistoryForRoute(routeSlug),
    () => []
  );

  const completed = history.filter((e) => e.status === "completed");
  if (completed.length === 0) return null;

  return (
    <div className="mt-6 rounded-2xl border border-border-light bg-surface p-5">
      <h3 className="text-sm font-bold uppercase tracking-wide text-ink-tertiary">
        Historique des tentatives
      </h3>
      <ul className="mt-3 space-y-2">
        {completed.slice(0, 5).map((entry) => (
          <li
            key={entry.completedAt}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-surface-elevated px-4 py-3 text-sm"
          >
            <div>
              <span className="font-semibold text-ink">{entry.percent}%</span>
              <span className="mx-2 text-ink-tertiary">·</span>
              <span className={entry.passed ? "text-green-700" : "text-amber-700"}>
                {entry.passed ? "Réussi" : "Non validé"}
              </span>
              {entry.elapsedSeconds > 0 && (
                <>
                  <span className="mx-2 text-ink-tertiary">·</span>
                  <span className="text-ink-secondary">{formatDuration(entry.elapsedSeconds)}</span>
                </>
              )}
            </div>
            <time className="text-xs text-ink-tertiary" dateTime={entry.completedAt}>
              {formatDate(entry.completedAt)}
            </time>
          </li>
        ))}
      </ul>
      {isAuthenticated ? (
        <Link
          href="/dashboard/transcript"
          className="mt-3 inline-block text-sm font-semibold text-accent hover:underline"
        >
          Voir le transcript complet →
        </Link>
      ) : (
        <p className="mt-3 text-xs text-ink-tertiary">
          Connectez-vous pour synchroniser vos scores sur tous vos appareils.
        </p>
      )}
    </div>
  );
}
