import type { Question } from "@/lib/types";

export const IOS_PROFILES_LESSON_SLUG = "ios-configuration-profiles";
export const IOS_PROFILES_COURSE_SLUG = "intune-mac";

export const iosProfilesCertifications = [
  "Apple Certified IT Professional",
  "Apple Deployment and Management",
  "Jamf 100",
  "Jamf 200",
];

export const iosProfilesObjectives = [
  "Comprendre le rôle et le fonctionnement des profils de configuration iOS/iPadOS",
  "Déployer des paramètres à distance via Intune ou Jamf Pro",
  "Configurer Wi-Fi, VPN et certificats sur iPhone et iPad",
  "Appliquer des restrictions de sécurité adaptées au contexte entreprise",
  "Déployer des profils de manière ciblée avec groupes et scope",
  "Diagnostiquer et résoudre les erreurs d'installation de profils",
];

export const iosProfilesCapabilities = [
  "Wi-Fi — connexion automatique au réseau entreprise",
  "VPN — accès sécurisé aux ressources internes",
  "Email — configuration Exchange / IMAP",
  "Certificats — authentification et chiffrement",
  "Restrictions — contrôle des fonctionnalités et apps",
  "Sécurité — code, Face ID, chiffrement",
  "Applications gérées — paramètres par app",
];

export const iosProfilesArchitecture = [
  { label: "Administrateur IT", icon: "👤", color: "from-slate-700 to-slate-600" },
  { label: "MDM (Intune / Jamf Pro)", icon: "☁️", color: "from-indigo-600 to-violet-500" },
  { label: "Profil de configuration", icon: "📋", color: "from-sky-500 to-blue-600" },
  { label: "iPhone · iPad", icon: "📱", color: "from-gray-800 to-gray-700" },
];

export type ProfileTypeDetail = {
  id: string;
  title: string;
  icon: string;
  description: string;
  useCase: string;
  risks: string[];
  bestPractices: string[];
};

export const iosProfileTypes: ProfileTypeDetail[] = [
  {
    id: "wifi",
    title: "Wi-Fi",
    icon: "📶",
    description: "Configure le SSID, la sécurité (WPA2/WPA3 Enterprise) et l'authentification (certificat, identifiant).",
    useCase: "Connexion automatique au réseau entreprise dès l'enrôlement ADE, sans saisie utilisateur.",
    risks: ["Certificat expiré → échec de connexion", "SSID incorrect → appareil hors réseau", "Profil dupliqué → conflit"],
    bestPractices: ["Tester sur un groupe pilote", "Utiliser WPA3 Enterprise si possible", "Renouveler les certificats avant expiration"],
  },
  {
    id: "vpn",
    title: "VPN",
    icon: "🔒",
    description: "Définit le type (IKEv2, IPsec, SSL), le serveur, l'authentification et les règles de connexion.",
    useCase: "Accès sécurisé aux serveurs internes, applications métier et ressources cloud privées.",
    risks: ["VPN toujours actif → consommation batterie", "Mauvaise config DNS → apps inaccessibles", "Certificat non approuvé"],
    bestPractices: ["Préférer VPN à la demande (On Demand) quand possible", "Tester la connectivité post-déploiement", "Documenter les exclusions"],
  },
  {
    id: "certificates",
    title: "Certificats",
    icon: "📜",
    description: "Déploie des certificats client ou CA pour l'authentification Wi-Fi, VPN, email S/MIME.",
    useCase: "Authentification sans mot de passe sur WPA2 Enterprise et VPN IKEv2.",
    risks: ["Chaîne de confiance incomplète", "Certificat expiré", "Clé privée compromise"],
    bestPractices: ["Utiliser une PKI entreprise ou SCEP/NDES", "Surveiller les dates d'expiration", "Ne jamais inclure de clés privées en clair"],
  },
  {
    id: "restrictions",
    title: "Restrictions",
    icon: "🚫",
    description: "Active ou désactive des fonctionnalités iOS : AirDrop, App Store, Siri, iCloud, caméra, etc.",
    useCase: "Conformité réglementaire, kiosque, flottes sensibles (santé, finance, défense).",
    risks: ["Restrictions excessives → frustration utilisateur", "Blocage App Store → apps métier impossibles", "iCloud désactivé → perte backup"],
    bestPractices: ["Appliquer le principe du moindre privilège", "Valider avec les métiers avant déploiement", "Différencier profils standard vs restreint"],
  },
  {
    id: "email",
    title: "Email",
    icon: "📧",
    description: "Configure Exchange, Google Workspace ou IMAP : serveur, domaine, authentification moderne.",
    useCase: "Boîte mail professionnelle préconfigurée sans assistant de configuration.",
    risks: ["Mot de passe en clair (éviter)", "OAuth mal configuré", "Conflit avec profil existant"],
    bestPractices: ["Utiliser OAuth / certificat plutôt que mot de passe", "Tester avec Conditional Access", "Permettre la modification des comptes si nécessaire"],
  },
  {
    id: "security",
    title: "Sécurité (Passcode)",
    icon: "🛡️",
    description: "Impose code d'accès, longueur minimale, Face ID/Touch ID, effacement après tentatives, chiffrement.",
    useCase: "Conformité NIST, ISO 27001, exigences Conditional Access Intune.",
    risks: ["Code trop complexe → tickets support", "Effacement trop agressif → perte de données", "Conflit avec compliance policy"],
    bestPractices: ["Aligner avec les compliance policies Intune", "6 caractères minimum + alphanumérique", "Activer le chiffrement matériel (par défaut sur iOS)"],
  },
  {
    id: "kiosk",
    title: "Kiosque (Single App / Guided Access)",
    icon: "🏪",
    description: "Mode mono-app ou restrictions avancées pour appareils dédiés (accueil, entrepôt, événement).",
    useCase: "iPad en borne d'accueil, scanner entrepôt, terminal de paiement.",
    risks: ["Utilisateur bloqué sans sortie de kiosque", "Mises à jour OS bloquées", "App unique en panne → appareil inutilisable"],
    bestPractices: ["Mode supervisé obligatoire", "Prévoir un code de sortie admin", "Superviser à distance via MDM"],
  },
  {
    id: "managed-apps",
    title: "Applications gérées",
    icon: "📲",
    description: "Paramètres spécifiques par application (URL serveur, clés API, comportement VPN par app).",
    useCase: "Configurer Teams, Outlook ou une app métier avec l'URL du tenant sans intervention utilisateur.",
    risks: ["Config incorrecte → app non fonctionnelle", "Données app perdues si mal gérées", "Conflit avec version App Store"],
    bestPractices: ["Déployer l'app VPP avant le profil app config", "Utiliser App Configuration Policies Intune", "Tester sur appareil supervisé"],
  },
];

export const iosWifiProfileExample = {
  name: "Profil Wi-Fi Entreprise",
  ssid: "Entreprise-WIFI",
  security: "WPA2 Enterprise (802.1X)",
  authentication: "Certificat client (EAP-TLS)",
  settings: [
    { label: "SSID", value: "Entreprise-WIFI" },
    { label: "Sécurité", value: "WPA2 Enterprise" },
    { label: "Authentification", value: "Certificat (EAP-TLS)" },
    { label: "Auto-Join", value: "Activé" },
    { label: "Proxy", value: "Aucun" },
  ],
  benefits: [
    "Déploiement automatique dès l'enrôlement ADE — zéro configuration manuelle",
    "Connexion transparente : l'utilisateur rejoint le réseau sans mot de passe Wi-Fi",
    "Réduction drastique des tickets support « Je n'arrive pas à me connecter au Wi-Fi »",
  ],
};

export const iosVpnProfileExample = {
  name: "VPN Entreprise",
  type: "IKEv2",
  settings: [
    { label: "Type de connexion", value: "IKEv2" },
    { label: "Serveur", value: "vpn.entreprise.com" },
    { label: "Authentification", value: "Certificat" },
    { label: "Certificat", value: "Client-VPN-Entreprise" },
    { label: "Proxy", value: "Aucun" },
  ],
  modes: [
    {
      title: "VPN à la demande (On Demand)",
      description: "Le VPN se connecte automatiquement quand l'appareil accède à des domaines internes (*.entreprise.local). Économise la batterie.",
      icon: "⚡",
    },
    {
      title: "VPN toujours actif",
      description: "Tunnel permanent pour flottes à haute sécurité. Tout le trafic passe par le VPN. Impact batterie et performance.",
      icon: "🔐",
    },
    {
      title: "VPN par application (Per-App VPN)",
      description: "Seules les apps métier (Outlook, app interne) utilisent le VPN. Idéal pour BYOD et productivité.",
      icon: "📱",
    },
  ],
};

export const iosRestrictionsList = [
  { feature: "AirDrop", impact: "Empêche le partage de fichiers entre appareils — réduit les fuites de données." },
  { feature: "App Store", impact: "Bloque l'installation d'apps non approuvées — apps métier via VPP uniquement." },
  { feature: "Siri", impact: "Désactive l'assistant vocal — conformité dans environnements sensibles." },
  { feature: "iCloud Drive", impact: "Empêche le stockage de documents entreprise sur iCloud personnel." },
  { feature: "Jeux (Game Center)", impact: "Bloque Game Center et distractions — flottes professionnelles." },
  { feature: "Modification des comptes", impact: "Empêche l'ajout de comptes email/iCloud personnels sur l'appareil géré." },
];

export const iosSecuritySettings = [
  { setting: "Code obligatoire", description: "Exige un code d'accès pour déverrouiller l'appareil — prérequis Conditional Access." },
  { setting: "Longueur minimale (6+ caractères)", description: "Apple recommande 6 caractères minimum ; entreprises sensibles : 8+ alphanumériques." },
  { setting: "Face ID / Touch ID", description: "Autoriser la biométrie tout en exigeant un code de secours fort." },
  { setting: "Effacement après tentatives", description: "Effacement automatique après 10 échecs de code (valeur Apple par défaut recommandée)." },
  { setting: "Chiffrement", description: "FileVault équivalent iOS — chiffrement matériel activé par défaut dès qu'un code est défini." },
];

export const iosAppleSecurityRecommendations = [
  "Activer le code d'accès sur tous les appareils gérés — prérequis au chiffrement des données",
  "Utiliser Face ID ou Touch ID pour améliorer l'expérience sans affaiblir la sécurité",
  "Configurer l'effacement à distance (Remote Wipe) via MDM en cas de perte ou vol",
  "Aligner les profils passcode avec les compliance policies et Conditional Access",
  "Ne jamais désactiver le chiffrement — iOS chiffre automatiquement avec un code actif",
];

export const iosIntuneDeploySteps = [
  "Ouvrir Microsoft Intune Admin Center → Devices",
  "Sélectionner Configuration → Configuration profiles (ou Configuration profiles selon version)",
  "Cliquer sur Create profile",
  "Choisir la plateforme iOS/iPadOS",
  "Sélectionner un template (Wi-Fi, VPN, Restrictions, etc.) ou Custom pour combiner plusieurs payloads",
  "Configurer les paramètres du payload (SSID, certificat, restrictions…)",
  "Nommer le profil selon une convention (ex. iOS-WiFi-Prod-001)",
  "Assigner à un groupe Azure AD (Required pour installation automatique)",
  "Vérifier le statut d'installation sur un appareil pilote",
];

export const iosIntuneVerificationItems = [
  "Profil créé et publié dans Intune (statut Active)",
  "Groupe cible correctement affecté (Required, pas Optional seul)",
  "Appareil pilote synchronisé (check-in MDM < 24 h)",
  "Profil visible dans Réglages → Général → VPN et gestion des appareils",
  "Paramètres effectifs confirmés (Wi-Fi connecté, VPN actif, restrictions appliquées)",
];

export const iosJamfDeploySteps = [
  "Ouvrir Jamf Pro → Devices (ou Computers pour iPad partagés)",
  "Aller dans Configuration Profiles → New",
  "Choisir la portée iOS/iPadOS",
  "Ajouter des Payloads (Wi-Fi, VPN, Restrictions, Passcode, etc.)",
  "Configurer chaque payload avec les paramètres entreprise",
  "Définir le Scope : quels appareils, groupes smart ou utilisateurs reçoivent le profil",
  "Configurer les Exclusions si certains appareils ne doivent pas recevoir le profil",
  "Enregistrer et déployer — Jamf envoie via APNs",
];

export const iosJamfScopeExplanation = {
  title: "Scope et exclusions Jamf",
  scope:
    "Le Scope détermine qui reçoit le profil : groupes smart (ex. « iOS Production »), bâtiments, départements ou appareils individuels. Un profil peut avoir plusieurs scopes.",
  exclusions:
    "Les Exclusions empêchent certains appareils ou groupes de recevoir le profil, même s'ils correspondent au scope. Utile pour les exceptions (direction, appareils de test).",
};

export const iosTroubleshooting = [
  {
    problem: "Profil non installé",
    causes: [
      "Groupe d'affectation incorrect ou appareil non membre",
      "Profil en Optional au lieu de Required",
      "Appareil non enrôlé ou profil MDM retiré",
      "APNs ou check-in MDM en échec",
    ],
    solution:
      "Vérifier l'affectation du profil dans Intune/Jamf. Confirmer que l'appareil est dans le groupe cible. Forcer un check-in MDM (Sync device). Contrôler les logs d'installation dans le portail MDM.",
  },
  {
    problem: "Conflit de configuration",
    causes: [
      "Deux profils Wi-Fi avec le même SSID",
      "Profils restrictions contradictoires",
      "Profil utilisateur + profil appareil en doublon",
    ],
    solution:
      "Inventorier tous les profils assignés à l'appareil. Supprimer les doublons. Utiliser une convention de nommage claire. Prioriser un profil consolidé plutôt que plusieurs profils partiels.",
  },
  {
    problem: "Erreur certificat",
    causes: [
      "Certificat expiré ou révoqué",
      "Chaîne de confiance CA incomplète dans le profil",
      "Certificat client non correspondant au compte RADIUS/VPN",
    ],
    solution:
      "Contrôler la chaîne de confiance : certificat CA racine + intermédiaire + client. Renouveler les certificats expirés. Tester l'authentification EAP-TLS sur un appareil pilote avant déploiement massif.",
  },
  {
    problem: "Restrictions non appliquées",
    causes: [
      "Appareil non supervisé (certaines restrictions requièrent le mode supervisé)",
      "Profil utilisateur vs appareil mal choisi",
      "iOS version incompatible avec la restriction",
    ],
    solution:
      "Vérifier que l'appareil est en mode supervisé (ADE). Utiliser un profil appareil pour les restrictions device-level. Consulter la documentation Apple des restrictions par version iOS.",
  },
];

export const iosProfilesBestPractices = [
  "Utiliser des groupes pilotes (5–10 appareils) avant tout déploiement production",
  "Éviter les doublons : un profil consolidé par domaine (Wi-Fi, VPN, Restrictions)",
  "Documenter chaque profil : objectif, payloads, groupes, date, auteur",
  "Tester systématiquement sur appareil supervisé ADE avant déploiement massif",
  "Adopter une convention de nommage : [Plateforme]-[Type]-[Env]-[Version] (ex. iOS-WiFi-Prod-v2)",
  "Réviser les profils à chaque mise à jour iOS majeure",
];

export const iosProfilesCaseStudy = {
  title: "Cas pratique — Profil complet pour 200 iPhone",
  scenario:
    "Une entreprise déploie 200 iPhone en ADE mode supervisé. L'objectif est un profil unique combinant Wi-Fi entreprise, VPN IKEv2, restrictions de sécurité et politique passcode — déployé automatiquement sans intervention utilisateur.",
  tasks: [
    "Concevoir les payloads Wi-Fi, VPN, Restrictions et Sécurité",
    "Créer et publier le profil dans Intune",
    "Assigner au groupe pilote puis à la flotte complète",
  ],
  solution: [
    "Conception — Wi-Fi : SSID Entreprise-WIFI, WPA2 Enterprise, EAP-TLS avec certificat SCEP. VPN : IKEv2, vpn.entreprise.com, certificat client, On Demand pour *.entreprise.local. Restrictions : désactiver AirDrop, App Store (apps via VPP), modification comptes. Sécurité : code 6 caractères alphanumériques, Face ID autorisé, effacement après 10 tentatives.",
    "Intune — Devices → Configuration profiles → Create → iOS/iPadOS → Templates → combiner Wi-Fi + VPN + Restrictions + Device restrictions + Passcode. Nom : iOS-Prod-Standard-v1.",
    "Certificats — Déployer un profil SCEP/NDES séparé (iOS-Cert-SCEP-v1) assigné au même groupe, en amont du profil Wi-Fi/VPN.",
    "Pilote — Assigner Required au groupe « iOS-Pilote » (10 iPhone). Vérifier installation dans Intune → Monitor → Device install status.",
    "Validation — Confirmer Wi-Fi auto-join, VPN On Demand, restrictions actives, code imposé. Tester 48 h en conditions réelles.",
    "Production — Étendre l'assignation au groupe « iOS-Production » (200 iPhone). Monitorer les erreurs pendant 72 h.",
    "Documentation — Registre IT : payloads, certificats, groupes, date déploiement, contact responsable.",
  ],
};

export const iosProfilesQuizQuestions: Question[] = [
  {
    id: "ios-prof-q1",
    text: "Quel profil permet la connexion automatique à un réseau Wi-Fi entreprise ?",
    options: ["Profil VPN", "Profil Wi-Fi", "Profil Restrictions", "Profil Email"],
    correctIndex: 1,
    explanation: "Le profil Wi-Fi configure le SSID, la sécurité et l'authentification pour une connexion automatique.",
  },
  {
    id: "ios-prof-q2",
    text: "Quel paramètre améliore la sécurité de l'appareil ?",
    options: ["Désactiver le code d'accès", "Imposer un code complexe", "Désactiver Face ID", "Désactiver le chiffrement"],
    correctIndex: 1,
    explanation: "Un code d'accès fort est le fondement de la sécurité iOS et active le chiffrement matériel.",
  },
  {
    id: "ios-prof-q3",
    text: "Qu'est-ce qu'un profil de configuration ?",
    options: [
      "Une application de l'App Store",
      "Un ensemble de paramètres envoyé à un appareil Apple via MDM",
      "Un certificat APNs",
      "Un compte Apple ID entreprise",
    ],
    correctIndex: 1,
    explanation: "Les profils de configuration regroupent des payloads (Wi-Fi, VPN, restrictions…) déployés à distance.",
  },
  {
    id: "ios-prof-q4",
    text: "Quel type de VPN est recommandé pour iOS en entreprise ?",
    options: ["PPTP", "L2TP sans chiffrement", "IKEv2", "OpenVPN uniquement"],
    correctIndex: 2,
    explanation: "IKEv2 est le protocole VPN natif iOS le plus performant et sécurisé pour les déploiements entreprise.",
  },
  {
    id: "ios-prof-q5",
    text: "Pourquoi le mode supervisé est-il important pour les restrictions ?",
    options: [
      "Il n'a aucun impact",
      "Certaines restrictions avancées ne s'appliquent qu'aux appareils supervisés",
      "Il désactive le Wi-Fi",
      "Il remplace le certificat APNs",
    ],
    correctIndex: 1,
    explanation: "Le mode supervisé (via ADE) débloque des restrictions device-level impossibles sur appareils non supervisés.",
  },
  {
    id: "ios-prof-q6",
    text: "Où créez-vous un profil iOS dans Intune ?",
    options: [
      "Apps → App Store",
      "Devices → Configuration profiles",
      "Users → Licenses",
      "Tenant administration → APNs",
    ],
    correctIndex: 1,
    explanation: "Les profils de configuration se créent dans Devices → Configuration profiles → Create profile → iOS/iPadOS.",
  },
  {
    id: "ios-prof-q7",
    text: "Que signifie « Scope » dans Jamf Pro ?",
    options: [
      "La date d'expiration du profil",
      "Les appareils et groupes qui reçoivent le profil",
      "Le type de certificat",
      "La version iOS minimale",
    ],
    correctIndex: 1,
    explanation: "Le Scope définit la portée de déploiement : quels appareils, smart groups ou utilisateurs reçoivent le profil.",
  },
  {
    id: "ios-prof-q8",
    text: "Quelle authentification Wi-Fi entreprise est la plus sécurisée ?",
    options: ["WPA2 Personal (PSK)", "WPA2 Enterprise avec certificat (EAP-TLS)", "Réseau ouvert", "WEP"],
    correctIndex: 1,
    explanation: "EAP-TLS avec certificat client élimine les mots de passe partagés et offre une authentification forte.",
  },
  {
    id: "ios-prof-q9",
    text: "Comment résoudre un conflit de configuration ?",
    options: [
      "Ajouter plus de profils identiques",
      "Inventorier et supprimer les profils en doublon",
      "Désactiver APNs",
      "Réinitialiser Apple Business Manager",
    ],
    correctIndex: 1,
    explanation: "Les conflits viennent souvent de profils dupliqués — inventorier, consolider et supprimer les doublons.",
  },
  {
    id: "ios-prof-q10",
    text: "Quelle bonne pratique avant un déploiement massif ?",
    options: [
      "Déployer directement sur 10 000 appareils",
      "Tester sur un groupe pilote de 5–10 appareils",
      "Ne jamais documenter les profils",
      "Utiliser des noms de profil aléatoires",
    ],
    correctIndex: 1,
    explanation: "Un groupe pilote valide la configuration avant d'impacter toute la flotte.",
  },
];

export const iosProfilesScoreTiers = [
  { min: 0, title: "📖 À revoir", message: "Repassez les sections Types de profils et Déploiement, puis refaites le quiz." },
  { min: 60, title: "👍 Correct", message: "Bonne compréhension ! Visez 80 % pour valider la leçon." },
  { min: 80, title: "🏆 Validé", message: "Excellent ! Vous maîtrisez les profils de configuration iOS/iPadOS." },
  { min: 100, title: "📱 Expert Profils iOS", message: "Score parfait — vous êtes autonome sur la conception et le déploiement de profils iOS." },
];

export function isIosProfilesLesson(courseSlug: string, lessonSlug: string): boolean {
  return courseSlug === IOS_PROFILES_COURSE_SLUG && lessonSlug === IOS_PROFILES_LESSON_SLUG;
}

export const IOS_PROFILES_COMPLETE_KEY = "lesson-ios-configuration-profiles-complete";

export function getIosProfileDeployStatus(itemsChecked: number, total: number): "healthy" | "warning" {
  return itemsChecked >= total ? "healthy" : "warning";
}
