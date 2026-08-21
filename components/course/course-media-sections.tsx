"use client";

import type { VideoLessonBundle } from "@/lib/video/types";
import type { IllustrationRegistryEntry } from "@/lib/motion/illustrations";
import type { DiagramNode, DiagramConnection } from "@/components/illustrations/AnimatedDiagram";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { VideoHero } from "@/components/video/VideoHero";
import { VideoSidebar } from "@/components/video/VideoSidebar";
import { VideoTimeline } from "@/components/video/VideoTimeline";
import { VideoTranscriptPanel } from "@/components/video/VideoTranscript";
import { VideoResources } from "@/components/video/VideoResources";
import { VideoLabs } from "@/components/video/VideoLabs";
import { VideoNotes } from "@/components/video/VideoNotes";
import { VideoRelatedCourses } from "@/components/video/VideoRelatedCourses";
import { VideoCompletion, VideoCertificateCTA } from "@/components/video/VideoCompletion";
import { useVideoPlayer } from "@/lib/video/use-video-player";
import { AnimatedDiagram } from "@/components/illustrations/AnimatedDiagram";
import { MotionIllustration } from "@/components/illustrations/MotionIllustration";
import { ButtonLink } from "@/components/ui";
import { MediaPlaceholder } from "@/components/video/placeholders/MediaPlaceholder";

export type VideoLessonLayoutProps = {
  bundle?: VideoLessonBundle | null;
  moduleLabel?: string;
  className?: string;
};

/** Composition complète du lecteur vidéo et des panneaux associés */
export function VideoLessonLayout({ bundle, moduleLabel, className = "" }: VideoLessonLayoutProps) {
  const metadata = bundle?.metadata ?? {
    slug: "placeholder",
    title: "",
    status: "coming-soon" as const,
  };

  const {
    currentSeconds,
    durationSeconds,
    progressPercent,
    seek,
  } = useVideoPlayer({
    metadata,
    autoResume: metadata.status === "ready",
  });

  return (
    <div className={`grid gap-6 lg:grid-cols-[1fr_320px] ${className}`}>
      <div className="space-y-6">
        <VideoHero metadata={metadata} moduleLabel={moduleLabel} />
        <VideoPlayer metadata={metadata} />
        <VideoTimeline
          chapters={metadata.chapters}
          currentSeconds={currentSeconds}
          durationSeconds={durationSeconds}
          onSeek={seek}
        />
        <VideoTranscriptPanel
          transcript={metadata.transcript}
          currentSeconds={currentSeconds}
          onSeek={seek}
        />
        <VideoResources resources={metadata.resources} />
        <VideoLabs lab={metadata.lab} />
        <VideoCompletion progressPercent={progressPercent} />
        <VideoCertificateCTA
          eligible={bundle?.certificateEligible}
          certificateHref={bundle?.certificateHref}
        />
      </div>

      <VideoSidebar
        chapters={metadata.chapters}
        currentSeconds={currentSeconds}
        onSeek={seek}
      >
        <VideoNotes
          videoSlug={metadata.slug}
          currentSeconds={currentSeconds}
          onSeek={seek}
        />
        <VideoRelatedCourses courses={bundle?.relatedCourses} />
      </VideoSidebar>
    </div>
  );
}

/** Sections média pour une page de cours / leçon — toutes compatibles données absentes */
export type CourseMediaSectionsProps = {
  courseSlug: string;
  lessonSlug?: string;
  /** Présentation (texte riche ou résumé) */
  presentation?: { title?: string; body?: string } | null;
  /** Bundle vidéo complet */
  videoBundle?: VideoLessonBundle | null;
  /** Illustration interactive */
  illustration?: IllustrationRegistryEntry | null;
  /** Schéma d'architecture */
  architecture?: {
    title?: string;
    description?: string;
    nodes?: DiagramNode[];
    connections?: DiagramConnection[];
  } | null;
  /** Slug laboratoire externe */
  labSlug?: string | null;
  labHref?: string | null;
  /** Slug quiz */
  quizSlug?: string | null;
  /** Liens sources officielles */
  officialSources?: { title: string; href: string; publisher?: string }[];
  /** Téléchargements */
  downloads?: { title: string; href: string; description?: string }[];
  moduleLabel?: string;
  className?: string;
};

export function CourseMediaSections({
  courseSlug: _courseSlug,
  lessonSlug: _lessonSlug,
  presentation,
  videoBundle,
  illustration,
  architecture,
  labSlug,
  labHref,
  quizSlug,
  officialSources = [],
  downloads = [],
  moduleLabel,
  className = "",
}: CourseMediaSectionsProps) {
  const metadata = videoBundle?.metadata;
  const resolvedLabHref = labHref ?? (labSlug ? `/labs/${labSlug}` : undefined);

  return (
    <div className={`space-y-10 ${className}`}>
      {/* Présentation */}
      <section aria-labelledby="section-presentation" className="scroll-mt-28">
        <h2 id="section-presentation" className="text-lg font-bold text-ink">
          Présentation
        </h2>
        {presentation?.body ? (
          <div className="prose prose-sm mt-4 max-w-none text-ink-secondary">
            {presentation.title && <p className="font-semibold text-ink">{presentation.title}</p>}
            <p className="whitespace-pre-wrap leading-relaxed">{presentation.body}</p>
          </div>
        ) : (
          <MediaPlaceholder
            variant="generic"
            compact
            className="mt-4"
            title="Présentation à venir"
            description="Le contenu introductif sera rédigé par l'équipe pédagogique."
          />
        )}
      </section>

      {/* Vidéo */}
      <section aria-labelledby="section-video" className="scroll-mt-28">
        <h2 id="section-video" className="text-lg font-bold text-ink">
          Vidéo
        </h2>
        <div className="mt-4">
          {metadata ? (
            <VideoPlayer metadata={metadata} />
          ) : (
            <MediaPlaceholder variant="video" />
          )}
        </div>
      </section>

      {/* Illustration interactive */}
      <section aria-labelledby="section-illustration" className="scroll-mt-28">
        <h2 id="section-illustration" className="text-lg font-bold text-ink">
          Illustration interactive
        </h2>
        <div className="mt-4">
          <MotionIllustration illustration={illustration} />
        </div>
      </section>

      {/* Architecture */}
      <section aria-labelledby="section-architecture" className="scroll-mt-28">
        <h2 id="section-architecture" className="text-lg font-bold text-ink">
          Architecture
        </h2>
        <div className="mt-4">
          <AnimatedDiagram
            title={architecture?.title}
            description={architecture?.description}
            nodes={architecture?.nodes}
            connections={architecture?.connections}
          />
        </div>
      </section>

      {/* Laboratoire */}
      <section aria-labelledby="section-lab" className="scroll-mt-28">
        <h2 id="section-lab" className="text-lg font-bold text-ink">
          Laboratoire
        </h2>
        <div className="mt-4">
          {resolvedLabHref ? (
            <div className="rounded-2xl border border-border-light bg-surface-elevated p-5">
              <p className="text-sm text-ink-secondary">
                Mettez en pratique les concepts abordés dans un environnement guidé.
              </p>
              <ButtonLink href={resolvedLabHref} className="mt-4">
                Ouvrir le laboratoire →
              </ButtonLink>
            </div>
          ) : (
            <MediaPlaceholder variant="lab" compact />
          )}
        </div>
      </section>

      {/* Quiz */}
      <section aria-labelledby="section-quiz" className="scroll-mt-28">
        <h2 id="section-quiz" className="text-lg font-bold text-ink">
          Quiz
        </h2>
        <div className="mt-4">
          {quizSlug ? (
            <div className="rounded-2xl border border-border-light bg-surface-elevated p-5">
              <p className="text-sm text-ink-secondary">
                Testez vos connaissances après avoir visionné la vidéo et complété le laboratoire.
              </p>
              <ButtonLink href={`/quiz/${quizSlug}`} variant="secondary" className="mt-4">
                Lancer le quiz →
              </ButtonLink>
            </div>
          ) : (
            <MediaPlaceholder variant="quiz" compact />
          )}
        </div>
      </section>

      {/* Sources officielles */}
      <section aria-labelledby="section-sources" className="scroll-mt-28">
        <h2 id="section-sources" className="text-lg font-bold text-ink">
          Sources officielles
        </h2>
        {officialSources.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {officialSources.map((source) => (
              <li key={source.href}>
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-sm font-semibold text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {source.title}
                  {source.publisher ? ` · ${source.publisher}` : ""}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-ink-tertiary">
            Les références documentaires seront listées avec la publication du contenu.
          </p>
        )}
      </section>

      {/* Téléchargements */}
      <section aria-labelledby="section-downloads" className="scroll-mt-28">
        <h2 id="section-downloads" className="text-lg font-bold text-ink">
          Téléchargements
        </h2>
        {downloads.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {downloads.map((d) => (
              <li
                key={d.href}
                className="flex flex-col gap-2 rounded-xl border border-border-light bg-surface-elevated p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-ink">{d.title}</p>
                  {d.description && <p className="text-xs text-ink-tertiary">{d.description}</p>}
                </div>
                <a
                  href={d.href}
                  download
                  className="inline-flex min-h-11 items-center rounded-full border border-border-light px-4 text-sm font-semibold text-accent hover:bg-accent/5"
                >
                  Télécharger
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <MediaPlaceholder variant="download" compact className="mt-4" />
        )}
      </section>
    </div>
  );
}
