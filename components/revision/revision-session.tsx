"use client";

import { useState, useEffect, useCallback } from "react";
import type { Question } from "@/lib/types";
import type { RevisionCard, CardGrade } from "@/lib/revision/spaced-repetition";
import { reviewCard, createRevisionCard, getDueCards } from "@/lib/revision/spaced-repetition";
import { Badge, ButtonLink } from "@/components/ui";

const STORAGE_KEY = "mdm-revision-cards";
const GRADE_LABELS: { grade: CardGrade; label: string; color: string }[] = [
  { grade: 1, label: "Raté", color: "bg-red-500 hover:bg-red-600" },
  { grade: 3, label: "Difficile", color: "bg-amber-500 hover:bg-amber-600" },
  { grade: 4, label: "Bien", color: "bg-blue-500 hover:bg-blue-600" },
  { grade: 5, label: "Parfait", color: "bg-emerald-500 hover:bg-emerald-600" },
];

interface Props {
  questions: Question[];
  quizSlug: string;
  onComplete?: (stats: { reviewed: number; correct: number }) => void;
}

export function RevisionSession({ questions, quizSlug, onComplete }: Props) {
  const [cards, setCards] = useState<RevisionCard[]>([]);
  const [queue, setQueue] = useState<RevisionCard[]>([]);
  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, correct: 0 });
  const [done, setDone] = useState(false);

  // Load or create cards from localStorage
  useEffect(() => {

    let mounted = true;
    const load = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const allCards: RevisionCard[] = stored ? (JSON.parse(stored) as RevisionCard[]) : [];
        const existing = new Set(allCards.map((c) => c.questionId));
        const newCards = questions
          .filter((q) => !existing.has(q.id))
          .map((q) => createRevisionCard(q.id, quizSlug));
        const merged = [...allCards, ...newCards];
        const due = getDueCards(merged.filter((c) => c.quizSlug === quizSlug));
        const q = due.length > 0 ? due : merged.filter((c) => c.quizSlug === quizSlug).slice(0, 10);
        if (mounted) { setCards(merged); setQueue(q); }
      } catch {
        if (mounted) {
          setCards([]);
          setQueue(questions.slice(0, 10).map((q) => createRevisionCard(q.id, quizSlug)));
        }
      }
    };
    load();
    return () => { mounted = false; };
  }, [questions, quizSlug]);

  const saveCards = useCallback((updated: RevisionCard[]) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allCards: RevisionCard[] = stored ? (JSON.parse(stored) as RevisionCard[]) : [];
      const otherCards = allCards.filter((c) => c.quizSlug !== quizSlug);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...otherCards, ...updated]));
    } catch { /* localStorage might be unavailable */ }
  }, [quizSlug]);

  function handleGrade(grade: CardGrade) {
    if (current >= queue.length) return;

    const card = queue[current];
    const updated = reviewCard(card, grade);

    const newCards = cards.map((c) => (c.questionId === card.questionId ? updated : c));
    setCards(newCards);
    saveCards(newCards);

    const newStats = {
      reviewed: sessionStats.reviewed + 1,
      correct: sessionStats.correct + (grade >= 3 ? 1 : 0),
    };
    setSessionStats(newStats);

    if (current + 1 >= queue.length) {
      setDone(true);
      onComplete?.(newStats);
    } else {
      setCurrent((c) => c + 1);
      setRevealed(false);
    }
  }

  if (queue.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-4xl" aria-hidden>🎉</p>
        <h2 className="mt-4 text-xl font-bold text-ink">Aucune carte due aujourd&apos;hui !</h2>
        <p className="mt-2 text-sm text-ink-secondary">Toutes vos cartes sont à jour. Revenez demain.</p>
        <ButtonLink href={`/examens/${quizSlug}`} className="mt-6">Passer l&apos;examen →</ButtonLink>
      </div>
    );
  }

  if (done) {
    const pct = Math.round((sessionStats.correct / sessionStats.reviewed) * 100);
    return (
      <div className="py-12 text-center">
        <p className="text-5xl" aria-hidden>{pct >= 70 ? "🎯" : "📖"}</p>
        <h2 className="mt-4 text-xl font-bold text-ink">Session terminée</h2>
        <p className="mt-2 text-3xl font-extrabold text-accent">{pct}%</p>
        <p className="mt-1 text-sm text-ink-secondary">
          {sessionStats.correct}/{sessionStats.reviewed} bonnes réponses
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => { setCurrent(0); setDone(false); setRevealed(false); setSessionStats({ reviewed: 0, correct: 0 }); }}
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Nouvelle session
          </button>
          <ButtonLink href={`/examens/${quizSlug}`} variant="secondary">
            Passer l&apos;examen →
          </ButtonLink>
        </div>
      </div>
    );
  }

  const currentCard = queue[current];
  const question = questions.find((q) => q.id === currentCard?.questionId);
  if (!question) return null;

  const correctAnswer = question.options[question.correctIndex];
  const progress = Math.round((current / queue.length) * 100);

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="h-2 overflow-hidden rounded-full bg-border-light">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span className="shrink-0 text-sm font-medium text-ink-secondary">
          {current + 1}/{queue.length}
        </span>
        <Badge variant={currentCard.repetitions >= 3 ? "success" : currentCard.repetitions > 0 ? "warning" : "default"}>
          {currentCard.repetitions >= 3 ? "Maîtrisé" : currentCard.repetitions > 0 ? "En cours" : "Nouveau"}
        </Badge>
      </div>

      {/* Question card */}
      <div className="rounded-3xl border border-border-light bg-surface-elevated p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">Question</p>
        <h2 className="mt-3 text-lg font-bold leading-relaxed text-ink">{question.text}</h2>

        {!revealed ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="mt-8 w-full rounded-2xl border-2 border-dashed border-accent/30 bg-accent/5 py-4 text-sm font-semibold text-accent transition hover:border-accent/50 hover:bg-accent/10"
          >
            Afficher la réponse
          </button>
        ) : (
          <div className="mt-6">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs font-semibold text-emerald-700">Réponse correcte</p>
              <p className="mt-1 font-semibold text-emerald-900">{correctAnswer}</p>
            </div>
            {question.explanation && (
              <p className="mt-4 text-sm leading-relaxed text-ink-secondary">{question.explanation}</p>
            )}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {GRADE_LABELS.map(({ grade, label, color }) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => handleGrade(grade)}
                  className={`rounded-2xl py-3 text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95 ${color}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
