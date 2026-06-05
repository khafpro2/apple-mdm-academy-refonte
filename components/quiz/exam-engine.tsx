"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import type { Quiz, Question } from "@/lib/types";
import { Button, ProgressBar, Badge } from "@/components/ui";
import { saveQuizResult } from "@/app/actions/progress";
import { getBadgeById } from "@/lib/badges-config";
import { pickExamQuestions, formatDuration } from "@/lib/data/exams/exam-utils";

type Answers = Record<string, number>;

export function ExamEngine({
  quiz,
  basePool,
  questionCount,
  isAuthenticated,
}: {
  quiz: Quiz;
  basePool: Question[];
  questionCount: number;
  isAuthenticated: boolean;
}) {
  const [phase, setPhase] = useState<"intro" | "exam" | "finished">("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [newBadgeIds, setNewBadgeIds] = useState<string[]>([]);
  const savedRef = useRef(false);
  const startTimeRef = useRef(0);
  const answersRef = useRef<Answers>({});

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const durationMinutes = quiz.durationMinutes ?? 120;
  const totalSeconds = durationMinutes * 60;

  const question = questions[currentIndex];
  const total = questions.length;

  const calculateScore = useCallback(
    (fromAnswers: Answers) => {
      let correct = 0;
      questions.forEach((q) => {
        if (fromAnswers[q.id] === q.correctIndex) correct++;
      });
      const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
      return { correct, total, percent, passed: percent >= quiz.passingScore };
    },
    [questions, total, quiz.passingScore]
  );

  const finishExam = useCallback(
    async (finalAnswers: Answers) => {
      setPhase("finished");
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      setElapsedSeconds(duration);

      if (isAuthenticated && !savedRef.current) {
        savedRef.current = true;
        const { percent, passed } = calculateScore(finalAnswers);
        setSaveStatus("saving");
        const res = await saveQuizResult({
          quizSlug: quiz.slug,
          trackSlug: quiz.trackSlug,
          score: percent,
          passed,
          answers: finalAnswers,
          durationSeconds: duration,
          examMode: true,
        });
        if (res.ok === false) {
          if (res.reason === "not_authenticated") {
            setSaveStatus("idle");
          } else {
            setSaveStatus("error");
          }
        } else {
          setSaveStatus("saved");
          setNewBadgeIds(res.newBadges);
        }
      }
    },
    [calculateScore, isAuthenticated, quiz.slug, quiz.trackSlug]
  );

  useEffect(() => {
    if (phase !== "exam") return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timer);
          void finishExam(answersRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, finishExam]);

  function startExam() {
    const seed = `${quiz.slug}-${Date.now()}-${Math.random()}`;
    const picked = pickExamQuestions(basePool, questionCount, seed);
    setQuestions(picked);
    setAnswers({});
    setCurrentIndex(0);
    setSelectedOption(null);
    setSecondsLeft(totalSeconds);
    setSaveStatus("idle");
    setNewBadgeIds([]);
    savedRef.current = false;
    startTimeRef.current = Date.now();
    setPhase("exam");
  }

  function confirmAndNext() {
    if (selectedOption === null || !question) return;
    const updated = { ...answers, [question.id]: selectedOption };
    setAnswers(updated);

    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(updated[questions[currentIndex + 1]?.id] ?? null);
    } else {
      void finishExam(updated);
    }
  }

  if (phase === "intro") {
    return (
      <div className="rounded-3xl border border-border-light bg-surface-elevated p-8 shadow-sm">
        <Badge variant="dark">Mode examen</Badge>
        <h2 className="mt-4 text-2xl font-bold text-ink">{quiz.title}</h2>
        <p className="mt-3 text-ink-secondary">{quiz.description}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-surface px-4 py-3 text-sm">
            <span className="text-ink-tertiary">Questions · </span>
            <span className="font-semibold text-ink">{questionCount} aléatoires</span>
          </div>
          <div className="rounded-2xl bg-surface px-4 py-3 text-sm">
            <span className="text-ink-tertiary">Durée · </span>
            <span className="font-semibold text-ink">{durationMinutes} min</span>
          </div>
          <div className="rounded-2xl bg-surface px-4 py-3 text-sm">
            <span className="text-ink-tertiary">Seuil · </span>
            <span className="font-semibold text-ink">{quiz.passingScore}%</span>
          </div>
          <div className="rounded-2xl bg-surface px-4 py-3 text-sm">
            <span className="text-ink-tertiary">Navigation · </span>
            <span className="font-semibold text-ink">Pas de retour</span>
          </div>
        </div>
        <ul className="mt-6 space-y-2 text-sm text-ink-secondary">
          <li>⏱ Chronomètre actif dès le début</li>
          <li>🔒 Impossible de revenir aux questions précédentes</li>
          <li>📋 Correction détaillée à la fin uniquement</li>
        </ul>
        {!isAuthenticated && (
          <p className="mt-4 text-sm text-ink-secondary">
            <Link href={`/auth/login?redirect=/quiz/${quiz.slug}`} className="font-semibold text-accent hover:underline">
              Connectez-vous
            </Link>{" "}
            pour enregistrer votre score et obtenir un certificat.
          </p>
        )}
        <Button onClick={startExam} className="mt-8">
          Démarrer l&apos;examen
        </Button>
      </div>
    );
  }

  if (phase === "finished") {
    const { correct, total: t, percent, passed } = calculateScore(answers);

    return (
      <div className="rounded-3xl border border-border-light bg-surface-elevated p-8 shadow-sm">
        <div className={`mx-auto flex h-28 w-28 flex-col items-center justify-center rounded-full ${passed ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
          <span className="text-3xl font-bold">{percent}%</span>
          <span className="text-xs">{formatDuration(elapsedSeconds)}</span>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold text-ink">
          {passed ? "Examen réussi !" : "Examen non validé"}
        </h2>
        <p className="mt-2 text-center text-ink-secondary">
          {correct} / {t} bonnes réponses · Seuil : {quiz.passingScore}%
        </p>

        {saveStatus === "saved" && (
          <div className="mt-4 rounded-2xl bg-green-50 px-4 py-3 text-center text-sm text-green-800">
            Résultat enregistré · Certificat disponible
          </div>
        )}
        {newBadgeIds.length > 0 && (
          <div className="mt-4 rounded-2xl bg-accent/5 p-4 text-center">
            <p className="text-sm font-semibold text-accent">Badge débloqué !</p>
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
          <h3 className="font-bold text-ink">Correction détaillée</h3>
          {questions.map((q, i) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correctIndex;
            return (
              <div key={q.id} className={`rounded-2xl border p-4 ${isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                <p className="text-sm font-semibold text-ink">{i + 1}. {q.text}</p>
                <p className="mt-2 text-sm text-ink-secondary">Votre réponse : {q.options[userAnswer] ?? "—"}</p>
                {!isCorrect && (
                  <p className="mt-1 text-sm font-medium text-green-700">Bonne réponse : {q.options[q.correctIndex]}</p>
                )}
                <p className="mt-2 text-xs text-ink-tertiary">{q.explanation}</p>
              </div>
            );
          })}
        </div>

        {passed && saveStatus === "saved" && (
          <a
            href={`/api/certificates/${quiz.slug}`}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-accent bg-accent/5 px-6 py-3 text-sm font-semibold text-accent hover:bg-accent/10"
          >
            Télécharger le certificat PDF
          </a>
        )}

        <div className="mt-8 flex flex-wrap gap-4">
          <Button onClick={startExam}>Repasser l&apos;examen</Button>
          <Link href="/dashboard" className="inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white">
            Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="rounded-3xl border border-border-light bg-surface-elevated p-8 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm font-medium text-ink-tertiary">
          Question {currentIndex + 1} / {total}
        </span>
        <div className={`rounded-full px-4 py-1.5 text-sm font-bold tabular-nums ${secondsLeft < 300 ? "bg-red-100 text-red-700" : "bg-surface text-ink"}`}>
          ⏱ {formatDuration(secondsLeft)}
        </div>
        <ProgressBar value={((currentIndex + 1) / total) * 100} className="w-full sm:w-48" />
      </div>

      <h2 className="text-xl font-bold leading-snug text-ink">{question.text}</h2>

      <div className="mt-6 space-y-3">
        {question.options.map((option, index) => (
          <button
            key={option}
            type="button"
            onClick={() => setSelectedOption(index)}
            className={`w-full rounded-2xl border p-4 text-left text-sm font-medium text-ink transition-all ${
              selectedOption === index
                ? "border-accent bg-accent/5 ring-2 ring-accent/20"
                : "border-border-light bg-surface hover:border-accent/40"
            }`}
          >
            <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-border-light text-xs font-bold">
              {String.fromCharCode(65 + index)}
            </span>
            {option}
          </button>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-xs text-ink-tertiary">Retour arrière désactivé en mode examen</p>
        <Button onClick={confirmAndNext} disabled={selectedOption === null}>
          {currentIndex < total - 1 ? "Question suivante →" : "Terminer l'examen"}
        </Button>
      </div>
    </div>
  );
}
