import type { VideoProductionStatus, VideoValidationStatus } from "@/lib/video/production-types";

const LABELS: Record<VideoProductionStatus | VideoValidationStatus, string> = {
  idea: "Idee",
  brief: "Brief",
  "technical-review": "Revue technique",
  "script-ready": "Script pret",
  "lab-ready": "Lab pret",
  recording: "Capture",
  editing: "Montage",
  narration: "Narration",
  subtitles: "Sous-titres",
  review: "En revue",
  approved: "Approuve",
  published: "Publie",
  blocked: "Bloque",
  deprecated: "Deprecie",
  pending: "En attente",
  "pending-verification": "Verification requise",
  outline: "Plan",
  draft: "Brouillon",
  missing: "Manquant",
  ready: "Pret",
};

const STYLES: Record<string, string> = {
  brief: "border-sky-200 bg-sky-50 text-sky-800",
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  "pending-verification": "border-amber-200 bg-amber-50 text-amber-800",
  missing: "border-red-200 bg-red-50 text-red-800",
  outline: "border-slate-200 bg-slate-50 text-slate-800",
  draft: "border-slate-200 bg-slate-50 text-slate-800",
  ready: "border-emerald-200 bg-emerald-50 text-emerald-800",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-800",
  published: "border-green-200 bg-green-50 text-green-800",
  blocked: "border-red-200 bg-red-50 text-red-800",
  deprecated: "border-zinc-200 bg-zinc-50 text-zinc-700",
};

export function VideoProductionStatusBadge({
  status,
}: {
  status: VideoProductionStatus | VideoValidationStatus;
}) {
  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
        STYLES[status] ?? "border-border-light bg-surface text-ink-secondary"
      }`}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
