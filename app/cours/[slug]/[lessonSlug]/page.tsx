import { notFound } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/layout";
import { Breadcrumb, Badge, ButtonLink } from "@/components/ui";
import { getLesson, courses, getQuizzesByTrack } from "@/lib/data";

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
  const trackQuizzes = getQuizzesByTrack(course.trackSlug);
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const currentIndex = allLessons.findIndex((l) => l.slug === lessonSlug);
  const prev = allLessons[currentIndex - 1];
  const next = allLessons[currentIndex + 1];

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
        <Breadcrumb
          items={[
            { label: "Parcours", href: "/parcours" },
            { label: course.title, href: `/cours/${course.slug}` },
            { label: lesson.title },
          ]}
        />

        <article className="rounded-3xl border border-border-light bg-surface-elevated p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <Badge variant="accent">{module.title}</Badge>
            <span className="text-sm text-ink-tertiary">{lesson.duration}</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-ink">{lesson.title}</h1>

          <div className="prose mt-8 max-w-none">
            <p className="text-lg leading-relaxed text-ink-secondary">
              Contenu de la leçon à venir — cette page est prête pour l&apos;intégration Supabase et un éditeur de
              contenu riche (MDX, vidéos, captures d&apos;écran).
            </p>

            <div className="mt-8 rounded-2xl bg-surface p-6">
              <h2 className="text-lg font-bold text-ink">Points clés</h2>
              <ul className="mt-4 space-y-2 text-ink-secondary">
                <li>• Concepts fondamentaux de {lesson.title.toLowerCase()}</li>
                <li>• Bonnes pratiques en environnement entreprise</li>
                <li>• Cas pratiques et dépannage courant</li>
                <li>• Quiz de validation en fin de leçon</li>
              </ul>
            </div>

            <div className="mt-8 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-ink-tertiary">
              Vidéo / contenu interactif — placeholder
            </div>
          </div>
        </article>

        <div className="mt-8 flex items-center justify-between gap-4">
          {prev ? (
            <Link
              href={`/cours/${course.slug}/${prev.slug}`}
              className="text-sm font-semibold text-accent hover:underline"
            >
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <ButtonLink href={`/cours/${course.slug}/${next.slug}`}>
              Leçon suivante →
            </ButtonLink>
          ) : (
            trackQuizzes[0] ? (
              <ButtonLink href={`/quiz/${trackQuizzes[0].slug}`}>Quiz final</ButtonLink>
            ) : null
          )}
        </div>
      </div>
    </PageShell>
  );
}
