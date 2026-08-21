/**
 * Apple Enterprise Learning Visual System — jetons visuels.
 * Direction artistique du Studio visuel (distincte des tokens UI globaux du site).
 */

export const visualStudioColors = {
  navy: "#0B102B",
  blue: "#2563EB",
  purple: "#6D4AFF",
  cyan: "#13B8D3",
  green: "#22C55E",
  orange: "#F59E0B",
  red: "#EF4444",
  surface: "#FFFFFF",
  background: "#F4F6FA",
  text: "#0F172A",
  muted: "#64748B",
  border: "#DCE3ED",
} as const;

export type VisualStudioColorKey = keyof typeof visualStudioColors;

export const domainColors = {
  apple: { primary: visualStudioColors.navy, secondary: visualStudioColors.purple },
  jamf: { primary: visualStudioColors.blue, secondary: visualStudioColors.cyan },
  microsoft: { primary: visualStudioColors.blue, secondary: visualStudioColors.green },
  compliance: { primary: visualStudioColors.green, secondary: visualStudioColors.cyan },
  security: { primary: visualStudioColors.navy, secondary: visualStudioColors.green },
  warning: { primary: visualStudioColors.orange, secondary: visualStudioColors.orange },
  error: { primary: visualStudioColors.red, secondary: visualStudioColors.red },
  inactive: { primary: visualStudioColors.muted, secondary: visualStudioColors.border },
} as const;

export const connectorColors = {
  action: visualStudioColors.blue,
  synchronization: visualStudioColors.cyan,
  dependency: visualStudioColors.purple,
  validation: visualStudioColors.green,
  error: visualStudioColors.red,
  secure: visualStudioColors.navy,
} as const;

export const verificationLabels: Record<
  import("./types").VerificationStatus,
  { label: string; shortLabel: string; tone: "success" | "info" | "warning" | "neutral" }
> = {
  "source-verified": {
    label: "SOURCE-VERIFIED",
    shortLabel: "Sources vérifiées",
    tone: "success",
  },
  "technically-reviewed": {
    label: "TECHNICALLY REVIEWED",
    shortLabel: "Revue technique",
    tone: "info",
  },
  "draft-needs-review": {
    label: "DRAFT — NEEDS REVIEW",
    shortLabel: "Brouillon à revoir",
    tone: "warning",
  },
  "to-verify": {
    label: "À VÉRIFIER",
    shortLabel: "À vérifier",
    tone: "neutral",
  },
};

export const visualStudioMeta = {
  name: "Apple Enterprise Learning Visual System",
  aspectRatio: "16 / 9",
  exportViewport: { width: 1920, height: 1080 },
  safetyInsetPercent: 6,
  disclaimer: "Apple MDM Academy est une plateforme indépendante.",
} as const;

/** Classes Tailwind utilitaires alignées sur la palette Studio */
export const visualStudioClassNames = {
  pageBg: "bg-[#F4F6FA]",
  card: "rounded-2xl border border-[#DCE3ED] bg-white shadow-sm",
  title: "text-[#0F172A] font-semibold tracking-tight",
  muted: "text-[#64748B]",
  navy: "text-[#0B102B]",
  focus:
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]",
} as const;
