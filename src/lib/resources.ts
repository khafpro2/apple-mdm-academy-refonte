export type ResourceBadge = "Apple" | "Intune" | "Jamf" | "Sécurité";

import { advancedResources } from "@/lib/data/advanced-tracks/resources-data";
import { altMdmResources } from "@/lib/data/alternative-mdm-tracks/resources-data";

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
  category: ResourceCategory;
  level: ResourceLevel;
  badge: ResourceBadge;
  module: string;
  relatedCourseSlug: string;
  relatedLabSlug: string;
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
  ...advancedResources,
  ...altMdmResources,
];

export const RESOURCE_CATEGORIES: ResourceCategory[] = ["checklist", "terminal", "template", "procedure"];

export const RESOURCE_LEVELS: ResourceLevel[] = ["Débutant", "Intermédiaire", "Fondamental", "Avancé"];

export const RESOURCE_BADGES: ResourceBadge[] = ["Apple", "Intune", "Jamf", "Sécurité"];

export function getResource(slug: string): AcademyResource | undefined {
  return academyResources.find((r) => r.slug === slug);
}

export function getResourceSlugs(): string[] {
  return academyResources.map((r) => r.slug);
}

export function getPopularResources(): AcademyResource[] {
  return academyResources.filter((r) => r.popular);
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
