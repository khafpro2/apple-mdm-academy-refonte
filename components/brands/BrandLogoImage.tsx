import type { BrandAssetPaths, BrandLogoVariant } from "@/lib/brands/types";
import { brandLogoSrc } from "@/lib/brands/types";

export type BrandLogoImageProps = {
  assets: BrandAssetPaths;
  alt: string;
  label?: string;
  size?: number;
  aspect?: number;
  className?: string;
  variant?: BrandLogoVariant;
  showLabel?: boolean;
};

/** Affichage image SVG de marque — proportions respectées, label optionnel */
export function BrandLogoImage({
  assets,
  alt,
  label,
  size = 24,
  aspect = 1,
  className = "",
  variant = "default",
  showLabel = false,
}: BrandLogoImageProps) {
  const height = size;
  const width = Math.round(height * aspect);
  const src = brandLogoSrc(assets, variant);

  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="inline-block shrink-0 object-contain"
      loading="lazy"
      decoding="async"
    />
  );

  if (!showLabel) {
    return <span className={`inline-flex items-center ${className}`}>{image}</span>;
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {image}
      <span className="text-sm font-semibold text-ink">{label ?? alt}</span>
    </span>
  );
}
