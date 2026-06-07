"use client";

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import type { Quiz, Question } from "@/lib/types";
import { Button, ProgressBar, Badge } from "@/components/ui";
import { saveQuizResult } from "@/app/actions/progress";
import { getBadgeById } from "@/lib/badges-config";
import { trackEvent } from "@/lib/analytics/events";
import { pickExamQuestions, formatDuration } from "@/lib/data/exams/exam-utils";
import { pickAcitpExamQuestions } from "@/lib/data/acitp/exam-pool";
import { pickAeaExamQuestions } from "@/lib/data/apple-enterprise-architect/exam-pool";
import { pickAppleDeploymentExamQuestions } from "@/lib/data/apple-training/exam-apple-deployment";
import { pickAppleSecurityExamQuestions } from "@/lib/data/apple-training/exam-apple-security";
import { ACITP_EXAM_REPORT_STORAGE_KEY } from "@/lib/data/acitp/exam-report-storage";
import { getExamLoginRedirect } from "@/lib/data/exams/exam-routes";
import {
  loadExamSession,
  saveExamSession,
  clearExamSession,
  type ExamSession,
} from "@/lib/exam/session-storage";

import { isAnswerCorrect, scoreQuestions, type UserAnswer } from "@/lib/quiz/scoring";

type Answers = Record<string, UserAnswer>;

export function ExamEngine({
  quiz,
  basePool,
  questionCount,
  isAuthenticated,
  examRouteSlug,
}: {
  quiz: Quiz;
  basePool: Question[];
  questionCount: number;
  isAuthenticated: boolean;
  examRouteSlug?: string;
}) {
  const [phase, setPhase] = useState<"intro" | "exam" | "finished">("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [newBadgeIds, setNewBadgeIds] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNavigator, setShowNavigator] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);

  const savedSession = useSyncExternalStore(
    () => () => {},
    () => loadExamSession(quiz.slug),
    () => null
  );

  const savedRef = useRef(false);
  const startTimeRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sessionSeedRef = useRef("");
  const answersRef = useRef<Answers>({});

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const durationMinutes = quiz.durationMinutes ?? 120;
  const totalSeconds = durationMinutes * 60;
  const loginRedirect = getExamLoginRedirect(quiz.slug);

  const question = questions[currentIndex];
  const total = questions.length;

  const calculateScore = useCallback(
    (fromAnswers: Answers) => {
      const { correct, total: t } = scoreQuestions(questions, fromAnswers);
      const percent = t > 0 ? Math.round((correct / t) * 100) : 0;
      return { correct, total: t, percent, passed: percent >= quiz.passingScore };
    },
    [questions, quiz.passingScore]
  );

  const persistSession = useCallback(
    (next: Partial<ExamSession>) => {
      if (phase !== "exam" || questions.length === 0) return;
      saveExamSession({
        quizSlug: quiz.slug,
        questions,
        answers,
        flagged: [...flagged],
        currentIndex,
        secondsLeft,
        startedAt: startTimeRef.current,
        sessionSeed: sessionSeedRef.current,
        ...next,
      });
    },
    [phase, questions, answers, flagged, currentIndex, secondsLeft, quiz.slug]
  );

  const finishExam = useCallback(
    async (finalAnswers: Answers) => {
      setPhase("finished");
      clearExamSession(quiz.slug);
      if (document.fullscreenElement) {
        void document.exitFullscreen();
      }
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      const { percent, passed } = calculateScore(finalAnswers);
      setElapsedSeconds(duration);

      if (quiz.slug === "examen-apple-it-pro" && typeof sessionStorage !== "undefined") {
        try {
          sessionStorage.setItem(
            ACITP_EXAM_REPORT_STORAGE_KEY,
            JSON.stringify({
              questions,
              answers: finalAnswers,
              completedAt: new Date().toISOString(),
            })
          );
        } catch {
          /* quota */
        }
      }

      if (isAuthenticated && !savedRef.current) {
        savedRef.current = true;
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
          setSaveStatus(res.reason === "not_authenticated" ? "idle" : "error");
        } else {
          setSaveStatus("saved");
          setNewBadgeIds(res.newBadges);
          if (res.resultId) setResultId(res.resultId);
          trackEvent("quiz_termine", { quiz: quiz.slug, passed, score: percent });
          if (passed) trackEvent("examen_reussi", { quiz: quiz.slug, score: percent });
        }
      }
    },
    [calculateScore, isAuthenticated, quiz.slug, quiz.trackSlug, questions]
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

  useEffect(() => {
    if (phase === "exam") persistSession({});
  }, [phase, answers, flagged, currentIndex, secondsLeft, persistSession]);

  function beginExam(picked: Question[], seed: string, resume?: ExamSession) {
    sessionSeedRef.current = seed;
    setQuestions(picked);
    if (resume) {
      setAnswers(resume.answers);
      setFlagged(new Set(resume.flagged));
      setCurrentIndex(resume.currentIndex);
      const resumed = resume.answers[picked[resume.currentIndex]?.id];
      setSelectedOption(Array.isArray(resumed) ? null : (resumed ?? null));
      setSecondsLeft(resume.secondsLeft);
      startTimeRef.current = resume.startedAt;
    } else {
      setAnswers({});
      setFlagged(new Set());
      setCurrentIndex(0);
      setSelectedOption(null);
      setSecondsLeft(totalSeconds);
      startTimeRef.current = Date.now();
    }
    setSaveStatus("idle");
    setNewBadgeIds([]);
    setResultId(null);
    savedRef.current = false;
    setPhase("exam");
  }

  function startExam() {
    const seed = `${quiz.slug}-${Date.now()}-${Math.random()}`;
    const picked =
      quiz.slug === "examen-apple-it-pro"
        ? pickAcitpExamQuestions(seed)
        : quiz.slug === "examen-apple-enterprise-architect"
          ? pickAeaExamQuestions(seed)
          : quiz.slug === "examen-apple-deployment"
            ? pickAppleDeploymentExamQuestions(seed)
            : quiz.slug === "examen-apple-security"
              ? pickAppleSecurityExamQuestions(seed)
              : pickExamQuestions(basePool, questionCount, seed);
    beginExam(picked, seed);
  }

  function resumeExam() {
    if (!savedSession) return;
    beginExam(savedSession.questions, savedSession.sessionSeed, savedSession);
  }

  function goToQuestion(index: number) {
    if (index < 0 || index >= total) return;
    setCurrentIndex(index);
    const ans = answers[questions[index]?.id];
    setSelectedOption(Array.isArray(ans) ? null : (ans ?? null));
    setShowNavigator(false);
  }

  function selectOption(index: number) {
    if (!question) return;
    setSelectedOption(index);
    setAnswers((prev) => ({ ...prev, [question.id]: index }));
  }

  function toggleFlag() {
    if (!question) return;
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(question.id)) next.delete(question.id);
      else next.add(question.id);
      return next;
    });
  }

  async function toggleFullscreen() {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

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
            <span className="text-ink-tertiary">Sauvegarde · </span>
            <span className="font-semibold text-ink">Automatique</span>
          </div>
        </div>
        <ul className="mt-6 space-y-2 text-sm text-ink-secondary">
          <li>⏱ Chronomètre {durationMinutes} minutes — soumission auto à expiration</li>
          <li>🧭 Navigation libre entre les questions</li>
          <li>🔖 Marquer pour révision</li>
          <li>💾 Reprise de session si vous quittez la page</li>
          <li>📋 Correction détaillée avec liens vers les modules</li>
        </ul>
        {savedSession && (
          <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/5 p-4">
            <p className="text-sm font-semibold text-accent">Session en cours détectée</p>
            <p className="mt-1 text-xs text-ink-secondary">
              Question {savedSession.currentIndex + 1}/{savedSession.questions.length} ·{" "}
              {formatDuration(savedSession.secondsLeft)} restantes
            </p>
            <Button onClick={resumeExam} className="mt-3" size="sm">
              Reprendre la session
            </Button>
          </div>
        )}
        {!isAuthenticated && (
          <p className="mt-4 text-sm text-ink-secondary">
            <Link href={`/auth/login?redirect=${loginRedirect}`} className="font-semibold text-accent hover:underline">
              Connectez-vous
            </Link>{" "}
            pour enregistrer votre score et obtenir un certificat PDF.
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={startExam}>{savedSession ? "Nouvelle session" : "Démarrer l'examen"}</Button>
          {examRouteSlug && (
            <Link
              href="/dashboard/transcript"
              className="inline-flex items-center rounded-full border border-border-light px-5 py-2.5 text-sm font-semibold text-ink-secondary hover:text-ink"
            >
              Voir mon transcript
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (phase === "finished") {
    const { correct, total: t, percent, passed } = calculateScore(answers);
    const certUrl = resultId
      ? `/api/certificates/${quiz.slug}?resultId=${resultId}`
      : `/api/certificates/${quiz.slug}`;

    return (
      <div className="rounded-3xl border border-border-light bg-surface-elevated p-8 shadow-sm">
        <div
          className={`mx-auto flex h-28 w-28 flex-col items-center justify-center rounded-full ${passed ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
        >
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
            Résultat enregistré · Historique disponible dans votre transcript
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
            const correct = isAnswerCorrect(q, userAnswer);
            const formatAnswer = (ans: UserAnswer) => {
              if (ans === undefined) return "—";
              if (Array.isArray(ans)) return ans.map((idx) => q.options[idx]).join(", ");
              return q.options[ans] ?? "—";
            };
            const correctLabel = q.selectMultiple && q.correctIndices
              ? q.correctIndices.map((idx) => q.options[idx]).join(", ")
              : q.options[q.correctIndex];
            return (
              <div
                key={q.id}
                className={`rounded-2xl border p-4 ${correct ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
              >
                <p className="text-sm font-semibold text-ink">
                  {i + 1}. {q.text}
                </p>
                <p className="mt-2 text-sm text-ink-secondary">
                  Votre réponse : {formatAnswer(userAnswer)}
                </p>
                {!correct && (
                  <p className="mt-1 text-sm font-medium text-green-700">
                    Bonne réponse : {correctLabel}
                  </p>
                )}
                <p className="mt-2 text-xs text-ink-tertiary">{q.explanation}</p>
                {q.moduleHref && (
                  <Link href={q.moduleHref} className="mt-2 inline-block text-xs font-semibold text-accent hover:underline">
                    → {q.moduleLabel ?? "Revoir le module"}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {passed && saveStatus === "saved" && (
          <a
            href={certUrl}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-accent bg-accent/5 px-6 py-3 text-sm font-semibold text-accent hover:bg-accent/10"
          >
            Télécharger le certificat PDF
          </a>
        )}

        <div className="mt-8 flex flex-wrap gap-4">
          <Button onClick={startExam}>Repasser l&apos;examen</Button>
          {quiz.slug === "examen-apple-it-pro" && (
            <Link href="/examens/preparation-report" className="inline-flex items-center rounded-full border border-accent px-6 py-3 text-sm font-semibold text-accent hover:bg-accent/5">
              Rapport de préparation
            </Link>
          )}
          <Link href="/dashboard/transcript" className="inline-flex items-center rounded-full border border-border-light px-6 py-3 text-sm font-semibold text-ink-secondary hover:text-ink">
            Transcript
          </Link>
          <Link href="/dashboard" className="inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white">
            Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!question) return null;

  const answeredCount = Object.keys(answers).length;

  return (
    <div
      ref={containerRef}
      className={`rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8 ${isFullscreen ? "min-h-screen rounded-none" : ""}`}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-medium text-ink-tertiary">
          Question {currentIndex + 1} / {total} · {answeredCount} répondues
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <div
            className={`rounded-full px-4 py-1.5 text-sm font-bold tabular-nums ${secondsLeft < 300 ? "bg-red-100 text-red-700" : "bg-surface text-ink"}`}
          >
            ⏱ {formatDuration(secondsLeft)}
          </div>
          <button
            type="button"
            onClick={() => setShowNavigator((v) => !v)}
            className="rounded-full border border-border-light px-3 py-1.5 text-xs font-semibold text-ink-secondary hover:text-ink"
          >
            Questions
          </button>
          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            className="rounded-full border border-border-light px-3 py-1.5 text-xs font-semibold text-ink-secondary hover:text-ink"
          >
            {isFullscreen ? "Quitter plein écran" : "Plein écran"}
          </button>
        </div>
        <ProgressBar value={((currentIndex + 1) / total) * 100} className="w-full" />
      </div>

      {showNavigator && (
        <div className="mb-6 grid grid-cols-5 gap-2 sm:grid-cols-10">
          {questions.map((q, i) => {
            const answered = answers[q.id] !== undefined;
            const isFlagged = flagged.has(q.id);
            const isCurrent = i === currentIndex;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => goToQuestion(i)}
                className={`relative h-9 rounded-lg text-xs font-bold transition ${
                  isCurrent
                    ? "bg-accent text-white"
                    : answered
                      ? "bg-green-100 text-green-800"
                      : "bg-surface text-ink-secondary"
                } ${isFlagged ? "ring-2 ring-amber-400" : ""}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      )}

      <h2 className="text-xl font-bold leading-snug text-ink">{question.text}</h2>

      <div className="mt-6 space-y-3">
        {question.options.map((option, index) => (
          <button
            key={option}
            type="button"
            onClick={() => selectOption(index)}
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

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={toggleFlag}
          className={`text-sm font-semibold ${flagged.has(question.id) ? "text-amber-600" : "text-ink-tertiary hover:text-ink"}`}
        >
          {flagged.has(question.id) ? "★ Marquée pour révision" : "☆ Marquer pour révision"}
        </button>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => goToQuestion(currentIndex - 1)} disabled={currentIndex === 0}>
            ← Précédent
          </Button>
          {currentIndex < total - 1 ? (
            <Button onClick={() => goToQuestion(currentIndex + 1)}>Suivant →</Button>
          ) : (
            <Button onClick={() => void finishExam(answers)}>Terminer l&apos;examen</Button>
          )}
        </div>
      </div>
    </div>
  );
}
