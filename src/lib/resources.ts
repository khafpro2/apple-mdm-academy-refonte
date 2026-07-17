export type ResourceBadge = "Apple" | "Intune" | "Jamf" | "Sécurité";

import { advancedResources } from "@/lib/data/advanced-tracks/resources-data";
import { jamfTrainingResources } from "@/lib/data/jamf/jamf-training-resources";
import { JAMF_FUNDAMENTALS_PREMIUM_RESOURCES } from "@/lib/data/jamf/jamf-fundamentals-premium-resources";
import { platformDeploymentGuides } from "@/lib/data/apple-platform-deployment/resources-guides";
import { videoLinkedResources } from "@/src/lib/video-linked-resources";
import { isTrackVisible } from "@/lib/data/tracks";

export type ResourceCategory = "checklist" | "terminal" | "template" | "procedure";

export type ResourceLevel = "Débutant" | "Intermédiaire" | "Fondamental" | "Avancé";

export type ResourceSection = {
  title: string;
  items: string[];
};

export type AcademyResource = {
  slug: string;
  title: string;
  description: string;
  /** Objectif pédagogique (ressources vidéo LMS) */
  objective?: string;
  category: ResourceCategory;
  level: ResourceLevel;
  badge: ResourceBadge;
  module: string;
  relatedCourseSlug: string;
  relatedLabSlug: string;
  /** Slug vidéo illustrée associée (/videos/[slug]) */
  relatedVideoSlug?: string;
  sections: ResourceSection[];
  relatedResourceSlugs?: string[];
  popular?: boolean;
};

function res(
  entry: Omit<AcademyResource, "sections"> & { sections: ResourceSection[] }
): AcademyResource {
  return entry;
}

export const academyResources: AcademyResource[] = [
  res({
    slug: "checklist-abm",
    title: "Checklist Apple Business Manager",
    description: "Configuration complète d'Apple Business Manager pour un déploiement MDM enterprise.",
    category: "checklist",
    level: "Débutant",
    badge: "Apple",
    module: "Apple Business Manager",
    relatedCourseSlug: "apple-it-professional",
    relatedLabSlug: "abm-intune",
    popular: true,
    relatedResourceSlugs: ["checklist-intune-enrollment", "checklist-ade-iphone"],
    sections: [
      {
        title: "Prérequis",
        items: [
          "Compte Apple Business Manager avec rôle Administrator",
          "D-U-N-S Number validé pour l'organisation",
          "Revendeur agréé Apple configuré pour l'auto-assignation des appareils",
          "Identité fédérée Microsoft Entra ID (optionnel mais recommandé)",
        ],
      },
      {
        title: "Configuration initiale",
        items: [
          "Créer les comptes administrateurs ABM avec MFA activé",
          "Configurer les rôles : Admin, Manager, Device Enrollment Manager",
          "Vérifier l'inventaire des appareils achetés via revendeur agréé",
          "Activer la fédération Microsoft Entra ID si SSO requis",
        ],
      },
      {
        title: "Serveurs MDM",
        items: [
          "Créer un serveur MDM pour Intune (Production)",
          "Créer un serveur MDM pour Jamf Pro si applicable",
          "Télécharger et archiver les tokens server_token.p7m",
          "Documenter les dates d'expiration des tokens",
        ],
      },
      {
        title: "Validation",
        items: [
          "Assigner un appareil test au serveur MDM",
          "Vérifier la synchronisation dans Intune ou Jamf",
          "Exporter l'inventaire ABM pour audit",
        ],
      },
    ],
  }),
  res({
    slug: "checklist-intune-enrollment",
    title: "Checklist Intune Apple Enrollment",
    description: "Étapes pour configurer l'enrollment Apple dans Microsoft Intune.",
    category: "checklist",
    level: "Intermédiaire",
    badge: "Intune",
    module: "Intune Apple Enrollment",
    relatedCourseSlug: "intune-mac",
    relatedLabSlug: "abm-intune",
    popular: true,
    relatedResourceSlugs: ["checklist-abm", "checklist-apns", "checklist-ade-iphone"],
    sections: [
      {
        title: "Certificats et tokens",
        items: [
          "Créer ou renouveler le certificat APNs Apple MDM Push Certificate",
          "Importer le token ABM (.p7m) dans Enrollment Program Tokens",
          "Synchroniser les appareils ADE depuis ABM",
          "Vérifier le statut Active sur chaque token",
        ],
      },
      {
        title: "Profils d'enrollment",
        items: [
          "Créer un profil ADE iOS supervisé",
          "Créer un profil ADE macOS supervisé",
          "Configurer Setup Assistant : Remote Management obligatoire",
          "Définir le nom d'affichage MDM visible par l'utilisateur",
        ],
      },
      {
        title: "Assignation",
        items: [
          "Assigner les profils ADE aux groupes d'appareils synchronisés",
          "Tester sur iPhone et Mac vierge ou effacés",
          "Vérifier le statut Enrolled dans Intune",
        ],
      },
    ],
  }),
  res({
    slug: "checklist-apns",
    title: "Checklist Certificat APNs",
    description: "Création, import et renouvellement du certificat Apple Push Notification pour MDM.",
    category: "checklist",
    level: "Fondamental",
    badge: "Apple",
    module: "APNs",
    relatedCourseSlug: "apple-it-professional",
    relatedLabSlug: "apns",
    relatedResourceSlugs: ["checklist-intune-enrollment", "terminal-macos-admin"],
    sections: [
      {
        title: "Génération CSR",
        items: [
          "Générer une CSR depuis Intune ou Jamf Pro",
          "Ne jamais réutiliser une CSR d'un autre serveur MDM",
          "Conserver la clé privée associée de façon sécurisée",
        ],
      },
      {
        title: "Portail Apple Push",
        items: [
          "Se connecter à identity.apple.com/pushcert",
          "Uploader la CSR et télécharger le certificat .pem",
          "Importer le certificat dans la console MDM",
          "Noter la date d'expiration (365 jours)",
        ],
      },
      {
        title: "Renouvellement",
        items: [
          "Créer une alerte 30 jours avant expiration",
          "Renouveler avec la même Apple ID utilisée initialement",
          "Tester une commande push après renouvellement",
          "Documenter la procédure de renouvellement d'urgence",
        ],
      },
    ],
  }),
  res({
    slug: "checklist-ade-iphone",
    title: "Checklist ADE iPhone",
    description: "Déploiement zero-touch iPhone via Automated Device Enrollment.",
    category: "checklist",
    level: "Intermédiaire",
    badge: "Apple",
    module: "ADE iPhone",
    relatedCourseSlug: "intune-mac",
    relatedLabSlug: "ade-iphone",
    relatedResourceSlugs: ["checklist-intune-enrollment", "checklist-apps-books"],
    sections: [
      {
        title: "Préparation ABM",
        items: [
          "Appareils iPhone assignés au serveur MDM dans ABM",
          "Profil ADE iOS créé avec supervision activée",
          "Skip Setup Assistant configuré (Apple ID, Siri, Analytics)",
        ],
      },
      {
        title: "Activation",
        items: [
          "Allumer l'iPhone neuf ou effacé (Erase All Content)",
          "Vérifier l'écran Remote Management au Setup Assistant",
          "Confirmer l'enrollment dans la console MDM",
          "Valider la supervision : Settings > General > About > MDM",
        ],
      },
      {
        title: "Post-enrollment",
        items: [
          "Déployer profils Wi-Fi, VPN et restrictions",
          "Installer les apps via VPP silencieusement",
          "Vérifier la conformité dans Intune ou Jamf",
        ],
      },
    ],
  }),
  res({
    slug: "checklist-ade-macos",
    title: "Checklist ADE macOS",
    description: "Enrollment automatique Mac supervisé via ADE et PreStage.",
    category: "checklist",
    level: "Intermédiaire",
    badge: "Apple",
    module: "ADE macOS",
    relatedCourseSlug: "intune-mac",
    relatedLabSlug: "ade-macos",
    relatedResourceSlugs: ["template-onboarding-mac", "checklist-filevault"],
    sections: [
      {
        title: "Configuration ADE Mac",
        items: [
          "Mac assignés au serveur MDM dans ABM",
          "Profil ADE macOS ou PreStage Jamf configuré",
          "Compte admin local ou fédéré défini dans le profil",
        ],
      },
      {
        title: "Setup Assistant Mac",
        items: [
          "Effacer le Mac (Erase All Content and Settings) pour test ADE",
          "Vérifier Remote Management à l'activation",
          "Confirmer enrollment et supervision dans MDM",
        ],
      },
      {
        title: "Bootstrap",
        items: [
          "Déployer Platform SSO si Entra ID",
          "Activer FileVault avec escrow MDM",
          "Installer apps métier via VPP ou Jamf",
        ],
      },
    ],
  }),
  res({
    slug: "checklist-apps-books",
    title: "Checklist Apps & Books",
    description: "Achat, synchronisation et déploiement de licences VPP via Apps & Books.",
    category: "checklist",
    level: "Fondamental",
    badge: "Apple",
    module: "Apps & Books",
    relatedCourseSlug: "apple-it-professional",
    relatedLabSlug: "apps-books",
    sections: [
      {
        title: "Token VPP",
        items: [
          "Générer le token Apps & Books dans ABM",
          "Synchroniser le token dans Intune ou Jamf",
          "Vérifier la connexion et la date d'expiration",
        ],
      },
      {
        title: "Licences",
        items: [
          "Acheter les licences en volume dans ABM",
          "Assigner les apps aux utilisateurs ou appareils",
          "Configurer le déploiement silencieux (supervisé requis)",
        ],
      },
      {
        title: "Gestion du cycle de vie",
        items: [
          "Révoquer les licences lors du offboarding",
          "Auditer les apps non utilisées trimestriellement",
          "Documenter les apps approuvées entreprise",
        ],
      },
    ],
  }),
  res({
    slug: "checklist-managed-apple-ids",
    title: "Checklist Managed Apple IDs",
    description: "Création et gestion des Managed Apple IDs en environnement enterprise.",
    category: "checklist",
    level: "Intermédiaire",
    badge: "Apple",
    module: "Managed Apple IDs",
    relatedCourseSlug: "apple-it-professional",
    relatedLabSlug: "managed-apple-ids",
    relatedResourceSlugs: ["template-offboarding-apple", "checklist-abm"],
    sections: [
      {
        title: "Création",
        items: [
          "Activer Managed Apple IDs dans ABM ou ASM",
          "Définir la politique de mot de passe et MFA",
          "Créer les comptes manuellement ou via fédération Entra ID",
        ],
      },
      {
        title: "Fédération",
        items: [
          "Configurer la fédération Microsoft Entra ID",
          "Tester l'authentification SSO sur iCloud.com",
          "Valider le provisioning Just-In-Time",
        ],
      },
      {
        title: "Gouvernance",
        items: [
          "Interdire l'utilisation d'Apple ID personnels sur appareils gérés",
          "Documenter la procédure de reset mot de passe",
          "Auditer les comptes inactifs mensuellement",
        ],
      },
    ],
  }),
  res({
    slug: "checklist-platform-sso",
    title: "Checklist Platform SSO",
    description: "Déploiement Platform SSO macOS avec Microsoft Entra ID.",
    category: "checklist",
    level: "Avancé",
    badge: "Intune",
    module: "Platform SSO",
    relatedCourseSlug: "intune-mac",
    relatedLabSlug: "platform-sso",
    popular: true,
    relatedResourceSlugs: ["checklist-ade-macos", "checklist-managed-apple-ids"],
    sections: [
      {
        title: "Prérequis Entra ID",
        items: [
          "Enterprise Application Platform SSO configurée dans Entra ID",
          "Conditional Access compatible macOS",
          "Mac supervisés enrollés Intune",
        ],
      },
      {
        title: "Profil Intune",
        items: [
          "Déployer l'extension Platform SSO via profil de configuration",
          "Configurer le Team ID et Bundle ID de l'extension",
          "Assigner au groupe Mac cible",
        ],
      },
      {
        title: "Validation utilisateur",
        items: [
          "Premier login macOS avec compte Entra ID",
          "Vérifier l'enregistrement PSSO dans Réglages Système",
          "Tester SSO Safari et apps Microsoft 365",
        ],
      },
    ],
  }),
  res({
    slug: "checklist-filevault",
    title: "Checklist FileVault",
    description: "Activation FileVault 2 via MDM avec escrow des clés de récupération.",
    category: "checklist",
    level: "Avancé",
    badge: "Sécurité",
    module: "FileVault",
    relatedCourseSlug: "apple-it-professional",
    relatedLabSlug: "filevault",
    relatedResourceSlugs: ["checklist-macos-security", "checklist-ade-macos"],
    sections: [
      {
        title: "Profil MDM",
        items: [
          "Créer profil Disk Encryption avec Force encrypt",
          "Activer escrow des clés vers Intune ou Jamf",
          "Définir le type de clé : personal ou institutional",
        ],
      },
      {
        title: "Déploiement",
        items: [
          "Scope aux Mac supervisés uniquement",
          "Planifier une fenêtre de maintenance pour le premier chiffrement",
          "Communiquer aux utilisateurs sur le redémarrage",
        ],
      },
      {
        title: "Recovery",
        items: [
          "Vérifier la clé escrowée dans la console MDM",
          "Documenter la procédure L1/L2 de récupération",
          "Tester la recovery sur Mac lab (non production)",
        ],
      },
    ],
  }),
  res({
    slug: "jamf-smart-groups",
    title: "Smart Groups Jamf Pro 11.16",
    description: "Procédure complète : critères inventaire, preview membership, scope et bonnes pratiques doc officielle.",
    objective: "Créer des Smart Groups fiables pour scope policies, profils et patch policies sans recalcul circulaire.",
    category: "procedure",
    level: "Intermédiaire",
    badge: "Jamf",
    module: "Smart Groups",
    relatedCourseSlug: "jamf-100",
    relatedLabSlug: "jamf-smart-groups",
    relatedResourceSlugs: ["jamf-policies", "checklist-jamf-smart-groups"],
    sections: [
      {
        title: "Architecture (Jamf 11.16)",
        items: [
          "Computers → Smart Computer Groups : membership dynamique basée sur inventaire",
          "Utiliser pour scope, déploiement et actions — pas pour reporting (Advanced Search)",
          "Éviter deux Smart Groups dépendant mutuellement de l'appartenance l'autre",
        ],
      },
      {
        title: "Procédure",
        items: [
          "Computers → Smart Computer Groups → New",
          "Définir critères AND/OR (OS, apps, EA, last check-in)",
          "Preview membership → comparer avec Advanced Search",
          "Scope policy pilote → valider membre / non-membre",
        ],
      },
      {
        title: "Dépannage",
        items: [
          "Membership vide : critères trop restrictifs ou inventaire stale → force recon",
          "Trop de membres : critère trop large → affiner ou ajouter exclusions",
          "Performance : réduire Smart Groups circulaires ou critères coûteux",
        ],
      },
    ],
  }),
  res({
    slug: "jamf-policies",
    title: "Policies Jamf Pro 11.16",
    description: "Triggers, payloads, scope, Self Service et User Interaction selon la documentation Policies.",
    category: "procedure",
    level: "Intermédiaire",
    badge: "Jamf",
    module: "Policies",
    relatedCourseSlug: "jamf-100",
    relatedLabSlug: "jamf-policies",
    relatedResourceSlugs: ["jamf-packages", "jamf-smart-groups"],
    sections: [
      {
        title: "Architecture",
        items: [
          "General : trigger, execution frequency, category, target drive",
          "Payloads : Scripts, Packages, Maintenance, Directory Binding…",
          "Scope + exclusions ; retrait scope ≠ rollback changements déjà appliqués",
        ],
      },
      {
        title: "Procédure Deploy Package (11.16)",
        items: [
          "Computers → Policies → New → General payload",
          "Packages payload → Add → Action Install → Distribution Point",
          "Scope tab → Self Service tab (optionnel) → Save",
        ],
      },
      {
        title: "Bonnes pratiques",
        items: [
          "Policy pilote non destructive avant production",
          "Policy Logs + sudo jamf policy pour test",
          "User Interaction pour deferrals sur actions longues",
        ],
      },
    ],
  }),
  res({
    slug: "jamf-packages",
    title: "Packages Jamf Pro 11.16",
    description: "PKG/DMG, Distribution Point, policy Packages et actions Install/Cache/Uninstall.",
    category: "procedure",
    level: "Intermédiaire",
    badge: "Jamf",
    module: "Packages",
    relatedCourseSlug: "jamf-100",
    relatedLabSlug: "jamf-packages",
    relatedResourceSlugs: ["jamf-policies", "jamf-self-service"],
    sections: [
      {
        title: "Concepts Packages 11.16",
        items: [
          "Package = PKG ou DMG (Composer ou outil tiers)",
          "Distribution Point stocke le fichier ; Jamf Pro référence métadonnées",
          "Déploiement via policy payload Packages — pas via Configuration Profile",
        ],
      },
      {
        title: "Procédure",
        items: [
          "Computers → Packages → New → upload",
          "Computers → Policies → New → Packages payload",
          "Restart Options si reboot requis ; Scope Smart Group pilote",
        ],
      },
      {
        title: "Erreurs fréquentes",
        items: [
          "Package absent du Distribution Point distant",
          "OS requirement non respecté",
          "Action Cache vs Install mal choisie",
        ],
      },
    ],
  }),
  res({
    slug: "jamf-scripts",
    title: "Scripts Jamf Pro 11.16",
    description: "Upload scripts, policy payload Scripts, paramètres, logs et idempotence.",
    category: "procedure",
    level: "Intermédiaire",
    badge: "Jamf",
    module: "Scripts",
    relatedCourseSlug: "jamf-170",
    relatedLabSlug: "jamf-scripts",
    relatedResourceSlugs: ["jamf-policies", "terminal-macos-admin"],
    sections: [
      {
        title: "Architecture",
        items: [
          "Settings → Computer Management → Scripts",
          "Policy → Scripts payload → exécution via jamf framework",
          "Extension Attributes alimentés par scripts pour Smart Groups",
        ],
      },
      {
        title: "Procédure",
        items: [
          "Script idempotent + logging + exit codes explicites",
          "Upload Jamf → policy Once per computer sur pilote",
          "Policy Logs + validation fichier témoin sur Mac",
        ],
      },
      {
        title: "Dépannage",
        items: [
          "Exit 0 sans effet : ajouter validation post-action",
          "PATH/TCC différent du Terminal interactif",
          "Secrets : jamais en clair dans le script",
        ],
      },
    ],
  }),
  res({
    slug: "jamf-patch-management",
    title: "Patch Management Jamf Pro 11.16",
    description: "Software Titles, patch policies, eligible computers et Self Service limitations.",
    category: "procedure",
    level: "Avancé",
    badge: "Jamf",
    module: "Patch Management",
    relatedCourseSlug: "jamf-200",
    relatedLabSlug: "jamf-patch-management",
    relatedResourceSlugs: ["jamf-self-service", "checklist-jamf-patch"],
    sections: [
      {
        title: "Architecture Patch Policy 11.16",
        items: [
          "Software Update Inventory → Software Title → Patch Policy",
          "Eligible computers auto-générés ; preview avant scope",
          "Patch Unknown Versions pour versions inconnues",
        ],
      },
      {
        title: "Procédure",
        items: [
          "Patch Management → Software Titles → Create Patch Policy",
          "General : target version, install auto vs Self Service",
          "Scope pilote → dashboard conformité",
        ],
      },
      {
        title: "Self Service",
        items: [
          "Patch policies disponibles en Self Service mais absentes de la recherche",
          "Description Markdown supportée pour UX utilisateur",
        ],
      },
    ],
  }),
  res({
    slug: "jamf-self-service",
    title: "Self Service Jamf Pro 11.16",
    description: "Branding, catégories, policies utilisateur et catalogue IT contrôlé.",
    category: "procedure",
    level: "Intermédiaire",
    badge: "Jamf",
    module: "Self Service",
    relatedCourseSlug: "jamf-100",
    relatedLabSlug: "jamf-self-service",
    relatedResourceSlugs: ["jamf-policies", "jamf-patch-management"],
    sections: [
      {
        title: "Architecture",
        items: [
          "Settings → Self Service macOS/iOS + app sur appareil",
          "Policies exposées via onglet Self Service",
          "Apps VPP / eBooks selon scope et licences",
        ],
      },
      {
        title: "Procédure",
        items: [
          "Branding : logo, couleurs, notifications",
          "Catégories catalogue + policies pilotes non destructives",
          "Test utilisateur : deferrals, messages, logs",
        ],
      },
      {
        title: "Bonnes pratiques",
        items: [
          "Catalogue limité et compréhensible",
          "Jamais de policy destructive sans garde-fous",
          "Documenter limites patch policies dans recherche SS",
        ],
      },
    ],
  }),
  res({
    slug: "checklist-jamf-fundamentals",
    title: "Checklist Jamf Pro Fundamentals",
    description: "Premiers pas avec Jamf Pro : instance, APNs, enrollment et inventaire.",
    category: "checklist",
    level: "Débutant",
    badge: "Jamf",
    module: "Jamf Pro Fundamentals",
    relatedCourseSlug: "jamf-100",
    relatedLabSlug: "jamf-discovery",
    popular: true,
    relatedResourceSlugs: ["checklist-jamf-smart-groups", "checklist-jamf-policies"],
    sections: [
      {
        title: "Instance Jamf Pro",
        items: [
          "Accès admin à l'instance Jamf Pro (cloud ou on-prem)",
          "Certificat APNs configuré et valide",
          "Connexion ABM avec token ADE synchronisé",
        ],
      },
      {
        title: "Enrollment",
        items: [
          "PreStage Enrollment créé pour Mac production",
          "Mac test enrollé et visible dans Computers",
          "Check-in récent confirmé (< 24h)",
        ],
      },
      {
        title: "Inventaire",
        items: [
          "Extension Attributes de base configurés",
          "Recherche avancée testée",
          "Rapport d'inventaire exporté",
        ],
      },
    ],
  }),
  res({
    slug: "checklist-jamf-smart-groups",
    title: "Checklist Smart Groups Jamf",
    description: "Création et validation de Smart Groups dynamiques Jamf Pro.",
    category: "checklist",
    level: "Intermédiaire",
    badge: "Jamf",
    module: "Smart Groups Jamf",
    relatedCourseSlug: "jamf-100",
    relatedLabSlug: "jamf-smart-groups",
    relatedResourceSlugs: ["checklist-jamf-policies", "checklist-jamf-fundamentals"],
    sections: [
      {
        title: "Extension Attributes",
        items: [
          "Créer les EA nécessaires (script ou pattern inventory)",
          "Vérifier la remontée des valeurs sur Mac test",
          "Documenter le format attendu de chaque EA",
        ],
      },
      {
        title: "Smart Group",
        items: [
          "Définir les critères AND/OR (OS version, app, EA)",
          "Nommer selon convention : SG-MacOS-14-Production",
          "Valider les membres sur un échantillon de 5 Mac",
        ],
      },
      {
        title: "Utilisation",
        items: [
          "Scope une policy test au Smart Group",
          "Vérifier l'exécution sur membre et non-membre",
          "Planifier une revue trimestrielle des critères",
        ],
      },
    ],
  }),
  res({
    slug: "checklist-jamf-policies",
    title: "Checklist Policies Jamf",
    description: "Création, scope et validation d'une Policy Jamf Pro.",
    category: "checklist",
    level: "Intermédiaire",
    badge: "Jamf",
    module: "Policies Jamf",
    relatedCourseSlug: "jamf-100",
    relatedLabSlug: "jamf-policies",
    popular: true,
    relatedResourceSlugs: ["checklist-jamf-smart-groups", "checklist-jamf-scripts"],
    sections: [
      {
        title: "Configuration policy",
        items: [
          "Définir le trigger : Enrollment Complete, Recurring Check-in, Self Service",
          "Configurer la fréquence et la priorité (Before/After)",
          "Ajouter payload : package, script ou maintenance",
        ],
      },
      {
        title: "Scope",
        items: [
          "Scope au Smart Group ou Static Group cible",
          "Ajouter exclusions pour Mac VIP ou lab",
          "Activer la policy (Enabled)",
        ],
      },
      {
        title: "Test et logs",
        items: [
          "Exécuter sudo jamf policy sur Mac test",
          "Consulter /var/log/jamf.log et Policy Logs Jamf",
          "Valider le résultat attendu sur l'appareil",
        ],
      },
    ],
  }),
  res({
    slug: "checklist-jamf-scripts",
    title: "Checklist Scripts Jamf",
    description: "Bonnes pratiques pour scripts shell Jamf Pro idempotents.",
    category: "checklist",
    level: "Intermédiaire",
    badge: "Jamf",
    module: "Scripts Jamf",
    relatedCourseSlug: "jamf-170",
    relatedLabSlug: "jamf-scripts",
    relatedResourceSlugs: ["checklist-jamf-policies", "terminal-macos-admin"],
    sections: [
      {
        title: "Rédaction",
        items: [
          "Script idempotent : safe to re-run",
          "Shebang #!/bin/bash et set -euo pipefail",
          "Logging vers /var/log/ ou fichier témoin",
          "Exit code 0 = succès, non-zero = échec",
        ],
      },
      {
        title: "Déploiement",
        items: [
          "Upload script dans Jamf Pro > Settings > Scripts",
          "Créer policy avec payload Scripts, fréquence Once per computer",
          "Scope au Smart Group pilote (1 Mac)",
        ],
      },
      {
        title: "Validation",
        items: [
          "Vérifier Policy Logs dans Jamf",
          "Confirmer le résultat sur le Mac cible",
          "Documenter le script dans Confluence/wiki IT",
        ],
      },
    ],
  }),
  res({
    slug: "checklist-jamf-patch",
    title: "Checklist Patch Management",
    description: "Software Update Inventory et patch policies Jamf Pro.",
    category: "checklist",
    level: "Avancé",
    badge: "Jamf",
    module: "Patch Management",
    relatedCourseSlug: "jamf-200",
    relatedLabSlug: "jamf-patch-management",
    relatedResourceSlugs: ["checklist-jamf-protect", "checklist-macos-security"],
    sections: [
      {
        title: "Inventaire",
        items: [
          "Activer Software Update Inventory sur les Mac",
          "Vérifier les updates disponibles dans Patch Management",
          "Identifier les Mac en retard de version OS",
        ],
      },
      {
        title: "Patch Policy",
        items: [
          "Créer patch policy pour update macOS cible",
          "Définir deadline, notifications et deferral",
          "Scope au groupe pilote puis production",
        ],
      },
      {
        title: "Conformité",
        items: [
          "Surveiller le dashboard Patch Management",
          "Exporter rapport de conformité mensuel",
          "Traiter les échecs et Mac offline",
        ],
      },
    ],
  }),
  res({
    slug: "checklist-jamf-protect",
    title: "Checklist Jamf Protect",
    description: "Déploiement Jamf Protect : intégration, plan et alertes.",
    category: "checklist",
    level: "Avancé",
    badge: "Jamf",
    module: "Jamf Protect",
    relatedCourseSlug: "jamf-200",
    relatedLabSlug: "jamf-protect",
    relatedResourceSlugs: ["checklist-jamf-patch", "checklist-macos-security"],
    sections: [
      {
        title: "Intégration",
        items: [
          "Licence Jamf Protect active",
          "Connecter Jamf Pro dans Protect portal (Connected)",
          "Vérifier la sync inventaire Mac",
        ],
      },
      {
        title: "Plan Protect",
        items: [
          "Créer plan avec analytics et telemetry",
          "Publier le plan et assigner au groupe pilote",
          "Confirmer installation agent sur Mac test",
        ],
      },
      {
        title: "Opérations",
        items: [
          "Configurer alertes et notifications SOC",
          "Tester détection (EICAR ou test Protect)",
          "Documenter procédure réponse incident",
        ],
      },
    ],
  }),
  res({
    slug: "checklist-macos-security",
    title: "Checklist Sécurité macOS",
    description: "Durcissement macOS enterprise : Gatekeeper, SIP, firewall et conformité.",
    category: "checklist",
    level: "Avancé",
    badge: "Sécurité",
    module: "Sécurité macOS",
    relatedCourseSlug: "apple-fundamentals",
    relatedLabSlug: "macos-security",
    popular: true,
    relatedResourceSlugs: ["checklist-filevault", "terminal-macos-admin"],
    sections: [
      {
        title: "Contrôles système",
        items: [
          "FileVault activé avec escrow MDM",
          "Gatekeeper : apps App Store et développeurs identifiés",
          "Firewall macOS activé via profil MDM",
          "SIP (System Integrity Protection) activé — ne pas désactiver",
        ],
      },
      {
        title: "Restrictions MDM",
        items: [
          "Bloquer USB selon politique DLP",
          "Désactiver iCloud non autorisé si requis",
          "Activation Lock géré via ABM",
        ],
      },
      {
        title: "Audit",
        items: [
          "Compliance policy Intune ou extension Jamf",
          "Rapport mensuel des Mac non conformes",
          "Plan de remédiation documenté",
        ],
      },
    ],
  }),
  res({
    slug: "terminal-macos-admin",
    title: "Commandes Terminal macOS Admin",
    description: "Référence des commandes Terminal essentielles pour administrateurs Apple MDM.",
    category: "terminal",
    level: "Intermédiaire",
    badge: "Sécurité",
    module: "Administration macOS",
    relatedCourseSlug: "apple-fundamentals",
    relatedLabSlug: "macos-security",
    popular: true,
    relatedResourceSlugs: ["checklist-macos-security", "checklist-jamf-scripts"],
    sections: [
      {
        title: "Profils et MDM",
        items: [
          "profiles list -type configuration",
          "profiles status -type enrollment",
          "sudo profiles renew -type enrollment",
          "sudo jamf policy",
          "sudo jamf recon",
        ],
      },
      {
        title: "FileVault",
        items: [
          "fdesetup status",
          "fdesetup list",
          "diskutil apfs list",
        ],
      },
      {
        title: "Réseau et diagnostic",
        items: [
          "networksetup -listallhardwareports",
          "scutil --dns",
          "log show --predicate 'process == \"jamf\"' --last 1h",
          "system_profiler SPHardwareDataType",
        ],
      },
      {
        title: "APNs et certificats",
        items: [
          "openssl x509 -in apns.pem -noout -dates",
          "security find-identity -v -p codesigning",
        ],
      },
    ],
  }),
  res({
    slug: "template-mdm-documentation",
    title: "Modèle documentation MDM entreprise",
    description: "Template de documentation architecture MDM pour équipes IT.",
    category: "template",
    level: "Avancé",
    badge: "Apple",
    module: "Architecture MDM",
    relatedCourseSlug: "apple-it-professional",
    relatedLabSlug: "abm-intune",
    relatedResourceSlugs: ["checklist-abm", "checklist-intune-enrollment"],
    sections: [
      {
        title: "1. Vue d'ensemble",
        items: [
          "Objectif du déploiement MDM et périmètre (Mac, iPhone, iPad)",
          "Solutions retenues : ABM, Intune/Jamf, identity provider",
          "Schéma d'architecture (ABM → MDM → appareils)",
        ],
      },
      {
        title: "2. Comptes et accès",
        items: [
          "Liste des comptes ABM, MDM, Entra ID avec rôles",
          "Procédure MFA et principe moindre privilège",
          "Contacts escalation L2/L3",
        ],
      },
      {
        title: "3. Flux enrollment",
        items: [
          "Flux ADE iPhone et Mac step-by-step",
          "Profils par persona (standard, VIP, lab)",
          "SLA activation zero-touch",
        ],
      },
      {
        title: "4. Opérations",
        items: [
          "Calendrier renouvellement APNs et tokens ABM",
          "Procédures patch OS et apps",
          "Runbooks incident MDM",
        ],
      },
    ],
  }),
  res({
    slug: "template-onboarding-mac",
    title: "Modèle procédure onboarding Mac",
    description: "Procédure standard d'intégration d'un nouveau collaborateur sur Mac géré.",
    category: "procedure",
    level: "Intermédiaire",
    badge: "Intune",
    module: "Onboarding Mac",
    relatedCourseSlug: "intune-mac",
    relatedLabSlug: "ade-macos",
    relatedResourceSlugs: ["checklist-ade-macos", "checklist-platform-sso"],
    sections: [
      {
        title: "Avant livraison",
        items: [
          "Commander Mac via revendeur agréé ABM",
          "Assigner appareil au serveur MDM dans ABM",
          "Vérifier PreStage/ADE profile assigné",
        ],
      },
      {
        title: "Remise au collaborateur",
        items: [
          "Mac neuf : activation Setup Assistant zero-touch",
          "Login compte Entra ID / Managed Apple ID",
          "Platform SSO enrollment si applicable",
        ],
      },
      {
        title: "Post-livraison (J+1)",
        items: [
          "Vérifier apps métier installées (Teams, Outlook, VPN)",
          "Confirmer FileVault actif et clé escrowée",
          "Ticket helpdesk clôturé — Mac conforme",
        ],
      },
    ],
  }),
  res({
    slug: "template-offboarding-apple",
    title: "Modèle procédure offboarding Apple",
    description: "Procédure de départ collaborateur : révocation accès et effacement appareils Apple.",
    category: "procedure",
    level: "Intermédiaire",
    badge: "Apple",
    module: "Offboarding Apple",
    relatedCourseSlug: "apple-it-professional",
    relatedLabSlug: "managed-apple-ids",
    relatedResourceSlugs: ["checklist-managed-apple-ids", "checklist-apps-books"],
    sections: [
      {
        title: "Révocation accès (J-0)",
        items: [
          "Désactiver compte Entra ID / Managed Apple ID",
          "Révoquer licences VPP assignées à l'utilisateur",
          "Retirer des groupes MDM et distribution lists",
        ],
      },
      {
        title: "Appareils",
        items: [
          "Remote Lock ou Erase via Intune/Jamf si Mac/iPhone entreprise",
          "Vérifier Activation Lock bypass via ABM si requis",
          "Retirer appareil de l'inventaire ABM si reassignment",
        ],
      },
      {
        title: "Clôture",
        items: [
          "Exporter preuve d'effacement pour audit RH",
          "Archiver ticket offboarding",
          "Mettre à jour CMDB inventaire IT",
        ],
      },
    ],
  }),
  res({
    slug: "intune-apns-guide",
    title: "Guide APNs Intune — Microsoft Learn",
    description: "Création, import et renouvellement du certificat Apple MDM Push dans Intune.",
    category: "procedure",
    level: "Intermédiaire",
    badge: "Intune",
    module: "APNs",
    relatedCourseSlug: "intune-mac",
    relatedLabSlug: "apns",
    relatedVideoSlug: "apns",
    relatedResourceSlugs: ["checklist-apns", "intune-ade-guide"],
    sections: [
      {
        title: "Prérequis",
        items: [
          "Apple ID entreprise dédié MDM (jamais personnel)",
          "Rôle Intune Administrator",
          "Accès identity.apple.com/pushcert",
        ],
      },
      {
        title: "Procédure",
        items: [
          "Intune → Devices → Enrollment → Apple → Apple MDM Push Certificate → Create CSR",
          "Upload CSR sur identity.apple.com/pushcert",
          "Download .pem immédiatement (une seule chance)",
          "Import .pem dans Intune → vérifier expiration",
        ],
      },
      {
        title: "Renouvellement",
        items: [
          "Alerte calendrier J-30",
          "Renouveler avec le MÊME Apple ID",
          "Documenter Apple ID + date dans runbook IT",
        ],
      },
    ],
  }),
  res({
    slug: "intune-ade-guide",
    title: "Guide ADE Intune — Microsoft Learn",
    description: "Automated Device Enrollment iOS et macOS via Apple Business Manager et Intune.",
    category: "procedure",
    level: "Intermédiaire",
    badge: "Intune",
    module: "ADE",
    relatedCourseSlug: "intune-mac",
    relatedLabSlug: "ade-iphone",
    relatedVideoSlug: "ade-iphone",
    relatedResourceSlugs: ["checklist-ade-iphone", "intune-apns-guide"],
    sections: [
      {
        title: "Architecture",
        items: [
          "ABM inventaire → assignation serveur MDM → token Intune → profils ADE",
          "Supervision automatique pour appareils organisation",
          "Locked enrollment empêche retrait MDM utilisateur",
        ],
      },
      {
        title: "Profils ADE",
        items: [
          "Profils distincts iOS et macOS recommandés",
          "Skip Setup Items selon politique entreprise",
          "Await Device Configured pour retarder fin Setup Assistant",
        ],
      },
      {
        title: "Validation",
        items: [
          "Remote Management au Setup Assistant",
          "Intune : Managed + Supervised",
          "Profils Required en Succeeded",
        ],
      },
    ],
  }),
  res({
    slug: "intune-compliance-guide",
    title: "Guide Compliance Intune Apple",
    description: "Compliance policies macOS/iOS, actions non-conformité et lien Entra ID.",
    category: "procedure",
    level: "Intermédiaire",
    badge: "Intune",
    module: "Compliance",
    relatedCourseSlug: "intune-mac",
    relatedLabSlug: "intune-compliance",
    relatedResourceSlugs: ["intune-conditional-access-guide"],
    sections: [
      {
        title: "Règles Apple",
        items: [
          "OS min/max, jailbreak/root detection",
          "FileVault required (macOS)",
          "Microsoft Defender threat level (macOS)",
        ],
      },
      {
        title: "Actions",
        items: [
          "Notifications utilisateur",
          "Email admin",
          "Retire device après grace period",
        ],
      },
      {
        title: "Dépannage",
        items: [
          "Délai evaluation jusqu'à 4h — force sync accélère",
          "Vérifier assignment groupes dynamiques",
          "Device compliance blade pour détail règles",
        ],
      },
    ],
  }),
  res({
    slug: "intune-platform-sso-guide",
    title: "Guide Platform SSO Intune macOS",
    description: "Configuration Platform SSO avec Microsoft Entra ID et profil Intune.",
    category: "procedure",
    level: "Avancé",
    badge: "Intune",
    module: "Platform SSO",
    relatedCourseSlug: "intune-mac",
    relatedLabSlug: "platform-sso",
    relatedVideoSlug: "platform-sso",
    relatedResourceSlugs: ["checklist-platform-sso"],
    sections: [
      {
        title: "Prérequis",
        items: [
          "macOS 14+ sur Mac ADE enrollé",
          "Application Enterprise SSO dans Entra ID",
          "Extension Microsoft Enterprise SSO plug-in",
        ],
      },
      {
        title: "Profil Intune",
        items: [
          "Configuration profile → macOS → Platform SSO",
          "Team ID et bundle identifier extension",
          "Assign Required aux Mac cibles",
        ],
      },
      {
        title: "Tests",
        items: [
          "Login utilisateur Entra au Mac",
          "Apps M365 sans re-saisie mot de passe",
          "MFA via Conditional Access si requis",
        ],
      },
    ],
  }),
  res({
    slug: "intune-defender-guide",
    title: "Guide Microsoft Defender macOS Intune",
    description: "Onboarding Defender for Endpoint sur Mac via Endpoint security Intune.",
    category: "procedure",
    level: "Avancé",
    badge: "Intune",
    module: "Defender",
    relatedCourseSlug: "intune-mac",
    relatedLabSlug: "defender-macos-intune",
    relatedVideoSlug: "defender-macos",
    sections: [
      {
        title: "Licences",
        items: [
          "Microsoft Defender for Endpoint plan 1 ou 2",
          "Vérification M365 Defender portal → licensing",
        ],
      },
      {
        title: "Déploiement",
        items: [
          "Intune → Endpoint security → Microsoft Defender ATP",
          "macOS onboarding policy → assign Mac corporate",
          "Full Disk Access si agent degraded",
        ],
      },
      {
        title: "Compliance",
        items: [
          "Option : require Defender healthy dans compliance policy",
          "Intégration threat level avec Conditional Access",
        ],
      },
    ],
  }),
  res({
    slug: "intune-conditional-access-guide",
    title: "Guide Conditional Access Apple",
    description: "Entra Conditional Access avec conformité Intune pour Mac et iOS.",
    category: "procedure",
    level: "Avancé",
    badge: "Intune",
    module: "Conditional Access",
    relatedCourseSlug: "intune-mac",
    relatedLabSlug: "intune-conditional-access-mac",
    relatedVideoSlug: "conditional-access-apple",
    relatedResourceSlugs: ["intune-compliance-guide"],
    sections: [
      {
        title: "Conception",
        items: [
          "Report-only avant enforcement",
          "Exclure comptes break-glass",
          "Require compliant device pour M365",
        ],
      },
      {
        title: "Tests",
        items: [
          "What If tool Entra",
          "Sign-in logs conditionalAccessStatus",
          "Mac conforme vs non conforme",
        ],
      },
      {
        title: "Erreurs fréquentes",
        items: [
          "Compliance unknown (policy non assignée)",
          "Enforcement global sans pilote",
          "Oublier App Protection pour BYOD",
        ],
      },
    ],
  }),
  res({
    slug: "intune-troubleshooting-guide",
    title: "Guide dépannage Intune Apple",
    description: "Méthode de troubleshooting enrollment, profils, compliance et apps.",
    category: "procedure",
    level: "Avancé",
    badge: "Intune",
    module: "Troubleshooting",
    relatedCourseSlug: "intune-mac",
    relatedLabSlug: "intune-compliance",
    relatedResourceSlugs: ["intune-apns-guide", "intune-ade-guide"],
    sections: [
      {
        title: "Méthode en couches",
        items: [
          "1. APNs actif → 2. Token ABM → 3. Enrollment → 4. Profils → 5. Compliance → 6. CA → 7. Apps",
          "Intune device timeline + per-setting errors",
          "Entra sign-in logs pour CA",
        ],
      },
      {
        title: "Enrollment",
        items: [
          "Token expiré / appareil non assigné ABM",
          "Profil ADE manquant",
          "APNs invalide → commandes pending",
        ],
      },
      {
        title: "Profils & apps",
        items: [
          "Conflit payload → isoler profils",
          "Supervision requise pour certaines restrictions",
          "VPP licences non assignées MDM server",
        ],
      },
    ],
  }),
  ...videoLinkedResources,
  ...platformDeploymentGuides,
  ...jamfTrainingResources,
  ...JAMF_FUNDAMENTALS_PREMIUM_RESOURCES,
  ...advancedResources,
];

export const RESOURCE_CATEGORIES: ResourceCategory[] = ["checklist", "terminal", "template", "procedure"];

export const RESOURCE_LEVELS: ResourceLevel[] = ["Débutant", "Intermédiaire", "Fondamental", "Avancé"];

export const RESOURCE_BADGES: ResourceBadge[] = ["Apple", "Intune", "Jamf", "Sécurité"];

export function getResource(slug: string): AcademyResource | undefined {
  return academyResources.find((r) => r.slug === slug);
}

/** Ressources liées à un parcours public V1 (ou sans lien parcours). */
export function getVisibleResources(): AcademyResource[] {
  return academyResources.filter((r) => {
    if (!r.relatedCourseSlug) return true;
    return isTrackVisible(r.relatedCourseSlug);
  });
}

export function getResourceSlugs(): string[] {
  return getVisibleResources().map((r) => r.slug);
}

export function getPopularResources(): AcademyResource[] {
  return getVisibleResources().filter((r) => r.popular);
}

export function getResourcesByBadge(badge: ResourceBadge): AcademyResource[] {
  return academyResources.filter((r) => r.badge === badge);
}

export function getResourcesByCourse(courseSlug: string): AcademyResource[] {
  return academyResources.filter((r) => r.relatedCourseSlug === courseSlug);
}

export function resourceToPlainText(resource: AcademyResource): string {
  const lines = [
    resource.title,
    resource.description,
    "",
    ...resource.sections.flatMap((s) => [
      `## ${s.title}`,
      ...s.items.map((item) => `- ${item}`),
      "",
    ]),
  ];
  return lines.join("\n").trim();
}

export function getCategoryLabel(category: ResourceCategory): string {
  const labels: Record<ResourceCategory, string> = {
    checklist: "Checklist",
    terminal: "Terminal",
    template: "Modèle",
    procedure: "Procédure",
  };
  return labels[category];
}
