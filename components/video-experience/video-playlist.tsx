"use client";

import Link from "next/link";
import { VideoBadge } from "@/components/video-experience/video-badge";
import type { VideoPlaylistItemModel } from "@/components/video-experience/types";

export function VideoPlaylist({
  title = "Playlist",
  items,
  currentSlug,
  className = "",
}: {
  title?: string;
  items: VideoPlaylistItemModel[];
  currentSlug?: string;
  className?: string;
}) {
  if (!items.length) {
    return (
      <div className={`rounded-2xl border border-dashed border-border-light bg-surface p-5 ${className}`}>
        <h2 className="font-bold text-ink">{title}</h2>
        <p className="mt-2 text-sm text-ink-tertiary">Aucune vidéo liée fournie.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-border-light bg-surface-elevated p-5 ${className}`}>
      <h2 className="font-bold text-ink">{title}</h2>
      <ol className="mt-4 space-y-2">
        {items.map((item, index) => {
          const current = item.slug === currentSlug;
          return (
            <li key={item.slug}>
              <Link
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={`flex items-start gap-3 rounded-xl px-3 py-2.5 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  current ? "bg-accent/10 ring-1 ring-accent/30" : "hover:bg-surface"
                }`}
              >
                <span className="mt-0.5 w-5 shrink-0 text-xs font-semibold text-ink-tertiary">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-ink line-clamp-2">{item.title}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-2">
                    <VideoBadge state={item.availability} />
                    {item.durationLabel && (
                      <span className="text-xs text-ink-tertiary">{item.durationLabel}</span>
                    )}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
