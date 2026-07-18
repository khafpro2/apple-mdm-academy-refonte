"use client";

import { Button } from "@/components/ui";
import { formatDuration } from "@/lib/data/exams/exam-utils";
import type { ExamMode } from "@/lib/exams/exam-types";

export function ExamTimer({
  mode,
  secondsLeft,
  totalSeconds,
  paused,
  onPause,
  onResume,
}: {
  mode: ExamMode;
  secondsLeft: number;
  totalSeconds: number;
  paused: boolean;
  onPause: () => void;
  onResume: () => void;
}) {
  if (totalSeconds <= 0) {
    return (
      <div className="rounded-full bg-surface px-4 py-1.5 text-sm font-bold text-ink" aria-live="polite">
        Sans chrono
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className={`rounded-full px-4 py-1.5 text-sm font-bold tabular-nums ${
          secondsLeft <= 60
            ? "animate-pulse bg-red-100 text-red-700"
            : secondsLeft <= 600
              ? "bg-amber-100 text-amber-800"
              : "bg-surface text-ink"
        }`}
        aria-live={secondsLeft <= 60 ? "assertive" : "polite"}
      >
        {formatDuration(secondsLeft)}
      </div>
      {mode === "training" && (
        <Button type="button" variant="secondary" size="sm" onClick={paused ? onResume : onPause}>
          {paused ? "Reprendre" : "Pause"}
        </Button>
      )}
    </div>
  );
}
