/** Apple MDM Academy Enterprise Icon System — palette tokens */
export const enterpriseIconColors = {
  navy: "#0B102B",
  blue: "#2563EB",
  purple: "#6D4AFF",
  cyan: "#13B8D3",
  microsoftBlue: "#0078D4",
  microsoftGreen: "#16A34A",
  jamfBlue: "#0074C8",
  jamfCyan: "#18B6D9",
  green: "#22C55E",
  orange: "#F59E0B",
  red: "#EF4444",
  gray900: "#0F172A",
  gray600: "#475569",
  gray400: "#94A3B8",
  gray200: "#E2E8F0",
  gray100: "#F1F5F9",
  white: "#FFFFFF",
} as const;

export type EnterpriseIconColor = keyof typeof enterpriseIconColors;

/** Icon grid: viewBox 0 0 64 64, useful zone 8→56, min margin 8px */
export const iconGrid = {
  viewBox: "0 0 64 64",
  strokeWidth: 2.5,
  cornerRadius: { sm: 6, md: 8, lg: 12 },
  margin: 8,
  usefulMin: 8,
  usefulMax: 56,
} as const;

/** Component card dimensions (Freeform-ready) */
export const componentDimensions = {
  smallCard: { width: 160, height: 96 },
  serviceCard: { width: 240, height: 128 },
  architectureCard: { width: 320, height: 180 },
  diagramNode: { width: 200, height: 112 },
  deviceCard: { width: 180, height: 140 },
  userCard: { width: 180, height: 120 },
  policyCard: { width: 220, height: 140 },
  appCard: { width: 200, height: 128 },
  certCard: { width: 200, height: 128 },
  stepCard: { width: 220, height: 128 },
  comparisonCard: { width: 480, height: 280 },
  summaryCard: { width: 600, height: 280 },
} as const;
