"use client";

import type { ReactNode } from "react";
import { VideoBadge } from "@/components/video-experience/video-badge";
import type { VideoAvailabilityState } from "@/components/video-experience/types";

export function VideoSidebar({
  title = "Informations",
  availability,
  module,
  level,
  durationLabel,
  children,
  footer,
  className = "",
}: {
  title?: string;
  availability?: VideoAvailabilityState;
  module?: string;
  level?: string;
  durationLabel?: string;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <aside className={`space-y-4 ${className}`}>
      <div className="rounded-2xl border border-border-light bg-surface-elevated p-5">
        <h2 className="font-bold text-ink">{title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          {availability && (
            <div>
              <dt className="text-xs text-ink-tertiary">Statut</dt>
              <dd className="mt-1">
                <VideoBadge state={availability} />
              </dd>
            </div>
          )}
          {module && (
            <div>
              <dt className="text-xs text-ink-tertiary">Module</dt>
              <dd className="font-medium text-ink">{module}</dd>
            </div>
          )}
          {level && (
            <div>
              <dt className="text-xs text-ink-tertiary">Niveau</dt>
              <dd className="font-medium text-ink">{level}</dd>
            </div>
          )}
          {durationLabel && (
            <div>
              <dt className="text-xs text-ink-tertiary">Durée</dt>
              <dd className="font-medium text-ink">{durationLabel}</dd>
            </div>
          )}
        </dl>
        {children}
      </div>
      {footer}
    </aside>
  );
}
