"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { Quiz } from "@/lib/types";
import { loadExamResult } from "@/lib/exam/exam-result-storage";
import { getScoreTier } from "@/lib/exam/exam-config";
import { ExamResultView } from "@/components/exams/exam-result-view";

export function ExamResultPageClient({
  routeSlug,
  quiz,
}: {
  routeSlug: string;
  quiz: Quiz;
}) {
  // Rendu initial null (identique côté serveur) pour éviter le mismatch d'hydratation.
  // Le résultat est chargé depuis sessionStorage uniquement après le montage côté client.
  const [result, setResult] = useState<ReturnType<typeof loadExamResult>>(null);

  useEffect(() => {
    setResult(loadExamResult(routeSlug));
  }, [routeSlug]);

  if (!result) {
    return (
      <div className="rounded-3xl border border-border-light bg-surface-elevated p-8 text-center shadow-sm">
        <p className="font-semibold text-ink">Aucun résultat récent</p>
        <p className="mt-2 text-sm text-ink-secondary">
          Terminez un examen pour afficher vos résultats ici.
        </p>
        <Link
          href={`/examens/${routeSlug}`}
          className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white"
        >
          Commencer l&apos;examen
        </Link>
      </div>
    );
  }

  const tier = getScoreTier(result.percent);

  return (
    <ExamResultView
      quiz={quiz}
      routeSlug={routeSlug}
      questions={result.questions}
      answers={result.answers}
      percent={result.percent}
      correct={result.correct}
      total={result.total}
      passed={result.passed}
      elapsedSeconds={result.elapsedSeconds}
      tier={tier}
      saveStatus={result.resultId ? "saved" : "idle"}
      newBadgeIds={[]}
      certUrl={
        result.resultId
          ? `/api/certificates/${quiz.slug}?resultId=${result.resultId}`
          : `/api/certificates/${quiz.slug}`
      }
    />
  );
}
