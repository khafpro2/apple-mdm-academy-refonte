export const LOGO_NAMES = [
  "apple",
  "microsoft",
  "intune",
  "jamf",
  "supabase",
  "github",
  "vercel",
  "shield",
  "certificate",
  "video",
  "lab",
  "resource",
  "dashboard",
] as const;

export type LogoName = (typeof LOGO_NAMES)[number];
