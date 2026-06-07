import { advancedVideoScripts, advancedLessonVideoMap } from "@/lib/data/advanced-tracks/heygen-videos";
import { altMdmVideoScripts, altMdmLessonVideoMap } from "@/lib/data/alternative-mdm-tracks/heygen-videos";
import { buildFoundationVideoScript } from "@/lib/data/shared/module-video-script";

export type VideoLevel = "Débutant" | "Intermédiaire" | "Fondamental" | "Avancé" | "Pro" | "Expert";

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

export const HEYGEN_JAMF_STYLE = "Apple Training Premium + Jamf Training Catalog";

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
  /** Style HeyGen — Jamf utilise le catalogue Jamf Training */
  heygenStyle?: string;
  /** Parcours Jamf 100, 170 ou 200 */
  jamfTrack?: "jamf-100" | "jamf-170" | "jamf-200";
};

function parseDurationMinutes(duration: string): number {
  const match = duration.match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) * 60 : 600;
}

function script(
  entry: Omit<VideoScript, "durationSeconds" | "heygenAvatar" | "language" | "description"> & {
    heygenAvatar?: string;
    language?: string;
    heygenStyle?: string;
  }
): VideoScript {
  let fullScript = entry.script.trim();
  if (!fullScript.includes("Objectifs pédagogiques")) {
    const paragraphs = fullScript.split(/\n+/).filter(Boolean);
    fullScript = buildFoundationVideoScript({
      title: entry.title,
      courseSlug: entry.relatedCourseSlug,
      labSlug: entry.relatedLabSlug,
      body: paragraphs,
    });
  }
  const firstSentence = fullScript.split(/(?<=[.!?])\s+/)[0] ?? fullScript;
  return {
    ...entry,
    script: fullScript,
    heygenAvatar: entry.heygenAvatar ?? HEYGEN_VIDEO_DEFAULTS.avatar,
    language: entry.language ?? HEYGEN_VIDEO_DEFAULTS.language,
    heygenStyle: entry.heygenStyle ?? (entry.jamfTrack ? HEYGEN_JAMF_STYLE : HEYGEN_VIDEO_DEFAULTS.style),
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

  // ─── Parcours Jamf 100 / 200 ───────────────────────────────────────────────

  script({
    slug: "jamf-dashboard",
    title: "Découvrir le dashboard Jamf Pro",
    duration: "10 min",
    module: "Jamf Pro — Dashboard",
    level: "Débutant",
    relatedCourseSlug: "jamf-100",
    relatedLabSlug: "jamf-discovery",
    jamfTrack: "jamf-100",
    popular: true,
    script: `Bienvenue dans cette vidéo consacrée au dashboard Jamf Pro.
Le dashboard est votre point d'entrée quotidien pour piloter la santé de votre parc Apple.
Dès la connexion, vous visualisez le nombre de Mac, iPhone et iPad gérés, les alertes critiques et les policies en attente d'exécution.
Les widgets vous permettent de suivre la conformité, les enrollments récents et l'état des certificats APNs.
Le menu latéral organise l'inventaire, les policies, les profils de configuration, les Smart Groups et les rapports.
Un administrateur Jamf efficace commence chaque journée par une revue du dashboard avant d'intervenir sur les appareils.
Dans le lab associé, vous explorerez chaque section et configurerez vos favoris pour un accès rapide.`,
  }),
  script({
    slug: "jamf-inventory",
    title: "Comprendre l'inventaire Jamf Pro",
    duration: "12 min",
    module: "Jamf Pro — Inventaire",
    level: "Débutant",
    relatedCourseSlug: "jamf-100",
    relatedLabSlug: "jamf-discovery",
    jamfTrack: "jamf-100",
    script: `L'inventaire Jamf Pro centralise toutes les informations remontées par vos appareils Apple.
Chaque enregistrement contient le modèle, le numéro de série, la version macOS ou iOS, l'utilisateur assigné et la date du dernier check-in.
Jamf collecte ces données via l'agent Jamf et les extension attributes personnalisées.
La recherche avancée permet de filtrer par critère : version OS, application installée, statut FileVault ou valeur d'un Extension Attribute.
Un inventaire fiable est la base de tout déploiement réussi : sans données exactes, les Smart Groups et les policies ciblent les mauvais appareils.
Pensez à surveiller les Mac qui n'ont pas effectué de check-in depuis plus de sept jours.
Dans votre lab, vous interrogez l'inventaire et exportez un rapport pour votre équipe support.`,
  }),
  script({
    slug: "jamf-enrollment",
    title: "Enrôler un Mac dans Jamf Pro",
    duration: "15 min",
    module: "Jamf Pro — Enrollment",
    level: "Débutant",
    relatedCourseSlug: "jamf-100",
    relatedLabSlug: "jamf-discovery",
    jamfTrack: "jamf-100",
    popular: true,
    script: `L'enrollment est le processus qui lie un Mac à votre instance Jamf Pro.
Il existe plusieurs méthodes : Automated Device Enrollment via Apple Business Manager, enrollment manuel par invitation ou enrollment par profil téléchargé.
Pour un déploiement enterprise, ADE est la méthode recommandée : l'appareil est supervisé dès la première activation.
Lors de l'enrollment, Jamf installe le profil MDM, enregistre l'appareil dans l'inventaire et exécute les policies de type Enrollment Complete.
Vous devez vérifier que le certificat APNs est valide et que le serveur MDM est correctement configuré dans ABM.
Un Mac correctement enrollé affiche le statut Managed dans Jamf et peut recevoir des commandes silencieuses.
Le lab vous guide pas à pas pour enrôler un Mac de test et valider la remontée d'inventaire.`,
  }),
  script({
    slug: "jamf-prestage",
    title: "PreStage Enrollment",
    duration: "15 min",
    module: "Jamf Pro — PreStage",
    level: "Intermédiaire",
    relatedCourseSlug: "jamf-100",
    relatedLabSlug: "jamf-discovery",
    jamfTrack: "jamf-100",
    script: `PreStage Enrollment est la fonctionnalité phare de Jamf pour le zero-touch deployment Mac.
Un PreStage Enrollment regroupe les paramètres d'enrollment ADE : compte local, Skip Setup Assistant, policies initiales et restrictions.
Vous pouvez créer plusieurs PreStages selon les profils utilisateurs : développeurs, marketing, direction.
Lors de l'activation, le Mac télécharge automatiquement le PreStage assigné dans Apple Business Manager.
Les options Skip permettent de masquer les écrans Apple ID, Siri ou Analytics pour une expérience corporate fluide.
Un PreStage bien configuré réduit le temps de mise en service de plusieurs heures à quelques minutes.
Dans cette leçon, nous construisons un PreStage production-ready avec scope, compte admin local et policies de bootstrap.`,
  }),
  script({
    slug: "jamf-smart-groups",
    title: "Smart Groups Jamf",
    duration: "15 min",
    module: "Jamf Pro — Smart Groups",
    level: "Intermédiaire",
    relatedCourseSlug: "jamf-100",
    relatedLabSlug: "jamf-smart-groups",
    jamfTrack: "jamf-100",
    popular: true,
    script: `Les Smart Groups sont des groupes dynamiques qui se mettent à jour automatiquement selon des critères d'inventaire.
Contrairement aux groupes statiques, un Smart Group recalcule ses membres à chaque check-in Jamf.
Vous pouvez combiner des critères : version macOS supérieure à 14, présence d'une application, Extension Attribute égal à une valeur, appartenance à un site.
Les opérateurs AND et OR permettent des règles complexes pour cibler précisément vos populations.
Les Smart Groups sont utilisés partout dans Jamf : scope des policies, profils, patch management et rapports.
Un Smart Group mal conçu peut exclure des appareils critiques ou en inclure trop — testez toujours sur un groupe pilote.
Le lab associé vous fait créer un Smart Group production avec Extension Attribute et validation du scope.`,
  }),
  script({
    slug: "jamf-policies",
    title: "Policies Jamf Pro",
    duration: "18 min",
    module: "Jamf Pro — Policies",
    level: "Intermédiaire",
    relatedCourseSlug: "jamf-100",
    relatedLabSlug: "jamf-policies",
    jamfTrack: "jamf-100",
    popular: true,
    script: `Les Policies Jamf Pro sont le moteur d'automatisation de votre flotte Mac.
Une policy regroupe des actions : installation de packages, exécution de scripts, maintenance, messages utilisateur ou reboot.
Le trigger définit quand la policy s'exécute : Enrollment Complete, Recurring Check-in, Login, Logout ou Self Service.
La fréquence contrôle la répétition : once per computer, once per user ou à chaque check-in.
Les policies sont ordonnées par priorité : Before, After ou au sein d'une catégorie.
Chaque policy doit être scoped à un Smart Group ou un groupe statique pour limiter son impact.
Un administrateur Jamf 100 maîtrise la création, le test et le dépannage des policies via les logs Jamf et la commande sudo jamf policy.
Le lab vous guide pour créer une policy complète avec package et validation sur Mac de test.`,
  }),
  script({
    slug: "jamf-scope",
    title: "Scope, exclusions et limitations",
    duration: "12 min",
    module: "Jamf Pro — Scope",
    level: "Intermédiaire",
    relatedCourseSlug: "jamf-100",
    relatedLabSlug: "jamf-policies",
    jamfTrack: "jamf-100",
    script: `Le scope détermine quels appareils ou utilisateurs reçoivent une policy, un profil ou une application Jamf.
L'onglet Scope permet d'ajouter des groupes cibles et de définir des exclusions pour retirer des machines spécifiques.
Les limitations affinent le ciblage : par site Jamf, par réseau, par version OS ou par type d'appareil.
Une exclusion est utile pour retirer les Mac de test ou les machines VIP d'un déploiement massif.
Les conflits de scope entre plusieurs policies sont résolus par la priorité et l'ordre d'exécution.
Une erreur de scope est l'une des causes les plus fréquentes de policies qui ne s'appliquent pas — vérifiez toujours les membres du groupe et les exclusions actives.
Cette vidéo vous apprend à auditer le scope avant chaque déploiement production.`,
  }),
  script({
    slug: "jamf-configuration-profiles",
    title: "Configuration Profiles Jamf Pro",
    duration: "18 min",
    module: "Jamf Pro — Configuration Profiles",
    level: "Intermédiaire",
    relatedCourseSlug: "jamf-100",
    relatedLabSlug: "jamf-discovery",
    jamfTrack: "jamf-100",
    script: `Les Configuration Profiles Jamf Pro 11.16 transportent les payloads MDM Apple : Wi-Fi enterprise, VPN, FileVault, restrictions, PPPC et extensions système.

Scénario entreprise : déployer Wi-Fi corporate et exiger FileVault avec escrow clé recovery sur Mac supervisés ADE.

Computers → Configuration Profiles → New. Composez payloads Wi-Fi WPA2-Enterprise avec certificat utilisateur. Ajoutez payload FileVault avec escrow vers Jamf.

Scope Smart Group ADE-SUPERVISED-MAC. Save. Au prochain check-in, vérifiez Réglages → Profils sur le Mac pilote et l'onglet Security de l'inventaire Jamf.

Profils MDM ≠ packages PKG : les profils poussent des réglages Apple signés ; les packages s'installent via policy Packages payload.

Erreurs fréquentes : conflits Wi-Fi duplicate SSID, FileVault sans Bootstrap Token, scope production sans pilote.

Lab jamf-discovery, ressource PDF jamf-guide-configuration-profiles, quiz dédié. Préparation certification Jamf 100.`,
  }),
  script({
    slug: "jamf-self-service",
    title: "Jamf Self Service",
    duration: "12 min",
    module: "Jamf Pro — Self Service",
    level: "Débutant",
    relatedCourseSlug: "jamf-100",
    relatedLabSlug: "jamf-self-service",
    jamfTrack: "jamf-100",
    script: `Jamf Self Service est le portail utilisateur qui permet aux collaborateurs d'installer des applications et des ressources en autonomie.
L'application Self Service sur Mac affiche les policies configurées avec le trigger Self Service et les rend disponibles en un clic.
Vous personnalisez l'interface : catégories, icônes, descriptions et notifications pour guider l'utilisateur.
Self Service réduit la charge du helpdesk en déléguant l'installation de logiciels approuvés aux utilisateurs finaux.
Les policies Self Service peuvent inclure des applications, des scripts, des liens web ou des documents internes.
Un catalogue Self Service bien organisé améliore l'expérience utilisateur et accélère l'onboarding des nouveaux arrivants.
Nous verrons comment publier une application dans Self Service et mesurer son adoption via les rapports Jamf.`,
  }),
  script({
    slug: "jamf-packages",
    title: "Déployer des packages",
    duration: "15 min",
    module: "Jamf Pro — Packages",
    level: "Intermédiaire",
    relatedCourseSlug: "jamf-100",
    relatedLabSlug: "jamf-packages",
    jamfTrack: "jamf-100",
    script: `Le déploiement de packages est une compétence essentielle pour tout administrateur Jamf.
Un package Jamf est généralement un fichier PKG ou DMG contenant une application ou un composant système.
Vous uploadez le package dans Jamf Pro → Computer Management → Packages, puis vous l'associez à une policy.
Les options d'installation incluent l'installation silencieuse, la vérification de l'existence avant install et la suppression après échec.
Pour les applications complexes, utilisez Composer ou des outils comme AutoPKG pour automatiser la création de packages.
Testez toujours sur un Mac isolé avant de scoper à toute la flotte — un mauvais package peut bloquer des centaines de machines.
Cette leçon couvre le cycle complet : préparation du PKG, upload Jamf, policy d'installation et vérification post-déploiement.`,
  }),
  script({
    slug: "jamf-scripts",
    title: "Scripts Jamf Pro",
    duration: "20 min",
    module: "Jamf Pro — Scripts",
    level: "Intermédiaire",
    relatedCourseSlug: "jamf-170",
    relatedLabSlug: "jamf-scripts",
    jamfTrack: "jamf-170",
    popular: true,
    script: `Les scripts Jamf Pro étendent les capacités d'automatisation au-delà des packages standard.
Un script shell ou bash est stocké dans Jamf et exécuté via une policy avec le payload Scripts.
Les bonnes pratiques incluent l'idempotence : le script doit pouvoir s'exécuter plusieurs fois sans effet de bord.
Utilisez des chemins absolus, journalisez dans /var/log/jamf.log et retournez un code de sortie explicite pour le dépannage.
Les Extension Attributes basés sur scripts enrichissent l'inventaire avec des données métier personnalisées.
Jamf 170 et Jamf 200 exigent une maîtrise des scripts pour l'automatisation avancée et l'intégration API.
Le lab associé vous fait rédiger un script idempotent, le déployer via policy et analyser les logs d'exécution.`,
  }),
  script({
    slug: "jamf-patch-management",
    title: "Patch Management Jamf",
    duration: "15 min",
    module: "Jamf Pro — Patch Management",
    level: "Avancé",
    relatedCourseSlug: "jamf-200",
    relatedLabSlug: "jamf-patch-management",
    jamfTrack: "jamf-200",
    popular: true,
    script: `Le Patch Management Jamf automatise la distribution des mises à jour macOS et des correctifs applicatifs.
Jamf collecte l'inventaire Software Update de chaque Mac et affiche les updates disponibles dans Patch Management.
Une patch policy définit le titre logiciel cible, la deadline, les notifications utilisateur et le comportement en cas de report.
Vous scopez les patch policies à des Smart Groups pour un déploiement progressif : pilote, production, retardataires.
Le dashboard Patch Management montre le taux de conformité et les Mac en échec nécessitant une intervention.
Cette fonctionnalité est centrale pour Jamf 200 et la conformité sécurité en entreprise.
Nous configurons une patch policy macOS complète avec fenêtre de maintenance et rapport de conformité exportable.`,
  }),
  script({
    slug: "jamf-protect",
    title: "Introduction à Jamf Protect",
    duration: "15 min",
    module: "Jamf Protect",
    level: "Avancé",
    relatedCourseSlug: "jamf-200",
    relatedLabSlug: "jamf-protect",
    jamfTrack: "jamf-200",
    popular: true,
    script: `Jamf Protect est la solution de sécurité et d'analyse comportementale de l'écosystème Jamf.
Elle complète Jamf Pro en détectant les menaces, en collectant la télémétrie endpoint et en appliquant des plans de protection.
L'agent Protect s'installe sur les Mac via un plan de déploiement lié à votre instance Jamf Pro.
Le portail Protect affiche les alertes, les analytics Unified Logs et les conformités CIS ou NIST.
Les plans Protect regroupent policies analytics, blocages et réponses automatisées aux incidents.
Jamf 200 inclut Protect dans les scénarios enterprise : intégration SIEM, réponse aux incidents et durcissement macOS.
Cette vidéo présente l'architecture Protect, la création d'un plan pilote et la validation des alertes sur un Mac de test.`,
  }),
  ...advancedVideoScripts,
  ...altMdmVideoScripts,
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

export function getJamfVideoScripts(): VideoScript[] {
  return videoScripts.filter((v) => v.jamfTrack !== undefined);
}

export function getJamfVideoScriptsByTrack(track: "jamf-100" | "jamf-170" | "jamf-200"): VideoScript[] {
  return videoScripts.filter((v) => v.jamfTrack === track);
}

export function getFundamentalVideoScripts(): VideoScript[] {
  return videoScripts.filter((v) => !v.jamfTrack);
}

const LESSON_VIDEO_SLUGS: Record<string, string> = {
  "historique-ecosysteme": "bienvenue-apple-mdm-academy",
  "macos-ios-ipados": "bienvenue-apple-mdm-academy",
  "services-entreprise": "apple-business-manager",
  "filevault-chiffrement": "macos-security",
  "gatekeeper-notarisation": "macos-security",
  "abm-creation-roles": "apple-business-manager",
  "dep-enrollment": "automated-device-enrollment",
  "apps-books": "apps-books",
  "profils-configuration": "apple-business-manager",
  "commandes-mdm": "apns",
  "apns-certificats": "apns",
  "abm-intune": "abm-intune",
  "managed-apple-ids": "managed-apple-ids",
  "platform-sso": "platform-sso",
  "vpp-apps-books": "apps-books",
  "apns-certificates": "apns",
  "ade-iphone": "automated-device-enrollment",
  "ade-mac": "automated-device-enrollment",
  "enrollment-token": "abm-intune",
  "ios-configuration-profiles": "abm-intune",
  "macos-configuration-profiles": "platform-sso",
  "macos-security": "macos-security",
  "compliance-policies": "platform-sso",
  "conditional-access": "platform-sso",
  "architecture-jamf": "jamf-pro-fundamentals",
  "inventaire-recherche": "jamf-inventory",
  "smart-groups": "jamf-smart-groups",
  "config-profiles-jamf": "jamf-configuration-profiles",
  "policies-base": "jamf-policies",
  "scope-deploiement": "jamf-scope",
  "extension-attributes": "jamf-inventory",
  "scripts-policies": "jamf-scripts",
  "self-service": "jamf-self-service",
  "workflows-enrollment": "jamf-enrollment",
  "patch-management-intro": "jamf-patch-management",
  "api-jamf": "jamf-scripts",
  "patch-management": "jamf-patch-management",
  "integrations-tierces": "jamf-protect",
  "m11-abm-intune": "abm-intune",
  "m11-ade-sync": "automated-device-enrollment",
  "m11-apns-intune": "apns",
  "m11-profiles-apple": "abm-intune",
  "m11-compliance-ca": "platform-sso",
  "m12-presentation-jamf": "jamf-pro-fundamentals",
  "m12-architecture-jamf": "jamf-dashboard",
  "m12-inventaire-jamf": "jamf-inventory",
  "m12-enrollment-jamf": "jamf-enrollment",
  "m12-self-service": "jamf-self-service",
  "m13-sg-intro": "jamf-smart-groups",
  "m13-sg-criteres": "jamf-smart-groups",
  "m13-sg-automatisation": "jamf-smart-groups",
  "m13-sg-dynamiques": "jamf-smart-groups",
  "m13-sg-bonnes-pratiques": "jamf-smart-groups",
  "m14-policy-execution": "jamf-policies",
  "m14-policy-triggers": "jamf-policies",
  "m14-policy-frequence": "jamf-policies",
  "m14-policy-scope": "jamf-scope",
  "m14-policy-exclusions": "jamf-scope",
  "m15-scripts-bash": "jamf-scripts",
  "m15-scripts-variables": "jamf-scripts",
  "m15-scripts-logs": "jamf-scripts",
  "m15-scripts-debugging": "jamf-scripts",
  "m15-scripts-bonnes-pratiques": "jamf-scripts",
  "m16-patch-gestion": "jamf-patch-management",
  "m16-patch-reporting": "jamf-patch-management",
  "m16-patch-conformite": "jamf-patch-management",
  "m16-patch-deploiement": "jamf-patch-management",
  "m16-patch-chrome": "jamf-patch-management",
  "m17-protect-endpoint": "jamf-protect",
  "m17-protect-detection": "jamf-protect",
  "m17-protect-alertes": "jamf-protect",
  "m17-protect-conformite": "jamf-protect",
  "m17-protect-regles": "jamf-protect",
  "m18-filevault": "macos-security",
  "m18-gatekeeper": "macos-security",
  "m18-xprotect-sip": "macos-security",
  "m18-compliance": "macos-security",
  "m18-zero-trust": "platform-sso",
  ...advancedLessonVideoMap,
  ...altMdmLessonVideoMap,
};

export function getVideoScriptForLesson(lessonSlug: string): VideoScript | undefined {
  const videoSlug = LESSON_VIDEO_SLUGS[lessonSlug];
  return videoSlug ? getVideoScript(videoSlug) : undefined;
}

/** Payload HeyGen prêt à l'emploi pour une vidéo */
export function toHeyGenPayload(video: VideoScript) {
  return {
    avatar: video.heygenAvatar,
    voice: HEYGEN_VIDEO_DEFAULTS.voice,
    language: video.language,
    format: HEYGEN_VIDEO_DEFAULTS.format,
    style: video.heygenStyle ?? HEYGEN_VIDEO_DEFAULTS.style,
    script: video.script,
    title: video.title,
    duration: video.duration,
  };
}
