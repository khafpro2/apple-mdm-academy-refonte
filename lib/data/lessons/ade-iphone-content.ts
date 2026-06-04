import type { Question } from "@/lib/types";

export const ADE_IPHONE_LESSON_SLUG = "ade-iphone";
export const ADE_IPHONE_COURSE_SLUG = "intune-mac";

export const adeIphoneObjectives = [
  "Comprendre Automated Device Enrollment (ADE)",
  "Configurer un profil d'enrôlement ADE dans Intune",
  "Déployer un iPhone en zéro-touch sans intervention manuelle",
  "Activer automatiquement le mode supervisé",
  "Personnaliser l'assistant de configuration (Setup Assistant)",
  "Vérifier l'enrôlement automatique et la conformité MDM",
];

export const adeIphoneFlow = [
  { label: "Apple Business Manager", icon: "🍏", color: "from-gray-900 to-gray-700" },
  { label: "Serveur MDM (Microsoft Intune)", icon: "☁️", color: "from-indigo-600 to-violet-500" },
  { label: "Automated Device Enrollment (ADE)", icon: "📲", color: "from-sky-500 to-cyan-500" },
  { label: "Activation de l'iPhone", icon: "📱", color: "from-blue-500 to-blue-600" },
  { label: "Téléchargement du profil MDM", icon: "⬇️", color: "from-purple-500 to-indigo-500" },
  { label: "Configuration automatique", icon: "✅", color: "from-emerald-500 to-teal-500" },
];

export const adeIphoneTheory = [
  {
    title: "Qu'est-ce qu'ADE ?",
    body: [
      "Automated Device Enrollment (ADE), anciennement Device Enrollment Program (DEP), est le mécanisme Apple permettant l'enrôlement automatique des appareils dès leur première activation, sans configuration manuelle par l'utilisateur ou le technicien.",
      "ADE garantit le mode supervisé (supervised mode), l'application immédiate des politiques de sécurité MDM et une expérience zéro-touch : l'utilisateur final voit simplement l'écran « Votre organisation va configurer cet iPhone ».",
    ],
  },
  {
    title: "Capacités clés",
    body: [
      "Enrôlement automatique : l'appareil rejoint Intune dès l'assistant de configuration, sans installer manuellement un profil.",
      "Supervision automatique : restrictions avancées, Single App Mode, Blocker les suppressions de profils MDM sur appareils supervisés.",
      "Configuration à distance : profils Wi‑Fi, VPN, apps, restrictions et personnalisation de l'assistant de configuration (Setup Assistant).",
      "Application de politiques de sécurité : conformité, chiffrement, mot de passe, Conditional Access dès le premier démarrage.",
    ],
  },
];

export const adeIphoneConfigSteps = [
  "Ouvrir le Microsoft Intune Admin Center (endpoint.microsoft.com)",
  "Aller dans Devices → iOS/iPadOS → iOS/iPadOS enrollment",
  "Sélectionner Enrollment Program Tokens",
  "Choisir le jeton Apple Business Manager synchronisé",
  "Cliquer sur Create Profile (Créer un profil)",
  "Nommer le profil : ADE iPhone Production (selon votre convention)",
  "Configurer les options d'enrôlement recommandées",
  "Assigner le profil aux appareils ou groupes cibles",
];

export const adeIphoneRecommendedSettings = [
  { label: "Supervised", enabled: true, description: "Active le mode supervisé pour toutes les capacités MDM avancées." },
  { label: "Locked Enrollment", enabled: true, description: "Empêche l'utilisateur de retirer le profil MDM sans réinitialisation." },
  { label: "Await Device Configured", enabled: true, description: "Bloque l'assistant jusqu'à application complète des profils MDM." },
  { label: "Shared iPad", enabled: false, description: "Désactivé pour un déploiement utilisateur unique standard." },
];

export const adeIphoneAssignmentTopics = [
  {
    title: "Affectation manuelle",
    body: "Dans Apple Business Manager, assignez chaque iPhone au serveur MDM Intune par numéro de série. Idéal pour les petits déploiements ou les appareils ajoutés individuellement.",
  },
  {
    title: "Affectation automatique",
    body: "Configurez une règle par défaut dans ABM pour que tous les nouveaux appareils soient automatiquement assignés au serveur MDM Intune Production.",
  },
  {
    title: "Synchronisation ABM",
    body: "Intune synchronise les appareils depuis ABM toutes les 24 h (ou manuellement). Vérifiez que la synchronisation est active avant tout test de déploiement.",
  },
];

export const adeIphoneAssignmentChecks = [
  "Numéro de série visible dans Intune",
  "Serveur MDM correct (Intune Production)",
  "Profil ADE assigné à l'appareil",
];

export const adeIphoneTestSteps = [
  "Réinitialiser l'iPhone (Réglages → Général → Transférer ou réinitialiser → Effacer contenu et réglages)",
  "Allumer l'iPhone et sélectionner la langue et la région",
  "Se connecter au réseau Wi‑Fi",
  "Attendre l'activation Apple (connexion aux serveurs Apple)",
  "Observer l'écran « Organisation » ou « Remote Management »",
  "Valider l'enrôlement automatique — ne pas configurer manuellement",
];

export const adeIphoneExpectedResult =
  "L'organisation va configurer automatiquement cet iPhone";

export const adeIphoneVerificationItems = [
  "Profil ADE créé dans Intune avec Supervised activé",
  "Appareil assigné au serveur MDM dans ABM",
  "Synchronisation ABM → Intune réussie",
  "Test pilote effectué sur un iPhone",
  "Message « L'organisation va configurer… » affiché",
  "Appareil visible dans Intune avec statut Enrolled",
];

export const adeIphoneBestPractices = [
  "Toujours tester avec un appareil pilote avant un déploiement massif",
  "Utiliser des groupes dynamiques Intune pour cibler les profils ADE",
  "Documenter chaque profil ADE (nom, version, date, responsable)",
  "Vérifier les dates d'expiration APNs et jetons ABM (alertes J-60)",
  "Personnaliser l'assistant de configuration pour réduire les étapes utilisateur",
  "Conserver un iPhone de test dédié au lab ADE",
];

export const adeIphoneTroubleshooting = [
  {
    problem: "L'iPhone ne s'enrôle pas automatiquement",
    checks: ["Certificat APNs valide et non expiré", "Jeton ABM actif dans Intune", "Appareil assigné au bon serveur MDM", "Synchronisation ABM récente (< 24 h)"],
    solution: "Vérifiez chaque point ci-dessus. Forcez une synchronisation du jeton ABM dans Intune, puis réinitialisez l'iPhone.",
  },
  {
    problem: "Profil ADE absent sur l'appareil",
    checks: ["Profil ADE assigné au numéro de série", "Profil ADE publié et actif", "Appareil présent dans Intune → Devices"],
    solution: "Relancer la synchronisation ABM dans Intune (Enrollment Program Tokens → Sync). Attendre 15 min puis réinitialiser l'iPhone.",
  },
  {
    problem: "Écran d'organisation n'apparaît pas",
    checks: ["Appareil acheté via revendeur agréé ou ajouté à ABM", "ADE activé sur le profil", "Connexion Internet stable lors de l'activation"],
    solution: "Confirmer que l'iPhone est bien enregistré dans ABM avec le bon numéro de série. Tester sur un autre réseau Wi‑Fi.",
  },
  {
    problem: "Mode supervisé non activé",
    checks: ["Option Supervised cochée dans le profil ADE", "Profil ADE appliqué avant fin de l'assistant", "Pas de profil MDM manuel préalable"],
    solution: "Recréer le profil ADE avec Supervised activé. Réinitialiser complètement l'iPhone avant un nouveau test.",
  },
];

export const adeIphoneQuizQuestions: Question[] = [
  {
    id: "ade-q1",
    text: "Que signifie ADE ?",
    options: ["Apple Device Encryption", "Automated Device Enrollment", "Advanced Data Exchange", "Apple Deployment Engine"],
    correctIndex: 1,
    explanation: "ADE (Automated Device Enrollment) est le programme Apple d'enrôlement automatique, anciennement DEP.",
  },
  {
    id: "ade-q2",
    text: "Quel message confirme un enrôlement ADE réussi sur iPhone ?",
    options: [
      "Connectez-vous à iCloud",
      "L'organisation va configurer automatiquement cet iPhone",
      "Installez un profil MDM",
      "Activez Face ID",
    ],
    correctIndex: 1,
    explanation: "Ce message indique qu'Intune va appliquer la configuration via ADE sans intervention manuelle.",
  },
  {
    id: "ade-q3",
    text: "Quelle option active le mode supervisé via ADE ?",
    options: ["Shared iPad", "Supervised", "User Enrollment", "BYOD"],
    correctIndex: 1,
    explanation: "L'option Supervised dans le profil ADE active automatiquement le mode supervisé dès l'enrôlement.",
  },
  {
    id: "ade-q4",
    text: "Où crée-t-on un profil ADE dans Intune ?",
    options: [
      "Devices → Enrollment Program Tokens → Create Profile",
      "Apps → Add → iOS",
      "Reports → Device compliance",
      "Users → Add user",
    ],
    correctIndex: 0,
    explanation: "Les profils ADE se créent depuis Enrollment Program Tokens, après synchronisation du jeton ABM.",
  },
  {
    id: "ade-q5",
    text: "Que fait « Locked Enrollment » ?",
    options: [
      "Verrouille l'écran de l'iPhone",
      "Empêche la suppression du profil MDM sans réinitialisation",
      "Bloque l'App Store",
      "Désactive le Wi‑Fi",
    ],
    correctIndex: 1,
    explanation: "Locked Enrollment empêche l'utilisateur de retirer le profil MDM — essentiel pour la conformité entreprise.",
  },
  {
    id: "ade-q6",
    text: "Quel portail assigne les appareils au serveur MDM ?",
    options: ["App Store Connect", "Apple Business Manager", "Apple Configurator", "iCloud.com"],
    correctIndex: 1,
    explanation: "Apple Business Manager permet d'assigner les appareils au serveur MDM Intune par numéro de série.",
  },
  {
    id: "ade-q7",
    text: "Que fait « Await Device Configured » ?",
    options: [
      "Attend la configuration MDM avant de terminer l'assistant",
      "Met l'iPhone en veille",
      "Désactive la caméra",
      "Retarde les mises à jour iOS",
    ],
    correctIndex: 0,
    explanation: "Await Device Configured bloque l'assistant de configuration jusqu'à application complète des profils MDM.",
  },
  {
    id: "ade-q8",
    text: "Combien de temps peut prendre la synchronisation ABM par défaut ?",
    options: ["Instantanée", "Jusqu'à 24 heures", "7 jours", "30 jours"],
    correctIndex: 1,
    explanation: "La synchronisation automatique ABM → Intune peut prendre jusqu'à 24 h ; une sync manuelle accélère le processus.",
  },
  {
    id: "ade-q9",
    text: "Quelle action est requise avant un test ADE ?",
    options: [
      "Installer Xcode",
      "Réinitialiser l'iPhone",
      "Créer un compte iCloud personnel",
      "Jailbreaker l'appareil",
    ],
    correctIndex: 1,
    explanation: "Un test ADE nécessite une réinitialisation factory pour simuler une première activation.",
  },
  {
    id: "ade-q10",
    text: "Quel certificat est obligatoire pour les commandes push MDM ?",
    options: ["APNs (Apple Push Notification service)", "SSL web", "Code signing", "Developer ID"],
    correctIndex: 0,
    explanation: "Sans certificat APNs valide, Intune ne peut pas envoyer de commandes MDM aux iPhone enrôlés.",
  },
];

export const adeIphoneScoreTiers = [
  { min: 0, title: "📖 À revoir", message: "Repassez les sections Configuration ADE et Test de déploiement, puis refaites le quiz." },
  { min: 60, title: "👍 Bon niveau", message: "Bonne base ! Visez 80 % pour valider officiellement la leçon." },
  { min: 80, title: "🏆 Validé", message: "Excellent ! Vous maîtrisez le déploiement ADE iPhone avec Intune." },
  { min: 100, title: "📱 Expert ADE", message: "Score parfait — vous êtes prêt pour un déploiement iPhone en production." },
];

export function isAdeIphoneLesson(courseSlug: string, lessonSlug: string): boolean {
  return courseSlug === ADE_IPHONE_COURSE_SLUG && lessonSlug === ADE_IPHONE_LESSON_SLUG;
}

export const ADE_IPHONE_COMPLETE_KEY = "lesson-ade-iphone-complete";
