import type { Question } from "@/lib/types";

export const PLATFORM_SSO_LESSON_SLUG = "platform-sso";
export const PLATFORM_SSO_COURSE_SLUG = "intune-mac";

export const platformSsoCertifications = [
  "Apple Certified IT Professional",
  "Apple Deployment and Management",
  "Jamf 200",
];

export const platformSsoObjectives = [
  "Comprendre Platform SSO et son rôle dans l'écosystème Apple Enterprise",
  "Expliquer le fonctionnement technique (registration, linking, authentication)",
  "Intégrer Microsoft Entra ID avec Platform SSO sur macOS",
  "Déployer un profil Platform SSO via Intune Settings Catalog ou Jamf",
  "Authentifier les utilisateurs macOS avec l'identité Entra ID native",
  "Simplifier la gestion des comptes et réduire la dette des mots de passe",
];

export const platformSsoIntroduction = {
  summary:
    "Platform SSO (PSSO) est une fonctionnalité Apple introduite avec macOS Ventura (13) et enrichie sur macOS Sonoma (14+) et Sequoia. Elle permet à macOS d'utiliser directement l'identité d'entreprise (Microsoft Entra ID) pour créer, lier et authentifier des comptes utilisateur locaux — sans mot de passe séparé pour la session macOS.",
  benefits: [
    "Moins de mots de passe — un seul identifiant Entra ID pour macOS et Microsoft 365",
    "Expérience utilisateur simplifiée — connexion fluide au premier démarrage ADE",
    "Sécurité renforcée — MFA Entra ID, Conditional Access, pas de mot de passe local faible",
    "Intégration native Apple — extension Platform SSO, pas de agent tiers sur le Mac",
  ],
};

export const platformSsoArchitecture = [
  { label: "Utilisateur", icon: "👤", color: "from-slate-600 to-slate-500" },
  { label: "macOS (Platform SSO Extension)", icon: "💻", color: "from-gray-800 to-gray-700" },
  { label: "Platform SSO", icon: "🔑", color: "from-indigo-600 to-violet-500" },
  { label: "Microsoft Entra ID", icon: "☁️", color: "from-blue-600 to-indigo-600" },
  { label: "Authentification réussie", icon: "✅", color: "from-green-600 to-emerald-500" },
];

export const platformSsoPrerequisites = [
  {
    item: "macOS récent",
    detail: "macOS 13 Ventura minimum — macOS 14 Sonoma ou 15 Sequoia recommandé pour fonctionnalités complètes (password sync, account linking avancé).",
  },
  {
    item: "Microsoft Entra ID",
    detail: "Tenant Azure AD actif avec utilisateurs licenciés (Microsoft 365 ou Entra ID P1/P2 pour Conditional Access avancé).",
  },
  {
    item: "Intune ou Jamf Pro",
    detail: "MDM opérationnel avec Mac enrôlés ADE mode supervisé — profil Platform SSO déployé via Settings Catalog (Intune) ou payload (Jamf).",
  },
  {
    item: "Managed Apple IDs (recommandé)",
    detail: "Fédération ABM + Entra ID recommandée pour cohérence identité Apple + Microsoft, mais Platform SSO fonctionne aussi avec comptes Entra seuls.",
  },
];

export const platformSsoPrerequisiteChecklist = [
  "macOS 14+ sur appareils pilotes (Sonoma ou Sequoia)",
  "Tenant Entra ID actif avec utilisateurs de test",
  "MDM opérationnel (Intune ou Jamf) — Mac ADE enrôlés",
  "Certificats et tokens MDM valides (APNs, ABM)",
  "Company Portal ou extension Entra compatible installée",
  "Conditional Access et MFA configurés sur le tenant",
];

export const platformSsoBeforeAfter = {
  before: {
    title: "Avant Platform SSO",
    items: [
      "Compte local macOS avec mot de passe distinct",
      "Compte Microsoft 365 / Entra ID séparé",
      "Double authentification à chaque session",
      "Reset mot de passe local = ticket support IT",
    ],
  },
  after: {
    title: "Après Platform SSO",
    flow: [
      "Identité Microsoft Entra ID (source unique)",
      "Platform SSO crée ou lie le compte macOS",
      "Session macOS authentifiée via Entra ID",
      "Mot de passe synchronisé (Password Sync)",
    ],
  },
};

export const platformSsoMechanisms = [
  {
    title: "Account Creation (Création de compte)",
    description:
      "Au premier login, Platform SSO crée automatiquement un compte macOS local mappé à l'identité Entra ID — sans intervention admin.",
    icon: "➕",
  },
  {
    title: "Account Linking (Liaison de compte)",
    description:
      "Lie un compte macOS existant à l'identité Entra ID — utile pour migration depuis comptes locaux legacy.",
    icon: "🔗",
  },
  {
    title: "Authentication (Authentification)",
    description:
      "À chaque déverrouillage ou login window, macOS délègue l'authentification à Entra ID via l'extension Platform SSO.",
    icon: "🔐",
  },
  {
    title: "Password Sync (Synchronisation mot de passe)",
    description:
      "Changement de mot de passe Entra ID → synchronisé automatiquement vers le compte macOS local (macOS 14+).",
    icon: "🔄",
  },
];

export const platformSsoEntraIntegrationSteps = [
  "Microsoft Intune Admin Center → Devices → macOS → Configuration profiles",
  "Create profile → macOS → Settings catalog (ou Templates → Platform SSO)",
  "Rechercher « Platform SSO » ou « Extensible SSO » dans le catalog",
  "Configurer Extension Identifier (Bundle ID de l'extension Microsoft Entra)",
  "Renseigner Tenant ID (GUID du tenant Azure AD)",
  "Définir Authentication Method (Password, Smart Card, ou Redirect)",
  "Configurer Registration : Automatic / Prompt / Disabled",
  "Assigner au groupe pilote « Mac-PSSO-Pilot » en Required",
];

export const platformSsoParameters = [
  {
    param: "Tenant ID",
    description: "GUID unique du tenant Microsoft Entra ID (Azure Portal → Microsoft Entra ID → Overview → Tenant ID).",
    example: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  },
  {
    param: "Extension Identifier (Bundle ID)",
    description: "Identifiant de l'extension Platform SSO Microsoft — ex. com.microsoft.CompanyPortalMac.ssoextension.",
    example: "com.microsoft.CompanyPortalMac.ssoextension",
  },
  {
    param: "Authentication Method",
    description: "Password (mot de passe Entra), Redirect (navigateur OAuth), ou Platform SSO natif selon version macOS.",
    example: "Password ou Redirect pour MFA",
  },
  {
    param: "Registration",
    description: "Automatic — création/liaison silencieuse. Prompt — demande confirmation utilisateur. Disabled — pas d'enregistrement auto.",
    example: "Automatic pour déploiement Zero Touch ADE",
  },
  {
    param: "User Mapping",
    description: "Attribut Entra ID mappé au nom de compte macOS — généralement userPrincipalName ou mail.",
    example: "user@entreprise.com → compte local entreprise.com",
  },
  {
    param: "Team ID",
    description: "Apple Team ID de Microsoft pour valider l'extension signée — requis dans certains profils Jamf.",
    example: "UBF8T346G9 (Microsoft Corporation)",
  },
];

export const platformSsoDeploymentProfile = {
  name: "Platform SSO Production",
  settings: [
    { label: "Registration", value: "Automatic — création compte au premier login Entra ID" },
    { label: "Authentication", value: "Password + Redirect (support MFA Entra ID)" },
    { label: "User Mapping", value: "userPrincipalName → compte local macOS" },
    { label: "Extension ID", value: "com.microsoft.CompanyPortalMac.ssoextension" },
    { label: "Tenant ID", value: "[GUID tenant Entra ID entreprise]" },
    { label: "Scope", value: "Groupe pilote Mac-PSSO-Pilot (10 Mac) → Mac-Production (1000 Mac)" },
  ],
};

export const platformSsoUserExperience = [
  { step: "1. Premier démarrage Mac ADE", detail: "L'utilisateur arrive sur l'écran de connexion macOS après Setup Assistant." },
  { step: "2. Connexion Entra ID", detail: "Saisie email @entreprise.com → redirect vers login.microsoftonline.com ou prompt natif." },
  { step: "3. Authentification MFA", detail: "Microsoft Authenticator, FIDO2 ou SMS selon Conditional Access." },
  { step: "4. Création compte local", detail: "Platform SSO crée automatiquement le compte macOS mappé à l'identité Entra." },
  { step: "5. Synchronisation", detail: "Session active — mot de passe Entra ID = mot de passe macOS (Password Sync)." },
];

export const platformSsoUserResult = [
  "Compte macOS créé et lié à Entra ID",
  "SSO actif — pas de second mot de passe",
  "Mot de passe synchronisé avec Entra ID",
  "Accès Microsoft 365 et apps métier sans re-auth",
];

export const platformSsoSecurityFlow = [
  { label: "Utilisateur macOS", icon: "👤", color: "from-slate-600 to-slate-500" },
  { label: "Platform SSO Extension", icon: "🔑", color: "from-indigo-600 to-violet-500" },
  { label: "MFA Entra ID", icon: "📱", color: "from-blue-600 to-indigo-500" },
  { label: "Conditional Access", icon: "🛡️", color: "from-amber-500 to-orange-500" },
  { label: "Password Sync", icon: "🔄", color: "from-green-600 to-emerald-500" },
  { label: "Compliance Intune", icon: "✅", color: "from-emerald-600 to-teal-500" },
];

export const platformSsoSecurityMeasures = [
  {
    measure: "MFA (Multi-Factor Authentication)",
    detail: "Imposée via Entra ID — héritée par Platform SSO à chaque authentification macOS.",
  },
  {
    measure: "Conditional Access",
    detail: "Politiques : appareil conforme Intune, localisation approuvée, risque faible — bloque login macOS si non conforme.",
  },
  {
    measure: "Password Sync",
    detail: "Reset mot de passe self-service Entra ID → propagé au compte macOS — fin des tickets « mot de passe Mac oublié ».",
  },
  {
    measure: "Compliance policies",
    detail: "Intune vérifie FileVault, OS version, SIP — Conditional Access exige conformité avant Platform SSO login.",
  },
];

export const platformSsoTroubleshooting = [
  {
    problem: "Connexion impossible",
    causes: [
      "Tenant ID incorrect dans le profil MDM",
      "Extension Platform SSO non installée (Company Portal)",
      "Conditional Access bloquant l'utilisateur ou l'appareil",
      "MFA non configurée ou échec Authenticator",
    ],
    solution:
      "Vérifier Tenant ID et Extension ID dans Intune. Consulter Sign-in logs Entra ID pour code d'erreur. Tester sans Conditional Access sur compte pilote. Réinstaller Company Portal.",
  },
  {
    problem: "Compte macOS non créé",
    causes: [
      "Registration = Disabled dans le profil",
      "User Mapping incorrect (UPN vs mail)",
      "Mac non enrôlé MDM ou profil non assigné",
      "macOS version incompatible (< 13)",
    ],
    solution:
      "Contrôler Registration = Automatic. Vérifier mapping userPrincipalName. Confirmer profil Required sur le Mac. Forcer check-in MDM et redémarrer.",
  },
  {
    problem: "SSO inactif — login local demandé",
    causes: [
      "Profil Platform SSO absent ou en conflit",
      "Extension SSO désactivée ou expirée",
      "Compte local non lié à Entra ID",
      "Profil utilisateur vs appareil mal assigné",
    ],
    solution:
      "Vérifier profil dans Réglages → Général → VPN et gestion des appareils. Réassigner profil Platform SSO. Utiliser « Link account » si compte local préexistant.",
  },
  {
    problem: "Password Sync ne fonctionne pas",
    causes: [
      "macOS < 14 Sonoma",
      "Compte non lié via Platform SSO",
      "Changement mot de passe hors sync window",
    ],
    solution:
      "Mettre à jour macOS 14+. Vérifier liaison compte dans Réglages → Utilisateurs. Forcer logout/login après changement mot de passe Entra ID.",
  },
];

export const platformSsoBestPractices = [
  "Déployer sur un groupe pilote (10–20 Mac) pendant 2 semaines avant production",
  "Activer MFA sur 100 % des comptes Entra ID avant Platform SSO",
  "Documenter Tenant ID, Extension ID, Registration mode et groupes assignés",
  "Contrôler les Sign-in logs Entra ID et Device logs Intune hebdomadairement",
  "Utiliser Conditional Access : appareil conforme requis pour login macOS",
  "Combiner avec Managed Apple IDs fédérés pour identité Apple + Microsoft unifiée",
];

export const platformSsoCaseStudy = {
  title: "Cas pratique — 1000 Mac avec Platform SSO Entra ID",
  scenario:
    "Une entreprise souhaite remplacer 1000 comptes locaux macOS par Platform SSO Microsoft Entra ID. Objectif : authentification unique, MFA, Password Sync et zéro mot de passe local distinct.",
  tasks: [
    "Configurer Platform SSO dans Intune Settings Catalog",
    "Créer le profil Platform SSO Production",
    "Déployer sur groupe pilote puis production",
    "Vérifier authentification et MFA sur Mac pilotes",
  ],
  solution: [
    "Prérequis — macOS 14 Sonoma minimum sur flotte. Company Portal déployé via VPP Required. Managed Apple IDs fédérés Entra ID actifs.",
    "Intune — Devices → macOS → Configuration profiles → Settings catalog → Platform SSO. Tenant ID : [GUID]. Extension : com.microsoft.CompanyPortalMac.ssoextension. Registration : Automatic. Auth : Password + Redirect.",
    "Profil — Nom : Platform-SSO-Production-v1. User mapping : userPrincipalName. Assign Required → Mac-PSSO-Pilot (15 Mac).",
    "Pilote — 15 MacBook Pro ADE : login @entreprise.com → MFA → compte macOS créé. Vérifier Password Sync : reset Entra ID → login Mac OK.",
    "Conditional Access — Policy « Mac conforme requis » : exige Intune compliance (FileVault, OS ≥ 14, SIP).",
    "Production — Extension assignation Mac-Production (1000 Mac). Communication utilisateurs : « un seul mot de passe — celui de Microsoft ».",
    "Monitoring — Dashboard hebdo : Sign-in logs Entra (failures), Intune device config status, tickets support mot de passe Mac (objectif : -90 %).",
  ],
};

export const platformSsoLabExercises = [
  {
    title: "TP 1 — Création du profil Platform SSO",
    goal: "Configurer Platform SSO dans Intune Settings Catalog.",
    steps: [
      "Intune → Devices → macOS → Configuration profiles → Create",
      "Platform : macOS → Profile type : Settings catalog",
      "Rechercher « Platform SSO » → Configurer Tenant ID, Extension ID, Registration Automatic",
      "Nommer : Platform-SSO-Lab-v1 → Save",
    ],
  },
  {
    title: "TP 2 — Déploiement groupe pilote",
    goal: "Assigner le profil à un Mac de labo.",
    steps: [
      "Créer groupe Azure AD « Mac-PSSO-Lab » avec 1–2 Mac enrôlés",
      "Assign profile → Required → Mac-PSSO-Lab",
      "Sur Mac : forcer check-in (sudo jamf policy ou Intune Sync)",
      "Vérifier profil dans Réglages → Général → VPN et gestion des appareils",
    ],
  },
  {
    title: "TP 3 — Test connexion Platform SSO",
    goal: "Valider création compte via Entra ID.",
    steps: [
      "Réinitialiser Mac labo (ou nouvel utilisateur ADE)",
      "À l'écran login : saisir user@entreprise.com",
      "Compléter auth Entra ID + MFA",
      "Confirmer compte macOS créé avec nom correct",
    ],
  },
  {
    title: "TP 4 — Validation MFA",
    goal: "Confirmer que MFA Entra ID s'applique au login macOS.",
    steps: [
      "Conditional Access : exiger MFA pour « All users » + « macOS Platform SSO »",
      "Logout Mac → re-login",
      "Vérifier prompt Microsoft Authenticator",
      "Sign-in logs Entra ID → Status : Success, MFA satisfied",
    ],
  },
  {
    title: "TP 5 — Vérification Password Sync",
    goal: "Tester synchronisation mot de passe Entra → macOS.",
    steps: [
      "Changer mot de passe utilisateur dans Entra ID (self-service ou admin)",
      "Logout session macOS",
      "Login avec nouveau mot de passe Entra ID",
      "Confirmer accès macOS sans reset local",
    ],
  },
];

export const platformSsoLabChecklist = [
  "Profil Platform SSO créé dans Intune Settings Catalog",
  "Profil assigné Required au Mac pilote",
  "Login Entra ID réussi avec création compte macOS",
  "MFA validée via Conditional Access",
  "Password Sync testé après changement mot de passe Entra ID",
  "Sign-in logs Entra ID consultés — aucune erreur critique",
];

export const platformSsoQuizQuestions: Question[] = [
  {
    id: "psso-q1",
    text: "Quel fournisseur d'identité est le plus utilisé avec Platform SSO sur macOS ?",
    options: ["Google Workspace", "Microsoft Entra ID", "Dropbox", "Slack"],
    correctIndex: 1,
    explanation: "Microsoft Entra ID est le fournisseur principal — extension Platform SSO native avec Intune.",
  },
  {
    id: "psso-q2",
    text: "Quel avantage principal apporte Platform SSO ?",
    options: ["Double mot de passe requis", "Authentification unifiée Entra ID / macOS", "Désactive MFA", "Désactive Intune"],
    correctIndex: 1,
    explanation: "Platform SSO unifie l'identité — un seul login Entra ID pour la session macOS.",
  },
  {
    id: "psso-q3",
    text: "Quelle version macOS minimum pour Platform SSO ?",
    options: ["macOS 10.15 Catalina", "macOS 13 Ventura", "macOS 11 Big Sur", "macOS 12 Monterey"],
    correctIndex: 1,
    explanation: "Platform SSO nécessite macOS 13 Ventura minimum — Sonoma 14+ pour Password Sync complet.",
  },
  {
    id: "psso-q4",
    text: "Où configure-t-on Platform SSO dans Intune ?",
    options: [
      "Apps → App Store",
      "Devices → macOS → Configuration profiles → Settings catalog",
      "Tenant administration → APNs",
      "Users → Licenses",
    ],
    correctIndex: 1,
    explanation: "Le Settings Catalog Intune contient les paramètres Platform SSO pour macOS.",
  },
  {
    id: "psso-q5",
    text: "Que fait « Registration : Automatic » ?",
    options: [
      "Désactive Platform SSO",
      "Crée ou lie automatiquement le compte macOS à Entra ID",
      "Installe l'App Store",
      "Active FileVault",
    ],
    correctIndex: 1,
    explanation: "Automatic enregistre silencieusement l'identité Entra ID au premier login.",
  },
  {
    id: "psso-q6",
    text: "Qu'est-ce que Password Sync ?",
    options: [
      "Sync iCloud photos",
      "Synchronisation mot de passe Entra ID vers compte macOS local",
      "Sync certificat APNs",
      "Backup Time Machine cloud",
    ],
    correctIndex: 1,
    explanation: "Password Sync propage les changements de mot de passe Entra ID au login macOS.",
  },
  {
    id: "psso-q7",
    text: "Quel paramètre identifie le tenant Microsoft ?",
    options: ["Bundle ID", "Tenant ID (GUID)", "SSID Wi-Fi", "APNs certificate"],
    correctIndex: 1,
    explanation: "Le Tenant ID GUID lie le Mac au bon tenant Entra ID.",
  },
  {
    id: "psso-q8",
    text: "Platform SSO remplace principalement :",
    options: [
      "FileVault",
      "Comptes locaux macOS avec mot de passe séparé",
      "APNs",
      "ADE",
    ],
    correctIndex: 1,
    explanation: "Platform SSO élimine la dualité compte local + compte Microsoft.",
  },
  {
    id: "psso-q9",
    text: "Comment diagnostiquer « Connexion impossible » ?",
    options: [
      "Supprimer ABM",
      "Consulter Sign-in logs Entra ID et vérifier Tenant ID",
      "Désactiver SIP",
      "Renouveler token VPP",
    ],
    correctIndex: 1,
    explanation: "Les Sign-in logs Entra ID révèlent MFA failures, CA blocks et erreurs SSO.",
  },
  {
    id: "psso-q10",
    text: "Conditional Access s'applique-t-il au login Platform SSO ?",
    options: ["Non", "Oui — les politiques Entra ID s'appliquent", "Seulement sur iPhone", "Seulement avec Jamf"],
    correctIndex: 1,
    explanation: "Platform SSO délègue à Entra ID — Conditional Access et MFA s'appliquent.",
  },
  {
    id: "psso-q11",
    text: "Account Linking sert à :",
    options: [
      "Créer un certificat Wi-Fi",
      "Lier un compte macOS existant à Entra ID",
      "Installer une app VPP",
      "Renouveler APNs",
    ],
    correctIndex: 1,
    explanation: "Account Linking migre les comptes locaux legacy vers Platform SSO.",
  },
  {
    id: "psso-q12",
    text: "Quelle app Microsoft est souvent requise pour Platform SSO ?",
    options: ["Microsoft Teams uniquement", "Company Portal (extension SSO)", "Outlook uniquement", "Excel"],
    correctIndex: 1,
    explanation: "L'extension Company Portal fournit le Bundle ID Platform SSO Microsoft.",
  },
  {
    id: "psso-q13",
    text: "Quelle bonne pratique avant déploiement 1000 Mac ?",
    options: [
      "Déployer sans test",
      "Groupe pilote + MFA + documentation",
      "Désactiver Conditional Access",
      "Utiliser comptes locaux uniquement",
    ],
    correctIndex: 1,
    explanation: "Un pilote validé réduit les risques de lockout massif.",
  },
  {
    id: "psso-q14",
    text: "User Mapping définit :",
    options: [
      "Le SSID Wi-Fi",
      "La correspondance attribut Entra ID → compte macOS",
      "La date expiration APNs",
      "Le modèle Mac",
    ],
    correctIndex: 1,
    explanation: "User Mapping mappe userPrincipalName ou mail vers le nom de compte local.",
  },
  {
    id: "psso-q15",
    text: "Jamf Pro peut-il aussi déployer Platform SSO ?",
    options: [
      "Non, Intune uniquement",
      "Oui, via Configuration Profile Platform SSO payload",
      "Seulement sur iPhone",
      "Seulement avec Apple ID personnel",
    ],
    correctIndex: 1,
    explanation: "Jamf et Intune supportent tous deux le payload Platform SSO macOS.",
  },
];

export const platformSsoScoreTiers = [
  { min: 0, title: "📖 À revoir", message: "Repassez le fonctionnement Platform SSO et l'intégration Entra ID." },
  { min: 60, title: "👍 Correct", message: "Bonne base ! Visez 80 % pour valider la leçon." },
  { min: 80, title: "🏆 Validé", message: "Excellent ! Vous maîtrisez Platform SSO sur macOS." },
  { min: 100, title: "🔑 Expert Platform SSO", message: "Score parfait — vous êtes autonome sur le déploiement Entra ID + macOS." },
];

export function isPlatformSsoLesson(courseSlug: string, lessonSlug: string): boolean {
  return courseSlug === PLATFORM_SSO_COURSE_SLUG && lessonSlug === PLATFORM_SSO_LESSON_SLUG;
}

export const PLATFORM_SSO_COMPLETE_KEY = "lesson-platform-sso-complete";

export function getPlatformSsoDeployStatus(itemsChecked: number, total: number): "healthy" | "warning" {
  return itemsChecked >= total ? "healthy" : "warning";
}
