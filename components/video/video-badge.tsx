"use client";

import {
  resolveVideoAvailability,
  type VideoAvailabilityState,
} from "@/lib/video/availability";

const STYLES: Record<VideoAvailabilityState, string> = {
  loading: "border-border-light bg-surface text-ink-tertiary",
  processing: "border-amber-200 bg-amber-50 text-amber-900",
  available: "border-green-200 bg-green-50 text-green-800",
  deprecated: "border-zinc-300 bg-zinc-100 text-zinc-700",
  missing: "border-red-200 bg-red-50 text-red-800",
};

export function VideoBadge({
  state,
  label,
  className = "",
}: {
  state: VideoAvailabilityState;
  label?: string;
  className?: string;
}) {
  const resolved = resolveVideoAvailability({
    loading: state === "loading",
    missing: state === "missing",
    deprecated: state === "deprecated",
    hasMp4: state === "available",
    isPublishable: state === "available",
  });

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STYLES[state]} ${className}`}
      data-video-availability={state}
    >
      {label ?? resolved.label}
    </span>
  );
}
