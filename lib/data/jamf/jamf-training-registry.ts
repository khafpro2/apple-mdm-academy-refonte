/**
 * Registre d'alignement Jamf Training & Support (@JamfTrainingAndSupport).
 * Référence pédagogique uniquement — aucune intégration YouTube directe.
 * @see https://www.youtube.com/@JamfTrainingAndSupport
 */

export const JAMF_TRAINING_CHANNEL_URL = "https://www.youtube.com/@JamfTrainingAndSupport";

export type JamfTrainingPriority = "jamf-100" | "jamf-pro-fundamentals" | "jamf-200";

export type JamfTrainingTopicId =
  | "smart-groups"
  | "policies"
  | "configuration-profiles"
  | "self-service"
  | "patch-management"
  | "packages"
  | "scripts"
  | "inventory"
  | "enrollment";

export type JamfTrainingTopic = {
  id: JamfTrainingTopicId;
  title: string;
  priority: JamfTrainingPriority;
  priorityRank: number;
  sourceChannelUrl: string;
  sourceVideoTitle: string;
  sourceVideoKeywords: string[];
  courseSlug: string;
  moduleSlug: string;
  lessonSlugs: string[];
  labSlug: string;
  videoSlug: string;
  quizSlug: string;
  resourceSlug: string;
  jamfDocRef: string;
};

export const JAMF_TRAINING_TOPICS: JamfTrainingTopic[] = [
  {
    id: "smart-groups",
    title: "Smart Groups",
    priority: "jamf-100",
    priorityRank: 1,
    sourceChannelUrl: JAMF_TRAINING_CHANNEL_URL,
    sourceVideoTitle: "Jamf Pro Smart Groups — critères, scope et bonnes pratiques",
    sourceVideoKeywords: ["Smart Groups", "Smart Computer Groups", "scope", "criteria"],
    courseSlug: "jamf-100",
    moduleSlug: "module-13-smart-groups",
    lessonSlugs: ["m13-sg-intro", "m13-sg-criteres", "m13-sg-automatisation", "m13-sg-dynamiques", "m13-sg-bonnes-pratiques"],
    labSlug: "jamf-smart-groups",
    videoSlug: "jamf-smart-groups",
    quizSlug: "quiz-module-13-smart-groups",
    resourceSlug: "jamf-guide-smart-groups",
    jamfDocRef: "Jamf Pro 11.16 — Smart Groups",
  },
  {
    id: "policies",
    title: "Policies",
    priority: "jamf-100",
    priorityRank: 2,
    sourceChannelUrl: JAMF_TRAINING_CHANNEL_URL,
    sourceVideoTitle: "Jamf Pro Policies — triggers, payloads et exécution",
    sourceVideoKeywords: ["Policies", "triggers", "Recurring Check-in", "Enrollment Complete"],
    courseSlug: "jamf-100",
    moduleSlug: "module-14-policies",
    lessonSlugs: ["m14-policy-execution", "m14-policy-triggers", "m14-policy-frequence", "m14-policy-scope", "m14-policy-exclusions"],
    labSlug: "jamf-policies",
    videoSlug: "jamf-policies",
    quizSlug: "quiz-module-14-policies",
    resourceSlug: "jamf-guide-policies",
    jamfDocRef: "Jamf Pro 11.16 — Policies",
  },
  {
    id: "configuration-profiles",
    title: "Configuration Profiles",
    priority: "jamf-100",
    priorityRank: 3,
    sourceChannelUrl: JAMF_TRAINING_CHANNEL_URL,
    sourceVideoTitle: "Jamf Pro Configuration Profiles — payloads MDM macOS/iOS",
    sourceVideoKeywords: ["Configuration Profiles", "MDM profiles", "payloads", "Wi-Fi", "FileVault"],
    courseSlug: "jamf-100",
    moduleSlug: "module-12-jamf-fundamentals",
    lessonSlugs: ["config-profiles-jamf", "m12-configuration-profiles", "m12-architecture-jamf"],
    labSlug: "jamf-discovery",
    videoSlug: "jamf-configuration-profiles",
    quizSlug: "quiz-jamf-configuration-profiles",
    resourceSlug: "jamf-guide-configuration-profiles",
    jamfDocRef: "Jamf Pro 11.16 — Configuration Profiles",
  },
  {
    id: "self-service",
    title: "Self Service",
    priority: "jamf-100",
    priorityRank: 4,
    sourceChannelUrl: JAMF_TRAINING_CHANNEL_URL,
    sourceVideoTitle: "Jamf Self Service — catalogue IT et policies à la demande",
    sourceVideoKeywords: ["Self Service", "catalog", "branding", "user-initiated"],
    courseSlug: "jamf-100",
    moduleSlug: "module-12-jamf-fundamentals",
    lessonSlugs: ["m12-self-service", "self-service"],
    labSlug: "jamf-self-service",
    videoSlug: "jamf-self-service",
    quizSlug: "quiz-jamf-self-service",
    resourceSlug: "jamf-guide-self-service",
    jamfDocRef: "Jamf Pro 11.16 — Self Service",
  },
  {
    id: "packages",
    title: "Packages",
    priority: "jamf-100",
    priorityRank: 5,
    sourceChannelUrl: JAMF_TRAINING_CHANNEL_URL,
    sourceVideoTitle: "Jamf Pro Packages — Distribution Points et déploiement PKG/DMG",
    sourceVideoKeywords: ["Packages", "Distribution Point", "Composer", "PKG deploy"],
    courseSlug: "jamf-100",
    moduleSlug: "module-14-policies",
    lessonSlugs: ["m14-packages-deploiement"],
    labSlug: "jamf-packages",
    videoSlug: "jamf-packages",
    quizSlug: "quiz-jamf-packages",
    resourceSlug: "jamf-guide-packages",
    jamfDocRef: "Jamf Pro 11.16 — Packages",
  },
  {
    id: "inventory",
    title: "Inventory",
    priority: "jamf-pro-fundamentals",
    priorityRank: 6,
    sourceChannelUrl: JAMF_TRAINING_CHANNEL_URL,
    sourceVideoTitle: "Jamf Pro Inventory — Computers, Extension Attributes et reporting",
    sourceVideoKeywords: ["Inventory", "Computers", "Extension Attributes", "Advanced Search"],
    courseSlug: "jamf-100",
    moduleSlug: "module-12-jamf-fundamentals",
    lessonSlugs: ["m12-inventaire-jamf", "inventaire-recherche", "extension-attributes"],
    labSlug: "jamf-discovery",
    videoSlug: "jamf-inventory",
    quizSlug: "quiz-jamf-inventory",
    resourceSlug: "jamf-guide-inventory",
    jamfDocRef: "Jamf Pro 11.16 — Computer Inventory",
  },
  {
    id: "enrollment",
    title: "Enrollment",
    priority: "jamf-pro-fundamentals",
    priorityRank: 7,
    sourceChannelUrl: JAMF_TRAINING_CHANNEL_URL,
    sourceVideoTitle: "Jamf Pro Enrollment — ADE, PreStage et Automated Device Enrollment",
    sourceVideoKeywords: ["Enrollment", "ADE", "PreStage", "Automated Device Enrollment", "ABM"],
    courseSlug: "jamf-100",
    moduleSlug: "module-12-jamf-fundamentals",
    lessonSlugs: ["m12-enrollment-jamf", "workflows-enrollment"],
    labSlug: "jamf-discovery",
    videoSlug: "jamf-enrollment",
    quizSlug: "quiz-jamf-enrollment",
    resourceSlug: "jamf-guide-enrollment",
    jamfDocRef: "Jamf Pro 11.16 — Automated Device Enrollment",
  },
  {
    id: "scripts",
    title: "Scripts",
    priority: "jamf-200",
    priorityRank: 8,
    sourceChannelUrl: JAMF_TRAINING_CHANNEL_URL,
    sourceVideoTitle: "Jamf Pro Scripts — automation, paramètres et Policy Logs",
    sourceVideoKeywords: ["Scripts", "bash", "policy scripts", "automation"],
    courseSlug: "jamf-200",
    moduleSlug: "module-15-scripts",
    lessonSlugs: ["m15-scripts-bash", "m15-scripts-variables", "m15-scripts-logs", "m15-scripts-debugging", "m15-scripts-bonnes-pratiques"],
    labSlug: "jamf-scripts",
    videoSlug: "jamf-scripts",
    quizSlug: "quiz-module-15-scripts",
    resourceSlug: "jamf-guide-scripts",
    jamfDocRef: "Jamf Pro 11.16 — Scripts",
  },
  {
    id: "patch-management",
    title: "Patch Management",
    priority: "jamf-200",
    priorityRank: 9,
    sourceChannelUrl: JAMF_TRAINING_CHANNEL_URL,
    sourceVideoTitle: "Jamf Pro Patch Management — Software Titles et Patch Policies",
    sourceVideoKeywords: ["Patch Management", "Software Titles", "Patch Policy", "macOS updates"],
    courseSlug: "jamf-200",
    moduleSlug: "module-16-patch",
    lessonSlugs: ["m16-patch-gestion", "m16-patch-reporting", "m16-patch-conformite", "m16-patch-deploiement", "m16-patch-chrome"],
    labSlug: "jamf-patch-management",
    videoSlug: "jamf-patch-management",
    quizSlug: "quiz-module-16-patch",
    resourceSlug: "jamf-guide-patch-management",
    jamfDocRef: "Jamf Pro 11.16 — Patch Management",
  },
];

export function getJamfTrainingTopic(id: JamfTrainingTopicId): JamfTrainingTopic | undefined {
  return JAMF_TRAINING_TOPICS.find((t) => t.id === id);
}

export const JAMF_TRAINING_PRIORITY_LABELS: Record<JamfTrainingPriority, string> = {
  "jamf-100": "Jamf 100",
  "jamf-pro-fundamentals": "Jamf Pro Fundamentals",
  "jamf-200": "Jamf 200",
};
