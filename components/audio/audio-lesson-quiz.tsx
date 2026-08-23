"use client";

import { useMemo, useState } from "react";
import type { AudioLessonQuizItem } from "@/lib/data/audio/types";

type AudioLessonQuizProps = {
  title?: string;
  quiz: AudioLessonQuizItem[];
};

const LETTERS = ["A", "B", "C", "D"] as const;

export function AudioLessonQuiz({ title = "QCM de la leçon", quiz }: AudioLessonQuizProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    return quiz.reduce((total, item) => (answers[item.id] === item.correctIndex ? total + 1 : total), 0);
  }, [answers, quiz]);

  const allAnswered = quiz.every((item) => answers[item.id] !== undefined);

  return (
    <section className="rounded-3xl border border-border-light bg-surface-elevated p-5 shadow-sm md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">Fin de piste</p>
          <h2 className="mt-1 text-xl font-bold text-ink">{title}</h2>
          <p className="mt-2 text-sm text-ink-secondary">
            Quatre questions. Choisissez A, B, C ou D, puis validez pour voir le corrigé.
          </p>
        </div>
        {submitted && (
          <p className="rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
            Score {score} / {quiz.length}
          </p>
        )}
      </div>

      <ol className="mt-6 space-y-6">
        {quiz.map((item, index) => {
          const selected = answers[item.id];
          return (
            <li key={item.id} className="rounded-2xl border border-border-light bg-surface p-4 md:p-5">
              <p className="font-semibold text-ink">
                {index + 1}. {item.text}
              </p>
              <div className="mt-3 grid gap-2" role="radiogroup" aria-label={`Question ${index + 1}`}>
                {item.options.map((option, optionIndex) => {
                  const isSelected = selected === optionIndex;
                  const isCorrect = optionIndex === item.correctIndex;
                  const showState = submitted && (isSelected || isCorrect);
                  const stateClass = !showState
                    ? isSelected
                      ? "border-accent bg-accent/5"
                      : "border-border-light bg-white hover:border-accent/40"
                    : isCorrect
                      ? "border-emerald-300 bg-emerald-50"
                      : isSelected
                        ? "border-red-300 bg-red-50"
                        : "border-border-light bg-white";

                  return (
                    <label
                      key={option}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-sm leading-relaxed text-ink-secondary ${stateClass}`}
                    >
                      <input
                        type="radio"
                        className="mt-1"
                        name={item.id}
                        value={optionIndex}
                        checked={isSelected}
                        disabled={submitted}
                        onChange={() =>
                          setAnswers((current) => ({
                            ...current,
                            [item.id]: optionIndex,
                          }))
                        }
                      />
                      <span>
                        <span className="font-semibold text-ink">{LETTERS[optionIndex]}.</span> {option}
                      </span>
                    </label>
                  );
                })}
              </div>
              {submitted && (
                <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
                  <span className="font-semibold text-ink">Corrigé {LETTERS[item.correctIndex]}.</span>{" "}
                  {item.explanation}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!allAnswered || submitted}
          onClick={() => setSubmitted(true)}
        >
          Valider le QCM
        </button>
        {submitted && (
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-white px-5 py-2 text-sm font-semibold text-ink transition hover:bg-surface"
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
            }}
          >
            Recommencer
          </button>
        )}
      </div>
    </section>
  );
}
