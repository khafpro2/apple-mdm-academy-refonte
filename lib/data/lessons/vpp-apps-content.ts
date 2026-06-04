import type { Question } from "@/lib/types";

export const VPP_APPS_LESSON_SLUG = "vpp-apps-books";
export const VPP_APPS_COURSE_SLUG = "intune-mac";

export const vppAppsCertifications = [
  "Apple Certified IT Professional",
  "Apple Deployment and Management",
  "Jamf 100",
  "Jamf 200",
];

export const vppAppsObjectives = [
  "Comprendre Apps & Books (anciennement Volume Purchase Program — VPP)",
  "Acheter des licences d'applications en volume dans Apple Business Manager",
  "Synchroniser Apple Business Manager avec Intune ou Jamf Pro",
  "Attribuer des applications aux utilisateurs (user-based licensing)",
  "Attribuer des applications aux appareils (device-based licensing)",
  "Déployer automatiquement des applications sans Apple ID personnel",
];

export const vppAppsCapabilities = [
  "Acheter des applications en volume pour toute l'organisation",
  "Distribuer des applications iOS, iPadOS et macOS via MDM",
  "Récupérer les licences lorsqu'un employé quitte l'entreprise",
  "Gérer les applications sans Apple ID personnel sur les appareils",
];

export const vppAppsExamples = [
  { name: "Microsoft Outlook", icon: "📧", category: "Productivité" },
  { name: "Microsoft Teams", icon: "💬", category: "Collaboration" },
  { name: "OneDrive", icon: "☁️", category: "Stockage" },
  { name: "Zoom", icon: "📹", category: "Visioconférence" },
  { name: "Slack", icon: "💼", category: "Messagerie" },
  { name: "Cisco Webex", icon: "🎥", category: "Visioconférence" },
];

export const vppAppsArchitecture = [
  { label: "Apple Business Manager", icon: "🏢", color: "from-gray-800 to-gray-700" },
  { label: "Apps & Books", icon: "📚", color: "from-blue-600 to-indigo-600" },
  { label: "Intune / Jamf Pro", icon: "☁️", color: "from-indigo-600 to-violet-500" },
  { label: "iPhone · iPad · Mac", icon: "📱", color: "from-slate-600 to-slate-500" },
];

export const vppPurchaseSteps = [
  {
    title: "Étape 1 — Connexion Apple Business Manager",
    steps: [
      "Ouvrir business.apple.com et se connecter avec un compte Administrateur ou Content Manager",
      "Vérifier que l'organisation est active et que le rôle permet d'acheter des apps",
    ],
    link: "https://business.apple.com",
  },
  {
    title: "Étape 2 — Accéder à Apps & Books",
    steps: [
      "Dans le menu latéral, sélectionner Apps & Books",
      "Choisir l'onglet Apps (ou Books pour les livres numériques)",
    ],
  },
  {
    title: "Étape 3 — Rechercher une application",
    steps: [
      "Utiliser la barre de recherche (ex. Microsoft Teams, Outlook, Zoom)",
      "Vérifier le nom exact de l'éditeur et la compatibilité iOS / macOS",
    ],
  },
  {
    title: "Étape 4 — Sélectionner la région",
    steps: [
      "Choisir la région / le pays de distribution (ex. France, Belgique, Canada)",
      "La région doit correspondre aux appareils cibles et au token MDM",
    ],
  },
  {
    title: "Étape 5 — Acheter les licences",
    steps: [
      "Indiquer la quantité de licences (ex. 500 pour 500 iPhone)",
      "Valider l'achat — les apps gratuites ne génèrent pas de facture",
      "Pour les apps payantes, le paiement s'effectue via le mode de facturation ABM",
    ],
  },
  {
    title: "Étape 6 — Vérifier l'inventaire",
    steps: [
      "Consulter Apps & Books → Apps → [Nom de l'app] → Licenses",
      "Confirmer le nombre total, assigné et disponible",
      "Noter la date d'achat pour le suivi des coûts",
    ],
  },
];

export const vppLicenseTypes = [
  {
    title: "Applications gratuites",
    description:
      "Outlook, Teams, OneDrive et de nombreuses apps professionnelles sont gratuites. Vous obtenez des licences « gratuites » à assigner via MDM — aucun paiement, mais le flux d'achat ABM reste obligatoire.",
    icon: "🆓",
  },
  {
    title: "Applications payantes",
    description:
      "Les apps payantes sont facturées par licence. Chaque installation consomme une licence jusqu'à sa récupération. Planifiez les achats par vague de déploiement.",
    icon: "💳",
  },
  {
    title: "Licences récupérables",
    description:
      "Lorsqu'une app est retirée d'un utilisateur ou d'un appareil, la licence revient dans le pool ABM et peut être réassignée — réduction significative des coûts.",
    icon: "♻️",
  },
];

export const vppIntuneSyncSteps = [
  "Ouvrir Microsoft Intune Admin Center (endpoint.microsoft.com)",
  "Aller dans Tenant administration → Connectors and tokens",
  "Sélectionner Apple VPP tokens (Apps & Books)",
  "Cliquer sur Add token",
  "Dans ABM : Apps & Books → Preferences → My Server Tokens → Generate/download token (.vpptoken)",
  "Importer le fichier .vpptoken dans Intune et nommer le token (ex. ABM-Production)",
  "Cliquer sur Sync pour importer le catalogue et les licences",
];

export const vppSyncVerificationItems = [
  "Token VPP actif dans Intune (statut Active, non expiré)",
  "Applications synchronisées visibles dans Apps → iOS ou macOS",
  "Licences disponibles correspondent à l'inventaire ABM",
  "Test d'assignation réussi sur un appareil pilote",
];

export const vppDeploymentMethods = [
  {
    title: "Méthode 1 — Attribution à un utilisateur",
    subtitle: "User-based licensing",
    pros: [
      "L'app suit l'utilisateur sur tous ses appareils enrôlés",
      "Idéal pour BYOD ou utilisateurs multi-appareils",
      "Licence récupérable quand l'utilisateur quitte l'entreprise",
    ],
    cons: [
      "Nécessite que l'utilisateur soit connu dans Intune (Azure AD)",
      "Peut installer l'app sur des appareils personnels si mal ciblé",
      "Délai possible si l'utilisateur n'a pas encore enrôlé son appareil",
    ],
    icon: "👤",
    color: "from-sky-500 to-blue-600",
  },
  {
    title: "Méthode 2 — Attribution à un appareil",
    subtitle: "Device-based licensing",
    pros: [
      "Installation automatique dès l'enrôlement ADE (Zero Touch)",
      "Parfait pour flottes d'entreprise (iPhone, iPad, Mac)",
      "Pas de dépendance à un compte utilisateur Azure AD",
      "Installation silencieuse sans Apple ID",
    ],
    cons: [
      "La licence reste liée à l'appareil jusqu'à récupération manuelle",
      "Changement d'appareil = nouvelle licence consommée",
      "Moins adapté au BYOD",
    ],
    icon: "📱",
    color: "from-indigo-500 to-violet-600",
  },
];

export const vppSilentInstallFeatures = [
  "Installée automatiquement sans action de l'utilisateur",
  "Sans Apple ID personnel sur l'appareil",
  "Sans intervention utilisateur (mode supervisé requis pour iOS/iPadOS)",
  "Déploiement en arrière-plan via le serveur MDM et APNs",
];

export const vppSilentInstallExample = [
  { label: "Intune — App Teams", icon: "☁️", color: "from-indigo-600 to-indigo-500" },
  { label: "APNs réveille l'iPhone", icon: "📡", color: "from-orange-500 to-amber-500" },
  { label: "Téléchargement App Store", icon: "⬇️", color: "from-blue-500 to-cyan-500" },
  { label: "Teams installé silencieusement", icon: "✅", color: "from-green-500 to-emerald-500" },
];

export const vppLicenseRecoverySteps = [
  "Retirer l'application de l'utilisateur ou de l'appareil dans Intune (Unassign / Remove)",
  "Attendre la confirmation de désinstallation ou forcer un check-in MDM",
  "La licence est automatiquement récupérée dans le pool Apps & Books",
  "Réattribuer la licence à un nouvel employé ou appareil",
];

export const vppLicenseRecoveryBenefit =
  "Réduction des coûts : une même licence peut servir plusieurs employés au fil du temps, à condition de retirer l'app avant chaque réassignation.";

export const vppTroubleshooting = [
  {
    problem: "Licence indisponible",
    causes: [
      "Toutes les licences sont déjà assignées",
      "Achat ABM insuffisant pour la taille du parc",
      "Licences bloquées sur des appareils non retirés",
    ],
    solution:
      "Acheter des licences supplémentaires dans ABM → Apps & Books. Vérifier l'inventaire « Available » vs « Assigned ». Retirer les apps des appareils désactivés pour libérer des licences.",
  },
  {
    problem: "Application non installée",
    causes: [
      "Token Apps & Books expiré ou invalide",
      "App non synchronisée dans Intune",
      "Appareil non supervisé (iOS) ou profil MDM absent",
      "APNs ou connectivité réseau défaillante",
    ],
    solution:
      "Vérifier le token VPP dans Intune (Tenant administration → Apple VPP tokens). Resynchroniser le catalogue. Confirmer que l'appareil est supervisé et a check-in récemment.",
  },
  {
    problem: "Synchronisation échouée",
    causes: [
      "Token .vpptoken expiré (validité limitée)",
      "Token révoqué dans ABM",
      "Permissions insuffisantes du compte ABM",
    ],
    solution:
      "Générer un nouveau token dans ABM → Apps & Books → Preferences → My Server Tokens. Importer le nouveau .vpptoken dans Intune et resynchroniser immédiatement.",
  },
  {
    problem: "App installée mais ne s'ouvre pas",
    causes: [
      "Licence utilisateur vs appareil mal configurée",
      "App Protection Policy bloquante",
      "Version incompatible avec l'OS",
    ],
    solution:
      "Vérifier le type d'assignation (user vs device). Contrôler les App Protection Policies. Mettre à jour l'OS ou choisir une version compatible dans Intune.",
  },
];

export const vppBestPractices = [
  "Utiliser des groupes dynamiques Azure AD pour cibler les déploiements (ex. iOS-Production, Mac-Finance)",
  "Surveiller régulièrement les licences disponibles vs assignées dans ABM et Intune",
  "Renouveler les tokens VPP avant expiration (alerte J-30)",
  "Déployer d'abord sur un groupe pilote de 5 à 10 appareils avant le déploiement massif",
  "Documenter les achats de licences et les dates de renouvellement token",
  "Retirer systématiquement les apps lors du offboarding employé pour récupérer les licences",
];

export const vppCaseStudy = {
  title: "Cas pratique — Déploiement Outlook, Teams et OneDrive",
  scenario:
    "Une entreprise possède 500 iPhone et 250 Mac. L'équipe IT doit déployer Microsoft Outlook, Teams et OneDrive sur l'ensemble du parc sans Apple ID personnel, en installation automatique dès l'enrôlement ADE.",
  tasks: [
    "Acheter les licences dans Apple Business Manager",
    "Synchroniser le token Apps & Books avec Intune",
    "Configurer le déploiement automatique sur iPhone et Mac",
  ],
  solution: [
    "ABM — Apps & Books : rechercher Outlook, Teams et OneDrive. Acheter 750 licences device-based (500 iPhone + 250 Mac) — apps gratuites, achat à 0 € mais obligatoire pour l'assignation MDM.",
    "ABM — Token : générer un server token (.vpptoken) dans Apps & Books → Preferences → My Server Tokens. Télécharger et conserver une copie de sauvegarde.",
    "Intune — Sync : Tenant administration → Connectors and tokens → Apple VPP tokens → Add token → importer .vpptoken → Sync. Vérifier que les 3 apps apparaissent avec 750 licences disponibles.",
    "Intune — iPhone : Apps → iOS → [Teams] → Assign → Required → groupe dynamique « iOS-Production » (500 devices). Assignment type : Device licensing. App install : Force Install.",
    "Intune — Mac : Apps → macOS → [Outlook] → Assign → Required → groupe « Mac-Production » (250 devices). Même logique pour Teams et OneDrive.",
    "Validation : enrôler 2 iPhone et 1 Mac pilotes via ADE. Confirmer installation silencieuse sans Apple ID. Monitorer Intune → Device install status.",
    "Prévention : alerte J-30 sur expiration token VPP. Dashboard mensuel licences Available vs Assigned.",
  ],
};

export const vppQuizQuestions: Question[] = [
  {
    id: "vpp-q1",
    text: "Quel service remplace l'ancien Volume Purchase Program (VPP) ?",
    options: ["ADE (Automated Device Enrollment)", "Apps & Books", "APNs (Apple Push Notification service)", "SSO (Single Sign-On)"],
    correctIndex: 1,
    explanation: "Apps & Books dans Apple Business Manager remplace le VPP pour l'achat et la distribution d'applications en volume.",
  },
  {
    id: "vpp-q2",
    text: "Peut-on récupérer une licence Apps & Books ?",
    options: ["Non, les licences sont définitives", "Oui, en retirant l'application de l'utilisateur ou de l'appareil", "Seulement pour les apps payantes", "Seulement avec Jamf Pro"],
    correctIndex: 1,
    explanation: "Les licences récupérables reviennent dans le pool ABM lorsque l'app est retirée via MDM.",
  },
  {
    id: "vpp-q3",
    text: "Où achète-t-on des licences d'applications en volume ?",
    options: ["App Store personnel", "Apple Business Manager → Apps & Books", "Microsoft Store", "identity.apple.com"],
    correctIndex: 1,
    explanation: "Tous les achats volume passent par Apps & Books dans Apple Business Manager.",
  },
  {
    id: "vpp-q4",
    text: "Quel fichier connecte ABM à Intune pour Apps & Books ?",
    options: ["server_token.p7m (ADE)", "Fichier .vpptoken", "Certificat APNs .pem", "Profil .mobileconfig"],
    correctIndex: 1,
    explanation: "Le token VPP (.vpptoken) généré dans ABM est importé dans Intune → Apple VPP tokens.",
  },
  {
    id: "vpp-q5",
    text: "Quelle méthode est idéale pour une flotte d'iPhone d'entreprise en ADE ?",
    options: [
      "Attribution à l'utilisateur (user-based)",
      "Attribution à l'appareil (device-based)",
      "Installation manuelle App Store",
      "Email avec lien de téléchargement",
    ],
    correctIndex: 1,
    explanation: "Device-based licensing permet l'installation automatique dès l'enrôlement ADE, sans Apple ID.",
  },
  {
    id: "vpp-q6",
    text: "Une app VPP peut-elle s'installer sans Apple ID personnel ?",
    options: ["Non, un Apple ID est toujours requis", "Oui, via MDM en mode supervisé", "Seulement sur Mac", "Seulement pour les apps gratuites"],
    correctIndex: 1,
    explanation: "Le déploiement MDM en mode supervisé permet l'installation silencieuse sans Apple ID personnel.",
  },
  {
    id: "vpp-q7",
    text: "Que faire si « Licence indisponible » apparaît dans Intune ?",
    options: [
      "Réenrôler tous les appareils",
      "Acheter des licences supplémentaires dans ABM",
      "Renouveler le certificat APNs",
      "Créer un nouveau tenant Intune",
    ],
    correctIndex: 1,
    explanation: "Licence indisponible signifie que le pool de licences est épuisé — acheter ou récupérer des licences.",
  },
  {
    id: "vpp-q8",
    text: "Où configure-t-on le token VPP dans Intune ?",
    options: [
      "Devices → iOS enrollment",
      "Tenant administration → Connectors and tokens → Apple VPP tokens",
      "Apps → App Store",
      "Endpoint security → Antivirus",
    ],
    correctIndex: 1,
    explanation: "Le connecteur Apps & Books se configure dans Tenant administration → Connectors and tokens.",
  },
  {
    id: "vpp-q9",
    text: "Jamf Pro peut-il aussi utiliser Apps & Books ?",
    options: [
      "Non, uniquement Intune",
      "Oui, via un token Apps & Books synchronisé avec Jamf",
      "Seulement pour macOS",
      "Seulement avec des apps Apple",
    ],
    correctIndex: 1,
    explanation: "Jamf Pro et Intune consomment tous deux le même token Apps & Books depuis ABM.",
  },
  {
    id: "vpp-q10",
    text: "Quelle bonne pratique avant un déploiement massif ?",
    options: [
      "Déployer directement sur 10 000 appareils",
      "Tester d'abord sur un groupe pilote",
      "Désactiver APNs",
      "Utiliser des Apple ID personnels",
    ],
    correctIndex: 1,
    explanation: "Un groupe pilote valide le token, les licences et l'installation silencieuse avant le déploiement à grande échelle.",
  },
];

export const vppScoreTiers = [
  { min: 0, title: "📖 À revoir", message: "Repassez les sections Apps & Books et Synchronisation, puis refaites le quiz." },
  { min: 60, title: "👍 Correct", message: "Bonne compréhension ! Visez 80 % pour valider la leçon." },
  { min: 80, title: "🏆 Validé", message: "Excellent ! Vous maîtrisez Apps & Books et le déploiement VPP." },
  { min: 100, title: "📚 Expert Apps & Books", message: "Score parfait — vous êtes autonome sur l'achat, la sync et le déploiement d'applications en volume." },
];

export function isVppAppsLesson(courseSlug: string, lessonSlug: string): boolean {
  return courseSlug === VPP_APPS_COURSE_SLUG && lessonSlug === VPP_APPS_LESSON_SLUG;
}

export const VPP_APPS_COMPLETE_KEY = "lesson-vpp-apps-books-complete";

export function getVppSyncHealthStatus(itemsChecked: number, total: number): "healthy" | "warning" {
  return itemsChecked >= total ? "healthy" : "warning";
}
