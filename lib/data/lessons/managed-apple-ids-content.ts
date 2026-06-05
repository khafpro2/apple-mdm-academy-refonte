import type { Question } from "@/lib/types";

export const MANAGED_APPLE_IDS_LESSON_SLUG = "managed-apple-ids";
export const MANAGED_APPLE_IDS_COURSE_SLUG = "intune-mac";

export const managedAppleIdsCertifications = [
  "Apple Certified IT Professional",
  "Apple Deployment and Management",
  "Jamf 100",
  "Jamf 200",
];

export const managedAppleIdsObjectives = [
  "Comprendre le rôle et la valeur des Managed Apple IDs en entreprise",
  "Différencier un Apple ID personnel d'un Managed Apple ID",
  "Créer des comptes gérés manuellement dans Apple Business Manager",
  "Intégrer Microsoft Entra ID via fédération et SSO",
  "Maîtriser Domain Capture, la synchronisation et les limitations officielles",
  "Déployer Managed Apple IDs à grande échelle avec gouvernance et sécurité",
];

export const managedAppleIdsDefinition = {
  summary:
    "Un Managed Apple ID est un compte Apple créé et détenu par une organisation (entreprise, école, administration). Il est administré depuis Apple Business Manager (ABM) ou Apple School Manager (ASM) — jamais par l'utilisateur final comme un compte personnel.",
  adminSources: [
    "Apple Business Manager (ABM) — entreprises et administrations",
    "Apple School Manager (ASM) — établissements scolaires et universités",
  ],
};

export const appleIdComparison = [
  {
    aspect: "Propriété",
    personal: "Appartient à l'utilisateur individuel",
    managed: "Appartient à l'organisation (ABM/ASM)",
  },
  {
    aspect: "Administration",
    personal: "Géré par l'utilisateur sur appleid.apple.com",
    managed: "Géré par les administrateurs ABM/ASM",
  },
  {
    aspect: "Réinitialisation mot de passe",
    personal: "Self-service ou recovery email personnel",
    managed: "Administrateur ABM ou SSO Entra ID (fédération)",
  },
  {
    aspect: "iCloud",
    personal: "200 Go+ stockage personnel, Photos, Drive, Backup",
    managed: "200 Go iCloud org, pas de backup iCloud appareil, pas de Photos perso",
  },
  {
    aspect: "Achats App Store",
    personal: "Achats personnels libres",
    managed: "Pas d'achats personnels — apps via Apps & Books / MDM uniquement",
  },
  {
    aspect: "Sécurité",
    personal: "MFA optionnelle, contrôle utilisateur",
    managed: "MFA via Entra ID, gouvernance centralisée, révocation instantanée",
  },
  {
    aspect: "Find My / Activation Lock",
    personal: "Lié au compte personnel de l'utilisateur",
    managed: "Géré par l'organisation — bypass MDM à l'enrôlement ADE",
  },
  {
    aspect: "Cycle de vie",
    personal: "Persiste après départ de l'entreprise",
    managed: "Désactivé/supprimé automatiquement via sync Entra ID",
  },
];

export const managedAppleIdsAdvantages = [
  "Contrôle centralisé — création, modification et suppression depuis ABM",
  "Sécurité renforcée — MFA Entra ID, pas de mélange données perso/pro",
  "Réinitialisation simplifiée — admin ou SSO, pas de dépendance email perso",
  "Intégration Microsoft — fédération Entra ID, provisioning SCIM",
  "Gestion du cycle de vie — sync automatique à l'embauche et au départ",
];

export const managedAppleIdsUseCases = [
  {
    sector: "Entreprise",
    icon: "🏢",
    examples: "Mac/iPhone d'entreprise, iCloud org pour collaboration, SSO Office 365 + Apple services",
  },
  {
    sector: "Éducation",
    icon: "🎓",
    examples: "Comptes élèves/enseignants ASM, Shared iPad, apps éducatives, Classroom",
  },
  {
    sector: "Administration publique",
    icon: "🏛️",
    examples: "Conformité RGPD, souveraineté des données, pas de comptes personnels sur flotte",
  },
];

export const managedAppleIdsManualCreationSteps = [
  {
    step: "1. Accéder aux Utilisateurs",
    detail: "business.apple.com → Comptes → Utilisateurs (ou Users selon langue).",
  },
  {
    step: "2. Ajouter un utilisateur",
    detail: "Cliquer sur le bouton « + » ou « Ajouter » pour créer un compte manuellement.",
  },
  {
    step: "3. Nom",
    detail: "Prénom et nom de l'utilisateur — affichés dans les services Apple (iCloud org, Mail).",
  },
  {
    step: "4. Email (Managed Apple ID)",
    detail: "Format : prenom.nom@entreprise.com — doit correspondre au domaine fédéré ou @appleid.com temporaire.",
  },
  {
    step: "5. Rôle",
    detail: "Administrateur, Gestionnaire, ou Utilisateur — définit les droits dans ABM/ASM.",
  },
  {
    step: "6. Emplacement (Location)",
    detail: "Site ou département ABM — requis pour assignation d'appareils et apps.",
  },
  {
    step: "7. Créer",
    detail: "Valider — l'utilisateur reçoit une invitation ou mot de passe temporaire selon config.",
  },
];

export const managedAppleIdsFederationArchitecture = [
  { label: "Apple Business Manager", icon: "🍎", color: "from-gray-800 to-gray-700" },
  { label: "Microsoft Entra ID", icon: "☁️", color: "from-blue-600 to-indigo-600" },
  { label: "SSO — Authentification unique", icon: "🔑", color: "from-green-600 to-emerald-500" },
];

export const managedAppleIdsFederationBenefits = [
  "Authentification unique (SSO) — même identifiant que Microsoft 365",
  "Gestion simplifiée — un seul annuaire (Entra ID) comme source de vérité",
  "Synchronisation utilisateurs — création/mise à jour/suppression automatique",
];

export const managedAppleIdsFederationSteps = [
  "Apple Business Manager → Comptes → Fédération d'identité (Identity Federation)",
  "Sélectionner Microsoft Entra ID comme fournisseur d'identité",
  "Suivre l'assistant de configuration — connexion au tenant Entra ID",
  "Valider le domaine (Domain Capture) via enregistrement DNS TXT",
  "Activer la synchronisation SCIM pour provisioning automatique",
  "Tester la connexion SSO avec un utilisateur pilote sur un Mac ou iCloud.com",
];

export const managedAppleIdsDomainCapture = {
  title: "Domain Capture — Vérification DNS",
  description:
    "Domain Capture prouve à Apple que votre organisation contrôle le domaine email (ex. entreprise.com). Sans validation, les utilisateurs avec un Apple ID personnel sur ce domaine créent des conflits.",
  txtRecordExample: {
    host: "_apple-domain-verification.entreprise.com",
    type: "TXT",
    value: "apple-domain-verification=XXXXXXXXXXXX (fourni par ABM)",
  },
  risks: [
    "Domaine non validé — fédération impossible, conflits Apple ID persistant",
    "TXT record incorrect ou expiré — validation échoue après 14 jours",
    "Domain Capture activé sans communication — utilisateurs bloqués sur Apple ID perso existant",
    "Plusieurs organisations revendiquant le même domaine — conflit de propriété",
  ],
  resolution:
    "Planifier une communication utilisateurs avant Domain Capture. Fournir un processus de résolution de conflit (Release Apple ID) pour les comptes personnels existants.",
};

export const managedAppleIdsSyncLifecycle = [
  {
    event: "Création automatique",
    description: "Nouvel utilisateur dans Entra ID → Managed Apple ID créé via SCIM dans les 40 minutes.",
  },
  {
    event: "Mise à jour automatique",
    description: "Changement nom/email dans Entra ID → synchronisé vers ABM (selon mapping attributs).",
  },
  {
    event: "Suppression automatique",
    description: "Utilisateur supprimé ou désactivé dans Entra ID → Managed Apple ID désactivé dans ABM.",
  },
  {
    event: "Gestion des départs",
    description: "Offboarding Entra ID révoque l'accès Apple immédiatement — pas de données perso orphelines.",
  },
];

export const managedAppleIdsLimitations = [
  {
    limitation: "Achats App Store / iTunes",
    detail: "Impossible d'acheter apps, musique ou films avec un Managed Apple ID.",
  },
  {
    limitation: "Find My personnel",
    detail: "Pas de Find My lié au compte perso — Activation Lock géré par l'organisation.",
  },
  {
    limitation: "iCloud Backup appareil",
    detail: "Pas de sauvegarde iCloud complète d'iPhone/iPad — utiliser MDM backup ou aucun.",
  },
  {
    limitation: "Apple Pay / Wallet complet",
    detail: "Fonctionnalités grand public limitées ou indisponibles.",
  },
  {
    limitation: "HomeKit / Apple TV+ perso",
    detail: "Services consommateurs non disponibles ou restreints.",
  },
  {
    limitation: "Équivalence totale Apple ID perso",
    detail: "Un Managed Apple ID est conçu pour le travail/école — pas un remplacement du compte personnel.",
  },
];

export const managedAppleIdsSecurityMeasures = [
  { measure: "MFA (Multi-Factor Authentication)", detail: "Imposer MFA dans Entra ID — hérité via fédération SSO." },
  { measure: "Entra ID Conditional Access", detail: "Politiques d'accès : appareil conforme, localisation, risque." },
  { measure: "Réinitialisation sécurisée", detail: "Reset mot de passe via admin ABM ou self-service Entra ID — jamais email perso." },
  { measure: "Gestion des rôles ABM", detail: "Principe du moindre privilège : Admin, Manager, Content Manager, User." },
];

export const managedAppleIdsTroubleshooting = [
  {
    problem: "Conflit Apple ID",
    causes: [
      "Utilisateur possède déjà un Apple ID personnel avec le même email @entreprise.com",
      "Domain Capture activé sans résolution préalable",
      "Compte non libéré (Release) avant fédération",
    ],
    solution:
      "ABM → Comptes → Conflits → inviter l'utilisateur à libérer son Apple ID personnel ou migrer vers Managed. Processus « Release this Apple ID » documenté Apple.",
  },
  {
    problem: "Utilisateur non synchronisé",
    causes: [
      "SCIM non configuré ou token expiré",
      "Utilisateur hors scope du groupe de sync Entra ID",
      "Attributs manquants (mail, userPrincipalName)",
      "Erreur provisioning Entra → ABM",
    ],
    solution:
      "Vérifier Enterprise Application SCIM dans Entra ID → Provisioning logs. Confirmer que l'utilisateur est dans le groupe cible. Forcer sync manuelle.",
  },
  {
    problem: "Domaine non validé",
    causes: [
      "Enregistrement TXT absent ou incorrect dans DNS",
      "Propagation DNS incomplète (jusqu'à 48 h)",
      "Mauvais sous-domaine (_apple-domain-verification)",
    ],
    solution:
      "Contrôler DNS avec `nslookup -type=TXT _apple-domain-verification.entreprise.com`. Corriger le TXT dans le registrar. Relancer validation ABM.",
  },
  {
    problem: "SSO échoue à la connexion",
    causes: [
      "Certificat SAML expiré",
      "URL reply incorrecte",
      "Utilisateur sans licence Entra ID",
      "Conditional Access bloquant",
    ],
    solution:
      "Vérifier config SAML Entra ID ↔ ABM. Tester avec utilisateur pilote. Consulter sign-in logs Entra ID pour cause du rejet.",
  },
];

export const managedAppleIdsBestPractices = [
  "Utiliser la fédération Entra ID plutôt que la création manuelle à grande échelle",
  "Imposer MFA sur tous les comptes fédérés via Conditional Access",
  "Adopter un nommage cohérent : prenom.nom@domaine entreprise",
  "Documenter le processus de résolution de conflit Apple ID avant Domain Capture",
  "Gouvernance des comptes : revue trimestrielle des admins ABM et des rôles",
  "Communiquer aux utilisateurs la différence Managed vs personnel avant déploiement",
];

export const managedAppleIdsCaseStudy = {
  title: "Cas pratique — 1000 Managed Apple IDs avec Entra ID",
  scenario:
    "Une entreprise de 1000 collaborateurs doit déployer des Managed Apple IDs fédérés à Entra ID pour Mac, iPhone et iCloud organisationnel. Aucun Apple ID personnel ne doit rester sur le domaine @entreprise.com.",
  tasks: [
    "Valider le domaine entreprise.com dans ABM",
    "Configurer la fédération Microsoft Entra ID",
    "Synchroniser les 1000 utilisateurs via SCIM",
    "Tester SSO sur Mac et iCloud.com",
  ],
  solution: [
    "DNS — Ajouter TXT `_apple-domain-verification.entreprise.com` fourni par ABM. Valider avec nslookup. Attendre propagation 24 h.",
    "ABM — Comptes → Fédération → Microsoft Entra ID. Suivre l'assistant SAML/SCIM. Noter les URLs de reply et entity ID.",
    "Entra ID — Enterprise Application « Apple Business Manager » → Provisioning → Automatic + groupe « Apple-Managed-Users » (1000 users).",
    "Domain Capture — Activer après communication RH/IT. Processus conflit : email + portail Release Apple ID pour les ~5 % avec compte perso existant.",
    "SCIM — Vérifier provisioning logs : 1000 created/updated. Délai initial : 24–48 h pour sync complète.",
    "Test SSO — 10 utilisateurs pilotes : connexion iCloud.com avec @entreprise.com → redirect Entra ID → MFA → accès iCloud org.",
    "Gouvernance — MFA obligatoire, Conditional Access appareil conforme, revue admins ABM trimestrielle.",
  ],
};

export const managedAppleIdsLabExercises = [
  {
    title: "TP 1 — Préparer la validation DNS",
    goal: "Comprendre l'enregistrement TXT requis pour Domain Capture.",
    steps: [
      "ABM → Comptes → Fédération → Ajouter domaine → entreprise.com",
      "Copier la valeur TXT fournie par Apple",
      "Ajouter dans votre DNS : `_apple-domain-verification.entreprise.com` TXT",
      "Vérifier : `nslookup -type=TXT _apple-domain-verification.entreprise.com`",
    ],
  },
  {
    title: "TP 2 — Configurer la fédération Entra ID",
    goal: "Lier ABM et Entra ID pour SSO.",
    steps: [
      "ABM → Fédération → Microsoft Entra ID → Démarrer",
      "Entra ID → Enterprise Applications → Apple Business Manager → SSO SAML",
      "Copier Login URL, Entity ID, Certificate dans ABM",
      "Tester connexion avec un compte pilote",
    ],
  },
  {
    title: "TP 3 — Provisioning SCIM",
    goal: "Synchroniser automatiquement les utilisateurs.",
    steps: [
      "Entra ID → Apple Business Manager app → Provisioning → Automatic",
      "Créer groupe « Apple-Users-Sync » avec utilisateurs cibles",
      "Assigner le groupe à l'application",
      "Provisioning logs → vérifier « Success » pour chaque utilisateur",
    ],
  },
  {
    title: "TP 4 — Création manuelle (fallback)",
    goal: "Créer un Managed Apple ID sans fédération (labo ou exception).",
    steps: [
      "ABM → Utilisateurs → Ajouter",
      "Renseigner nom, email @appleid.com ou domaine, rôle, emplacement",
      "Envoyer invitation — utilisateur définit mot de passe initial",
      "Vérifier apparition dans liste Utilisateurs ABM",
    ],
  },
  {
    title: "TP 5 — Test connexion SSO",
    goal: "Valider le parcours utilisateur final.",
    steps: [
      "Sur Mac : Réglages → [Nom] → Se connecter avec Managed Apple ID",
      "Ou : icloud.com → saisir email @entreprise.com",
      "Redirect Entra ID → MFA → connexion réussie",
      "Confirmer accès iCloud organisationnel (pas App Store perso)",
    ],
  },
];

export const managedAppleIdsLabChecklist = [
  "Enregistrement TXT DNS configuré et vérifié (nslookup)",
  "Fédération Entra ID configurée dans ABM",
  "Provisioning SCIM actif avec logs Success",
  "Au moins 1 Managed Apple ID créé (sync ou manuel)",
  "Test SSO réussi sur Mac ou iCloud.com",
  "Processus résolution conflit documenté",
];

export const managedAppleIdsQuizQuestions: Question[] = [
  {
    id: "maid-q1",
    text: "Qui possède un Managed Apple ID ?",
    options: ["L'utilisateur individuel", "L'organisation (ABM/ASM)", "Apple Inc.", "Le revendeur MDM"],
    correctIndex: 1,
    explanation: "Le Managed Apple ID appartient à l'organisation qui l'administre via ABM ou ASM.",
  },
  {
    id: "maid-q2",
    text: "Quel service Microsoft permet la fédération avec ABM ?",
    options: ["APNs", "Microsoft Entra ID", "ADE", "VPP"],
    correctIndex: 1,
    explanation: "Entra ID fournit SSO SAML et provisioning SCIM vers Apple Business Manager.",
  },
  {
    id: "maid-q3",
    text: "Peut-on acheter des apps App Store avec un Managed Apple ID ?",
    options: ["Oui, sans limite", "Non — achats via Apps & Books / MDM uniquement", "Oui, apps gratuites seulement", "Oui avec carte bancaire perso"],
    correctIndex: 1,
    explanation: "Les Managed Apple IDs ne permettent pas d'achats personnels sur l'App Store.",
  },
  {
    id: "maid-q4",
    text: "Où administre-t-on les Managed Apple IDs ?",
    options: ["appleid.apple.com personnel", "Apple Business Manager ou Apple School Manager", "identity.apple.com/pushcert", "App Store Connect"],
    correctIndex: 1,
    explanation: "ABM et ASM sont les portails d'administration des comptes gérés.",
  },
  {
    id: "maid-q5",
    text: "Quel enregistrement DNS valide le domaine pour Domain Capture ?",
    options: ["A Record", "TXT Record sur _apple-domain-verification", "MX Record", "CNAME www"],
    correctIndex: 1,
    explanation: "Apple exige un TXT sur _apple-domain-verification.domaine.com pour prouver la propriété.",
  },
  {
    id: "maid-q6",
    text: "Que se passe-t-il quand un utilisateur est supprimé d'Entra ID (sync SCIM) ?",
    options: [
      "Rien",
      "Le Managed Apple ID est désactivé dans ABM",
      "Seul le Mac est effacé",
      "L'Apple ID personnel est supprimé",
    ],
    correctIndex: 1,
    explanation: "SCIM synchronise le cycle de vie — suppression Entra ID → désactivation ABM.",
  },
  {
    id: "maid-q7",
    text: "Qu'est-ce qu'un conflit Apple ID ?",
    options: [
      "APNs expiré",
      "Apple ID personnel existant sur le même email @domaine entreprise",
      "Certificat Wi-Fi invalide",
      "Token VPP expiré",
    ],
    correctIndex: 1,
    explanation: "Le conflit survient quand un utilisateur a déjà un Apple ID perso avec l'email du domaine fédéré.",
  },
  {
    id: "maid-q8",
    text: "Quel avantage clé de la fédération Entra ID ?",
    options: ["Renouveler APNs", "SSO — même identifiant que Microsoft 365", "Acheter des Mac", "Créer des profils Wi-Fi"],
    correctIndex: 1,
    explanation: "La fédération permet une authentification unique entre Microsoft et Apple.",
  },
  {
    id: "maid-q9",
    text: "iCloud Backup complet est-il disponible sur Managed Apple ID ?",
    options: ["Oui", "Non — backup iCloud appareil non disponible", "Oui avec abonnement perso", "Seulement sur iPad"],
    correctIndex: 1,
    explanation: "Les Managed Apple IDs n'offrent pas de backup iCloud complet des appareils.",
  },
  {
    id: "maid-q10",
    text: "Quel rôle ABM peut gérer les utilisateurs mais pas les appareils ?",
    options: ["Administrateur", "Gestionnaire de contenu", "Utilisateur standard", "Aucun"],
    correctIndex: 1,
    explanation: "Le Content Manager gère Apps & Books ; les rôles varient — Manager gère users/devices selon config.",
  },
  {
    id: "maid-q11",
    text: "Comment résoudre « domaine non validé » ?",
    options: [
      "Renouveler le certificat APNs",
      "Contrôler et corriger l'enregistrement TXT DNS",
      "Réenrôler les Mac",
      "Supprimer Entra ID",
    ],
    correctIndex: 1,
    explanation: "La validation domaine repose sur le TXT DNS _apple-domain-verification.",
  },
  {
    id: "maid-q12",
    text: "Apple School Manager est utilisé pour :",
    options: ["Entreprises uniquement", "Établissements scolaires et éducation", "APNs uniquement", "Apps payantes"],
    correctIndex: 1,
    explanation: "ASM est l'équivalent ABM pour l'éducation (Managed Apple IDs élèves/enseignants).",
  },
  {
    id: "maid-q13",
    text: "Quelle bonne pratique avant Domain Capture ?",
    options: [
      "Désactiver MFA",
      "Communiquer et documenter la résolution de conflit Apple ID",
      "Supprimer tous les Mac",
      "Utiliser des Apple ID @gmail.com",
    ],
    correctIndex: 1,
    explanation: "Domain Capture impacte les Apple ID perso existants — communication préalable essentielle.",
  },
  {
    id: "maid-q14",
    text: "Le provisioning SCIM crée les utilisateurs ABM depuis :",
    options: ["Jamf Pro", "Microsoft Entra ID", "APNs", "App Store"],
    correctIndex: 1,
    explanation: "Entra ID provisionne automatiquement les Managed Apple IDs via SCIM.",
  },
  {
    id: "maid-q15",
    text: "MFA pour Managed Apple IDs fédérés est généralement géré par :",
    options: ["L'utilisateur sur appleid.apple.com", "Microsoft Entra ID Conditional Access", "APNs", "ABM directement uniquement"],
    correctIndex: 1,
    explanation: "Avec fédération, MFA est imposée via Entra ID — héritée à la connexion Apple.",
  },
];

export const managedAppleIdsScoreTiers = [
  { min: 0, title: "📖 À revoir", message: "Repassez la comparaison Apple ID, la fédération Entra ID et les limitations." },
  { min: 60, title: "👍 Correct", message: "Bonne base ! Visez 80 % pour valider la leçon." },
  { min: 80, title: "🏆 Validé", message: "Excellent ! Vous maîtrisez les Managed Apple IDs en entreprise." },
  { min: 100, title: "🍎 Expert Managed Apple ID", message: "Score parfait — vous êtes autonome sur ABM, fédération et déploiement à grande échelle." },
];

export function isManagedAppleIdsLesson(courseSlug: string, lessonSlug: string): boolean {
  return courseSlug === MANAGED_APPLE_IDS_COURSE_SLUG && lessonSlug === MANAGED_APPLE_IDS_LESSON_SLUG;
}

export const MANAGED_APPLE_IDS_COMPLETE_KEY = "lesson-managed-apple-ids-complete";

export function getManagedAppleIdsDeployStatus(itemsChecked: number, total: number): "healthy" | "warning" {
  return itemsChecked >= total ? "healthy" : "warning";
}
