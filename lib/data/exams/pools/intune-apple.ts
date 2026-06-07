import type { Question } from "@/lib/types";
import { intuneLearnExamQuestions } from "@/lib/data/intune/quiz-learn-questions";

export const intuneApplePool: Question[] = [
  {
    id: "ia-1",
    text: "Pour synchroniser les appareils ADE dans Intune, il faut d'abord :",
    options: [
      "Créer un profil Wi‑Fi",
      "Importer le token ABM dans Intune",
      "Installer Company Portal sur chaque Mac manuellement",
      "Configurer Azure AD Connect uniquement",
    ],
    correctIndex: 1,
    explanation: "Le token de location Apple Business Manager doit être uploadé dans Intune pour synchroniser l'inventaire ADE.",
  },
  {
    id: "ia-2",
    text: "Une Compliance Policy Intune pour macOS peut exiger :",
    options: [
      "FileVault activé et version OS minimale",
      "Un wallpaper spécifique uniquement",
      "Le nom du compte iCloud",
      "La langue du clavier",
    ],
    correctIndex: 0,
    explanation: "Les compliance policies vérifient l'état de sécurité : chiffrement, version OS, jailbreak, etc.",
  },
  {
    id: "ia-3",
    text: "Platform SSO sur macOS permet :",
    options: [
      "La connexion sans mot de passe aux apps avec identité Entra",
      "Le jailbreak supervisé",
      "La désactivation de FileVault",
      "L'accès root automatique",
    ],
    correctIndex: 0,
    explanation: "Platform SSO utilise une extension système pour authentifier l'utilisateur Entra ID sur macOS.",
  },
  {
    id: "ia-4",
    text: "Le certificat APNs Apple MDM Push sert à :",
    options: [
      "Chiffrer FileVault",
      "Envoyer les commandes MDM aux appareils via Apple Push Notification service",
      "Signer les apps VPP",
      "Authentifier les utilisateurs Kerberos",
    ],
    correctIndex: 1,
    explanation: "APNs est le canal push utilisé par Intune et tout MDM Apple pour contacter les appareils.",
  },
  {
    id: "ia-5",
    text: "Conditional Access avec Intune vérifie typiquement :",
    options: [
      "La conformité de l'appareil avant d'autoriser l'accès aux ressources",
      "La couleur du MacBook",
      "Le numéro IMEI uniquement pour macOS",
      "Le modèle de clavier",
    ],
    correctIndex: 0,
    explanation: "CA bloque l'accès si l'appareil n'est pas compliant aux policies Intune.",
  },
  {
    id: "ia-6",
    text: "Apps & Books (VPP) dans ABM permet :",
    options: [
      "D'acheter et assigner des licences d'apps aux utilisateurs ou appareils",
      "De jailbreaker les iPhone",
      "De créer des comptes locaux macOS",
      "De désactiver Gatekeeper",
    ],
    correctIndex: 0,
    explanation: "VPP/Apps & Books gère l'achat et la distribution de licences applicatives.",
  },
  {
    id: "ia-7",
    text: "Le mode supervisé sur iOS/macOS est requis pour :",
    options: [
      "Certaines commandes MDM avancées (silent install, restrictions renforcées)",
      "Utiliser iCloud personnel",
      "Désactiver le chiffrement",
      "Accéder au App Store sans compte",
    ],
    correctIndex: 0,
    explanation: "La supervision débloque des capacités MDM avancées indisponibles en enrollment standard.",
  },
  {
    id: "ia-8",
    text: "Managed Apple ID en entreprise est géré via :",
    options: [
      "Apple Business Manager ou Apple School Manager",
      "Le App Store personnel uniquement",
      "Jamf Connect uniquement",
      "Terminal macOS",
    ],
    correctIndex: 0,
    explanation: "Les Managed Apple ID sont créés et administrés par l'organisation dans ABM/ASM.",
  },
  {
    id: "ia-9",
    text: "Pour déployer un profil macOS dans Intune, on utilise :",
    options: [
      "Devices → Configuration profiles → macOS",
      "Users → Licenses",
      "Groups → Security",
      "Tenant → Branding",
    ],
    correctIndex: 0,
    explanation: "Les configuration profiles macOS se créent dans le blade Devices d'Intune.",
  },
  {
    id: "ia-10",
    text: "L'escrow FileVault dans Intune permet :",
    options: [
      "À l'admin IT de récupérer la clé de récupération FileVault",
      "De désactiver SIP",
      "De bypasser Gatekeeper",
      "De supprimer le compte admin local",
    ],
    correctIndex: 0,
    explanation: "L'escrow stocke la clé de récupération FileVault dans la console MDM pour support IT.",
  },
  ...intuneLearnExamQuestions,
];
