"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui";
import type { RevisionCard } from "@/lib/revision/spaced-repetition";
import { getRevisionStats, predictExamScore } from "@/lib/revision/spaced-repetition";

const STORAGE_KEY = "mdm-revision-cards";

interface Props {
  quizSlug: string;
  examHref: string;
  passingScore?: number;
}

const READINESS_LABEL: Record<string, { label: string; variant: "success" | "warning" | "error" }> = {
  ready: { label: "Prêt pour l'examen", variant: "success" },
  almost: { label: "Presque prêt", variant: "warning" },
  not_ready: { label: "Encore du travail", variant: "error" },
};

export function ReadinessWidget({ quizSlug, examHref, passingScore = 70 }: Props) {
  const [cards, setCards] = useState<RevisionCard[] | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const all: RevisionCard[] = stored ? (JSON.parse(stored) as RevisionCard[]) : [];
        setCards(all.filter((c) => c.quizSlug === quizSlug));
      } catch {
        setCards([]);
      }
    });
  }, [quizSlug]);

  if (cards === null) return null;

  if (cards.length === 0) {
    return (
      <div className="rounded-2xl border border-border-light bg-surface p-4 text-sm text-ink-secondary">
        Commencez une session de révision pour voir votre prédiction de score.
      </div>
    );
  }

  const stats = getRevisionStats(cards);
  const prediction = predictExamScore(cards, passingScore);
  const readiness = READINESS_LABEL[prediction.readiness];

  return (
    <div className="rounded-2xl border border-border-light bg-surface-elevated p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink">Prédiction de score</p>
        <Badge variant={readiness.variant}>{readiness.label}</Badge>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-ink">{prediction.predictedScore}%</span>
        <span className="text-xs text-ink-tertiary">
          confiance {prediction.confidence}% · seuil {passingScore}%
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-xl bg-surface p-2">
          <p className="font-bold text-ink">{stats.total}</p>
          <p className="text-ink-tertiary">cartes</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-2">
          <p className="font-bold text-emerald-700">{stats.learned}</p>
          <p className="text-ink-tertiary">maîtrisées</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-2">
          <p className="font-bold text-amber-700">{stats.due}</p>
          <p className="text-ink-tertiary">à réviser</p>
        </div>
      </div>

      {prediction.readiness === "ready" ? (
        <Link
          href={examHref}
          className="mt-4 block rounded-full bg-accent px-4 py-2 text-center text-sm font-semibold text-white hover:opacity-90"
        >
          Passer l&apos;examen →
        </Link>
      ) : (
        <p className="mt-4 text-xs text-ink-secondary">
          Continuez à réviser pour augmenter votre score prédit avant de passer l&apos;examen.
        </p>
      )}
    </div>
  );
}
