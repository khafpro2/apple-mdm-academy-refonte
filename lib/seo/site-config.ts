const defaultUrl = "https://apple-mdm-academy-refonte.vercel.app";

function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return defaultUrl;
  try {
    new URL(raw);
    return raw.replace(/\/$/, "");
  } catch {
    return defaultUrl;
  }
}

export const siteConfig = {
  name: "Apple MDM Academy",
  description:
    "Formation professionnelle Apple MDM, Jamf Pro et Microsoft Intune en français. Cours premium, examens blancs et certificats.",
  url: resolveSiteUrl(),
  ogImage: "/og-default.png",
  locale: "fr_FR",
  twitter: "@applemdmacademy",
};
