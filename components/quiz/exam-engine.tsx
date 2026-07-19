"use client";

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Quiz, Question } from "@/lib/types";
import { Button, ProgressBar, Badge } from "@/components/ui";
import { saveQuizResult } from "@/app/actions/progress";
import { trackEvent } from "@/lib/analytics/events";
import { formatDuration } from "@/lib/data/exams/exam-utils";
import { ACITP_EXAM_REPORT_STORAGE_KEY } from "@/lib/data/acitp/exam-report-storage";
import { getExamLoginRedirect } from "@/lib/data/exams/exam-routes";
import { getExamDurationMinutes } from "@/lib/exams/exam-config";
import { getScoreTier } from "@/components/exams/score-tiers";
import { saveExamResult } from "@/lib/exam/exam-result-storage";
import { markExamInProgress, recordExamCompletion } from "@/lib/exam/exam-history-storage";
import {
  loadExamSession,
  saveExamSession,
  clearExamSession,
  subscribeToExamSession,
  type ExamSession,
} from "@/lib/exam/session-storage";
import { isAnswerCorrect, scoreQuestions, type UserAnswer } from "@/lib/quiz/scoring";
import { ExamResultView } from "@/components/exams/exam-result-view";
import { ExamHistoryPanel } from "@/components/quiz/exam-history-panel";
import { ExamTimer } from "@/components/exams/exam-timer";
import { selectExamQuestions } from "@/lib/exams/selection";
import type { ExamFormat, ExamMode } from "@/lib/exams/exam-types";

type Answers = Record<string, UserAnswer>;
type ViewMode = "intro" | "exam" | "result";

const ALERT_10_MIN = 600;
const ALERT_1_MIN = 60;

export function ExamEngine({
  quiz,
  examFormat,
  basePool,
  questionCount,
  isAuthenticated,
  routeSlug,
  viewMode = "intro",
  fullSimulationAvailable,
  simulationBlockedReason,
}: {
  quiz: Quiz;
  examFormat?: ExamFormat;
  basePool: Question[];
  questionCount: number;
  isAuthenticated: boolean;
  routeSlug: string;
  viewMode?: ViewMode;
  /** From Codex availability / simulationPanel — when set, overrides local pool length heuristic. */
  fullSimulationAvailable?: boolean;
  simulationBlockedReason?: string;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<ViewMode>(viewMode);
  const [activeMode, setActiveMode] = useState<ExamMode>(viewMode === "exam" ? "simulation" : "training");
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
  const [timerPaused, setTimerPaused] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [poolWarning, setPoolWarning] = useState<string | null>(null);

  const savedSession = useSyncExternalStore(
    subscribeToExamSession,
    () => loadExamSession(routeSlug, quiz.slug),
    () => null
  );

  const savedRef = useRef(false);
  const startTimeRef = useRef(0);
  const expiresAtRef = useRef<number | null>(null);
  const attemptIdRef = useRef("");
  const containerRef = useRef<HTMLDivElement>(null);
  const sessionSeedRef = useRef("");
  const answersRef = useRef<Answers>({});
  const alert10Ref = useRef(false);
  const alert1Ref = useRef(false);
  const autoStartedRef = useRef(false);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const modeBehavior = examFormat?.modes[activeMode];
  const durationMinutes = modeBehavior?.durationMinutes ?? (activeMode === "simulation" ? getExamDurationMinutes(routeSlug, quiz.durationMinutes ?? 120) : 0);
  const totalSeconds = durationMinutes * 60;
  const loginRedirect = getExamLoginRedirect(quiz.slug);
  const uniqueBaseCount = basePool.length;
  const incompletePool =
    typeof fullSimulationAvailable === "boolean"
      ? !fullSimulationAvailable
      : uniqueBaseCount === 0 || uniqueBaseCount < questionCount;
  const simulationTargetCount = examFormat?.modes.simulation.questionCount ?? questionCount;
  const trainingTargetCount = examFormat?.modes.training.questionCount ?? Math.min(20, questionCount);
  const effectiveSimulationCount = incompletePool ? uniqueBaseCount : simulationTargetCount;
  const effectiveTrainingCount = Math.min(trainingTargetCount, uniqueBaseCount || trainingTargetCount);

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
        attemptId: attemptIdRef.current,
        mode: activeMode,
        status: "in_progress",
        questions,
        answers,
        flagged: [...flagged],
        currentIndex,
        secondsLeft,
        startedAt: startTimeRef.current,
        expiresAt: expiresAtRef.current,
        updatedAt: Date.now(),
        sessionSeed: sessionSeedRef.current,
        ...next,
      });
    },
    [phase, questions, answers, flagged, currentIndex, secondsLeft, routeSlug, quiz.slug, activeMode]
  );

  const finishExam = useCallback(
    async (finalAnswers: Answers) => {
      if (questions.length === 0) return;
      setShowSubmitConfirm(false);
      setPhase("result");
      clearExamSession(routeSlug, quiz.slug);
      if (document.fullscreenElement) {
        void document.exitFullscreen();
      }
      const duration =
        totalSeconds > 0
          ? Math.min(totalSeconds, Math.round((Date.now() - startTimeRef.current) / 1000))
          : Math.round((Date.now() - startTimeRef.current) / 1000);
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
    [calculateScore, isAuthenticated, quiz, questions, routeSlug, router, totalSeconds]
  );

  useEffect(() => {
    if (phase !== "exam" || questions.length === 0 || timerPaused || totalSeconds <= 0) return;
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
  }, [phase, finishExam, questions.length, timerPaused, totalSeconds]);

  useEffect(() => {
    if (phase === "exam") persistSession({});
  }, [phase, answers, flagged, currentIndex, secondsLeft, persistSession]);

  function pickQuestions(seed: string, mode: ExamMode): Question[] {
    if (basePool.length === 0) {
      setPoolWarning("Banque de questions incomplète — aucune question disponible.");
      return [];
    }
    const targetCount = examFormat?.modes[mode].questionCount ?? questionCount;
    if (uniqueBaseCount < targetCount) {
      setPoolWarning(
        `Banque de questions incomplète (${uniqueBaseCount} uniques / ${targetCount} cibles) — test avec les questions disponibles.`
      );
    } else {
      setPoolWarning(null);
    }

    const report = selectExamQuestions(basePool, {
      seed,
      count: targetCount,
      level: examFormat?.difficulty,
    });
    if (report.warnings.length > 0) setPoolWarning(report.warnings.join(" "));
    return report.selected;
  }

  function beginExam(picked: Question[], seed: string, mode: ExamMode, resume?: ExamSession) {
    if (picked.length === 0) return;
    setActiveMode(mode);
    sessionSeedRef.current = seed;
    attemptIdRef.current = resume?.attemptId ?? `${quiz.slug}-${mode}-${Date.now()}`;
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
      expiresAtRef.current = resume.expiresAt;
      if (resume.status === "expired") {
        window.setTimeout(() => void finishExam(resume.answers), 0);
      }
    } else {
      setAnswers({});
      setFlagged(new Set());
      setCurrentIndex(0);
      setSelectedOption(null);
      const nextDuration = examFormat?.modes[mode].durationMinutes ?? (mode === "simulation" ? getExamDurationMinutes(routeSlug, quiz.durationMinutes ?? 120) : 0);
      setSecondsLeft(nextDuration * 60);
      startTimeRef.current = Date.now();
      expiresAtRef.current = nextDuration > 0 ? startTimeRef.current + nextDuration * 60 * 1000 : null;
    }
    setTimerPaused(false);
    setSaveStatus("idle");
    setNewBadgeIds([]);
    setResultId(null);
    savedRef.current = false;
    setPhase("exam");
    markExamInProgress(routeSlug, quiz.slug, quiz.title);
    if (mode === "simulation") router.replace(`/examens/${routeSlug}/start`);
  }

  function startExam(mode: ExamMode = "simulation") {
    const seed = `${quiz.slug}-${mode}-${Date.now()}-${Math.random()}`;
    beginExam(pickQuestions(seed, mode), seed, mode);
  }

  function resumeExam() {
    if (!savedSession) return;
    beginExam(savedSession.questions, savedSession.sessionSeed, savedSession.mode, savedSession);
  }

  function restartExam() {
    clearExamSession(routeSlug, quiz.slug);
    startExam(activeMode);
  }

  useEffect(() => {
    if (viewMode !== "exam" || autoStartedRef.current) return;
    const existingSession = loadExamSession(routeSlug, quiz.slug);
    if (!existingSession && basePool.length === 0) return;
    autoStartedRef.current = true;
    const id = window.setTimeout(() => {
      if (existingSession) beginExam(existingSession.questions, existingSession.sessionSeed, existingSession.mode, existingSession);
      else startExam("simulation");
    }, 0);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- auto-start once when /start has a session or a hydrated question pool
  }, [viewMode, basePool.length, routeSlug, quiz.slug]);

  function goToQuestion(index: number) {
    if (index < 0 || index >= total) return;
    setCurrentIndex(index);
    const ans = answers[questions[index]?.id];
    setSelectedOption(Array.isArray(ans) ? null : (ans ?? null));
    setShowNavigator(false);
  }

  function selectOption(index: number) {
    if (!question) return;
    const existing = answers[question.id];
    if (question.selectMultiple) {
      const selected = Array.isArray(existing) ? existing : existing === undefined ? [] : [existing];
      const next = selected.includes(index) ? selected.filter((item) => item !== index) : [...selected, index].sort((a, b) => a - b);
      setAnswers((prev) => ({ ...prev, [question.id]: next.length > 0 ? next : undefined }));
      return;
    }
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
        <Badge variant="dark">Moteur professionnel</Badge>
        <h2 className="mt-4 text-2xl font-bold text-ink">{quiz.title}</h2>
        <p className="mt-3 text-ink-secondary">{quiz.description}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-surface px-4 py-3 text-sm">
            <span className="text-ink-tertiary">Simulation · </span>
            <span className="font-semibold text-ink">
              {incompletePool
                ? `${effectiveSimulationCount} disponibles / cible ${simulationTargetCount}`
                : `${simulationTargetCount} questions`}
            </span>
          </div>
          <div className="rounded-2xl bg-surface px-4 py-3 text-sm">
            <span className="text-ink-tertiary">Entraînement · </span>
            <span className="font-semibold text-ink">
              {effectiveTrainingCount} questions
            </span>
          </div>
          <div className="rounded-2xl bg-surface px-4 py-3 text-sm">
            <span className="text-ink-tertiary">Seuil · </span>
            <span className="font-semibold text-ink">{quiz.passingScore}%</span>
          </div>
          <div className="rounded-2xl bg-surface px-4 py-3 text-sm">
            <span className="text-ink-tertiary">Timer simulation · </span>
            <span className="font-semibold text-ink">{getExamDurationMinutes(routeSlug, quiz.durationMinutes ?? 120)} min</span>
          </div>
        </div>
        {incompletePool && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Banque de questions incomplète ({uniqueBaseCount} / {questionCount}) — l&apos;examen utilisera les questions disponibles.
          </div>
        )}
        <ul className="mt-6 space-y-2 text-sm text-ink-secondary">
          <li>Mode entraînement : correction immédiate, explications visibles, pause autorisée.</li>
          <li>
            {examFormat?.verificationStatus === "official-verified"
              ? "Simulation basée sur les informations officielles actuellement publiées."
              : "Simulation interne — format officiel non entièrement confirmé."}
          </li>
          <li>Mode simulation : chronomètre obligatoire, correction uniquement à la fin.</li>
          <li>Sélection équilibrée par domaines, sans répétition volontaire.</li>
          <li>Reprise locale si vous quittez la page pendant une simulation.</li>
        </ul>
        {savedSession && (
          <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/5 p-4">
            <p className="text-sm font-semibold text-accent">Une tentative est en cours</p>
            <p className="mt-1 text-xs text-ink-secondary">
              Question {savedSession.currentIndex + 1}/{savedSession.questions.length} ·{" "}
              {savedSession.expiresAt ? `expire ${new Date(savedSession.expiresAt).toLocaleTimeString("fr-FR")}` : `${formatDuration(savedSession.secondsLeft)} restantes`}
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
        <ExamHistoryPanel routeSlug={routeSlug} isAuthenticated={isAuthenticated} />
        {!isAuthenticated && (
          <p className="mt-4 text-sm text-ink-secondary">
            <Link href={`/auth/login?redirect=${loginRedirect}`} className="font-semibold text-accent hover:underline">
              Connectez-vous
            </Link>{" "}
            pour enregistrer votre score et obtenir un certificat PDF.
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={() => startExam("training")} aria-label={`Démarrer l'entraînement ${quiz.title}`}>
            Mode entraînement
          </Button>
          {incompletePool ? (
            <>
              <span
                role="button"
                tabIndex={0}
                aria-disabled="true"
                aria-describedby="exam-simulation-blocked-reason"
                title={
                  simulationBlockedReason ||
                  poolWarning ||
                  "Simulation complète indisponible — banque insuffisante."
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") event.preventDefault();
                }}
                className="inline-flex min-h-11 cursor-not-allowed items-center justify-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-ink-tertiary focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
                data-testid="exam-simulation-blocked"
              >
                Simulation complète indisponible
              </span>
              <p
                id="exam-simulation-blocked-reason"
                className="basis-full text-sm text-ink-secondary"
                data-testid="exam-simulation-blocked-reason"
              >
                {simulationBlockedReason ||
                  poolWarning ||
                  `La banque contient actuellement ${uniqueBaseCount} questions uniques sur les ${simulationTargetCount} requises.`}
              </p>
            </>
          ) : (
            <a
              href={`/examens/${routeSlug}/start`}
              onClick={() => clearExamSession(routeSlug, quiz.slug)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-white px-6 py-3 text-sm font-semibold text-ink transition-all duration-200 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
              data-testid="exam-simulation-start"
            >
              Mode simulation
            </a>
          )}
          <Link
            href={isAuthenticated ? "/dashboard/transcript" : `/auth/login?redirect=${loginRedirect}`}
            className="inline-flex min-h-11 items-center rounded-full border border-border-light px-5 py-2.5 text-sm font-semibold text-ink-secondary hover:text-ink"
          >
            {isAuthenticated ? "Voir mon transcript" : "Connexion pour le transcript"}
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
  const currentAnswer = answers[question.id];
  const currentAnswered = currentAnswer !== undefined;
  const revealExplanation = activeMode === "training" && currentAnswered;

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

      <div className="mb-4 rounded-2xl border border-border-light bg-surface px-4 py-3 text-xs font-medium text-ink-secondary">
        {examFormat?.verificationStatus === "official-verified"
          ? "Simulation basée sur les informations officielles actuellement publiées."
          : "Simulation interne — format officiel non entièrement confirmé."}
        {poolWarning ? <span className="ml-1 text-amber-700">{poolWarning}</span> : null}
      </div>

      {totalSeconds > 0 && (
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
      )}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-medium text-ink-tertiary">
          Question {currentIndex + 1} / {total} · {answeredCount} répondues · {unansweredCount} non répondues
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <ExamTimer
            mode={activeMode}
            secondsLeft={secondsLeft}
            totalSeconds={totalSeconds}
            paused={timerPaused}
            onPause={() => setTimerPaused(true)}
            onResume={() => setTimerPaused(false)}
          />
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
        {question.options.map((option, index) => {
          const selected = Array.isArray(currentAnswer) ? currentAnswer.includes(index) : selectedOption === index || currentAnswer === index;
          const locked = false;
          const correct = question.selectMultiple && question.correctIndices
            ? question.correctIndices.includes(index)
            : question.correctIndex === index;
          return (
            <button
              key={option}
              type="button"
              onClick={() => selectOption(index)}
              disabled={locked && !selected}
              aria-pressed={selected}
              className={`w-full rounded-2xl border p-4 text-left text-sm font-medium text-ink transition-all ${
                revealExplanation && correct
                  ? "border-green-300 bg-green-50"
                  : revealExplanation && selected && !correct
                    ? "border-red-300 bg-red-50"
                    : selected
                      ? "border-accent bg-accent/5 ring-2 ring-accent/20"
                      : "border-border-light bg-surface hover:border-accent/40"
              } ${locked && !selected ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-border-light text-xs font-bold">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {revealExplanation && (
        <div className="mt-4 rounded-2xl border border-border-light bg-surface px-4 py-3 text-sm text-ink-secondary">
          <p className="font-semibold text-ink">
            {isAnswerCorrect(question, currentAnswer) ? "Bonne réponse" : "À revoir"}
          </p>
          <p className="mt-1">{question.explanation}</p>
        </div>
      )}

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
