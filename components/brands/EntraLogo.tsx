import { BrandLogoImage, type BrandLogoImageProps } from "@/components/brands/BrandLogoImage";
import { ENTRA_BRAND, ENTRA_LABEL } from "@/lib/brands/entra";
import type { BrandLogoVariant } from "@/lib/brands/types";

type EntraLogoProps = {
  size?: number;
  className?: string;
  variant?: BrandLogoVariant;
  showLabel?: boolean;
  alt?: string;
};

/** Logo Microsoft Entra ID */
export function EntraLogo({
  size = 24,
  className = "",
  variant = "default",
  showLabel = false,
  alt = ENTRA_LABEL,
}: EntraLogoProps) {
  const props: BrandLogoImageProps = {
    assets: ENTRA_BRAND,
    alt,
    label: ENTRA_LABEL,
    size,
    aspect: 96 / 24,
    className,
    variant,
    showLabel,
  };
  return <BrandLogoImage {...props} />;
}
