import { siteConfig } from "@/lib/seo/site-config";

export function courseJsonLd(course: {
  title: string;
  description: string;
  slug: string;
  duration: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    url: `${siteConfig.url}/cours/${course.slug}`,
    inLanguage: "fr-FR",
    educationalLevel: "Professional",
    timeRequired: course.duration,
    isAccessibleForFree: true,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: course.duration,
    },
  };
}

export function examPageJsonLd({
  name,
  description,
  slug,
  questionCount,
}: {
  name: string;
  description: string;
  slug: string;
  questionCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name,
    description,
    url: `${siteConfig.url}/examens/${slug}`,
    inLanguage: "fr-FR",
    educationalUse: "Exam preparation",
    ...(questionCount && { numberOfQuestions: questionCount }),
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/apple-mdm-academy-logo.png`,
    description:
      "Plateforme de formation certifiante Apple MDM — Jamf 100/200, Apple Certified IT Pro, Microsoft Intune pour Apple.",
    knowsAbout: [
      "Apple MDM", "Jamf Pro", "Microsoft Intune", "Apple Business Manager",
      "FileVault", "Declarative Device Management", "Apple Certified IT Professional",
    ],
    inLanguage: "fr",
  };
}
