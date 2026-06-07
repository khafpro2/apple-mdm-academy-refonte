import type { Lab, LabLevel, LabTechnology } from "@/lib/types";
import { expertLabs } from "@/lib/data/advanced-tracks/expert-labs";
import { altMdmLabs } from "@/lib/data/alternative-mdm-tracks/labs";
import { applePlatformDeploymentLabs } from "@/lib/data/apple-platform-deployment/labs";
import { acitpCertificationLabs } from "@/lib/data/acitp/labs";

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
  expectedResult: string,
  scenario?: string
): Lab {
  const enterpriseScenario =
    scenario ?? `Organisation enterprise — valider « ${title} » sur groupe pilote (5–10 appareils).`;
  const primaryObjective = objectives[0] ?? description;
  return {
    slug,
    title,
    description: description.includes("Scénario entreprise")
      ? description
      : `${description} Scénario entreprise : ${enterpriseScenario}`,
    level,
    duration,
    technology,
    trackSlug,
    objectives,
    prerequisites,
    steps,
    expectedResult,
    objective:
      primaryObjective.length >= 20
        ? `${primaryObjective} — déploiement pilote enterprise documenté.`
        : `${description.slice(0, 90)} — validation pilote enterprise avec runbook ITSM.`,
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
        instruction: "Computers → Smart Computer Groups → New → nommez « MacOS-14-Production ». Preview membership (Jamf 11.16).",
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
    "jamf-packages",
    "Déployer un package Jamf Pro 11.16",
    "Ajoutez un PKG/DMG au Distribution Point, créez une policy Packages et validez l'installation sur un Mac pilote.",
    "Intermédiaire",
    "45 min",
    "Jamf Pro",
    "jamf-100",
    [
      "Uploader un package vers le Distribution Point",
      "Créer une policy avec payload Packages",
      "Valider install et logs policy",
    ],
    [
      "Jamf Pro admin",
      "PKG ou DMG de test signé",
      "Mac enrollé dans Smart Group pilote",
    ],
    [
      {
        id: "upload-package",
        title: "Ajouter le package",
        instruction:
          "Computers → Packages → New → upload PKG/DMG. Vérifier Distribution Point et OS requirements (doc 11.16 Packages).",
        expectedResult: "Package listé dans Jamf Pro avec taille et checksum.",
      },
      {
        id: "policy-packages",
        title: "Policy payload Packages",
        instruction:
          "Computers → Policies → New → General (trigger Recurring Check-in). Payload Packages → Add → Action Install → Distribution Point.",
        expectedResult: "Package attaché avec action Install configurée.",
      },
      {
        id: "scope-pilot",
        title: "Scope pilote",
        instruction: "Scope → Smart Group pilote (1–3 Mac). Restart Options si le package requiert reboot.",
        expectedResult: "Policy enabled, scope limité.",
      },
      {
        id: "self-service-opt",
        title: "Self Service (optionnel)",
        instruction: "Onglet Self Service → rendre la policy disponible avec description utilisateur.",
        expectedResult: "Policy visible dans catalogue Self Service sur Mac test.",
      },
      {
        id: "verify-install",
        title: "Valider installation",
        instruction: "Forcer check-in ou `sudo jamf policy`. Vérifier app/fichier installé + Policy Logs.",
        expectedResult: "Installation réussie, logs Completed.",
      },
    ],
    "Package Jamf Pro 11.16 déployé via policy Packages avec logs validés."
  ),
  lab(
    "jamf-self-service",
    "Configurer Jamf Self Service 11.16",
    "Branding, catégories et policies Self Service pour un catalogue utilisateur contrôlé.",
    "Intermédiaire",
    "40 min",
    "Jamf Pro",
    "jamf-100",
    [
      "Configurer branding Self Service macOS",
      "Publier policies dans Self Service",
      "Tester expérience utilisateur sur Mac",
    ],
    [
      "Jamf Pro admin",
      "Mac avec app Self Service installée",
      "Policy pilote non destructive",
    ],
    [
      {
        id: "ss-branding",
        title: "Branding Self Service",
        instruction:
          "Settings → Self Service → macOS : logo, couleurs, notifications. Vérifier Configuration Profile Self Service sur Mac.",
        expectedResult: "App Self Service branded sur appareil pilote.",
      },
      {
        id: "ss-categories",
        title: "Catégories catalogue",
        instruction: "Créer catégories (Productivity, Security). Assigner policies/apps aux catégories.",
        expectedResult: "Catalogue organisé par catégories.",
      },
      {
        id: "ss-policy",
        title: "Policy Self Service",
        instruction:
          "Computers → Policies → policy pilote → onglet Self Service : display name, description Markdown, bouton.",
        expectedResult: "Policy disponible dans Self Service (trigger Self Service ou hybrid).",
      },
      {
        id: "ss-user-test",
        title: "Test utilisateur",
        instruction: "Sur Mac utilisateur : ouvrir Self Service → exécuter policy → vérifier deferrals/messages.",
        expectedResult: "Policy exécutée, feedback UX documenté.",
      },
      {
        id: "ss-patch-note",
        title: "Limite patch policies",
        instruction:
          "Documenter : patch policies peuvent être en Self Service mais n'apparaissent pas dans la recherche (Jamf 11.16).",
        expectedResult: "Runbook Self Service incluant cette limitation.",
      },
    ],
    "Self Service 11.16 configuré avec catalogue, policy pilote testée et limitations documentées."
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
  lab(
    "jamf-scripts",
    "Créer et déployer un script Jamf",
    "Rédigez un script shell, créez une policy Jamf avec exécution ciblée et vérifiez le résultat sur un Mac de test.",
    "Intermédiaire",
    "55 min",
    "Jamf Pro",
    "jamf-170",
    [
      "Rédiger un script shell idempotent",
      "Créer une policy Jamf avec payload Script",
      "Cibler un Smart Group et valider l'exécution",
    ],
    [
      "Jamf Pro admin",
      "Mac enrollé dans Jamf",
      "Accès SSH ou logs Jamf pour vérification",
    ],
    [
      { id: "script-write", title: "Rédiger le script", instruction: "Jamf Pro → Settings → Computer Management → Scripts → New. Uploadez un script .sh qui crée un fichier témoin dans /Library/Application Support/.", expectedResult: "Script enregistré dans Jamf avec catégorie et notes." },
      { id: "policy-create", title: "Policy Script", instruction: "Computers → Policies → New → General : nom descriptif. Payload Scripts : sélectionnez le script, fréquence Once per computer.", expectedResult: "Policy créée avec payload Script configuré." },
      { id: "scope-group", title: "Scope Smart Group", instruction: "Onglet Scope : ajoutez un Smart Group de test (1 Mac). Priority : Before.", expectedResult: "Policy scoped au groupe de test." },
      { id: "trigger-policy", title: "Exécuter la policy", instruction: "Sur le Mac cible : Policies → Execute ou attendez le check-in. Consultez les logs Jamf.", expectedResult: "Policy exécutée, statut Completed dans Jamf." },
      { id: "verify-result", title: "Vérifier le résultat", instruction: "Sur le Mac : confirmez la création du fichier témoin. Documentez la sortie dans Jamf Policy Logs.", expectedResult: "Fichier témoin présent, logs Jamf sans erreur." },
    ],
    "Script Jamf déployé et exécuté avec succès sur le Mac cible, logs documentés."
  ),
  lab(
    "jamf-patch-management",
    "Configurer le Patch Management Jamf",
    "Activez Software Update Inventory, créez un patch policy et déployez une mise à jour macOS sur un groupe pilote.",
    "Avancé",
    "60 min",
    "Jamf Pro",
    "jamf-200",
    [
      "Activer l'inventaire Software Update",
      "Créer une patch policy macOS",
      "Déployer sur un groupe pilote",
    ],
    [
      "Jamf Pro admin",
      "Smart Group Mac macOS 13+",
      "Fenêtre de maintenance définie",
    ],
    [
      { id: "inventory", title: "Software Update Inventory", instruction: "Computers → Patch Management → Software Update Inventory. Vérifiez que les Mac remontent les updates disponibles.", expectedResult: "Updates visibles dans Patch Management." },
      { id: "patch-policy", title: "Créer Patch Policy", instruction: "Patch Management → Software Titles → Create Patch Policy. General : target version, Patch Unknown Versions, Self Service si besoin.", expectedResult: "Patch policy créée avec version cible et eligible computers preview." },
      { id: "scope-pilot", title: "Scope pilote", instruction: "Scope la patch policy à un Smart Group pilote (5–10 Mac max).", expectedResult: "Policy scoped au groupe pilote uniquement." },
      { id: "deploy", title: "Déclencher le déploiement", instruction: "Force un check-in ou attendez la fenêtre. Surveillez Patch Management → Dashboard.", expectedResult: "Mac pilotes passent en Pending puis Completed." },
      { id: "report", title: "Rapport de conformité", instruction: "Exportez le rapport de patch compliance et documentez les échecs éventuels.", expectedResult: "Rapport avec % de conformité patch documenté." },
    ],
    "Patch policy Jamf déployée sur le groupe pilote avec rapport de conformité."
  ),
  lab(
    "jamf-protect",
    "Activer Jamf Protect sur le parc Mac",
    "Plan déploiement Jamf Protect : plan, policy analytics et alertes sur un Mac supervisé.",
    "Avancé",
    "50 min",
    "Jamf Protect",
    "jamf-200",
    [
      "Connecter Jamf Pro à Jamf Protect",
      "Créer un plan de déploiement Protect",
      "Valider les alertes sur un Mac test",
    ],
    [
      "Licence Jamf Protect active",
      "Jamf Pro admin + accès Protect portal",
      "Mac enrollé et online",
    ],
    [
      { id: "connect", title: "Lier Jamf Pro", instruction: "Jamf Protect portal → Settings → Jamf Pro Integration. Connectez votre instance Jamf Pro.", expectedResult: "Intégration Jamf Pro active (statut Connected)." },
      { id: "plan", title: "Plan de déploiement", instruction: "Protect → Plans → New Plan. Sélectionnez analytics, telemetry et policies de base.", expectedResult: "Plan Protect créé et publié." },
      { id: "assign", title: "Assigner au parc", instruction: "Assignez le plan à un Smart Group pilote via Jamf Pro computer record ou Protect assignment.", expectedResult: "Mac pilote apparaît dans Protect inventory." },
      { id: "agent", title: "Vérifier l'agent", instruction: "Sur le Mac : confirmez l'installation de l'agent Protect (processus, extension système).", expectedResult: "Agent Protect installé et actif." },
      { id: "alerts", title: "Tester une alerte", instruction: "Simulez un événement (EICAR ou test Protect) et vérifiez l'alerte dans le dashboard Protect.", expectedResult: "Alerte visible dans Jamf Protect avec détails Mac." },
    ],
    "Jamf Protect déployé sur Mac pilote avec agent actif et alertes fonctionnelles."
  ),
  lab(
    "macos-security",
    "Durcir la sécurité macOS via Intune",
    "Déployez Gatekeeper, SIP awareness, XProtect et restrictions via profils Intune sur Mac supervisés.",
    "Avancé",
    "55 min",
    "Sécurité macOS",
    "intune-mac",
    [
      "Créer un profil restrictions macOS",
      "Forcer Gatekeeper et firewall",
      "Vérifier la conformité post-déploiement",
    ],
    [
      "Mac supervisé enrollé Intune",
      "Rôle Intune Administrator",
      "Mac de test non production",
    ],
    [
      { id: "restrictions", title: "Profil restrictions", instruction: "Intune → Devices → Configuration profiles → macOS → Restrictions. Bloquez sources non approuvées, USB selon politique.", expectedResult: "Profil restrictions créé avec payloads macOS." },
      { id: "gatekeeper", title: "Gatekeeper / Notarisation", instruction: "Ajoutez payload System Extensions ou Endpoint Security selon politique. Documentez les apps autorisées.", expectedResult: "Politique Gatekeeper alignée entreprise." },
      { id: "firewall", title: "Firewall macOS", instruction: "Payload Firewall : activer, mode block incoming, logging activé.", expectedResult: "Firewall forcé via MDM." },
      { id: "deploy", title: "Déployer le profil", instruction: "Assignez au groupe Mac cible (Required). Force sync sur Mac test.", expectedResult: "Profil installé, statut Succeeded." },
      { id: "audit", title: "Audit conformité", instruction: "Vérifiez Réglages Système + Intune device compliance. Documentez écarts.", expectedResult: "Mac conforme aux contrôles définis." },
    ],
    "Mac durci via profils Intune : restrictions, firewall et Gatekeeper appliqués."
  ),
  lab(
    "intune-compliance",
    "Créer une Compliance Policy Apple dans Intune",
    "Définissez les règles OS, FileVault et jailbreak, liez à Conditional Access et testez le blocage.",
    "Intermédiaire",
    "45 min",
    "Intune Compliance",
    "intune-mac",
    [
      "Créer une compliance policy iOS/macOS",
      "Lier à Conditional Access",
      "Tester le blocage sur appareil non conforme",
    ],
    [
      "Tenant Entra ID + Intune",
      "Appareils Apple enrollés",
      "Policy CA existante (optionnel)",
    ],
    [
      { id: "policy", title: "Compliance policy", instruction: "Intune → Devices → Compliance policies → Create (iOS/macOS). OS min, FileVault required, jailbreak blocked.", expectedResult: "Policy compliance créée avec règles Apple." },
      { id: "assign", title: "Assigner la policy", instruction: "Assignez à un groupe dynamique All Apple Devices ou pilote.", expectedResult: "Policy assignée, devices en evaluation." },
      { id: "ca-link", title: "Conditional Access", instruction: "Entra → Security → CA → exiger appareil compliant pour une app test (Office 365).", expectedResult: "Règle CA liée à Intune compliance." },
      { id: "test-pass", title: "Test conforme", instruction: "Sur Mac conforme : accès app autorisé, statut Compliant dans Intune.", expectedResult: "Device Compliant, accès OK." },
      { id: "test-fail", title: "Test non conforme", instruction: "Simulez non-conformité (OS obsolète ou FileVault off sur VM test). Vérifiez blocage CA.", expectedResult: "Device Non-compliant, accès bloqué par CA." },
    ],
    "Compliance policy Intune active, liée à CA, avec tests conforme/non conforme documentés."
  ),
  lab(
    "platform-sso-mfa",
    "Platform SSO avec MFA Microsoft",
    "Configurez Platform SSO macOS + exigence MFA Entra ID pour les apps Apple natives.",
    "Avancé",
    "60 min",
    "Platform SSO + MFA",
    "intune-mac",
    [
      "Configurer Platform SSO dans Intune",
      "Activer MFA Conditional Access",
      "Valider connexion sans mot de passe sur Mac",
    ],
    [
      "Mac macOS 14+ supervisé",
      "Entra ID P1+ avec MFA",
      "Extension Platform SSO déployée",
    ],
    [
      { id: "psso-profile", title: "Profil Platform SSO", instruction: "Intune → macOS configuration profile → Platform SSO. Configurez registration token, extension Team ID.", expectedResult: "Profil PSSO assigné aux Mac cibles." },
      { id: "mfa-ca", title: "MFA via CA", instruction: "Entra CA : exiger MFA pour utilisateurs Mac + appareil compliant.", expectedResult: "Politique MFA active pour le groupe." },
      { id: "enroll-user", title: "Enrollment utilisateur", instruction: "Sur Mac test : login utilisateur Entra, enregistrement Platform SSO (Keychain).", expectedResult: "Utilisateur enregistré PSSO dans Réglages." },
      { id: "sso-test", title: "Test SSO app", instruction: "Ouvrez une app Microsoft ou Safari vers M365 — connexion sans re-saisie mot de passe.", expectedResult: "SSO fonctionnel avec prompt MFA si requis." },
      { id: "troubleshoot", title: "Dépannage", instruction: "Consultez logs Company Portal / Intune MDM si échec. Documentez résolution.", expectedResult: "Runbook PSSO + MFA documenté." },
    ],
    "Platform SSO actif sur Mac avec MFA Entra appliquée via Conditional Access."
  ),
  lab(
    "managed-apple-id-federation",
    "Fédérer Managed Apple ID avec Entra ID",
    "Connectez ABM à Microsoft Entra ID, fédérez le domaine et synchronisez les utilisateurs.",
    "Avancé",
    "55 min",
    "Managed Apple ID + Federation",
    "intune-mac",
    [
      "Vérifier le domaine dans ABM",
      "Configurer la fédération Entra ID",
      "Tester connexion Managed Apple ID fédérée",
    ],
    [
      "Apple Business Manager admin",
      "Entra ID Global Admin",
      "Domaine vérifié dans les deux tenants",
    ],
    [
      { id: "domain", title: "Vérifier le domaine", instruction: "ABM → Preferences → Managed Apple IDs → Domaine vérifié. Entra → Domaines personnalisés : même domaine.", expectedResult: "Domaine vérifié ABM + Entra." },
      { id: "federation", title: "Configurer fédération", instruction: "ABM → Federation → Microsoft Entra ID. Suivez l'assistant de connexion SSO.", expectedResult: "Fédération Entra active dans ABM." },
      { id: "sync", title: "Sync utilisateurs", instruction: "Mappez les attributs (UPN, email). Activez la sync ou création MAID à la connexion.", expectedResult: "Utilisateurs fédérés visibles dans ABM." },
      { id: "test-login", title: "Test connexion", instruction: "Sur appareil Apple : connexion Managed Apple ID → redirect Entra → MFA → succès.", expectedResult: "Login MAID fédéré fonctionnel." },
      { id: "audit", title: "Audit et runbook", instruction: "Documentez procédure offboarding et reset mot de passe fédéré.", expectedResult: "Runbook fédération MAID complet." },
    ],
    "Managed Apple ID fédérés avec Entra ID, connexion testée et runbook documenté."
  ),
  lab(
    "jamf-discovery",
    "Découverte de Jamf Pro",
    "Explorez la console Jamf Pro : inventaire, Smart Groups, policies, Self Service et architecture.",
    "Débutant",
    "45 min",
    "Jamf Pro",
    "jamf-100",
    [
      "Naviguer dans la console Jamf Pro",
      "Consulter l'inventaire et les détails appareil",
      "Identifier Smart Groups, policies et Configuration Profiles",
      "Découvrir Self Service et le catalogue apps",
    ],
    [
      "Accès Jamf Pro (cloud ou on-prem) avec rôle Administrator",
      "Au moins un Mac ou iPhone enrôlé dans l'inventaire",
      "Navigateur récent (Chrome, Safari, Firefox)",
    ],
    [
      {
        id: "login-console",
        title: "Connexion à Jamf Pro",
        instruction:
          "Connectez-vous à votre instance Jamf Pro. Repérez le menu principal : Computers, Mobile Devices, Policies, Configuration Profiles.",
        expectedResult: "Console Jamf Pro accessible avec vue d'ensemble du parc.",
      },
      {
        id: "inventory",
        title: "Explorer l'inventaire",
        instruction:
          "Computers → recherchez un Mac test. Ouvrez General, Hardware, Software, Security et Extension Attributes.",
        expectedResult: "Fiche appareil complète avec last check-in et version OS.",
      },
      {
        id: "smart-groups",
        title: "Smart Groups existants",
        instruction:
          "Computers → Smart Computer Groups. Listez les groupes dynamiques et leurs critères (OS version, modèle, EA).",
        expectedResult: "Au moins 2 Smart Groups identifiés avec critères compris.",
      },
      {
        id: "policies-profiles",
        title: "Policies et profils",
        instruction:
          "Policies → listez les policies actives. Configuration Profiles → repérez les payloads Wi‑Fi, FileVault, restrictions.",
        expectedResult: "Policies et profils mappés à leur scope (Smart Group ou static group).",
      },
      {
        id: "self-service",
        title: "Self Service",
        instruction:
          "Computers → Self Service. Consultez les catégories, policies et apps disponibles pour l'utilisateur final.",
        expectedResult: "Catalogue Self Service documenté avec 3 éléments minimum.",
      },
    ],
    "Inventaire Jamf exploré, Smart Groups/policies repérés et Self Service catalogué."
  ),
  ...applePlatformDeploymentLabs,
  ...acitpCertificationLabs,
  ...expertLabs,
  ...altMdmLabs,
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
