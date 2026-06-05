"use client";

import { useState } from "react";
import type { LessonScreenshot } from "@/lib/types";

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function ScreenshotPlaceholder({
  title,
  description,
  src,
}: Pick<LessonScreenshot, "title" | "description" | "src">) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 bg-gradient-to-br from-slate-50 via-white to-slate-100 px-8 py-10">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink/[0.04] ring-1 ring-ink/10 shadow-sm">
        <AppleIcon className="h-7 w-7 text-ink/35" />
      </div>
      <div className="max-w-sm space-y-2 text-center">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="text-xs leading-relaxed text-ink-secondary">{description}</p>
      </div>
      <button
        type="button"
        disabled
        className="cursor-default rounded-full border border-border-light bg-surface-elevated px-5 py-2 text-xs font-semibold text-ink-secondary shadow-sm"
        aria-label={`Capture à ajouter : ${title}`}
      >
        Capture à ajouter
      </button>
      <p className="font-mono text-[10px] text-ink-tertiary/70">{src}</p>
    </div>
  );
}

export function ScreenshotCard({
  id,
  title,
  description,
  src,
  caption,
  generationPrompt,
  isOfficial,
  officialSource,
}: LessonScreenshot) {
  const [failed, setFailed] = useState(false);

  return (
    <figure
      id={id ? `screenshot-${id}` : undefined}
      className="overflow-hidden rounded-3xl border border-border-light bg-surface-elevated shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-video overflow-hidden border-b border-border-light bg-gray-50">
        {isOfficial && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-ink/85 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            Asset officiel {officialSource === "jamf" ? "Jamf" : "éditeur"}
          </span>
        )}
        {!failed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={title}
            width={1920}
            height={1080}
            className="h-full w-full object-cover object-top"
            onError={() => setFailed(true)}
          />
        ) : (
          <ScreenshotPlaceholder title={title} description={description} src={src} />
        )}
      </div>
      <figcaption className="space-y-3 p-5 md:p-6">
        <h4 className="text-base font-semibold tracking-tight text-ink">{title}</h4>
        <p className="text-sm leading-relaxed text-ink-secondary">{description}</p>
        <blockquote className="rounded-2xl border-l-4 border-accent/40 bg-accent/[0.04] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent/80">Légende</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">{caption}</p>
        </blockquote>
        {generationPrompt && (failed || process.env.NODE_ENV === "development") && (
          <details className="rounded-2xl border border-border-light bg-slate-50/80 px-4 py-3">
            <summary className="cursor-pointer text-xs font-semibold text-ink-secondary">
              Prompt de génération (1920×1080 · 16:9)
            </summary>
            <p className="mt-2 text-xs leading-relaxed text-ink-tertiary">{generationPrompt}</p>
          </details>
        )}
      </figcaption>
    </figure>
  );
}

export function LessonScreenshotsSection({ screenshots }: { screenshots: LessonScreenshot[] }) {
  if (screenshots.length === 0) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {screenshots.map((shot) => (
        <ScreenshotCard key={shot.id ?? shot.src} {...shot} />
      ))}
    </div>
  );
}

export function ScreenshotGallery({
  screenshots,
  columns = 2,
}: {
  screenshots: LessonScreenshot[];
  columns?: 1 | 2 | 3;
}) {
  const gridClass =
    columns === 3
      ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
      : columns === 1
        ? "grid gap-6"
        : "grid gap-6 lg:grid-cols-2";

  return (
    <div className={gridClass}>
      {screenshots.map((shot) => (
        <ScreenshotCard key={shot.id ?? shot.src} {...shot} />
      ))}
    </div>
  );
}
