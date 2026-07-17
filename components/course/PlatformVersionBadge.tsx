import type { ApplePlatformName, CourseVersionStatus } from "@/lib/types";
import { formatPlatformLabel } from "@/lib/platform-versions";

const STATUS_LABEL: Record<CourseVersionStatus, string> = {
  current: "Version actuelle",
  compatible: "Compatible multi-versions",
  changed: "Comportement selon version",
  legacy: "Référence legacy",
  "needs-review": "À revérifier",
};

type Props = {
  platform: ApplePlatformName;
  version?: string;
  status?: CourseVersionStatus;
  className?: string;
};

export function PlatformVersionBadge({ platform, version, status, className = "" }: Props) {
  const label = formatPlatformLabel(platform, version);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-border-light bg-surface px-3 py-1 text-xs font-medium text-ink ${className}`}
    >
      <span className="font-semibold text-ink">{label}</span>
      {status && (
        <span className="text-ink-tertiary" title={STATUS_LABEL[status]}>
          · {STATUS_LABEL[status]}
        </span>
      )}
    </span>
  );
}
