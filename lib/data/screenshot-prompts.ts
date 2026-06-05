import type { ScreenshotCategory } from "@/lib/types";
import { buildScreenshotPrompt } from "@/lib/data/screenshot-style";

export type ScreenshotPromptEntry = {
  id: string;
  category: ScreenshotCategory;
  filename: string;
  title: string;
  description: string;
  caption: string;
  scenePrompt: string;
  generationPrompt: string;
};

function entry(
  id: string,
  category: ScreenshotCategory,
  filename: string,
  title: string,
  description: string,
  caption: string,
  scenePrompt: string
): ScreenshotPromptEntry {
  return {
    id,
    category,
    filename,
    title,
    description,
    caption,
    scenePrompt,
    generationPrompt: buildScreenshotPrompt(scenePrompt),
  };
}

/** 90 captures · style global + scène EN · 1920×1080 · 16:9 */
export const SCREENSHOT_PROMPTS: ScreenshotPromptEntry[] = [
  entry("01", "apple-business-manager", "01-connexion-abm.webp", "Connexion Apple Business Manager", "Page d'authentification business.apple.com avec compte administrateur fédéré ou Managed Apple ID.", "Référence Apple Business Manager User Guide — chapitre « Sign in ».", "Apple Business Manager login screen, enterprise environment, Apple official interface, sign-in page with company branding"),
  entry("02", "apple-business-manager", "02-tableau-de-bord-abm.webp", "Tableau de bord ABM", "Vue d'ensemble ABM : appareils, utilisateurs, apps et statut des services.", "Point d'entrée pour auditer l'état global du tenant avant tout déploiement MDM.", "Apple Business Manager dashboard, devices overview, managed Apple IDs, apps and books, organization statistics"),
  entry("03", "apple-business-manager", "03-gestion-des-appareils.webp", "Gestion des appareils", "Liste des appareils enregistrés avec statut d'assignation MDM et date d'ajout.", "Menu Réglages > Gestion des appareils — référence DEP/ADE.", "Apple Business Manager devices section, inventory of iPhone, iPad and Mac devices"),
  entry("04", "apple-business-manager", "04-ajouter-serveur-mdm.webp", "Ajouter un serveur MDM", "Assistant de création de serveur MDM avec import de la clé publique Intune ou Jamf.", "Étape obligatoire avant tout jeton d'enrollment Automated Device Enrollment.", "Apple Business Manager add MDM server wizard, enterprise deployment workflow"),
  entry("05", "apple-business-manager", "05-telechargement-token-serveur.webp", "Téléchargement du token serveur", "Bouton Download Token générant le fichier server_token.p7m pour le serveur MDM.", "Jeton valide 365 jours — planifier le renouvellement à J-60.", "Apple Business Manager MDM server token download page"),
  entry("06", "apple-business-manager", "06-attribution-appareil.webp", "Attribution d'un appareil", "Assignation d'un ou plusieurs appareils au serveur MDM Intune Production.", "Un appareil non assigné n'apparaîtra pas dans le portail MDM.", "Apple Business Manager assign devices to MDM server"),
  entry("07", "apple-business-manager", "07-recherche-numero-serie.webp", "Recherche par numéro de série", "Champ de recherche filtrant la flotte par serial number ou order number.", "Utile pour le support L1 lors d'un ticket d'enrollment bloqué.", "Apple Business Manager serial number search interface"),
  entry("08", "apple-business-manager", "08-apps-and-books.webp", "Apps & Books", "Catalogue Apps & Books avec recherche, achat de licences et historique des commandes.", "Anciennement VPP — licences liées à l'organisation, pas à l'utilisateur.", "Apple Business Manager Apps and Books dashboard"),
  entry("09", "apple-business-manager", "09-gestion-utilisateurs.webp", "Gestion des utilisateurs", "Section Comptes : création, import CSV et rôles des utilisateurs ABM.", "Distinct des comptes MDM — concerne l'accès au portail Apple.", "Apple Business Manager user management interface"),
  entry("10", "apple-business-manager", "10-managed-apple-ids.webp", "Managed Apple IDs", "Vue des Managed Apple IDs créés manuellement ou via fédération.", "Référence Apple Platform Deployment — Managed Apple IDs.", "Apple Business Manager managed Apple IDs administration"),
  entry("11", "apple-business-manager", "11-federation-entra-id.webp", "Fédération Microsoft Entra ID", "Assistant fédération : domaine vérifié, SCIM et SSO vers Entra ID.", "Prérequis : domaine DNS validé et permissions Global Administrator.", "Apple Business Manager federation with Microsoft Entra ID"),
  entry("12", "apple-business-manager", "12-validation-domaine.webp", "Validation du domaine", "Enregistrement TXT DNS pour prouver la propriété du domaine entreprise.", "Étape requise avant Domain Capture et fédération.", "Apple Business Manager domain verification process"),
  entry("13", "apple-business-manager", "13-parametres-abm.webp", "Paramètres ABM", "Réglages organisationnels : nom, fuseau horaire, contacts et notifications.", "Documenter le contact technique pour les alertes Apple.", "Apple Business Manager settings dashboard"),
  entry("14", "apple-business-manager", "14-emplacements.webp", "Emplacements", "Gestion des sites (locations) pour répartir appareils et achats par entité.", "Aligné sur la structure Active Directory ou les cost centers.", "Apple Business Manager locations management"),
  entry("15", "apple-business-manager", "15-roles-administratifs.webp", "Rôles administratifs", "Matrice des rôles ABM : Admin, Manager, Device Enrollment Manager.", "Principe du moindre privilège — séparer achat et enrollment.", "Apple Business Manager role assignment interface"),
  entry("16", "ade", "16-affectation-ade.webp", "Affectation ADE", "Assignation en masse d'appareils ADE au serveur MDM cible.", "Automated Device Enrollment — ex-DEP.", "Apple Automated Device Enrollment assignment interface"),
  entry("17", "ade", "17-liste-appareils-ade.webp", "Liste des appareils ADE", "Inventaire ADE avec modèle, OS, statut de supervision et profil assigné.", "Synchronisation ABM ↔ MDM toutes les 24 h maximum.", "ADE device inventory dashboard"),
  entry("18", "ade", "18-profil-enrolement.webp", "Profil d'enrôlement", "Configuration du profil ADE : skip screens, admin account, supervision.", "Profil distinct par plateforme (iOS vs macOS).", "Enrollment profile configuration screen"),
  entry("19", "ade", "19-synchronisation-ade.webp", "Synchronisation ADE", "Statut de sync entre ABM et le serveur MDM avec horodatage.", "Forcer une sync après assignation massive.", "ADE synchronization between ABM and Intune"),
  entry("20", "ade", "20-ecran-activation-iphone.webp", "Écran d'activation iPhone", "Setup Assistant iOS au premier démarrage avant Remote Management.", "Testez sur appareil usine reset pour valider le parcours.", "iPhone setup assistant activation screen"),
  entry("21", "ade", "21-appareil-est-gere.webp", "Écran « Cet appareil est géré »", "Message iOS indiquant la gestion organisationnelle et les restrictions.", "Visible uniquement si le profil ADE est correctement assigné.", "Corporate managed device enrollment screen"),
  entry("22", "ade", "22-remote-management.webp", "Écran Remote Management", "Étape MDM obligatoire affichant le nom de l'organisation.", "Point de non-retour — l'enrollment MDM est appliqué ici.", "Apple Remote Management enrollment screen"),
  entry("23", "ade", "23-deploiement-mac-ade.webp", "Déploiement Mac ADE", "Mac au Setup Assistant avec écran Remote Management macOS.", "Zero-touch : aucune intervention IT sur site.", "Mac automated enrollment workflow"),
  entry("24", "ade", "24-configuration-assistant.webp", "Configuration Assistant", "Assistant macOS/iOS avec écrans ignorés (Skip Setup) configurés.", "Réduire la friction utilisateur sans compromettre la sécurité.", "Apple setup assistant enterprise deployment"),
  entry("25", "ade", "25-supervision-automatique.webp", "Supervision automatique", "Confirmation du mode supervisé activé via ADE.", "Requis pour installations silencieuses et restrictions avancées.", "Supervised mode configuration dashboard"),
  entry("26", "intune", "26-intune-admin-center.webp", "Intune Admin Center", "Portail Microsoft Intune — endpoint.microsoft.com, vue Devices.", "Style Microsoft Learn — navigation latérale Endpoint Manager.", "Microsoft Intune Admin Center dashboard"),
  entry("27", "intune", "27-devices.webp", "Devices", "Inventaire unifié iOS, iPadOS, macOS et Windows dans Intune.", "Filtrer par plateforme Apple pour les opérations MDM.", "Microsoft Intune devices inventory"),
  entry("28", "intune", "28-apple-enrollment.webp", "Apple Enrollment", "Section Devices > Enrollment > Apple avec APNs et tokens ABM.", "Hub central de la gestion Apple dans Intune.", "Intune Apple enrollment configuration"),
  entry("29", "intune", "29-apns-configuration.webp", "APNs Configuration", "Certificat Apple MDM Push Certificate avec date d'expiration.", "Sans APNs valide, aucune commande MDM n'est livrée.", "Intune APNs certificate configuration"),
  entry("30", "intune", "30-enrollment-program-tokens.webp", "Enrollment Program Tokens", "Liste des jetons ABM importés et statut de synchronisation.", "Un token par tenant ABM / serveur MDM.", "Intune Enrollment Program Tokens dashboard"),
  entry("31", "intune", "31-import-token-abm.webp", "Import token ABM", "Assistant d'import du fichier server_token.p7m.", "Conserver le token source dans Azure Key Vault.", "Import Apple Business Manager token into Intune"),
  entry("32", "intune", "32-configuration-profiles.webp", "Configuration Profiles", "Création de profil macOS/iOS : templates Wi-Fi, VPN, restrictions.", "Nommer avec préfixe site-fonction-version.", "Intune configuration profiles dashboard"),
  entry("33", "intune", "33-applications-ios.webp", "Applications iOS", "Catalogue apps iOS/iPadOS : store, LOB et VPP.", "Mode Required pour déploiement silencieux supervisé.", "Intune iOS applications deployment"),
  entry("34", "intune", "34-applications-macos.webp", "Applications macOS", "Apps macOS : PKG, App Store et VPP macOS.", "Vérifier les exigences PPPC pour apps tierces.", "Intune macOS applications deployment"),
  entry("35", "intune", "35-compliance-policies.webp", "Compliance Policies", "Politiques de conformité Apple : OS minimum, jailbreak, chiffrement.", "Lier à Conditional Access pour blocage effectif.", "Intune compliance policies dashboard"),
  entry("36", "intune", "36-conditional-access.webp", "Conditional Access", "Règle CA exigeant appareil conforme Intune pour accès M365.", "Intégration Entra ID + Intune — Zero Trust.", "Microsoft Conditional Access policies"),
  entry("37", "intune", "37-platform-sso.webp", "Platform SSO", "Vue Intune du profil Platform SSO macOS et statut de déploiement.", "macOS 14+ requis — complète Entra ID.", "Platform SSO configuration profile in Intune"),
  entry("38", "intune", "38-managed-devices.webp", "Managed Devices", "Fiche appareil gérée : conformité, profils, apps, hardware.", "Vue support L2 — historique des actions MDM.", "Managed Apple devices inventory"),
  entry("39", "intune", "39-device-configuration.webp", "Device Configuration", "Profils assignés à l'appareil et état de synchronisation.", "Identifier les profils en erreur avant escalation.", "Device configuration management dashboard"),
  entry("40", "intune", "40-device-compliance.webp", "Device Compliance", "Rapport de conformité par appareil avec raisons d'échec.", "Corréler avec les logs Entra sign-in.", "Compliance reporting dashboard"),
  entry("41", "apns", "41-push-certificates-portal.webp", "Apple Push Certificates Portal", "Portail identity.apple.com/pushcert — liste des certificats MDM.", "Apple Push Notification service — documentation officielle.", "Apple Push Certificates Portal interface"),
  entry("42", "apns", "42-upload-csr.webp", "Upload CSR", "Téléversement du Certificate Signing Request généré par Intune.", "CSR unique par tenant — ne pas réutiliser entre MDM.", "CSR upload screen in Apple Push Certificates Portal"),
  entry("43", "apns", "43-download-certificate.webp", "Download Certificate", "Téléchargement du certificat .pem après validation Apple.", "Apple ne permet qu'un seul téléchargement — archiver immédiatement.", "Certificate download screen"),
  entry("44", "apns", "44-import-apns-intune.webp", "Import APNs Intune", "Import du certificat .pem dans Intune Admin Center.", "Vérifier la correspondance Apple ID et date d'expiration.", "Import APNs certificate into Intune"),
  entry("45", "apns", "45-expiration-apns.webp", "Expiration APNs", "Alerte ou statut expiré du certificat push dans la console.", "Renouveler avant expiration — pas de grace period MDM.", "APNs expiration monitoring dashboard"),
  entry("46", "apns", "46-renouvellement-apns.webp", "Renouvellement APNs", "Workflow de renouvellement avec le même Apple ID entreprise.", "Changer d'Apple ID nécessite un re-enrollment complet.", "APNs renewal workflow"),
  entry("47", "apps-books", "47-recherche-application.webp", "Recherche application", "Recherche dans Apps & Books ABM par nom ou Bundle ID.", "Vérifier la compatibilité VPP/macOS/iOS avant achat.", "Apps and Books application search screen"),
  entry("48", "apps-books", "48-achat-licences.webp", "Achat licences", "Panier d'achat de licences en volume avec quantité et type.", "Licences assignables vs device-based selon l'app.", "Volume license purchase workflow"),
  entry("49", "apps-books", "49-inventaire-licences.webp", "Inventaire licences", "Vue des licences disponibles, assignées et récupérables.", "Audit trimestriel pour optimiser les coûts.", "License inventory dashboard"),
  entry("50", "apps-books", "50-attribution-applications.webp", "Attribution applications", "Assignation de licences à un serveur MDM ou à des appareils.", "Synchroniser Intune après chaque achat ABM.", "Application assignment workflow"),
  entry("51", "apps-books", "51-synchronisation-apps-books.webp", "Synchronisation Apps & Books", "Connecteur VPP Intune — sync manuelle ou automatique.", "Tenant admin > Connectors and tokens.", "Apps and Books synchronization dashboard"),
  entry("52", "apps-books", "52-deploiement-teams.webp", "Déploiement Teams", "Policy Intune déployant Microsoft Teams via licence VPP.", "Exemple courant en environnement M365.", "Microsoft Teams deployment from Intune"),
  entry("53", "apps-books", "53-deploiement-outlook.webp", "Déploiement Outlook", "Déploiement Outlook mobile/desktop via Apps & Books.", "Configurer les données account après installation.", "Microsoft Outlook deployment workflow"),
  entry("54", "managed-apple-id", "54-creation-utilisateur.webp", "Création utilisateur", "Formulaire de création manuelle d'un Managed Apple ID dans ABM.", "Format : prenom.nom@domaine-federé.appleid.com.", "Managed Apple ID user creation interface"),
  entry("55", "managed-apple-id", "55-federation-entra-id.webp", "Fédération Entra ID", "Connecteur SCIM et SSO Entra ID vers Managed Apple IDs.", "Référence Microsoft — fédération ABM.", "Federation setup between ABM and Entra ID"),
  entry("56", "managed-apple-id", "56-synchronisation-utilisateurs.webp", "Synchronisation utilisateurs", "Cycle de sync SCIM : création, mise à jour, désactivation.", "Surveiller les erreurs de provisioning dans Entra.", "User synchronization dashboard"),
  entry("57", "managed-apple-id", "57-verification-domaine.webp", "Vérification domaine", "Statut de validation DNS pour le domaine fédéré.", "Requis avant activation Domain Capture.", "DNS domain verification workflow"),
  entry("58", "managed-apple-id", "58-gestion-des-comptes.webp", "Gestion des comptes", "Liste des Managed Apple IDs avec rôle et statut.", "Pas d'App Store personnel ni iCloud Photos complet.", "Managed Apple IDs account management"),
  entry("59", "platform-sso", "59-configuration-platform-sso.webp", "Configuration Platform SSO", "Vue d'ensemble de l'architecture Platform SSO macOS + Entra ID.", "Apple Platform Deployment — Platform SSO for macOS.", "Platform SSO configuration dashboard"),
  entry("60", "platform-sso", "60-profil-intune-platform-sso.webp", "Profil Intune Platform SSO", "Payload Platform SSO dans un profil de configuration macOS.", "URL d'enrollment et Extension Identifier requis.", "Platform SSO deployment profile"),
  entry("61", "platform-sso", "61-connexion-utilisateur.webp", "Connexion utilisateur", "Écran de login macOS avec authentification Platform SSO.", "Expérience passwordless au déverrouillage.", "macOS login using Platform SSO"),
  entry("62", "platform-sso", "62-synchronisation-mot-de-passe.webp", "Synchronisation mot de passe", "Password Sync Entra ID après changement de mot de passe.", "Tester le scénario reset password en lab.", "Password synchronization process"),
  entry("63", "platform-sso", "63-mfa-microsoft.webp", "MFA Microsoft", "Invite MFA lors de l'enrollment Platform SSO.", "Conditional Access peut exiger MFA à l'inscription.", "Microsoft Entra ID MFA verification screen"),
  entry("64", "jamf", "64-dashboard-jamf.webp", "Dashboard Jamf", "Accueil Jamf Pro avec widgets inventaire, policies et alertes.", "Jamf Training Catalog — Jamf Pro fundamentals.", "Jamf Pro dashboard overview"),
  entry("65", "jamf", "65-computers.webp", "Computers", "Inventaire Mac avec smart groups, extension attributes et statut MDM.", "Navigation Computers > recherche avancée.", "Jamf Pro computers inventory"),
  entry("66", "jamf", "66-mobile-devices.webp", "Mobile Devices", "Inventaire iPhone/iPad supervisés dans Jamf Pro.", "Filtrer par version iOS et statut de supervision.", "Jamf Pro mobile devices dashboard"),
  entry("67", "jamf", "67-smart-groups.webp", "Smart Groups", "Critères dynamiques : OS, app installée, EA, AD group.", "Base du scope policies et profils Jamf.", "Jamf Pro Smart Groups configuration"),
  entry("68", "jamf", "68-static-groups.webp", "Static Groups", "Groupe manuel pour pilotes et exceptions.", "Combiner avec Smart Groups via exclusions.", "Jamf Pro Static Groups management"),
  entry("69", "jamf", "69-policies.webp", "Policies", "Policy Jamf : scripts, packages, maintenance et ordre d'exécution.", "Jamf 100 — Policies and management.", "Jamf Pro policy creation screen"),
  entry("70", "jamf", "70-configuration-profiles.webp", "Configuration Profiles", "Profils Jamf : Wi-Fi, restrictions, PPPC, certificates.", "Signature et scope par site ou département.", "Jamf Pro configuration profiles editor"),
  entry("71", "jamf", "71-packages.webp", "Packages", "PKG deployés via policies — Office, agents, drivers.", "Utiliser flat packages quand possible.", "Jamf package repository dashboard"),
  entry("72", "jamf", "72-scripts.webp", "Scripts", "Scripts bash/zsh avec paramètres et conditions d'exécution.", "Jamf 170 — Advanced scripting.", "Jamf script management interface"),
  entry("73", "jamf", "73-patch-management.webp", "Patch Management", "Catalogue Patch Management avec approbation et déploiement.", "Jamf 200 — Patch Management module.", "Jamf patch management dashboard"),
  entry("74", "jamf", "74-inventory.webp", "Inventory", "Données d'inventaire étendues : apps, fonts, services.", "Alimente Extension Attributes et compliance.", "Jamf inventory reporting"),
  entry("75", "jamf", "75-enrollment.webp", "Enrollment", "Configuration DEP/ADE et Automated Device Enrollment Jamf.", "Lier ABM au serveur Jamf Pro.", "Jamf enrollment workflow"),
  entry("76", "jamf", "76-prestage-enrollment.webp", "PreStage Enrollment", "PreStage macOS/iOS : skip screens, packages, profils initiaux.", "Équivalent du profil ADE Intune.", "Jamf PreStage Enrollment configuration"),
  entry("77", "jamf", "77-self-service.webp", "Self Service", "Catalogue Self Service pour apps et scripts utilisateur.", "Jamf 170 — Self Service branding.", "Jamf Self Service portal"),
  entry("78", "jamf", "78-jamf-protect.webp", "Jamf Protect", "Console Jamf Protect — analytics et remédiation macOS.", "Complément sécurité endpoint Apple.", "Jamf Protect security dashboard"),
  entry("79", "filevault", "79-filevault-active.webp", "FileVault activé", "Réglages Système > Confidentialité et sécurité > FileVault activé.", "Apple Platform Deployment — FileVault.", "macOS FileVault enabled screen"),
  entry("80", "filevault", "80-cle-recuperation.webp", "Clé de récupération", "Clé escrow Intune/Jamf ou clé institutionnelle de récupération.", "Sans escrow, perte de données en cas d'oubli mot de passe.", "Recovery key escrow dashboard"),
  entry("81", "security", "81-gatekeeper.webp", "Gatekeeper", "Autorisation des apps : App Store, développeurs identifiés.", "Combiner avec restrictions MDM en entreprise.", "macOS Gatekeeper settings"),
  entry("82", "security", "82-xprotect.webp", "XProtect", "Statut XProtect et Gatekeeper dans System Information.", "Mises à jour signatures automatiques Apple.", "Apple XProtect malware protection interface"),
  entry("83", "security", "83-sip.webp", "SIP", "System Integrity Protection activé — csrutil status.", "Ne pas désactiver SIP en production.", "System Integrity Protection status screen"),
  entry("84", "security", "84-activation-lock.webp", "Activation Lock", "Activation Lock MDM bypass code ou statut dans Intune/Jamf.", "Documenter les bypass codes par appareil.", "Activation Lock management dashboard"),
  entry("85", "security", "85-privacy-preferences.webp", "Privacy Preferences", "PPPC : accès disque complet, caméra, micro pour apps MDM.", "Requis pour agents EDR et backup.", "PPPC profile management interface"),
  entry("86", "security", "86-system-extensions.webp", "System Extensions", "Approbation System Extensions via profil MDM.", "Kernel extensions dépréciées — migrer vers SE.", "macOS System Extensions configuration"),
  entry("87", "exams", "87-simulation-apple-it-pro.webp", "Simulation Apple IT Professional", "Interface d'examen blanc Apple IT Professional — timer et navigation.", "Conditions proches de l'examen Pearson VUE.", "Apple certification mock exam interface"),
  entry("88", "exams", "88-resultats-examen.webp", "Résultats examen", "Écran de résultats avec score, domaines faibles et recommandations.", "Seuil de réussite et plan de révision.", "Certification exam results dashboard"),
  entry("89", "exams", "89-simulation-jamf-100.webp", "Simulation Jamf 100", "Examen blanc Jamf Certified Associate — questions à choix multiples.", "Jamf Training Catalog — certification path.", "Jamf 100 practice exam interface"),
  entry("90", "exams", "90-simulation-jamf-200.webp", "Simulation Jamf 200", "Examen blanc Jamf Certified Admin — scénarios avancés.", "Prérequis : Jamf 100 validé.", "Jamf 200 advanced mock exam interface"),
];

export const SCREENSHOT_PROMPTS_BY_ID = Object.fromEntries(
  SCREENSHOT_PROMPTS.map((p) => [p.id, p])
) as Record<string, ScreenshotPromptEntry>;

export function getGenerationPrompt(id: string): string | undefined {
  return SCREENSHOT_PROMPTS_BY_ID[id]?.generationPrompt;
}
