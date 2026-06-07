import Link from "next/link";
import { Badge } from "@/components/ui";
import type { VideoScript } from "@/src/lib/video-scripts";
import { VideoStatusBadges } from "@/components/videos/VideoStatusBadges";
import { VideoAlternateLearningLinks } from "@/components/videos/video-production-ux";
import { getVideoDisplayBadges } from "@/src/lib/video-display-status";
import { getVideoAssets } from "@/src/lib/video-assets";
import { getOfficialVideo } from "@/src/lib/video-production";
import { VideoThumbnail } from "@/components/videos/VideoThumbnail";

type LessonVideoCalloutProps = {
  video: VideoScript;
  hasMp4?: boolean;
};

export function LessonVideoCallout({ video, hasMp4 = false }: LessonVideoCalloutProps) {
  const assets = getVideoAssets(video.slug);
  const official = getOfficialVideo(video.slug);
  const badges = getVideoDisplayBadges({ slug: video.slug, hasMp4 });

  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-accent/20 bg-surface-elevated shadow-sm">
      <div className="grid gap-0 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
        {assets && !hasMp4 ? (
          <VideoThumbnail
            title={video.title}
            module={video.module}
            icon={assets.icon}
            background={assets.background}
            level={video.level}
            thumbnailPath={assets.thumbnailPath}
            showProductionBadge
            className="rounded-none"
          />
        ) : (
          <Link
            href={`/videos/${video.slug}`}
            className="group relative flex aspect-video items-center justify-center bg-gradient-to-br from-ink to-zinc-800 text-white"
          >
            <span
              className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-3xl backdrop-blur transition group-hover:scale-105"
              aria-hidden="true"
            >
              ▶
            </span>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">
              {video.duration}
            </span>
          </Link>
        )}

        <div className="flex flex-col justify-center p-5 md:p-6">
          <VideoStatusBadges badges={badges} className="mb-2" />
          <div className="flex flex-wrap gap-2">
            <Badge variant="accent">{hasMp4 ? "Vidéo du cours" : "Vidéo en production"}</Badge>
            <Badge variant="default">{video.language}</Badge>
          </div>
          <h2 className="mt-3 text-xl font-bold text-ink">{video.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
            {hasMp4
              ? video.description
              : "Cette vidéo est en cours de production. Le cours, le script, le lab et les ressources sont déjà disponibles."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
            <Link
              href={hasMp4 ? `/videos/${video.slug}` : `/videos/${video.slug}#video-script`}
              className="inline-flex rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {hasMp4 ? "Lancer la vidéo" : "Voir le script"}
            </Link>
            <Link
              href={`/videos/${video.slug}#video-storyboard`}
              className="inline-flex rounded-full border border-border-light bg-white px-4 py-2 text-sm font-semibold text-ink-secondary transition hover:text-ink"
            >
              Storyboard
            </Link>
          </div>
          {!hasMp4 && (
            <div className="mt-4">
              <VideoAlternateLearningLinks
                courseSlug={video.relatedCourseSlug}
                labSlug={video.relatedLabSlug}
                quizSlug={official?.quizSlug ?? video.slug}
                resourceSlug={official?.resourceSlug}
                variant="compact"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
