"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import type { Quiz } from "@/lib/types";
import { Button, ProgressBar, Badge } from "@/components/ui";
import { saveQuizResult } from "@/app/actions/progress";
import { getBadgeById } from "@/lib/badges-config";

type Answers = Record<string, number>;

export function QuizEngine({
  quiz,
  isAuthenticated,
}: {
  quiz: Quiz;
  isAuthenticated: boolean;
}) {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [newBadgeIds, setNewBadgeIds] = useState<string[]>([]);
  const savedRef = useRef(false);

  const question = quiz.questions[currentIndex];
  const total = quiz.questions.length;

  function calculateScore(fromAnswers: Answers = answers) {
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (fromAnswers[q.id] === q.correctIndex) correct++;
    });
    const percent = Math.round((correct / total) * 100);
    return { correct, total, percent, passed: percent >= quiz.passingScore };
  }

  async function persistResult(finalAnswers: Answers) {
    const { percent, passed } = calculateScore(finalAnswers);
    setSaveStatus("saving");

    const res = await saveQuizResult({
      quizSlug: quiz.slug,
      trackSlug: quiz.trackSlug,
      score: percent,
      passed,
      answers: finalAnswers,
    });

    if (res.ok === false) {
      if (res.reason === "not_authenticated") {
        setSaveStatus("idle");
      } else {
        setSaveStatus("error");
      }
      return;
    }

    setSaveStatus("saved");
    setNewBadgeIds(res.newBadges);
  }

  function startQuiz() {
    setStarted(true);
    setCurrentIndex(0);
    setAnswers({});
    setSelectedOption(null);
    setShowResult(false);
    setFinished(false);
    setSaveStatus("idle");
    setNewBadgeIds([]);
    savedRef.current = false;
  }

  function selectOption(index: number) {
    if (showResult) return;
    setSelectedOption(index);
  }

  function confirmAnswer() {
    if (selectedOption === null) return;
    setAnswers({ ...answers, [question.id]: selectedOption });
    setShowResult(true);
  }

  function nextQuestion() {
    if (selectedOption === null) return;
    const updated = { ...answers, [question.id]: selectedOption };

    if (currentIndex < total - 1) {
      setAnswers(updated);
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setAnswers(updated);
      setFinished(true);
      if (isAuthenticated && !savedRef.current) {
        savedRef.current = true;
        void persistResult(updated);
      }
    }
  }

  if (!started) {
    return (
      <div className="rounded-3xl border border-border-light bg-surface-elevated p-8 shadow-sm">
        <Badge variant={quiz.type === "examen" ? "dark" : "accent"}>
          {quiz.type === "examen" ? "Examen blanc" : "Quiz"}
        </Badge>
        <h2 className="mt-4 text-2xl font-bold text-ink">{quiz.title}</h2>
        <p className="mt-3 text-ink-secondary">{quiz.description}</p>
        <div className="mt-6 flex flex-wrap gap-6 text-sm text-ink-tertiary">
          <span>{total} questions</span>
          <span>{quiz.duration}</span>
          <span>Score requis : {quiz.passingScore}%</span>
        </div>
        {!isAuthenticated && (
          <p className="mt-4 text-sm text-ink-secondary">
            <Link href={`/auth/login?redirect=/quiz/${quiz.slug}`} className="font-semibold text-accent hover:underline">
              Connectez-vous
            </Link>{" "}
            pour sauvegarder votre score.
          </p>
        )}
        <Button onClick={startQuiz} className="mt-8">
          {quiz.type === "examen" ? "Lancer l'examen" : "Commencer le quiz"}
        </Button>
      </div>
    );
  }

  if (finished) {
    const { correct, total: t, percent, passed } = calculateScore();

    return (
      <div className="rounded-3xl border border-border-light bg-surface-elevated p-8 shadow-sm">
        <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold ${passed ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
          {percent}%
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold text-ink">
          {passed ? "Félicitations !" : "Continue à t'entraîner"}
        </h2>
        <p className="mt-2 text-center text-ink-secondary">
          {correct} / {t} bonnes réponses · Seuil de réussite : {quiz.passingScore}%
        </p>

        {saveStatus === "saving" && (
          <p className="mt-4 text-center text-sm text-ink-tertiary">Enregistrement en cours…</p>
        )}
        {saveStatus === "saved" && (
          <div className="mt-4 rounded-2xl bg-green-50 px-4 py-3 text-center text-sm text-green-800">
            Score enregistré dans votre dashboard.
          </div>
        )}
        {(!isAuthenticated && saveStatus === "idle") && (
          <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">
            <Link href={`/auth/login?redirect=/quiz/${quiz.slug}`} className="font-semibold text-accent hover:underline">
              Connectez-vous
            </Link>{" "}
            pour sauvegarder ce résultat.
          </div>
        )}
        {saveStatus === "error" && (
          <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-center text-sm text-red-700">
            Impossible d&apos;enregistrer (vérifiez que le schéma SQL Supabase est appliqué).
          </div>
        )}

        {newBadgeIds.length > 0 && (
          <div className="mt-4 rounded-2xl bg-accent/5 p-4 text-center">
            <p className="text-sm font-semibold text-accent">Nouveau badge débloqué !</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {newBadgeIds.map((id) => {
                const badge = getBadgeById(id);
                return badge ? (
                  <span key={id} className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-medium shadow-sm">
                    {badge.icon} {badge.name}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}

        <div className="mt-8 space-y-4">
          <h3 className="font-bold text-ink">Corrections</h3>
          {quiz.questions.map((q, i) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correctIndex;
            return (
              <div key={q.id} className={`rounded-2xl border p-4 ${isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                <p className="text-sm font-semibold text-ink">
                  {i + 1}. {q.text}
                </p>
                <p className="mt-2 text-sm text-ink-secondary">
                  Ta réponse : {q.options[userAnswer] ?? "—"}
                </p>
                {!isCorrect && (
                  <p className="mt-1 text-sm font-medium text-green-700">
                    Bonne réponse : {q.options[q.correctIndex]}
                  </p>
                )}
                <p className="mt-2 text-xs text-ink-tertiary">{q.explanation}</p>
              </div>
            );
          })}
        </div>

        {passed && saveStatus === "saved" && (
          <a
            href={`/api/certificates/${quiz.slug}`}
            className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-accent bg-accent/5 px-6 py-3 text-sm font-semibold text-accent hover:bg-accent/10"
          >
            Télécharger le certificat PDF
          </a>
        )}

        <div className="mt-8 flex flex-wrap gap-4">
          <Button onClick={startQuiz}>Recommencer</Button>
          {saveStatus === "saved" && (
            <Link href="/dashboard" className="inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white">
              Voir le dashboard
            </Link>
          )}
          <Link href="/quiz" className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-ink hover:bg-surface">
            Retour aux quiz
          </Link>
        </div>
      </div>
    );
  }

  const isCorrect = selectedOption === question.correctIndex;

  return (
    <div className="rounded-3xl border border-border-light bg-surface-elevated p-8 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm font-medium text-ink-tertiary">
          Question {currentIndex + 1} / {total}
        </span>
        <ProgressBar value={((currentIndex + (showResult ? 1 : 0)) / total) * 100} className="w-32" />
      </div>

      <h2 className="text-xl font-bold leading-snug text-ink">{question.text}</h2>

      <div className="mt-6 space-y-3">
        {question.options.map((option, index) => {
          let style = "border-border-light bg-surface hover:border-accent/40";
          if (showResult) {
            if (index === question.correctIndex) style = "border-green-500 bg-green-50";
            else if (index === selectedOption && !isCorrect) style = "border-red-400 bg-red-50";
            else style = "border-border-light bg-surface opacity-60";
          } else if (selectedOption === index) {
            style = "border-accent bg-accent/5 ring-2 ring-accent/20";
          }

          return (
            <button
              key={option}
              type="button"
              onClick={() => selectOption(index)}
              disabled={showResult}
              className={`w-full rounded-2xl border p-4 text-left text-sm font-medium text-ink transition-all ${style}`}
            >
              <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-border-light text-xs font-bold">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className={`mt-6 rounded-2xl p-4 ${isCorrect ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-900"}`}>
          <p className="font-semibold">{isCorrect ? "Bonne réponse !" : "Pas tout à fait…"}</p>
          <p className="mt-1 text-sm">{question.explanation}</p>
        </div>
      )}

      <div className="mt-8">
        {!showResult ? (
          <Button onClick={confirmAnswer} disabled={selectedOption === null}>
            Valider
          </Button>
        ) : (
          <Button onClick={nextQuestion}>
            {currentIndex < total - 1 ? "Question suivante" : "Voir les résultats"}
          </Button>
        )}
      </div>
    </div>
  );
}
