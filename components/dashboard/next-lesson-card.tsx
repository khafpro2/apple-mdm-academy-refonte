import Link from "next/link";
import { ButtonLink, Badge } from "@/components/ui";

interface NextLessonCardProps {
  courseTitle: string;
  lessonTitle: string;
  lessonSlug: string;
  courseSlug: string;
  progressPercent: number;
  estimatedMinutes?: number;
}

export function NextLessonCard({
  courseTitle,
  lessonTitle,
  lessonSlug,
  courseSlug,
  progressPercent,
  estimatedMinutes = 15,
}: NextLessonCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/5 to-transparent p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">▶️</span>
            <Badge variant="accent">Continuer</Badge>
          </div>
          <h3 className="mt-2 font-bold text-ink">{lessonTitle}</h3>
          <p className="mt-0.5 text-sm text-ink-secondary">{courseTitle}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-2xl font-bold text-ink">{progressPercent}%</p>
          <p className="text-xs text-ink-tertiary">complété</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-border-light">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progression: ${progressPercent}%`}
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-ink-tertiary">~{estimatedMinutes} min</p>
        <ButtonLink
          href={`/cours/${courseSlug}/${lessonSlug}`}
          size="sm"
          variant="primary"
        >
          Reprendre →
        </ButtonLink>
      </div>
    </div>
  );
}
