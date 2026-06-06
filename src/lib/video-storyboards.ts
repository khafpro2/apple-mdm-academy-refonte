import {
  buildNarrationFromScenes,
  defaultHeygenMeta,
  estimateDurationSeconds,
  formatDuration,
  type VideoScene,
  type VideoSceneVisualType,
  type VideoStoryboard,
} from "@/src/lib/video-lessons";

function scene(
  id: string,
  title: string,
  visualType: VideoSceneVisualType,
  narration: string,
  visualHint: string,
  extra: Partial<Omit<VideoScene, "id" | "title" | "visualType" | "narration" | "visualHint">> = {}
): VideoScene {
  return {
    id,
    title,
    visualType,
    narration,
    visualHint,
    durationSeconds: extra.durationSeconds ?? 45,
    ...extra,
  };
}

function storyboard(
  meta: Omit<VideoStoryboard, "scenes" | "narration" | "duration" | "durationSeconds" | "heygen"> & {
    scenes: VideoScene[];
  }
): VideoStoryboard {
  const durationSeconds = estimateDurationSeconds(meta.scenes);
  return {
    ...meta,
    durationSeconds,
    duration: formatDuration(durationSeconds),
    narration: buildNarrationFromScenes(meta.scenes),
    heygen: defaultHeygenMeta(),
  };
}

export const illustratedVideoStoryboards: VideoStoryboard[] = [
  storyboard({
    slug: "apple-business-manager",
    title: "Comprendre Apple Business Manager",
    module: "Apple Business Manager",
    objective: "Maîtriser le rôle d'ABM dans l'écosystème Apple Enterprise.",
    visualType: "architecture",
    relatedCourse: "apple-it-professional",
    relatedLab: "abm-intune",
    scenes: [
      scene("s1", "Vue d'ensemble", "architecture", "Apple Business Manager centralise appareils, utilisateurs, Apps & Books et serveurs MDM pour l'entreprise.", "Diagramme ABM au centre avec apps, devices, MDM", {
        nodes: [
          { id: "abm", label: "Apple Business Manager", icon: "abm" },
          { id: "devices", label: "Appareils", icon: "apple-device" },
          { id: "mdm", label: "Serveur MDM", icon: "cloud" },
        ],
        connections: [
          { from: "abm", to: "devices" },
          { from: "abm", to: "mdm" },
        ],
      }),
      scene("s2", "Inventaire automatique", "process", "Les appareils achetés via un revendeur agréé apparaissent automatiquement dans l'inventaire ABM.", "Flux revendeur → ABM → inventaire", { durationSeconds: 40 }),
      scene("s3", "Apps & Books", "diagram", "Apps & Books permet d'acheter et de synchroniser des licences applicatives en volume.", "Icône Apps & Books + flèches vers MDM", { durationSeconds: 50 }),
      scene("s4", "Managed Apple IDs", "checklist", "Les Managed Apple IDs et la fédération Entra complètent la gestion des identités.", "Checklist identités gérées", {
        checklistItems: ["Managed Apple IDs", "Fédération Microsoft Entra", "Rôles administrateur ABM"],
      }),
      scene("s5", "Récapitulatif", "recap", "ABM est le socle obligatoire avant Intune, Jamf ou tout autre MDM Apple.", "Carte récap ABM + prochaines étapes", { durationSeconds: 35 }),
    ],
  }),

  storyboard({
    slug: "abm-intune",
    title: "Lier Apple Business Manager à Microsoft Intune",
    module: "ABM + Intune",
    objective: "Connecter ABM à Intune via le token serveur MDM et synchroniser les appareils.",
    visualType: "architecture",
    relatedCourse: "intune-mac",
    relatedLab: "abm-intune",
    scenes: [
      scene("s1", "Vue d'ensemble", "architecture", "Dans cette vidéo, nous allons comprendre comment Apple Business Manager s'intègre avec Microsoft Intune pour automatiser le déploiement des appareils Apple.", "Apple Business Manager → Intune → APNs → Appareil Apple", {
        nodes: [
          { id: "abm", label: "Apple Business Manager", icon: "abm" },
          { id: "intune", label: "Microsoft Intune", icon: "intune" },
          { id: "apns", label: "APNs", icon: "apns" },
          { id: "device", label: "Appareil Apple", icon: "apple-device" },
        ],
        connections: [
          { from: "abm", to: "intune" },
          { from: "intune", to: "apns" },
          { from: "apns", to: "device" },
        ],
      }),
      scene("s2", "Création du serveur MDM", "screenshot", "Dans Apple Business Manager, l'administrateur crée un serveur MDM dédié à Intune.", "Capture Apple Business Manager — zone serveur MDM surlignée", {
        screenshotTarget: "business.apple.com → Paramètres → Gestion des appareils → Serveurs MDM",
        durationSeconds: 50,
      }),
      scene("s3", "Token serveur", "process", "Le jeton serveur permet d'établir une relation de confiance entre Apple Business Manager et Intune.", "Fichier server_token.p7m animé vers Intune", { durationSeconds: 55 }),
      scene("s4", "Synchronisation", "diagram", "Après import du token, Intune synchronise les appareils associés au serveur MDM.", "Flèches animées entre ABM et Intune", { durationSeconds: 45 }),
      scene("s5", "Résultat", "recap", "Les appareils sont maintenant prêts pour Automated Device Enrollment.", "iPhone, iPad et Mac apparaissent dans Intune", {
        nodes: [
          { id: "intune", label: "Intune", icon: "intune" },
          { id: "iphone", label: "iPhone", icon: "apple-device" },
          { id: "ipad", label: "iPad", icon: "apple-device" },
          { id: "mac", label: "Mac", icon: "apple-device" },
        ],
        connections: [
          { from: "intune", to: "iphone" },
          { from: "intune", to: "ipad" },
          { from: "intune", to: "mac" },
        ],
      }),
    ],
  }),

  storyboard({
    slug: "automated-device-enrollment",
    title: "Automated Device Enrollment (ADE)",
    module: "Automated Device Enrollment",
    objective: "Comprendre le parcours ADE de l'achat à la supervision silencieuse.",
    visualType: "process",
    relatedCourse: "intune-mac",
    relatedLab: "ade-iphone",
    scenes: [
      scene("s1", "Principe ADE", "architecture", "L'ADE lie un appareil Apple à un MDM dès la première activation, sans intervention utilisateur.", "ABM → profil ADE → Setup Assistant", {
        nodes: [
          { id: "abm", label: "ABM", icon: "abm" },
          { id: "ade", label: "Profil ADE", icon: "certificate" },
          { id: "mdm", label: "Intune / Jamf", icon: "cloud" },
        ],
        connections: [{ from: "abm", to: "ade" }, { from: "ade", to: "mdm" }],
      }),
      scene("s2", "Setup Assistant", "process", "L'utilisateur voit Remote Management et l'appareil rejoint automatiquement le MDM.", "Écran Setup Assistant avec Remote Management", { durationSeconds: 50 }),
      scene("s3", "Supervision", "comparison", "Un appareil ADE est supervisé : déploiement silencieux et contrôles avancés.", "Supervisé vs non supervisé", {
        comparison: { left: "Appareil supervisé ADE", right: "Appareil utilisateur BYOD" },
      }),
      scene("s4", "Récapitulatif", "recap", "ADE est la base du zero-touch deployment Apple en entreprise.", "Checklist prérequis ADE", {
        checklistItems: ["Serveur MDM configuré", "Profil ADE assigné", "APNs valide"],
      }),
    ],
  }),

  storyboard({
    slug: "apns",
    title: "Apple Push Notification service (APNs)",
    module: "APNs",
    objective: "Créer et renouveler le certificat APNs pour le serveur MDM.",
    visualType: "diagram",
    relatedCourse: "apple-it-professional",
    relatedLab: "apns-intune",
    scenes: [
      scene("s1", "Rôle APNs", "architecture", "APNs permet au MDM d'envoyer des notifications push pour réveiller les appareils.", "MDM → APNs → appareil", {
        nodes: [
          { id: "mdm", label: "Serveur MDM", icon: "cloud" },
          { id: "apns", label: "APNs Apple", icon: "apns" },
          { id: "device", label: "Appareil", icon: "apple-device" },
        ],
        connections: [{ from: "mdm", to: "apns" }, { from: "apns", to: "device" }],
      }),
      scene("s2", "Création CSR", "screenshot", "Générez une demande de certificat depuis Intune ou Jamf.", "Capture portail MDM — certificat push", {
        screenshotTarget: "Intune → Devices → Apple → Apple MDM Push Certificate",
      }),
      scene("s3", "Renouvellement", "checklist", "Le certificat APNs doit être renouvelé avant expiration pour éviter toute interruption.", "Timeline renouvellement APNs", {
        checklistItems: ["CSR identique au certificat actuel", "Renouveler 30 jours avant expiration", "Tester push après renouvellement"],
      }),
      scene("s4", "Récapitulatif", "recap", "Sans APNs valide, aucune commande MDM ne peut atteindre les appareils.", "Icône alerte + certificat valide", { durationSeconds: 35 }),
    ],
  }),

  storyboard({
    slug: "apps-books",
    title: "Apps & Books (VPP)",
    module: "Apps & Books",
    objective: "Synchroniser les licences VPP et déployer des apps en volume.",
    visualType: "process",
    relatedCourse: "apple-it-professional",
    relatedLab: "vpp-apps",
    scenes: [
      scene("s1", "Token VPP", "process", "Le token Apps & Books lie ABM au MDM pour les licences applicatives.", "Token VPP ABM → Intune/Jamf"),
      scene("s2", "Sync licences", "diagram", "Les apps achetées en volume apparaissent dans le catalogue MDM.", "Catalogue apps synchronisé"),
      scene("s3", "Déploiement", "architecture", "APNs réveille l'appareil pour installer l'application silencieusement.", "ABM → MDM → App Store → device", {
        nodes: [
          { id: "abm", label: "Apps & Books", icon: "abm" },
          { id: "mdm", label: "MDM", icon: "cloud" },
          { id: "device", label: "Appareil", icon: "apple-device" },
        ],
        connections: [{ from: "abm", to: "mdm" }, { from: "mdm", to: "device" }],
      }),
      scene("s4", "Récapitulatif", "recap", "VPP évite les comptes Apple personnels pour les apps professionnelles.", "Résumé licences assignées vs installées"),
    ],
  }),

  storyboard({
    slug: "managed-apple-ids",
    title: "Managed Apple IDs",
    module: "Managed Apple IDs",
    objective: "Gérer les identités Apple d'entreprise et la fédération Entra.",
    visualType: "diagram",
    relatedCourse: "apple-it-professional",
    relatedLab: "managed-apple-ids",
    scenes: [
      scene("s1", "Concept", "comparison", "Les Managed Apple IDs sont distincts des Apple IDs personnels.", "Managed ID vs Apple ID personnel", {
        comparison: { left: "Managed Apple ID (ABM)", right: "Apple ID personnel" },
      }),
      scene("s2", "Fédération", "architecture", "La fédération Microsoft Entra permet le SSO vers les services Apple.", "Entra ID ↔ ABM", {
        nodes: [
          { id: "entra", label: "Microsoft Entra", icon: "cloud" },
          { id: "abm", label: "ABM", icon: "abm" },
        ],
        connections: [{ from: "entra", to: "abm", label: "Fédération" }],
      }),
      scene("s3", "Cas d'usage", "checklist", "Utilisez les Managed IDs pour Shared iPad, School Manager ou accès services Apple.", "Checklist cas d'usage", {
        checklistItems: ["Création en masse", "Réinitialisation mot de passe", "Rôles administrateur"],
      }),
      scene("s4", "Récapitulatif", "recap", "Les identités gérées simplifient l'administration à grande échelle.", "Récap gouvernance identités"),
    ],
  }),

  storyboard({
    slug: "platform-sso",
    title: "Platform SSO sur macOS",
    module: "Platform SSO",
    objective: "Déployer Platform SSO avec Entra ID sur macOS supervisé.",
    visualType: "architecture",
    relatedCourse: "apple-it-professional",
    relatedLab: "platform-sso",
    scenes: [
      scene("s1", "Vue d'ensemble", "architecture", "Platform SSO étend l'authentification Entra au niveau macOS natif.", "Entra → profil SSO → macOS", {
        nodes: [
          { id: "entra", label: "Entra ID", icon: "cloud" },
          { id: "profile", label: "Profil Platform SSO", icon: "certificate" },
          { id: "mac", label: "macOS", icon: "apple-device" },
        ],
        connections: [{ from: "entra", to: "profile" }, { from: "profile", to: "mac" }],
      }),
      scene("s2", "Extension SSO", "screenshot", "L'extension d'authentification Microsoft doit être déployée.", "Capture extension SSO macOS", {
        screenshotTarget: "Intune → macOS → Configuration profiles → Platform SSO",
      }),
      scene("s3", "Expérience utilisateur", "process", "L'utilisateur se connecte une fois et accède aux apps sans ressaisir ses identifiants.", "Login macOS → apps métier"),
      scene("s4", "Récapitulatif", "recap", "Platform SSO améliore sécurité et expérience utilisateur sur Mac.", "Checklist prérequis SSO"),
    ],
  }),

  storyboard({
    slug: "ios-ipados-profiles",
    title: "Profils iOS / iPadOS",
    module: "Profils iOS/iPadOS",
    objective: "Créer et déployer des profils de configuration iOS et iPadOS.",
    visualType: "process",
    relatedCourse: "apple-it-professional",
    relatedLab: "ios-profiles",
    scenes: [
      scene("s1", "Types de profils", "checklist", "Wi-Fi, VPN, restrictions, certificats et apps font partie des profils iOS.", "Grille types de profils", {
        checklistItems: ["Wi-Fi et VPN", "Restrictions", "Certificats SCEP", "Apps managées"],
      }),
      scene("s2", "Création Intune", "screenshot", "Créez un profil dans Intune et assignez-le à un groupe d'appareils.", "Intune → Configuration → iOS/iPadOS", {
        screenshotTarget: "Microsoft Intune admin center — iOS configuration profile",
      }),
      scene("s3", "Déploiement", "process", "Le MDM pousse le profil ; l'utilisateur voit une installation silencieuse si supervisé.", "Push MDM → iPhone"),
      scene("s4", "Récapitulatif", "recap", "Les profils sont le cœur de la configuration iOS en entreprise.", "Récap bonnes pratiques profils"),
    ],
  }),

  storyboard({
    slug: "macos-profiles",
    title: "Profils macOS",
    module: "Profils macOS",
    objective: "Déployer des profils de configuration macOS via MDM.",
    visualType: "process",
    relatedCourse: "intune-mac",
    relatedLab: "macos-profiles",
    scenes: [
      scene("s1", "Spécificités macOS", "comparison", "macOS supporte profils système, PPPC et extensions.", "macOS vs iOS profils", {
        comparison: { left: "Profils macOS (PPPC, extensions)", right: "Profils iOS classiques" },
      }),
      scene("s2", "Création", "screenshot", "Configurez un profil macOS dans Intune ou Jamf.", "Capture création profil macOS"),
      scene("s3", "Déploiement", "process", "Les profils système nécessitent une approbation administrateur sur Mac.", "Flux approbation profil macOS"),
      scene("s4", "Récapitulatif", "recap", "Testez toujours sur un Mac pilote avant déploiement massif.", "Checklist validation profil"),
    ],
  }),

  storyboard({
    slug: "filevault",
    title: "FileVault — chiffrement disque",
    module: "Sécurité macOS",
    objective: "Activer et gérer FileVault via MDM avec clés de récupération escrow.",
    visualType: "diagram",
    relatedCourse: "apple-it-professional",
    relatedLab: "filevault-intune",
    scenes: [
      scene("s1", "Principe", "diagram", "FileVault chiffre le volume de démarrage macOS avec clé de récupération escrow MDM.", "Disque macOS chiffré + clé escrow"),
      scene("s2", "Profil MDM", "screenshot", "Déployez un profil FileVault avec escrow vers Intune ou Jamf.", "Profil FileVault Intune/Jamf"),
      scene("s3", "Rotation clés", "checklist", "Planifiez la rotation et la sauvegarde des clés de récupération.", "Checklist escrow", {
        checklistItems: ["Escrow activé", "Clé récupérée dans MDM", "Procédure unlock documentée"],
      }),
      scene("s4", "Récapitulatif", "recap", "FileVault est obligatoire pour la conformité macOS enterprise.", "Récap conformité"),
    ],
  }),

  storyboard({
    slug: "gatekeeper",
    title: "Gatekeeper et notarisation",
    module: "Sécurité macOS",
    objective: "Comprendre Gatekeeper, notarisation et déploiement d'apps approuvées.",
    visualType: "comparison",
    relatedCourse: "apple-it-professional",
    relatedLab: "macos-security",
    scenes: [
      scene("s1", "Gatekeeper", "comparison", "Gatekeeper bloque les apps non signées ou non notarisées.", "App Store vs Identified Developers", {
        comparison: { left: "App notarisée", right: "App non signée — bloquée" },
      }),
      scene("s2", "Profil MDM", "screenshot", "Restreignez les sources d'installation via profil Restrictions.", "Profil restrictions macOS"),
      scene("s3", "PPPC", "process", "Les profils PPPC autorisent silencieusement les apps métier.", "Flux PPPC + Gatekeeper"),
      scene("s4", "Récapitulatif", "recap", "Combinez Gatekeeper, notarisation et PPPC pour un Mac sécurisé.", "Récap sécurité apps"),
    ],
  }),

  storyboard({
    slug: "xprotect",
    title: "XProtect et MRT",
    module: "Sécurité macOS",
    objective: "Expliquer la protection malware native Apple et son interaction avec MDM.",
    visualType: "diagram",
    relatedCourse: "apple-it-professional",
    relatedLab: "macos-security",
    scenes: [
      scene("s1", "XProtect", "diagram", "XProtect et MRT bloquent les malwares connus via mises à jour silencieuses.", "Apple → XProtect → macOS"),
      scene("s2", "Complément MDM", "architecture", "Jamf Protect ou Microsoft Defender complètent XProtect en entreprise.", "XProtect + EDR", {
        nodes: [
          { id: "xprotect", label: "XProtect / MRT", icon: "security" },
          { id: "edr", label: "EDR entreprise", icon: "cloud" },
        ],
        connections: [{ from: "xprotect", to: "edr", label: "Complément" }],
      }),
      scene("s3", "Conformité", "checklist", "Vérifiez que les mises à jour système sont appliquées rapidement.", "Checklist patch macOS"),
      scene("s4", "Récapitulatif", "recap", "La défense en profondeur combine Apple natif et solutions MDM.", "Récap stack sécurité"),
    ],
  }),

  storyboard({
    slug: "jamf-pro-fundamentals",
    title: "Jamf Pro Fundamentals",
    module: "Jamf Pro",
    objective: "Découvrir l'interface Jamf Pro, l'inventaire et les concepts de base.",
    visualType: "screenshot",
    relatedCourse: "jamf-100",
    relatedLab: "jamf-discovery",
    scenes: [
      scene("s1", "Console Jamf", "screenshot", "Jamf Pro centralise inventaire, profils, policies et Self Service.", "Dashboard Jamf Pro", {
        screenshotTarget: "Jamf Pro — Computers & Devices inventory",
      }),
      scene("s2", "Inventaire", "process", "Chaque appareil envoie son inventaire via check-in MDM.", "Flux check-in Jamf"),
      scene("s3", "Hiérarchie", "architecture", "Sites, groupes statiques et smart groups organisent la flotte.", "Arborescence Jamf", {
        nodes: [
          { id: "site", label: "Site", icon: "jamf" },
          { id: "group", label: "Smart Group", icon: "jamf" },
          { id: "device", label: "Mac / iOS", icon: "apple-device" },
        ],
        connections: [{ from: "site", to: "group" }, { from: "group", to: "device" }],
      }),
      scene("s4", "Récapitulatif", "recap", "Jamf Pro est la référence MDM Apple pour les grandes flottes.", "Récap Jamf 100"),
    ],
  }),

  storyboard({
    slug: "jamf-smart-groups",
    title: "Smart Groups Jamf",
    module: "Jamf Smart Groups",
    objective: "Créer des Smart Groups basés sur critères dynamiques.",
    visualType: "process",
    relatedCourse: "jamf-100",
    relatedLab: "jamf-smart-groups",
    scenes: [
      scene("s1", "Principe", "diagram", "Un Smart Group met à jour automatiquement son membership selon des critères.", "Critères → groupe dynamique"),
      scene("s2", "Critères", "screenshot", "Combinez OS version, apps, extension attributes et localisation.", "Capture création Smart Group", {
        screenshotTarget: "Jamf Pro — Smart Computer Groups — criteria",
      }),
      scene("s3", "Scope", "process", "Scope policies et profils sur les Smart Groups pour un ciblage précis.", "Smart Group → policies"),
      scene("s4", "Récapitulatif", "recap", "Les Smart Groups évitent la maintenance manuelle des groupes statiques.", "Exemples critères courants"),
    ],
  }),

  storyboard({
    slug: "jamf-policies",
    title: "Policies Jamf",
    module: "Jamf Policies",
    objective: "Créer des policies de déploiement, scripts et Self Service.",
    visualType: "process",
    relatedCourse: "jamf-100",
    relatedLab: "jamf-policies",
    scenes: [
      scene("s1", "Anatomie", "diagram", "Une policy Jamf définit triggers, payloads, scope et fréquence d'exécution.", "Schéma policy Jamf"),
      scene("s2", "Triggers", "checklist", "Enrollment, recurring check-in et Self Service sont les triggers courants.", "Liste triggers", {
        checklistItems: ["Enrollment Complete", "Recurring Check-in", "Self Service", "Custom trigger"],
      }),
      scene("s3", "Déploiement", "screenshot", "Scope la policy sur un Smart Group et surveillez les logs.", "Jamf Policy logs", {
        screenshotTarget: "Jamf Pro — Policies — execution history",
      }),
      scene("s4", "Récapitulatif", "recap", "Les policies automatisent 80 % des tâches admin Jamf.", "Récap bonnes pratiques"),
    ],
  }),

  storyboard({
    slug: "jamf-scripts",
    title: "Scripts Jamf",
    module: "Jamf Scripts",
    objective: "Intégrer des scripts bash/zsh dans les policies Jamf.",
    visualType: "process",
    relatedCourse: "jamf-170",
    relatedLab: "jamf-scripts",
    scenes: [
      scene("s1", "Scripts", "diagram", "Les scripts s'exécutent dans le contexte root ou utilisateur selon la policy.", "Policy → script → Mac"),
      scene("s2", "Paramètres", "screenshot", "Passez des paramètres $4-$11 aux scripts pour la réutilisabilité.", "Capture script Jamf avec paramètres"),
      scene("s3", "Logs", "checklist", "Toujours journaliser et tester sur un groupe pilote.", "Checklist script sécurisé", {
        checklistItems: ["Shebang correct", "Exit code explicite", "Logs /var/log", "Test pilote"],
      }),
      scene("s4", "Récapitulatif", "recap", "Les scripts étendent Jamf au-delà des profils natifs.", "Récap automatisation"),
    ],
  }),

  storyboard({
    slug: "jamf-patch-management",
    title: "Patch Management Jamf",
    module: "Jamf Patch Management",
    objective: "Automatiser les mises à jour applicatives avec Jamf Patch.",
    visualType: "process",
    relatedCourse: "jamf-200",
    relatedLab: "jamf-patch",
    scenes: [
      scene("s1", "Patch Catalog", "screenshot", "Le catalogue Patch liste les apps surveillées et leurs versions.", "Jamf Patch Catalog", {
        screenshotTarget: "Jamf Pro — Patch Management — software titles",
      }),
      scene("s2", "Workflow", "process", "Définissez seuils de version, policies de déploiement et deadlines.", "Flux patch : detect → deploy"),
      scene("s3", "Reporting", "diagram", "Le dashboard Patch montre conformité par titre et par appareil.", "Graphique conformité patch"),
      scene("s4", "Récapitulatif", "recap", "Patch Management réduit la dette applicative sur macOS.", "Récap cycle patch"),
    ],
  }),

  storyboard({
    slug: "jamf-protect",
    title: "Jamf Protect",
    module: "Jamf Protect",
    objective: "Déployer la sécurité endpoint Jamf Protect sur macOS.",
    visualType: "architecture",
    relatedCourse: "jamf-200",
    relatedLab: "jamf-protect",
    scenes: [
      scene("s1", "Vue d'ensemble", "architecture", "Jamf Protect analyse comportements, menaces et conformité sur Mac.", "Jamf Pro ↔ Jamf Protect ↔ Mac", {
        nodes: [
          { id: "jamf", label: "Jamf Pro", icon: "jamf" },
          { id: "protect", label: "Jamf Protect", icon: "security" },
          { id: "mac", label: "macOS", icon: "apple-device" },
        ],
        connections: [{ from: "jamf", to: "protect" }, { from: "protect", to: "mac" }],
      }),
      scene("s2", "Plans", "screenshot", "Créez des plans de sécurité avec règles MITRE et analytics.", "Jamf Protect — Plans", {
        screenshotTarget: "Jamf Protect — Security Plans",
      }),
      scene("s3", "Remédiation", "process", "Les alertes déclenchent workflows Jamf Pro ou notifications SOC.", "Alerte → remédiation"),
      scene("s4", "Récapitulatif", "recap", "Jamf Protect complète XProtect pour une posture Zero Trust Mac.", "Récap Protect + MDM"),
    ],
  }),
];

export function getVideoStoryboard(slug: string): VideoStoryboard | undefined {
  return illustratedVideoStoryboards.find((s) => s.slug === slug);
}

export function getAllIllustratedVideoSlugs(): string[] {
  return illustratedVideoStoryboards.map((s) => s.slug);
}

export function getIllustratedVideoLessons(): VideoStoryboard[] {
  return illustratedVideoStoryboards;
}

export function getRecommendedVideoLessons(limit = 4): VideoStoryboard[] {
  return illustratedVideoStoryboards.slice(0, limit);
}

export function getVideosForCourse(courseSlug: string): VideoStoryboard[] {
  return illustratedVideoStoryboards.filter((s) => s.relatedCourse === courseSlug);
}
