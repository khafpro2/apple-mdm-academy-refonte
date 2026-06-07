/** Parcours certification — Jamf 100, Jamf 200, Apple Enterprise */

import type { LogoName } from "@/lib/navigation/logo-names";

export type CertificationPath = {
  slug: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  logo: LogoName;
  moduleNumbers: number[];
  examQuizSlug: string;
  passingScore: number;
  certId: string;
};

export const certificationPaths: CertificationPath[] = [
  {
    slug: "parcours-jamf-100",
    title: "Parcours Certification Jamf 100",
    description:
      "Modules 12 à 14 : fondamentaux Jamf Pro 11.16, Smart Groups, Policies et Packages. Prépare Jamf Certified Associate (Jamf 100).",
    level: "Pro",
    duration: "8 h",
    logo: "jamf",
    moduleNumbers: [12, 13, 14],
    examQuizSlug: "examen-jamf-100-blanc",
    passingScore: 75,
    certId: "jamf-100-path",
  },
  {
    slug: "parcours-jamf-200",
    title: "Parcours Certification Jamf 200",
    description:
      "Modules 15 à 18 : scripts, patch management 11.16, Self Service avancé, Jamf Protect et sécurité Apple. Prépare Jamf Certified Admin (Jamf 200).",
    level: "Expert",
    duration: "12 h",
    logo: "jamf",
    moduleNumbers: [15, 16, 17, 18],
    examQuizSlug: "examen-jamf-200",
    passingScore: 75,
    certId: "jamf-200-path",
  },
  {
    slug: "parcours-apple-enterprise",
    title: "Parcours Apple Enterprise",
    description:
      "Parcours complet modules 1 à 18 : Intune Apple, Jamf Pro, sécurité et conformité enterprise.",
    level: "Expert",
    duration: "40 h",
    logo: "apple",
    moduleNumbers: Array.from({ length: 18 }, (_, i) => i + 1),
    examQuizSlug: "examen-apple-it-pro",
    passingScore: 80,
    certId: "apple-enterprise-path",
  },
];

/** Modules 1–10 = contenu existant (tracks Apple + Intune) */
export const foundationModuleNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function getCertificationPath(slug: string): CertificationPath | undefined {
  return certificationPaths.find((p) => p.slug === slug);
}

export function getCertificationPathSlugs(): string[] {
  return certificationPaths.map((p) => p.slug);
}
