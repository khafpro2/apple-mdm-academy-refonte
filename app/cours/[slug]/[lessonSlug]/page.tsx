import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout";
import { Breadcrumb, Badge } from "@/components/ui";
import { LessonContentView, LessonTableOfContents } from "@/components/course/lesson-content-view";
import {
  CourseMetaGrid,
  CourseProgressBar,
  LessonNavigation,
  LessonStatusBadge,
} from "@/components/course/course-ui";
import {
  getFlatLessons,
  getCourseProgressPercent,
  getLessonStatus,
  getLessonPoints,
  getTotalPoints,
} from "@/lib/course/helpers";
import { LabLessonLink } from "@/components/labs/lab-lesson-link";
import { LessonVideoCallout } from "@/components/video/lesson-video-callout";
import { getLabSlugForLesson } from "@/lib/labs/mapping";
import { getCustomLesson } from "@/lib/data/lessons/custom-lessons";
import { getLessonContent } from "@/lib/data/lesson-content";
import { getLesson, courses, getTrack } from "@/lib/data";
import { getVideoScriptForLesson } from "@/src/lib/video-scripts";
import { SubscriptionGate } from "@/components/subscription/subscription-gate";
import { getRequiredTierForCourse } from "@/lib/pricing/access-control";

export function generateStaticParams() {
  const params: { slug: string; lessonSlug: string }[] = [];
  courses.forEach((course) => {
    course.modules.forEach((mod) => {
      mod.lessons.forEach((lesson) => {
        params.push({ slug: course.slug, lessonSlug: lesson.slug });
      });
    });
  });
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const { slug, lessonSlug } = await params;
  const data = getLesson(slug, lessonSlug);
  return { title: data?.lesson.title ?? "Leçon" };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const { slug, lessonSlug } = await params;
  const data = getLesson(slug, lessonSlug);
  if (!data) notFound();

  const { course, module, lesson } = data;
  const custom = getCustomLesson(slug, lessonSlug);
  const track = getTrack(course.trackSlug);
  const flatLessons = getFlatLessons(course);
  const totalLessons = flatLessons.length;
  const currentFlat = flatLessons.find((f) => f.lesson.slug === lessonSlug);
  const globalIndex = currentFlat?.globalIndex ?? 0;
  const progressPercent = getCourseProgressPercent(globalIndex, totalLessons);
  const status = getLessonStatus(globalIndex, globalIndex);
  const points = getLessonPoints(lesson, globalIndex);

  const content = getLessonContent(course, module, lesson, globalIndex, totalLessons);
  const quizHref = content.finalQuizSlug ? `/quiz/${content.finalQuizSlug}` : undefined;

  const prev = flatLessons[globalIndex - 1]?.lesson;
  const next = flatLessons[globalIndex + 1]?.lesson;
  const isLastLesson = globalIndex === totalLessons - 1;

  const CustomLesson = custom?.Lesson;
  const CustomToc = custom?.TableOfContents;
  const meta = custom?.meta;
  const labSlug = getLabSlugForLesson(lessonSlug);
  const video = getVideoScriptForLesson(lessonSlug);
  const requiredTier = getRequiredTierForCourse(course.slug);

  return (
    <PageShell>
      <SubscriptionGate requiredTier={requiredTier} featureLabel={`leçon ${lesson.title}`}>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Breadcrumb
          items={[
            { label: "Parcours", href: "/parcours" },
            { label: course.title, href: `/cours/${course.slug}` },
            { label: lesson.title },
          ]}
        />

        <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="mb-8 lg:sticky lg:top-28 lg:mb-0 lg:self-start">
            {CustomToc ? <CustomToc /> : <LessonTableOfContents showComparison={course.trackSlug === "mdm-comparatif-apple"} />}
          </aside>

          <div>
            {CustomToc ? <CustomToc mobile /> : <LessonTableOfContents mobile showComparison={course.trackSlug === "mdm-comparatif-apple"} />}

            <header className="overflow-hidden rounded-[2rem] border border-border-light bg-surface-elevated shadow-sm">
              <div className="bg-gradient-to-br from-surface via-surface-elevated to-indigo-50/40 px-6 py-8 md:px-10 md:py-10">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="accent">{module.title}</Badge>
                  <LessonStatusBadge status={status} />
                  {meta?.badges?.map((badge) => (
                    <Badge key={badge.label} className={badge.className}>
                      {badge.label}
                    </Badge>
                  ))}
                  <span className="text-sm text-ink-tertiary">
                    Leçon {globalIndex + 1} sur {totalLessons}
                  </span>
                </div>

                <h1 className="mt-5 text-3xl font-bold tracking-tight text-ink md:text-4xl lg:text-5xl">
                  {lesson.title}
                </h1>

                {meta?.subtitle && (
                  <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-secondary md:text-lg">
                    {meta.subtitle}
                  </p>
                )}

                <div className="mt-8">
                  <CourseProgressBar percent={progressPercent} label="Progression du parcours" />
                </div>

                <div className="mt-8">
                  <CourseMetaGrid
                    duration={meta?.duration ?? lesson.duration}
                    level={meta?.level ?? track?.level ?? "Intermédiaire"}
                    certification={track?.certification ?? course.title}
                    points={meta?.points ?? points}
                  />
                </div>

                {meta?.certifications && meta.certifications.length > 0 && (
                  <div className="mt-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">
                      Certifications visées
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {meta.certifications.map((cert) => (
                        <span
                          key={cert}
                          className="rounded-full border border-border-light bg-white/80 px-3 py-1 text-xs font-medium text-ink-secondary shadow-sm"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </header>

            {video && <LessonVideoCallout video={video} />}

            <article className="mt-10 rounded-[2rem] border border-border-light bg-surface-elevated p-6 shadow-sm md:p-10">
              {CustomLesson ? (
                <CustomLesson />
              ) : (
                <LessonContentView
                  content={content}
                  lessonTitle={lesson.title}
                  quizHref={quizHref}
                />
              )}
            </article>

            {labSlug && (
              <div className="mt-6">
                <LabLessonLink labSlug={labSlug} />
              </div>
            )}

            <LessonNavigation
              courseSlug={course.slug}
              prev={prev ? { slug: prev.slug, title: prev.title } : undefined}
              next={next ? { slug: next.slug, title: next.title } : undefined}
              finalQuizHref={custom ? undefined : quizHref}
              isLastLesson={isLastLesson}
            />
          </div>
        </div>
      </div>
      </SubscriptionGate>
    </PageShell>
  );
}
