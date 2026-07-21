import Link from "next/link";
import type { CourseStoryboard } from "@/lib/visual-studio/types";
import { formatDurationLabel, totalDurationSeconds } from "@/lib/visual-studio/storyboard-generator";
import { visualStudioColors, visualStudioMeta } from "@/lib/visual-studio/visual-tokens";
import { VerificationBadge, VerificationNote } from "@/components/visual-studio/VerificationBadge";

type CourseVisualHeaderProps = {
  storyboard: CourseStoryboard;
};

export function CourseVisualHeader({ storyboard }: CourseVisualHeaderProps) {
  const duration = totalDurationSeconds(storyboard);

  return (
    <header className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide"
          style={{ borderColor: visualStudioColors.border, color: visualStudioColors.muted }}
        >
          {storyboard.moduleTitle}
        </span>
        <VerificationBadge status={storyboard.verificationStatus} />
        <span className="text-xs" style={{ color: visualStudioColors.muted }}>
          {storyboard.scenes.length} scènes · {formatDurationLabel(duration)}
        </span>
      </div>

      <div>
        <p className="text-sm font-medium" style={{ color: visualStudioColors.purple }}>
          {visualStudioMeta.name}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl" style={{ color: visualStudioColors.navy }}>
          {storyboard.courseTitle}
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div
          className="rounded-2xl border p-5"
          style={{ backgroundColor: visualStudioColors.surface, borderColor: visualStudioColors.border }}
        >
          <h2 className="text-xs font-semibold uppercase tracking-wide" style={{ color: visualStudioColors.muted }}>
            Objectif pédagogique
          </h2>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: visualStudioColors.text }}>
            {storyboard.learningObjective}
          </p>
        </div>
        <div
          className="rounded-2xl border p-5"
          style={{ backgroundColor: visualStudioColors.surface, borderColor: visualStudioColors.border }}
        >
          <h2 className="text-xs font-semibold uppercase tracking-wide" style={{ color: visualStudioColors.muted }}>
            Message central
          </h2>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: visualStudioColors.text }}>
            {storyboard.centralMessage}
          </p>
        </div>
      </div>

      <VerificationNote status={storyboard.verificationStatus} />

      <p className="text-xs" style={{ color: visualStudioColors.muted }}>
        {storyboard.disclaimer ?? visualStudioMeta.disclaimer}
      </p>

      <div className="flex flex-wrap gap-3">
        {storyboard.relatedCourseSlug ? (
          <Link
            href={`/cours/${storyboard.relatedCourseSlug}${storyboard.relatedLessonSlug ? `/${storyboard.relatedLessonSlug}` : ""}`}
            className="inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: visualStudioColors.blue, outlineColor: visualStudioColors.blue }}
          >
            Ouvrir le cours
          </Link>
        ) : null}
        <Link
          href={`/studio-visuel/${storyboard.courseId}?view=freeform`}
          className="inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            borderColor: visualStudioColors.border,
            color: visualStudioColors.text,
            outlineColor: visualStudioColors.blue,
          }}
        >
          Vue Freeform
        </Link>
        <Link
          href={`/studio-visuel/${storyboard.courseId}?view=print`}
          className="inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            borderColor: visualStudioColors.border,
            color: visualStudioColors.text,
            outlineColor: visualStudioColors.blue,
          }}
        >
          Version imprimable
        </Link>
      </div>
    </header>
  );
}
