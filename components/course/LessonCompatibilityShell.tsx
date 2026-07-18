import { CourseCompatibility } from "@/components/course/CourseCompatibility";
import { OfficialSources } from "@/components/course/OfficialSources";
import { VersionDifferenceCallout } from "@/components/course/VersionDifferenceCallout";
import type { Course } from "@/lib/types";
import type { ModularLessonMeta } from "@/lib/data/lessons/types";

type Props = {
  course: Course;
  lessonMeta?: ModularLessonMeta;
};

/**
 * Placement under the lesson title for future version / compatibility data.
 * Prefers lesson-level meta when present; falls back to course-level fields.
 * Never renders empty badges — child components return null without data.
 */
export function LessonCompatibilityShell({ course, lessonMeta }: Props) {
  // When a modular lesson provides meta, do not inherit unrelated course-level
  // versionDifferences (e.g. iPadOS notes on a macOS-only FileVault lesson).
  const platforms = lessonMeta ? lessonMeta.platforms : course.platforms;
  const primaryVersion = lessonMeta ? lessonMeta.primaryVersion : course.primaryVersion;
  const versionStatus = lessonMeta ? lessonMeta.versionStatus : course.versionStatus;
  const lastVerifiedAt = lessonMeta ? lessonMeta.lastVerifiedAt : course.lastVerifiedAt;
  const officialSources = lessonMeta ? lessonMeta.officialSources : course.officialSources;
  const versionDifferences = lessonMeta ? lessonMeta.versionDifferences : course.versionDifferences;

  const courseForBadge: Course = {
    ...course,
    platforms,
    primaryVersion,
    versionStatus,
    lastVerifiedAt,
    officialSources,
    versionDifferences,
  };

  const showEnrollment =
    Boolean(lessonMeta?.enrollmentTypes?.length) || lessonMeta?.requiresSupervision != null;

  return (
    <div className="mt-6 space-y-4">
      <CourseCompatibility course={courseForBadge} />

      {showEnrollment && (
        <section
          className="rounded-2xl border border-border-light bg-surface px-5 py-4"
          aria-labelledby="lesson-enrollment-heading"
        >
          <h2 id="lesson-enrollment-heading" className="text-sm font-semibold text-ink">
            Enrôlement et supervision
          </h2>
          <dl className="mt-3 grid gap-2 text-sm text-ink-secondary sm:grid-cols-2">
            {lessonMeta?.requiresSupervision != null && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">
                  Supervision requise
                </dt>
                <dd className="mt-0.5">{lessonMeta.requiresSupervision ? "Oui" : "Non"}</dd>
              </div>
            )}
            {lessonMeta?.enrollmentTypes && lessonMeta.enrollmentTypes.length > 0 && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">
                  Types d&apos;enrôlement
                </dt>
                <dd className="mt-0.5">{lessonMeta.enrollmentTypes.join(" · ")}</dd>
              </div>
            )}
          </dl>
        </section>
      )}

      <VersionDifferenceCallout differences={versionDifferences} />
      <OfficialSources sources={officialSources} />
    </div>
  );
}
