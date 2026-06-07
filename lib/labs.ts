import type { Lab, LabLevel, LabTechnology } from "@/lib/types";
import { expertLabs } from "@/lib/data/advanced-tracks/expert-labs";
import { altMdmLabs } from "@/lib/data/alternative-mdm-tracks/labs";
import { applePlatformDeploymentLabs } from "@/lib/data/apple-platform-deployment/labs";
import { acitpCertificationLabs } from "@/lib/data/acitp/labs";
import { appleTrainingLabs } from "@/lib/data/apple-training/labs";

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
    "jamf-mobile-devices",
    "Gérer iPhone et iPad supervisés dans Jamf Pro",
    "Enrollment ADE mobile, profil Wi-Fi iOS et validation VPP sur iPad pilote supervisé.",
    "Intermédiaire",
    "45 min",
    "Jamf Pro",
    "jamf-100",
    [
      "Enroller iPad pilote via ADE",
      "Créer et scope profil Wi-Fi iOS",
      "Valider profils et inventaire mobile",
    ],
    ["Jamf Pro admin", "iPad supervisé ADE", "Token ABM valide"],
    [
      { id: "enroll", title: "Enrollment pilote", instruction: "Mobile Devices → vérifier iPad pilote ADE supervisé.", expectedResult: "iPad visible avec statut Supervised." },
      { id: "profile", title: "Profil Wi-Fi iOS", instruction: "Mobile Devices → Configuration Profiles → New → payload Wi-Fi enterprise.", expectedResult: "Profil créé sans erreur payload." },
      { id: "scope", title: "Scope pilote", instruction: "Scope profil au Static Group iPad pilote.", expectedResult: "Profil installé sur iPad (Réglages → Général → VPN et appareil)." },
      { id: "verify", title: "Vérification", instruction: "Management History iPad + Last Check-in.", expectedResult: "Profil Completed dans history." },
    ],
    "iPad pilote supervisé avec profil Wi-Fi enterprise installé via Jamf Pro."
  ),
  lab(
    "jamf-static-groups",
    "Static Groups et exclusions policies",
    "Créer Static Groups VIP/labo et configurer exclusions sur policy maintenance.",
    "Intermédiaire",
    "35 min",
    "Jamf Pro",
    "jamf-100",
    [
      "Créer Static Groups LAB et VIP",
      "Scope policy Smart Group avec exclusions",
      "Valider Policy Logs sur Mac labo exclu",
    ],
    ["Jamf Pro admin", "Smart Group existant", "Mac pilote labo et production"],
    [
      { id: "static", title: "Static Groups", instruction: "Computers → Static Computer Groups → New LAB et VIP.", expectedResult: "Groupes créés avec Mac assignés." },
      { id: "policy", title: "Policy scope", instruction: "Policy maintenance → scope Smart Group production → Exclusions Static LAB + VIP.", expectedResult: "Scope configuré avec exclusions." },
      { id: "test", title: "Test exclusion", instruction: "Forcer policy sur Mac labo — doit être exclu.", expectedResult: "Mac labo absent Policy Logs policy." },
    ],
    "Policy scoped avec exclusions Static LAB/VIP validées."
  ),
  lab(
    "jamf-reporting",
    "Reporting Jamf — Advanced Search et exports",
    "Requête Advanced Search conformité FileVault et export CSV audit trimestriel.",
    "Intermédiaire",
    "40 min",
    "Jamf Pro",
    "jamf-100",
    [
      "Créer Advanced Search FileVault",
      "Exporter CSV audit",
      "Sauvegarder recherche réutilisable",
    ],
    ["Jamf Pro admin", "Inventaire FileVault remonté"],
    [
      { id: "search", title: "Advanced Search", instruction: "Computers → Advanced Computer Searches → New → FileVault Status = Off.", expectedResult: "Liste Mac non chiffrés générée." },
      { id: "export", title: "Export CSV", instruction: "Export results → CSV pour audit.", expectedResult: "Fichier CSV avec serials et statuts." },
      { id: "save", title: "Sauvegarder", instruction: "Save search ADV-FV-OFF-TRIM.", expectedResult: "Recherche réutilisable pour audit trimestriel." },
    ],
    "Advanced Search FileVault exportée et sauvegardée pour audit."
  ),
  lab(
    "jamf-troubleshooting",
    "Troubleshooting Jamf — Policy Logs et runbook L1",
    "Diagnostiquer policy package Failed : Policy Logs, DP, espace disque, runbook L1.",
    "Intermédiaire",
    "45 min",
    "Jamf Pro",
    "jamf-100",
    [
      "Reproduire échec policy package",
      "Analyser Policy Logs et Management History",
      "Documenter runbook L1",
    ],
    ["Jamf Pro admin", "Policy package test", "Mac pilote"],
    [
      { id: "repro", title: "Reproduction", instruction: "Scope policy package test sur Mac pilote — reproduire Failed si possible.", expectedResult: "Échec documenté avec timestamp." },
      { id: "logs", title: "Policy Logs", instruction: "Policy → Logs + fiche Mac Management History.", expectedResult: "Cause identifiée (DP, espace, scope)." },
      { id: "fix", title: "Correction", instruction: "Corriger cause (DP access, espace) et re-run.", expectedResult: "Policy Completed sur Mac pilote." },
      { id: "runbook", title: "Runbook L1", instruction: "Documenter checklist L1 package Failed.", expectedResult: "Runbook partagé équipe support." },
    ],
    "Échec policy diagnostiqué et runbook L1 documenté."
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
    "enrollment-program-token",
    "Importer et renouveler l'Enrollment Program Token",
    "Téléchargez le token ABM (.p7m), importez-le dans Intune et planifiez le renouvellement annuel.",
    "Intermédiaire",
    "35 min",
    "ABM + Intune",
    "intune-mac",
    [
      "Télécharger server_token.p7m depuis ABM",
      "Importer dans Intune Enrollment Program Tokens",
      "Synchroniser et vérifier l'expiration",
    ],
    [
      "Accès admin Apple Business Manager",
      "Rôle Intune Administrator",
      "Serveur MDM ABM déjà créé avec clé Intune",
    ],
    [
      {
        id: "download-p7m",
        title: "Télécharger le token ABM",
        instruction:
          "ABM → Settings → Device Management → sélectionnez le serveur MDM Intune → Download Token.",
        expectedResult: "Fichier server_token.p7m téléchargé et archivé sécurisé.",
      },
      {
        id: "import-token",
        title: "Importer dans Intune",
        instruction:
          "Intune → Devices → Enrollment → Apple → Enrollment program tokens → Add → upload .p7m.",
        expectedResult: "Token status Active avec date expiration visible (≈365 jours).",
      },
      {
        id: "sync-now",
        title: "Forcer synchronisation",
        instruction: "Sélectionnez le token → Sync → vérifiez le nombre d'appareils importés.",
        expectedResult: "Device count cohérent avec inventaire ABM assigné au serveur MDM.",
      },
      {
        id: "renewal-doc",
        title: "Documenter renouvellement",
        instruction: "Créez ticket récurrent J-30 avec procédure download → re-import même compte ABM.",
        expectedResult: "Runbook renouvellement token avec propriétaire et calendrier.",
      },
      {
        id: "verify-profile",
        title: "Vérifier profils ADE",
        instruction: "Confirmez qu'un profil ADE iOS/macOS est rattaché au token pour les appareils pilotes.",
        expectedResult: "Profil ADE assigné, prêt pour zero-touch enrollment.",
      },
    ],
    "Enrollment Program Token importé, sync OK, renouvellement documenté."
  ),
  lab(
    "ios-configuration-profile",
    "Créer un profil de configuration iOS",
    "Déployez Wi-Fi enterprise et restrictions sur iPhone supervisé via Intune.",
    "Intermédiaire",
    "45 min",
    "ADE + Intune",
    "intune-mac",
    [
      "Créer profil iOS/iPadOS",
      "Ajouter payloads Wi-Fi et restrictions",
      "Assigner et valider sur iPhone pilote",
    ],
    [
      "iPhone supervisé enrollé Intune (lab ade-iphone)",
      "Certificat Wi-Fi enterprise si 802.1X",
      "Groupe dynamique iOS devices",
    ],
    [
      {
        id: "create-profile",
        title: "Nouveau profil iOS",
        instruction: "Intune → Devices → Configuration profiles → Create → iOS/iPadOS → Templates or Settings catalog.",
        expectedResult: "Profil créé avec nom conventionné (ORG-iOS-WIFI-01).",
      },
      {
        id: "wifi-payload",
        title: "Payload Wi-Fi",
        instruction: "Ajoutez Wi-Fi enterprise : SSID, security type, certificat ou username/password selon lab.",
        expectedResult: "Payload Wi-Fi configuré sans erreur validation.",
      },
      {
        id: "restrictions",
        title: "Restrictions supervisées",
        instruction: "Ajoutez Device restrictions : ex. disable App Store install, camera off selon politique lab.",
        expectedResult: "Restrictions compatibles mode supervisé.",
      },
      {
        id: "assign",
        title: "Assigner le profil",
        instruction: "Assign Required au groupe iPhone pilotes. Save.",
        expectedResult: "Assignment active, devices targeted.",
      },
      {
        id: "validate-device",
        title: "Validation iPhone",
        instruction: "Force sync MDM. Vérifiez Réglages → Général → VPN et appareil géré + Intune per-profile status Succeeded.",
        expectedResult: "Profil installé, Wi-Fi connecté, restrictions actives.",
      },
    ],
    "Profil iOS déployé : Wi-Fi + restrictions validés sur iPhone supervisé."
  ),
  lab(
    "macos-configuration-profile",
    "Créer un profil de configuration macOS",
    "Déployez firewall, restrictions et préférences système sur Mac ADE via Intune.",
    "Intermédiaire",
    "50 min",
    "Sécurité macOS",
    "intune-mac",
    [
      "Créer profil macOS",
      "Payloads firewall et restrictions",
      "Assigner Mac ADE et valider",
    ],
    [
      "Mac supervisé enrollé Intune (lab ade-macos)",
      "Intune Administrator",
      "Mac de test non production",
    ],
    [
      {
        id: "create-macos",
        title: "Nouveau profil macOS",
        instruction: "Intune → Configuration profiles → Create → macOS → Settings catalog or Templates.",
        expectedResult: "Profil macOS créé (ORG-MAC-SEC-01).",
      },
      {
        id: "firewall",
        title: "Payload Firewall",
        instruction: "Activez Firewall : on, block incoming, enable stealth mode selon baseline.",
        expectedResult: "Firewall payload configuré.",
      },
      {
        id: "restrictions-macos",
        title: "Restrictions macOS",
        instruction: "Device restrictions : disable Apple ID modifications, USB policy selon lab.",
        expectedResult: "Restrictions alignées politique entreprise.",
      },
      {
        id: "assign-mac",
        title: "Assigner aux Mac",
        instruction: "Required assignment groupe Mac corporate. Save.",
        expectedResult: "Mac pilote dans scope.",
      },
      {
        id: "validate-mac",
        title: "Validation Mac",
        instruction: "sudo profiles renew -type enrollment ou Company Portal sync. Vérifiez Réglages Système + Intune device config.",
        expectedResult: "Profil Succeeded, firewall actif.",
      },
    ],
    "Profil macOS déployé : firewall et restrictions validés sur Mac ADE."
  ),
  lab(
    "intune-conditional-access-mac",
    "Conditional Access pour appareils Apple",
    "Liez compliance Intune à Entra CA et testez blocage accès M365 sur Mac non conforme.",
    "Avancé",
    "55 min",
    "Microsoft Entra ID",
    "intune-mac",
    [
      "Compliance policy macOS FileVault",
      "Policy CA require compliant device",
      "Tests conforme / non conforme",
    ],
    [
      "Entra ID P1+ et Intune",
      "Mac enrollé Intune lab",
      "Utilisateur test M365",
    ],
    [
      {
        id: "compliance-ca",
        title: "Compliance macOS",
        instruction: "Intune → Compliance policies → macOS : require FileVault ON, min OS 14.",
        expectedResult: "Policy assignée au Mac test.",
      },
      {
        id: "ca-policy",
        title: "Créer policy CA",
        instruction: "Entra → Security → Conditional Access → New : All users, Office 365, Grant require compliant device. Start report-only.",
        expectedResult: "Policy CA créée en report-only.",
      },
      {
        id: "analyze-logs",
        title: "Analyser sign-in logs",
        instruction: "Entra sign-in logs → filtrer utilisateur test → vérifier conditionalAccessStatus.",
        expectedResult: "Logs cohérents avant enforcement.",
      },
      {
        id: "enforce-pilot",
        title: "Activer enforcement pilote",
        instruction: "Limitez policy au groupe pilote. Activez On.",
        expectedResult: "CA enforcement pour groupe pilote uniquement.",
      },
      {
        id: "test-block",
        title: "Test blocage",
        instruction: "Mac non conforme (FileVault off lab) → tenter Outlook web/app. Puis remediate et retest.",
        expectedResult: "Blocage puis accès après conformité.",
      },
    ],
    "Conditional Access actif : accès M365 conditionné à la conformité Intune Apple."
  ),
  lab(
    "defender-macos-intune",
    "Microsoft Defender pour macOS via Intune",
    "Onboardez Defender for Endpoint sur Mac avec une policy Intune Endpoint security.",
    "Avancé",
    "60 min",
    "Microsoft Defender",
    "intune-mac",
    [
      "Vérifier licences Defender",
      "Policy onboarding macOS",
      "Valider health portal Defender",
    ],
    [
      "Licence Microsoft Defender for Endpoint",
      "Mac enrollé Intune",
      "Intune Endpoint security admin",
    ],
    [
      {
        id: "license-check",
        title: "Licences Defender",
        instruction: "M365 Defender portal → Settings → Endpoints → vérifiez licensing.",
        expectedResult: "Licences EDR disponibles pour macOS.",
      },
      {
        id: "onboard-policy",
        title: "Policy onboarding",
        instruction: "Intune → Endpoint security → Microsoft Defender ATP → macOS onboarding → Create policy → assign Mac pilote.",
        expectedResult: "Onboarding profile assigned.",
      },
      {
        id: "agent-install",
        title: "Installation agent",
        instruction: "Force sync Mac. Vérifiez processus Microsoft Defender dans Activity Monitor.",
        expectedResult: "Agent Defender installé et running.",
      },
      {
        id: "fda",
        title: "Full Disk Access",
        instruction: "Si degraded : Réglages → Confidentialité → Full Disk Access → Microsoft Defender.",
        expectedResult: "Permissions système accordées.",
      },
      {
        id: "health-portal",
        title: "Health status",
        instruction: "Defender portal → Devices → Mac test → Health healthy, AV active.",
        expectedResult: "Status Healthy green, definitions up to date.",
      },
    ],
    "Defender macOS onboarded via Intune, agent healthy dans M365 Defender portal."
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
  lab(
    "azure-entra-user-group-license",
    "Créer utilisateur, groupe et licence Entra ID",
    "Créez un utilisateur pilote Apple Admin, un groupe de sécurité et attribuez une licence utile à Intune.",
    "Débutant",
    "35 min",
    "Microsoft Entra ID",
    "azure-for-apple-admins",
    ["Créer une identité pilote", "Créer un groupe de sécurité", "Attribuer une licence Microsoft 365/Intune"],
    ["Tenant Microsoft Entra ID", "Droits User Administrator ou équivalent", "Licence Intune disponible"],
    [
      { id: "user", title: "Créer l'utilisateur", instruction: "Entra admin center → Users → New user. Créez apple.pilot@domaine avec mot de passe temporaire.", expectedResult: "Utilisateur pilote créé avec UPN correct." },
      { id: "group", title: "Créer le groupe", instruction: "Groups → New group → Security. Nommez AZAP-macOS-Pilot-Users.", expectedResult: "Groupe de sécurité créé." },
      { id: "membership", title: "Ajouter le membre", instruction: "Ajoutez l'utilisateur pilote dans le groupe.", expectedResult: "Membership visible dans la fiche utilisateur et le groupe." },
      { id: "license", title: "Attribuer licence", instruction: "Licenses → assignez une licence incluant Intune/Entra selon votre tenant.", expectedResult: "Licence active sans erreur de plan de service." },
      { id: "verify", title: "Vérifier login", instruction: "Connectez-vous en navigation privée avec l'utilisateur pilote et changez le mot de passe.", expectedResult: "Connexion Entra réussie et compte prêt pour les labs suivants." },
    ],
    "Utilisateur pilote, groupe Entra et licence opérationnels pour les tests Apple/Intune."
  ),
  lab(
    "azure-mfa-sso-test",
    "Activer MFA et tester SSO",
    "Activez MFA sur un utilisateur pilote et validez l'expérience SSO Microsoft 365 sur Mac.",
    "Débutant",
    "40 min",
    "Microsoft Entra ID",
    "azure-for-apple-admins",
    ["Activer MFA pour le groupe pilote", "Tester SSO dans Safari/Edge", "Lire les sign-in logs"],
    ["Utilisateur pilote licencié", "Méthode Microsoft Authenticator ou passkey", "Mac de test"],
    [
      { id: "mfa", title: "Activer MFA", instruction: "Entra → Protection ou Authentication methods. Exigez MFA pour le groupe pilote.", expectedResult: "MFA requis pour l'utilisateur pilote." },
      { id: "register", title: "Enregistrer méthode", instruction: "Connectez l'utilisateur et enregistrez Authenticator, passkey ou méthode autorisée.", expectedResult: "Méthode forte enregistrée." },
      { id: "sso", title: "Tester SSO", instruction: "Ouvrez office.com puis Outlook/Teams web. Vérifiez la réduction des prompts.", expectedResult: "Accès Microsoft 365 validé avec SSO." },
      { id: "logs", title: "Analyser logs", instruction: "Entra → Sign-in logs → filtrez l'utilisateur pilote et examinez Authentication requirement.", expectedResult: "Challenge MFA et succès visibles." },
    ],
    "MFA actif, SSO validé et logs d'authentification compris."
  ),
  lab(
    "azure-dynamic-group-macos",
    "Créer un groupe dynamique macOS",
    "Créez un groupe dynamique Entra ID pour cibler automatiquement les appareils macOS dans Intune.",
    "Intermédiaire",
    "35 min",
    "Microsoft Entra ID",
    "azure-for-apple-admins",
    ["Créer une règle dynamique macOS", "Prévisualiser le membership", "Préparer une affectation Intune"],
    ["Entra ID P1 selon tenant", "Au moins un Mac enregistré", "Accès Groups admin"],
    [
      { id: "rule", title: "Créer la règle", instruction: "Groups → New group → Dynamic device. Utilisez une règle basée sur deviceOSType contenant macOS.", expectedResult: "Règle dynamique enregistrée." },
      { id: "preview", title: "Prévisualiser membres", instruction: "Utilisez Validate rules ou Membership preview avec un Mac connu.", expectedResult: "Le Mac pilote correspond à la règle." },
      { id: "naming", title: "Documenter nommage", instruction: "Nommez AZAP-macOS-Dynamic-Devices et ajoutez une description scope/owner.", expectedResult: "Groupe identifiable et auditable." },
      { id: "intune", title: "Préparer affectation", instruction: "Dans Intune, repérez ce groupe comme cible possible d'un profil pilote.", expectedResult: "Groupe disponible côté Intune." },
    ],
    "Groupe dynamique macOS validé, prêt pour les affectations Intune contrôlées."
  ),
  lab(
    "azure-abm-entra-federation",
    "Fédération Apple Business Manager avec Entra ID",
    "Préparez et validez la fédération ABM avec Microsoft Entra ID pour Managed Apple IDs.",
    "Intermédiaire",
    "55 min",
    "Managed Apple ID + Federation",
    "azure-for-apple-admins",
    ["Vérifier le domaine", "Configurer la fédération ABM", "Tester un Managed Apple ID"],
    ["ABM admin", "Entra Global/Admin approprié", "Domaine de test validable"],
    [
      { id: "domain", title: "Vérifier domaine", instruction: "Dans ABM et Entra, confirmez que le domaine entreprise est validé.", expectedResult: "Domaine validé dans les deux consoles." },
      { id: "federation", title: "Lancer fédération", instruction: "ABM → Preferences → Managed Apple IDs → Federation avec Microsoft Entra ID.", expectedResult: "Assistant de fédération terminé." },
      { id: "sync", title: "Contrôler synchronisation", instruction: "Vérifiez provisioning/synchronisation d'un utilisateur pilote.", expectedResult: "Managed Apple ID créé ou prêt à être créé." },
      { id: "login", title: "Tester connexion", instruction: "Connectez-vous avec le Managed Apple ID et observez la redirection Entra.", expectedResult: "Connexion fédérée réussie." },
      { id: "support", title: "Documenter support", instruction: "Rédigez les erreurs attendues : domaine non vérifié, conflit Apple ID, MFA échouée.", expectedResult: "Runbook helpdesk disponible." },
    ],
    "Fédération ABM/Entra validée sur utilisateur pilote, avec runbook de support."
  ),
  lab(
    "azure-intune-macos-deployment",
    "Déploiement macOS avec Intune et groupes Entra",
    "Déployez un profil ou une app macOS via Intune en utilisant les groupes Entra comme scope.",
    "Intermédiaire",
    "50 min",
    "ABM + Intune",
    "azure-for-apple-admins",
    ["Créer une affectation Intune", "Cibler un groupe Entra", "Valider le statut sur Mac"],
    ["Mac enrôlé Intune", "Groupe pilote Entra", "Droits Intune Administrator"],
    [
      { id: "profile", title: "Créer le profil", instruction: "Intune → Devices → macOS → Configuration profiles. Créez un profil simple et non destructif.", expectedResult: "Profil créé en mode pilote." },
      { id: "assign", title: "Assigner groupe", instruction: "Assignez le profil au groupe AZAP-macOS-Pilot.", expectedResult: "Affectation visible avec scope correct." },
      { id: "sync", title: "Forcer sync", instruction: "Sur Mac, Company Portal → Check status ou Intune → Sync.", expectedResult: "Check-in récent." },
      { id: "status", title: "Lire statut", instruction: "Intune → Device configuration → Device status.", expectedResult: "Profil succeeded ou erreur documentée." },
      { id: "rollback", title: "Préparer rollback", instruction: "Documentez comment retirer le groupe ou exclure le Mac pilote.", expectedResult: "Procédure rollback prête." },
    ],
    "Déploiement macOS piloté par groupe Entra, statut Intune vérifié et rollback documenté."
  ),
  lab(
    "azure-conditional-access-macos",
    "Créer une règle Conditional Access macOS",
    "Créez une règle report-only exigeant un appareil conforme pour un groupe pilote macOS.",
    "Intermédiaire",
    "45 min",
    "Intune Compliance",
    "azure-for-apple-admins",
    ["Créer une règle CA en report-only", "Exiger appareil conforme", "Analyser sign-in logs"],
    ["Entra ID P1+", "Policy conformité macOS", "Utilisateur pilote"],
    [
      { id: "scope", title: "Définir scope", instruction: "Entra → Conditional Access → New policy. Ciblez uniquement le groupe pilote.", expectedResult: "Scope limité aux utilisateurs pilotes." },
      { id: "cloud-app", title: "Choisir app", instruction: "Sélectionnez Office 365 ou une app test contrôlée.", expectedResult: "Application cible documentée." },
      { id: "grant", title: "Grant control", instruction: "Grant → Require device to be marked as compliant.", expectedResult: "Exigence appareil conforme configurée." },
      { id: "report", title: "Report-only", instruction: "Activez Report-only, pas On, pour le premier test.", expectedResult: "Aucun blocage immédiat en production." },
      { id: "logs", title: "Lire logs", instruction: "Testez une connexion puis consultez Sign-in logs → Conditional Access.", expectedResult: "Impact de la règle visible." },
    ],
    "Règle CA macOS en report-only, impact compris et prête pour validation progressive."
  ),
  lab(
    "azure-platform-sso-deployment",
    "Déployer Platform SSO avec Entra ID",
    "Déployez un profil Platform SSO macOS et validez l'enregistrement utilisateur Entra.",
    "Intermédiaire",
    "60 min",
    "Platform SSO",
    "azure-for-apple-admins",
    ["Préparer l'extension SSO", "Déployer le profil Platform SSO", "Tester login/unlock macOS"],
    ["Mac compatible", "Intune ou MDM compatible", "Utilisateur Entra pilote"],
    [
      { id: "prereq", title: "Valider prérequis", instruction: "Confirmez version macOS, Company Portal/extension Microsoft et enrollment MDM.", expectedResult: "Mac prêt pour Platform SSO." },
      { id: "profile", title: "Créer profil", instruction: "Intune → macOS configuration → Platform SSO. Renseignez les paramètres tenant/extension requis.", expectedResult: "Profil Platform SSO créé." },
      { id: "assign", title: "Assigner pilote", instruction: "Assignez au groupe pilote macOS.", expectedResult: "Profil ciblé sans scope global." },
      { id: "register", title: "Enregistrer utilisateur", instruction: "Sur Mac, suivez l'invite Platform SSO avec le compte Entra.", expectedResult: "Utilisateur enregistré Platform SSO." },
      { id: "apps", title: "Tester apps", instruction: "Testez unlock/login puis accès Outlook/Teams/Safari.", expectedResult: "SSO fonctionnel, prompts réduits." },
    ],
    "Platform SSO opérationnel sur Mac pilote avec identité Entra validée."
  ),
  lab(
    "azure-defender-macos-deployment",
    "Déployer Microsoft Defender pour macOS",
    "Onboardez Defender for Endpoint sur Mac via Intune et validez le reporting sécurité.",
    "Intermédiaire",
    "55 min",
    "Microsoft Defender",
    "azure-for-apple-admins",
    ["Vérifier licences Defender", "Déployer onboarding macOS", "Valider health et reporting"],
    ["Licence Defender for Endpoint", "Mac enrôlé Intune", "Accès Microsoft Defender portal"],
    [
      { id: "license", title: "Vérifier licence", instruction: "Microsoft Defender portal → Settings → Endpoints. Vérifiez disponibilité licensing/onboarding.", expectedResult: "Tenant prêt pour Defender macOS." },
      { id: "onboarding", title: "Créer policy", instruction: "Intune → Endpoint security → Microsoft Defender for Endpoint → macOS onboarding.", expectedResult: "Policy Defender macOS créée." },
      { id: "permissions", title: "Déployer permissions", instruction: "Ajoutez les profils requis : Full Disk Access, system extensions, network/content filter si nécessaire.", expectedResult: "Permissions macOS appliquées." },
      { id: "sync", title: "Synchroniser Mac", instruction: "Forcez sync puis vérifiez processus Defender et statut local.", expectedResult: "Agent installé et actif." },
      { id: "portal", title: "Valider reporting", instruction: "Defender portal → Devices → Mac pilote.", expectedResult: "Mac visible avec état healthy ou erreur documentée." },
    ],
    "Defender macOS déployé via Intune, agent actif et reporting visible dans le portal."
  ),
  ...applePlatformDeploymentLabs,
  ...acitpCertificationLabs,
  ...appleTrainingLabs,
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
