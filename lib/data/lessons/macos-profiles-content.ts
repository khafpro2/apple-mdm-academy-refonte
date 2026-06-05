import type { Question } from "@/lib/types";

export const MACOS_PROFILES_LESSON_SLUG = "macos-configuration-profiles";
export const MACOS_PROFILES_COURSE_SLUG = "intune-mac";

export const macosProfilesCertifications = [
  "Apple Certified IT Professional",
  "Apple Deployment and Management",
  "Jamf 100",
  "Jamf 200",
];

export const macosProfilesObjectives = [
  "Comprendre le rôle des profils de configuration macOS en entreprise",
  "Déployer des configurations à distance via Intune ou Jamf Pro",
  "Configurer Wi-Fi, VPN et certificats sur Mac",
  "Gérer FileVault, restrictions et Privacy Preferences (PPPC)",
  "Approuver System Extensions et remplacer les Kernel Extensions",
  "Sécuriser un parc Mac et diagnostiquer les erreurs de profils",
];

export const macosProfilesBenefits = [
  "Configurer automatiquement les Mac dès l'enrôlement ADE",
  "Renforcer la sécurité (FileVault, restrictions, PPPC)",
  "Standardiser les réglages sur l'ensemble du parc",
  "Réduire les erreurs humaines et les tickets support",
];

export const macosProfilesArchitecture = [
  { label: "Administrateur IT", icon: "👤", color: "from-slate-700 to-slate-600" },
  { label: "Jamf Pro / Intune", icon: "☁️", color: "from-indigo-600 to-violet-500" },
  { label: "Profil de configuration", icon: "📋", color: "from-slate-600 to-gray-600" },
  { label: "Mac", icon: "💻", color: "from-gray-800 to-gray-700" },
  { label: "Application automatique", icon: "✅", color: "from-green-600 to-emerald-500" },
];

export type MacosProfileTypeDetail = {
  id: string;
  title: string;
  icon: string;
  description: string;
  useCase: string;
  risks: string[];
  bestPractices: string[];
};

export const macosProfileTypes: MacosProfileTypeDetail[] = [
  {
    id: "wifi",
    title: "Wi-Fi",
    icon: "📶",
    description: "Configure SSID, sécurité WPA2/WPA3 Enterprise et authentification par certificat ou identifiant.",
    useCase: "Connexion automatique au réseau entreprise dès le premier boot ADE, sans assistant utilisateur.",
    risks: ["Certificat SCEP expiré", "Profil Wi-Fi en doublon", "Réseau 802.1X mal configuré"],
    bestPractices: ["Déployer le profil SCEP avant le Wi-Fi", "Tester EAP-TLS sur Mac pilote", "Documenter le SSID et la CA"],
  },
  {
    id: "vpn",
    title: "VPN",
    icon: "🔒",
    description: "Définit IKEv2, IPsec ou SSL VPN avec serveur, certificat et règles Always On ou On Demand.",
    useCase: "Accès sécurisé aux ressources internes, serveurs de fichiers et applications métier.",
    risks: ["VPN Always On → latence et batterie", "Split tunneling mal configuré", "Certificat VPN expiré"],
    bestPractices: ["Préférer On Demand pour domaines internes", "Tester DNS et routes", "Documenter les exclusions"],
  },
  {
    id: "certificates",
    title: "Certificats",
    icon: "📜",
    description: "Déploie certificats CA, intermédiaires et client via SCEP, PKCS#12 ou import direct.",
    useCase: "Authentification Wi-Fi EAP-TLS, VPN IKEv2, email S/MIME et confiance TLS.",
    risks: ["Chaîne CA incomplète", "Clé privée exposée", "Certificat non renouvelé"],
    bestPractices: ["Utiliser SCEP/NDES avec Intune ou Jamf", "Escrow des clés si requis", "Alertes J-30 expiration"],
  },
  {
    id: "filevault",
    title: "FileVault",
    icon: "🔐",
    description: "Active le chiffrement intégral du disque (XTS-AES-128) et escrow de la clé de récupération vers MDM.",
    useCase: "Conformité RGPD, ISO 27001, protection des données en cas de vol ou perte du Mac.",
    risks: ["Escrow non configuré → récupération impossible", "Activation sans redémarrage planifié", "Clé perdue si MDM down"],
    bestPractices: ["Toujours activer l'escrow MDM", "Planifier le redémarrage utilisateur", "Vérifier FileVault actif post-déploiement"],
  },
  {
    id: "restrictions",
    title: "Restrictions",
    icon: "🚫",
    description: "Contrôle AirDrop, iCloud, App Store, comptes, extensions et fonctionnalités système.",
    useCase: "Flottes sécurisées, conformité réglementaire, postes partagés ou sensibles.",
    risks: ["Restrictions excessives → productivité réduite", "App Store bloqué → apps VPP impossibles", "iCloud désactivé → backup perdu"],
    bestPractices: ["Principe du moindre privilège", "Valider avec les métiers", "Différencier standard vs restreint"],
  },
  {
    id: "login-window",
    title: "Login Window",
    icon: "🪟",
    description: "Personnalise l'écran de connexion : message, bannière légale, affichage des comptes, options de déconnexion.",
    useCase: "Affichage d'un avertissement légal (AUP), masquage des autres comptes, mode invité désactivé.",
    risks: ["Message trop long illisible", "Masquage admin bloquant le support", "Conflit avec AD/LDAP binding"],
    bestPractices: ["Message court et clair", "Tester avec comptes locaux et fédérés", "Documenter les options Login Window"],
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: "🔔",
    description: "Préconfigure les autorisations de notification pour les apps système et tierces.",
    useCase: "Réduire les popups de notification au premier lancement, standardiser l'expérience utilisateur.",
    risks: ["Notifications critiques masquées", "Conflit avec préférences utilisateur", "Apps non listées ignorées"],
    bestPractices: ["Cibler les apps métier prioritaires", "Ne pas bloquer les alertes sécurité", "Tester sur macOS cible"],
  },
  {
    id: "pppc",
    title: "Privacy Preferences (PPPC)",
    icon: "🎥",
    description: "Privacy Preferences Policy Control — autorise caméra, micro, disque complet, accessibilité, automation.",
    useCase: "Teams, Zoom, Defender sans popup TCC au premier lancement — expérience Zero Touch.",
    risks: ["Bundle ID incorrect → autorisation ignorée", "Signature code mismatch après update app", "Sur-autorisation → risque vie privée"],
    bestPractices: ["Utiliser les templates Jamf/Intune pour apps courantes", "Vérifier Bundle ID après chaque update", "Principe du moindre privilège TCC"],
  },
  {
    id: "kernel-extensions",
    title: "Kernel Extensions (kext)",
    icon: "⚙️",
    description: "Approuve les anciennes kext (pré-macOS 11) pour antivirus, drivers réseau legacy.",
    useCase: "Parc legacy avec solutions nécessitant encore des kext — déploiement en déclin.",
    risks: ["kext non signées Apple → blocage", "SIP et User-Approved kext requis", "Incompatibilité macOS récent"],
    bestPractices: ["Migrer vers System Extensions quand possible", "Utiliser un profil Team ID approuvé", "Planifier la sortie des kext"],
  },
  {
    id: "system-extensions",
    title: "System Extensions",
    icon: "🛡️",
    description: "Approuve les System Extensions (endpoint, filtrage réseau, DLP) depuis macOS Catalina+.",
    useCase: "Microsoft Defender, CrowdStrike Falcon, Jamf Protect — sécurité endpoint sans kext.",
    risks: ["Extension non approuvée → agent inactif", "Team ID incorrect", "Redémarrage requis non planifié"],
    bestPractices: ["Profil System Extension + PPPC combinés", "Déployer avant l'agent endpoint", "Tester sur Mac pilote ADE"],
  },
];

export const macosWifiProfileExample = {
  name: "Corporate WiFi",
  settings: [
    { label: "SSID", value: "Entreprise-WIFI" },
    { label: "Sécurité", value: "WPA2 Enterprise (802.1X)" },
    { label: "Authentification", value: "Certificat (EAP-TLS)" },
    { label: "Auto-Join", value: "Activé" },
    { label: "Caché", value: "Non" },
  ],
  benefits: [
    "Déploiement automatique dès l'enrôlement ADE — aucune saisie Wi-Fi",
    "Sécurité renforcée : pas de mot de passe partagé, authentification par certificat",
    "Réduction des tickets support « impossible de se connecter au Wi-Fi »",
  ],
};

export const macosVpnProfileExample = {
  name: "VPN Entreprise",
  type: "IKEv2",
  settings: [
    { label: "Type", value: "IKEv2" },
    { label: "Serveur", value: "vpn.entreprise.com" },
    { label: "Authentification", value: "Certificat" },
    { label: "Certificat", value: "Client-VPN-Mac" },
    { label: "Proxy", value: "Aucun" },
  ],
  modes: [
    {
      title: "VPN Always On",
      description: "Tunnel permanent — tout le trafic passe par le VPN. Haute sécurité, impact performance.",
      icon: "🔐",
    },
    {
      title: "VPN On Demand",
      description: "Connexion automatique pour domaines internes (*.entreprise.local). Équilibre sécurité/performance.",
      icon: "⚡",
    },
    {
      title: "VPN Manuel",
      description: "L'utilisateur se connecte via l'icône VPN. Adapté au télétravail occasionnel.",
      icon: "👤",
    },
  ],
};

export const macosFileVaultDetails = {
  title: "FileVault — Chiffrement intégral du disque",
  description:
    "FileVault 2 chiffre l'intégralité du volume de démarrage avec XTS-AES-128. Sans la clé de récupération, les données sont illisibles en cas de vol.",
  advantages: [
    "Protection des données professionnelles et personnelles sur Mac portable",
    "Conformité réglementaire (RGPD, HIPAA, ISO 27001)",
    "Sécurité en cas de vol ou perte du MacBook",
  ],
  configuration: [
    { step: "Activer FileVault", detail: "Via profil MDM — Force Enable FileVault (Jamf) ou Disk Encryption (Intune)." },
    { step: "Escrow de la clé", detail: "La clé de récupération est automatiquement remontée vers Jamf/Intune — indispensable pour le support IT." },
    { step: "Récupération de secours", detail: "En cas de mot de passe oublié, l'admin récupère la clé depuis le portail MDM pour déverrouiller le Mac." },
  ],
};

export const macosRestrictionsList = [
  { feature: "AirDrop", impact: "Empêche le partage de fichiers ad hoc — réduit les fuites de données." },
  { feature: "Partage iCloud", impact: "Bloque iCloud Drive et Photos sur le Mac géré — données entreprise hors cloud personnel." },
  { feature: "Modification des comptes", impact: "Empêche l'ajout de comptes Apple ID ou Google personnels." },
  { feature: "App Store", impact: "Apps uniquement via VPP/MDM — contrôle des logiciels installés." },
  { feature: "Extensions non autorisées", impact: "Seules les System Extensions approuvées par profil MDM peuvent s'activer." },
];

export const macosPppcExplanation = {
  title: "Privacy Preferences Policy Control (PPPC)",
  description:
    "macOS demande une autorisation utilisateur (TCC) pour caméra, micro, disque, accessibilité. PPPC pré-approuve ces accès via MDM pour éviter les popups au premier lancement.",
  permissions: [
    { permission: "Caméra", example: "Visioconférence Teams, Zoom" },
    { permission: "Microphone", example: "Appels Teams, enregistrement audio" },
    { permission: "Accès disque complet", example: "Antivirus, backup, DLP" },
    { permission: "Accessibilité", example: "Automation, contrôle à distance, assistive tech" },
  ],
  teamsExample: [
    { app: "Microsoft Teams", camera: "Autorisé", microphone: "Autorisé", bundleId: "com.microsoft.teams" },
    { app: "Microsoft Teams (nouveau)", camera: "Autorisé", microphone: "Autorisé", bundleId: "com.microsoft.teams2" },
  ],
};

export const macosSystemExtensionsInfo = {
  title: "System Extensions vs Kernel Extensions",
  description:
    "Depuis macOS Catalina (10.15), Apple remplace progressivement les Kernel Extensions (kext) par des System Extensions plus sûres, exécutées en espace utilisateur.",
  examples: [
    { name: "Microsoft Defender for Endpoint", type: "System Extension", teamId: "UBF8T346G9" },
    { name: "CrowdStrike Falcon", type: "System Extension", teamId: "X9E956Y446" },
    { name: "Jamf Protect", type: "System Extension", teamId: "483DWKW443" },
  ],
  deploymentNote:
    "Déployer un profil System Extension (Team ID + Bundle ID) avant l'installation de l'agent endpoint. Combiner avec PPPC pour accès disque complet.",
};

export const macosIntuneDeploySteps = [
  "Ouvrir Microsoft Intune Admin Center → Devices",
  "Sélectionner macOS → Configuration profiles",
  "Cliquer sur Create profile → macOS",
  "Choisir un template (Wi-Fi, VPN, Endpoint protection, Restrictions…) ou Settings catalog",
  "Configurer les payloads (FileVault, PPPC, System Extensions…)",
  "Nommer selon convention : macOS-[Type]-[Env]-v1",
  "Assigner à un groupe Azure AD (Required pour déploiement automatique)",
  "Monitorer Device configuration status sur Mac pilotes",
];

export const macosIntuneVerificationItems = [
  "Profil actif et publié dans Intune (statut Succeeded)",
  "Mac pilote synchronisé (check-in MDM récent)",
  "Paramètres appliqués : Wi-Fi connecté, FileVault activé, PPPC effectif",
  "Clé FileVault escrow visible dans Intune (Endpoint analytics / Recovery key)",
  "System Extensions approuvées — agent endpoint actif",
];

export const macosJamfDeploySteps = [
  "Ouvrir Jamf Pro → Computers",
  "Configuration Profiles → New",
  "Ajouter Payloads macOS (Wi-Fi, VPN, FileVault, PPPC, System Extensions…)",
  "Configurer chaque payload avec paramètres entreprise",
  "Définir Scope : Smart Groups, buildings, departments ou computers individuels",
  "Configurer Exclusions pour exceptions (direction, labo test)",
  "Enregistrer — Jamf pousse via APNs au prochain check-in",
];

export const macosJamfScopeExplanation = {
  scope:
    "Le Scope détermine quels Mac reçoivent le profil. Utilisez des Smart Groups (ex. « Mac Production — FileVault Required ») pour un ciblage dynamique.",
  exclusions:
    "Les Exclusions retirent des Mac du déploiement même s'ils correspondent au scope — utile pour appareils de test ou exceptions.",
  smartGroups:
    "Les Smart Groups Jamf ciblent automatiquement selon critères (OS version, modèle, department, extension installée). Idéal pour PPPC et System Extensions par version macOS.",
};

export const macosTroubleshooting = [
  {
    problem: "Profil non installé",
    causes: ["Scope incorrect ou Mac hors Smart Group", "Profil en Optional", "Mac non enrôlé MDM", "APNs down"],
    solution: "Vérifier Scope et appartenance Smart Group dans Jamf/Intune. Forcer « Update inventory » / check-in MDM. Confirmer enrollment ADE actif.",
  },
  {
    problem: "FileVault inactif",
    causes: ["Profil FileVault non assigné", "Escrow non configuré", "Redémarrage non effectué", "Mac avec compte sans mot de passe"],
    solution: "Vérifier payload FileVault + escrow dans le profil. Forcer redémarrage. Contrôler clé escrow dans Jamf Computer Record → Security.",
  },
  {
    problem: "Application bloquée (TCC)",
    causes: ["PPPC manquant ou Bundle ID incorrect", "App mise à jour avec nouveau Bundle ID", "Signature code changed"],
    solution: "Contrôler PPPC : Bundle ID, Team ID, code requirement. Mettre à jour le profil après update app. Utiliser `sudo tccutil` en pilote pour diagnostiquer.",
  },
  {
    problem: "Extension refusée",
    causes: ["Profil System Extension absent", "Team ID incorrect", "kext legacy sur macOS récent", "SIP bloquant"],
    solution: "Vérifier profil System Extension avec Team ID exact. Migrer kext → System Extension. Redémarrer Mac après déploiement profil.",
  },
];

export const macosProfilesBestPractices = [
  "Toujours tester sur un groupe pilote (5–10 Mac) avant production",
  "Utiliser Smart Groups Jamf ou groupes dynamiques Intune pour ciblage automatique",
  "Documenter chaque profil : payloads, scope, auteur, date, version macOS cible",
  "Éviter les doublons — un profil consolidé par domaine (Wi-Fi, sécurité, PPPC)",
  "Contrôler les conflits : inventorier tous les profils assignés à un Mac",
  "Combiner FileVault + escrow + PPPC + System Extensions dans une stratégie cohérente",
];

export const macosProfilesCaseStudy = {
  title: "Cas pratique — 300 MacBook Pro sécurisés",
  scenario:
    "Une entreprise déploie 300 MacBook Pro via ADE. Objectif : profil standard combinant Wi-Fi entreprise, VPN IKEv2, FileVault avec escrow, PPPC pour Teams et restrictions de sécurité — déploiement automatique Zero Touch.",
  tasks: [
    "Concevoir les payloads Wi-Fi, VPN, FileVault, PPPC et Restrictions",
    "Créer et publier les profils dans Intune ou Jamf",
    "Déployer automatiquement sur la flotte complète",
  ],
  solution: [
    "Architecture — Profil 1 (macOS-Network-v1) : Wi-Fi Entreprise-WIFI WPA2 Enterprise EAP-TLS + VPN IKEv2 On Demand. Profil 2 (macOS-Security-v1) : FileVault Force Enable + escrow. Profil 3 (macOS-PPPC-v1) : Teams caméra/micro/disque. Profil 4 (macOS-Restrictions-v1) : AirDrop off, iCloud off, App Store managed.",
    "Certificats — Déployer macOS-Cert-SCEP-v1 en amont pour EAP-TLS Wi-Fi et VPN.",
    "Intune — Devices → macOS → Configuration profiles → Create pour chaque profil. Assign Required aux groupes « Mac-Production » et « Mac-Pilote ».",
    "Jamf alternative — Smart Group « MacBook Pro Production » → Scope sur les 4 profils. FileVault escrow vérifié dans Computer Record.",
    "System Extensions — Si Defender déployé : profil System Extension (UBF8T346G9) + PPPC Full Disk Access avant installation agent.",
    "Pilote — 10 MacBook Pro pendant 1 semaine. Vérifier Wi-Fi auto-join, VPN On Demand, FileVault actif + clé escrow, Teams sans popup TCC.",
    "Production — Extension au groupe 300 Mac. Monitorer erreurs configuration 72 h. Runbook IT pour récupération clé FileVault.",
  ],
};

export const macosProfilesQuizQuestions: Question[] = [
  {
    id: "macos-prof-q1",
    text: "Quel profil chiffre intégralement le disque d'un Mac ?",
    options: ["Profil VPN", "FileVault", "Profil Wi-Fi", "PPPC"],
    correctIndex: 1,
    explanation: "FileVault 2 chiffre le volume de démarrage — protection essentielle en cas de vol.",
  },
  {
    id: "macos-prof-q2",
    text: "Quel profil gère les autorisations caméra et micro ?",
    options: ["PPPC (Privacy Preferences Policy Control)", "Profil VPN", "Profil Wi-Fi", "Profil ADE"],
    correctIndex: 0,
    explanation: "PPPC pré-approuve les accès TCC (caméra, micro, disque) sans popup utilisateur.",
  },
  {
    id: "macos-prof-q3",
    text: "Que remplacent les System Extensions depuis macOS moderne ?",
    options: ["Les profils Wi-Fi", "Les Kernel Extensions (kext)", "FileVault", "Les certificats APNs"],
    correctIndex: 1,
    explanation: "Apple remplace les kext par des System Extensions plus sûres pour endpoint et filtrage.",
  },
  {
    id: "macos-prof-q4",
    text: "Pourquoi l'escrow FileVault est-il indispensable ?",
    options: [
      "Pour accélérer le Wi-Fi",
      "Pour récupérer la clé de déchiffrement en cas de mot de passe oublié",
      "Pour installer l'App Store",
      "Pour renouveler APNs",
    ],
    correctIndex: 1,
    explanation: "Sans escrow, un Mac FileVault avec mot de passe oublié est irrécupérable.",
  },
  {
    id: "macos-prof-q5",
    text: "Où créez-vous un profil macOS dans Intune ?",
    options: [
      "Devices → macOS → Configuration profiles",
      "Apps → macOS App Store",
      "Users → Licenses",
      "Tenant administration → APNs only",
    ],
    correctIndex: 0,
    explanation: "Les profils macOS se créent dans Devices → macOS → Configuration profiles.",
  },
  {
    id: "macos-prof-q6",
    text: "Qu'est-ce qu'un Smart Group Jamf ?",
    options: [
      "Un groupe d'utilisateurs Azure AD",
      "Un groupe dynamique basé sur critères Mac (OS, modèle, apps…)",
      "Un certificat SCEP",
      "Un profil Wi-Fi",
    ],
    correctIndex: 1,
    explanation: "Les Smart Groups ciblent automatiquement les Mac selon des critères inventory.",
  },
  {
    id: "macos-prof-q7",
    text: "Comment résoudre « Application bloquée » au premier lancement ?",
    options: [
      "Désactiver FileVault",
      "Contrôler et mettre à jour le profil PPPC (Bundle ID, Team ID)",
      "Réinitialiser Apple Business Manager",
      "Supprimer le certificat APNs",
    ],
    correctIndex: 1,
    explanation: "Les blocages TCC se résolvent en corrigeant le profil PPPC pour l'app concernée.",
  },
  {
    id: "macos-prof-q8",
    text: "Quel type de VPN est natif et recommandé sur macOS ?",
    options: ["PPTP", "IKEv2", "L2TP sans chiffrement", "OpenVPN uniquement"],
    correctIndex: 1,
    explanation: "IKEv2 est le protocole VPN natif macOS le plus performant pour l'entreprise.",
  },
  {
    id: "macos-prof-q9",
    text: "Microsoft Defender sur Mac nécessite typiquement :",
    options: [
      "Uniquement un profil Wi-Fi",
      "System Extension + PPPC Full Disk Access",
      "Désactivation de FileVault",
      "Un Apple ID personnel",
    ],
    correctIndex: 1,
    explanation: "Defender requiert un profil System Extension approuvé et PPPC pour accès disque complet.",
  },
  {
    id: "macos-prof-q10",
    text: "Quelle bonne pratique avant déploiement sur 300 Mac ?",
    options: [
      "Déployer sans test",
      "Tester sur un groupe pilote et documenter les profils",
      "Créer 50 profils identiques",
      "Désactiver l'escrow FileVault",
    ],
    correctIndex: 1,
    explanation: "Un groupe pilote valide FileVault, PPPC et extensions avant impact massif.",
  },
];

export const macosProfilesScoreTiers = [
  { min: 0, title: "📖 À revoir", message: "Repassez FileVault, PPPC et System Extensions, puis refaites le quiz." },
  { min: 60, title: "👍 Correct", message: "Bonne compréhension ! Visez 80 % pour valider la leçon." },
  { min: 80, title: "🏆 Validé", message: "Excellent ! Vous maîtrisez les profils de configuration macOS." },
  { min: 100, title: "💻 Expert Profils macOS", message: "Score parfait — vous êtes autonome sur la sécurisation d'un parc Mac via MDM." },
];

export function isMacosProfilesLesson(courseSlug: string, lessonSlug: string): boolean {
  return courseSlug === MACOS_PROFILES_COURSE_SLUG && lessonSlug === MACOS_PROFILES_LESSON_SLUG;
}

export const MACOS_PROFILES_COMPLETE_KEY = "lesson-macos-configuration-profiles-complete";

export function getMacosProfileDeployStatus(itemsChecked: number, total: number): "healthy" | "warning" {
  return itemsChecked >= total ? "healthy" : "warning";
}
