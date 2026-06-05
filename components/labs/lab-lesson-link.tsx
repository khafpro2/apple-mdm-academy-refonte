"use client";

import Link from "next/link";
import { useLabProgressSummary } from "@/lib/labs/use-lab-progress";
import { STATUS_LABELS, STATUS_STYLES } from "@/lib/labs/badges";
import { labs } from "@/lib/labs";

type LabLessonLinkProps = {
  labSlug: string;
  compact?: boolean;
};

export function LabLessonLink({ labSlug, compact = false }: LabLessonLinkProps) {
  const lab = labs.find((l) => l.slug === labSlug);
  const totalSteps = lab?.steps.length ?? 0;
  const { status, percent } = useLabProgressSummary(labSlug, totalSteps);

  if (!lab) return null;

  if (compact) {
    return (
      <Link
        href={`/labs/${labSlug}`}
        className="mt-2 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1.5 text-xs font-semibold text-accent transition hover:bg-accent/10"
      >
        🧪 Lab pratique
        <span className={`rounded-full px-2 py-0.5 text-[10px] ${STATUS_STYLES[status]}`}>
          {STATUS_LABELS[status]}
        </span>
      </Link>
    );
  }

  return (
    <div className="mt-3 rounded-2xl border border-border-light bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">
          Lab pratique
        </p>
        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[status]}`}>
          {STATUS_LABELS[status]}
          {status !== "not_started" && ` · ${percent}%`}
        </span>
      </div>
      <p className="mt-2 text-sm font-medium text-ink">{lab.title}</p>
      <Link
        href={`/labs/${labSlug}`}
        className="mt-3 inline-flex rounded-full bg-accent px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
      >
        Faire le lab pratique →
      </Link>
    </div>
  );
}
