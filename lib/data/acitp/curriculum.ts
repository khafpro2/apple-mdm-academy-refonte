/** Curriculum Apple Certified IT Professional — compétences évaluées Apple */

export type AcitpCurriculumModule = {
  id: string;
  title: string;
  category: "macos" | "apps" | "identity" | "management" | "abm";
  lessonSlugs: string[];
  labSlug?: string;
  quizSlug?: string;
  description: string;
};

export const ACITP_CURRICULUM: AcitpCurriculumModule[] = [
  { id: "macos-fundamentals", title: "macOS Fundamentals", category: "macos", lessonSlugs: ["historique-ecosysteme", "macos-ios-ipados", "apple-silicon"], description: "Architecture macOS, Apple Silicon et écosystème." },
  { id: "finder", title: "Finder", category: "macos", lessonSlugs: ["macos-ios-ipados"], labSlug: "acitp-lab-01-mac-setup", description: "Navigation fichiers, tags, Quick Look et permissions." },
  { id: "dock", title: "Dock", category: "macos", lessonSlugs: ["macos-ios-ipados"], description: "Personnalisation Dock et policies MDM." },
  { id: "spotlight", title: "Spotlight", category: "macos", lessonSlugs: ["diagnostic-systeme"], description: "Recherche système, indexation et TCC." },
  { id: "safari", title: "Safari", category: "apps", lessonSlugs: ["wifi-ethernet"], labSlug: "acitp-lab-04-safari", description: "Safari enterprise, certificats et extensions." },
  { id: "mail", title: "Mail", category: "apps", lessonSlugs: ["services-entreprise"], labSlug: "acitp-lab-06-mail", description: "Exchange, autodiscover et profils MDM." },
  { id: "notes", title: "Notes", category: "apps", lessonSlugs: ["icloud-comptes"], description: "Notes local vs iCloud en enterprise." },
  { id: "calendar", title: "Calendar", category: "apps", lessonSlugs: ["services-entreprise"], labSlug: "acitp-lab-07-calendar", description: "Exchange Calendar et délégués." },
  { id: "messages", title: "Messages", category: "apps", lessonSlugs: ["icloud-comptes"], description: "iMessage org et Managed Apple ID." },
  { id: "facetime", title: "FaceTime", category: "apps", lessonSlugs: ["services-entreprise"], description: "Restrictions FaceTime flotte." },
  { id: "accessibility", title: "Accessibility", category: "macos", lessonSlugs: ["touch-id-face-id"], description: "VoiceOver, Zoom et déploiement ciblé." },
  { id: "security", title: "Security", category: "macos", lessonSlugs: ["filevault-chiffrement", "gatekeeper-notarisation", "touch-id-face-id"], labSlug: "acitp-lab-03-filevault", description: "FileVault, Gatekeeper, XProtect, SIP, Activation Lock." },
  { id: "apple-id", title: "Apple ID", category: "identity", lessonSlugs: ["icloud-comptes", "profils-utilisateur"], description: "Apple ID personnel vs contexte pro." },
  { id: "managed-apple-id", title: "Managed Apple ID", category: "identity", lessonSlugs: ["comptes-locaux-managed", "managed-apple-ids"], labSlug: "acitp-lab-08-managed-apple-id", description: "MAID, fédération Entra et restrictions." },
  { id: "icloud", title: "iCloud", category: "identity", lessonSlugs: ["icloud-comptes"], description: "Services iCloud et restrictions MDM." },
  { id: "device-management", title: "Device Management", category: "management", lessonSlugs: ["profils-configuration", "commandes-mdm", "apns-certificats"], labSlug: "acitp-lab-09-mdm-enrollment", description: "MDM, profils, APNs et commandes push." },
  { id: "apple-business-manager", title: "Apple Business Manager", category: "abm", lessonSlugs: ["abm-creation-roles", "dep-enrollment", "apps-books", "abm-intune"], labSlug: "acitp-lab-02-enterprise-connect", quizSlug: "quiz-abm-certification", description: "ABM, ADE, Apps & Books et gouvernance." },
];

export const ACITP_REQUIRED_LAB_SLUGS = [
  "acitp-lab-01-mac-setup",
  "acitp-lab-02-enterprise-connect",
  "acitp-lab-03-filevault",
  "acitp-lab-04-safari",
  "acitp-lab-05-passwords",
  "acitp-lab-06-mail",
  "acitp-lab-07-calendar",
  "acitp-lab-08-managed-apple-id",
  "acitp-lab-09-mdm-enrollment",
  "acitp-lab-10-macos-diagnostic",
];

export const ACITP_SKILLS = [
  "Configurer et dépanner macOS en contexte enterprise",
  "Administrer Apple Business Manager et ADE",
  "Sécuriser appareils : FileVault, Gatekeeper, conformité",
  "Déployer apps et services : Mail, Safari, Calendar, MAID",
  "Enrôler et gérer appareils via MDM (Intune/Jamf)",
  "Diagnostiquer incidents réseau, MDM et productivité",
];
