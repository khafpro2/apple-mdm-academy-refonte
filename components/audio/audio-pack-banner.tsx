import Link from "next/link";
import { ButtonLink } from "@/components/ui";
import { APPLE_DEVICE_SUPPORT_AUDIO_PACK } from "@/lib/data/audio/apple-device-support";
import type { AudioLessonPublic } from "@/lib/data/audio/types";

type AudioPackBannerProps = {
  lessonCount: number;
  currentLesson?: AudioLessonPublic;
};

export function AudioPackBanner({ lessonCount, currentLesson }: AudioPackBannerProps) {
  return (
    <section className="mt-6 rounded-3xl border border-accent/20 bg-gradient-to-br from-surface via-surface-elevated to-indigo-50/50 p-5 shadow-sm md:p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">Recertification audio</p>
      <h2 className="mt-1 text-xl font-bold text-ink">{APPLE_DEVICE_SUPPORT_AUDIO_PACK.title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-secondary">
        {lessonCount} pistes MP3, une par leçon. Voix claire, sans liens, chaque piste se termine par un QCM.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {currentLesson && (
          <a
            href={currentLesson.audioSrc}
            download={currentLesson.downloadName}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white transition hover:bg-ink/90"
          >
            Télécharger cette piste
          </a>
        )}
        <ButtonLink href={`/audio/${APPLE_DEVICE_SUPPORT_AUDIO_PACK.slug}`} variant={currentLesson ? "secondary" : "primary"}>
          {currentLesson ? "Toutes les pistes" : "Ouvrir le pack audio"}
        </ButtonLink>
        <Link
          href={APPLE_DEVICE_SUPPORT_AUDIO_PACK.zipSrc}
          download={APPLE_DEVICE_SUPPORT_AUDIO_PACK.zipName}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-white px-5 py-2 text-sm font-semibold text-ink transition hover:bg-surface"
        >
          Tout télécharger (ZIP)
        </Link>
      </div>
    </section>
  );
}
