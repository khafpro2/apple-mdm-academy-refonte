"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { JamfLogo } from "@/components/brands/JamfLogo";
import { Badge, ButtonLink, ProgressBar } from "@/components/ui";
import type { ExamCatalogItem } from "@/lib/exam/exam-catalog";
import { loadExamSession } from "@/lib/exam/session-storage";
import { getExamAttemptStats } from "@/lib/exam/exam-attempts-storage";
import { formatDuration } from "@/lib/data/exams/exam-utils";

type Props = {
  items: ExamCatalogItem[];
};

let catalogRevision = 0;

function subscribe(onStoreChange: () => void) {
  const handler = () => {
    catalogRevision += 1;
    onStoreChange();
  };
  window.addEventListener("storage", handler);
  window.addEventListener("exam-attempts-updated", handler);
  window.addEventListener("exam-session-updated", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("exam-attempts-updated", handler);
    window.removeEventListener("exam-session-updated", handler);
  };
}

function getSnapshot() {
  return catalogRevision;
}

function isJamfExam(routeSlug: string): boolean {
  return routeSlug.startsWith("jamf");
}

function ExamCatalogCard({ item }: { item: ExamCatalogItem }) {
  const session = loadExamSession(item.routeSlug, item.quizSlug);
  const stats = getExamAttemptStats(item.routeSlug);
  const hasResume = !!session && session.secondsLeft > 0;
  const progressPercent = stats.bestScore ?? 0;

  return (
    <article className="group flex flex-col rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-md">
      <Link
        href={`/examens/${item.routeSlug}`}
        className="flex flex-1 flex-col rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label={`${item.title} — ${item.durationLabel}, ${item.questionCount} questions, niveau ${item.level}`}
      >
        <div className="flex flex-wrap items-center gap-2">
          {isJamfExam(item.routeSlug) && <JamfLogo variant="mark" size={22} alt="Jamf" />}
          <Badge variant="accent">Examen blanc</Badge>
          {!item.bankComplete && (
            <Badge variant="default" className="border-amber-200 bg-amber-50 text-amber-900">
              Banque incomplète
            </Badge>
          )}
          {item.priority && <Badge variant="dark">Prioritaire</Badge>}
        </div>
        <h2 className="mt-3 text-xl font-bold text-ink group-hover:text-accent">{item.title}</h2>
        <p className="mt-2 flex-1 text-sm text-ink-secondary">{item.description}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-ink-tertiary">
          <span>{item.durationLabel}</span>
          <span>·</span>
          <span>{item.questionCount} questions</span>
          <span>·</span>
          <span>Niveau {item.level}</span>
          <span>·</span>
          <span>Seuil {item.passingScore}%</span>
        </div>
        {stats.attemptCount > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex flex-wrap justify-between gap-2 text-xs text-ink-tertiary">
              <span>
                {stats.attemptCount} tentative{stats.attemptCount > 1 ? "s" : ""}
                {stats.bestScore !== null ? ` · Meilleur ${stats.bestScore}%` : ""}
              </span>
              {stats.lastAttempt && (
                <span>
                  Dernière : {new Date(stats.lastAttempt.date).toLocaleDateString("fr-FR")}
                  {stats.lastAttempt.elapsedSeconds > 0
                    ? ` · ${formatDuration(stats.lastAttempt.elapsedSeconds)}`
                    : ""}
                </span>
              )}
            </div>
            <ProgressBar value={progressPercent} />
          </div>
        )}
      </Link>
      <div className="mt-5 flex flex-wrap gap-2">
        {hasResume ? (
          <ButtonLink href={`/examens/${item.routeSlug}/start`} className="flex-1 text-center">
            Reprendre
          </ButtonLink>
        ) : (
          <ButtonLink href={`/examens/${item.routeSlug}/start`} className="flex-1 text-center">
            Commencer
          </ButtonLink>
        )}
        <ButtonLink href={`/examens/${item.routeSlug}`} variant="secondary" size="sm" className="shrink-0">
          Détails
        </ButtonLink>
      </div>
    </article>
  );
}

export function ExamCatalogGrid({ items }: Props) {
  useSyncExternalStore(subscribe, getSnapshot, () => 0);

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {items.map((item) => (
        <ExamCatalogCard key={item.routeSlug} item={item} />
      ))}
    </div>
  );
}
