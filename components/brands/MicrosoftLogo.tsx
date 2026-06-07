import { BrandLogoImage, type BrandLogoImageProps } from "@/components/brands/BrandLogoImage";
import { MICROSOFT_BRAND, MICROSOFT_LABEL } from "@/lib/brands/microsoft";
import type { BrandLogoVariant } from "@/lib/brands/types";

type MicrosoftLogoProps = {
  size?: number;
  className?: string;
  variant?: BrandLogoVariant;
  showLabel?: boolean;
  alt?: string;
};

/** Placeholder local Microsoft — TODO: remplacer par asset officiel valide */
export function MicrosoftLogo({
  size = 24,
  className = "",
  variant = "default",
  showLabel = false,
  alt = MICROSOFT_LABEL,
}: MicrosoftLogoProps) {
  const props: BrandLogoImageProps = {
    assets: MICROSOFT_BRAND,
    alt,
    label: MICROSOFT_LABEL,
    size,
    aspect: 1,
    className,
    variant,
    showLabel,
  };
  return <BrandLogoImage {...props} />;
}
