import type { Badge } from "@/lib/types";
import { allAdvancedModules } from "@/lib/data/advanced-tracks/module-definitions";

const advancedLessonBadges = Object.fromEntries(allAdvancedModules.map((m) => [m.slug, m.badgeId]));
const advancedQuizBadges = Object.fromEntries(allAdvancedModules.map((m) => [m.quizSlug, m.badgeId]));

/** 12 badges premium Phase 2 + badges généraux */
export const badgeCatalog: Badge[] = [
  { id: "badge-abm", name: "Apple Business Manager", icon: "building", description: "Module ABM + Intune validé", earned: false },
  { id: "badge-ade", name: "ADE", icon: "device", description: "Automated Device Enrollment maîtrisé", earned: false },
  { id: "badge-apns", name: "APNs", icon: "bell", description: "Certificats push Apple configurés", earned: false },
  { id: "badge-apps-books", name: "Apps & Books", icon: "box", description: "VPP et déploiement d'apps", earned: false },
  { id: "badge-managed-ids", name: "Managed Apple IDs", icon: "id-card", description: "Identifiants gérés et fédération", earned: false },
  { id: "badge-platform-sso", name: "Platform SSO", icon: "key", description: "SSO macOS + Entra ID déployé", earned: false },
  { id: "badge-intune-apple", name: "Intune Apple", icon: "cloud", description: "Parcours Intune Mac complété", earned: false },
  { id: "badge-jamf-fundamentals", name: "Jamf Fundamentals", icon: "graduation-cap", description: "Fondamentaux Jamf Pro", earned: false },
  { id: "badge-jamf-smart-groups", name: "Jamf Smart Groups", icon: "target", description: "Smart Groups et ciblage", earned: false },
  { id: "badge-jamf-policies", name: "Jamf Policies", icon: "gear", description: "Policies et déploiement Jamf", earned: false },
  { id: "badge-jamf-scripts", name: "Jamf Scripts", icon: "scroll", description: "Scripts et automatisation", earned: false },
  { id: "badge-jamf-protect", name: "Jamf Protect", icon: "shield-check", description: "Sécurité endpoint Jamf Protect", earned: false },
  { id: "badge-intune-apple-pro", name: "Intune Apple Pro", icon: "cloud", description: "Module 11 Intune + ABM validé", earned: false },
  { id: "badge-smart-groups-expert", name: "Smart Groups Expert", icon: "target", description: "Module 13 Smart Groups maîtrisé", earned: false },
  { id: "badge-policy-administrator", name: "Policy Administrator", icon: "gear", description: "Module 14 Policies Jamf validé", earned: false },
  { id: "badge-jamf-automation", name: "Jamf Automation", icon: "scroll", description: "Module 15 Scripts et automatisation", earned: false },
  { id: "badge-patch-manager", name: "Patch Manager", icon: "refresh", description: "Module 16 Patch Management validé", earned: false },
  { id: "badge-jamf-protect-specialist", name: "Jamf Protect Specialist", icon: "shield-check", description: "Module 17 Jamf Protect expert", earned: false },
  { id: "badge-apple-security-expert", name: "Apple Security Expert", icon: "key", description: "Module 18 Sécurité Apple enterprise", earned: false },
  { id: "first-quiz", name: "Premier pas", icon: "target", description: "Premier quiz réussi", earned: false },
  { id: "first-lab", name: "Premier lab", icon: "flask", description: "Premier lab pratique complété", earned: false },
  { id: "lab-expert", name: "Lab Expert", icon: "bolt", description: "6 labs pratiques complétés", earned: false },
  { id: "quiz-master", name: "Expert Quiz", icon: "star", description: "100 % sur 3 examens différents", earned: false },
  { id: "exam-it-pro", name: "Apple IT Professional Ready", icon: "apple-mark", description: "Examen Apple Certified IT Professional réussi", earned: false },
  { id: "exam-jamf-100", name: "Jamf 100 Ready", icon: "device", description: "Examen blanc Jamf 100 réussi", earned: false },
  { id: "exam-jamf-200", name: "Jamf 200 Ready", icon: "trophy", description: "Examen blanc Jamf 200 réussi", earned: false },
  { id: "exam-intune-apple", name: "Intune Apple Specialist", icon: "cloud", description: "Examen Intune Apple Devices réussi", earned: false },
  { id: "badge-jamf-300-ready", name: "Jamf 300 Ready", icon: "rocket", description: "Parcours Jamf 300 Prep complété", earned: false },
  { id: "badge-jamf-400-ready", name: "Jamf 400 Ready", icon: "crane", description: "Parcours Jamf 400 Prep complété", earned: false },
  { id: "badge-jamf-api-expert", name: "Jamf API Expert", icon: "plug", description: "Modules API et webhooks Jamf maîtrisés", earned: false },
  { id: "badge-apple-enterprise-expert", name: "Apple Enterprise Expert", icon: "apple-mark", description: "Parcours Apple Enterprise Expert validé", earned: false },
  { id: "badge-apple-enterprise-architect", name: "Apple Enterprise Architect", icon: "landmark", description: "Parcours Apple Enterprise Architect validé", earned: false },
  { id: "badge-apple-security-advanced", name: "Apple Security Advanced", icon: "shield-check", description: "Sécurité Apple avancée et compliance", earned: false },
  { id: "badge-intune-apple-advanced", name: "Intune Apple Advanced", icon: "cloud", description: "Parcours Intune Apple Advanced complété", earned: false },
  { id: "badge-platform-sso-expert", name: "Platform SSO Expert", icon: "key", description: "Platform SSO avancé déployé", earned: false },
  { id: "badge-ddm-specialist", name: "DDM Specialist", icon: "clipboard-check", description: "Declarative Device Management maîtrisé", earned: false },
  { id: "badge-mda-specialist", name: "MDA Specialist", icon: "check-circle", description: "Managed Device Attestation configuré", earned: false },
  { id: "exam-jamf-300", name: "Jamf 300 Exam Ready", icon: "rocket", description: "Examen blanc Jamf 300 réussi", earned: false },
  { id: "exam-jamf-400", name: "Jamf 400 Exam Ready", icon: "crane", description: "Examen blanc Jamf 400 réussi", earned: false },
  { id: "exam-apple-enterprise", name: "Apple Enterprise Exam Ready", icon: "apple-mark", description: "Examen Apple Enterprise Expert réussi", earned: false },
  { id: "exam-apple-enterprise-architect", name: "Apple Enterprise Architect", icon: "landmark", description: "Examen Apple Enterprise Architect réussi (200 Q)", earned: false },
  { id: "exam-apple-deployment", name: "Apple Deployment Ready", icon: "box", description: "Examen Apple Deployment & Management réussi (100 Q)", earned: false },
  { id: "exam-apple-security", name: "Apple Security Ready", icon: "shield-check", description: "Examen Apple Security Enterprise réussi (100 Q)", earned: false },
  { id: "exam-intune-advanced", name: "Intune Advanced Exam Ready", icon: "cloud", description: "Examen Intune Apple Advanced réussi", earned: false },
];

/** Badge débloqué à la réussite d'un quiz / examen */
export const quizBadgeMap: Record<string, string> = {
  "examen-apple-it-pro": "exam-it-pro",
  "examen-jamf-100-blanc": "exam-jamf-100",
  "examen-jamf-200": "exam-jamf-200",
  "examen-intune-apple": "exam-intune-apple",
  "quiz-jamf-100": "badge-jamf-fundamentals",
  "quiz-intune-mac": "badge-intune-apple",
  "examen-apple-device-support": "exam-it-pro",
  "quiz-module-11-intune-apple": "badge-intune-apple-pro",
  "quiz-module-12-jamf-fundamentals": "badge-jamf-fundamentals",
  "quiz-module-13-smart-groups": "badge-smart-groups-expert",
  "quiz-module-14-policies": "badge-policy-administrator",
  "quiz-module-15-scripts": "badge-jamf-automation",
  "quiz-module-16-patch": "badge-patch-manager",
  "quiz-module-17-protect": "badge-jamf-protect-specialist",
  "quiz-module-18-security": "badge-apple-security-expert",
  "examen-jamf-300": "exam-jamf-300",
  "examen-jamf-400": "exam-jamf-400",
  "examen-apple-enterprise-expert": "exam-apple-enterprise",
  "examen-apple-enterprise-architect": "exam-apple-enterprise-architect",
  "examen-apple-deployment": "exam-apple-deployment",
  "examen-apple-security": "exam-apple-security",
  "examen-intune-apple-advanced": "exam-intune-advanced",
  ...advancedQuizBadges,
};

/** Badge débloqué à la complétion d'un module premium (score ≥ 80 %) */
export const lessonBadgeMap: Record<string, string> = {
  "abm-intune": "badge-abm",
  "ade-iphone": "badge-ade",
  "ade-mac": "badge-ade",
  "apns-certificates": "badge-apns",
  "vpp-apps-books": "badge-apps-books",
  "managed-apple-ids": "badge-managed-ids",
  "platform-sso": "badge-platform-sso",
  "ios-configuration-profiles": "badge-intune-apple",
  "macos-configuration-profiles": "badge-intune-apple",
  "macos-security": "badge-intune-apple",
  "smart-groups": "badge-jamf-smart-groups",
  "policies-base": "badge-jamf-policies",
  "scripts-policies": "badge-jamf-scripts",
  "patch-management": "badge-jamf-protect",
  "architecture-jamf": "badge-jamf-fundamentals",
  ...advancedLessonBadges,
};

export function getBadgeById(id: string) {
  return badgeCatalog.find((b) => b.id === id);
}

export function getBadgesForDisplay() {
  return badgeCatalog.filter((b) => !b.id.startsWith("first-") || b.id === "first-quiz");
}

/** Badges principaux affichés en grille (12 premium) */
export const premiumBadgeIds = [
  "badge-abm",
  "badge-ade",
  "badge-apns",
  "badge-apps-books",
  "badge-managed-ids",
  "badge-platform-sso",
  "badge-intune-apple",
  "badge-jamf-fundamentals",
  "badge-jamf-smart-groups",
  "badge-jamf-policies",
  "badge-jamf-scripts",
  "badge-jamf-protect",
  "badge-intune-apple-pro",
  "badge-smart-groups-expert",
  "badge-policy-administrator",
  "badge-jamf-automation",
  "badge-patch-manager",
  "badge-jamf-protect-specialist",
  "badge-apple-security-expert",
  "badge-jamf-300-ready",
  "badge-jamf-400-ready",
  "badge-jamf-api-expert",
  "badge-apple-enterprise-expert",
  "badge-apple-enterprise-architect",
  "badge-apple-security-advanced",
  "badge-intune-apple-advanced",
  "badge-platform-sso-expert",
  "badge-ddm-specialist",
  "badge-mda-specialist",
];
