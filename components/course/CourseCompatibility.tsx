import type { Course } from "@/lib/types";
import { PlatformVersionBadge } from "@/components/course/PlatformVersionBadge";

type Props = {
  course: Course;
};

export function CourseCompatibility({ course }: Props) {
  if (!course.platforms?.length && !course.primaryVersion && !course.versionStatus) {
    return null;
  }

  return (
    <section
      className="mt-6 rounded-2xl border border-border-light bg-surface px-5 py-4"
      aria-labelledby="course-compatibility-heading"
    >
      <h2 id="course-compatibility-heading" className="text-sm font-semibold text-ink">
        Compatibilité plateforme
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {(course.platforms ?? []).map((platform) => (
          <PlatformVersionBadge
            key={platform}
            platform={platform}
            version={course.primaryVersion}
            status={course.versionStatus}
          />
        ))}
      </div>
      <dl className="mt-3 grid gap-2 text-sm text-ink-secondary sm:grid-cols-2">
        {course.minimumVersion && (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">Minimum documenté</dt>
            <dd className="mt-0.5">À partir de la version {course.minimumVersion}</dd>
          </div>
        )}
        {course.supportedVersions && course.supportedVersions.length > 0 && (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">Versions couvertes</dt>
            <dd className="mt-0.5">{course.supportedVersions.join(" · ")}</dd>
          </div>
        )}
        {course.lastVerifiedAt && (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">Dernière vérification</dt>
            <dd className="mt-0.5">
              <time dateTime={course.lastVerifiedAt}>
                {new Date(course.lastVerifiedAt + "T12:00:00").toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
}
