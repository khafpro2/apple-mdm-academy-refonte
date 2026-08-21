import type { VerificationStatus } from "@/lib/visual-studio/types";
import { verificationLabels, visualStudioColors } from "@/lib/visual-studio/visual-tokens";

const TONE_STYLES: Record<
  (typeof verificationLabels)[VerificationStatus]["tone"],
  { bg: string; border: string; text: string }
> = {
  success: { bg: "#ECFDF5", border: "#A7F3D0", text: "#047857" },
  info: { bg: "#EFF6FF", border: "#BFDBFE", text: "#1D4ED8" },
  warning: { bg: "#FFFBEB", border: "#FDE68A", text: "#B45309" },
  neutral: { bg: "#F8FAFC", border: "#E2E8F0", text: "#475569" },
};

type VerificationBadgeProps = {
  status: VerificationStatus;
  className?: string;
};

export function VerificationBadge({ status, className = "" }: VerificationBadgeProps) {
  const meta = verificationLabels[status];
  const tone = TONE_STYLES[meta.tone];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${className}`}
      style={{ backgroundColor: tone.bg, borderColor: tone.border, color: tone.text }}
      role="status"
      aria-label={`Statut de vérification : ${meta.label}`}
    >
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: tone.text }}
        aria-hidden="true"
      />
      {meta.label}
    </span>
  );
}

export function VerificationNote({ status }: { status: VerificationStatus }) {
  if (status === "source-verified" || status === "technically-reviewed") {
    return null;
  }
  return (
    <p className="text-sm" style={{ color: visualStudioColors.muted }}>
      Ce storyboard est en{" "}
      <strong style={{ color: visualStudioColors.text }}>{verificationLabels[status].shortLabel}</strong>
      . Les affirmations techniques ne sont pas encore reliées aux sources officielles scène par scène.
    </p>
  );
}
