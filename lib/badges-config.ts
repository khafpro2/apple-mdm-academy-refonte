import type { Badge } from "@/lib/types";

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
  { id: "exam-it-pro", name: "IT Pro Ready", icon: "🍏", description: "Examen Apple IT Professional réussi", earned: false },
  { id: "exam-jamf-100", name: "Jamf 100 Certified", icon: "📱", description: "Examen blanc Jamf 100 réussi", earned: false },
  { id: "exam-jamf-200", name: "Jamf 200 Expert", icon: "🏆", description: "Examen blanc Jamf 200 réussi", earned: false },
];

/** Badge débloqué à la réussite d'un quiz / examen */
export const quizBadgeMap: Record<string, string> = {
  "examen-apple-it-pro": "exam-it-pro",
  "examen-jamf-100-blanc": "exam-jamf-100",
  "examen-jamf-200": "exam-jamf-200",
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
];
