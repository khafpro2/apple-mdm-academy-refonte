import type { Question } from "@/lib/types";

export const APNS_LESSON_SLUG = "apns-certificates";
export const APNS_COURSE_SLUG = "intune-mac";

export const apnsCertifications = [
  "Apple Certified IT Professional",
  "Apple Deployment and Management",
  "Jamf 100",
  "Jamf 200",
];

export const apnsObjectives = [
  "Comprendre le rôle des Apple Push Notification service (APNs) en MDM",
  "Créer un certificat APNs pour Intune ou Jamf Pro",
  "Renouveler un certificat APNs sans rupture de service",
  "Éviter les interruptions de gestion des appareils Apple",
  "Diagnostiquer les problèmes de communication MDM liés à APNs",
];

export const apnsWithoutConsequences = [
  "Aucun ordre MDM ne peut être envoyé aux appareils",
  "Aucun profil de configuration ne peut être installé à distance",
  "Aucun inventaire ne peut remonter vers le serveur MDM",
  "Aucun effacement à distance (Remote Wipe) n'est possible",
];

export const apnsArchitecture = [
  { label: "Serveur MDM (Intune / Jamf)", icon: "☁️", color: "from-indigo-600 to-violet-500" },
  { label: "Apple Push Notification service (APNs)", icon: "📡", color: "from-orange-500 to-red-500" },
  { label: "iPhone · iPad · Mac", icon: "📱", color: "from-slate-600 to-slate-500" },
];

export const apnsPushFlow = [
  "L'administrateur pousse une commande depuis Intune ou Jamf (ex. installer une app)",
  "Le serveur MDM envoie la demande à Apple Push Notification service (APNs)",
  "APNs envoie une notification push silencieuse pour réveiller l'appareil",
  "L'appareil contacte le serveur MDM pour récupérer la commande en attente",
  "L'action est exécutée (téléchargement, installation, inventaire, etc.)",
];

export const apnsInstallAppFlow = [
  { label: "Serveur MDM", icon: "☁️", color: "from-indigo-600 to-indigo-500" },
  { label: "APNs", icon: "📡", color: "from-orange-500 to-amber-500" },
  { label: "Mac / iPhone", icon: "💻", color: "from-slate-600 to-slate-500" },
  { label: "Téléchargement", icon: "⬇️", color: "from-blue-500 to-cyan-500" },
  { label: "Installation", icon: "✅", color: "from-green-500 to-emerald-500" },
];

export const apnsCreationSteps = [
  {
    title: "Étape 1 — Générer la CSR dans Intune",
    steps: [
      "Ouvrir Microsoft Intune Admin Center (endpoint.microsoft.com)",
      "Aller dans Devices → iOS/iPadOS → iOS/iPadOS enrollment",
      "Sélectionner Apple MDM Push Certificate",
      "Cliquer sur Create (ou Renew) et télécharger la CSR (Certificate Signing Request)",
    ],
  },
  {
    title: "Étape 2 — Portail Apple Push Certificates",
    steps: [
      "Ouvrir https://identity.apple.com/pushcert dans un navigateur",
      "Se connecter avec l'Apple ID dédié à l'entreprise (jamais un compte personnel)",
      "Accepter les conditions si c'est la première utilisation",
    ],
    link: "https://identity.apple.com/pushcert",
  },
  {
    title: "Étape 3 — Importer la CSR",
    steps: [
      "Cliquer sur Create a Certificate (ou Renew)",
      "Importer le fichier CSR téléchargé depuis Intune",
      "Valider la création du certificat",
    ],
  },
  {
    title: "Étape 4 — Télécharger le certificat APNs",
    steps: [
      "Télécharger le certificat (.pem) depuis le portail Apple",
      "Conserver une copie de sauvegarde dans un coffre-fort (Key Vault, 1Password)",
      "Noter la date d'expiration affichée (365 jours)",
    ],
  },
  {
    title: "Étape 5 — Importer dans Intune",
    steps: [
      "Revenir dans Intune → Apple MDM Push Certificate",
      "Importer le fichier .pem téléchargé",
      "Vérifier que le statut affiche Active et la date d'expiration",
    ],
  },
];

export const apnsRenewalRules = [
  "Toujours utiliser le même Apple ID que lors de la création initiale",
  "Renouveler au minimum 30 jours avant la date d'expiration",
  "Ne jamais laisser le certificat expirer — la gestion MDM s'arrête immédiatement",
  "Sauvegarder le nouveau certificat après chaque renouvellement",
];

export const apnsRenewalBreakConsequences = [
  "Rupture de confiance entre le serveur MDM et APNs",
  "Réenrôlement possible de tous les appareils Apple",
  "Interruption totale de la gestion à distance",
];

export const apnsRenewalChecklist = [
  "Même Apple ID que la création initiale",
  "Certificat actuel encore valide (renouveler avant expiration)",
  "Sauvegarde du certificat .pem effectuée",
  "Alerte calendrier configurée à J-30",
];

export const apnsVerificationItems = [
  "Certificat APNs actif dans Intune (statut Active)",
  "Date d'expiration vérifiée (> 30 jours restants)",
  "Test de commande MDM réussi (Sync device, Install app)",
  "Inventaire remonté sur au moins un appareil pilote",
  "Ports réseau APNs ouverts (2195, 2196, 5223, 443)",
];

export const apnsTroubleshooting = [
  {
    problem: "Device Not Responding",
    causes: ["Certificat APNs expiré ou invalide", "Réseau bloquant les ports APNs", "Appareil hors ligne ou en mode avion"],
    solution:
      "Vérifier la date d'expiration du certificat dans Intune. Contrôler les ports 2195, 2196, 5223 et 443. Confirmer que l'appareil a accès à Internet et qu'il a check-in récemment.",
  },
  {
    problem: "Push Certificate Invalid",
    causes: ["Certificat expiré", "Renouvellement avec un Apple ID différent", "Import .pem corrompu ou incorrect"],
    solution:
      "Renouveler immédiatement le certificat avec le même Apple ID sur identity.apple.com/pushcert. Réimporter le .pem dans Intune sans attendre.",
  },
  {
    problem: "Commandes MDM bloquées",
    causes: ["Chaîne APNs → MDM interrompue", "File d'attente MDM saturée", "Profil MDM retiré ou expiré"],
    solution:
      "Tester APNs d'abord (renouveler certificat si besoin), puis forcer un check-in MDM. Vérifier les logs Intune et l'état du profil sur l'appareil.",
  },
  {
    problem: "Inventaire ne remonte plus",
    causes: ["APNs down ou certificat expiré", "Appareil non supervisé après réinitialisation", "Token ABM expiré (distinct mais lié)"],
    solution:
      "Vérifier certificat APNs et synchronisation ABM. Forcer « Sync device » depuis Intune. Contrôler la connectivité réseau de l'appareil.",
  },
];

export const apnsBestPractices = [
  "Utiliser un Apple ID dédié à l'entreprise (compte service, jamais personnel)",
  "Documenter les dates de création et d'expiration dans un registre IT",
  "Renouveler systématiquement 30 jours avant expiration",
  "Activer les alertes email/calendrier et tickets ITSM automatiques",
  "Sauvegarder les certificats .pem dans un coffre-fort chiffré",
  "Tester une commande push après chaque renouvellement",
];

export const apnsCaseStudy = {
  title: "Cas pratique — 500 iPhone sans commandes MDM",
  scenario:
    "Une entreprise de 500 iPhone signale qu'aucune commande MDM ne fonctionne depuis 48 h : apps non déployées, inventaire figé, effacement distant impossible. Le support Apple MDM Academy est sollicité.",
  tasks: [
    "Identifier la cause probable",
    "Vérifier l'état du certificat APNs",
    "Vérifier la configuration Intune",
    "Vérifier l'état des appareils pilotes",
  ],
  solution: [
    "Cause la plus probable : certificat APNs expiré ou renouvelé avec un Apple ID différent — vérifier en priorité Intune → Apple MDM Push Certificate.",
    "APNs : si expiré, renouveler immédiatement sur identity.apple.com/pushcert avec le même Apple ID. Importer le nouveau .pem dans Intune.",
    "Intune : après import, vérifier statut Active et date d'expiration. Forcer « Sync device » sur 5 iPhone pilotes.",
    "Réseau : confirmer que les ports APNs (2195, 2196, 5223, 443) ne sont pas bloqués par le pare-feu entreprise.",
    "Appareils : vérifier que les iPhone ont check-in dans les dernières 24 h. Si profil MDM absent, réenrôler via ADE.",
    "Prévention : documenter l'incident, configurer alerte J-30, ajouter le renouvellement APNs au calendrier IT annuel.",
  ],
};

export const apnsQuizQuestions: Question[] = [
  {
    id: "apns-q1",
    text: "Quel service permet à Intune de réveiller un iPhone ?",
    options: ["ADE (Automated Device Enrollment)", "APNs (Apple Push Notification service)", "VPP (Volume Purchase Program)", "SSO (Single Sign-On)"],
    correctIndex: 1,
    explanation: "APNs est le canal push obligatoire entre le serveur MDM et les appareils Apple.",
  },
  {
    id: "apns-q2",
    text: "Que faut-il utiliser pour renouveler un certificat APNs ?",
    options: ["N'importe quel Apple ID", "Le même Apple ID que la création initiale", "Un compte local macOS", "Un compte administrateur Intune"],
    correctIndex: 1,
    explanation: "Changer d'Apple ID lors du renouvellement invalide le certificat et peut nécessiter un réenrôlement.",
  },
  {
    id: "apns-q3",
    text: "Que se passe-t-il sans certificat APNs valide ?",
    options: [
      "Seules les apps sont bloquées",
      "Aucune commande MDM ne peut être envoyée",
      "Seul le Wi‑Fi est affecté",
      "L'App Store est désactivé",
    ],
    correctIndex: 1,
    explanation: "Sans APNs, le serveur MDM ne peut plus communiquer avec les appareils — gestion totalement interrompue.",
  },
  {
    id: "apns-q4",
    text: "Où crée-t-on le certificat APNs côté Apple ?",
    options: [
      "business.apple.com",
      "identity.apple.com/pushcert",
      "developer.apple.com",
      "support.apple.com",
    ],
    correctIndex: 1,
    explanation: "Le portail Apple Push Certificates (identity.apple.com/pushcert) signe la CSR et délivre le certificat .pem.",
  },
  {
    id: "apns-q5",
    text: "Quel fichier Intune génère pour la demande de certificat ?",
    options: ["server_token.p7m", "CSR (Certificate Signing Request)", "intune.json", "mdm.mobileconfig"],
    correctIndex: 1,
    explanation: "Intune génère une CSR que vous importez sur le portail Apple Push Certificates.",
  },
  {
    id: "apns-q6",
    text: "Combien de temps avant expiration faut-il renouveler (bonne pratique) ?",
    options: ["Le jour même", "30 jours avant", "1 an après", "Jamais — auto-renouvelé"],
    correctIndex: 1,
    explanation: "Renouveler à J-30 laisse une marge pour corriger les erreurs sans interruption de service.",
  },
  {
    id: "apns-q7",
    text: "Quelle erreur indique souvent un certificat APNs expiré ?",
    options: ["Token ABM Invalid", "Push Certificate Invalid", "Profile Not Found", "User Not Licensed"],
    correctIndex: 1,
    explanation: "Push Certificate Invalid signale un certificat APNs expiré, corrompu ou créé avec un mauvais Apple ID.",
  },
  {
    id: "apns-q8",
    text: "Après APNs, que fait l'appareil pour exécuter une commande ?",
    options: [
      "Il redémarre automatiquement",
      "Il contacte le serveur MDM pour récupérer la commande",
      "Il envoie un email à l'admin",
      "Il ouvre l'App Store",
    ],
    correctIndex: 1,
    explanation: "APNs réveille l'appareil ; celui-ci initie alors une connexion au serveur MDM (check-in) pour exécuter la commande.",
  },
  {
    id: "apns-q9",
    text: "Quel port réseau est utilisé par APNs (entre autres) ?",
    options: ["Port 80 uniquement", "Port 443 (HTTPS) et 2195/2196", "Port 22 SSH", "Port 3389 RDP"],
    correctIndex: 1,
    explanation: "APNs utilise TCP 2195, 2196, 5223 et 443 — ces ports doivent être ouverts sortants.",
  },
  {
    id: "apns-q10",
    text: "Jamf Pro utilise-t-il aussi APNs ?",
    options: [
      "Non, Jamf a son propre protocole sans Apple",
      "Oui, tout serveur MDM Apple nécessite un certificat APNs",
      "Seulement pour macOS",
      "Seulement avec Apple Business Manager",
    ],
    correctIndex: 1,
    explanation: "Intune, Jamf Pro et tout MDM Apple doivent posséder un certificat APNs valide.",
  },
];

export const apnsScoreTiers = [
  { min: 0, title: "📖 À revoir", message: "Repassez les sections APNs et Renouvellement, puis refaites le quiz." },
  { min: 60, title: "👍 Bon niveau", message: "Bonne compréhension ! Visez 80 % pour valider la leçon." },
  { min: 80, title: "🏆 Validé", message: "Excellent ! Vous maîtrisez la création et le renouvellement APNs." },
  { min: 100, title: "📡 Expert APNs", message: "Score parfait — vous êtes autonome sur le cycle de vie des certificats push MDM." },
];

export function isApnsLesson(courseSlug: string, lessonSlug: string): boolean {
  return courseSlug === APNS_COURSE_SLUG && lessonSlug === APNS_LESSON_SLUG;
}

export const APNS_COMPLETE_KEY = "lesson-apns-certificates-complete";

export function getApnsHealthStatus(itemsChecked: number, total: number): "healthy" | "warning" {
  return itemsChecked >= total ? "healthy" : "warning";
}
