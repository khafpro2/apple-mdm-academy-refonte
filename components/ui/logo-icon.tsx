import { JamfLogo } from "@/components/brands/JamfLogo";
import { IntuneLogo } from "@/components/brands/IntuneLogo";
import { MicrosoftLogo } from "@/components/brands/MicrosoftLogo";
import type { LogoName } from "@/lib/navigation/logo-names";

const DEFAULT_ALT: Record<LogoName, string> = {
  apple: "Apple",
  microsoft: "Microsoft",
  intune: "Microsoft Intune",
  jamf: "Jamf",
  supabase: "Supabase",
  github: "GitHub",
  vercel: "Vercel",
  shield: "Sécurité",
  certificate: "Certification",
  video: "Vidéo",
  lab: "Lab pratique",
  resource: "Ressource",
  dashboard: "Dashboard",
};

type LogoIconProps = {
  name: LogoName;
  size?: number;
  className?: string;
  alt?: string;
};

function Svg({ size, children }: { size: number; children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className="shrink-0"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

const icons: Record<LogoName, (size: number) => React.ReactNode> = {
  apple: (size) => (
    <Svg size={size}>
      <path
        fill="currentColor"
        d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
      />
    </Svg>
  ),
  microsoft: (size) => <MicrosoftLogo size={size} alt="Microsoft" />,
  intune: (size) => <IntuneLogo size={size} alt="Microsoft Intune" />,
  jamf: (size) => <JamfLogo variant="mark" size={size} alt="Jamf" />,
  supabase: (size) => (
    <Svg size={size}>
      <path
        fill="currentColor"
        d="M13.5 2.5c-.2 1.8-1.2 3.4-2.7 4.5-1.5 1.1-3.4 1.6-5.3 1.4 1.9 3.5 5.8 5.2 9.5 4.1 1.2-.4 2.2-1.1 3-2.1-2.8 1.2-6.1.2-7.9-2.4 2.4-.8 4.4-2.6 5.4-4.9 1.3 2.8 4.2 4.6 7.3 4.6 0-3.4-2.2-6.4-5.3-7.2-.3 1-.9 1.9-1.7 2.6 1.5-.2 2.9.3 4 1.4z"
      />
    </Svg>
  ),
  github: (size) => (
    <Svg size={size}>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.36-3.37-1.36-.45-1.17-1.11-1.48-1.11-1.48-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.36 1.11 2.94.85.09-.67.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.2 9.2 0 0112 6.84c.85.004 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.95-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.03 10.03 0 0022 12.26C22 6.58 17.52 2 12 2z"
      />
    </Svg>
  ),
  vercel: (size) => (
    <Svg size={size}>
      <path fill="currentColor" d="M12 2L2 19.5h20L12 2z" />
    </Svg>
  ),
  shield: (size) => (
    <Svg size={size}>
      <path
        d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  certificate: (size) => (
    <Svg size={size}>
      <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 14v5l4-2 4 2v-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M6 20h12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  ),
  video: (size) => (
    <Svg size={size}>
      <rect x="3" y="6" width="14" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path d="M17 10l4-2v8l-4-2" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </Svg>
  ),
  lab: (size) => (
    <Svg size={size}>
      <path d="M9 3h6l1 5H8l1-5z" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 8h8v10a2 2 0 01-2 2h-4a2 2 0 01-2-2V8z" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path d="M10 12h4M10 15h4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  ),
  resource: (size) => (
    <Svg size={size}>
      <path d="M6 4h9l3 3v13H6V4z" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path d="M15 4v3h3" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path d="M9 12h6M9 15h6" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  ),
  dashboard: (size) => (
    <Svg size={size}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <rect x="13" y="10" width="8" height="11" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
    </Svg>
  ),
};

/** Affiche un logo SVG inline (visible dans la sidebar et la navigation) */
export function LogoIcon({ name, size = 20, className = "", alt }: LogoIconProps) {
  const label = alt ?? DEFAULT_ALT[name];
  return (
    <span
      role="img"
      aria-label={label}
      className={`inline-flex items-center justify-center text-ink-secondary ${className}`}
    >
      {icons[name](size)}
    </span>
  );
}

export type { LogoName };
export { LOGO_NAMES } from "@/lib/navigation/logo-names";
