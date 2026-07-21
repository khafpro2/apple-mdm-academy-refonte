import type { AssetStatus, MotionReviewStatus, MotionSceneStatus } from "@/lib/motion/asset-types";

const STATUS_LABELS: Record<AssetStatus | MotionSceneStatus | MotionReviewStatus, string> = {
  missing: "Asset non encore produit",
  "brief-ready": "Brief pret",
  generated: "Genere",
  selected: "Selectionne",
  "retouch-required": "Retouche requise",
  review: "En revision",
  approved: "Approuve",
  deprecated: "Deprecie",
  "assets-in-production": "Assets en production",
  "not-started": "Non demarre",
  "needs-review": "A reviser",
};

const STATUS_STYLES: Record<string, string> = {
  missing: "border-slate-200 bg-slate-50 text-slate-700",
  "brief-ready": "border-sky-200 bg-sky-50 text-sky-800",
  generated: "border-indigo-200 bg-indigo-50 text-indigo-800",
  selected: "border-teal-200 bg-teal-50 text-teal-800",
  "retouch-required": "border-amber-200 bg-amber-50 text-amber-800",
  review: "border-violet-200 bg-violet-50 text-violet-800",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-800",
  deprecated: "border-zinc-200 bg-zinc-50 text-zinc-700",
  "assets-in-production": "border-cyan-200 bg-cyan-50 text-cyan-800",
  "not-started": "border-slate-200 bg-slate-50 text-slate-700",
  "needs-review": "border-orange-200 bg-orange-50 text-orange-800",
};

export function MotionStatusBadge({
  status,
}: {
  status: AssetStatus | MotionSceneStatus | MotionReviewStatus;
}) {
  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
        STATUS_STYLES[status] ?? STATUS_STYLES.missing
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function getMotionStatusLabel(status: AssetStatus | MotionSceneStatus | MotionReviewStatus) {
  return STATUS_LABELS[status] ?? status;
}
