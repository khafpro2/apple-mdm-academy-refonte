import Link from "next/link";
import { VideoThumbnail } from "@/components/videos/VideoThumbnail";
import { VideoStatusBadges } from "@/components/videos/VideoStatusBadges";
import { getVideoAssets } from "@/src/lib/video-assets";
import { getVideoDisplayBadges } from "@/src/lib/video-display-status";
import type { CoursePilotVideo } from "@/src/lib/course-pilot-videos";

type Props = {
  video: CoursePilotVideo;
  hasMp4: boolean;
};

export function CourseVideoInProductionBlock({ video, hasMp4 }: Props) {
  const assets = getVideoAssets(video.slug);
  const badges = getVideoDisplayBadges({
    slug: video.slug,
    hasMp4,
  });

  if (hasMp4) {
    return (
      <section className="rounded-[2rem] border border-green-200 bg-green-50/50 p-6 shadow-sm md:p-8">
        <VideoStatusBadges badges={badges} className="mb-3" />
        <h3 className="text-lg font-bold text-ink">{video.title}</h3>
        <p className="mt-2 text-sm text-ink-secondary">La vidéo est disponible dans la bibliothèque LMS.</p>
        <Link
          href={`/videos/${video.slug}`}
          className="mt-4 inline-flex rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Regarder la vidéo
        </Link>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-[2rem] border border-border-light bg-surface-elevated shadow-sm">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        {assets ? (
          <VideoThumbnail
            title={video.title}
            module={video.module}
            icon={assets.icon}
            background={assets.background}
            level="Fondamental"
            thumbnailPath={assets.thumbnailPath}
            showProductionBadge
            className="rounded-none lg:min-h-full"
          />
        ) : (
          <div className="aspect-video bg-gradient-to-br from-[#F5F5F7] to-[#E8E8ED] p-8">
            <p className="text-lg font-bold text-ink">{video.title}</p>
          </div>
        )}
        <div className="flex flex-col justify-center p-6 md:p-8">
          <VideoStatusBadges badges={badges} className="mb-3" />
          <h3 className="text-xl font-bold text-ink">Vidéo en production</h3>
          <p className="mt-1 text-sm text-ink-tertiary">{video.duration} · {video.module}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
            Cette vidéo est en cours de production. Le cours, le script, le lab et les ressources sont déjà
            disponibles.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={`/videos/${video.slug}#video-script`}
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Voir le script
            </Link>
            <Link
              href={`/videos/${video.slug}#video-storyboard`}
              className="rounded-full border border-border-light px-4 py-2 text-sm font-semibold text-ink-secondary hover:bg-surface"
            >
              Voir le storyboard
            </Link>
            <Link
              href={`/labs/${video.labSlug}`}
              className="rounded-full border border-border-light px-4 py-2 text-sm font-semibold text-ink-secondary hover:bg-surface"
            >
              Accéder au lab
            </Link>
            <Link
              href={`/resources/${video.resourceSlug}`}
              className="rounded-full border border-border-light px-4 py-2 text-sm font-semibold text-ink-secondary hover:bg-surface"
            >
              Télécharger la ressource
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
