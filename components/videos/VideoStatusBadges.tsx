import type { VideoDisplayBadge, VideoDisplayBadgeId } from "@/src/lib/video-display-status";

const BADGE_CLASS: Partial<Record<VideoDisplayBadgeId, string>> = {
  published: "bg-green-100 text-green-800 border-green-200",
  "in-production": "bg-amber-100 text-amber-900 border-amber-200",
  "storyboard-ready": "bg-surface text-ink-secondary border-border-light",
  "script-ready": "bg-blue-50 text-blue-900 border-blue-100",
};

type Props = {
  badges: VideoDisplayBadge[];
  className?: string;
  size?: "sm" | "md";
};

export function VideoStatusBadges({ badges, className = "", size = "sm" }: Props) {
  if (badges.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {badges.map((badge) => (
        <span
          key={badge.id}
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold ${
            size === "sm" ? "text-[10px]" : "text-xs"
          } ${BADGE_CLASS[badge.id] ?? ""}`}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}
