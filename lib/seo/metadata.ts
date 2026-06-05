import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo/site-config";

type PageMetadataOptions = {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
  ogType?: "website" | "article";
};

export function buildPageMetadata({
  title,
  description,
  path = "",
  noIndex = false,
  ogType = "website",
}: PageMetadataOptions): Metadata {
  const canonical = `${siteConfig.url}${path}`;
  const ogTitle = title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: ogType,
      locale: siteConfig.locale,
      url: canonical,
      siteName: siteConfig.name,
      title: ogTitle,
      description,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      site: siteConfig.twitter,
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
