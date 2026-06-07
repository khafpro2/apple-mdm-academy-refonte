export type BrandLogoVariant = "default" | "light" | "dark";

export type BrandAssetPaths = {
  logo: string;
  logoLight?: string;
  logoDark?: string;
};

export function brandLogoSrc(
  assets: BrandAssetPaths,
  variant: BrandLogoVariant = "default"
): string {
  if (variant === "light" && assets.logoLight) return assets.logoLight;
  if (variant === "dark" && assets.logoDark) return assets.logoDark;
  return assets.logo;
}
