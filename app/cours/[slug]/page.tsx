import { notFound } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/layout";
import { Breadcrumb, Badge, ButtonLink } from "@/components/ui";
import { getCourse, courses, getTrack, getQuizzesByTrack } from "@/lib/data";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourse(slug);
  return { title: course?.title ?? "Cours" };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const track = getTrack(course.trackSlug);
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const trackQuizzes = getQuizzesByTrack(course.trackSlug);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <Breadcrumb
          items={[
            { label: "Parcours", href: "/parcours" },
            { label: track?.title ?? "Cours", href: `/parcours/${course.trackSlug}` },
            { label: course.title },
          ]}
        />

        <header className="rounded-3xl border border-border-light bg-surface-elevated p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            {track && <Badge>{track.level}</Badge>}
            <span className="text-sm text-ink-tertiary">{totalLessons} leçons · {course.duration}</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-ink md:text-4xl">{course.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-secondary">{course.description}</p>

          <div className="mt-6">
            <p className="text-sm font-semibold text-ink">Objectifs</p>
            <ul className="mt-2 space-y-1">
              {course.objectives.map((obj) => (
                <li key={obj} className="flex items-start gap-2 text-sm text-ink-secondary">
                  <span className="text-accent">✓</span> {obj}
                </li>
              ))}
            </ul>
          </div>
        </header>

        <div className="mt-10 space-y-6">
          {course.modules.map((mod, i) => (
            <section key={mod.title} className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
              <h2 className="text-lg font-bold text-ink">
                Module {i + 1} — {mod.title}
              </h2>
              <ul className="mt-4 space-y-2">
                {mod.lessons.map((lesson, j) => (
                  <li key={lesson.slug}>
                    <Link
                      href={`/cours/${course.slug}/${lesson.slug}`}
                      className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3 transition hover:bg-accent/5"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-border-light text-xs font-bold text-ink-secondary">
                        {j + 1}
                      </span>
                      <span className="flex-1 font-medium text-ink">{lesson.title}</span>
                      <span className="text-xs text-ink-tertiary">{lesson.duration}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {trackQuizzes[0] && (
            <ButtonLink href={`/quiz/${trackQuizzes[0].slug}`} variant="secondary">
              Quiz du parcours
            </ButtonLink>
          )}
          <ButtonLink href="/labs">Labs pratiques</ButtonLink>
        </div>
      </div>
    </PageShell>
  );
}
