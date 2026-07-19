"use client";

import Link from "next/link";
import type { Quiz, Question } from "@/lib/types";
import { Button } from "@/components/ui";
import { getBadgeById } from "@/lib/badges-config";
import { formatDuration } from "@/lib/data/exams/exam-utils";
import type { ScoreTier } from "@/components/exams/score-tiers";
import { isAnswerCorrect, type UserAnswer } from "@/lib/quiz/scoring";
import { buildExamFinalReport } from "@/lib/exams/report";

type Answers = Record<string, UserAnswer>;

export function ExamResultView({
  quiz,
  routeSlug,
  questions,
  answers,
  percent,
  correct,
  total,
  passed,
  elapsedSeconds,
  tier,
  saveStatus,
  newBadgeIds,
  certUrl,
  onRetake,
}: {
  quiz: Quiz;
  routeSlug: string;
  questions: Question[];
  answers: Answers;
  percent: number;
  correct: number;
  total: number;
  passed: boolean;
  elapsedSeconds: number;
  tier: ScoreTier;
  saveStatus: "idle" | "saving" | "saved" | "error";
  newBadgeIds: string[];
  certUrl: string;
  onRetake?: () => void;
}) {
  const wrongCount = total - correct;
  const report = buildExamFinalReport({
    questions,
    answers,
    passingScore: quiz.passingScore,
    elapsedSeconds,
  });
  const recommendedModules = questions
    .filter((q) => !isAnswerCorrect(q, answers[q.id]))
    .map((q) => ({ href: q.moduleHref, label: q.moduleLabel ?? "Revoir le module" }))
    .filter((m): m is { href: string; label: string } => !!m.href)
    .filter((m, i, arr) => arr.findIndex((x) => x.href === m.href) === i)
    .slice(0, 6);

  return (
    <div className="rounded-3xl border border-border-light bg-surface-elevated p-8 shadow-sm">
      <div
        className={`mx-auto flex h-28 w-28 flex-col items-center justify-center rounded-full ${passed ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
      >
        <span className="text-3xl font-bold">{percent}%</span>
        <span className="text-xs">{formatDuration(elapsedSeconds)}</span>
      </div>
      <div className="mt-4 flex justify-center">
        <span className={`rounded-full px-4 py-1.5 text-sm font-semibold ${tier.className}`}>{tier.label}</span>
      </div>
      <h2 className="mt-6 text-center text-2xl font-bold text-ink">
        {passed ? "Examen réussi !" : "Examen non validé"}
      </h2>
      <p className="mt-2 text-center text-ink-secondary">
        {correct} bonnes · {wrongCount} incorrectes · Seuil {quiz.passingScore}%
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-surface px-4 py-3 text-center text-sm">
          <p className="text-ink-tertiary">Score</p>
          <p className="font-bold text-ink">{percent}%</p>
        </div>
        <div className="rounded-2xl bg-surface px-4 py-3 text-center text-sm">
          <p className="text-ink-tertiary">Temps utilisé</p>
          <p className="font-bold text-ink">{formatDuration(elapsedSeconds)}</p>
        </div>
        <div className="rounded-2xl bg-surface px-4 py-3 text-center text-sm">
          <p className="text-ink-tertiary">Questions</p>
          <p className="font-bold text-ink">{correct}/{total}</p>
        </div>
      </div>

      {(report.strongDomains.length > 0 || report.weakDomains.length > 0) && (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-surface px-4 py-4">
            <h3 className="font-bold text-ink">Domaines forts</h3>
            {report.strongDomains.length > 0 ? (
              <ul className="mt-3 space-y-2 text-sm text-ink-secondary">
                {report.strongDomains.map((domain) => (
                  <li key={domain.domain} className="flex justify-between gap-3">
                    <span>{domain.domain}</span>
                    <span className="font-semibold text-ink">{domain.percent}%</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-ink-tertiary">Aucun domaine au-dessus de 80 % pour cette tentative.</p>
            )}
          </div>
          <div className="rounded-2xl bg-surface px-4 py-4">
            <h3 className="font-bold text-ink">Domaines à renforcer</h3>
            {report.weakDomains.length > 0 ? (
              <ul className="mt-3 space-y-2 text-sm text-ink-secondary">
                {report.weakDomains.map((domain) => (
                  <li key={domain.domain} className="flex justify-between gap-3">
                    <span>{domain.domain}</span>
                    <span className="font-semibold text-ink">{domain.percent}%</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-ink-tertiary">Aucun domaine faible détecté.</p>
            )}
          </div>
        </div>
      )}

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

      {(report.recommendations.length > 0 || recommendedModules.length > 0) && (
        <div className="mt-8">
          <h3 className="font-bold text-ink">Modules recommandés</h3>
          <ul className="mt-3 space-y-2">
            {(report.recommendations.length > 0 ? report.recommendations : recommendedModules).map((m) => (
              <li key={m.href}>
                <Link href={m.href} className="text-sm font-semibold text-accent hover:underline">
                  → {m.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 space-y-4">
        <h3 className="font-bold text-ink">Correction détaillée</h3>
        {questions.map((q, i) => {
          const userAnswer = answers[q.id];
          const ok = isAnswerCorrect(q, userAnswer);
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
              className={`rounded-2xl border p-4 ${ok ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
            >
              <p className="text-sm font-semibold text-ink">
                {i + 1}. {q.text}
              </p>
              <p className="mt-2 text-sm text-ink-secondary">Votre réponse : {formatAnswer(userAnswer)}</p>
              {!ok && (
                <p className="mt-1 text-sm font-medium text-green-700">Bonne réponse : {correctLabel}</p>
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
        {onRetake ? (
          <Button onClick={onRetake}>Repasser l&apos;examen</Button>
        ) : (
          <Link
            href={`/examens/${routeSlug}/start`}
            className="inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white"
          >
            Repasser l&apos;examen
          </Link>
        )}
        {!passed && (
          <Link
            href={`/revision/${quiz.slug}`}
            className="inline-flex items-center gap-2 rounded-full border border-accent px-6 py-3 text-sm font-semibold text-accent hover:bg-accent/5"
          >
            🧠 Réviser avec SM-2
          </Link>
        )}
        {quiz.slug === "examen-apple-it-pro" && (
          <Link href="/examens/preparation-report" className="inline-flex items-center rounded-full border border-accent px-6 py-3 text-sm font-semibold text-accent hover:bg-accent/5">
            Rapport de préparation
          </Link>
        )}
        <Link href="/dashboard/transcript" className="inline-flex items-center rounded-full border border-border-light px-6 py-3 text-sm font-semibold text-ink-secondary hover:text-ink">
          Transcript
        </Link>
        <Link href="/dashboard" className="inline-flex items-center rounded-full border border-border-light px-6 py-3 text-sm font-semibold text-ink-secondary hover:text-ink">
          Dashboard
        </Link>
        <Link href="/examens" className="inline-flex items-center rounded-full border border-border-light px-6 py-3 text-sm font-semibold text-ink-secondary hover:text-ink">
          Tous les examens
        </Link>
      </div>
    </div>
  );
}
