import { siteConfig } from "@/lib/seo/site-config";

export function examJsonLd(exam: {
  title: string;
  description: string;
  routeSlug: string;
  durationMinutes: number;
  questionCount: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: exam.title,
    description: exam.description,
    url: `${siteConfig.url}/examens/${exam.routeSlug}`,
    inLanguage: "fr-FR",
    educationalLevel: "Professional",
    numberOfQuestions: exam.questionCount,
    timeRequired: `PT${exam.durationMinutes}M`,
    provider: {
      "@type": "EducationalOrganization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}
