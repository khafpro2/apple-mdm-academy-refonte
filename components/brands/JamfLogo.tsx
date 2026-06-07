import {
  JAMF_MARK_FILL,
  JAMF_MARK_PATH,
  JAMF_MARK_VIEWBOX,
  jamfLogoSrc,
  type JamfLogoTheme,
} from "@/lib/brands/jamf";

export type JamfLogoVariant = "full" | "mark";

type JamfLogoProps = {
  /** Logo complet (icône + wordmark) ou pictogramme seul */
  variant?: JamfLogoVariant;
  /** default = #778eb1 · dark = #444444 · light = blanc */
  theme?: JamfLogoTheme;
  /** Hauteur en px (largeur auto selon variant) */
  size?: number;
  className?: string;
  alt?: string;
};

const FULL_ASPECT = 118 / 42;
const MARK_ASPECT = 42.9 / 42;

/** Logo officiel Jamf — pictogramme ou logo complet selon le contexte */
export function JamfLogo({
  variant = "mark",
  theme = "default",
  size = 24,
  className = "",
  alt = "Jamf",
}: JamfLogoProps) {
  if (variant === "full") {
    const height = size;
    const width = Math.round(height * FULL_ASPECT);
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={jamfLogoSrc(theme)}
        alt={alt}
        width={width}
        height={height}
        className={`inline-block shrink-0 object-contain ${className}`}
        loading="lazy"
        decoding="async"
      />
    );
  }

  const height = size;
  const width = Math.round(height * MARK_ASPECT);
  const fill = JAMF_MARK_FILL[theme];

  return (
    <svg
      width={width}
      height={height}
      viewBox={JAMF_MARK_VIEWBOX}
      className={`inline-block shrink-0 ${className}`}
      role="img"
      aria-label={alt}
      focusable="false"
    >
      <path fill={fill} d={JAMF_MARK_PATH} />
    </svg>
  );
}
