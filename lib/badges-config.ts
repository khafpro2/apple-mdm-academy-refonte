import type { Badge } from "@/lib/types";
import { allAdvancedModules } from "@/lib/data/advanced-tracks/module-definitions";
import { allAltMdmModules } from "@/lib/data/alternative-mdm-tracks/module-definitions";

const advancedLessonBadges = Object.fromEntries(allAdvancedModules.map((m) => [m.slug, m.badgeId]));
const advancedQuizBadges = Object.fromEntries(allAdvancedModules.map((m) => [m.quizSlug, m.badgeId]));
const altMdmLessonBadges = Object.fromEntries(allAltMdmModules.map((m) => [m.slug, m.badgeId]));
const altMdmQuizBadges = Object.fromEntries(allAltMdmModules.map((m) => [m.quizSlug, m.badgeId]));

/** 12 badges premium Phase 2 + badges généraux */
export const badgeCatalog: Badge[] = [
  { id: "badge-abm", name: "Apple Business Manager", icon: "🏢", description: "Module ABM + Intune validé", earned: false },
  { id: "badge-ade", name: "ADE", icon: "📱", description: "Automated Device Enrollment maîtrisé", earned: false },
  { id: "badge-apns", name: "APNs", icon: "🔔", description: "Certificats push Apple configurés", earned: false },
  { id: "badge-apps-books", name: "Apps & Books", icon: "📦", description: "VPP et déploiement d'apps", earned: false },
  { id: "badge-managed-ids", name: "Managed Apple IDs", icon: "🪪", description: "Identifiants gérés et fédération", earned: false },
  { id: "badge-platform-sso", name: "Platform SSO", icon: "🔐", description: "SSO macOS + Entra ID déployé", earned: false },
  { id: "badge-intune-apple", name: "Intune Apple", icon: "☁️", description: "Parcours Intune Mac complété", earned: false },
  { id: "badge-jamf-fundamentals", name: "Jamf Fundamentals", icon: "🎓", description: "Fondamentaux Jamf Pro", earned: false },
  { id: "badge-jamf-smart-groups", name: "Jamf Smart Groups", icon: "🎯", description: "Smart Groups et ciblage", earned: false },
  { id: "badge-jamf-policies", name: "Jamf Policies", icon: "⚙️", description: "Policies et déploiement Jamf", earned: false },
  { id: "badge-jamf-scripts", name: "Jamf Scripts", icon: "📜", description: "Scripts et automatisation", earned: false },
  { id: "badge-jamf-protect", name: "Jamf Protect", icon: "🛡️", description: "Sécurité endpoint Jamf Protect", earned: false },
  { id: "badge-intune-apple-pro", name: "Intune Apple Pro", icon: "☁️", description: "Module 11 Intune + ABM validé", earned: false },
  { id: "badge-smart-groups-expert", name: "Smart Groups Expert", icon: "🎯", description: "Module 13 Smart Groups maîtrisé", earned: false },
  { id: "badge-policy-administrator", name: "Policy Administrator", icon: "⚙️", description: "Module 14 Policies Jamf validé", earned: false },
  { id: "badge-jamf-automation", name: "Jamf Automation", icon: "📜", description: "Module 15 Scripts et automatisation", earned: false },
  { id: "badge-patch-manager", name: "Patch Manager", icon: "🔄", description: "Module 16 Patch Management validé", earned: false },
  { id: "badge-jamf-protect-specialist", name: "Jamf Protect Specialist", icon: "🛡️", description: "Module 17 Jamf Protect expert", earned: false },
  { id: "badge-apple-security-expert", name: "Apple Security Expert", icon: "🔐", description: "Module 18 Sécurité Apple enterprise", earned: false },
  { id: "first-quiz", name: "Premier pas", icon: "🎯", description: "Premier quiz réussi", earned: false },
  { id: "first-lab", name: "Premier lab", icon: "🧪", description: "Premier lab pratique complété", earned: false },
  { id: "lab-expert", name: "Lab Expert", icon: "⚡", description: "6 labs pratiques complétés", earned: false },
  { id: "quiz-master", name: "Expert Quiz", icon: "⭐", description: "100 % sur 3 examens différents", earned: false },
  { id: "exam-it-pro", name: "Apple IT Professional Ready", icon: "🍏", description: "Examen Apple Certified IT Professional réussi", earned: false },
  { id: "exam-jamf-100", name: "Jamf 100 Ready", icon: "📱", description: "Examen blanc Jamf 100 réussi", earned: false },
  { id: "exam-jamf-200", name: "Jamf 200 Ready", icon: "🏆", description: "Examen blanc Jamf 200 réussi", earned: false },
  { id: "exam-intune-apple", name: "Intune Apple Specialist", icon: "☁️", description: "Examen Intune Apple Devices réussi", earned: false },
  { id: "badge-jamf-300-ready", name: "Jamf 300 Ready", icon: "🚀", description: "Parcours Jamf 300 Prep complété", earned: false },
  { id: "badge-jamf-400-ready", name: "Jamf 400 Ready", icon: "🏗️", description: "Parcours Jamf 400 Prep complété", earned: false },
  { id: "badge-jamf-api-expert", name: "Jamf API Expert", icon: "🔌", description: "Modules API et webhooks Jamf maîtrisés", earned: false },
  { id: "badge-apple-enterprise-expert", name: "Apple Enterprise Expert", icon: "🍏", description: "Parcours Apple Enterprise Expert validé", earned: false },
  { id: "badge-apple-enterprise-architect", name: "Apple Enterprise Architect", icon: "🏛️", description: "Parcours Apple Enterprise Architect validé", earned: false },
  { id: "badge-apple-security-advanced", name: "Apple Security Advanced", icon: "🛡️", description: "Sécurité Apple avancée et compliance", earned: false },
  { id: "badge-intune-apple-advanced", name: "Intune Apple Advanced", icon: "☁️", description: "Parcours Intune Apple Advanced complété", earned: false },
  { id: "badge-platform-sso-expert", name: "Platform SSO Expert", icon: "🔐", description: "Platform SSO avancé déployé", earned: false },
  { id: "badge-ddm-specialist", name: "DDM Specialist", icon: "📋", description: "Declarative Device Management maîtrisé", earned: false },
  { id: "badge-mda-specialist", name: "MDA Specialist", icon: "✅", description: "Managed Device Attestation configuré", earned: false },
  { id: "exam-jamf-300", name: "Jamf 300 Exam Ready", icon: "🚀", description: "Examen blanc Jamf 300 réussi", earned: false },
  { id: "exam-jamf-400", name: "Jamf 400 Exam Ready", icon: "🏗️", description: "Examen blanc Jamf 400 réussi", earned: false },
  { id: "exam-apple-enterprise", name: "Apple Enterprise Exam Ready", icon: "🍏", description: "Examen Apple Enterprise Expert réussi", earned: false },
  { id: "exam-apple-enterprise-architect", name: "Apple Enterprise Architect", icon: "🏛️", description: "Examen Apple Enterprise Architect réussi (200 Q)", earned: false },
  { id: "exam-apple-deployment", name: "Apple Deployment Ready", icon: "📦", description: "Examen Apple Deployment & Management réussi (100 Q)", earned: false },
  { id: "exam-apple-security", name: "Apple Security Ready", icon: "🛡️", description: "Examen Apple Security Enterprise réussi (100 Q)", earned: false },
  { id: "exam-intune-advanced", name: "Intune Advanced Exam Ready", icon: "☁️", description: "Examen Intune Apple Advanced réussi", earned: false },
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
  ...altMdmQuizBadges,
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
  ...altMdmLessonBadges,
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
