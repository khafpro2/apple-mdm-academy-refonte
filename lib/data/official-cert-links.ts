/** Liens vers certifications officielles — nos examens sont des simulations prep */

export const appleTrainingResources = {
  resourcesUrl: "https://training.apple.com/resources",
  trainingUrl: "https://training.apple.com/",
  practiceExamUrl: "https://training.apple.com/resources",
  pearsonVueUrl: "https://wsr.pearsonvue.com/testtaker/registration/SelectExamPage/APPLE",
  credlyDirectoryUrl: "https://www.credly.com/organizations/apple/directory",
  identityGuidelinesUrl:
    "https://www.apple.com/certificateauthority/Apple_Identity_Guidelines_for_Channel_Affiliates_and_Apple_Certified_Individuals.pdf",
  examFaqUrl: "https://training.apple.com/resources",
  retakeDelayDays: 7,
  maxAttempts: 4,
  practiceExamDuration: "2 h",
  badgeValidity: "généralement 2 ans, selon la date affichée dans Credly",
} as const;

export type OfficialCertLink = {
  id: string;
  label: string;
  provider: string;
  url: string;
  note: string;
};

export const officialCertLinks: OfficialCertLink[] = [
  {
    id: "jamf-100",
    label: "Jamf Certified Associate (Jamf 100)",
    provider: "Jamf",
    url: "https://www.jamf.com/training-and-certifications/",
    note: "Examen officiel via Jamf Training Catalog / Pearson VUE selon la session.",
  },
  {
    id: "jamf-200",
    label: "Jamf Certified Admin (Jamf 200)",
    provider: "Jamf",
    url: "https://www.jamf.com/training-and-certifications/",
    note: "Prérequis Jamf 100. Cours officiels Jamf recommandés avant l'examen.",
  },
  {
    id: "jamf-300",
    label: "Jamf 300 — Enterprise Admin",
    provider: "Jamf",
    url: "https://www.jamf.com/training-and-certifications/",
    note: "Certification avancée Jamf — notre parcours Jamf 300 Prep prépare aux domaines couverts.",
  },
  {
    id: "apple-it-pro",
    label: "Apple Certified IT Professional",
    provider: "Apple / Pearson VUE",
    url: appleTrainingResources.trainingUrl,
    note: "Examen Apple planifié via Pearson VUE. Notre examen blanc prépare et simule, il ne remplace pas l'examen officiel.",
  },
  {
    id: "intune",
    label: "Microsoft Intune / Endpoint Administrator",
    provider: "Microsoft Learn",
    url: "https://learn.microsoft.com/credentials/",
    note: "Certifications Microsoft via Learn. Intune Apple Advanced complète MD-102/MD-101.",
  },
];

export function getOfficialCertLinkForExamRoute(routeSlug: string): OfficialCertLink | undefined {
  if (routeSlug.includes("jamf-300")) return officialCertLinks.find((l) => l.id === "jamf-300");
  if (routeSlug.includes("jamf-400")) return officialCertLinks.find((l) => l.id === "jamf-300");
  if (routeSlug.includes("jamf-200")) return officialCertLinks.find((l) => l.id === "jamf-200");
  if (routeSlug.includes("jamf-100")) return officialCertLinks.find((l) => l.id === "jamf-100");
  if (routeSlug.includes("apple")) return officialCertLinks.find((l) => l.id === "apple-it-pro");
  if (routeSlug.includes("intune")) return officialCertLinks.find((l) => l.id === "intune");
  return undefined;
}
