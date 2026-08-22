import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout";
import { Badge, Breadcrumb, ButtonLink } from "@/components/ui";
import { LessonAudioPanel } from "@/components/audio/lesson-audio-panel";
import {
  appleDeviceSupportAudioLessons,
  getPublicAppleDeviceSupportAudioLesson,
} from "@/lib/data/audio/apple-device-support";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return appleDeviceSupportAudioLessons.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getPublicAppleDeviceSupportAudioLesson(slug);
  return buildPageMetadata({
    title: lesson ? `Audio — ${lesson.title}` : "Piste introuvable",
    description: lesson?.summary ?? "Piste audio Apple Device Support.",
    path: `/audio/apple-device-support/${slug}`,
    noIndex: !lesson,
  });
}

export default async function AppleDeviceSupportAudioLessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getPublicAppleDeviceSupportAudioLesson(slug);
  if (!lesson) notFound();

  const currentIndex = appleDeviceSupportAudioLessons.findIndex((item) => item.slug === slug);
  const prev = currentIndex > 0 ? appleDeviceSupportAudioLessons[currentIndex - 1] : undefined;
  const next =
    currentIndex >= 0 && currentIndex < appleDeviceSupportAudioLessons.length - 1
      ? appleDeviceSupportAudioLessons[currentIndex + 1]
      : undefined;

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Breadcrumb
          items={[
            { label: "Audio", href: "/audio/apple-device-support" },
            { label: lesson.title },
          ]}
        />

        <header className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="accent">{lesson.module}</Badge>
            <Badge>Piste {String(lesson.trackNumber).padStart(2, "0")}</Badge>
            <Badge variant="success">QCM</Badge>
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-ink md:text-4xl">{lesson.title}</h1>
          <p className="mt-4 text-base leading-relaxed text-ink-secondary">{lesson.officialFocus}</p>
        </header>

        <LessonAudioPanel lesson={lesson} />

        <details className="mt-8 rounded-3xl border border-border-light bg-surface-elevated p-5">
          <summary className="cursor-pointer font-semibold text-ink">Transcription de la piste</summary>
          <div className="mt-4 space-y-4 text-sm leading-7 text-ink-secondary">
            {lesson.transcript.split("\n\n").map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </details>

        <div className="mt-10 flex flex-wrap gap-3">
          {prev && (
            <ButtonLink href={`/audio/apple-device-support/${prev.slug}`} variant="secondary">
              Piste précédente
            </ButtonLink>
          )}
          {next && <ButtonLink href={`/audio/apple-device-support/${next.slug}`}>Piste suivante</ButtonLink>}
          <ButtonLink href={`/cours/apple-device-support/${lesson.slug}`} variant="secondary">
            Leçon écrite
          </ButtonLink>
        </div>
      </div>
    </PageShell>
  );
}
