import type { Quiz } from "@/lib/types";
import { examPools, examQuestionCounts } from "@/lib/data/exams/pools";
import { proModuleQuizzes } from "@/lib/data/pro-modules/quizzes";
import { advancedModuleQuizzes } from "@/lib/data/advanced-tracks/quizzes";
import { altMdmModuleQuizzes } from "@/lib/data/alternative-mdm-tracks/quizzes";
import { prepareExamPool, prepareQuiz } from "@/lib/quiz/prepare-quiz";

export const rawQuizzesBeforePrepare: Quiz[] = [
  {
    slug: "quiz-apple-fundamentals",
    trackSlug: "apple-fundamentals",
    title: "Quiz — Apple Fundamentals",
    type: "quiz",
    description: "Teste tes connaissances sur l'écosystème Apple et la sécurité de base.",
    duration: "15 min",
    passingScore: 70,
    questions: [
      {
        id: "af-1",
        text: "Quel composant Apple gère le chiffrement des données biométriques ?",
        options: ["T2 Security Chip", "Secure Enclave", "Apple Silicon GPU", "System Management Controller"],
        correctIndex: 1,
        explanation: "Le Secure Enclave est un coprocesseur dédié qui isole et protège les données biométriques et cryptographiques.",
      },
      {
        id: "af-2",
        text: "Quelle technologie Apple vérifie que les apps proviennent de développeurs identifiés ?",
        options: ["FileVault", "Gatekeeper", "APNs", "DEP"],
        correctIndex: 1,
        explanation: "Gatekeeper vérifie la signature et la notarisation des applications avant leur exécution sur macOS.",
      },
      {
        id: "af-3",
        text: "FileVault chiffre principalement :",
        options: ["La RAM", "Le disque de démarrage", "Le cache réseau", "Les sauvegardes iCloud uniquement"],
        correctIndex: 1,
        explanation: "FileVault 2 chiffre le volume de démarrage complet avec XTS-AES-128.",
      },
      {
        id: "af-4",
        text: "Quelle est la différence principale entre iOS et iPadOS ?",
        options: ["iPadOS ne supporte pas le chiffrement", "iPadOS ajoute des fonctionnalités multitâche étendues", "iOS ne peut pas être géré en MDM", "Aucune différence"],
        correctIndex: 1,
        explanation: "iPadOS est basé sur iOS mais inclut des optimisations pour le multitâche, le clavier et l'Apple Pencil.",
      },
      {
        id: "af-5",
        text: "Managed Apple ID est principalement utilisé pour :",
        options: ["Les achats personnels App Store", "L'éducation et l'entreprise", "Le développement d'apps", "Le jailbreak"],
        correctIndex: 1,
        explanation: "Les Managed Apple ID sont créés et gérés par l'organisation via Apple Business Manager ou Apple School Manager.",
      },
      {
        id: "af-6",
        text: "Après l'import d'un nouveau certificat APNs, les appareils ne répondent plus aux commandes MDM. Quelle vérification effectuer en priorité ?",
        options: [
          "Le certificat APNs a expiré",
          "Le certificat APNs a été renouvelé avec un autre Apple ID",
          "Le token ABM n'est plus synchronisé",
          "Les appareils ne sont plus supervisés",
        ],
        correctIndex: 1,
        explanation: "Un renouvellement APNs avec un Apple ID différent rompt la confiance push — les appareils ne recevront plus les commandes MDM.",
      },
      {
        id: "af-ms-1",
        text: "Quelles conditions sont nécessaires à l'Automated Device Enrollment (ADE) ? (plusieurs réponses)",
        options: [
          "Apple Business Manager configuré",
          "Serveur MDM enregistré dans ABM",
          "Certificat APNs valide",
          "Abonnement Apple Music",
        ],
        correctIndex: 0,
        correctIndices: [0, 1, 2],
        selectMultiple: true,
        explanation: "ADE requiert ABM, un serveur MDM lié et un certificat APNs actif. Apple Music n'a aucun lien avec l'enrollment MDM.",
      },
    ],
  },
  {
    slug: "quiz-jamf-100",
    trackSlug: "jamf-100",
    title: "Quiz — Jamf 100",
    type: "quiz",
    description: "Évalue ta maîtrise des fondamentaux Jamf Pro.",
    duration: "20 min",
    passingScore: 75,
    questions: [
      {
        id: "j100-1",
        text: "Qu'est-ce qu'un Smart Group dans Jamf Pro ?",
        options: [
          "Un groupe d'utilisateurs LDAP",
          "Un groupe dynamique basé sur des critères d'inventaire",
          "Un groupe de policies uniquement",
          "Un groupe de sites géographiques",
        ],
        correctIndex: 1,
        explanation: "Les Smart Groups se mettent à jour automatiquement selon les critères définis (OS, apps, attributs, etc.).",
      },
      {
        id: "j100-2",
        text: "Où configure-t-on le scope d'une policy Jamf ?",
        options: ["Dans les Extension Attributes", "Dans l'onglet Scope de la policy", "Dans les Computer PreStage", "Dans Jamf Connect"],
        correctIndex: 1,
        explanation: "L'onglet Scope permet de cibler les ordinateurs, utilisateurs ou groupes concernés par la policy.",
      },
      {
        id: "j100-3",
        text: "Un Configuration Profile Jamf est :",
        options: [
          "Un script shell",
          "Un ensemble de payloads de configuration MDM",
          "Un rapport d'inventaire",
          "Un certificat APNs",
        ],
        correctIndex: 1,
        explanation: "Les Configuration Profiles contiennent un ou plusieurs payloads (Wi‑Fi, restrictions, certificats, etc.).",
      },
      {
        id: "j100-4",
        text: "Jamf Pro communique avec les appareils via :",
        options: ["SSH uniquement", "Apple Push Notification service (APNs)", "Email", "Bonjour"],
        correctIndex: 1,
        explanation: "Jamf Pro utilise APNs pour envoyer les commandes MDM aux appareils managés.",
      },
      {
        id: "j100-5",
        text: "Le Computer PreStage Enrollment sert à :",
        options: [
          "Sauvegarder les Mac",
          "Automatiser l'enrollment DEP avec configuration initiale",
          "Gérer les licences Microsoft",
          "Créer des comptes utilisateur locaux",
        ],
        correctIndex: 1,
        explanation: "PreStage Enrollment configure automatiquement les Mac DEP à la première activation.",
      },
    ],
  },
  {
    slug: "examen-apple-device-support",
    trackSlug: "apple-device-support",
    title: "Examen blanc — Apple Device Support",
    type: "examen",
    description: "Simulation complète de l'examen Apple Device Support : 10 questions, conditions réelles.",
    duration: "120 min",
    passingScore: 80,
    questions: [
      {
        id: "ads-1",
        text: "Quel outil macOS permet de consulter les logs système en temps réel ?",
        options: ["Activity Monitor", "Console", "Disk Utility", "Keychain Access"],
        correctIndex: 1,
        explanation: "L'app Console affiche les logs système, crash reports et messages de diagnostic.",
      },
      {
        id: "ads-2",
        text: "En mode Recovery, quelle option permet de réinstaller macOS sans effacer les données ?",
        options: ["Disk Utility > Erase", "Reinstall macOS", "Terminal > resetpassword", "Startup Security Utility"],
        correctIndex: 1,
        explanation: "Reinstall macOS dans Recovery réinstalle le système tout en préservant les fichiers utilisateur.",
      },
      {
        id: "ads-3",
        text: "802.1X sur macOS est configuré principalement dans :",
        options: ["Réglages Système > Réseau > Avancé > 802.1X", "Terminal uniquement", "Keychain Access", "Profile Manager"],
        correctIndex: 0,
        explanation: "La configuration 802.1X se fait dans les paramètres réseau avancés ou via un profil MDM.",
      },
      {
        id: "ads-4",
        text: "Time Machine stocke les sauvegardes sur :",
        options: ["iCloud Drive uniquement", "Un volume de destination dédié", "La partition Recovery", "Le Secure Enclave"],
        correctIndex: 1,
        explanation: "Time Machine nécessite un disque externe, un NAS compatible ou un Mac partagé comme destination.",
      },
      {
        id: "ads-5",
        text: "Pour réinitialiser le mot de passe d'un compte local sans admin, on utilise :",
        options: ["Mode Recovery > Terminal > resetpassword", "FileVault", "Gatekeeper", "APNs"],
        correctIndex: 0,
        explanation: "La commande resetpassword en Recovery permet de réinitialiser les mots de passe locaux.",
      },
      {
        id: "ads-6",
        text: "SMC reset est pertinent pour résoudre :",
        options: ["Problèmes de batterie, ventilateurs, alimentation", "Erreurs de code signing", "Problèmes iCloud", "Erreurs DEP"],
        correctIndex: 0,
        explanation: "La réinitialisation SMC (System Management Controller) corrige les problèmes liés à l'alimentation et au hardware.",
      },
      {
        id: "ads-7",
        text: "NVRAM/PRAM reset efface :",
        options: ["Toutes les données utilisateur", "Certains paramètres système (son, résolution, disque de démarrage)", "Les certificats MDM", "Les apps installées"],
        correctIndex: 1,
        explanation: "NVRAM stocke des paramètres comme le volume de démarrage, la résolution et les réglages son.",
      },
      {
        id: "ads-8",
        text: "Single Sign-On (SSO) sur macOS utilise typiquement :",
        options: ["Kerberos et profils de configuration", "FileVault uniquement", "Gatekeeper", "Bonjour"],
        correctIndex: 0,
        explanation: "SSO macOS s'appuie sur Kerberos et des profils de configuration pour l'authentification réseau.",
      },
      {
        id: "ads-9",
        text: "Safe Mode démarre macOS avec :",
        options: ["Tous les services réseau activés", "Extensions tierces minimales pour diagnostic", "FileVault désactivé", "Root activé"],
        correctIndex: 1,
        explanation: "Safe Mode charge uniquement les extensions Apple essentielles pour isoler les problèmes logiciels.",
      },
      {
        id: "ads-10",
        text: "Pour vérifier l'intégrité du disque de démarrage, on utilise :",
        options: ["Disk Utility > First Aid", "Console", "Activity Monitor", "Keychain Access"],
        correctIndex: 0,
        explanation: "First Aid dans Utilitaire de disque vérifie et répare les erreurs du système de fichiers.",
      },
    ],
  },
  {
    slug: "examen-jamf-200",
    trackSlug: "jamf-200",
    title: "Examen blanc — Jamf 200",
    type: "examen",
    description: "150 questions aléatoires — simulation expert Jamf Pro : scripts, Patch Management, Protect et sécurité.",
    duration: "180 min",
    durationMinutes: 180,
    passingScore: 75,
    examMode: true,
    examQuestionCount: 150,
    questions: examPools["examen-jamf-200"].slice(0, 5),
  },
  {
    slug: "quiz-intune-mac",
    trackSlug: "intune-mac",
    title: "Quiz — Intune pour Mac",
    type: "quiz",
    description: "Teste tes connaissances sur la gestion Apple avec Microsoft Intune.",
    duration: "15 min",
    passingScore: 70,
    questions: [
      {
        id: "int-1",
        text: "Pour lier Apple Business Manager à Intune, il faut :",
        options: [
          "Un certificat APNs Apple MDM Push",
          "Un token de location ABM uploadé dans Intune",
          "Un compte Azure AD Premium P2 uniquement",
          "Un profil Wi‑Fi",
        ],
        correctIndex: 1,
        explanation: "Le token de location ABM (Apple Business Manager) est uploadé dans le portail Intune pour synchroniser les appareils.",
      },
      {
        id: "int-2",
        text: "Conditional Access sur appareils Apple vérifie typiquement :",
        options: [
          "La conformité de l'appareil avant d'autoriser l'accès aux ressources",
          "Le numéro de série uniquement",
          "La version du navigateur Safari",
          "Le modèle de processeur uniquement",
        ],
        correctIndex: 0,
        explanation: "Conditional Access bloque l'accès si l'appareil n'est pas conforme aux policies Intune définies.",
      },
      {
        id: "int-3",
        text: "Le mode supervisé iOS/macOS permet :",
        options: [
          "Des commandes MDM avancées (silent install, restrictions renforcées)",
          "Le jailbreak",
          "La désactivation de FileVault",
          "L'accès root automatique",
        ],
        correctIndex: 0,
        explanation: "La supervision débloque des capacités MDM avancées comme l'installation silencieuse et les restrictions renforcées.",
      },
      {
        id: "int-4",
        text: "Les scripts macOS dans Intune s'exécutent :",
        options: [
          "Uniquement en mode admin interactif",
          "En arrière-plan via l'agent Intune MDM",
          "Via SSH externe",
          "Dans le portail Azure",
        ],
        correctIndex: 1,
        explanation: "Intune déploie et exécute les scripts shell sur les Mac managés via le canal MDM.",
      },
      {
        id: "int-5",
        text: "Une Compliance Policy Intune pour macOS peut vérifier :",
        options: [
          "Version OS minimale, FileVault, firewall",
          "Uniquement la langue du système",
          "Le wallpaper",
          "Le nom du compte iCloud",
        ],
        correctIndex: 0,
        explanation: "Les compliance policies vérifient l'état de sécurité : OS, chiffrement, jailbreak, etc.",
      },
    ],
  },
  {
    slug: "examen-apple-it-pro",
    trackSlug: "apple-it-professional",
    title: "Examen blanc — Apple Certified IT Professional",
    type: "examen",
    description:
      "Simulation complète 100 questions aléatoires : ABM, ADE, MDM, sécurité macOS, profils et déploiement entreprise.",
    duration: "120 min",
    durationMinutes: 120,
    passingScore: 80,
    examMode: true,
    examQuestionCount: 100,
    questions: examPools["examen-apple-it-pro"].slice(0, 5),
  },
  {
    slug: "examen-jamf-100-blanc",
    trackSlug: "jamf-100",
    title: "Examen blanc — Jamf 100",
    type: "examen",
    description:
      "100 questions aléatoires sur Jamf Pro : Smart Groups, policies, profils, enrollment et Self Service.",
    duration: "120 min",
    durationMinutes: 120,
    passingScore: 75,
    examMode: true,
    examQuestionCount: 100,
    questions: examPools["examen-jamf-100-blanc"].slice(0, 5),
  },
  {
    slug: "examen-intune-apple",
    trackSlug: "intune-mac",
    title: "Examen blanc — Microsoft Intune Apple Devices",
    type: "examen",
    description:
      "100 questions aléatoires : ABM, ADE, APNs, compliance, Platform SSO et déploiement Apple via Intune.",
    duration: "120 min",
    durationMinutes: 120,
    passingScore: 80,
    examMode: true,
    examQuestionCount: 100,
    questions: examPools["examen-intune-apple"].slice(0, 5),
  },
  {
    slug: "examen-jamf-300",
    trackSlug: "jamf-300",
    title: "Examen blanc — Jamf 300 Prep",
    type: "examen",
    description: "125 questions aléatoires — architecture avancée, API, webhooks, patch et dépannage Jamf Pro.",
    duration: "150 min",
    durationMinutes: 150,
    passingScore: 75,
    examMode: true,
    examQuestionCount: 125,
    questions: examPools["examen-jamf-300"].slice(0, 5),
  },
  {
    slug: "examen-jamf-400",
    trackSlug: "jamf-400",
    title: "Examen blanc — Jamf 400 Prep",
    type: "examen",
    description: "150 questions — automatisation, CI/CD, migration, sécurité macOS et projet architecte.",
    duration: "180 min",
    durationMinutes: 180,
    passingScore: 75,
    examMode: true,
    examQuestionCount: 150,
    questions: examPools["examen-jamf-400"].slice(0, 5),
  },
  {
    slug: "examen-apple-enterprise-expert",
    trackSlug: "apple-enterprise-expert",
    title: "Examen blanc — Apple Enterprise Expert",
    type: "examen",
    description: "100 questions — Platform Deployment, DDM, MDA, Platform SSO et compliance Apple.",
    duration: "120 min",
    durationMinutes: 120,
    passingScore: 80,
    examMode: true,
    examQuestionCount: 100,
    questions: examPools["examen-apple-enterprise-expert"].slice(0, 5),
  },
  {
    slug: "examen-intune-apple-advanced",
    trackSlug: "intune-apple-advanced",
    title: "Examen blanc — Intune Apple Advanced",
    type: "examen",
    description: "100 questions — Conditional Access, Defender, SCEP, VPN, Platform SSO et troubleshooting.",
    duration: "120 min",
    durationMinutes: 120,
    passingScore: 80,
    examMode: true,
    examQuestionCount: 100,
    questions: examPools["examen-intune-apple-advanced"].slice(0, 5),
  },
  ...proModuleQuizzes,
  ...advancedModuleQuizzes,
  ...altMdmModuleQuizzes,
  {
    slug: "examen-kandji-fundamentals",
    trackSlug: "kandji-fundamentals",
    title: "Examen — Kandji Fundamentals",
    type: "examen",
    description: "75 questions — Blueprints, Library Items, Liftoff, EDR et compliance Kandji.",
    duration: "90 min",
    durationMinutes: 90,
    passingScore: 75,
    examMode: true,
    examQuestionCount: 75,
    questions: examPools["examen-kandji-fundamentals"].slice(0, 5),
  },
  {
    slug: "examen-mosyle-fundamentals",
    trackSlug: "mosyle-fundamentals",
    title: "Examen — Mosyle Fundamentals",
    type: "examen",
    description: "75 questions — Enrollment, profils, Mosyle Auth, Fuse et reporting.",
    duration: "90 min",
    durationMinutes: 90,
    passingScore: 75,
    examMode: true,
    examQuestionCount: 75,
    questions: examPools["examen-mosyle-fundamentals"].slice(0, 5),
  },
  {
    slug: "examen-addigy-fundamentals",
    trackSlug: "addigy-fundamentals",
    title: "Examen — Addigy Fundamentals",
    type: "examen",
    description: "75 questions — GoLive, policies, Smart Software, compliance et dépannage.",
    duration: "90 min",
    durationMinutes: 90,
    passingScore: 75,
    examMode: true,
    examQuestionCount: 75,
    questions: examPools["examen-addigy-fundamentals"].slice(0, 5),
  },
  {
    slug: "examen-workspace-one-apple",
    trackSlug: "workspace-one-apple",
    title: "Examen — Workspace ONE Apple Management",
    type: "examen",
    description: "75 questions — Enrollment Apple, profils, compliance, Conditional Access et reporting.",
    duration: "90 min",
    durationMinutes: 90,
    passingScore: 75,
    examMode: true,
    examQuestionCount: 75,
    questions: examPools["examen-workspace-one-apple"].slice(0, 5),
  },
];

export const quizzes: Quiz[] = rawQuizzesBeforePrepare.map(prepareQuiz);

export function getQuiz(slug: string) {
  return quizzes.find((q) => q.slug === slug);
}

export function getExamPool(slug: string) {
  const pool = examPools[slug];
  return pool ? prepareExamPool(pool) : null;
}

export function getExamQuestionCount(slug: string) {
  return examQuestionCounts[slug] ?? null;
}

export function getQuizzesByTrack(trackSlug: string) {
  return quizzes.filter((q) => q.trackSlug === trackSlug);
}

export function getExams() {
  return quizzes.filter((q) => q.type === "examen");
}

export function getQuizList() {
  return quizzes.filter((q) => q.type === "quiz");
}
