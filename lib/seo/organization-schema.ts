import { siteConfig } from "@/lib/seo/site-config";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    inLanguage: "fr-FR",
    logo: `${siteConfig.url}/opengraph-image`,
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${siteConfig.url}/support`,
      availableLanguage: "French",
    },
    offers: {
      "@type": "Offer",
      category: "Professional Training",
      priceCurrency: "EUR",
    },
  };
}
