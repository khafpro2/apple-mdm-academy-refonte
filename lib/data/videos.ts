import type { AcademyVideo, HeyGenConfig } from "@/lib/types";

function heygen(
  script: string,
  overrides: Partial<HeyGenConfig> = {}
): HeyGenConfig {
  return {
    script,
    language: "fr-FR",
    avatarId: overrides.avatarId ?? "presenter-apple-mdm",
    voiceId: overrides.voiceId ?? "fr-professional-male",
    durationEstimate: overrides.durationEstimate,
    status: overrides.status ?? "draft",
    videoUrl: overrides.videoUrl,
    sessionUrl: overrides.sessionUrl,
  };
}

export const academyVideos: AcademyVideo[] = [
  {
    slug: "abm-vers-intune",
    title: "Lier Apple Business Manager à Microsoft Intune",
    description:
      "Découvrez le flux complet : serveur MDM dans ABM, token .p7m, import Intune et synchronisation ADE.",
    duration: "12 min",
    durationSeconds: 720,
    moduleSlug: "module-11-intune-apple",
    moduleTitle: "Microsoft Intune pour appareils Apple",
    lessonSlug: "m11-abm-intune",
    courseSlug: "parcours-professionnel",
    trackSlug: "intune-mac",
    animationSlug: "abm-intune",
    popular: true,
    tags: ["ABM", "Intune", "ADE"],
    heygen: heygen(
      "Bonjour et bienvenue. Dans cette vidéo, nous allons lier Apple Business Manager à Microsoft Intune. Étape un : créez un serveur MDM dans ABM. Étape deux : téléchargez le token server_token.p7m. Étape trois : importez-le dans Intune sous Devices, Enrollment, Apple. Étape quatre : synchronisez les appareils ADE assignés.",
      { durationEstimate: "12 min", status: "draft" }
    ),
    chapters: [
      { id: "c1", title: "Introduction ABM + Intune", startSeconds: 0 },
      { id: "c2", title: "Créer le serveur MDM", startSeconds: 120 },
      { id: "c3", title: "Importer le token", startSeconds: 300 },
      { id: "c4", title: "Synchronisation ADE", startSeconds: 540 },
    ],
    resources: [
      { slug: "abm-intune-checklist", title: "Checklist ABM + Intune", type: "checklist", description: "Étapes de configuration", href: "/resources/checklists/abm-intune.md", fileSize: "4 Ko" },
      { slug: "ade-token-guide", title: "Guide token ADE", type: "pdf", description: "Fiche PDF récapitulative", href: "/resources/pdf/abm-intune-guide.pdf", fileSize: "120 Ko" },
    ],
    quizSlug: "quiz-module-11-intune-apple",
  },
  {
    slug: "ade-enrollment-automatique",
    title: "Automated Device Enrollment (ADE)",
    description: "Enrollment automatique iPhone et Mac via ABM : supervision, profils et Setup Assistant.",
    duration: "10 min",
    durationSeconds: 600,
    moduleSlug: "module-11-intune-apple",
    moduleTitle: "Microsoft Intune pour appareils Apple",
    lessonSlug: "m11-ade-sync",
    courseSlug: "intune-mac",
    trackSlug: "intune-mac",
    animationSlug: "ade-enrollment",
    popular: true,
    tags: ["ADE", "DEP", "Supervision"],
    heygen: heygen(
      "L'Automated Device Enrollment permet d'enrôler automatiquement les appareils Apple au Setup Assistant. Assignez les appareils au serveur MDM dans ABM, configurez le profil d'enrollment dans Intune, et les utilisateurs verront Remote Management dès la première activation.",
      { durationEstimate: "10 min" }
    ),
    chapters: [
      { id: "c1", title: "Principe ADE", startSeconds: 0 },
      { id: "c2", title: "Assignation ABM", startSeconds: 150 },
      { id: "c3", title: "Profil enrollment Intune", startSeconds: 330 },
      { id: "c4", title: "Activation utilisateur", startSeconds: 480 },
    ],
    resources: [
      { slug: "ade-checklist", title: "Checklist ADE", type: "checklist", description: "Déploiement iPhone et Mac", href: "/resources/checklists/ade-enrollment.md" },
    ],
    quizSlug: "quiz-intune-mac",
  },
  {
    slug: "certificats-apns",
    title: "Certificats APNs pour MDM",
    description: "Création, renouvellement et dépannage des certificats Apple Push Notification pour Intune et Jamf.",
    duration: "8 min",
    durationSeconds: 480,
    moduleSlug: "module-11-intune-apple",
    moduleTitle: "Microsoft Intune pour appareils Apple",
    lessonSlug: "m11-apns-intune",
    courseSlug: "intune-mac",
    trackSlug: "intune-mac",
    animationSlug: "apns-push",
    tags: ["APNs", "Push", "Certificats"],
    heygen: heygen(
      "Le certificat APNs est obligatoire pour que votre serveur MDM envoie des commandes push aux appareils Apple. Générez une CSR dans Intune ou Jamf, uploadez-la sur identity.apple.com/pushcert, téléchargez le certificat .pem et importez-le. Renouvelez avant expiration.",
      { durationEstimate: "8 min" }
    ),
    chapters: [
      { id: "c1", title: "Rôle d'APNs", startSeconds: 0 },
      { id: "c2", title: "Génération CSR", startSeconds: 120 },
      { id: "c3", title: "Portail Apple Push", startSeconds: 240 },
      { id: "c4", title: "Renouvellement", startSeconds: 390 },
    ],
    resources: [
      { slug: "apns-terminal", title: "Commandes vérification APNs", type: "terminal", description: "openssl et logs MDM", href: "/resources/terminal/apns-verify.sh" },
    ],
    quizSlug: "quiz-module-11-intune-apple",
  },
  {
    slug: "apps-books-vpp",
    title: "Apps & Books (VPP) dans ABM",
    description: "Achat de licences, synchronisation et déploiement d'applications via Apps & Books.",
    duration: "9 min",
    durationSeconds: 540,
    moduleSlug: "module-11-intune-apple",
    moduleTitle: "Microsoft Intune pour appareils Apple",
    lessonSlug: "vpp-apps-books",
    courseSlug: "intune-mac",
    trackSlug: "intune-mac",
    animationSlug: "apps-books",
    tags: ["VPP", "Apps & Books"],
    heygen: heygen(
      "Apps & Books remplace le Volume Purchase Program. Achetez des licences dans ABM, synchronisez le token VPP dans Intune ou Jamf, assignez les apps aux utilisateurs ou appareils, et déployez silencieusement sur appareils supervisés.",
      { durationEstimate: "9 min" }
    ),
    chapters: [
      { id: "c1", title: "Apps & Books overview", startSeconds: 0 },
      { id: "c2", title: "Token VPP", startSeconds: 180 },
      { id: "c3", title: "Assignation licences", startSeconds: 360 },
    ],
    resources: [
      { slug: "vpp-checklist", title: "Checklist VPP", type: "checklist", description: "Teams, Outlook, apps métier", href: "/resources/checklists/vpp-deployment.md" },
    ],
    quizSlug: "quiz-intune-mac",
  },
  {
    slug: "platform-sso-macos",
    title: "Platform SSO sur macOS",
    description: "Configuration Platform SSO avec Entra ID : extension, profil Intune et expérience utilisateur.",
    duration: "11 min",
    durationSeconds: 660,
    moduleSlug: "module-11-intune-apple",
    moduleTitle: "Microsoft Intune pour appareils Apple",
    lessonSlug: "platform-sso",
    courseSlug: "intune-mac",
    trackSlug: "intune-mac",
    animationSlug: "platform-sso",
    popular: true,
    tags: ["Platform SSO", "Entra ID", "macOS"],
    heygen: heygen(
      "Platform SSO modernise l'authentification macOS avec Microsoft Entra ID. Déployez l'extension Platform SSO via un profil de configuration Intune, enregistrez l'utilisateur au premier login, et bénéficiez du SSO sans mot de passe pour les apps Microsoft et Safari.",
      { durationEstimate: "11 min" }
    ),
    chapters: [
      { id: "c1", title: "Architecture PSSO", startSeconds: 0 },
      { id: "c2", title: "Profil Intune", startSeconds: 200 },
      { id: "c3", title: "Enrollment utilisateur", startSeconds: 420 },
      { id: "c4", title: "MFA et CA", startSeconds: 540 },
    ],
    resources: [
      { slug: "psso-config", title: "Modèle profil Platform SSO", type: "config", description: "Payload XML de référence", href: "/resources/config/platform-sso-template.mobileconfig" },
    ],
    quizSlug: "quiz-intune-mac",
  },
  {
    slug: "jamf-policies-deploiement",
    title: "Policies Jamf Pro — Déploiement d'applications",
    description: "Triggers, scope, fréquence et exclusions pour déployer une app via Policy Jamf.",
    duration: "10 min",
    durationSeconds: 600,
    moduleSlug: "module-14-policies",
    moduleTitle: "Policies Jamf Pro",
    lessonSlug: "m14-policy-execution",
    courseSlug: "parcours-professionnel",
    trackSlug: "jamf-100",
    animationSlug: "jamf-policies",
    tags: ["Jamf", "Policies"],
    heygen: heygen(
      "Une Policy Jamf Pro exécute des actions sur les Mac ciblés. Choisissez le trigger : enrollment complete, recurring check-in, ou Self Service. Définissez le scope via Smart Groups, configurez la fréquence et les exclusions, puis déployez votre package ou script.",
      { durationEstimate: "10 min" }
    ),
    chapters: [
      { id: "c1", title: "Anatomie d'une Policy", startSeconds: 0 },
      { id: "c2", title: "Triggers", startSeconds: 150 },
      { id: "c3", title: "Scope et exclusions", startSeconds: 330 },
      { id: "c4", title: "Déploiement app", startSeconds: 450 },
    ],
    resources: [
      { slug: "jamf-policy-script", title: "Script policy exemple", type: "script", description: "install_application.sh", href: "/resources/scripts/jamf-install-app.sh" },
    ],
    quizSlug: "quiz-module-14-policies",
  },
  {
    slug: "filevault-escrow-mdm",
    title: "FileVault et escrow MDM",
    description: "Activer FileVault via MDM, escrow des clés de récupération et conformité Intune/Jamf.",
    duration: "9 min",
    durationSeconds: 540,
    moduleSlug: "module-18-security",
    moduleTitle: "Apple Security & Compliance",
    lessonSlug: "m18-filevault",
    courseSlug: "parcours-professionnel",
    trackSlug: "apple-it-professional",
    animationSlug: "filevault",
    tags: ["FileVault", "Sécurité", "macOS"],
    heygen: heygen(
      "FileVault 2 chiffre le volume de démarrage macOS. Déployez un profil MDM avec FileVault activé et escrow des clés vers Intune ou Jamf. Vérifiez la conformité et récupérez les clés depuis la console admin en cas de support.",
      { durationEstimate: "9 min" }
    ),
    chapters: [
      { id: "c1", title: "FileVault 2", startSeconds: 0 },
      { id: "c2", title: "Profil MDM", startSeconds: 180 },
      { id: "c3", title: "Escrow clés", startSeconds: 360 },
    ],
    resources: [
      { slug: "filevault-terminal", title: "Commandes FileVault", type: "terminal", description: "fdesetup et vérification", href: "/resources/terminal/filevault-status.sh" },
      { slug: "filevault-checklist", title: "Checklist FileVault enterprise", type: "checklist", description: "Déploiement et recovery", href: "/resources/checklists/filevault-enterprise.md" },
    ],
    quizSlug: "quiz-module-18-security",
  },
];

export function getVideo(slug: string): AcademyVideo | undefined {
  return academyVideos.find((v) => v.slug === slug);
}

export function getVideosByTrack(trackSlug: string): AcademyVideo[] {
  return academyVideos.filter((v) => v.trackSlug === trackSlug);
}

export function getPopularVideos(): AcademyVideo[] {
  return academyVideos.filter((v) => v.popular);
}

export function getVideoSlugs(): string[] {
  return academyVideos.map((v) => v.slug);
}
