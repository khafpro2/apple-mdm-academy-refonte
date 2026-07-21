"use client";

import Link from "next/link";
import { VideoBadge } from "@/components/video/video-badge";
import type { VideoCatalogEntry } from "@/lib/video/catalog";

export function VideoPlaylist({
  title = "Playlist / vidéos liées",
  items,
  currentSlug,
}: {
  title?: string;
  items: VideoCatalogEntry[];
  currentSlug?: string;
}) {
  if (!items.length) return null;

  return (
    <div className="rounded-2xl border border-border-light bg-surface-elevated p-5">
      <h2 className="font-bold text-ink">{title}</h2>
      <p className="mt-1 text-xs text-ink-tertiary">{items.length} vidéos</p>
      <ol className="mt-4 space-y-2">
        {items.map((item, index) => {
          const isCurrent = item.slug === currentSlug;
          return (
            <li key={item.slug}>
              <Link
                href={item.href}
                aria-current={isCurrent ? "page" : undefined}
                className={`flex items-start gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  isCurrent
                    ? "bg-accent/10 ring-1 ring-accent/30"
                    : "hover:bg-surface"
                }`}
              >
                <span className="mt-0.5 w-5 shrink-0 text-xs font-semibold text-ink-tertiary">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-ink line-clamp-2">{item.title}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-2">
                    <VideoBadge state={item.availability} />
                    <span className="text-xs text-ink-tertiary">{item.duration}</span>
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
