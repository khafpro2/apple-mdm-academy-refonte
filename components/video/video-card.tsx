"use client";

import Link from "next/link";
import { Badge } from "@/components/ui";
import { VideoThumbnail } from "@/components/videos/VideoThumbnail";
import { VideoStatusBadges } from "@/components/videos/VideoStatusBadges";
import { VideoBadge } from "@/components/video/video-badge";
import type { VideoCatalogEntry } from "@/lib/video/catalog";
import { getVideoAssets } from "@/src/lib/video-assets";
import type { VideoLevel } from "@/src/lib/video-scripts";

export function VideoCard({ entry }: { entry: VideoCatalogEntry }) {
  const pack = entry.illustrated ? getVideoAssets(entry.slug) : null;
  const level = entry.level as VideoLevel | undefined;

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-3xl border bg-surface-elevated shadow-sm transition hover:shadow-md ${
        entry.featured
          ? "border-accent/40 ring-1 ring-accent/20"
          : entry.jamf
            ? "border-indigo-200 ring-1 ring-indigo-100"
            : entry.illustrated
              ? "border-accent/30"
              : "border-border-light"
      }`}
    >
      {pack ? (
        <VideoThumbnail
          title={entry.title}
          module={entry.module}
          icon={pack.icon}
          background={pack.background}
          level={level}
          thumbnailPath={pack.thumbnailPath}
          showProductionBadge={!entry.canPlay}
          className="rounded-none"
        />
      ) : (
        <div
          className={`relative flex aspect-video items-center justify-center ${
            entry.jamf ? "bg-gradient-to-br from-indigo-900 to-ink" : "bg-gradient-to-br from-ink to-zinc-800"
          }`}
        >
          <span className="text-5xl opacity-80 transition group-hover:scale-110" aria-hidden="true">
            ▶
          </span>
          <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
            {entry.duration}
          </span>
          {!entry.canPlay && (
            <span className="absolute right-3 top-3">
              <VideoBadge state={entry.availability} />
            </span>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          <VideoBadge state={entry.availability} />
          <VideoStatusBadges badges={entry.badges} />
        </div>
        <Badge variant="default" className="mb-2 self-start">
          {entry.module}
        </Badge>
        <h3 className="font-bold text-ink group-hover:text-accent">{entry.title}</h3>
        <p className="mt-2 flex-1 text-sm text-ink-secondary line-clamp-2">{entry.description}</p>
        <Link
          href={entry.href}
          className="mt-4 inline-flex rounded-full bg-accent px-4 py-2 text-center text-sm font-semibold text-white hover:opacity-90"
          aria-label={
            entry.canPlay
              ? `Regarder la vidéo ${entry.title}`
              : `Découvrir le module ${entry.title} (vidéo en production)`
          }
        >
          {entry.canPlay ? "Regarder la vidéo" : "Découvrir le module"}
        </Link>
      </div>
    </article>
  );
}
