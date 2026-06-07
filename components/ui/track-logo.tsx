import { EntraLogo } from "@/components/brands/EntraLogo";
import { IntuneLogo } from "@/components/brands/IntuneLogo";
import { JamfLogo } from "@/components/brands/JamfLogo";
import { MicrosoftLogo } from "@/components/brands/MicrosoftLogo";
import { LogoIcon } from "@/components/ui/logo-icon";
import type { LogoName } from "@/lib/navigation/logo-names";

type TrackLogoProps = {
  logo: LogoName;
  size?: number;
  alt?: string;
  className?: string;
  /** Slug parcours — permet Entra ID pour azure-for-apple-admins */
  trackSlug?: string;
};

/** Logo de parcours avec fond discret — marques officielles centralisées */
export function TrackLogo({ logo, size = 28, alt, className = "", trackSlug }: TrackLogoProps) {
  const label = alt ?? "Formation";

  const brandLogo = (() => {
    if (logo === "jamf") return <JamfLogo variant="mark" size={size} alt={label} />;
    if (logo === "intune") return <IntuneLogo size={size} alt={label} />;
    if (logo === "microsoft" && trackSlug === "azure-for-apple-admins") {
      return <EntraLogo size={size} alt={label} />;
    }
    if (logo === "microsoft") return <MicrosoftLogo size={size} alt={label} />;
    return <LogoIcon name={logo} size={size} alt={alt} className="text-ink" />;
  })();

  return (
    <span
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/8 ${className}`}
    >
      {brandLogo}
    </span>
  );
}
