import { siteConfig } from "@/lib/seo/site-config";

export function courseJsonLd({
  name,
  description,
  url,
  provider = siteConfig.name,
  level,
  duration,
}: {
  name: string;
  description: string;
  url: string;
  provider?: string;
  level?: string;
  duration?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    url,
    provider: {
      "@type": "Organization",
      name: provider,
      url: siteConfig.url,
    },
    ...(level && { educationalLevel: level }),
    ...(duration && { timeRequired: duration }),
    inLanguage: "fr",
    isAccessibleForFree: true,
    teaches: "Apple MDM, Jamf Pro, Microsoft Intune",
  };
}

export function examJsonLd({
  name,
  description,
  url,
  questionCount,
}: {
  name: string;
  description: string;
  url: string;
  questionCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name,
    description,
    url,
    educationalUse: "Exam preparation",
    inLanguage: "fr",
    ...(questionCount && { numberOfQuestions: questionCount }),
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/apple-mdm-academy-logo.png`,
    description:
      "Plateforme de formation certifiante Apple MDM — Jamf 100/200, Apple Certified IT Pro, Microsoft Intune.",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "French",
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
