import { BrandLogoImage, type BrandLogoImageProps } from "@/components/brands/BrandLogoImage";
import { INTUNE_BRAND, INTUNE_LABEL } from "@/lib/brands/intune";
import type { BrandLogoVariant } from "@/lib/brands/types";

type IntuneLogoProps = {
  size?: number;
  className?: string;
  variant?: BrandLogoVariant;
  showLabel?: boolean;
  alt?: string;
};

/** Placeholder local Microsoft Intune — TODO: remplacer par asset officiel valide */
export function IntuneLogo({
  size = 24,
  className = "",
  variant = "default",
  showLabel = false,
  alt = INTUNE_LABEL,
}: IntuneLogoProps) {
  const props: BrandLogoImageProps = {
    assets: INTUNE_BRAND,
    alt,
    label: INTUNE_LABEL,
    size,
    aspect: 1,
    className,
    variant,
    showLabel,
  };
  return <BrandLogoImage {...props} />;
}
