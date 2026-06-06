import { LogoIcon } from "@/components/ui/logo-icon";
import type { LogoName } from "@/lib/navigation/logo-names";

type TrackLogoProps = {
  logo: LogoName;
  size?: number;
  alt?: string;
  className?: string;
};

/** Logo de parcours avec fond discret — remplace les emojis dans les cartes formation */
export function TrackLogo({ logo, size = 28, alt, className = "" }: TrackLogoProps) {
  return (
    <span
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/8 ${className}`}
    >
      <LogoIcon name={logo} size={size} alt={alt} className="text-ink" />
    </span>
  );
}
