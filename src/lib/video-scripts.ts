export type VideoLevel = "Débutant" | "Intermédiaire" | "Fondamental" | "Avancé";

export type HeyGenVideoDefaults = {
  avatar: string;
  voice: string;
  language: string;
  format: string;
  style: string;
};

export const HEYGEN_VIDEO_DEFAULTS: HeyGenVideoDefaults = {
  avatar: "Professional IT Instructor",
  voice: "French professional male voice",
  language: "fr-FR",
  format: "16:9",
  style: "Apple Training Premium",
};

export type VideoScript = {
  slug: string;
  title: string;
  duration: string;
  durationSeconds: number;
  module: string;
  level: VideoLevel;
  heygenAvatar: string;
  language: string;
  script: string;
  relatedCourseSlug: string;
  relatedLabSlug: string;
  /** Première phrase du script — affichage carte */
  description?: string;
  popular?: boolean;
};

function parseDurationMinutes(duration: string): number {
  const match = duration.match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) * 60 : 600;
}

function script(
  entry: Omit<VideoScript, "durationSeconds" | "heygenAvatar" | "language" | "description"> & {
    heygenAvatar?: string;
    language?: string;
  }
): VideoScript {
  const fullScript = entry.script.trim();
  const firstSentence = fullScript.split(/(?<=[.!?])\s+/)[0] ?? fullScript;
  return {
    ...entry,
    heygenAvatar: entry.heygenAvatar ?? HEYGEN_VIDEO_DEFAULTS.avatar,
    language: entry.language ?? HEYGEN_VIDEO_DEFAULTS.language,
    durationSeconds: parseDurationMinutes(entry.duration),
    description: firstSentence,
  };
}

export const videoScripts: VideoScript[] = [
  script({
    slug: "bienvenue-apple-mdm-academy",
    title: "Bienvenue dans Apple MDM Academy",
    duration: "5 min",
    module: "Introduction",
    level: "Débutant",
    relatedCourseSlug: "apple-fundamentals",
    relatedLabSlug: "jamf-discovery",
    popular: true,
    script: `Bonjour et bienvenue dans Apple MDM Academy.
Dans cette formation, vous allez apprendre à administrer les appareils Apple en entreprise avec Apple Business Manager, Microsoft Intune et Jamf Pro.
L'objectif est de vous préparer aux certifications Apple Certified IT Professional, Apple Deployment and Management, Jamf 100 et Jamf 200.
Chaque module contient un cours, un quiz, un laboratoire pratique et une validation de progression.
À la fin du parcours, vous serez capable de déployer, sécuriser et administrer une flotte Apple professionnelle.`,
  }),
  script({
    slug: "apple-business-manager",
    title: "Comprendre Apple Business Manager",
    duration: "12 min",
    module: "Apple Business Manager",
    level: "Débutant",
    relatedCourseSlug: "apple-it-professional",
    relatedLabSlug: "abm-intune",
    popular: true,
    script: `Apple Business Manager est le point de départ d'un déploiement Apple moderne.
Il permet de gérer les appareils, les utilisateurs, les licences applicatives et les serveurs MDM.
Les appareils achetés auprès de revendeurs agréés peuvent apparaître automatiquement dans l'inventaire.
L'administrateur peut ensuite les affecter à Intune ou Jamf Pro.
Apple Business Manager permet aussi de gérer Apps and Books, les Managed Apple IDs et la fédération Microsoft Entra ID.`,
  }),
  script({
    slug: "abm-intune",
    title: "Lier Apple Business Manager à Microsoft Intune",
    duration: "15 min",
    module: "ABM + Intune",
    level: "Intermédiaire",
    relatedCourseSlug: "intune-mac",
    relatedLabSlug: "abm-intune",
    popular: true,
    script: `Dans cette leçon, nous allons connecter Apple Business Manager à Microsoft Intune.
Cette intégration permet d'automatiser le déploiement des iPhone, iPad et Mac.
La première étape consiste à créer ou vérifier le certificat APNs.
Ensuite, nous créons un serveur MDM dans Apple Business Manager.
Nous téléchargeons le fichier server_token.p7m, puis nous l'importons dans Intune.
Une fois la synchronisation terminée, les appareils Apple deviennent visibles dans Intune.`,
  }),
  script({
    slug: "automated-device-enrollment",
    title: "Automated Device Enrollment",
    duration: "15 min",
    module: "ADE",
    level: "Intermédiaire",
    relatedCourseSlug: "intune-mac",
    relatedLabSlug: "ade-iphone",
    popular: true,
    script: `Automated Device Enrollment, ou ADE, permet de déployer des appareils Apple sans intervention manuelle.
Lorsqu'un utilisateur démarre un iPhone ou un Mac, l'appareil contacte les serveurs Apple.
Apple détecte l'affectation au serveur MDM et télécharge automatiquement le profil de gestion.
L'appareil devient supervisé et reçoit ses profils, applications et paramètres de sécurité.
Cette approche est appelée Zero Touch Deployment.`,
  }),
  script({
    slug: "apns",
    title: "Comprendre APNs",
    duration: "10 min",
    module: "APNs",
    level: "Fondamental",
    relatedCourseSlug: "apple-it-professional",
    relatedLabSlug: "apns",
    script: `Apple Push Notification service, ou APNs, est essentiel au fonctionnement du MDM.
Lorsqu'un administrateur envoie une commande depuis Intune ou Jamf, APNs réveille l'appareil.
L'appareil contacte ensuite son serveur MDM pour exécuter l'action.
Sans APNs, aucune commande distante, aucun inventaire et aucune installation applicative ne peuvent fonctionner correctement.
Il faut donc surveiller et renouveler le certificat APNs avant expiration.`,
  }),
  script({
    slug: "apps-books",
    title: "Apps and Books",
    duration: "10 min",
    module: "Apps & Books",
    level: "Fondamental",
    relatedCourseSlug: "apple-it-professional",
    relatedLabSlug: "apps-books",
    script: `Apps and Books permet de distribuer des applications Apple à grande échelle.
Les licences peuvent être achetées en volume puis synchronisées vers Intune ou Jamf.
Les applications peuvent être attribuées à des utilisateurs ou directement à des appareils.
Cette méthode évite l'utilisation d'Apple ID personnels.
Elle simplifie la gestion des licences et permet de récupérer une licence quand un collaborateur quitte l'entreprise.`,
  }),
  script({
    slug: "managed-apple-ids",
    title: "Managed Apple IDs",
    duration: "12 min",
    module: "Managed Apple IDs",
    level: "Intermédiaire",
    relatedCourseSlug: "apple-it-professional",
    relatedLabSlug: "managed-apple-ids",
    script: `Les Managed Apple IDs sont des identifiants Apple appartenant à l'organisation.
Ils sont créés et administrés depuis Apple Business Manager ou Apple School Manager.
Ils permettent l'authentification professionnelle, la gestion centralisée et l'intégration avec Microsoft Entra ID.
Contrairement aux Apple ID personnels, ils restent sous le contrôle de l'entreprise.
Ils sont importants pour les environnements modernes Apple Enterprise.`,
  }),
  script({
    slug: "platform-sso",
    title: "Platform SSO",
    duration: "15 min",
    module: "Platform SSO",
    level: "Avancé",
    relatedCourseSlug: "intune-mac",
    relatedLabSlug: "platform-sso",
    popular: true,
    script: `Platform SSO est une fonctionnalité moderne de macOS.
Elle permet d'utiliser l'identité Microsoft Entra ID pour ouvrir une session sur Mac.
L'utilisateur bénéficie d'une authentification unifiée et d'une meilleure expérience.
Le mot de passe peut être synchronisé automatiquement.
Platform SSO améliore la sécurité tout en simplifiant l'administration des comptes macOS.`,
  }),
  script({
    slug: "jamf-pro-fundamentals",
    title: "Jamf Pro Fundamentals",
    duration: "15 min",
    module: "Jamf Pro",
    level: "Débutant",
    relatedCourseSlug: "jamf-100",
    relatedLabSlug: "jamf-discovery",
    popular: true,
    script: `Jamf Pro est l'une des solutions les plus utilisées pour gérer les appareils Apple en entreprise.
Elle permet l'inventaire, l'enrôlement, le déploiement d'applications, les profils de configuration, les scripts, les politiques et le Self Service.
Dans ce module, nous découvrons les composants essentiels utilisés par les administrateurs Apple au quotidien.`,
  }),
  script({
    slug: "macos-security",
    title: "Sécurité macOS",
    duration: "20 min",
    module: "Sécurité macOS",
    level: "Intermédiaire",
    relatedCourseSlug: "apple-fundamentals",
    relatedLabSlug: "macos-security",
    script: `La sécurité macOS repose sur plusieurs couches.
FileVault chiffre les données du disque.
Gatekeeper contrôle l'exécution des applications.
XProtect détecte les logiciels malveillants.
System Integrity Protection protège les composants critiques du système.
Activation Lock protège contre le vol.
Ces technologies peuvent être contrôlées et supervisées avec Intune, Jamf et Apple Business Manager.`,
  }),
];

export function getVideoScript(slug: string): VideoScript | undefined {
  return videoScripts.find((v) => v.slug === slug);
}

export function getVideoScriptSlugs(): string[] {
  return videoScripts.map((v) => v.slug);
}

export function getPopularVideoScripts(): VideoScript[] {
  return videoScripts.filter((v) => v.popular);
}

export function getLatestVideoScripts(limit = 4): VideoScript[] {
  return videoScripts.slice(0, limit);
}

/** Payload HeyGen prêt à l'emploi pour une vidéo */
export function toHeyGenPayload(video: VideoScript) {
  return {
    avatar: video.heygenAvatar,
    voice: HEYGEN_VIDEO_DEFAULTS.voice,
    language: video.language,
    format: HEYGEN_VIDEO_DEFAULTS.format,
    style: HEYGEN_VIDEO_DEFAULTS.style,
    script: video.script,
    title: video.title,
    duration: video.duration,
  };
}
