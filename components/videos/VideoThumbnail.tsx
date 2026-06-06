"use client";

import type { VideoBackgroundId, VideoIconId } from "@/src/lib/video-assets";
import { getVideoBackground, getVideoIcon } from "@/src/lib/video-assets";
import type { VideoLevel } from "@/src/lib/video-scripts";

type VideoThumbnailProps = {
  title: string;
  module: string;
  icon: VideoIconId;
  background: VideoBackgroundId;
  level: VideoLevel;
  /** Static SVG thumbnail path (optional override) */
  thumbnailPath?: string;
  className?: string;
  compact?: boolean;
};

const BG_CLASS: Record<VideoBackgroundId, string> = {
  "apple-light": "from-[#F5F5F7] to-[#E8E8ED]",
  "microsoft-learn": "from-[#F3F2F1] to-[#DEECF9]",
  "jamf-training": "from-[#F0F4F8] to-[#D6E4F0]",
  "macos-security": "from-[#1C1C1E] to-[#2C2C2E]",
  certification: "from-[#FFF9E6] to-[#F5F5F7]",
};

const ACCENT: Record<VideoBackgroundId, string> = {
  "apple-light": "#48484A",
  "microsoft-learn": "#0078D4",
  "jamf-training": "#1B365D",
  "macos-security": "#FF9500",
  certification: "#FF9500",
};

export function VideoThumbnail({
  title,
  module,
  icon,
  background,
  level,
  thumbnailPath,
  className = "",
  compact = false,
}: VideoThumbnailProps) {
  const iconAsset = getVideoIcon(icon);
  const bgAsset = getVideoBackground(background);
  const isDark = background === "macos-security";
  const accent = ACCENT[background];

  if (thumbnailPath) {
    return (
      <div className={`relative overflow-hidden rounded-2xl ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumbnailPath} alt="" className="aspect-video w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-ink">
          {level}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative flex aspect-video flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br p-5 shadow-sm ${BG_CLASS[background]} ${className}`}
      aria-hidden="true"
    >
      <div className="flex items-start justify-between gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconAsset.path} alt="" width={compact ? 36 : 48} height={compact ? 36 : 48} className="opacity-90" />
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${isDark ? "bg-white/15 text-white" : "bg-white/80 text-ink"}`}
        >
          {level}
        </span>
      </div>
      <div>
        <p className={`text-xs font-medium uppercase tracking-wide ${isDark ? "text-zinc-400" : "text-ink-tertiary"}`}>
          {module}
        </p>
        <p className={`mt-1 font-bold leading-tight ${compact ? "text-sm" : "text-lg"} ${isDark ? "text-white" : "text-ink"}`}>
          {title}
        </p>
        <p className={`mt-2 text-xs ${isDark ? "text-zinc-500" : "text-ink-tertiary"}`}>{bgAsset.style}</p>
      </div>
      <div
        className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-10"
        style={{ backgroundColor: accent }}
      />
    </div>
  );
}
