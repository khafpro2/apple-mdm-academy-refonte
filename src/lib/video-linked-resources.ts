import type { AcademyResource, ResourceSection } from "@/src/lib/resources";

function videoResource(
  entry: Omit<AcademyResource, "sections"> & {
    objective: string;
    relatedVideoSlug: string;
    sections: ResourceSection[];
  }
): AcademyResource {
  return {
    ...entry,
    popular: entry.popular ?? true,
  };
}

/** Ressources checklist liées aux 8 vidéos officielles LMS (slugs /resources/*-checklist) */
export const videoLinkedResources: AcademyResource[] = [
  videoResource({
    slug: "apns-checklist",
    title: "Checklist APNs — Apple Push Notification Service",
    description:
      "Guide opérationnel pour créer, importer et renouveler le certificat APNs MDM — prérequis indispensable à toute commande push Intune ou Jamf.",
    objective:
      "Garantir un certificat APNs valide et correctement associé au serveur MDM afin que les appareils Apple reçoivent les commandes (profils, apps, wipe, lock).",
    category: "checklist",
    level: "Fondamental",
    badge: "Apple",
    module: "APNs",
    relatedCourseSlug: "apple-it-professional",
    relatedLabSlug: "apns",
    relatedVideoSlug: "apns",
    relatedResourceSlugs: ["checklist-apns", "checklist-intune-enrollment", "terminal-macos-admin"],
    sections: [
      {
        title: "Prérequis",
        items: [
          "Compte Apple ID dédié à l'organisation (ne jamais utiliser un Apple ID personnel)",
          "Accès admin Intune ou Jamf Pro pour générer la CSR",
          "Certificat MDM Push actif ou procédure de renouvellement documentée",
          "Inventaire des serveurs MDM utilisant le certificat (Intune, Jamf, etc.)",
        ],
      },
      {
        title: "Checklist — création",
        items: [
          "Générer une nouvelle CSR depuis la console MDM (Intune ou Jamf)",
          "Se connecter à identity.apple.com/pushcert avec l'Apple ID organisation",
          "Uploader la CSR et télécharger le certificat .pem",
          "Importer le certificat dans Intune (Apple MDM Push Certificate) ou Jamf (Settings > Global > APNs)",
          "Vérifier le statut Active et noter la date d'expiration",
          "Tester une commande push (sync, lock, ou profil test) sur un appareil enrollé",
        ],
      },
      {
        title: "Erreurs fréquentes",
        items: [
          "Renouveler avec un Apple ID différent de celui utilisé à la création → certificat invalide",
          "Réutiliser une CSR d'un autre environnement (prod/test) → push silencieux en échec",
          "Oublier de renouveler avant expiration → toutes les commandes MDM bloquées",
          "Certificat APNs Jamf et Intune mélangés sur le même topic → conflits push",
          "Ne pas tester après import → découverte du problème en production",
        ],
      },
      {
        title: "Bonnes pratiques",
        items: [
          "Créer une alerte 30 et 7 jours avant expiration (calendrier + ticket ITSM)",
          "Documenter l'Apple ID, la date de création et le propriétaire du certificat",
          "Conserver la procédure de renouvellement d'urgence accessible 24/7",
          "Un certificat APNs par environnement MDM (prod / test)",
          "Auditer trimestriellement la validité depuis /admin/video-pipeline ou la console MDM",
        ],
      },
    ],
  }),
  videoResource({
    slug: "managed-apple-ids-checklist",
    title: "Checklist Managed Apple IDs",
    description:
      "Création, fédération et gouvernance des Managed Apple IDs pour séparer identité personnelle et identité entreprise sur le parc Apple.",
    objective:
      "Déployer des Managed Apple IDs fédérés à Entra ID pour l'accès iCloud services, App Store volume et continuité utilisateur sans Apple ID personnel.",
    category: "checklist",
    level: "Intermédiaire",
    badge: "Apple",
    module: "Managed Apple IDs",
    relatedCourseSlug: "apple-it-professional",
    relatedLabSlug: "managed-apple-ids",
    relatedVideoSlug: "managed-apple-ids",
    relatedResourceSlugs: ["checklist-managed-apple-ids", "checklist-abm", "template-offboarding-apple"],
    sections: [
      {
        title: "Prérequis",
        items: [
          "Apple Business Manager avec rôle Administrator",
          "Microsoft Entra ID configuré pour la fédération (optionnel mais recommandé)",
          "Politique entreprise sur l'usage des Apple ID personnels",
          "Communication RH/IT sur le changement d'identité iCloud",
        ],
      },
      {
        title: "Checklist — déploiement",
        items: [
          "Activer Managed Apple IDs dans ABM ou Apple School Manager",
          "Définir politique mot de passe, MFA et domaines autorisés",
          "Configurer la fédération Microsoft Entra ID (SCIM + SSO)",
          "Créer ou synchroniser les comptes (manuel, CSV ou JIT)",
          "Tester connexion iCloud.com et App Store avec compte géré",
          "Bloquer ou restreindre Apple ID personnels via restriction MDM si requis",
        ],
      },
      {
        title: "Erreurs fréquentes",
        items: [
          "Mélanger Apple ID personnel et Managed Apple ID sur le même appareil supervisé",
          "Oublier de configurer le domaine fédéré avant le provisioning JIT",
          "Ne pas documenter la procédure reset mot de passe → blocage utilisateur",
          "Comptes orphelins après offboarding (licences et données iCloud)",
          "Fédération Entra ID mal configurée → échec login iCloud services",
        ],
      },
      {
        title: "Bonnes pratiques",
        items: [
          "Interdire Apple ID personnels sur appareils gérés via profil de restriction",
          "Auditer les comptes inactifs mensuellement dans ABM",
          "Lier offboarding RH → désactivation Managed Apple ID + révocation licences",
          "Former le support L1 sur la différence Apple ID / Managed Apple ID",
          "Documenter les services iCloud autorisés (Drive, Keychain, etc.)",
        ],
      },
    ],
  }),
  videoResource({
    slug: "platform-sso-checklist",
    title: "Checklist Platform SSO macOS",
    description:
      "Déploiement Platform SSO (PSSO) sur macOS supervisés avec Microsoft Entra ID — login local, SSO apps et Conditional Access.",
    objective:
      "Permettre aux utilisateurs macOS de s'authentifier avec leur compte Entra ID au login et bénéficier du SSO natif dans Safari et les apps Microsoft 365.",
    category: "checklist",
    level: "Avancé",
    badge: "Intune",
    module: "Platform SSO",
    relatedCourseSlug: "intune-mac",
    relatedLabSlug: "platform-sso",
    relatedVideoSlug: "platform-sso",
    relatedResourceSlugs: ["checklist-platform-sso", "checklist-ade-macos", "managed-apple-ids-checklist"],
    sections: [
      {
        title: "Prérequis",
        items: [
          "Mac supervisés enrollés via ADE dans Intune",
          "Enterprise Application Platform SSO configurée dans Entra ID",
          "Conditional Access compatible macOS (compliance + app protection)",
          "Extension Platform SSO Microsoft installable via profil MDM",
        ],
      },
      {
        title: "Checklist — déploiement",
        items: [
          "Créer l'Enterprise Application PSSO dans Entra ID (macOS)",
          "Déployer le profil Platform SSO via Intune (Team ID + Bundle ID extension)",
          "Configurer les clés d'enregistrement et le redirect URI",
          "Assigner le profil au groupe Mac cible (pilote puis production)",
          "Premier login utilisateur : vérifier enregistrement PSSO dans Réglages Système",
          "Tester SSO Safari, Outlook, Teams et apps Microsoft 365",
        ],
      },
      {
        title: "Erreurs fréquentes",
        items: [
          "Mac non supervisé → profil PSSO refusé ou comportement instable",
          "Team ID ou Bundle ID incorrect dans le profil Intune",
          "Conditional Access trop restrictif → boucle d'authentification",
          "Déploiement massif sans pilote → tickets support en cascade",
          "Oublier la révocation PSSO lors du offboarding",
        ],
      },
      {
        title: "Bonnes pratiques",
        items: [
          "Pilote sur 5–10 Mac représentatifs avant déploiement global",
          "Documenter la procédure de désenregistrement PSSO (offboarding)",
          "Monitorer les échecs d'enregistrement via logs Intune et Entra sign-in",
          "Combiner PSSO avec compliance policy macOS",
          "Former le support sur la différence login local / Azure AD join / PSSO",
        ],
      },
    ],
  }),
  videoResource({
    slug: "filevault-checklist",
    title: "Checklist FileVault — chiffrement macOS",
    description:
      "Activation FileVault 2 via MDM avec escrow des clés de récupération — conformité, déploiement et procédures L1/L2.",
    objective:
      "Chiffrer le stockage macOS de façon transparente pour l'utilisateur tout en escrowant les clés de récupération dans Intune ou Jamf pour le support.",
    category: "checklist",
    level: "Avancé",
    badge: "Sécurité",
    module: "FileVault",
    relatedCourseSlug: "apple-it-professional",
    relatedLabSlug: "filevault",
    relatedVideoSlug: "filevault",
    relatedResourceSlugs: ["checklist-filevault", "checklist-macos-security", "checklist-ade-macos"],
    sections: [
      {
        title: "Prérequis",
        items: [
          "Mac supervisés enrollés MDM (ADE recommandé)",
          "Console MDM avec escrow FileVault activé (Intune ou Jamf)",
          "Fenêtre de maintenance communiquée aux utilisateurs",
          "Procédure L2 de recovery documentée et testée en lab",
        ],
      },
      {
        title: "Checklist — déploiement",
        items: [
          "Créer profil Disk Encryption (Force encrypt) dans Intune ou Jamf",
          "Activer escrow des clés vers la console MDM",
          "Choisir personal recovery key (recommandé) ou institutional",
          "Assigner aux groupes Mac cibles (supervisés uniquement)",
          "Vérifier `fdesetup status` sur Mac pilote après déploiement",
          "Confirmer la clé escrowée visible dans la console MDM",
        ],
      },
      {
        title: "Erreurs fréquentes",
        items: [
          "FileVault forcé sans communication → utilisateurs bloqués au reboot",
          "Escrow non configuré → impossible de récupérer un Mac oublié",
          "Profil appliqué à des Mac non supervisés → échec silencieux",
          "Clé de recovery non synchronisée après changement mot de passe",
          "Recovery testée en production au lieu du lab → perte de données",
        ],
      },
      {
        title: "Bonnes pratiques",
        items: [
          "Pilote sur Mac lab avant déploiement parc entier",
          "Script de monitoring `fdesetup status` via MDM (extension ou policy)",
          "Alerte si escrow key absente 48 h après enrollment",
          "Documenter procédure L1 (redirection L2) vs L2 (recovery key MDM)",
          "Auditer mensuellement le taux de chiffrement dans le rapport compliance Intune/Jamf",
        ],
      },
    ],
  }),
];

export function getVideoLinkedResourceSlugs(): string[] {
  return videoLinkedResources.map((r) => r.slug);
}
