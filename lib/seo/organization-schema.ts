import { siteConfig } from "@/lib/seo/site-config";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    inLanguage: "fr-FR",
    sameAs: [],
    offers: {
      "@type": "Offer",
      category: "Professional Training",
    },
  };
}
