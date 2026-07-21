"use client";

import Link from "next/link";
import { VideoBadge } from "@/components/video-experience/video-badge";
import type { VideoLibraryItemModel } from "@/components/video-experience/types";

export function VideoLibraryCard({ item }: { item: VideoLibraryItemModel }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border-light bg-surface-elevated shadow-sm transition hover:shadow-md">
      <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-ink to-zinc-800">
        {item.posterSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.posterSrc} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-5xl opacity-80" aria-hidden="true">
            ▶
          </span>
        )}
        {item.durationLabel && (
          <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
            {item.durationLabel}
          </span>
        )}
        <span className="absolute right-3 top-3">
          <VideoBadge state={item.availability} />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        {item.module && (
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">{item.module}</p>
        )}
        <h3 className="mt-1 font-bold text-ink group-hover:text-accent">{item.title}</h3>
        {item.description && (
          <p className="mt-2 flex-1 text-sm text-ink-secondary line-clamp-2">{item.description}</p>
        )}
        <Link
          href={item.href}
          className="mt-4 inline-flex rounded-full bg-accent px-4 py-2 text-center text-sm font-semibold text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {item.availability === "available" ? "Ouvrir" : "Voir la fiche"}
        </Link>
      </div>
    </article>
  );
}
