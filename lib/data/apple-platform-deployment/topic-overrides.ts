import type { AppleDeploymentTopicExtension } from "@/lib/data/apple-platform-deployment/types";

/**
 * Contenus alignés Apple Platform Deployment — pas de texte générique.
 * Sources : Apple Business Manager User Guide, Platform Deployment, Device Management.
 */
export const APPLE_PLATFORM_DEPLOYMENT_TOPICS: Record<string, AppleDeploymentTopicExtension> = {
  "abm-creation-roles": {
    focus: "Apple Business Manager : organisations, emplacements, utilisateurs, rôles et gouvernance MDM",
    outcomes: [
      "Structurer une organisation ABM multi-sites conforme au modèle Apple Platform Deployment.",
      "Attribuer les rôles ABM selon le moindre privilège (Admin, Manager, Device Enrollment Manager, Content Manager).",
      "Préparer les serveurs MDM, domaines vérifiés et fédération identité pour une flotte enterprise.",
    ],
    concepts: [
      "Organisation ABM = entité légale liée au D-U-N-S ; les Emplacements (Locations) segmentent achats, inventaire et admins par pays ou entité juridique.",
      "Rôles ABM : Administrator (complet), Manager (sans facturation), Device Enrollment Manager (MDM/ADE uniquement), Content Manager (Apps & Books), People Manager (Managed Apple IDs).",
      "Managed Apple IDs : identités organisationnelles distinctes des Apple ID personnels — création manuelle, import CSV ou fédération Microsoft Entra ID / Google Workspace.",
      "Apps & Books : achat licences VPP au nom de l'organisation, assignation au serveur MDM, synchronisation token contenu.",
      "Domaines vérifiés : preuve de propriété DNS (TXT) pour fédérer les emails @entreprise.com vers Managed Apple IDs.",
      "Serveurs MDM : token server_token.p7m annuel — un serveur Production Intune, un Staging, un Jamf selon gouvernance.",
    ],
    enterpriseScenario: [
      "Cas GlobalTech — 1 000 employés, 5 pays (France, Allemagne, UK, US, Canada), 800 Mac + 400 iPhone.",
      "Question 1 — Emplacements : créer 5 Locations ABM alignées entités juridiques ; achats auto-assignés par revendeur agréé par pays.",
      "Question 2 — Rôles : 2 Administrators (IT + sécurité), 1 Device Enrollment Manager par région, 1 Content Manager central, People Manager pour MAID.",
      "Question 3 — Managed Apple IDs : fédération Entra ID pour @globaltech.com ; MAID pour apps Apple et Shared iPad ; interdiction Apple ID perso via MDM.",
    ],
    procedure: [
      "Valider D-U-N-S et créer l'organisation ABM (sign.apple.com).",
      "Créer les 5 Emplacements et assigner admins régionaux avec MFA obligatoire.",
      "Vérifier domaine @globaltech.com (DNS TXT) et activer fédération Entra ID.",
      "Enregistrer serveurs MDM Production (Intune) et Staging (Jamf lab).",
      "Configurer Apps & Books : token contenu lié Intune, achat licences pilote Office/Teams.",
      "Assigner 10 appareils test par pays au serveur MDM et exporter inventaire pour audit.",
    ],
    actions: [
      "Cartographier entités juridiques → Emplacements ABM.",
      "Matrice rôles × personnes avec comptes break-glass documentés.",
      "Activer fédération et tester création MAID automatique.",
      "Créer serveurs MDM et archiver tokens .p7m avec date expiration.",
    ],
    validation: [
      "Chaque pays a un Emplacement, un admin MDM et un inventaire appareils visible.",
      "Aucun compte Administrator partagé — MFA actif sur tous les admins.",
      "Domaine vérifié et fédération Entra fonctionnelle sur compte test.",
    ],
    risks: [
      "Un seul Administrator global sans séparation des duties (SOX, ISO 27001).",
      "Token MDM expiré sans procédure renouvellement — perte gestion flotte.",
      "Achats hors revendeur agréé — appareils absents d'ABM, pas d'ADE.",
    ],
    tools: ["Apple Business Manager", "Microsoft Entra ID", "Intune", "Jamf Pro"],
    troubleshooting: [
      {
        problem: "Appareil acheté absent d'ABM après 48 h",
        solution: "Vérifier numéro commande revendeur agréé, numéro série, et délai propagation (jusqu'à 72 h). Contacter revendeur pour réassignation org ABM.",
      },
      {
        problem: "Fédération Entra échoue à la vérification domaine",
        solution: "Contrôler enregistrement TXT DNS, propagation DNS (24–48 h), et correspondance exacte du domaine dans ABM > Settings > Accounts.",
      },
      {
        problem: "Rôle insuffisant pour assigner appareils au MDM",
        solution: "Le rôle Device Enrollment Manager ou Administrator est requis. Manager seul ne peut pas modifier assignations MDM.",
      },
    ],
    officialReferences: [
      "https://support.apple.com/guide/apple-business-manager/welcome/web",
      "https://support.apple.com/guide/apple-business-manager/intro-to-roles-aee83a2a5e3/web",
      "https://support.apple.com/guide/apple-business-manager/add-and-edit-users-axm4a32688/webs",
    ],
  },

  "dep-enrollment": {
    focus: "Automated Device Enrollment (ADE) — supervision, activation zero-touch et cycle de vie appareil",
    outcomes: [
      "Expliquer le flux ADE de l'achat ABM au premier check-in MDM sans intervention IT.",
      "Configurer profils d'enrollment supervisés pour Mac, iPhone et iPad.",
      "Gérer attribution serveur MDM, Return to Service et désassignation au offboarding.",
    ],
    concepts: [
      "ADE (ex-DEP) : Apple enregistre l'appareil à l'organisation à l'achat — au premier boot, Setup Assistant contacte Apple et télécharge le profil MDM assigné dans ABM.",
      "Supervision : mode management renforcé — restrictions avancées, silent app install, single app mode, effacement activation contrôlé.",
      "Profil d'enrollment : Remote Management obligatoire, écrans Setup Assistant ignorés, await configuration, compte admin optionnel macOS.",
      "Cycle de vie : achat → ABM → assignation MDM → ADE → check-in → config → utilisateur → offboarding → release ABM → revente ou reassignment.",
      "Return to Service (macOS 14+) : effacement avec re-enrollment automatique ADE sans perdre supervision.",
    ],
    enterpriseScenario: [
      "Cas LogiCorp — commande 500 MacBook Pro M4 via Apple Business Direct, déploiement zero-touch 6 semaines.",
      "Semaine 1–2 : serveur MDM Intune, profil ADE macOS (supervisé, FileVault, skip screens), assignation serials ABM.",
      "Semaine 3–4 : pilote 50 Mac — validation Setup Assistant, Remote Management, apps Required via VPP.",
      "Semaine 5–6 : rollout 450 Mac — monitoring check-in, helpdesk script first-boot, rollback sur 5 % si crash apps Intel.",
    ],
    procedure: [
      "ABM : assigner 500 serials au serveur MDM Intune Production.",
      "Intune : profil ADE macOS — Supervised, Locked enrollment, Await device configured, Display name « LogiCorp IT ».",
      "Intune : compliance FileVault + profils Wi-Fi/EAP-TLS scoped groupe ADE-Mac-Pilot puis ADE-Mac-Prod.",
      "Tester 1 Mac effacé (Erase All Content) — vérifier Remote Management et inventaire < 15 min.",
      "Documenter runbook utilisateur : « Allumez, connectez Wi-Fi, connectez-vous Entra ID ».",
    ],
    actions: [
      "Synchroniser inventaire ABM → Intune après assignation bulk serials.",
      "Créer profils ADE distincts macOS / iOS si payloads diffèrent.",
      "Pilot 50 appareils avec métriques time-to-productivity et tickets support.",
    ],
    validation: [
      "100 % Mac pilote supervisés, FileVault activé, check-in < 30 min post-unbox.",
      "Aucune configuration manuelle MDM profile par utilisateur.",
    ],
    risks: [
      "Profil ADE assigné après livraison — utilisateur passe Setup sans MDM (non supervisé).",
      "Oublier Await Device Configured — utilisateur accède bureau avant policies.",
    ],
    tools: ["Apple Business Manager", "Automated Device Enrollment", "Microsoft Intune", "Apple Configurator"],
    troubleshooting: [
      {
        problem: "Remote Management n'apparaît pas au setup",
        solution: "Vérifier serial dans ABM, assignation serveur MDM correct, profil ADE assigné au device ou groupe, connexion Internet active.",
      },
      {
        problem: "Mac enrollé mais non supervisé",
        solution: "ADE requis — enrollment manuel ou User Enrollment ne donne pas supervision. Effacer et repasser par ADE.",
      },
    ],
    officialReferences: [
      "https://support.apple.com/guide/apple-business-manager/automated-device-enrollment-axm200a54d59/web",
      "https://support.apple.com/guide/deployment/dep-overview-depca267913/web",
    ],
  },

  "apps-books": {
    focus: "Apps & Books — licences VPP, attribution device/user et synchronisation MDM",
    outcomes: [
      "Acheter et assigner licences Apps & Books via ABM vers Intune ou Jamf.",
      "Choisir attribution par appareil vs par utilisateur (Managed Apple ID).",
      "Récupérer licences lors du remplacement device ou départ employé.",
    ],
    concepts: [
      "Apps & Books remplace VPP : licences propriété organisation, pas de compte Apple perso requis pour apps gérées.",
      "Attribution device-based : licence liée au serial — idéal iPad partagés, kiosque.",
      "Attribution user-based : licence suit Managed Apple ID — idéal Mac nominals BYOD corporate.",
      "Token contenu : lien ABM ↔ MDM ; sync régulière pour nouvelles apps et récupération licences.",
      "Apps custom B2B et books distribuables via même pipeline.",
    ],
    enterpriseScenario: [
      "Cas FinanceHub — 600 Mac, déploiement Microsoft 365 + Adobe Creative Cloud + app métier interne.",
      "Achat 650 licences Teams device-based (marge remplacement), 600 licences Adobe user-based liées MAID.",
      "Intune Required install scoped groupe « Mac-Finance » — Company Portal fallback si échec.",
    ],
    procedure: [
      "ABM Apps & Books : acheter licences, assigner au serveur MDM.",
      "Intune : sync token, créer app iOS/macOS, assignment Required.",
      "Pilote 20 Mac — vérifier install sans App Store perso.",
      "Procédure récupération licence : wipe device → licence libérée sous 24–48 h.",
    ],
    actions: [
      "Inventorier apps obligatoires par persona.",
      "Choisir device vs user par app selon modèle licence éditeur.",
      "Tester récupération licence sur remplacement Mac.",
    ],
    validation: [
      "Apps Required installées sans intervention utilisateur sur appareils supervisés.",
      "Licences récupérables visibles dans ABM après wipe.",
    ],
    risks: [
      "Licences user-based sans MAID — assignation impossible.",
      "Dépassement quota licences — échec install silencieux.",
    ],
    tools: ["Apps & Books", "Apple Business Manager", "Intune", "Jamf Pro"],
    troubleshooting: [
      {
        problem: "App bloquée « Waiting for license »",
        solution: "Sync token VPP, vérifier licences disponibles ABM, assignment au bon serveur MDM.",
      },
    ],
    officialReferences: [
      "https://support.apple.com/guide/apple-business-manager/intro-to-apps-and-books-axme824904e3/web",
    ],
  },

  "filevault-chiffrement": {
    focus: "FileVault 2 — chiffrement volume, escrow clé entreprise et conformité",
    outcomes: [
      "Déployer FileVault via MDM avec escrow clé de secours.",
      "Intégrer FileVault dans policies compliance Intune/Jamf.",
      "Procédure support récupération clé avec audit.",
    ],
    concepts: [
      "FileVault 2 chiffre volume de données AES-XTS ; Secure Token / Bootstrap Token pour MDM escrow.",
      "Clé de secours remontée au MDM — obligatoire enterprise (pas de reset sans escrow).",
      "Rotation clé après usage support ; FileVault lié compliance Conditional Access.",
    ],
    enterpriseScenario: [
      "Cas HealthSecure — 400 Mac médicaux, exigence HIPAA : 100 % FileVault, clé escrow obligatoire, accès CA M365 conditionné.",
    ],
    procedure: [
      "Profil FileVault MDM avec Redirect personal recovery key to MDM.",
      "Compliance policy : FileVault ON requis.",
      "Test récupération clé sur Mac pilote + ticket ITSM.",
    ],
    actions: [
      "Activer FileVault en pilote avec escrow vérifié dans console MDM.",
      "Lier compliance CA Entra si stack Microsoft.",
    ],
    validation: ["Clé escrow visible MDM", "Support formé procédure récupération"],
    risks: ["FileVault sans escrow — perte données irrecoverable"],
    tools: ["FileVault", "Intune", "Jamf Pro"],
    officialReferences: ["https://support.apple.com/guide/deployment/filevault-apd7668924/mac"],
  },

  "gatekeeper-notarisation": {
    focus: "Gatekeeper, notarisation Apple et contrôle apps macOS enterprise",
    outcomes: [
      "Expliquer notarisation et stapling pour apps macOS.",
      "Configurer restrictions apps via MDM (allow list, Team ID).",
    ],
    concepts: [
      "Gatekeeper : apps signed + notarized by Apple required (macOS Catalina+).",
      "MDM peut autoriser Team IDs spécifiques pour apps legacy.",
      "XProtect : moteur anti-malware signatures Apple, mises à jour silencieuses.",
      "SIP (System Integrity Protection) protège fichiers système — désactivation rare et auditée.",
      "Activation Lock organisation : lié ABM, récupération via admin ABM si device managed.",
    ],
    enterpriseScenario: [
      "Cas DevOps Inc — apps internes non notarisées : exception Team ID via profil MDM.",
      "Cas RetailCo — Activation Lock activé sur iPhone flotte ; procédure déblocage ABM documentée.",
    ],
    procedure: [
      "Auditer apps Intel/non-notarized avec jamf recon ou Intune inventory.",
      "Profil System Extension + Team ID allow list.",
      "Policy Activation Lock ON pour iOS supervisés ADE.",
    ],
    actions: ["Auditer apps Intel/non-notarized", "Profil System Extension allow list"],
    validation: ["Apps métier lancées sans override utilisateur"],
    risks: ["Autoriser any app — malware risk"],
    tools: ["Gatekeeper", "XProtect", "SIP", "MDM restrictions"],
    officialReferences: ["https://support.apple.com/guide/security/gatekeeper-and-notarization-sec5599b66df/web"],
  },
};
