/** Chemins des assets logo Jamf officiels (public/brands/jamf/) */
export const JAMF_BRAND = {
  logo: "/brands/jamf/jamf-logo.svg",
  logoDark: "/brands/jamf/jamf-logo-dark.svg",
  logoLight: "/brands/jamf/jamf-logo-light.svg",
} as const;

const JAMF_BRAND_THEME_MAP = {
  default: JAMF_BRAND.logo,
  dark: JAMF_BRAND.logoDark,
  light: JAMF_BRAND.logoLight,
} as const;

export type JamfLogoTheme = keyof typeof JAMF_BRAND_THEME_MAP;

/** Pictogramme officiel Jamf (forme « J ») — source Jamf Brand Style Guide */
export const JAMF_MARK_PATH =
  "M33.6,7 C28.1,7 24.8,9.3 23.3,14.3 L19.5,26.2 C18.1,30.1 15.8,31.7 11.7,31.7 L2.2,31.7 C1,31.7 0,32.7 0,33.9 L0,40 C0,41.1 0.9,42 2.1,42 L40.7,42 C41.9,42 42.9,41 42.9,39.8 L42.9,9.1 C42.9,7.9 42,7 40.8,7 L33.6,7 Z M2.3,0 C1.1,0 0,1.1 0,2.3 L0,18.5 C0,19.8 1,20.8 2.3,20.8 L10.5,20.8 C14.2,20.8 19.4,20 20.8,13.4 C22.2,6.7 23,2.8 C23.3,1.3 22.2,0 20.7,0 L2.3,0 Z";

export const JAMF_MARK_VIEWBOX = "0 0 42.9 42";

export const JAMF_MARK_FILL = {
  default: "#778eb1",
  dark: "#444444",
  light: "#ffffff",
} as const;

export function jamfLogoSrc(theme: JamfLogoTheme = "default"): string {
  return JAMF_BRAND_THEME_MAP[theme];
}
