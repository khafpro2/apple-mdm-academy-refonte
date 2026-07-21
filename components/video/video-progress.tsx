"use client";

import { ProgressBar } from "@/components/ui";

export function VideoProgress({
  value,
  label,
  syncing = false,
  completed = false,
  className = "",
}: {
  value: number;
  label?: string;
  syncing?: boolean;
  completed?: boolean;
  className?: string;
}) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div className={className} data-video-progress={clamped}>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        {label && <span className="text-ink-secondary">{label}</span>}
        {completed && (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
            Terminée
          </span>
        )}
        {syncing && <span className="text-xs text-ink-tertiary">Sync cloud…</span>}
        <span className="ml-auto font-medium text-accent">{clamped}%</span>
      </div>
      <ProgressBar value={clamped} className="mt-3" />
    </div>
  );
}
