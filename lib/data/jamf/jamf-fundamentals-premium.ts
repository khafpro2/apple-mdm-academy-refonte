/**
 * Parcours Jamf Fundamentals Premium — 15 modules francophones.
 * Contenu original Apple MDM Academy (référence pédagogique Jamf Training).
 */

export type JamfFundamentalsModuleId =
  | "intro-jamf-pro"
  | "interface-jamf"
  | "inventory"
  | "computers"
  | "mobile-devices"
  | "smart-groups"
  | "static-groups"
  | "policies"
  | "configuration-profiles"
  | "self-service"
  | "packages"
  | "scripts"
  | "patch-management"
  | "reporting"
  | "troubleshooting";

export type JamfContentStatus = "todo" | "in-progress" | "done";

export type JamfFundamentalsModule = {
  id: JamfFundamentalsModuleId;
  order: number;
  title: string;
  description: string;
  courseSlug: string;
  lessonSlug: string;
  proModuleSlug?: string;
  videoSlug: string;
  quizSlug: string;
  labSlug: string;
  resourceSlug: string;
  storyboardSlug: string;
  screenshotSlug: string;
  trackSlug: "jamf-100" | "jamf-170" | "jamf-200";
  certificationLevel: "Jamf 100" | "Jamf 170" | "Jamf 200";
};

export const JAMF_FUNDAMENTALS_MODULES: JamfFundamentalsModule[] = [
  {
    id: "intro-jamf-pro",
    order: 1,
    title: "Introduction à Jamf Pro",
    description: "Écosystème Jamf, rôle MDM Apple, composants serveur et cas d'usage enterprise.",
    courseSlug: "jamf-fundamentals",
    lessonSlug: "jf-intro-jamf-pro",
    proModuleSlug: "module-12-jamf-fundamentals",
    videoSlug: "jamf-pro-fundamentals",
    quizSlug: "quiz-jamf-intro",
    labSlug: "jamf-discovery",
    resourceSlug: "jamf-guide-intro",
    storyboardSlug: "jamf-pro-fundamentals",
    screenshotSlug: "jamf-dashboard",
    trackSlug: "jamf-100",
    certificationLevel: "Jamf 100",
  },
  {
    id: "interface-jamf",
    order: 2,
    title: "Interface Jamf",
    description: "Dashboard, navigation, Sites, RBAC admin et recherche globale.",
    courseSlug: "jamf-fundamentals",
    lessonSlug: "jf-interface-jamf",
    proModuleSlug: "module-12-jamf-fundamentals",
    videoSlug: "jamf-dashboard",
    quizSlug: "quiz-jamf-interface",
    labSlug: "jamf-discovery",
    resourceSlug: "jamf-guide-interface",
    storyboardSlug: "jamf-dashboard",
    screenshotSlug: "jamf-dashboard",
    trackSlug: "jamf-100",
    certificationLevel: "Jamf 100",
  },
  {
    id: "inventory",
    order: 3,
    title: "Inventory",
    description: "Inventaire Jamf, Extension Attributes, Advanced Search et reporting ad hoc.",
    courseSlug: "jamf-fundamentals",
    lessonSlug: "jf-inventory",
    proModuleSlug: "module-12-jamf-fundamentals",
    videoSlug: "jamf-inventory",
    quizSlug: "quiz-jamf-inventory",
    labSlug: "jamf-discovery",
    resourceSlug: "jamf-guide-inventory",
    storyboardSlug: "jamf-inventory",
    screenshotSlug: "jamf-reporting",
    trackSlug: "jamf-100",
    certificationLevel: "Jamf 100",
  },
  {
    id: "computers",
    order: 4,
    title: "Computers",
    description: "Fiche Mac, Management History, actions distantes et inventaire détaillé.",
    courseSlug: "jamf-fundamentals",
    lessonSlug: "jf-computers",
    videoSlug: "jamf-computers",
    quizSlug: "quiz-jamf-computers",
    labSlug: "jamf-discovery",
    resourceSlug: "jamf-guide-computers",
    storyboardSlug: "jamf-computers",
    screenshotSlug: "jamf-computers",
    trackSlug: "jamf-100",
    certificationLevel: "Jamf 100",
  },
  {
    id: "mobile-devices",
    order: 5,
    title: "Mobile Devices",
    description: "iPhone et iPad supervisés, profils mobiles, apps et actions MDM.",
    courseSlug: "jamf-fundamentals",
    lessonSlug: "jf-mobile-devices",
    videoSlug: "jamf-mobile-devices",
    quizSlug: "quiz-jamf-mobile-devices",
    labSlug: "jamf-mobile-devices",
    resourceSlug: "jamf-guide-mobile-devices",
    storyboardSlug: "jamf-mobile-devices",
    screenshotSlug: "jamf-mobile-devices",
    trackSlug: "jamf-100",
    certificationLevel: "Jamf 100",
  },
  {
    id: "smart-groups",
    order: 6,
    title: "Smart Groups",
    description: "Groupes dynamiques, critères AND/OR, preview membership et scope.",
    courseSlug: "jamf-fundamentals",
    lessonSlug: "jf-smart-groups",
    proModuleSlug: "module-13-smart-groups",
    videoSlug: "jamf-smart-groups",
    quizSlug: "quiz-module-13-smart-groups",
    labSlug: "jamf-smart-groups",
    resourceSlug: "jamf-guide-smart-groups",
    storyboardSlug: "jamf-smart-groups",
    screenshotSlug: "jamf-smart-groups",
    trackSlug: "jamf-100",
    certificationLevel: "Jamf 100",
  },
  {
    id: "static-groups",
    order: 7,
    title: "Static Groups",
    description: "Groupes manuels, VIP, labo, exclusions et complémentarité avec Smart Groups.",
    courseSlug: "jamf-fundamentals",
    lessonSlug: "jf-static-groups",
    videoSlug: "jamf-static-groups",
    quizSlug: "quiz-jamf-static-groups",
    labSlug: "jamf-static-groups",
    resourceSlug: "jamf-guide-static-groups",
    storyboardSlug: "jamf-static-groups",
    screenshotSlug: "jamf-static-groups",
    trackSlug: "jamf-100",
    certificationLevel: "Jamf 100",
  },
  {
    id: "policies",
    order: 8,
    title: "Policies",
    description: "Triggers, payloads, fréquence, scope, exclusions et Policy Logs.",
    courseSlug: "jamf-fundamentals",
    lessonSlug: "jf-policies",
    proModuleSlug: "module-14-policies",
    videoSlug: "jamf-policies",
    quizSlug: "quiz-module-14-policies",
    labSlug: "jamf-policies",
    resourceSlug: "jamf-guide-policies",
    storyboardSlug: "jamf-policies",
    screenshotSlug: "jamf-policies",
    trackSlug: "jamf-100",
    certificationLevel: "Jamf 100",
  },
  {
    id: "configuration-profiles",
    order: 9,
    title: "Configuration Profiles",
    description: "Payloads MDM Wi-Fi, VPN, FileVault, restrictions et PPPC.",
    courseSlug: "jamf-fundamentals",
    lessonSlug: "jf-configuration-profiles",
    proModuleSlug: "module-12-jamf-fundamentals",
    videoSlug: "jamf-configuration-profiles",
    quizSlug: "quiz-jamf-configuration-profiles",
    labSlug: "jamf-discovery",
    resourceSlug: "jamf-guide-configuration-profiles",
    storyboardSlug: "jamf-configuration-profiles",
    screenshotSlug: "jamf-configuration-profiles",
    trackSlug: "jamf-100",
    certificationLevel: "Jamf 100",
  },
  {
    id: "self-service",
    order: 10,
    title: "Self Service",
    description: "Catalogue utilisateur, policies Self Service, branding et UX.",
    courseSlug: "jamf-fundamentals",
    lessonSlug: "jf-self-service",
    videoSlug: "jamf-self-service",
    quizSlug: "quiz-jamf-self-service",
    labSlug: "jamf-self-service",
    resourceSlug: "jamf-guide-self-service",
    storyboardSlug: "jamf-self-service",
    screenshotSlug: "jamf-self-service",
    trackSlug: "jamf-100",
    certificationLevel: "Jamf 100",
  },
  {
    id: "packages",
    order: 11,
    title: "Packages",
    description: "Distribution Points, PKG/DMG, policy Packages et cache.",
    courseSlug: "jamf-fundamentals",
    lessonSlug: "jf-packages",
    proModuleSlug: "module-14-policies",
    videoSlug: "jamf-packages",
    quizSlug: "quiz-jamf-packages",
    labSlug: "jamf-packages",
    resourceSlug: "jamf-guide-packages",
    storyboardSlug: "jamf-packages",
    screenshotSlug: "jamf-packages",
    trackSlug: "jamf-100",
    certificationLevel: "Jamf 100",
  },
  {
    id: "scripts",
    order: 12,
    title: "Scripts",
    description: "Scripts Bash Jamf, variables, logs, idempotence et Policy Logs.",
    courseSlug: "jamf-fundamentals",
    lessonSlug: "jf-scripts",
    proModuleSlug: "module-15-scripts",
    videoSlug: "jamf-scripts",
    quizSlug: "quiz-module-15-scripts",
    labSlug: "jamf-scripts",
    resourceSlug: "jamf-guide-scripts",
    storyboardSlug: "jamf-scripts",
    screenshotSlug: "jamf-scripts",
    trackSlug: "jamf-170",
    certificationLevel: "Jamf 170",
  },
  {
    id: "patch-management",
    order: 13,
    title: "Patch Management",
    description: "Software Titles, patch policies, eligible devices et deadlines.",
    courseSlug: "jamf-fundamentals",
    lessonSlug: "jf-patch-management",
    proModuleSlug: "module-16-patch",
    videoSlug: "jamf-patch-management",
    quizSlug: "quiz-module-16-patch",
    labSlug: "jamf-patch-management",
    resourceSlug: "jamf-guide-patch-management",
    storyboardSlug: "jamf-patch-management",
    screenshotSlug: "jamf-patch-management",
    trackSlug: "jamf-200",
    certificationLevel: "Jamf 200",
  },
  {
    id: "reporting",
    order: 14,
    title: "Reporting",
    description: "Advanced Search, rapports inventaire, exports et tableaux de bord.",
    courseSlug: "jamf-fundamentals",
    lessonSlug: "jf-reporting",
    videoSlug: "jamf-reporting",
    quizSlug: "quiz-jamf-reporting",
    labSlug: "jamf-reporting",
    resourceSlug: "jamf-guide-reporting",
    storyboardSlug: "jamf-reporting",
    screenshotSlug: "jamf-reporting",
    trackSlug: "jamf-100",
    certificationLevel: "Jamf 100",
  },
  {
    id: "troubleshooting",
    order: 15,
    title: "Troubleshooting",
    description: "Dépannage policies, profils, enrollment, APNs et Policy Logs.",
    courseSlug: "jamf-fundamentals",
    lessonSlug: "jf-troubleshooting",
    videoSlug: "jamf-troubleshooting",
    quizSlug: "quiz-jamf-troubleshooting",
    labSlug: "jamf-troubleshooting",
    resourceSlug: "jamf-guide-troubleshooting",
    storyboardSlug: "jamf-troubleshooting",
    screenshotSlug: "jamf-dashboard",
    trackSlug: "jamf-100",
    certificationLevel: "Jamf 100",
  },
];

export const JAMF_PILOT_VIDEOS = [
  "jamf-pro-fundamentals",
  "jamf-smart-groups",
  "jamf-policies",
  "jamf-configuration-profiles",
  "jamf-self-service",
  "jamf-patch-management",
  "jamf-packages",
  "jamf-scripts",
] as const;

export const JAMF_SCREENSHOT_PLACEHOLDERS = [
  "jamf-dashboard",
  "jamf-computers",
  "jamf-mobile-devices",
  "jamf-smart-groups",
  "jamf-static-groups",
  "jamf-policies",
  "jamf-configuration-profiles",
  "jamf-packages",
  "jamf-scripts",
  "jamf-self-service",
  "jamf-patch-management",
  "jamf-reporting",
] as const;
