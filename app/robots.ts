import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/auth/", "/checkout", "/account/", "/dashboard"] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
