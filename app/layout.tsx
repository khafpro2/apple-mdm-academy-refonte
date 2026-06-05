import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/seo/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Apple MDM Academy — Formation Apple, Jamf & Intune",
    template: "%s | Apple MDM Academy",
  },
  description: siteConfig.description,
  keywords: [
    "Apple MDM",
    "Jamf Pro",
    "Microsoft Intune",
    "Apple Business Manager",
    "formation Apple",
    "certification Jamf",
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: siteConfig.url },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
