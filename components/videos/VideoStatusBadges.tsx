import type { VideoDisplayBadge, VideoDisplayBadgeId } from "@/src/lib/video-display-status";

const BADGE_CLASS: Partial<Record<VideoDisplayBadgeId, string>> = {
  published: "bg-green-100 text-green-800 border-green-200",
  "in-production": "bg-amber-100 text-amber-900 border-amber-200 ring-1 ring-amber-300/50",
  "media-required": "bg-red-50 text-red-800 border-red-100",
  "storyboard-ready": "bg-violet-50 text-violet-900 border-violet-200",
  "script-ready": "bg-blue-50 text-blue-900 border-blue-100",
};

const BADGE_TITLE: Partial<Record<VideoDisplayBadgeId, string>> = {
  published: "Vidéo MP4 disponible — lecture officielle",
  "in-production": "MP4 en montage — mode démo actif (storyboard + script)",
  "media-required": "MP4 détecté mais publication bloquée par des médias requis",
  "storyboard-ready": "Storyboard animé disponible sur la page",
  "script-ready": "Script HeyGen prêt à copier",
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
          title={BADGE_TITLE[badge.id]}
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
