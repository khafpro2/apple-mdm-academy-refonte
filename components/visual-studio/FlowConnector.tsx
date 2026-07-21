import type { FlowConnectorVariant } from "@/lib/visual-studio/types";
import { connectorColors } from "@/lib/visual-studio/visual-tokens";

type FlowConnectorProps = {
  variant?: FlowConnectorVariant;
  label?: string;
  direction?: "horizontal" | "vertical";
  className?: string;
};

const VARIANT_LABELS: Record<FlowConnectorVariant, string> = {
  action: "Action",
  synchronization: "Synchronisation",
  dependency: "Dépendance",
  validation: "Validation",
  error: "Erreur",
  secure: "Flux sécurisé",
};

const STROKE_DASH: Partial<Record<FlowConnectorVariant, string>> = {
  synchronization: "4 3",
  dependency: "2 2",
  secure: undefined,
};

/**
 * Connecteur de flux avec variantes lisibles (couleur + motif + libellé).
 * L’information n’est jamais portée uniquement par la couleur.
 */
export function FlowConnector({
  variant = "action",
  label,
  direction = "horizontal",
  className = "",
}: FlowConnectorProps) {
  const color = connectorColors[variant];
  const accessibleLabel = label ?? VARIANT_LABELS[variant];
  const isHorizontal = direction === "horizontal";
  const dash = STROKE_DASH[variant];

  return (
    <div
      className={`inline-flex items-center justify-center ${isHorizontal ? "flex-row gap-1 px-1" : "flex-col gap-1 py-1"} ${className}`}
      role="img"
      aria-label={`Connecteur ${VARIANT_LABELS[variant]}${label ? ` : ${label}` : ""}`}
    >
      <svg
        width={isHorizontal ? 48 : 16}
        height={isHorizontal ? 16 : 48}
        viewBox={isHorizontal ? "0 0 48 16" : "0 0 16 48"}
        aria-hidden="true"
        focusable="false"
      >
        {isHorizontal ? (
          <>
            <line
              x1="2"
              y1="8"
              x2="38"
              y2="8"
              stroke={color}
              strokeWidth={variant === "secure" ? 2.5 : 2}
              strokeDasharray={dash}
              strokeLinecap="round"
            />
            <polygon points="38,3 46,8 38,13" fill={color} />
            {variant === "error" && (
              <circle cx="20" cy="8" r="3" fill={color} opacity={0.35} />
            )}
            {variant === "validation" && (
              <path d="M14 8 l2 2 4-4" fill="none" stroke={color} strokeWidth="1.5" />
            )}
          </>
        ) : (
          <>
            <line
              x1="8"
              y1="2"
              x2="8"
              y2="38"
              stroke={color}
              strokeWidth={variant === "secure" ? 2.5 : 2}
              strokeDasharray={dash}
              strokeLinecap="round"
            />
            <polygon points="3,38 8,46 13,38" fill={color} />
          </>
        )}
      </svg>
      <span
        className="max-w-[7rem] text-center text-[10px] font-medium leading-tight"
        style={{ color }}
      >
        {accessibleLabel}
      </span>
    </div>
  );
}

export function FlowConnectorLegend({ className = "" }: { className?: string }) {
  const variants: FlowConnectorVariant[] = [
    "action",
    "synchronization",
    "dependency",
    "validation",
    "error",
    "secure",
  ];
  return (
    <ul className={`flex flex-wrap gap-3 ${className}`} aria-label="Légende des connecteurs">
      {variants.map((v) => (
        <li key={v}>
          <FlowConnector variant={v} />
        </li>
      ))}
    </ul>
  );
}
