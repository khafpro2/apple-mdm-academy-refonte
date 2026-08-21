import type { VisualActor, VisualActorType, VisualDomain } from "@/lib/visual-studio/types";
import { domainColors, visualStudioColors } from "@/lib/visual-studio/visual-tokens";

type DeviceNodeProps = {
  label: string;
  deviceKind?: "mac" | "iphone" | "ipad" | "tv" | "generic";
  active?: boolean;
  className?: string;
};

export function DeviceNode({ label, deviceKind = "generic", active = true, className = "" }: DeviceNodeProps) {
  const colors = domainColors.apple;
  return (
    <div
      className={`flex min-w-[100px] flex-col items-center gap-2 rounded-xl border px-3 py-3 text-center transition-opacity ${className}`}
      style={{
        backgroundColor: visualStudioColors.surface,
        borderColor: active ? colors.primary : visualStudioColors.border,
        opacity: active ? 1 : 0.55,
      }}
      role="listitem"
    >
      <DeviceGlyph kind={deviceKind} color={active ? colors.primary : visualStudioColors.muted} />
      <span className="text-xs font-semibold" style={{ color: visualStudioColors.text }}>
        {label}
      </span>
      <span className="sr-only">Appareil Apple — {label}</span>
    </div>
  );
}

function DeviceGlyph({ kind, color }: { kind: DeviceNodeProps["deviceKind"]; color: string }) {
  if (kind === "iphone" || kind === "ipad") {
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <rect x="8" y="3" width={kind === "ipad" ? 12 : 10} height={kind === "ipad" ? 22 : 22} rx="2" fill="none" stroke={color} strokeWidth="1.75" />
        <circle cx="14" cy="22" r="1" fill={color} />
      </svg>
    );
  }
  if (kind === "tv") {
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <rect x="3" y="6" width="22" height="14" rx="2" fill="none" stroke={color} strokeWidth="1.75" />
        <path d="M10 24h8" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    );
  }
  // mac / generic
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      <rect x="4" y="5" width="20" height="13" rx="2" fill="none" stroke={color} strokeWidth="1.75" />
      <path d="M8 22h12M14 18v4" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

type CloudServiceNodeProps = {
  label: string;
  domain?: VisualDomain;
  type?: VisualActorType;
  description?: string;
  active?: boolean;
  className?: string;
};

export function CloudServiceNode({
  label,
  domain = "apple",
  type = "cloud-service",
  description,
  active = true,
  className = "",
}: CloudServiceNodeProps) {
  const colors = domainColors[domain];
  return (
    <div
      className={`min-w-[120px] max-w-[160px] rounded-xl border px-3 py-3 text-center ${className}`}
      style={{
        backgroundColor: visualStudioColors.surface,
        borderColor: active ? colors.primary : visualStudioColors.border,
        boxShadow: active ? `0 0 0 1px ${colors.secondary}22` : undefined,
        opacity: active ? 1 : 0.55,
      }}
      role="listitem"
    >
      <ActorGlyph type={type} color={active ? colors.primary : visualStudioColors.muted} />
      <p className="mt-2 text-xs font-semibold leading-snug" style={{ color: visualStudioColors.text }}>
        {label}
      </p>
      {description ? (
        <p className="mt-1 text-[10px] leading-snug" style={{ color: visualStudioColors.muted }}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function ActorFromData({ actor, active = true }: { actor: VisualActor; active?: boolean }) {
  if (actor.type === "device") {
    const kind =
      actor.id.includes("iphone") ? "iphone" : actor.id.includes("ipad") ? "ipad" : actor.id.includes("tv") ? "tv" : "mac";
    return <DeviceNode label={actor.label} deviceKind={kind} active={active} />;
  }
  return (
    <CloudServiceNode
      label={actor.label}
      domain={actor.domain}
      type={actor.type}
      description={actor.description}
      active={active}
    />
  );
}

function ActorGlyph({ type, color }: { type: VisualActorType; color: string }) {
  const common = { width: 28, height: 28, viewBox: "0 0 28 28", "aria-hidden": true as const };
  switch (type) {
    case "admin":
    case "user":
      return (
        <svg {...common} className="mx-auto">
          <circle cx="14" cy="10" r="4" fill="none" stroke={color} strokeWidth="1.75" />
          <path d="M6 22c1.5-4 4-6 8-6s6.5 2 8 6" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case "certificate":
      return (
        <svg {...common} className="mx-auto">
          <rect x="7" y="4" width="14" height="16" rx="2" fill="none" stroke={color} strokeWidth="1.75" />
          <circle cx="14" cy="18" r="3" fill="none" stroke={color} strokeWidth="1.5" />
        </svg>
      );
    case "application":
      return (
        <svg {...common} className="mx-auto">
          <rect x="5" y="5" width="8" height="8" rx="1.5" fill="none" stroke={color} strokeWidth="1.75" />
          <rect x="15" y="5" width="8" height="8" rx="1.5" fill="none" stroke={color} strokeWidth="1.75" />
          <rect x="5" y="15" width="8" height="8" rx="1.5" fill="none" stroke={color} strokeWidth="1.75" />
          <rect x="15" y="15" width="8" height="8" rx="1.5" fill="none" stroke={color} strokeWidth="1.75" />
        </svg>
      );
    case "security":
      return (
        <svg {...common} className="mx-auto">
          <path d="M14 4l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V7l8-3z" fill="none" stroke={color} strokeWidth="1.75" />
        </svg>
      );
    case "configuration":
      return (
        <svg {...common} className="mx-auto">
          <circle cx="14" cy="14" r="5" fill="none" stroke={color} strokeWidth="1.75" />
          <path d="M14 6v2M14 20v2M6 14h2M20 14h2M8.5 8.5l1.5 1.5M18 18l1.5 1.5M8.5 19.5L10 18M18 10l1.5-1.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "identity":
      return (
        <svg {...common} className="mx-auto">
          <rect x="5" y="8" width="18" height="12" rx="2" fill="none" stroke={color} strokeWidth="1.75" />
          <circle cx="11" cy="14" r="2.5" fill="none" stroke={color} strokeWidth="1.5" />
          <path d="M16 12h5M16 16h3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg {...common} className="mx-auto">
          <path
            d="M8 16c-3 0-4-2-4-4s2-4 4-3c1-3 4-4 6-3 2-2 5-1 6 1 2 0 4 2 3 4 2 1 1 5-2 5H8z"
            fill="none"
            stroke={color}
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}
