import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { siteConfig } from "@/lib/seo/site-config";
import { organizationJsonLd } from "@/lib/seo/organization-schema";
import { CookieNotice } from "@/components/analytics/cookie-notice";

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
    "Apple Device Support",
    "Apple IT Professional",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: { email: false, telephone: false },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    site: siteConfig.twitter,
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: siteConfig.url },
  category: "education",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgLd = organizationJsonLd();
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Aller au contenu principal
        </a>
        {children}
        <CookieNotice />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
