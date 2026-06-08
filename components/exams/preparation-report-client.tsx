"use client";

import Link from "next/link";
import { Breadcrumb, Card, ProgressBar, Badge } from "@/components/ui";
import {
  buildPreparationReport,
  type PreparationReport,
} from "@/lib/data/acitp/preparation-report";
import { ACITP_EXAM_REPORT_STORAGE_KEY } from "@/lib/data/acitp/exam-report-storage";
import type { Question } from "@/lib/types";
import type { UserAnswer } from "@/lib/quiz/scoring";
import { useSyncExternalStore } from "react";

type StoredReport = {
  questions: Question[];
  answers: Record<string, UserAnswer>;
  completedAt: string;
};

const EMPTY_STORED_REPORT = { report: null, completedAt: null };
let cachedRaw: string | null = null;
let cachedStoredReport: { report: PreparationReport | null; completedAt: string | null } = EMPTY_STORED_REPORT;

function loadStoredReport(): { report: PreparationReport | null; completedAt: string | null } {
  if (typeof sessionStorage === "undefined") return EMPTY_STORED_REPORT;
  try {
    const raw = sessionStorage.getItem(ACITP_EXAM_REPORT_STORAGE_KEY);
    if (raw === cachedRaw) return cachedStoredReport;

    cachedRaw = raw;
    if (!raw) {
      cachedStoredReport = EMPTY_STORED_REPORT;
      return cachedStoredReport;
    }
    const data = JSON.parse(raw) as StoredReport;
    cachedStoredReport = {
      report: buildPreparationReport(data.questions, data.answers),
      completedAt: data.completedAt,
    };
    return cachedStoredReport;
  } catch {
    cachedRaw = null;
    cachedStoredReport = EMPTY_STORED_REPORT;
    return EMPTY_STORED_REPORT;
  }
}

export function PreparationReportClient() {
  const stored = useSyncExternalStore(
    () => () => {},
    loadStoredReport,
    loadStoredReport
  );
  const { report, completedAt } = stored;

  if (!report) {
    return (
      <Card className="mt-8 p-6">
        <p className="text-sm text-ink-secondary">
          Aucun examen récent. Passez l&apos;examen blanc pour générer votre rapport.
        </p>
        <Link
          href="/examens/apple-it-professional"
          className="mt-4 inline-block text-sm font-semibold text-accent hover:underline"
        >
          Passer l&apos;examen blanc →
        </Link>
      </Card>
    );
  }

  return (
    <>
      <Card className="mt-8 p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-ink-tertiary">Score global</p>
            <p className="text-4xl font-bold text-accent">{report.overallScore} %</p>
          </div>
          <Badge variant={report.passed ? "dark" : "default"}>
            {report.passed ? "Seuil atteint" : "À renforcer"}
          </Badge>
        </div>
        {completedAt && (
          <p className="mt-2 text-xs text-ink-tertiary">
            Dernier examen : {new Date(completedAt).toLocaleString("fr-FR")}
          </p>
        )}
        <ProgressBar value={report.overallScore} className="mt-4" />
      </Card>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-bold text-ink">Forces</h2>
          {report.strengths.length === 0 ? (
            <p className="mt-2 text-sm text-ink-tertiary">Continuez à vous entraîner.</p>
          ) : (
            <ul className="mt-3 space-y-1 text-sm text-green-800">
              {report.strengths.map((s) => (
                <li key={s}>✓ {s}</li>
              ))}
            </ul>
          )}
        </Card>
        <Card className="p-6">
          <h2 className="font-bold text-ink">Faiblesses</h2>
          {report.weaknesses.length === 0 ? (
            <p className="mt-2 text-sm text-ink-tertiary">Aucun domaine critique.</p>
          ) : (
            <ul className="mt-3 space-y-1 text-sm text-amber-800">
              {report.weaknesses.map((w) => (
                <li key={w}>⚠ {w}</li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-ink">Scores par domaine</h2>
        <div className="mt-4 space-y-3">
          {report.domainScores
            .filter((d) => d.total > 0)
            .map((d) => (
              <div key={d.domain}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{d.label}</span>
                  <span>
                    {d.correct}/{d.total} ({d.percent} %)
                  </span>
                </div>
                <ProgressBar value={d.percent} />
              </div>
            ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 sm:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-bold text-ink">Modules recommandés</h2>
          <ul className="mt-3 space-y-2">
            {report.recommendedModules.map((m) => (
              <li key={m.href}>
                <Link href={m.href} className="text-sm font-semibold text-accent hover:underline">
                  → {m.title}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-6">
          <h2 className="font-bold text-ink">Labs recommandés</h2>
          <ul className="mt-3 space-y-2">
            {report.recommendedLabs.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm font-semibold text-accent hover:underline">
                  → {l.title}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </>
  );
}
