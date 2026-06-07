/** Modules professionnels 11–18 — Parcours Jamf Pro & Apple Enterprise */

export type ProModuleLesson = {
  slug: string;
  title: string;
  duration: string;
  points?: number;
};

export type ProModule = {
  number: number;
  slug: string;
  title: string;
  description: string;
  courseSlug: string;
  trackSlug: string;
  quizSlug: string;
  labSlug: string;
  badgeId: string;
  badgeName: string;
  duration: string;
  lessons: ProModuleLesson[];
};

export const proModules: ProModule[] = [
  {
    number: 11,
    slug: "module-11-intune-apple",
    title: "Microsoft Intune pour appareils Apple",
    description:
      "Configuration complète Intune + Apple Business Manager : tokens ADE, APNs, profils et conformité Apple.",
    courseSlug: "parcours-professionnel",
    trackSlug: "intune-mac",
    quizSlug: "quiz-module-11-intune-apple",
    labSlug: "abm-intune",
    badgeId: "badge-intune-apple-pro",
    badgeName: "Intune Apple Pro",
    duration: "4 h",
    lessons: [
      { slug: "m11-abm-intune", title: "Lier ABM à Intune", duration: "45 min", points: 45 },
      { slug: "m11-ade-sync", title: "Synchronisation ADE", duration: "40 min", points: 40 },
      { slug: "m11-apns-intune", title: "Certificats APNs dans Intune", duration: "35 min", points: 35 },
      { slug: "m11-profiles-apple", title: "Profils Apple iOS/macOS", duration: "50 min", points: 50 },
      { slug: "m11-compliance-ca", title: "Conformité et Conditional Access", duration: "45 min", points: 45 },
    ],
  },
  {
    number: 12,
    slug: "module-12-jamf-fundamentals",
    title: "Jamf Pro Fundamentals",
    description: "Présentation Jamf, architecture, inventaire, enrollment et Self Service.",
    courseSlug: "parcours-professionnel",
    trackSlug: "jamf-100",
    quizSlug: "quiz-module-12-jamf-fundamentals",
    labSlug: "jamf-discovery",
    badgeId: "badge-jamf-fundamentals",
    badgeName: "Jamf Fundamentals",
    duration: "3 h",
    lessons: [
      { slug: "m12-presentation-jamf", title: "Présentation de Jamf Pro", duration: "35 min", points: 35 },
      { slug: "m12-architecture-jamf", title: "Architecture Jamf Pro", duration: "40 min", points: 40 },
      { slug: "m12-inventaire-jamf", title: "Inventaire et recherche", duration: "35 min", points: 35 },
      { slug: "m12-enrollment-jamf", title: "Enrollment et PreStage", duration: "45 min", points: 45 },
      { slug: "m12-self-service", title: "Self Service", duration: "35 min", points: 35 },
    ],
  },
  {
    number: 13,
    slug: "module-13-smart-groups",
    title: "Smart Groups Jamf",
    description: "Smart Groups, critères, automatisation et groupes dynamiques.",
    courseSlug: "parcours-professionnel",
    trackSlug: "jamf-100",
    quizSlug: "quiz-module-13-smart-groups",
    labSlug: "jamf-smart-groups",
    badgeId: "badge-smart-groups-expert",
    badgeName: "Smart Groups Expert",
    duration: "2 h 30",
    lessons: [
      { slug: "m13-sg-intro", title: "Introduction aux Smart Groups", duration: "30 min", points: 30 },
      { slug: "m13-sg-criteres", title: "Critères et opérateurs", duration: "35 min", points: 35 },
      { slug: "m13-sg-automatisation", title: "Automatisation et workflows", duration: "35 min", points: 35 },
      { slug: "m13-sg-dynamiques", title: "Groupes dynamiques avancés", duration: "30 min", points: 30 },
      { slug: "m13-sg-bonnes-pratiques", title: "Bonnes pratiques Smart Groups", duration: "25 min", points: 25 },
    ],
  },
  {
    number: 14,
    slug: "module-14-policies",
    title: "Policies Jamf Pro",
    description: "Exécution, triggers, fréquence, scope et exclusions de policies.",
    courseSlug: "parcours-professionnel",
    trackSlug: "jamf-100",
    quizSlug: "quiz-module-14-policies",
    labSlug: "jamf-policies",
    badgeId: "badge-policy-administrator",
    badgeName: "Policy Administrator",
    duration: "2 h 30",
    lessons: [
      { slug: "m14-policy-execution", title: "Exécution des policies", duration: "30 min", points: 30 },
      { slug: "m14-policy-triggers", title: "Triggers et événements", duration: "35 min", points: 35 },
      { slug: "m14-policy-frequence", title: "Fréquence et planification", duration: "30 min", points: 30 },
      { slug: "m14-policy-scope", title: "Scope et ciblage", duration: "35 min", points: 35 },
      { slug: "m14-policy-exclusions", title: "Exclusions et exceptions", duration: "25 min", points: 25 },
      { slug: "m14-packages-deploiement", title: "Packages et déploiement logiciel", duration: "35 min", points: 35 },
    ],
  },
  {
    number: 15,
    slug: "module-15-scripts",
    title: "Scripts Jamf Pro",
    description: "Bash, variables Jamf, logs, debugging et bonnes pratiques.",
    courseSlug: "parcours-professionnel",
    trackSlug: "jamf-170",
    quizSlug: "quiz-module-15-scripts",
    labSlug: "jamf-scripts",
    badgeId: "badge-jamf-automation",
    badgeName: "Jamf Automation",
    duration: "3 h",
    lessons: [
      { slug: "m15-scripts-bash", title: "Scripts Bash dans Jamf", duration: "40 min", points: 40 },
      { slug: "m15-scripts-variables", title: "Variables et paramètres Jamf", duration: "35 min", points: 35 },
      { slug: "m15-scripts-logs", title: "Logs et traçabilité", duration: "30 min", points: 30 },
      { slug: "m15-scripts-debugging", title: "Debugging et dépannage", duration: "35 min", points: 35 },
      { slug: "m15-scripts-bonnes-pratiques", title: "Bonnes pratiques scripts", duration: "30 min", points: 30 },
    ],
  },
  {
    number: 16,
    slug: "module-16-patch",
    title: "Patch Management Jamf",
    description: "Gestion des correctifs, reporting, conformité et déploiement automatisé.",
    courseSlug: "parcours-professionnel",
    trackSlug: "jamf-200",
    quizSlug: "quiz-module-16-patch",
    labSlug: "jamf-patch-management",
    badgeId: "badge-patch-manager",
    badgeName: "Patch Manager",
    duration: "2 h 30",
    lessons: [
      { slug: "m16-patch-gestion", title: "Gestion des correctifs", duration: "35 min", points: 35 },
      { slug: "m16-patch-reporting", title: "Reporting et tableaux de bord", duration: "30 min", points: 30 },
      { slug: "m16-patch-conformite", title: "Conformité patch", duration: "35 min", points: 35 },
      { slug: "m16-patch-deploiement", title: "Déploiement automatisé", duration: "40 min", points: 40 },
      { slug: "m16-patch-chrome", title: "Cas pratique : Google Chrome", duration: "30 min", points: 30 },
    ],
  },
  {
    number: 17,
    slug: "module-17-protect",
    title: "Jamf Protect",
    description: "Sécurité endpoint, détection, alertes et conformité avec Jamf Protect.",
    courseSlug: "parcours-professionnel",
    trackSlug: "jamf-200",
    quizSlug: "quiz-module-17-protect",
    labSlug: "jamf-protect",
    badgeId: "badge-jamf-protect-specialist",
    badgeName: "Jamf Protect Specialist",
    duration: "2 h 30",
    lessons: [
      { slug: "m17-protect-endpoint", title: "Sécurité endpoint", duration: "35 min", points: 35 },
      { slug: "m17-protect-detection", title: "Détection et analytics", duration: "35 min", points: 35 },
      { slug: "m17-protect-alertes", title: "Alertes et réponse", duration: "30 min", points: 30 },
      { slug: "m17-protect-conformite", title: "Conformité CIS/NIST", duration: "35 min", points: 35 },
      { slug: "m17-protect-regles", title: "Règles de détection custom", duration: "30 min", points: 30 },
    ],
  },
  {
    number: 18,
    slug: "module-18-security",
    title: "Apple Security & Compliance",
    description: "FileVault, Gatekeeper, XProtect, SIP, Compliance et Zero Trust.",
    courseSlug: "parcours-professionnel",
    trackSlug: "apple-it-professional",
    quizSlug: "quiz-module-18-security",
    labSlug: "macos-security",
    badgeId: "badge-apple-security-expert",
    badgeName: "Apple Security Expert",
    duration: "3 h",
    lessons: [
      { slug: "m18-filevault", title: "FileVault et escrow MDM", duration: "40 min", points: 40 },
      { slug: "m18-gatekeeper", title: "Gatekeeper et notarisation", duration: "35 min", points: 35 },
      { slug: "m18-xprotect-sip", title: "XProtect et SIP", duration: "35 min", points: 35 },
      { slug: "m18-compliance", title: "Compliance et CIS Benchmark", duration: "40 min", points: 40 },
      { slug: "m18-zero-trust", title: "Zero Trust Apple", duration: "40 min", points: 40 },
    ],
  },
];

export function getProModule(number: number): ProModule | undefined {
  return proModules.find((m) => m.number === number);
}

export function getProModuleBySlug(slug: string): ProModule | undefined {
  return proModules.find((m) => m.slug === slug);
}

export function getProModulesForPath(moduleNumbers: number[]): ProModule[] {
  return moduleNumbers
    .map((n) => getProModule(n))
    .filter((m): m is ProModule => m !== undefined);
}
