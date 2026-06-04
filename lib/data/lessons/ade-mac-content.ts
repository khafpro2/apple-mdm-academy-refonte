import type { Question } from "@/lib/types";

export const ADE_MAC_LESSON_SLUG = "ade-mac";
export const ADE_MAC_COURSE_SLUG = "intune-mac";

export const adeMacCertifications = [
  "Apple Certified IT Professional",
  "Apple Deployment and Management",
  "Jamf 100",
  "Jamf 200",
];

export const adeMacObjectives = [
  "Comprendre le déploiement automatique des Mac en entreprise",
  "Utiliser Apple Business Manager pour enregistrer et assigner les Mac",
  "Associer un Mac à Microsoft Intune via ADE",
  "Configurer un profil ADE dédié à macOS",
  "Appliquer automatiquement les profils de configuration et applications",
  "Réduire les manipulations manuelles lors de l'onboarding",
];

export const adeMacIntroduction = {
  before:
    "Avant Apple Business Manager, chaque Mac devait être configuré manuellement : création de compte local, installation du profil MDM, déploiement des apps une par une. Ce processus était lent, source d'erreurs et difficile à standardiser à grande échelle.",
  today: [
    "Enregistrement automatique des Mac achetés via revendeurs agréés",
    "Mode supervisé activé dès la première activation",
    "Déploiement à distance des profils, apps et restrictions",
    "Zero Touch Deployment : l'utilisateur ouvre le Mac, se connecte au Wi‑Fi, et l'organisation prend le relais",
  ],
};

export const adeMacFlow = [
  { label: "Apple Business Manager", icon: "🍏", color: "from-gray-900 to-gray-700" },
  { label: "Serveur MDM — Microsoft Intune", icon: "☁️", color: "from-indigo-600 to-violet-500" },
  { label: "Automated Device Enrollment (ADE)", icon: "📲", color: "from-sky-500 to-cyan-500" },
  { label: "Mac neuf (sortie du carton)", icon: "💻", color: "from-slate-600 to-slate-500" },
  { label: "Activation Apple", icon: "⚡", color: "from-amber-500 to-orange-500" },
  { label: "Configuration automatique Intune", icon: "⚙️", color: "from-purple-500 to-indigo-500" },
  { label: "Utilisateur final", icon: "👤", color: "from-emerald-500 to-teal-500" },
];

export const adeMacPrerequisites = [
  "Apple Business Manager actif avec accès administrateur",
  "Microsoft Intune configuré et lié à ABM (jeton server_token.p7m)",
  "Token ABM valide et synchronisé dans Intune",
  "Certificat APNs valide pour macOS/iOS",
  "Mac compatible ADE (Apple Silicon ou Intel récent, macOS 10.14+)",
  "Accès administrateur Intune et Entra ID",
];

export const adeMacPrerequisiteChecklist = [
  "ABM opérationnel",
  "Intune opérationnel",
  "Token synchronisé",
  "APNs valide",
];

export const adeMacIntuneConfigSteps = [
  "Ouvrir le Microsoft Intune Admin Center (endpoint.microsoft.com)",
  "Aller dans Devices → macOS → macOS enrollment",
  "Sélectionner Enrollment Program Tokens",
  "Choisir le jeton Apple Business Manager synchronisé",
  "Cliquer sur Create Profile (Créer un profil)",
  "Nommer le profil selon votre convention (ex. macOS ADE Production)",
  "Configurer les options d'enrôlement recommandées",
  "Assigner le profil aux Mac cibles",
];

export const adeMacRecommendedOptions = [
  {
    label: "Supervised",
    description:
      "Active le mode supervisé sur macOS : restrictions avancées, profils système, blocage de la suppression MDM et capacités de gestion complètes.",
  },
  {
    label: "Await Device Configuration",
    description:
      "Retient l'assistant de configuration macOS jusqu'à ce qu'Intune ait appliqué tous les profils requis — garantit un Mac conforme avant remise à l'utilisateur.",
  },
  {
    label: "Locked Enrollment",
    description:
      "Empêche l'utilisateur de retirer le profil MDM sans réinitialisation complète — essentiel pour la conformité et la sécurité entreprise.",
  },
];

export const adeMacProfileName = "macOS Corporate Standard";

export const adeMacProfileSettings = [
  {
    label: "Masquer Siri",
    enabled: true,
    reason: "Réduit la surface d'attaque et évite l'indexation vocale de données sensibles en entreprise.",
  },
  {
    label: "Masquer Apple Pay",
    enabled: true,
    reason: "Contrôle des moyens de paiement sur appareils gérés — alignement avec les politiques financières.",
  },
  {
    label: "Masquer Diagnostics & Usage",
    enabled: true,
    reason: "Évite l'envoi non contrôlé de données de télémétrie à Apple sans validation IT.",
  },
  {
    label: "Masquer Screen Time",
    enabled: true,
    reason: "Délègue la gestion du temps d'écran aux politiques MDM plutôt qu'aux réglages personnels.",
  },
  {
    label: "Afficher Remote Management",
    enabled: true,
    reason: "Informe clairement l'utilisateur que le Mac est géré par l'organisation — transparence et conformité.",
  },
];

export const adeMacAssignmentSteps = [
  "Ouvrir Apple Business Manager (business.apple.com)",
  "Aller dans Devices (Appareils)",
  "Sélectionner les Mac par numéro de série ou lot",
  "Cliquer sur Assign to Server (Assigner au serveur)",
  "Choisir le serveur MDM Intune Production",
  "Confirmer l'affectation et attendre la synchronisation",
];

export const adeMacAssignmentModes = [
  {
    title: "Affectation individuelle",
    body: "Assignez un Mac spécifique par numéro de série — idéal pour les remplacements ou les appareils VIP.",
  },
  {
    title: "Affectation par lot",
    body: "Importez une liste CSV de numéros de série ou sélectionnez plusieurs Mac d'un même bon de commande.",
  },
  {
    title: "Affectation automatique",
    body: "Configurez une règle par défaut dans ABM : tout nouveau Mac est automatiquement assigné à Intune.",
  },
];

export const adeMacFirstBootSteps = [
  "Allumer le Mac et choisir la langue et la région",
  "Se connecter au réseau Wi‑Fi (Ethernet possible sur Mac avec port dédié)",
  "Attendre l'activation Apple (connexion aux serveurs d'activation)",
  "Détection automatique ADE — le Mac contacte ABM via le serveur d'activation",
  "Affichage de l'écran de gestion à distance (Remote Management)",
  "Téléchargement automatique du profil MDM Intune",
  "Application des configurations, apps et restrictions définies dans Intune",
];

export const adeMacExpectedMessage = "Ce Mac est géré par votre organisation.";

export const adeMacAutoProfiles = [
  { category: "Réseau", items: ["Wi‑Fi entreprise (802.1X)", "VPN Always On", "Proxy système"] },
  { category: "Sécurité", items: ["Certificats PKI / SCEP", "FileVault (chiffrement)", "Restrictions système"] },
  { category: "Applications", items: ["Microsoft Outlook", "Microsoft Teams", "Company Portal", "Microsoft Edge", "OneDrive"] },
];

export const adeMacVerificationItems = [
  "Token ABM synchronisé dans Intune (macOS enrollment)",
  "Certificat APNs valide",
  "Profil ADE macOS créé avec Supervised activé",
  "Mac assigné au serveur MDM dans ABM",
  "Test pilote : message « Ce Mac est géré par votre organisation »",
  "Mac visible dans Intune avec statut Compliant",
];

export const adeMacTroubleshooting = [
  {
    problem: "Mac absent dans Intune",
    solution: "Vérifier la synchronisation ABM : Intune → Enrollment Program Tokens → Sync. Attendre jusqu'à 24 h ou forcer une sync manuelle.",
  },
  {
    problem: "ADE ne démarre pas à l'activation",
    solution: "Vérifier l'affectation du serveur MDM dans ABM pour ce numéro de série. Confirmer que le Mac provient d'un revendeur agréé.",
  },
  {
    problem: "Profil MDM non téléchargé",
    solution: "Contrôler la connectivité Internet (pare-feu, proxy, DNS). Vérifier que le certificat APNs n'est pas expiré.",
  },
  {
    problem: "Mac non supervisé après enrôlement",
    solution: "Vérifier que l'option Supervised est activée dans le profil ADE macOS. Réinitialiser le Mac (Erase All Content and Settings) et recommencer.",
  },
];

export const adeMacBestPractices = [
  "Tester chaque nouveau profil ADE sur un Mac pilote avant déploiement massif",
  "Utiliser des groupes pilotes Intune (5–10 Mac) pour valider les changements",
  "Documenter les configurations : nom, version, date, auteur, apps incluses",
  "Surveiller les expirations APNs et jetons ABM avec alertes à J-60",
  "Limiter les privilèges administrateur local — préférer les comptes standard + elevation via MDM",
];

export const adeMacCaseStudy = {
  title: "Cas pratique — 100 MacBook Air M4",
  scenario:
    "Une entreprise reçoit 100 MacBook Air M4 (Apple Silicon). L'objectif est de les déployer sans aucune intervention IT sur site : chaque employé ouvre son Mac, se connecte au Wi‑Fi, et retrouve un poste prêt à l'emploi avec Outlook, Teams et les profils de sécurité.",
  tasks: [
    "Configurer Apple Business Manager (serveur MDM Intune, token valide)",
    "Configurer Intune (profil ADE macOS Corporate Standard)",
    "Créer le profil avec Setup Assistant personnalisé",
    "Affecter les 100 Mac au serveur MDM Intune dans ABM",
  ],
  solution: [
    "ABM : vérifier que les 100 Mac sont visibles (achat revendeur agréé). Configurer l'affectation automatique au serveur « Intune Production ».",
    "Intune : créer le profil ADE « macOS Corporate Standard » avec Supervised + Await Device Configuration + Locked Enrollment. Masquer Siri, Apple Pay, Diagnostics, Screen Time. Afficher Remote Management.",
    "Intune : assigner au profil ADE les groupes dynamiques « Mac-Production ». Déployer les apps requises (Outlook, Teams, Company Portal, Edge, OneDrive) en mode Required.",
    "ABM : assigner les 100 Mac au serveur Intune (par lot CSV ou règle auto). Forcer une synchronisation du token dans Intune.",
    "Test : réinitialiser 2 Mac pilotes. Valider le message « Ce Mac est géré par votre organisation » et la présence dans Intune sous 30 min.",
    "Go-live : communiquer aux utilisateurs la procédure Wi‑Fi + connexion Entra ID. Surveiller le tableau de bord Intune pendant 48 h.",
  ],
};

export const adeMacQuizQuestions: Question[] = [
  {
    id: "mac-q1",
    text: "Quel message confirme un enrôlement ADE réussi sur Mac ?",
    options: [
      "Device Registered",
      "Ce Mac est géré par votre organisation",
      "Intune Active",
      "Enrollment Success",
    ],
    correctIndex: 1,
    explanation: "Le message « Ce Mac est géré par votre organisation » (Managed by your organization) confirme l'ADE macOS.",
  },
  {
    id: "mac-q2",
    text: "Où crée-t-on un profil ADE macOS dans Intune ?",
    options: [
      "Devices → macOS → Enrollment Program Tokens → Create Profile",
      "Apps → macOS → Add",
      "Reports → Device compliance",
      "Users → Groups",
    ],
    correctIndex: 0,
    explanation: "Les profils ADE macOS se créent depuis Enrollment Program Tokens, section macOS enrollment.",
  },
  {
    id: "mac-q3",
    text: "Quel portail assigne les Mac au serveur MDM ?",
    options: ["App Store Connect", "Apple Business Manager", "Apple Configurator", "iCloud"],
    correctIndex: 1,
    explanation: "Apple Business Manager permet d'assigner les Mac au serveur MDM Intune par numéro de série.",
  },
  {
    id: "mac-q4",
    text: "Que fait « Await Device Configuration » sur macOS ?",
    options: [
      "Met le Mac en veille",
      "Retient l'assistant jusqu'à application des profils MDM",
      "Désactive le Wi‑Fi",
      "Bloque les mises à jour",
    ],
    correctIndex: 1,
    explanation: "Await Device Configuration garantit que tous les profils Intune sont appliqués avant la fin de l'assistant macOS.",
  },
  {
    id: "mac-q5",
    text: "Quelle option active le mode supervisé sur Mac via ADE ?",
    options: ["Shared Device", "Supervised", "User Enrollment", "BYOD"],
    correctIndex: 1,
    explanation: "L'option Supervised dans le profil ADE macOS active le mode supervisé dès l'enrôlement.",
  },
  {
    id: "mac-q6",
    text: "Quel certificat est obligatoire pour les commandes push MDM vers Mac ?",
    options: ["APNs", "SSL web", "Developer ID", "Code signing"],
    correctIndex: 0,
    explanation: "Le certificat APNs (Apple Push Notification service) est requis pour que Intune communique avec les Mac.",
  },
  {
    id: "mac-q7",
    text: "Comment assigner 100 Mac à Intune dans ABM ?",
    options: [
      "Un par un uniquement",
      "Par lot CSV ou affectation automatique",
      "Via iTunes",
      "Par email",
    ],
    correctIndex: 1,
    explanation: "ABM supporte l'affectation par lot (import CSV) et l'affectation automatique de tous les nouveaux appareils.",
  },
  {
    id: "mac-q8",
    text: "Que faire si un Mac n'apparaît pas dans Intune ?",
    options: [
      "Réinstaller macOS manuellement",
      "Vérifier la synchronisation du token ABM",
      "Créer un compte iCloud",
      "Désactiver le pare-feu Apple",
    ],
    correctIndex: 1,
    explanation: "Un Mac absent dans Intune indique souvent un token ABM non synchronisé ou une affectation MDM manquante.",
  },
  {
    id: "mac-q9",
    text: "Quel déploiement décrit le Zero Touch Deployment ?",
    options: [
      "Configuration manuelle par IT sur chaque Mac",
      "L'utilisateur ouvre le Mac, ADE configure automatiquement via Intune",
      "Installation via clé USB uniquement",
      "Enrollment par email",
    ],
    correctIndex: 1,
    explanation: "Zero Touch : l'utilisateur allume le Mac, se connecte au Wi‑Fi, et Intune applique toute la configuration.",
  },
  {
    id: "mac-q10",
    text: "Quelle app Intune est typiquement requise pour l'accès aux apps entreprise ?",
    options: ["Safari", "Company Portal", "Photos", "GarageBand"],
    correctIndex: 1,
    explanation: "Company Portal permet aux utilisateurs d'accéder aux applications et ressources entreprise déployées via Intune.",
  },
];

export const adeMacScoreTiers = [
  { min: 0, title: "📖 À revoir", message: "Repassez les sections Configuration Intune et Premier démarrage, puis refaites le quiz." },
  { min: 60, title: "👍 Correct", message: "Bonne compréhension ! Visez 80 % pour valider la leçon." },
  { min: 80, title: "🏆 Validé", message: "Excellent ! Vous maîtrisez le déploiement ADE macOS avec Intune." },
  { min: 100, title: "💻 Expert macOS ADE", message: "Score parfait — prêt pour un déploiement Mac en production à grande échelle." },
];

export function isAdeMacLesson(courseSlug: string, lessonSlug: string): boolean {
  return courseSlug === ADE_MAC_COURSE_SLUG && lessonSlug === ADE_MAC_LESSON_SLUG;
}

export const ADE_MAC_COMPLETE_KEY = "lesson-ade-mac-complete";
