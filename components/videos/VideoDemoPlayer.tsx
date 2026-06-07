"use client";

import type { VideoStoryboard } from "@/src/lib/video-lessons";
import type { VideoAssetPack } from "@/src/lib/video-assets";
import { VideoThumbnail } from "@/components/videos/VideoThumbnail";
import { VideoStatusBadges } from "@/components/videos/VideoStatusBadges";
import { VideoAlternateLearningLinks } from "@/components/videos/video-production-ux";
import { DEMO_VIDEO_MESSAGE, getVideoDisplayBadges } from "@/src/lib/video-display-status";
import { getOfficialVideo } from "@/src/lib/video-production";

type Props = {
  storyboard: VideoStoryboard;
  assetPack?: VideoAssetPack;
  heygenScript: string;
};

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function VideoDemoPlayer({ storyboard, assetPack, heygenScript }: Props) {
  const official = getOfficialVideo(storyboard.slug);
  const badges = getVideoDisplayBadges({
    slug: storyboard.slug,
    hasMp4: false,
    storyboard,
    scriptText: heygenScript,
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-border-light bg-surface-elevated shadow-lg">
      <div className="relative">
        {assetPack ? (
          <VideoThumbnail
            title={storyboard.title}
            module={storyboard.module}
            icon={assetPack.icon}
            background={assetPack.background}
            level={storyboard.level}
            thumbnailPath={assetPack.thumbnailPath}
            showProductionBadge
            className="rounded-none"
          />
        ) : (
          <div className="relative aspect-video bg-gradient-to-br from-[#F5F5F7] to-[#E8E8ED] p-8">
            <p className="text-lg font-bold text-ink">{storyboard.title}</p>
            <p className="mt-1 text-sm text-ink-secondary">{storyboard.module}</p>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/20 via-transparent to-transparent">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-lg"
            aria-hidden
          >
            <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 text-ink" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white">
          {storyboard.duration}
        </span>
      </div>

      <div className="space-y-5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <VideoStatusBadges badges={badges} size="md" />
            <h2 className="mt-3 text-xl font-bold text-ink">{storyboard.title}</h2>
            <p className="mt-1 text-sm text-ink-secondary">{storyboard.module}</p>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
            Vidéo en production
          </span>
        </div>

        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm leading-relaxed text-ink-secondary">
          {DEMO_VIDEO_MESSAGE}
        </p>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => scrollTo("video-script")}
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Voir le script
          </button>
          <button
            type="button"
            onClick={() => scrollTo("video-storyboard")}
            className="rounded-full border border-border-light px-4 py-2 text-sm font-semibold text-ink-secondary hover:bg-surface"
          >
            Storyboard
          </button>
        </div>

        <VideoAlternateLearningLinks
          courseSlug={storyboard.courseSlug}
          labSlug={storyboard.labSlug}
          quizSlug={storyboard.quizSlug}
          resourceSlug={official?.resourceSlug}
          variant="cards"
        />
      </div>
    </div>
  );
}
