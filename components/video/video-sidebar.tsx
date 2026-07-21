"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { VideoStatusBadges } from "@/components/videos/VideoStatusBadges";
import type { VideoDisplayBadge } from "@/src/lib/video-display-status";
import { VideoBadge } from "@/components/video/video-badge";
import type { VideoAvailabilityState } from "@/lib/video/availability";

export type VideoSidebarMeta = {
  module: string;
  duration: string;
  sceneCount: number;
  level: string;
  quizSlug?: string;
  courseSlug?: string;
  labSlug?: string;
  certificationHref?: string;
  certificationLabel?: string;
  transcriptHref?: string;
  transcriptWordCount?: number;
};

export function VideoSidebar({
  title = "Informations",
  availability,
  badges,
  meta,
  resources,
  footer,
}: {
  title?: string;
  availability?: VideoAvailabilityState;
  badges?: VideoDisplayBadge[];
  meta: VideoSidebarMeta;
  resources?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <aside className="space-y-4">
      <div className="rounded-2xl border border-border-light bg-surface-elevated p-5">
        <h2 className="font-bold text-ink">{title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          {(availability || badges) && (
            <div>
              <dt className="text-xs text-ink-tertiary">Statut</dt>
              <dd className="mt-1 flex flex-wrap gap-2">
                {availability && <VideoBadge state={availability} />}
                {badges && <VideoStatusBadges badges={badges} />}
              </dd>
            </div>
          )}
          <div>
            <dt className="text-xs text-ink-tertiary">Module</dt>
            <dd className="font-medium text-ink">{meta.module}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-tertiary">Durée</dt>
            <dd className="font-medium text-ink">{meta.duration}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-tertiary">Scènes</dt>
            <dd className="font-medium text-ink">{meta.sceneCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-tertiary">Niveau</dt>
            <dd className="font-medium text-ink">{meta.level}</dd>
          </div>
          {meta.quizSlug && (
            <div>
              <dt className="text-xs text-ink-tertiary">Quiz associé</dt>
              <dd>
                <Link href={`/quiz/${meta.quizSlug}`} className="font-medium text-accent hover:underline">
                  {meta.quizSlug}
                </Link>
              </dd>
            </div>
          )}
          {meta.courseSlug && (
            <div>
              <dt className="text-xs text-ink-tertiary">Cours associé</dt>
              <dd>
                <Link href={`/cours/${meta.courseSlug}`} className="font-medium text-accent hover:underline">
                  {meta.courseSlug}
                </Link>
              </dd>
            </div>
          )}
          {meta.labSlug && (
            <div>
              <dt className="text-xs text-ink-tertiary">Lab associé</dt>
              <dd>
                <Link href={`/labs/${meta.labSlug}`} className="font-medium text-accent hover:underline">
                  {meta.labSlug}
                </Link>
              </dd>
            </div>
          )}
          {meta.certificationHref && (
            <div>
              <dt className="text-xs text-ink-tertiary">Certification</dt>
              <dd>
                <Link href={meta.certificationHref} className="font-medium text-accent hover:underline">
                  {meta.certificationLabel ?? meta.certificationHref}
                </Link>
              </dd>
            </div>
          )}
          {meta.transcriptHref && (
            <div>
              <dt className="text-xs text-ink-tertiary">Transcript</dt>
              <dd>
                <Link href={meta.transcriptHref} className="font-medium text-accent hover:underline">
                  {meta.transcriptWordCount ? `${meta.transcriptWordCount} mots` : "Ouvrir"}
                </Link>
              </dd>
            </div>
          )}
        </dl>
      </div>

      {resources}

      {footer ?? (
        <>
          <Link href="/resources/guide-captures-video" className="block text-sm font-semibold text-accent hover:underline">
            Guide captures vidéo →
          </Link>
          <Link href="/videos" className="block text-sm font-semibold text-accent hover:underline">
            ← Toutes les vidéos
          </Link>
        </>
      )}
    </aside>
  );
}
