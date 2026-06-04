import type { Question } from "@/lib/types";

export const ABM_INTUNE_LESSON_SLUG = "abm-intune";
export const ABM_INTUNE_COURSE_SLUG = "intune-mac";

export const abmIntuneObjectives = [
  "Comprendre le rôle d'Apple Business Manager",
  "Comprendre le fonctionnement d'Automated Device Enrollment (ADE)",
  "Connecter Apple Business Manager à Microsoft Intune",
  "Importer un jeton MDM",
  "Synchroniser les appareils Apple",
  "Déployer automatiquement iPhone, iPad et Mac",
  "Diagnostiquer les erreurs courantes de synchronisation",
];

export const abmIntunePrerequisites = [
  "Un compte Apple Business Manager administrateur",
  "Une licence Microsoft Intune active",
  "Un accès administrateur Microsoft Entra ID",
  "Un navigateur moderne (Edge, Chrome ou Safari)",
  "Des appareils Apple compatibles ADE (iOS 11+, macOS 10.14+)",
];

export const abmIntuneCertifications = [
  "Apple Certified IT Professional",
  "Apple Deployment & Management",
  "Jamf 100",
  "Jamf 200",
  "Microsoft Intune Administrator",
];

export const abmIntuneArchitecture = [
  { label: "Apple Business Manager", icon: "🍏", color: "from-gray-900 to-gray-700" },
  { label: "Serveur MDM", icon: "⚙️", color: "from-blue-600 to-blue-500" },
  { label: "Microsoft Intune", icon: "☁️", color: "from-indigo-600 to-violet-500" },
  { label: "Automated Device Enrollment (ADE)", icon: "📲", color: "from-sky-500 to-cyan-500" },
  { label: "iPhone / iPad / Mac", icon: "💻", color: "from-slate-600 to-slate-500" },
  { label: "Utilisateur final", icon: "👤", color: "from-emerald-500 to-teal-500" },
];

export const abmIntuneTheory = [
  {
    title: "Apple Business Manager (ABM)",
    body: [
      "Apple Business Manager est le portail Apple permettant la gestion centralisée des appareils, l'attribution automatique aux serveurs MDM, la gestion des applications et des licences (Apps & Books), ainsi que la création d'identifiants Apple gérés (Managed Apple ID).",
      "ABM est le point d'entrée obligatoire pour tout déploiement professionnel à grande échelle : les appareils achetés via des revendeurs agréés ou ajoutés manuellement y sont enregistrés avant d'être assignés à votre solution MDM.",
    ],
  },
  {
    title: "Automated Device Enrollment (ADE)",
    body: [
      "Automated Device Enrollment (anciennement DEP) permet l'enrôlement automatique des appareils dès leur première activation, le mode supervisé (supervised mode), l'application des profils de sécurité dès le premier démarrage et une configuration zéro-touch pour l'utilisateur final.",
      "ADE garantit que l'appareil reste géré par l'organisation : l'utilisateur ne peut pas retirer le profil MDM sans intervention administrateur sur les appareils supervisés.",
    ],
  },
  {
    title: "Microsoft Intune comme serveur MDM",
    body: [
      "Microsoft Intune agit comme serveur MDM et reçoit les appareils synchronisés depuis Apple Business Manager. Intune orchestre les profils de configuration, la conformité, Conditional Access et le déploiement d'applications sur l'écosystème Apple.",
      "La liaison ABM ↔ Intune repose sur trois piliers : le certificat APNs (Apple Push Notification service), le serveur MDM enregistré dans ABM et le jeton d'inscription (server_token.p7m) importé dans Intune.",
    ],
  },
];

export const abmIntuneSteps = [
  {
    id: "etape-1",
    title: "Créer le certificat APNs",
    steps: [
      "Ouvrir le Microsoft Intune Admin Center (endpoint.microsoft.com)",
      "Aller dans Devices → iOS/iPadOS → iOS/iPadOS enrollment",
      "Sélectionner Apple MDM Push Certificate",
      "Télécharger la CSR (Certificate Signing Request) générée par Intune",
      "Ouvrir le portail Apple Push Certificates (identity.apple.com/pushcert)",
      "Importer la CSR et valider avec un Apple ID dédié",
      "Télécharger le certificat APNs (.pem) depuis le portail Apple",
      "Revenir dans Intune et importer le certificat APNs téléchargé",
    ],
    alert: "Utilisez toujours le même Apple ID pour les renouvellements. Changer d'Apple ID invalide le certificat et nécessite un réenrôlement des appareils.",
  },
  {
    id: "etape-2",
    title: "Créer le serveur MDM dans Apple Business Manager",
    steps: [
      "Ouvrir Apple Business Manager (business.apple.com)",
      "Aller dans Paramètres → Gestion des appareils",
      "Cliquer sur Ajouter un serveur MDM",
      "Nommer le serveur : Intune Production (ou selon votre convention de nommage)",
      "Dans Intune, télécharger la clé publique MDM (Apple MDM server certificate)",
      "Importer la clé publique dans Apple Business Manager",
      "Valider la création du serveur MDM",
    ],
  },
  {
    id: "etape-3",
    title: "Télécharger le jeton ABM",
    steps: [
      "Dans Apple Business Manager, sélectionner le serveur MDM Intune Production",
      "Cliquer sur Télécharger le jeton (Download Token)",
      "Enregistrer le fichier server_token.p7m en lieu sûr",
    ],
    note: "Le fichier téléchargé est server_token.p7m. Ce fichier permet à Intune d'établir une relation de confiance avec Apple Business Manager. Il expire après 365 jours et doit être renouvelé avant expiration.",
  },
  {
    id: "etape-4",
    title: "Importer le jeton dans Intune",
    steps: [
      "Ouvrir Intune Admin Center",
      "Aller dans Devices → Enrollment → Enrollment Program Tokens",
      "Cliquer sur Add (Ajouter)",
      "Importer le fichier server_token.p7m",
      "Attendre la synchronisation automatique (peut prendre jusqu'à 24 h)",
      "Vérifier que les appareils apparaissent dans Intune → Devices",
    ],
    indicators: ["Jeton valide", "Synchronisation active", "Appareils détectés"],
  },
];

export const abmIntuneVerificationItems = [
  "Token actif",
  "APNs valide",
  "Synchronisation réussie",
  "ADE activé",
  "Appareils visibles dans Intune",
  "Attribution correcte au serveur MDM",
];

export const abmIntuneTroubleshooting = [
  { problem: "Token expiré", solution: "Télécharger un nouveau jeton server_token.p7m depuis Apple Business Manager et l'importer dans Intune avant l'expiration (365 jours)." },
  { problem: "APNs expiré", solution: "Renouveler le certificat APNs avec le même Apple ID utilisé lors de la création initiale. Importer le nouveau certificat dans Intune." },
  { problem: "Aucun appareil synchronisé", solution: "Vérifier l'affectation des appareils au serveur MDM Intune dans ABM. Confirmer que les appareils ont été achetés via un revendeur agréé ou ajoutés manuellement." },
  { problem: "Erreur de connexion Intune", solution: "Vérifier les permissions administrateur Intune et Entra ID. S'assurer que le compte dispose du rôle Intune Administrator ou équivalent." },
];

export const abmIntuneBestPractices = [
  "Renouveler les certificats APNs et jetons ABM avant expiration (alertes à J-60)",
  "Utiliser un compte Apple ID dédié à l'entreprise (jamais un compte personnel)",
  "Sauvegarder les tokens server_token.p7m dans un coffre-fort (Azure Key Vault, 1Password)",
  "Documenter les dates d'expiration dans un registre de conformité",
  "Activer les alertes de renouvellement dans Intune et votre outil ITSM",
  "Tester les synchronisations ABM régulièrement sur un groupe pilote",
];

export const abmIntuneQuizQuestions: Question[] = [
  {
    id: "abm-q1",
    text: "Quel fichier est exporté depuis Apple Business Manager ?",
    options: ["mdm.mobileconfig", "server_token.p7m", "intune.json", "csr.pem"],
    correctIndex: 1,
    explanation: "Le jeton ABM est toujours un fichier .p7m (server_token.p7m) qui établit la relation de confiance entre ABM et le serveur MDM.",
  },
  {
    id: "abm-q2",
    text: "Quel service permet l'enrôlement automatique Apple ?",
    options: ["APNs", "ADE (Automated Device Enrollment)", "VPP", "SSO"],
    correctIndex: 1,
    explanation: "Automated Device Enrollment (ADE), anciennement DEP, permet l'enrôlement automatique et le mode supervisé dès la première activation.",
  },
  {
    id: "abm-q3",
    text: "Quel portail Apple est utilisé pour la gestion des appareils entreprise ?",
    options: ["Apple School Manager", "Apple Business Manager", "App Store Connect", "Apple Configurator"],
    correctIndex: 1,
    explanation: "Apple Business Manager (ABM) est le portail dédié aux entreprises pour la gestion des appareils, apps et identifiants gérés.",
  },
  {
    id: "abm-q4",
    text: "Quel composant est obligatoire pour les notifications push MDM ?",
    options: ["APNs (Apple Push Notification service)", "AirDrop", "TestFlight", "Apple Music"],
    correctIndex: 0,
    explanation: "Le certificat APNs est obligatoire : sans lui, Intune ne peut pas envoyer de commandes MDM aux appareils Apple.",
  },
  {
    id: "abm-q5",
    text: "Quel est le rôle principal de Microsoft Intune dans cette architecture ?",
    options: ["Antivirus", "Serveur MDM", "Sauvegarde cloud", "Inventaire matériel"],
    correctIndex: 1,
    explanation: "Intune agit comme serveur MDM : il reçoit les appareils depuis ABM et applique les politiques, apps et conformité.",
  },
];

export function isAbmIntuneLesson(courseSlug: string, lessonSlug: string): boolean {
  return courseSlug === ABM_INTUNE_COURSE_SLUG && lessonSlug === ABM_INTUNE_LESSON_SLUG;
}
