"use client";

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { getExamDurationMinutes, getScoreTier } from "@/lib/exam/exam-config";
import { saveExamResult } from "@/lib/exam/exam-result-storage";
import { markExamInProgress, recordExamCompletion } from "@/lib/exam/exam-history-storage";
import {
  loadExamSession,
  saveExamSession,
  clearExamSession,
  type ExamSession,
} from "@/lib/exam/session-storage";
import { isAnswerCorrect, scoreQuestions, type UserAnswer } from "@/lib/quiz/scoring";
import { ExamResultView } from "@/components/exams/exam-result-view";

type Answers = Record<string, UserAnswer>;
type ViewMode = "intro" | "exam" | "result";

const ALERT_10_MIN = 600;
const ALERT_1_MIN = 60;

export function ExamEngine({
  quiz,
  basePool,
  questionCount,
  isAuthenticated,
  routeSlug,
  viewMode = "intro",
}: {
  quiz: Quiz;
  basePool: Question[];
  questionCount: number;
  isAuthenticated: boolean;
  routeSlug: string;
  viewMode?: ViewMode;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<ViewMode>(viewMode);
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
  const [timerAlert, setTimerAlert] = useState<string | null>(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [poolWarning, setPoolWarning] = useState<string | null>(null);

  const savedSession = useSyncExternalStore(
    () => () => {},
    () => loadExamSession(routeSlug, quiz.slug),
    () => null
  );

  const savedRef = useRef(false);
  const startTimeRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sessionSeedRef = useRef("");
  const answersRef = useRef<Answers>({});
  const alert10Ref = useRef(false);
  const alert1Ref = useRef(false);
  const autoStartedRef = useRef(false);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const durationMinutes = getExamDurationMinutes(routeSlug, quiz.durationMinutes ?? 120);
  const totalSeconds = durationMinutes * 60;
  const loginRedirect = getExamLoginRedirect(quiz.slug);
  const uniqueBaseCount = basePool.length;
  const incompletePool = uniqueBaseCount === 0 || uniqueBaseCount < questionCount;

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
        routeSlug,
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
    [phase, questions, answers, flagged, currentIndex, secondsLeft, routeSlug, quiz.slug]
  );

  const finishExam = useCallback(
    async (finalAnswers: Answers) => {
      setShowSubmitConfirm(false);
      setPhase("result");
      clearExamSession(routeSlug, quiz.slug);
      if (document.fullscreenElement) {
        void document.exitFullscreen();
      }
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      const { correct, total: t, percent, passed } = calculateScore(finalAnswers);
      setElapsedSeconds(duration);
      const tier = getScoreTier(percent);

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

      saveExamResult(routeSlug, {
        routeSlug,
        quizSlug: quiz.slug,
        quizTitle: quiz.title,
        passingScore: quiz.passingScore,
        questions,
        answers: finalAnswers,
        percent,
        correct,
        total: t,
        passed,
        elapsedSeconds: duration,
        completedAt: new Date().toISOString(),
        tierLabel: tier.label,
      });

      recordExamCompletion(routeSlug, quiz.slug, quiz.title, percent, passed, duration, {
        correct,
        total: t,
        answers: finalAnswers,
      });

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

      router.replace(`/examens/${routeSlug}/result`);
    },
    [calculateScore, isAuthenticated, quiz, questions, routeSlug, router]
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
        const next = s - 1;
        if (next <= ALERT_1_MIN && !alert1Ref.current) {
          alert1Ref.current = true;
          setTimerAlert("⚠️ 1 minute restante — soumission automatique imminente");
        } else if (next <= ALERT_10_MIN && !alert10Ref.current) {
          alert10Ref.current = true;
          setTimerAlert("⏰ 10 minutes restantes");
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, finishExam]);

  useEffect(() => {
    if (phase === "exam") persistSession({});
  }, [phase, answers, flagged, currentIndex, secondsLeft, persistSession]);

  function pickQuestions(seed: string): Question[] {
    if (basePool.length === 0) {
      setPoolWarning("Banque de questions incomplète — aucune question disponible.");
      return [];
    }
    if (uniqueBaseCount < questionCount) {
      setPoolWarning(
        `Banque de questions incomplète (${uniqueBaseCount} uniques / ${questionCount} cibles) — test avec les questions disponibles.`
      );
    } else {
      setPoolWarning(null);
    }

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

    return picked.length > 0 ? picked : pickExamQuestions(basePool, Math.min(questionCount, uniqueBaseCount), seed);
  }

  function beginExam(picked: Question[], seed: string, resume?: ExamSession) {
    if (picked.length === 0) return;
    sessionSeedRef.current = seed;
    alert10Ref.current = false;
    alert1Ref.current = false;
    setTimerAlert(null);
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
    markExamInProgress(routeSlug, quiz.slug, quiz.title);
    router.replace(`/examens/${routeSlug}/start`);
  }

  function startExam() {
    const seed = `${quiz.slug}-${Date.now()}-${Math.random()}`;
    beginExam(pickQuestions(seed), seed);
  }

  function resumeExam() {
    if (!savedSession) return;
    beginExam(savedSession.questions, savedSession.sessionSeed, savedSession);
  }

  function restartExam() {
    clearExamSession(routeSlug, quiz.slug);
    startExam();
  }

  useEffect(() => {
    if (viewMode !== "exam" || autoStartedRef.current) return;
    autoStartedRef.current = true;
    const id = window.setTimeout(() => {
      if (savedSession) resumeExam();
      else startExam();
    }, 0);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- auto-start once on /start
  }, [viewMode]);

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

  if (phase === "result") {
    const { correct, total: t, percent, passed } = calculateScore(answers);
    const tier = getScoreTier(percent);
    const certUrl = resultId
      ? `/api/certificates/${quiz.slug}?resultId=${resultId}`
      : `/api/certificates/${quiz.slug}`;

    return (
      <ExamResultView
        quiz={quiz}
        routeSlug={routeSlug}
        questions={questions}
        answers={answers}
        percent={percent}
        correct={correct}
        total={t}
        passed={passed}
        elapsedSeconds={elapsedSeconds}
        tier={tier}
        saveStatus={saveStatus}
        newBadgeIds={newBadgeIds}
        certUrl={certUrl}
        onRetake={restartExam}
      />
    );
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
            <span className="text-ink-tertiary">Timer · </span>
            <span className="font-semibold text-ink">Activé</span>
          </div>
        </div>
        {incompletePool && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Banque de questions incomplète ({uniqueBaseCount} / {questionCount}) — l&apos;examen utilisera les questions disponibles.
          </div>
        )}
        <ul className="mt-6 space-y-2 text-sm text-ink-secondary">
          <li>⏱ Chronomètre {durationMinutes} minutes — soumission auto à expiration</li>
          <li>🧭 Navigation libre entre les questions</li>
          <li>🔖 Marquer pour révision</li>
          <li>💾 Reprise de session si vous quittez la page</li>
          <li>📋 Correction détaillée avec modules recommandés</li>
        </ul>
        {savedSession && (
          <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/5 p-4">
            <p className="text-sm font-semibold text-accent">Une tentative est en cours</p>
            <p className="mt-1 text-xs text-ink-secondary">
              Question {savedSession.currentIndex + 1}/{savedSession.questions.length} ·{" "}
              {formatDuration(savedSession.secondsLeft)} restantes
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={resumeExam} size="sm">
                Reprendre
              </Button>
              <Button onClick={restartExam} variant="secondary" size="sm">
                Recommencer
              </Button>
            </div>
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
          <Button
            onClick={() => {
              clearExamSession(routeSlug, quiz.slug);
              router.push(`/examens/${routeSlug}/start`);
            }}
          >
            Commencer l&apos;examen
          </Button>
          <Link
            href="/dashboard/transcript"
            className="inline-flex items-center rounded-full border border-border-light px-5 py-2.5 text-sm font-semibold text-ink-secondary hover:text-ink"
          >
            Voir mon transcript
          </Link>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="font-semibold text-red-800">Banque de questions incomplète</p>
        <p className="mt-2 text-sm text-red-700">{poolWarning ?? "Aucune question disponible pour cet examen."}</p>
        <Link href={`/examens/${routeSlug}`} className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
          ← Retour aux instructions
        </Link>
      </div>
    );
  }

  if (!question) return null;

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = total - answeredCount;
  const timerPercent = totalSeconds > 0 ? (secondsLeft / totalSeconds) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={`rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8 ${isFullscreen ? "min-h-screen rounded-none" : ""}`}
    >
      {timerAlert && (
        <div
          className={`mb-4 rounded-2xl px-4 py-3 text-sm font-semibold ${secondsLeft <= ALERT_1_MIN ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-900"}`}
          role="alert"
        >
          {timerAlert}
        </div>
      )}

      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-xs text-ink-tertiary">
          <span>Temps restant</span>
          <span>{Math.round(timerPercent)}%</span>
        </div>
        <ProgressBar
          value={timerPercent}
          className={`h-2 ${secondsLeft <= ALERT_1_MIN ? "[&>div]:bg-red-500" : secondsLeft <= ALERT_10_MIN ? "[&>div]:bg-amber-500" : ""}`}
        />
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-medium text-ink-tertiary">
          Question {currentIndex + 1} / {total} · {answeredCount} répondues · {unansweredCount} non répondues
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <div
            className={`rounded-full px-4 py-1.5 text-sm font-bold tabular-nums ${secondsLeft <= ALERT_1_MIN ? "bg-red-100 text-red-700 animate-pulse" : secondsLeft <= ALERT_10_MIN ? "bg-amber-100 text-amber-800" : "bg-surface text-ink"}`}
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
            <Button onClick={() => setShowSubmitConfirm(true)}>Terminer l&apos;examen</Button>
          )}
          <Button variant="secondary" onClick={() => setShowSubmitConfirm(true)}>
            Soumettre
          </Button>
        </div>
      </div>

      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-ink">Terminer l&apos;examen ?</h3>
            <p className="mt-2 text-sm text-ink-secondary">
              {answeredCount} / {total} questions répondues · {unansweredCount} non répondues restantes.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => void finishExam(answers)}>Confirmer la soumission</Button>
              <Button variant="secondary" onClick={() => setShowSubmitConfirm(false)}>
                Continuer l&apos;examen
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
