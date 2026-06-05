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
    isAccessibleForFree: false,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: course.duration,
    },
  };
}
