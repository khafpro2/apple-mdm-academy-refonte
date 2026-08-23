import { PageShell } from "@/components/layout";
import { Badge, Breadcrumb, ButtonLink } from "@/components/ui";
import { AudioLessonPlayer } from "@/components/audio/audio-lesson-player";
import { AudioPackBanner } from "@/components/audio/audio-pack-banner";
import {
  APPLE_DEVICE_SUPPORT_AUDIO_PACK,
  appleDeviceSupportAudioLessons,
  getAudioModules,
} from "@/lib/data/audio/apple-device-support";
import { buildPageMetadata } from "@/lib/seo/metadata";
import Link from "next/link";

export const metadata = buildPageMetadata({
  title: "Audio Apple Device Support",
  description:
    "Pistes MP3 téléchargeables pour la recertification Apple Device Support. Une piste par leçon, QCM à la fin.",
  path: "/audio/apple-device-support",
});

export default function AppleDeviceSupportAudioPackPage() {
  const modules = getAudioModules();
  const lessonCount = appleDeviceSupportAudioLessons.length;

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Breadcrumb
          items={[
            { label: "Cours", href: "/cours" },
            { label: "Apple Device Support", href: "/cours/apple-device-support" },
            { label: "Audio" },
          ]}
        />

        <header className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="accent">Recertification</Badge>
            <Badge>{lessonCount} pistes MP3</Badge>
            <Badge variant="success">QCM en fin de piste</Badge>
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-ink md:text-5xl">
            {APPLE_DEVICE_SUPPORT_AUDIO_PACK.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-secondary">
            {APPLE_DEVICE_SUPPORT_AUDIO_PACK.description}
          </p>
        </header>

        <AudioPackBanner lessonCount={lessonCount} />

        <div className="mt-10 space-y-8">
          {modules.map((module, moduleIndex) => (
            <section
              key={module.title}
              className="rounded-[2rem] border border-border-light bg-surface-elevated p-6 shadow-sm md:p-8"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">
                Module {moduleIndex + 1}
              </p>
              <h2 className="mt-1 text-xl font-bold text-ink md:text-2xl">{module.title}</h2>
              <ul className="mt-6 space-y-5">
                {module.lessons.map((lesson) => (
                  <li key={lesson.slug} id={lesson.slug} className="space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={`/audio/apple-device-support/${lesson.slug}`}
                          className="font-semibold text-ink hover:text-accent"
                        >
                          Piste {String(lesson.trackNumber).padStart(2, "0")} — {lesson.title}
                        </Link>
                        <p className="mt-1 text-sm text-ink-secondary">{lesson.summary}</p>
                      </div>
                      <ButtonLink href={`/audio/apple-device-support/${lesson.slug}`} variant="secondary" size="sm">
                        QCM de la piste
                      </ButtonLink>
                    </div>
                    <AudioLessonPlayer lesson={lesson} compact />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/cours/apple-device-support">Retour au cours</ButtonLink>
          <ButtonLink href="/examens/apple-device-support" variant="secondary">
            Examen blanc
          </ButtonLink>
        </div>
      </div>
    </PageShell>
  );
}
