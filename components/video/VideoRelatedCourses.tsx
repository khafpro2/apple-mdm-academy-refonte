import Link from "next/link";
import { MediaPlaceholder } from "@/components/video/placeholders/MediaPlaceholder";

type RelatedCourse = {
  slug: string;
  title: string;
  href: string;
  description?: string;
};

type VideoRelatedCoursesProps = {
  courses?: RelatedCourse[];
  className?: string;
};

export function VideoRelatedCourses({ courses = [], className = "" }: VideoRelatedCoursesProps) {
  if (courses.length === 0) {
    return (
      <section className={className} aria-labelledby="video-related-heading">
        <h2 id="video-related-heading" className="sr-only">
          Cours associés
        </h2>
        <MediaPlaceholder
          variant="generic"
          compact
          title="Cours associés à venir"
          description="Les parcours liés seront suggérés une fois le contenu publié."
        />
      </section>
    );
  }

  return (
    <section
      className={`rounded-2xl border border-border-light bg-surface-elevated p-5 ${className}`}
      aria-labelledby="video-related-heading"
    >
      <h2 id="video-related-heading" className="font-bold text-ink">
        Cours associés
      </h2>
      <ul className="mt-4 space-y-3">
        {courses.map((course) => (
          <li key={course.slug}>
            <Link
              href={course.href}
              className="block rounded-xl border border-border-light bg-surface p-4 transition hover:border-accent/30 hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <p className="font-semibold text-ink">{course.title}</p>
              {course.description && (
                <p className="mt-1 text-sm text-ink-secondary">{course.description}</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
