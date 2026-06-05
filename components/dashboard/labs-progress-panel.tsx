"use client";

import Link from "next/link";
import { useMemo } from "react";
import { labs } from "@/lib/labs";
import { getLab } from "@/lib/labs";
import {
  getLastOpenedLab,
  summarizeLocalLabProgress,
} from "@/lib/labs/progress";
import { useLabProgressRecord } from "@/lib/labs/use-lab-progress";
import { STATUS_LABELS, STATUS_STYLES } from "@/lib/labs/badges";

type LabsProgressPanelProps = {
  completedLabSlugsFromDb?: string[];
};

function LabRow({ slug, dbCompleted }: { slug: string; dbCompleted: boolean }) {
  const lab = getLab(slug);
  const totalSteps = lab?.steps.length ?? 0;
  const progress = useLabProgressRecord(slug, totalSteps);

  if (!lab) return null;

  const localCompleted = progress?.completed ?? false;
  const completed = dbCompleted || localCompleted;
  const inProgress = (progress?.started && !completed) ?? false;
  const percent = progress?.percent ?? (completed ? 100 : 0);

  const status = completed ? "completed" : inProgress ? "in_progress" : "not_started";

  return (
    <li className="flex items-center justify-between gap-3 rounded-xl bg-surface px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink">{lab.title}</p>
        <p className="text-xs text-ink-tertiary">{lab.technology} · {lab.duration}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[status]}`}>
          {STATUS_LABELS[status]}
        </span>
        {status !== "not_started" && (
          <span className="text-xs font-bold tabular-nums text-accent">{percent}%</span>
        )}
        <Link href={`/labs/${slug}`} className="text-xs font-semibold text-accent hover:underline">
          Ouvrir
        </Link>
      </div>
    </li>
  );
}

export function LabsProgressPanel({ completedLabSlugsFromDb = [] }: LabsProgressPanelProps) {
  const dbSet = useMemo(() => new Set(completedLabSlugsFromDb), [completedLabSlugsFromDb]);
  const allSlugs = labs.map((l) => l.slug);
  const summary = summarizeLocalLabProgress(allSlugs);

  const mergedCompleted = allSlugs.filter(
    (s) => dbSet.has(s) || summarizeLocalLabProgress([s]).completedCount > 0
  ).length;

  const lastSlug = typeof window !== "undefined" ? getLastOpenedLab() : null;
  const lastLab = lastSlug ? getLab(lastSlug) : null;

  const inProgressLabs = labs.filter((l) => {
    if (dbSet.has(l.slug)) return false;
    const s = summarizeLocalLabProgress([l.slug]);
    return s.inProgressCount > 0;
  });

  const labBadges = ["first-lab", "lab-expert"];

  return (
    <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-ink">Labs pratiques</h2>
          <p className="mt-1 text-sm text-ink-secondary">
            {mergedCompleted} terminé{mergedCompleted > 1 ? "s" : ""} · {inProgressLabs.length} en cours ·{" "}
            {summary.practicePercent}% progression globale
          </p>
        </div>
        <Link href="/labs" className="text-sm font-semibold text-accent hover:underline">
          Catalogue labs →
        </Link>
      </div>

      {lastLab && (
        <div className="mt-4 rounded-2xl border border-accent/20 bg-accent/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">Dernier lab ouvert</p>
          <p className="mt-1 font-medium text-ink">{lastLab.title}</p>
          <Link href={`/labs/${lastLab.slug}`} className="mt-2 inline-block text-sm font-semibold text-accent hover:underline">
            Reprendre →
          </Link>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-ink-tertiary">En cours</h3>
          {inProgressLabs.length === 0 ? (
            <p className="mt-2 text-sm text-ink-secondary">Aucun lab en cours.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {inProgressLabs.slice(0, 4).map((l) => (
                <LabRow key={l.slug} slug={l.slug} dbCompleted={dbSet.has(l.slug)} />
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink-tertiary">Badges labs</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {labBadges.map((id) => (
              <span key={id} className="rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-ink-secondary">
                🧪 {id === "first-lab" ? "Premier lab" : "Lab Expert"}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-ink-tertiary">
            Terminez 1 lab pour « Premier lab », 6+ pour « Lab Expert ».
          </p>
        </div>
      </div>
    </section>
  );
}
