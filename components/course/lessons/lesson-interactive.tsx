"use client";

import { useState, useSyncExternalStore } from "react";
import { saveLessonProgress } from "@/app/actions/progress";
import { trackEvent } from "@/lib/analytics/events";
import type { Question } from "@/lib/types";
import { Button } from "@/components/ui";

const LESSON_COMPLETION_EVENT = "apple-mdm-lesson-completion-change";

export type ScoreFeedback = {
  title: string;
  message: string;
};

export function getScoreFeedback(
  score: number,
  tiers: { min: number; title: string; message: string }[]
): ScoreFeedback {
  const tier = [...tiers].reverse().find((t) => score >= t.min) ?? tiers[0];
  return { title: tier.title, message: tier.message };
}

type LessonQuizProps = {
  questions: Question[];
  onScoreChange?: (score: number) => void;
  passingScore?: number;
  scoreTiers: { min: number; title: string; message: string }[];
};

export function LessonQuiz({
  questions,
  onScoreChange,
  passingScore = 80,
  scoreTiers,
}: LessonQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);

  const question = questions[currentIndex];
  const total = questions.length;

  function calculateScore(fromAnswers: Record<string, number>) {
    let correct = 0;
    questions.forEach((q) => {
      if (fromAnswers[q.id] === q.correctIndex) correct++;
    });
    return Math.round((correct / total) * 100);
  }

  function confirmAnswer() {
    if (selected === null) return;
    setAnswers({ ...answers, [question.id]: selected });
    setShowExplanation(true);
  }

  function nextQuestion() {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      const finalAnswers = { ...answers, [question.id]: selected ?? answers[question.id] };
      setAnswers(finalAnswers);
      const score = calculateScore(finalAnswers);
      setFinished(true);
      onScoreChange?.(score);
    }
  }

  if (finished) {
    const score = calculateScore(answers);
    const feedback = getScoreFeedback(score, scoreTiers);
    const passed = score >= passingScore;

    return (
      <div className="rounded-3xl border border-border-light bg-surface p-6 shadow-sm md:p-8">
        <div
          className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold ${
            passed ? "bg-green-100 text-green-700" : score >= 60 ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
          }`}
        >
          {score}%
        </div>
        <h3 className="mt-6 text-center text-xl font-bold text-ink">{feedback.title}</h3>
        <p className="mt-2 text-center text-sm text-ink-secondary">{feedback.message}</p>

        <div className="mt-8 space-y-3">
          {questions.map((q, i) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correctIndex;
            return (
              <div
                key={q.id}
                className={`rounded-2xl border p-4 text-sm ${
                  isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                }`}
              >
                <p className="font-semibold text-ink">
                  {i + 1}. {q.text}
                </p>
                <p className="mt-1 text-ink-secondary">{q.explanation}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const isCorrect = selected === question.correctIndex;

  return (
    <div className="rounded-3xl border border-border-light bg-surface p-6 shadow-sm md:p-8">
      <div className="mb-4 text-sm text-ink-tertiary">
        Question {currentIndex + 1} / {total}
      </div>

      <h3 className="text-lg font-semibold text-ink">{question.text}</h3>

      <div className="mt-5 space-y-2">
        {question.options.map((option, index) => {
          let style = "border-border-light bg-surface-elevated hover:border-accent/40";
          if (showExplanation) {
            if (index === question.correctIndex) style = "border-green-500 bg-green-50";
            else if (index === selected && !isCorrect) style = "border-red-400 bg-red-50";
            else style = "border-border-light opacity-60";
          } else if (selected === index) {
            style = "border-accent bg-accent/5 ring-2 ring-accent/20";
          }

          return (
            <button
              key={option}
              type="button"
              onClick={() => !showExplanation && setSelected(index)}
              disabled={showExplanation}
              className={`w-full rounded-2xl border p-4 text-left text-sm font-medium transition-all ${style}`}
            >
              <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-border-light text-xs font-bold">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-blue-900">{question.explanation}</div>
      )}

      <div className="mt-6">
        {!showExplanation ? (
          <Button type="button" onClick={confirmAnswer} disabled={selected === null}>
            Valider
          </Button>
        ) : (
          <Button type="button" onClick={nextQuestion}>
            {currentIndex < total - 1 ? "Question suivante" : "Voir le résultat"}
          </Button>
        )}
      </div>
    </div>
  );
}

export function LessonChecklist({
  items,
  onCompleteChange,
  successTitle,
  successMessage,
}: {
  items: string[];
  onCompleteChange?: (complete: boolean) => void;
  successTitle: string;
  successMessage: string;
}) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const allChecked = items.every((_, i) => checked[i]);

  function toggle(index: number) {
    const next = { ...checked, [index]: !checked[index] };
    setChecked(next);
    onCompleteChange?.(items.every((_, i) => next[i]));
  }

  return (
    <div className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8">
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={item}>
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border-light bg-surface px-4 py-3 transition hover:bg-accent/[0.03]">
              <input
                type="checkbox"
                checked={Boolean(checked[i])}
                onChange={() => toggle(i)}
                className="h-5 w-5 rounded border-border accent-accent"
              />
              <span className="text-sm font-medium text-ink">{item}</span>
            </label>
          </li>
        ))}
      </ul>

      {allChecked && (
        <div className="mt-6 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-5 text-center">
          <p className="text-lg font-bold text-green-800">{successTitle}</p>
          <p className="mt-1 text-sm text-green-700">{successMessage}</p>
        </div>
      )}
    </div>
  );
}

export function LessonProgressBar({
  checklistDone,
  quizScore,
  markedComplete,
  passingScore = 80,
}: {
  checklistDone: boolean;
  quizScore: number;
  markedComplete: boolean;
  passingScore?: number;
}) {
  const done = [checklistDone, quizScore >= passingScore, markedComplete].filter(Boolean).length;
  const percent = Math.round((done / 3) * 100);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-ink-secondary">Progression de la leçon</span>
        <span className="font-semibold tabular-nums text-ink">{percent} %</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-border-light">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-blue-400 transition-all duration-700"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

export function LessonActions({
  quizScore,
  onMarkComplete,
  markedComplete,
  onResetQuiz,
  passingScore = 80,
}: {
  quizScore: number;
  onMarkComplete: () => void;
  markedComplete: boolean;
  onResetQuiz: () => void;
  passingScore?: number;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button type="button" onClick={onMarkComplete} disabled={markedComplete || quizScore < passingScore}>
        {markedComplete ? "✓ Leçon terminée" : "Marquer comme terminé"}
      </Button>
      <Button type="button" variant="secondary" onClick={onResetQuiz}>
        Refaire le quiz
      </Button>
    </div>
  );
}

export function useLessonCompletion(storageKey: string, lessonSlug?: string) {
  const resolvedSlug =
    lessonSlug ?? storageKey.match(/^lesson-(.+)-complete$/)?.[1];

  const markedComplete = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => {};
      window.addEventListener("storage", onStoreChange);
      window.addEventListener(LESSON_COMPLETION_EVENT, onStoreChange);
      return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener(LESSON_COMPLETION_EVENT, onStoreChange);
      };
    },
    () => {
      if (typeof window === "undefined") return false;
      try {
        return localStorage.getItem(storageKey) === "true";
      } catch {
        return false;
      }
    },
    () => false
  );

  function notifyCompletionChange() {
    if (typeof window === "undefined") return;
    try {
      window.dispatchEvent(new Event(LESSON_COMPLETION_EVENT));
    } catch {
      /* ignore */
    }
  }

  function markComplete(quizScore: number, passingScore = 80) {
    if (quizScore < passingScore) return;
    try {
      localStorage.setItem(storageKey, "true");
    } catch {
      /* ignore */
    }
    notifyCompletionChange();
    if (resolvedSlug) {
      void saveLessonProgress({ lessonSlug: resolvedSlug, score: quizScore });
      trackEvent("module_termine", { lesson: resolvedSlug });
    }
  }

  return { markedComplete, markComplete };
}
