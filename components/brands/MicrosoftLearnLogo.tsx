import { BrandLogoImage, type BrandLogoImageProps } from "@/components/brands/BrandLogoImage";
import {
  MICROSOFT_LEARN_BRAND,
  MICROSOFT_LEARN_LABEL,
} from "@/lib/brands/microsoft-learn";
import type { BrandLogoVariant } from "@/lib/brands/types";

type MicrosoftLearnLogoProps = {
  size?: number;
  className?: string;
  variant?: BrandLogoVariant;
  showLabel?: boolean;
  alt?: string;
};

/** Placeholder local Microsoft Learn — TODO: remplacer par asset officiel valide */
export function MicrosoftLearnLogo({
  size = 24,
  className = "",
  variant = "default",
  showLabel = false,
  alt = MICROSOFT_LEARN_LABEL,
}: MicrosoftLearnLogoProps) {
  const props: BrandLogoImageProps = {
    assets: MICROSOFT_LEARN_BRAND,
    alt,
    label: MICROSOFT_LEARN_LABEL,
    size,
    aspect: 120 / 24,
    className,
    variant,
    showLabel,
  };
  return <BrandLogoImage {...props} />;
}
