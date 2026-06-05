import type { Lab, LabLevel, LabTechnology } from "@/lib/types";

function lab(
  slug: string,
  title: string,
  description: string,
  level: LabLevel,
  duration: string,
  technology: LabTechnology,
  trackSlug: string,
  objectives: string[],
  prerequisites: string[],
  steps: Lab["steps"],
  expectedResult: string
): Lab {
  return {
    slug,
    title,
    description,
    level,
    duration,
    technology,
    trackSlug,
    objectives,
    prerequisites,
    steps,
    expectedResult,
    objective: objectives[0] ?? description,
  };
}

/** 10 labs premium — slugs alignés sur les leçons */
export const labs: Lab[] = [
  lab(
    "abm-intune",
    "Connecter Apple Business Manager à Intune",
    "Liez votre tenant ABM à Microsoft Intune et importez le jeton d'enrollment pour activer l'ADE.",
    "Intermédiaire",
    "50 min",
    "ABM + Intune",
    "intune-mac",
    [
      "Créer un serveur MDM dans Apple Business Manager",
      "Télécharger et importer le token ABM dans Intune",
      "Synchroniser les appareils ADE",
    ],
    [
      "Compte Apple Business Manager avec rôle Admin",
      "Tenant Microsoft Intune (Endpoint Manager)",
      "Permissions Global Administrator ou Intune Administrator",
    ],
    [
      {
        id: "abm-server",
        title: "Créer le serveur MDM dans ABM",
        instruction:
          "Dans ABM → Réglages → Gestion des appareils, ajoutez un serveur MDM nommé « Intune Production » et uploadez la clé publique MDM depuis Intune.",
        expectedResult: "Le serveur MDM apparaît dans ABM avec le statut « Actif ».",
      },
      {
        id: "download-token",
        title: "Télécharger le token serveur",
        instruction:
          "Sélectionnez le serveur MDM et cliquez sur « Download Token » pour obtenir le fichier server_token.p7m.",
        expectedResult: "Fichier server_token.p7m téléchargé et archivé de façon sécurisée.",
      },
      {
        id: "import-intune",
        title: "Importer le token dans Intune",
        instruction:
          "Intune → Devices → Enrollment → Apple → Enrollment Program Tokens → Add → uploadez le fichier .p7m.",
        expectedResult: "Token ABM visible dans Intune avec statut « Active » et date d'expiration à J+365.",
      },
      {
        id: "sync-devices",
        title: "Synchroniser les appareils",
        instruction:
          "Assignez des appareils au serveur MDM dans ABM, puis forcez une synchronisation dans Intune.",
        expectedResult: "Les appareils ADE apparaissent dans Intune sous Devices > iOS/macOS.",
      },
      {
        id: "verify-enrollment",
        title: "Vérifier le profil d'enrollment",
        instruction:
          "Créez ou assignez un profil ADE par défaut (supervisé, Remote Management) et validez la configuration.",
        expectedResult: "Profil ADE assigné aux appareils cibles, prêt pour zero-touch.",
      },
    ],
    "ABM et Intune sont liés : token valide, appareils synchronisés, profil ADE assigné — prêt pour le déploiement zero-touch."
  ),
  lab(
    "ade-iphone",
    "Déployer un iPhone avec ADE",
    "Configurez un profil ADE iOS et validez l'enrollment zero-touch sur un iPhone neuf ou réinitialisé.",
    "Intermédiaire",
    "45 min",
    "ADE + Intune",
    "intune-mac",
    [
      "Configurer un profil ADE iOS supervisé",
      "Assigner le profil aux appareils",
      "Valider le parcours Setup Assistant",
    ],
    [
      "ABM connecté à Intune (lab abm-intune)",
      "iPhone de test (usine reset ou neuf)",
      "Profil Wi-Fi optionnel pour le lab",
    ],
    [
      {
        id: "profile-ios",
        title: "Créer le profil ADE iOS",
        instruction:
          "Intune → Devices → Enrollment → Apple → Enrollment Program Tokens → sélectionnez le token → Profiles → Create.",
        expectedResult: "Profil avec Supervised, Locked Enrollment et Await Device Configured activés.",
      },
      {
        id: "skip-screens",
        title: "Configurer les écrans ignorés",
        instruction: "Dans le profil ADE, configurez Skip Setup Items : Siri, Apple Pay, Diagnostics, etc.",
        expectedResult: "Liste d'écrans ignorés adaptée au déploiement entreprise.",
      },
      {
        id: "assign-profile",
        title: "Assigner le profil aux appareils",
        instruction: "Assignez le profil ADE au serial number ou au groupe d'appareils dans ABM/Intune.",
        expectedResult: "Appareil(s) cible(s) affichent le profil ADE assigné.",
      },
      {
        id: "test-device",
        title: "Tester sur iPhone",
        instruction: "Réinitialisez l'iPhone (Réglages → Général → Transférer ou réinitialiser) et activez-le.",
        expectedResult: "Écran Remote Management affiché avec le nom de l'organisation.",
      },
      {
        id: "verify-mdm",
        title: "Vérifier l'enrollment MDM",
        instruction: "Confirmez dans Intune que l'iPhone est enrollé, supervisé et conforme.",
        expectedResult: "Fiche appareil Intune : Managed, Supervised, profils en cours d'application.",
      },
    ],
    "iPhone enrollé en zero-touch, mode supervisé actif, visible et géré dans Intune."
  ),
  lab(
    "ade-macos",
    "Déployer un Mac avec ADE",
    "Configurez l'ADE macOS et validez le Setup Assistant avec Remote Management sur un Mac neuf.",
    "Intermédiaire",
    "50 min",
    "ADE + Intune",
    "intune-mac",
    [
      "Créer un profil ADE macOS",
      "Configurer le compte admin optionnel",
      "Valider l'enrollment zero-touch Mac",
    ],
    [
      "Token ABM importé dans Intune",
      "Mac de test Apple Silicon ou Intel",
      "Accès admin Intune",
    ],
    [
      {
        id: "profile-macos",
        title: "Créer le profil ADE macOS",
        instruction: "Créez un profil ADE dédié macOS dans Intune avec supervision activée.",
        expectedResult: "Profil macOS distinct du profil iOS, avec options macOS spécifiques.",
      },
      {
        id: "admin-account",
        title: "Compte administrateur local",
        instruction: "Configurez « Create admin account » ou laissez désactivé selon la politique entreprise.",
        expectedResult: "Option documentée et cohérente avec la politique de l'organisation.",
      },
      {
        id: "assign-mac",
        title: "Assigner le Mac dans ABM",
        instruction: "Vérifiez que le Mac est assigné au serveur MDM Intune dans Apple Business Manager.",
        expectedResult: "Mac visible dans ABM avec assignation MDM correcte.",
      },
      {
        id: "setup-assistant",
        title: "Premier démarrage Mac",
        instruction: "Allumez le Mac ou effacez-le (Recovery → Effacer le Mac) et suivez le Setup Assistant.",
        expectedResult: "Écran Remote Management macOS avec nom de l'organisation.",
      },
      {
        id: "verify-mac-intune",
        title: "Validation Intune",
        instruction: "Vérifiez l'inventaire, la supervision et les profils assignés dans Intune.",
        expectedResult: "Mac enrollé, supervisé, profils de configuration appliqués ou en attente.",
      },
    ],
    "Mac enrollé via ADE, supervisé, géré dans Intune sans intervention IT sur site."
  ),
  lab(
    "apns",
    "Créer et renouveler un certificat APNs",
    "Générez, uploadez et renouvelez le certificat Apple Push Notification service pour votre tenant MDM.",
    "Intermédiaire",
    "40 min",
    "APNs + Apple",
    "intune-mac",
    [
      "Générer une CSR depuis Intune",
      "Obtenir le certificat sur le portail Apple",
      "Importer et planifier le renouvellement",
    ],
    [
      "Apple ID entreprise dédié au MDM (ne pas réutiliser un compte perso)",
      "Accès admin Intune",
      "Accès identity.apple.com/pushcert",
    ],
    [
      {
        id: "csr-intune",
        title: "Générer la CSR dans Intune",
        instruction: "Intune → Devices → Enrollment → Apple → Apple MDM Push Certificate → Create CSR.",
        expectedResult: "Fichier CSR téléchargé, prêt pour le portail Apple.",
      },
      {
        id: "upload-apple",
        title: "Uploader la CSR sur Apple",
        instruction: "Connectez-vous à identity.apple.com/pushcert avec l'Apple ID entreprise et uploadez la CSR.",
        expectedResult: "Certificat généré, bouton Download disponible (une seule chance).",
      },
      {
        id: "download-pem",
        title: "Télécharger le certificat .pem",
        instruction: "Téléchargez immédiatement le certificat et archivez-le avec l'Apple ID utilisé.",
        expectedResult: "Fichier .pem stocké de façon sécurisée avec metadata (Apple ID, date expiration).",
      },
      {
        id: "import-intune-apns",
        title: "Importer dans Intune",
        instruction: "Uploadez le .pem dans Intune et vérifiez la date d'expiration affichée.",
        expectedResult: "Certificat APNs actif dans Intune, commandes MDM fonctionnelles.",
      },
      {
        id: "renewal-plan",
        title: "Planifier le renouvellement",
        instruction: "Documentez le processus de renouvellement avec le MÊME Apple ID et une alerte J-30.",
        expectedResult: "Procédure écrite + rappel calendrier ou ticket récurrent.",
      },
    ],
    "Certificat APNs valide dans Intune, renouvellement planifié, commandes MDM opérationnelles."
  ),
  lab(
    "apps-books",
    "Déployer une app Apps & Books",
    "Achetez des licences VPP dans ABM, synchronisez avec Intune et déployez une app en mode Required.",
    "Intermédiaire",
    "35 min",
    "Apps & Books",
    "intune-mac",
    [
      "Acheter des licences dans ABM",
      "Synchroniser le token VPP avec Intune",
      "Déployer l'app sur des appareils supervisés",
    ],
    [
      "Compte ABM avec rôle acheteur ou admin",
      "Token VPP / Apps & Books configuré",
      "Appareils iOS supervisés de test",
    ],
    [
      {
        id: "purchase-licenses",
        title: "Acheter des licences",
        instruction: "ABM → Apps & Books → recherchez Microsoft Teams (ou Outlook) → achetez des licences device-based ou user-based.",
        expectedResult: "Licences disponibles dans l'inventaire ABM.",
      },
      {
        id: "assign-mdm",
        title: "Assigner au serveur MDM",
        instruction: "Assignez les licences au serveur MDM Intune dans Apps & Books.",
        expectedResult: "Licences « Assigned » au tenant Intune.",
      },
      {
        id: "sync-vpp",
        title: "Synchroniser Intune",
        instruction: "Intune → Tenant administration → Connectors → VPP tokens → Sync.",
        expectedResult: "Apps et licences visibles dans Intune → Apps → iOS.",
      },
      {
        id: "create-app",
        title: "Créer l'app dans Intune",
        instruction: "Ajoutez l'app iOS store/VPP et configurez Assignment type : Required pour appareils supervisés.",
        expectedResult: "App en statut Required pour le groupe cible.",
      },
      {
        id: "verify-install",
        title: "Vérifier l'installation",
        instruction: "Sur l'iPhone supervisé, confirmez l'installation silencieuse ou via Company Portal.",
        expectedResult: "App installée, visible sur l'appareil et dans Intune Device install status.",
      },
    ],
    "Application VPP déployée silencieusement sur appareils supervisés via Intune."
  ),
  lab(
    "managed-apple-ids",
    "Créer un Managed Apple ID",
    "Créez manuellement un Managed Apple ID dans ABM et comprenez les différences avec un Apple ID personnel.",
    "Débutant",
    "30 min",
    "Managed Apple ID",
    "intune-mac",
    [
      "Créer un compte dans ABM",
      "Comprendre les limitations",
      "Préparer la fédération Entra ID",
    ],
    [
      "Accès admin Apple Business Manager",
      "Domaine entreprise vérifié (recommandé)",
    ],
    [
      {
        id: "navigate-accounts",
        title: "Accéder aux comptes",
        instruction: "ABM → Comptes → Managed Apple IDs → cliquez sur le bouton d'ajout.",
        expectedResult: "Formulaire de création de Managed Apple ID affiché.",
      },
      {
        id: "create-account",
        title: "Créer l'utilisateur",
        instruction: "Renseignez prénom, nom, rôle et identifiant (ex. prenom.nom@domaine-federé.appleid.com).",
        expectedResult: "Managed Apple ID créé avec statut actif.",
      },
      {
        id: "assign-role",
        title: "Assigner un rôle",
        instruction: "Définissez le rôle ABM approprié (Admin, Manager, etc.) selon le principe du moindre privilège.",
        expectedResult: "Rôle assigné, permissions documentées.",
      },
      {
        id: "test-signin",
        title: "Tester la connexion",
        instruction: "Connectez-vous sur un appareil géré avec le Managed Apple ID (sans App Store personnel complet).",
        expectedResult: "Connexion réussie, services iCloud organisationnels disponibles.",
      },
      {
        id: "document-limits",
        title: "Documenter les limitations",
        instruction: "Listez ce qui est désactivé vs Apple ID personnel (App Store perso, iCloud Photos, etc.).",
        expectedResult: "Fiche utilisateur ou KB interne à jour.",
      },
    ],
    "Managed Apple ID créé, testé et documenté pour le déploiement à l'échelle."
  ),
  lab(
    "platform-sso",
    "Configurer Platform SSO",
    "Déployez Platform SSO macOS avec Microsoft Entra ID pour une authentification unifiée au login.",
    "Avancé",
    "60 min",
    "Platform SSO",
    "intune-mac",
    [
      "Enregistrer l'application Enterprise dans Entra ID",
      "Créer le profil Platform SSO dans Intune",
      "Valider l'expérience utilisateur au login macOS",
    ],
    [
      "macOS 14+ sur Mac de test",
      "Tenant Entra ID avec permissions admin",
      "Mac enrollé via ADE/Intune",
    ],
    [
      {
        id: "entra-app",
        title: "Application Enterprise Entra ID",
        instruction: "Enregistrez ou vérifiez l'app « Microsoft Enterprise SSO plug-in » dans Entra ID.",
        expectedResult: "Application visible avec redirect URIs et permissions configurées.",
      },
      {
        id: "psso-profile",
        title: "Profil Platform SSO Intune",
        instruction: "Intune → Devices → Configuration → macOS → créez un profil avec le payload Platform SSO.",
        expectedResult: "Extension Identifier, Team ID et URL d'enrollment renseignés.",
      },
      {
        id: "assign-pilot",
        title: "Assigner au groupe pilote",
        instruction: "Assignez le profil à un Smart Group ou groupe pilote Mac-PlatformSSO.",
        expectedResult: "Profil assigné, statut Pending sur les Mac cibles.",
      },
      {
        id: "test-login",
        title: "Tester le login macOS",
        instruction: "Déverrouillez ou connectez-vous sur le Mac pilote — vérifiez le flux SSO Entra ID.",
        expectedResult: "Authentification sans ressaisie mot de passe local (selon config).",
      },
      {
        id: "password-sync",
        title: "Tester Password Sync",
        instruction: "Changez le mot de passe Entra ID et vérifiez la synchronisation au prochain unlock.",
        expectedResult: "Mot de passe local macOS synchronisé ou flux de re-auth documenté.",
      },
    ],
    "Platform SSO déployé : login macOS fédéré Entra ID, profil Intune appliqué, pilote validé."
  ),
  lab(
    "jamf-smart-groups",
    "Créer un Smart Group Jamf",
    "Construisez un Smart Group dynamique avec critères OS, apps installées et Extension Attribute.",
    "Débutant",
    "30 min",
    "Jamf Pro",
    "jamf-100",
    [
      "Créer un Extension Attribute",
      "Définir les critères du Smart Group",
      "Valider l'appartenance dynamique",
    ],
    [
      "Accès admin Jamf Pro",
      "Inventaire Mac populated (≥ 5 Mac)",
    ],
    [
      {
        id: "create-ea",
        title: "Créer un Extension Attribute",
        instruction: "Jamf Pro → Settings → Extension Attributes → New → script ou inventory pattern.",
        expectedResult: "EA visible et remontant des valeurs dans l'inventaire Mac.",
      },
      {
        id: "smart-group-new",
        title: "Nouveau Smart Group",
        instruction: "Computers → Smart Computer Groups → New → nommez « MacOS-14-Production ».",
        expectedResult: "Formulaire de critères ouvert.",
      },
      {
        id: "criteria",
        title: "Définir les critères",
        instruction: "Ajoutez critères : macOS version ≥ 14, app installée (ex. Company Portal), EA equals value.",
        expectedResult: "Critères AND/OR configurés selon le besoin.",
      },
      {
        id: "verify-membership",
        title: "Vérifier les membres",
        instruction: "Sauvegardez et consultez la liste des membres du Smart Group.",
        expectedResult: "Mac correspondants listés dynamiquement.",
      },
      {
        id: "scope-policy",
        title: "Utiliser dans une policy",
        instruction: "Créez ou modifiez une policy scoped au Smart Group pour valider le ciblage.",
        expectedResult: "Policy limitée aux Mac du groupe — scope opérationnel.",
      },
    ],
    "Smart Group Jamf opérationnel avec critères dynamiques et utilisé pour le scope d'une policy."
  ),
  lab(
    "jamf-policies",
    "Créer une Policy Jamf",
    "Créez une policy Jamf combinant script, package et maintenance sur un groupe cible.",
    "Intermédiaire",
    "40 min",
    "Jamf Pro",
    "jamf-100",
    [
      "Créer une policy avec triggers",
      "Ajouter un script ou package",
      "Valider l'exécution sur un Mac test",
    ],
    [
      "Jamf Pro admin",
      "Mac enrollé dans le groupe cible",
      "Package ou script de test",
    ],
    [
      {
        id: "new-policy",
        title: "Créer la policy",
        instruction: "Computers → Policies → New → nom, triggers (Enrollment Complete, Recurring Check-in).",
        expectedResult: "Policy créée avec triggers et fréquence définis.",
      },
      {
        id: "add-payload",
        title: "Ajouter script ou package",
        instruction: "Onglet Packages ou Scripts → ajoutez un payload (ex. message de bienvenue ou PKG test).",
        expectedResult: "Payload attaché à la policy.",
      },
      {
        id: "scope",
        title: "Scope au groupe",
        instruction: "Scope → Smart Group ou Static Group cible → Save.",
        expectedResult: "Policy scoped, statut Enabled.",
      },
      {
        id: "run-policy",
        title: "Forcer l'exécution",
        instruction: "Sur le Mac test : sudo jamf policy ou attendez le check-in → vérifiez les logs.",
        expectedResult: "Policy exécutée, logs Jamf sans erreur.",
      },
      {
        id: "verify-result",
        title: "Valider le résultat",
        instruction: "Confirmez le résultat attendu (fichier créé, app installée, etc.) sur le Mac.",
        expectedResult: "Résultat conforme à l'objectif de la policy.",
      },
    ],
    "Policy Jamf déployée et exécutée avec succès sur le parc Mac cible."
  ),
  lab(
    "filevault",
    "Activer FileVault avec escrow de clé",
    "Forcez FileVault 2 via MDM et vérifiez l'escrow de la clé de récupération vers Intune ou Jamf.",
    "Avancé",
    "45 min",
    "FileVault",
    "apple-it-professional",
    [
      "Créer le profil FileVault MDM",
      "Déployer sur Mac supervisés",
      "Vérifier l'escrow de la clé",
    ],
    [
      "Mac supervisé enrollé (ADE)",
      "Intune ou Jamf Pro admin",
      "Mac de test avec données non critiques",
    ],
    [
      {
        id: "fv-profile",
        title: "Profil FileVault",
        instruction: "Créez un profil Disk Encryption : Force encrypt, institutional vs personal key, escrow enabled.",
        expectedResult: "Payload FileVault configuré avec escrow vers MDM.",
      },
      {
        id: "deploy-profile",
        title: "Déployer le profil",
        instruction: "Assignez le profil au groupe Mac cible (Required).",
        expectedResult: "Profil assigné, statut pending sur les Mac.",
      },
      {
        id: "encrypt-mac",
        title: "Chiffrement du Mac",
        instruction: "Sur le Mac test, attendez la commande MDM ou lancez le chiffrement — redémarrage si nécessaire.",
        expectedResult: "FileVault activé, icône cadenas dans Réglages Système.",
      },
      {
        id: "escrow-key",
        title: "Vérifier l'escrow",
        instruction: "Dans Intune/Jamf, ouvrez la fiche appareil → Recovery Key / FileVault key.",
        expectedResult: "Clé de récupération escrowée visible pour l'admin IT.",
      },
      {
        id: "recovery-test",
        title: "Test de récupération (optionnel)",
        instruction: "Documentez la procédure de récupération sans tester sur production.",
        expectedResult: "Runbook L1/L2 avec étapes de récupération via console MDM.",
      },
    ],
    "FileVault activé sur Mac supervisé, clé escrowée dans la console MDM, procédure de récupération documentée."
  ),
];

export function getLab(slug: string): Lab | undefined {
  return labs.find((l) => l.slug === slug);
}

export function getLabsByTrack(trackSlug: string): Lab[] {
  return labs.filter((l) => l.trackSlug === trackSlug);
}

export function getLabSlugs(): string[] {
  return labs.map((l) => l.slug);
}
