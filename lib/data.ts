export type Track = {
  slug: string;
  title: string;
  level: string;
  lessons: number;
  desc: string;
  modules: { title: string; lessons: string[] }[];
};

export type Lab = {
  slug: string;
  title: string;
  objective: string;
  prerequisites: string[];
  steps: string[];
  duration: string;
};

export type Exam = {
  slug: string;
  title: string;
  questions: number;
  duration: string;
  topics: string[];
};

export const tracks: Track[] = [
  {
    slug: "apple-fundamentals",
    title: "Apple Fundamentals",
    level: "Débutant",
    lessons: 18,
    desc: "Bases macOS, iOS/iPadOS, sécurité, réseau et écosystème Apple Enterprise.",
    modules: [
      { title: "Écosystème Apple", lessons: ["Historique et positionnement", "macOS vs iOS vs iPadOS", "Apple Silicon"] },
      { title: "Sécurité de base", lessons: ["FileVault et chiffrement", "Touch ID / Face ID", "Gatekeeper"] },
      { title: "Réseau & services", lessons: ["Wi‑Fi et Ethernet", "iCloud et comptes Apple", "Services Apple en entreprise"] },
    ],
  },
  {
    slug: "apple-device-support",
    title: "Apple Device Support",
    level: "Intermédiaire",
    lessons: 32,
    desc: "Dépannage macOS, sauvegardes, comptes, Terminal, réseau et support utilisateur.",
    modules: [
      { title: "Support macOS", lessons: ["Diagnostic système", "Console et logs", "Mode Recovery"] },
      { title: "Comptes & identité", lessons: ["Comptes locaux vs Managed Apple ID", "SSO et Kerberos", "Profils utilisateur"] },
      { title: "Réseau avancé", lessons: ["VPN et proxy", "802.1X", "Dépannage connectivité"] },
    ],
  },
  {
    slug: "apple-it-professional",
    title: "Apple IT Professional",
    level: "Avancé",
    lessons: 40,
    desc: "MDM Apple, Automated Device Enrollment, Apps & Books, APNs et sécurité.",
    modules: [
      { title: "Apple Business Manager", lessons: ["Création et rôles", "Device Enrollment Program", "Apps & Books"] },
      { title: "MDM natif Apple", lessons: ["Profils de configuration", "Commandes MDM", "APNs et certificats push"] },
      { title: "Sécurité entreprise", lessons: ["Supervision", "Activation Lock", "Conformité et audits"] },
    ],
  },
  {
    slug: "jamf-pro-100-200",
    title: "Jamf Pro 100/200",
    level: "Pro",
    lessons: 45,
    desc: "Inventaire, policies, smart groups, configuration profiles et workflows Jamf.",
    modules: [
      { title: "Jamf Pro fondamentaux", lessons: ["Architecture Jamf", "Inventaire et recherche", "Smart Groups"] },
      { title: "Policies & profils", lessons: ["Configuration Profiles", "Extension Attributes", "Scripts et policies"] },
      { title: "Workflows avancés", lessons: ["Self Service", "Patch Management", "Integrations API"] },
    ],
  },
  {
    slug: "microsoft-intune-apple",
    title: "Microsoft Intune pour Apple",
    level: "Pro",
    lessons: 28,
    desc: "Enrollment, conformité, Conditional Access, apps et gestion iOS/macOS.",
    modules: [
      { title: "Enrollment Apple", lessons: ["ABM + Intune", "Supervised mode", "Enrollment Program Token"] },
      { title: "Conformité & sécurité", lessons: ["Compliance policies", "Conditional Access", "App Protection Policies"] },
      { title: "Apps & déploiement", lessons: ["VPP et LOB apps", "Scripts macOS", "Mise à jour OS"] },
    ],
  },
  {
    slug: "apple-partner-academy",
    title: "Apple Partner Academy",
    level: "Expert",
    lessons: 22,
    desc: "Proof Points, SEED, Technical Journey et préparation partenaire Apple.",
    modules: [
      { title: "Programme partenaire", lessons: ["Proof Points", "SEED funding", "Technical Journey"] },
      { title: "Positionnement", lessons: ["Apple at Work", "Vertical solutions", "Customer success stories"] },
      { title: "Certification partenaire", lessons: ["Examen partenaire", "Cas pratiques", "Pitch deck"] },
    ],
  },
];

export const labs: Lab[] = [
  {
    slug: "inscrire-mac-jamf",
    title: "Inscrire un Mac dans Jamf Pro",
    objective: "Enrôler un Mac via Quick Add ou DEP et vérifier l'inventaire dans Jamf Pro.",
    prerequisites: ["Accès Jamf Pro admin", "Mac de test macOS 14+", "Certificat Quick Add ou token DEP"],
    steps: [
      "Générer un fichier Quick Add ou configurer le token DEP dans Jamf Pro",
      "Lancer l'enrollment sur le Mac de test",
      "Vérifier l'apparition dans l'inventaire Jamf",
      "Assigner une policy de base (nom, timezone, restrictions)",
      "Valider la réception des commandes MDM",
    ],
    duration: "45 min",
  },
  {
    slug: "profil-wifi-securise",
    title: "Créer un profil Wi‑Fi sécurisé",
    objective: "Déployer un profil Wi‑Fi WPA2-Enterprise avec certificat client via MDM.",
    prerequisites: ["Serveur RADIUS configuré", "Certificat CA d'entreprise", "Console MDM (Jamf ou Intune)"],
    steps: [
      "Créer le payload Wi‑Fi avec SSID et sécurité Enterprise",
      "Associer le certificat client et la CA",
      "Tester le profil sur un appareil supervisé",
      "Déployer via Smart Group ou groupe d'appareils",
      "Valider la connexion automatique",
    ],
    duration: "30 min",
  },
  {
    slug: "deployer-chrome-macos",
    title: "Déployer Google Chrome sur macOS",
    objective: "Packager et déployer Chrome via Jamf Pro ou Intune avec policies de mise à jour.",
    prerequisites: ["PKG Chrome signé", "Accès admin MDM", "Groupe de test Mac"],
    steps: [
      "Télécharger le PKG Chrome Enterprise",
      "Uploader dans Jamf Pro / Intune",
      "Créer une policy d'installation",
      "Configurer les préférences Chrome via plist",
      "Vérifier l'installation et les mises à jour",
    ],
    duration: "25 min",
  },
  {
    slug: "filevault-mdm",
    title: "Activer FileVault via MDM",
    objective: "Forcer FileVault 2 avec clé escrow vers le serveur MDM sur macOS supervisé.",
    prerequisites: ["Mac supervisé", "Profil FileVault MDM", "Accès admin MDM"],
    steps: [
      "Créer le payload FileVault avec escrow",
      "Définir la politique de chiffrement (institution vs personal)",
      "Déployer le profil sur le groupe cible",
      "Vérifier l'activation FileVault et la clé escrow",
      "Tester la récupération via console MDM",
    ],
    duration: "40 min",
  },
  {
    slug: "ade-abm",
    title: "Configurer ADE / Apple Business Manager",
    objective: "Lier ABM à Jamf Pro ou Intune et assigner des appareils au MDM.",
    prerequisites: ["Compte Apple Business Manager", "Token MDM", "Appareils achetés via canal autorisé"],
    steps: [
      "Télécharger le token MDM depuis Jamf/Intune",
      "Uploader le token dans Apple Business Manager",
      "Assigner les appareils au serveur MDM",
      "Configurer le profil d'enrollment par défaut",
      "Tester l'enrollment zero-touch sur un nouvel appareil",
    ],
    duration: "50 min",
  },
  {
    slug: "conformite-intune",
    title: "Créer une règle de conformité Intune",
    objective: "Définir une compliance policy iOS/macOS et lier Conditional Access.",
    prerequisites: ["Tenant Intune", "Appareils Apple enrollés", "Azure AD Premium"],
    steps: [
      "Créer une compliance policy (OS min, jailbreak, encryption)",
      "Assigner aux groupes d'appareils Apple",
      "Configurer Conditional Access pour bloquer les non-conformes",
      "Tester avec un appareil conforme et non-conforme",
      "Analyser les rapports de conformité",
    ],
    duration: "35 min",
  },
];

export const exams: Exam[] = [
  {
    slug: "apple-device-support",
    title: "Apple Device Support",
    questions: 100,
    duration: "120 min",
    topics: ["macOS troubleshooting", "Comptes et identité", "Réseau", "Sécurité de base", "Support utilisateur"],
  },
  {
    slug: "apple-it-professional",
    title: "Apple IT Professional",
    questions: 100,
    duration: "120 min",
    topics: ["ABM et DEP", "MDM Apple", "APNs", "Supervision", "Apps & Books"],
  },
  {
    slug: "jamf-100",
    title: "Jamf 100",
    questions: 100,
    duration: "90 min",
    topics: ["Inventaire Jamf", "Smart Groups", "Configuration Profiles", "Policies", "Self Service"],
  },
  {
    slug: "jamf-200",
    title: "Jamf 200",
    questions: 100,
    duration: "90 min",
    topics: ["Extension Attributes", "Scripts", "Patch Management", "API Jamf", "Workflows avancés"],
  },
  {
    slug: "intune-apple-admin",
    title: "Intune Apple Admin",
    questions: 100,
    duration: "90 min",
    topics: ["Enrollment Apple", "Compliance", "Conditional Access", "App deployment", "macOS management"],
  },
];

export const progressData = [
  { name: "Jamf 100", value: 100 },
  { name: "Apple Device Support", value: 82 },
  { name: "Apple IT Professional", value: 64 },
  { name: "Jamf 200", value: 38 },
] as const;

export function getTrack(slug: string) {
  return tracks.find((t) => t.slug === slug);
}

export function getLab(slug: string) {
  return labs.find((l) => l.slug === slug);
}

export function getExam(slug: string) {
  return exams.find((e) => e.slug === slug);
}
