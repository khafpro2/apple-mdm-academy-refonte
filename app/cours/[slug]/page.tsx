import { notFound } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/layout";
import { Breadcrumb, Badge, ButtonLink } from "@/components/ui";
import {
  CourseMetaGrid,
  CourseProgressBar,
  LessonStatusBadge,
  LessonStatusIcon,
} from "@/components/course/course-ui";
import {
  getFlatLessons,
  getTotalPoints,
  getLessonStatus,
  getLessonPoints,
} from "@/lib/course/helpers";
import { LabLessonLink } from "@/components/labs/lab-lesson-link";
import { getCourse, courses, getTrack, getQuizzesByTrack } from "@/lib/data";
import { getLabsByTrack } from "@/lib/labs";
import { getLabSlugForLesson } from "@/lib/labs/mapping";
import { courseJsonLd } from "@/lib/seo/course-schema";
import { getPilotVideosForCourse } from "@/src/lib/course-pilot-videos";
import { getCourseEnrichedContent } from "@/src/lib/course-enriched-content";
import { resolveMp4Url } from "@/src/lib/video-production.server";
import { CourseVideoInProductionBlock } from "@/components/course/CourseVideoInProductionBlock";
import { CourseEnrichedSections } from "@/components/course/CourseEnrichedSections";
import { CourseLearningPath } from "@/components/course/CourseLearningPath";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return { title: "Cours" };
  return {
    title: course.title,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      type: "website",
    },
  };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const track = getTrack(course.trackSlug);
  const flatLessons = getFlatLessons(course);
  const totalLessons = flatLessons.length;
  const totalPoints = getTotalPoints(course);
  const progressPercent = 0;
  const trackQuizzes = getQuizzesByTrack(course.trackSlug);
  const trackLabs = getLabsByTrack(course.trackSlug);
  const pilotVideos = getPilotVideosForCourse(slug);
  const enriched = getCourseEnrichedContent(slug);

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd({ title: course.title, description: course.description, slug: course.slug, duration: course.duration })) }}
      />
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Breadcrumb
          items={[
            { label: "Parcours", href: "/parcours" },
            { label: track?.title ?? "Formation", href: `/parcours/${course.trackSlug}` },
            { label: course.title },
          ]}
        />

        <header className="overflow-hidden rounded-[2rem] border border-border-light bg-surface-elevated shadow-sm">
          <div className="bg-gradient-to-br from-surface via-surface-elevated to-blue-50/40 px-6 py-10 md:px-10 md:py-12">
            <div className="flex flex-wrap items-center gap-3">
              {track && <Badge variant="accent">{track.level}</Badge>}
              <Badge>{totalLessons} leçons</Badge>
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-ink md:text-5xl">
              {course.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-secondary">
              {course.description}
            </p>

            <div className="mt-8 max-w-xl">
              <CourseProgressBar percent={progressPercent} />
            </div>

            <div className="mt-8">
              <CourseMetaGrid
                duration={course.duration}
                level={track?.level ?? "Intermédiaire"}
                certification={track?.certification ?? course.title}
                points={totalPoints}
              />
            </div>
          </div>

          <div className="border-t border-border-light px-6 py-8 md:px-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-tertiary">
              Objectifs du cours
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {course.objectives.map((obj) => (
                <li
                  key={obj}
                  className="flex gap-2 rounded-2xl bg-surface px-4 py-3 text-sm leading-relaxed text-ink-secondary"
                >
                  <span className="shrink-0 font-bold text-accent" aria-hidden="true">
                    ✓
                  </span>
                  {obj}
                </li>
              ))}
            </ul>
          </div>
        </header>

        {enriched && <CourseEnrichedSections content={enriched} />}

        {pilotVideos.length > 0 && (
          <section className="mt-10 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-ink">Vidéos du parcours</h2>
              <p className="mt-1 text-sm text-ink-secondary">
                Les vidéos illustrées arrivent bientôt. Continuez avec le contenu textuel, les labs et les quiz.
              </p>
            </div>
            <div className="grid gap-6 xl:grid-cols-2">
              {pilotVideos.map((video) => (
                <div key={video.slug} className="space-y-4">
                  <CourseVideoInProductionBlock video={video} hasMp4={Boolean(resolveMp4Url(video.slug))} />
                  <CourseLearningPath video={video} hasMp4={Boolean(resolveMp4Url(video.slug))} />
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 space-y-8">
          {course.modules.map((mod, moduleIndex) => (
            <section
              key={mod.title}
              className="rounded-[2rem] border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8"
            >
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">
                    Module {moduleIndex + 1}
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-ink md:text-2xl">{mod.title}</h2>
                </div>
              </div>

              <ul className="mt-6 space-y-3">
                {mod.lessons.map((lesson, lessonIndex) => {
                  const flat = flatLessons.find(
                    (f) => f.moduleIndex === moduleIndex && f.lessonIndex === lessonIndex
                  );
                  const globalIndex = flat?.globalIndex ?? 0;
                  const status = globalIndex === 0 ? getLessonStatus(globalIndex, 0) : "en-cours";
                  const points = getLessonPoints(lesson, globalIndex);
                  const href = `/cours/${course.slug}/${lesson.slug}`;
                  const labSlug = getLabSlugForLesson(lesson.slug);

                  return (
                    <li key={lesson.slug}>
                      <div className="rounded-2xl border border-border-light bg-surface px-4 py-4 transition hover:border-accent/30 hover:shadow-md">
                        <Link href={href} className="group flex items-center gap-4">
                          <LessonStatusIcon status={status} />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-ink group-hover:text-accent">
                                {lesson.title}
                              </span>
                              <LessonStatusBadge status={status} />
                            </div>
                            <p className="mt-1 text-xs text-ink-tertiary">
                              {lesson.duration} · {points} points
                            </p>
                          </div>
                          <span className="hidden text-accent sm:inline" aria-hidden="true">
                            →
                          </span>
                        </Link>
                        {labSlug && <LabLessonLink labSlug={labSlug} compact />}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {flatLessons[0] && (
            <ButtonLink href={`/cours/${course.slug}/${flatLessons[0].lesson.slug}`}>
              Commencer la formation
            </ButtonLink>
          )}
          {trackQuizzes[0] && (
            <ButtonLink href={`/quiz/${trackQuizzes[0].slug}`} variant="secondary">
              Quiz du parcours
            </ButtonLink>
          )}
          {trackLabs[0] && (
            <ButtonLink href={`/labs/${trackLabs[0].slug}`} variant="secondary">
              Lab pratique du parcours
            </ButtonLink>
          )}
          <ButtonLink href="/labs" variant="secondary">
            Tous les labs
          </ButtonLink>
        </div>
      </div>
    </PageShell>
  );
}
