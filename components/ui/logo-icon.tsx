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

/** Affiche un logo SVG local depuis /public/logos/ */
export function LogoIcon({ name, size = 20, className = "", alt }: LogoIconProps) {
  const label = alt ?? DEFAULT_ALT[name];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/logos/${name}.svg`}
      alt={label}
      width={size}
      height={size}
      className={`shrink-0 object-contain ${className}`}
      loading="lazy"
      decoding="async"
    />
  );
}

export type { LogoName };
export { LOGO_NAMES } from "@/lib/navigation/logo-names";
