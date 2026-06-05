import type { Question } from "@/lib/types";

export const MACOS_SECURITY_LESSON_SLUG = "macos-security";
export const MACOS_SECURITY_COURSE_SLUG = "intune-mac";

export const macosSecurityCertifications = [
  "Apple Certified IT Professional",
  "Apple Deployment and Management",
  "Jamf 100",
  "Jamf 200",
];

export const macosSecurityObjectives = [
  "Comprendre l'architecture de sécurité multicouche d'Apple sur macOS",
  "Déployer FileVault avec escrow de clé via Jamf Pro ou Intune",
  "Maîtriser Gatekeeper, la notarisation et le contrôle des applications",
  "Comprendre le rôle de XProtect dans la détection des malwares",
  "Expliquer SIP (System Integrity Protection) et ses implications MDM",
  "Gérer Activation Lock via Apple Business Manager, Intune et Jamf",
  "Déployer une stratégie de sécurité macOS complète en entreprise",
];

export const macosSecurityLayers = [
  {
    id: "secure-enclave",
    title: "Secure Enclave",
    icon: "🔐",
    description:
      "Coprocesseur dédié isolé du CPU principal. Stocke les clés biométriques, les clés FileVault et les secrets Touch ID / Apple T2 / Apple Silicon.",
    color: "from-gray-900 to-gray-800",
  },
  {
    id: "filevault",
    title: "FileVault",
    icon: "💾",
    description: "Chiffrement intégral du volume de démarrage (XTS-AES-128). Protège les données au repos en cas de vol ou perte.",
    color: "from-purple-600 to-violet-600",
  },
  {
    id: "gatekeeper",
    title: "Gatekeeper",
    icon: "🚪",
    description: "Contrôle quelles applications peuvent s'exécuter : App Store, développeurs identifiés, apps notarisées.",
    color: "from-blue-600 to-indigo-600",
  },
  {
    id: "xprotect",
    title: "XProtect",
    icon: "🛡️",
    description: "Moteur antimalware intégré. Analyse les fichiers au téléchargement et à l'exécution, signatures mises à jour automatiquement.",
    color: "from-green-600 to-emerald-600",
  },
  {
    id: "sip",
    title: "SIP (System Integrity Protection)",
    icon: "🏛️",
    description: "Protège les fichiers système, processus kernel et zones sensibles contre modification, même par root.",
    color: "from-orange-600 to-amber-600",
  },
  {
    id: "notarization",
    title: "Notarization",
    icon: "✅",
    description: "Apple scanne et approuve les apps distribuées hors App Store avant leur première exécution sur macOS.",
    color: "from-cyan-600 to-teal-600",
  },
  {
    id: "activation-lock",
    title: "Activation Lock",
    icon: "🔒",
    description: "Verrouillage matériel lié à Find My / Managed Apple Account. Empêche la réinitialisation non autorisée.",
    color: "from-red-600 to-rose-600",
  },
];

export const macosSecurityArchitecture = [
  { label: "Utilisateur", icon: "👤", color: "from-slate-600 to-slate-500" },
  { label: "Applications", icon: "📱", color: "from-blue-500 to-indigo-500" },
  { label: "Gatekeeper", icon: "🚪", color: "from-indigo-600 to-blue-600" },
  { label: "XProtect", icon: "🛡️", color: "from-green-600 to-emerald-500" },
  { label: "SIP", icon: "🏛️", color: "from-orange-500 to-amber-500" },
  { label: "FileVault", icon: "💾", color: "from-purple-600 to-violet-500" },
  { label: "Secure Enclave", icon: "🔐", color: "from-gray-900 to-gray-700" },
];

export const macosFileVaultDetails = {
  advantages: [
    "Protection des données professionnelles et personnelles au repos",
    "Conformité RGPD, HIPAA, ISO 27001 et exigences audit",
    "Protection en cas de perte, vol ou accès physique non autorisé",
  ],
  workflow: [
    { step: "Clé générée", detail: "Une clé de chiffrement unique est créée lors de l'activation FileVault." },
    { step: "Stockage Secure Enclave", detail: "Sur Mac T2 / Apple Silicon, la clé est liée au Secure Enclave pour déverrouillage biométrique." },
    { step: "Déverrouillage à l'ouverture de session", detail: "Le mot de passe utilisateur ou Touch ID déverrouille le volume chiffré au login." },
  ],
  jamfConfig: [
    "Computers → Configuration Profiles → New → FileVault payload",
    "Activer « Enable FileVault » et « Escrow personal recovery key to Jamf Pro »",
    "Optionnel : « Show personal recovery key » pour affichage unique à l'utilisateur",
    "Scope sur Smart Group « Mac Production » — redémarrage requis",
  ],
  intuneConfig: [
    "Devices → macOS → Configuration profiles → Create → Disk encryption",
    "Activer FileVault et « Escrow personal recovery key to Azure AD »",
    "Assign Required au groupe Mac — clé visible dans Endpoint analytics",
    "Compliance policy : « FileVault = Required » pour Conditional Access",
  ],
  escrowNote:
    "L'escrow MDM est obligatoire en entreprise : sans clé escrow, un Mac avec mot de passe oublié est irrécupérable.",
  keyRotation:
    "Rotation des clés : FileVault régénère la clé lors d'un changement de mot de passe utilisateur. L'escrow MDM capture la nouvelle clé au prochain check-in.",
};

export const macosGatekeeperDetails = {
  description:
    "Gatekeeper vérifie la signature de code et la notarisation avant d'autoriser l'exécution d'une application téléchargée depuis Internet.",
  allowedSources: [
    "App Store — apps signées et revues par Apple",
    "Développeurs identifiés — apps signées avec Developer ID",
    "Applications notarisées — apps scannées par Apple avant distribution",
  ],
  risks: [
    "Malware distribué via apps non signées ou modifiées (quishing, DMG infectés)",
    "Logiciels modifiés (cracks, keygens) contournant Gatekeeper",
    "Apps sideloadées sans notarisation sur macOS récent",
  ],
  spctlCommands: [
    { command: "spctl --status", description: "Affiche l'état global Gatekeeper (assessments enabled/disabled)." },
    { command: "spctl --assess --verbose /Applications/App.app", description: "Vérifie si une app spécifique passe Gatekeeper." },
    { command: "spctl --assess --type execute --verbose ./MonApp.app", description: "Test d'exécution avec détail du rejet (signature, notarization)." },
    { command: "spctl --global-disable", description: "⚠️ Désactive Gatekeeper — INTERDIT en production entreprise." },
  ],
  mdmNote:
    "Via MDM, configurez « Allow apps from App Store and identified developers » — ne jamais autoriser « Anywhere » en entreprise.",
};

export const macosXProtectDetails = {
  description:
    "XProtect est l'antimalware intégré à macOS. Il ne remplace pas un EDR entreprise (Defender, CrowdStrike) mais constitue une première ligne de défense automatique.",
  features: [
    "Détection malware — signatures YARA mises à jour silencieusement par Apple",
    "Blocage automatique — fichiers malveillants mis en quarantaine ou supprimés",
    "Mise à jour automatique — via macOS Software Update, sans action admin",
  ],
  howItWorks: [
    "Au téléchargement (Safari, Mail) : XProtect analyse le fichier via quarantine attribute",
    "À l'ouverture : scan complémentaire avant exécution",
    "Mise à jour des signatures : plist dans /Library/Apple/System/Library/CoreServices/XProtect.bundle/",
    "Remediator : XProtect Remediator nettoie les infections connues en arrière-plan",
  ],
  terminalCommands: [
    { command: "system_profiler SPInstallHistoryDataType | grep -i xprotect", description: "Historique des mises à jour XProtect." },
    { command: "defaults read /Library/Apple/System/Library/CoreServices/XProtect.bundle/Contents/Info CFBundleShortVersionString", description: "Version actuelle du moteur XProtect." },
    { command: "log show --predicate 'subsystem == \"com.apple.XProtectFramework\"' --last 1h", description: "Logs récents d'activité XProtect." },
  ],
};

export const macosSipDetails = {
  description:
    "System Integrity Protection (SIP) protège les répertoires système, les processus kernel et les entitlements contre modification — même par root ou un admin local.",
  protections: [
    "Modification des fichiers système (/System, /usr, /bin, /sbin protégés)",
    "Injection de code dans processus Apple signés",
    "Manipulation du kernel et chargement de kext non approuvées",
    "Modification de NVRAM et variables firmware sensibles",
  ],
  csrutilCommands: [
    { command: "csrutil status", description: "État SIP en mode Recovery : « System Integrity Protection status: enabled »." },
    { command: "csrutil authenticated-root status", description: "Vérifie Signed System Volume (SSV) sur macOS Big Sur+." },
  ],
  impacts: [
    "SIP activé (défaut) : impossible de modifier /System même en root — bon pour la sécurité",
    "Désactiver SIP : requis uniquement pour certains outils dev/debug — JAMAIS en production",
    "MDM ne peut pas désactiver SIP à distance — c'est une protection hardware/firmware",
    "Signed System Volume (SSV) sur macOS 11+ : système en lecture seule monté depuis snapshot signé",
  ],
};

export const macosActivationLockDetails = {
  description:
    "Activation Lock empêche qu'un Mac volé soit réinitialisé et réutilisé sans les identifiants Apple ID ou Managed Apple Account associés.",
  flow: [
    { label: "Apple ID / Managed Account", icon: "🍎", color: "from-gray-800 to-gray-700" },
    { label: "Verrouillage matériel", icon: "🔒", color: "from-red-600 to-rose-500" },
    { label: "Tentative réinitialisation", icon: "🔄", color: "from-amber-500 to-orange-500" },
    { label: "Demande authentification", icon: "🔑", color: "from-indigo-600 to-violet-500" },
  ],
  management: [
    {
      platform: "Apple Business Manager",
      steps: ["Activer Activation Lock pour les appareils ADE", "Lier au MDM lors de l'enrôlement automatique"],
    },
    {
      platform: "Intune",
      steps: [
        "Devices → macOS → macOS enrollment → Enrollment program tokens",
        "Activation Lock bypass code généré à l'enrôlement ADE",
        "Stocké dans Azure AD — utilisable pour effacement autorisé",
      ],
    },
    {
      platform: "Jamf Pro",
      steps: [
        "Settings → Global Management → Activation Lock",
        "Bypass code escrow automatique à l'enrôlement",
        "Computer Record → Security → Activation Lock Bypass Code",
      ],
    },
  ],
};

export const macosNotarizationDetails = {
  why:
    "Apple impose la notarisation pour toutes les apps distribuées hors App Store depuis macOS 10.15+. Gatekeeper refuse les apps non notarisées au premier lancement.",
  process: [
    { label: "Développeur", icon: "👨‍💻", color: "from-slate-600 to-slate-500" },
    { label: "Soumission Apple", icon: "🍎", color: "from-gray-800 to-gray-700" },
    { label: "Scan malware + validation", icon: "🔍", color: "from-blue-600 to-indigo-500" },
    { label: "Distribution notarisée", icon: "✅", color: "from-green-600 to-emerald-500" },
  ],
  enterpriseNote:
    "Les apps internes doivent aussi être signées (Developer ID) et notarisées avant déploiement MDM. Utilisez `xcrun notarytool submit` dans votre pipeline CI/CD.",
};

export const macosEnterpriseStrategy = [
  { component: "FileVault", action: "Activer via MDM + escrow obligatoire + compliance policy", priority: "Critique" },
  { component: "Activation Lock", action: "ADE + bypass code escrow dans Jamf/Intune", priority: "Critique" },
  { component: "Gatekeeper", action: "App Store + identified developers only — jamais « Anywhere »", priority: "Haute" },
  { component: "XProtect", action: "Maintenir macOS à jour — ne pas désactiver Software Update", priority: "Haute" },
  { component: "SIP", action: "Laisser activé — auditer csrutil status en pilote", priority: "Haute" },
  { component: "MDM", action: "Supervision ADE + profils sécurité + EDR complémentaire", priority: "Critique" },
  { component: "Notarization", action: "Apps internes signées et notarisées avant PKG/distribution", priority: "Moyenne" },
];

export const macosSecurityTroubleshooting = [
  {
    problem: "FileVault bloqué — impossible de déverrouiller",
    causes: ["Mot de passe oublié", "Clé escrow non capturée", "Secure Enclave défaillant", "Migration AD mal exécutée"],
    solution:
      "Récupérer la clé escrow depuis Jamf Computer Record → Security ou Intune Endpoint analytics. Saisir la Personal Recovery Key au démarrage. En dernier recours : effacement + réenrôlement ADE.",
  },
  {
    problem: "Clé de récupération absente dans MDM",
    causes: ["Escrow non configuré dans le profil", "Mac enrôlé avant déploiement profil FileVault", "Check-in MDM manqué"],
    solution:
      "Vérifier payload FileVault + escrow. Forcer check-in MDM. Si FileVault déjà actif sans escrow : rotation manuelle ou réenrôlement avec profil pré-déployé.",
  },
  {
    problem: "Activation Lock actif — Mac bloqué après effacement",
    causes: ["Find My activé sans bypass code", "Compte Apple ID personnel lié", "Bypass code non escrow"],
    solution:
      "Utiliser le bypass code depuis Jamf/Intune. Si perdu : contacter Apple Business Manager support avec preuve d'achat. Prévenir via ADE + escrow bypass à l'enrôlement.",
  },
  {
    problem: "Gatekeeper bloque une application métier",
    causes: ["App non signée ou non notarisée", "Signature corrompue", "Quarantine attribute bloquant"],
    solution:
      "Vérifier avec `spctl --assess --verbose`. Signer et notariser l'app. Déployer via MDM (PKG) pour contourner quarantine. Exception temporaire : clic droit → Ouvrir (non recommandé en prod).",
  },
  {
    problem: "Erreur SIP — outil ne peut pas modifier /System",
    causes: ["SIP activé (comportement normal)", "Outil legacy incompatible SSV", "Script tente modification zone protégée"],
    solution:
      "Ne pas désactiver SIP en production. Adapter l'outil ou utiliser API MDM/profils. Vérifier `csrutil status` en Recovery si doute.",
  },
];

export const macosSecurityCaseStudy = {
  title: "Cas pratique — 500 MacBook Pro en conformité sécurité",
  scenario:
    "Une entreprise finance doit mettre en conformité 500 MacBook Pro : FileVault actif avec escrow, SIP vérifié, Gatekeeper strict, Activation Lock via ADE, XProtect à jour. Audit ISO 27001 dans 30 jours.",
  tasks: [
    "Activer FileVault avec escrow sur toute la flotte",
    "Vérifier SIP activé sur un échantillon représentatif",
    "Contrôler Gatekeeper et politique apps autorisées",
    "Déployer Activation Lock avec bypass code escrow",
  ],
  solution: [
    "FileVault — Profil Jamf macOS-Security-FV-v1 : Enable FileVault + Escrow to Jamf. Scope Smart Group « MacBook Pro Production ». Compliance Intune : FileVault Required. Vérifier 100 % escrow dans inventaire 72 h.",
    "SIP — Script pilote via Jamf Policy : `csrutil status` (via Extension Attribute ou script en Recovery sur 10 Mac). Attendu : enabled. Aucune action si enabled — documenter pour audit.",
    "Gatekeeper — Profil Restrictions : App Store + identified developers. `spctl --status` → assessments enabled. Apps internes notarisées via pipeline CI. EDR Defender déployé en complément XProtect.",
    "Activation Lock — ADE via ABM, bypass code escrow Jamf Settings → Activation Lock. Computer Record → Security → Bypass Code présent sur 500 Mac.",
    "XProtect — Compliance policy : macOS version ≥ 14.x (Sonoma) pour signatures récentes. Software Update deferral max 30 jours.",
    "Audit — Rapport mensuel : % FileVault actif, % escrow, % Activation Lock bypass, Gatekeeper status, OS version. Runbook IT pour recovery key et bypass.",
  ],
};

export const macosSecurityLabExercises = [
  {
    title: "Exercice 1 — Vérifier FileVault",
    goal: "Confirmer que FileVault est actif et identifier l'état du chiffrement.",
    commands: [
      { cmd: "fdesetup status", expected: "FileVault is On." },
      { cmd: "fdesetup list", expected: "Liste des utilisateurs autorisés à déverrouiller le volume." },
      { cmd: "diskutil apfs list | grep -i encrypted", expected: "Encrypted: Yes sur le volume de données." },
    ],
  },
  {
    title: "Exercice 2 — Vérifier SIP",
    goal: "Confirmer que System Integrity Protection est activé.",
    commands: [
      { cmd: "csrutil status", expected: "System Integrity Protection status: enabled. (Mode Recovery requis pour cette commande exacte)" },
      { cmd: "csrutil authenticated-root status", expected: "Authenticated Root status: enabled (macOS 11+)." },
      { cmd: "ls -lO /System/Library/ | head -5", expected: "Flags « restricted » sur fichiers système protégés." },
    ],
    note: "En session normale, utilisez : `csrutil status` depuis Recovery (⌘R au démarrage) ou vérifiez via MDM inventory.",
  },
  {
    title: "Exercice 3 — Vérifier Gatekeeper",
    goal: "Contrôler l'état Gatekeeper et tester une application.",
    commands: [
      { cmd: "spctl --status", expected: "assessments enabled" },
      { cmd: "spctl --assess --verbose /Applications/Safari.app", expected: "accepted / source=Apple System" },
      { cmd: "xattr -l /Applications/Safari.app 2>/dev/null | head -3", expected: "Attributs de quarantaine absents pour apps système." },
    ],
  },
  {
    title: "Exercice 4 — Vérifier Activation Lock",
    goal: "Identifier si Activation Lock / Find My Mac est actif.",
    commands: [
      { cmd: "system_profiler SPHardwareDataType | grep -i \"activation lock\"", expected: "Activation Lock Status (T2/Apple Silicon Macs)." },
      { cmd: "fdesetup isactive", expected: "true si FileVault actif (souvent corrélé à Find My sur Mac gérés)." },
      { cmd: "profiles status -type enrollment", expected: "Profil MDM actif — prérequis bypass code entreprise." },
    ],
    note: "Le bypass code entreprise se consulte dans Jamf Computer Record ou Intune — pas en Terminal local.",
  },
];

export const macosSecurityVerificationItems = [
  "FileVault actif (fdesetup status = On) sur Mac pilote",
  "Clé escrow visible dans Jamf ou Intune",
  "SIP enabled confirmé (csrutil status)",
  "Gatekeeper assessments enabled (spctl --status)",
  "Activation Lock bypass code escrow dans MDM",
  "macOS version récente pour XProtect à jour",
];

export const macosSecurityQuizQuestions: Question[] = [
  {
    id: "macsec-q1",
    text: "Quel composant chiffre le disque d'un Mac ?",
    options: ["SIP", "FileVault", "XProtect", "Gatekeeper"],
    correctIndex: 1,
    explanation: "FileVault 2 chiffre le volume de démarrage avec XTS-AES-128.",
  },
  {
    id: "macsec-q2",
    text: "Quel composant protège les fichiers système contre modification ?",
    options: ["Gatekeeper", "SIP (System Integrity Protection)", "APNs", "ADE"],
    correctIndex: 1,
    explanation: "SIP protège /System et empêche modifications même par root.",
  },
  {
    id: "macsec-q3",
    text: "Quel composant détecte les malwares intégrés à macOS ?",
    options: ["XProtect", "APNs", "FileVault", "VPP"],
    correctIndex: 0,
    explanation: "XProtect est l'antimalware natif Apple avec signatures mises à jour automatiquement.",
  },
  {
    id: "macsec-q4",
    text: "Où sont stockées les clés biométriques et FileVault sur Mac récents ?",
    options: ["iCloud Keychain", "Secure Enclave", "App Store", "Kernel Extension"],
    correctIndex: 1,
    explanation: "Le Secure Enclave isole les clés cryptographiques du CPU principal.",
  },
  {
    id: "macsec-q5",
    text: "Que vérifie Gatekeeper avant d'exécuter une app ?",
    options: [
      "Uniquement la taille du fichier",
      "Signature de code et notarisation Apple",
      "Le mot de passe administrateur",
      "La connexion Wi-Fi",
    ],
    correctIndex: 1,
    explanation: "Gatekeeper valide Developer ID + notarisation pour les apps hors App Store.",
  },
  {
    id: "macsec-q6",
    text: "Quelle commande affiche l'état de Gatekeeper ?",
    options: ["fdesetup status", "spctl --status", "csrutil status", "diskutil list"],
    correctIndex: 1,
    explanation: "spctl (System Policy Control) gère et affiche l'état Gatekeeper.",
  },
  {
    id: "macsec-q7",
    text: "Pourquoi l'escrow FileVault est-il critique en entreprise ?",
    options: [
      "Pour accélérer le Wi-Fi",
      "Pour récupérer la clé si l'utilisateur oublie son mot de passe",
      "Pour désactiver SIP",
      "Pour installer l'App Store",
    ],
    correctIndex: 1,
    explanation: "Sans escrow, un Mac FileVault avec mot de passe perdu est irrécupérable.",
  },
  {
    id: "macsec-q8",
    text: "Activation Lock empêche :",
    options: [
      "L'installation de mises à jour",
      "La réinitialisation non autorisée d'un Mac volé",
      "L'utilisation du clavier",
      "La connexion VPN",
    ],
    correctIndex: 1,
    explanation: "Activation Lock lie le Mac à un Apple ID — réinitialisation impossible sans authentification.",
  },
  {
    id: "macsec-q9",
    text: "Qu'est-ce que la notarisation Apple ?",
    options: [
      "Un certificat Wi-Fi",
      "Un scan malware et validation par Apple avant distribution d'une app",
      "Un profil ADE",
      "Une extension kernel",
    ],
    correctIndex: 1,
    explanation: "Notarization prouve qu'Apple a scanné l'app avant sa distribution hors App Store.",
  },
  {
    id: "macsec-q10",
    text: "Peut-on désactiver SIP via MDM à distance ?",
    options: [
      "Oui, toujours",
      "Non — SIP se configure en Recovery mode, pas via MDM",
      "Seulement avec APNs",
      "Seulement sur iPhone",
    ],
    correctIndex: 1,
    explanation: "SIP est une protection firmware — MDM ne peut pas la désactiver à distance.",
  },
  {
    id: "macsec-q11",
    text: "Quelle commande vérifie FileVault ?",
    options: ["spctl --status", "fdesetup status", "csrutil status", "networksetup -listallhardwareports"],
    correctIndex: 1,
    explanation: "fdesetup status retourne « FileVault is On » ou « Off ».",
  },
  {
    id: "macsec-q12",
    text: "Où récupère-t-on le bypass code Activation Lock dans Jamf ?",
    options: [
      "Settings → Global Management → Activation Lock / Computer Record → Security",
      "Apps & Books",
      "APNs Certificate",
      "User Accounts",
    ],
    correctIndex: 0,
    explanation: "Jamf escrow le bypass code à l'enrôlement ADE — visible dans Computer Record.",
  },
  {
    id: "macsec-q13",
    text: "XProtect se met à jour via :",
    options: [
      "Installation manuelle uniquement",
      "macOS Software Update (automatique)",
      "Certificat APNs",
      "Apple Business Manager token",
    ],
    correctIndex: 1,
    explanation: "Les signatures XProtect sont livrées silencieusement via les mises à jour macOS.",
  },
  {
    id: "macsec-q14",
    text: "En entreprise, quelle politique Gatekeeper appliquer ?",
    options: [
      "Autoriser apps de n'importe où",
      "App Store et développeurs identifiés uniquement",
      "Désactiver toutes les apps",
      "App Store uniquement (sans apps métier)",
    ],
    correctIndex: 1,
    explanation: "App Store + identified developers permet apps métier notarisées tout en bloquant le non signé.",
  },
  {
    id: "macsec-q15",
    text: "Quel élément complète XProtect pour une sécurité entreprise complète ?",
    options: [
      "Désactiver FileVault",
      "EDR (Defender, CrowdStrike) + MDM + mises à jour OS",
      "Supprimer Gatekeeper",
      "Désactiver Activation Lock",
    ],
    correctIndex: 1,
    explanation: "XProtect est une base — EDR, MDM et patching complètent la défense en profondeur.",
  },
];

export const macosSecurityScoreTiers = [
  { min: 0, title: "📖 À revoir", message: "Repassez FileVault, SIP, Gatekeeper et XProtect, puis refaites le quiz." },
  { min: 60, title: "👍 Correct", message: "Bonne base ! Visez 80 % pour valider la leçon." },
  { min: 80, title: "🏆 Validé", message: "Excellent ! Vous maîtrisez la sécurité macOS en entreprise." },
  { min: 100, title: "🔐 Expert Sécurité macOS", message: "Score parfait — vous êtes autonome sur FileVault, SIP, Gatekeeper et Activation Lock." },
];

export function isMacosSecurityLesson(courseSlug: string, lessonSlug: string): boolean {
  return courseSlug === MACOS_SECURITY_COURSE_SLUG && lessonSlug === MACOS_SECURITY_LESSON_SLUG;
}

export const MACOS_SECURITY_COMPLETE_KEY = "lesson-macos-security-complete";

export function getMacosSecurityStatus(itemsChecked: number, total: number): "healthy" | "warning" {
  return itemsChecked >= total ? "healthy" : "warning";
}
