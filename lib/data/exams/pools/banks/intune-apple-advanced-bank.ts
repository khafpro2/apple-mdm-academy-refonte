import type { Question } from "@/lib/types";
import { buildExamBank, type ExamBankInput } from "./exam-bank-builder";

const inputs: ExamBankInput[] = [
  // ── APNs (10) ──────────────────────────────────────────────────────────────
  {
    id: "iaa-apns01",
    domain: "apns",
    difficulty: "easy",
    text: "Dans Intune, où uploadez-vous le certificat Apple Push Notification (APNs) pour macOS et iOS ?",
    correct: "Appareils > Inscription Apple > Certificats de notification push Apple",
    distractors: [
      "Applications > Apps iOS > Certificats push",
      "Sécurité > Conditional Access > Certificats",
      "Comptes > Identités > Certificats Apple",
    ],
    explanation:
      "Le certificat APNs MDM se configure sous Inscription Apple ; sans lui, Intune ne peut pas pousser de commandes MDM.",
    relatedModuleSlug: "intune-apple-advanced/apns",
  },
  {
    id: "iaa-apns02",
    domain: "apns",
    difficulty: "medium",
    text: "Votre certificat APNs Intune expire dans 7 jours. Quelle est la bonne procédure entreprise ?",
    correct: "Renouveler via le portail Apple Push Certificates, puis remplacer le certificat dans Intune avant expiration",
    distractors: [
      "Réenrôler tous les appareils Apple manuellement",
      "Supprimer le tenant Intune et recréer un certificat",
      "Attendre l'expiration puis laisser Intune en générer un nouveau automatiquement",
    ],
    explanation:
      "Le renouvellement APNs doit conserver le même Topic ID ; un certificat expiré bloque toute communication MDM push.",
    relatedModuleSlug: "intune-apple-advanced/apns",
  },
  {
    id: "iaa-apns03",
    domain: "apns",
    difficulty: "hard",
    text: "Après renouvellement APNs, les Mac restent « En attente de contact » alors que le certificat est valide. Cause la plus probable ?",
    correct: "Le Topic ID du nouveau certificat diffère de l'ancien (nouveau certificat au lieu d'un renouvellement)",
    distractors: [
      "FileVault désactivé sur les postes",
      "Token ABM expiré",
      "Conditional Access trop restrictif",
    ],
    explanation:
      "Un nouveau certificat APNs (nouveau Topic ID) casse le lien push ; il faut renouveler le certificat existant, pas en créer un autre.",
    relatedModuleSlug: "intune-apple-advanced/apns",
  },
  {
    id: "iaa-apns04",
    domain: "apns",
    difficulty: "medium",
    text: "Quel service Apple utilise Intune pour envoyer les commandes MDM (profils, wipe, sync) aux appareils ?",
    correct: "Apple Push Notification service (APNs)",
    distractors: [
      "iCloud Push Mail",
      "Apple Business Manager Sync API",
      "Entra ID Device Registration Service",
    ],
    explanation: "APNs est le canal push obligatoire pour tout MDM Apple, y compris Microsoft Intune.",
    relatedModuleSlug: "intune-apple-advanced/apns",
  },
  {
    id: "iaa-apns05",
    domain: "apns",
    difficulty: "easy",
    text: "Le certificat APNs MDM est-il spécifique à chaque tenant Intune ?",
    correct: "Oui, chaque tenant Intune possède son propre certificat APNs lié à son identifiant MDM",
    distractors: [
      "Non, un certificat global Microsoft suffit pour tous les tenants",
      "Non, Apple fournit un certificat partagé par défaut",
      "Oui, mais uniquement pour iOS, pas pour macOS",
    ],
    explanation:
      "Chaque environnement Intune doit disposer de son certificat APNs ; il n'existe pas de certificat mutualisé inter-tenants.",
    relatedModuleSlug: "intune-apple-advanced/apns",
  },
  {
    id: "iaa-apns06",
    domain: "apns",
    difficulty: "hard",
    text: "Un administrateur a créé un second certificat APNs dans le portail Apple au lieu de renouveler l'existant. Conséquence ?",
    correct: "Les appareils enrôlés avec l'ancien Topic ID ne reçoivent plus les commandes MDM",
    distractors: [
      "Intune bascule automatiquement sur le nouveau certificat",
      "Seuls les iPhone sont impactés, pas les Mac",
      "Les appareils se réenrôlent automatiquement en 24 h",
    ],
    explanation:
      "Changer de Topic ID APNs nécessite un réenrôlement complet ; le renouvellement doit toujours réutiliser le même certificat.",
    relatedModuleSlug: "intune-apple-advanced/apns",
  },
  {
    id: "iaa-apns07",
    domain: "apns",
    difficulty: "medium",
    text: "Quelle Apple ID entreprise est recommandée pour gérer le certificat APNs MDM ?",
    correct: "Un Apple ID dédié au MDM (ex. mdm@entreprise.fr), distinct des comptes personnels",
    distractors: [
      "L'Apple ID personnel du DSI",
      "Un Managed Apple ID utilisateur final",
      "Aucune Apple ID n'est requise depuis 2024",
    ],
    explanation:
      "Apple exige un Apple ID pour le portail Push Certificates ; un compte dédié évite la perte d'accès lors des départs.",
    relatedModuleSlug: "intune-apple-advanced/apns",
  },
  {
    id: "iaa-apns08",
    domain: "apns",
    difficulty: "easy",
    text: "Sans certificat APNs valide dans Intune, que se passe-t-il pour un Mac déjà enrôlé ?",
    correct: "L'appareil reste en inventaire mais Intune ne peut plus lui envoyer de commandes MDM",
    distractors: [
      "L'appareil est automatiquement retiré de l'inventaire",
      "Seule la conformité est impactée, pas les profils",
      "Intune utilise un canal alternatif HTTPS permanent",
    ],
    explanation:
      "L'absence d'APNs valide bloque le push MDM : pas de déploiement profil, pas de sync, pas de wipe à distance.",
    relatedModuleSlug: "intune-apple-advanced/apns",
  },
  {
    id: "iaa-apns09",
    domain: "apns",
    difficulty: "medium",
    text: "Durée de validité typique d'un certificat APNs MDM Apple ?",
    correct: "Environ 1 an, renouvelable avant expiration",
    distractors: ["5 ans non renouvelable", "30 jours", "Illimitée une fois créé"],
    explanation:
      "Les certificats APNs MDM expirent annuellement ; un processus de renouvellement proactif est indispensable.",
    relatedModuleSlug: "intune-apple-advanced/apns",
  },
  {
    id: "iaa-apns10",
    domain: "apns",
    difficulty: "hard",
    text: "Vous migrez d'un ancien MDM vers Intune. Que devez-vous faire côté APNs ?",
    correct: "Créer un nouveau certificat APNs pour Intune et réenrôler tous les appareils Apple",
    distractors: [
      "Transférer l'ancien certificat APNs vers Intune sans réenrôlement",
      "Réutiliser le même Topic ID sans action utilisateur",
      "Désactiver APNs car Intune utilise Graph API",
    ],
    explanation:
      "Chaque solution MDM possède son propre certificat APNs ; une migration implique réenrôlement et nouveau certificat.",
    relatedModuleSlug: "intune-apple-advanced/apns",
  },

  // ── ADE (10) ───────────────────────────────────────────────────────────────
  {
    id: "iaa-ade01",
    domain: "ade",
    difficulty: "easy",
    text: "Automated Device Enrollment (ADE) dans ABM permet principalement :",
    correct: "Un enrôlement automatique supervisé sans assistant Setup Assistant manuel",
    distractors: [
      "L'achat de licences VPP uniquement",
      "La création de comptes locaux macOS",
      "Le déploiement de profils Wi-Fi sans MDM",
    ],
    explanation:
      "ADE assigne les appareils à Intune dès la première activation, en mode supervisé, avec profils MDM pré-configurés.",
    relatedModuleSlug: "intune-apple-advanced/ade",
  },
  {
    id: "iaa-ade02",
    domain: "ade",
    difficulty: "medium",
    text: "Un Mac ne se présente pas dans Intune après activation usine alors qu'il est dans ABM. Première vérification ?",
    correct: "L'appareil est assigné au bon serveur MDM (Intune) dans Apple Business Manager",
    distractors: [
      "Le certificat SCEP utilisateur",
      "La licence Microsoft 365 de l'utilisateur",
      "Le profil VPN Always On",
    ],
    explanation:
      "Sans assignation MDM correcte dans ABM, l'appareil n'appelle pas Intune au Setup Assistant.",
    relatedModuleSlug: "intune-apple-advanced/ade",
  },
  {
    id: "iaa-ade03",
    domain: "ade",
    difficulty: "hard",
    text: "Find My iCloud personnel activé avant la sortie d'un iPhone du parc. Impact sur ADE entreprise ?",
    correct: "Activation Lock persiste et peut bloquer la réassignation sans procédure de bypass ABM",
    distractors: [
      "ADE ignore Find My et efface automatiquement le verrou",
      "Seul FileVault est impacté",
      "Intune supprime Activation Lock via APNs",
    ],
    explanation:
      "Find My personnel crée un Activation Lock indépendant du MDM ; ABM bypass ne s'applique qu'aux appareils org correctement gérés.",
    relatedModuleSlug: "intune-apple-advanced/ade",
  },
  {
    id: "iaa-ade04",
    domain: "ade",
    difficulty: "medium",
    text: "Le mode supervisé obtenu via ADE est requis pour :",
    correct: "Activation Lock bypass, restrictions avancées et certaines payloads MDM (ex. content filter)",
    distractors: [
      "Uniquement le déploiement d'apps VPP",
      "Remplacer le certificat APNs",
      "Désactiver Gatekeeper sur macOS",
    ],
    explanation:
      "La supervision ADE débloque des capacités MDM impossibles en enrôlement utilisateur standard.",
    relatedModuleSlug: "intune-apple-advanced/ade",
  },
  {
    id: "iaa-ade05",
    domain: "ade",
    difficulty: "easy",
    text: "Où configure-t-on le profil d'inscription ADE (enrollment profile) pour macOS dans Intune ?",
    correct: "Appareils > macOS > Inscription macOS > Profils d'inscription",
    distractors: [
      "Applications > macOS > Apps",
      "Sécurité > Conditional Access",
      "Apple Business Manager > Apps & Books",
    ],
    explanation:
      "Le profil ADE Intune définit l'expérience Setup Assistant, les profils de base et les paramètres de supervision.",
    relatedModuleSlug: "intune-apple-advanced/ade",
  },
  {
    id: "iaa-ade06",
    domain: "ade",
    difficulty: "medium",
    text: "Un Mac ADE affiche « Remote Management » au Setup Assistant. Cela signifie :",
    correct: "L'appareil est supervisé et sera géré par le MDM assigné dans ABM (Intune)",
    distractors: [
      "L'utilisateur peut refuser la gestion sans impact",
      "Seul un profil Wi-Fi sera installé",
      "Le Mac est en mode BYOD user enrollment",
    ],
    explanation:
      "Remote Management confirme la supervision ADE ; l'utilisateur doit accepter pour finaliser l'enrôlement MDM.",
    relatedModuleSlug: "intune-apple-advanced/ade",
  },
  {
    id: "iaa-ade07",
    domain: "ade",
    difficulty: "hard",
    text: "Vous changez l'assignation MDM d'un lot de Mac de Jamf vers Intune dans ABM. Action requise ?",
    correct: "Effacer et réactiver les appareils (ou réenrôler) pour qu'ils contactent Intune",
    distractors: [
      "Attendre la sync ABM nocturne sans action",
      "Renouveler uniquement le certificat APNs",
      "Modifier le profil Wi-Fi Intune",
    ],
    explanation:
      "Changer le serveur MDM dans ABM n'affecte pas les appareils déjà activés ; un wipe/réactivation est nécessaire.",
    relatedModuleSlug: "intune-apple-advanced/ade",
  },
  {
    id: "iaa-ade08",
    domain: "ade",
    difficulty: "medium",
    text: "Bootstrap Token sur Mac ADE sert principalement à :",
    correct: "Permettre l'escrow FileVault et l'installation silencieuse de profils pour les comptes admin créés après setup",
    distractors: [
      "Authentifier Platform SSO Entra",
      "Renouveler le token ABM automatiquement",
      "Assigner les licences VPP",
    ],
    explanation:
      "Le Bootstrap Token est généré au premier compte admin ADE et permet à Intune d'agir sur FileVault et profils sans interaction.",
    relatedModuleSlug: "intune-apple-advanced/ade",
  },
  {
    id: "iaa-ade09",
    domain: "ade",
    difficulty: "easy",
    text: "ADE remplace historiquement quel programme Apple ?",
    correct: "DEP (Device Enrollment Program)",
    distractors: ["VPP (Volume Purchase Program)", "Apple Configurator only", "Apple School Manager uniquement"],
    explanation: "Automated Device Enrollment est l'évolution unifiée de DEP dans Apple Business/School Manager.",
    relatedModuleSlug: "intune-apple-advanced/ade",
  },
  {
    id: "iaa-ade10",
    domain: "ade",
    difficulty: "hard",
    text: "Un iPhone ADE enrôlé via Intune doit être effacé avant revente interne. Méthode recommandée ?",
    correct: "Remote wipe supervisé via Intune, puis vérifier qu'Activation Lock org est levé via ABM",
    distractors: [
      "Effacement manuel utilisateur sans MDM",
      "Retirer l'appareil d'ABM sans wipe",
      "Désinstaller Company Portal uniquement",
    ],
    explanation:
      "Le wipe MDM supervisé garantit la remise à zéro sécurisée ; ABM confirme la levée du verrou organisationnel.",
    relatedModuleSlug: "intune-apple-advanced/ade",
  },

  // ── Enrollment tokens (8) ──────────────────────────────────────────────────
  {
    id: "iaa-enrollment-tokens01",
    domain: "enrollment-tokens",
    difficulty: "easy",
    text: "Le token de serveur d'inscription ABM (enrollment program token) dans Intune sert à :",
    correct: "Synchroniser l'inventaire ABM et recevoir les assignations d'appareils ADE",
    distractors: [
      "Pousser les notifications APNs",
      "Signer les apps VPP",
      "Authentifier les utilisateurs Entra ID",
    ],
    explanation:
      "Le token ABM uploadé dans Intune établit la liaison ABM↔Intune pour ADE et la sync inventaire.",
    relatedModuleSlug: "intune-apple-advanced/enrollment-tokens",
  },
  {
    id: "iaa-enrollment-tokens02",
    domain: "enrollment-tokens",
    difficulty: "medium",
    text: "Le token ABM affiche « Expiré » dans Intune. Conséquence immédiate ?",
    correct: "La synchronisation ABM et les nouveaux enrôlements ADE sont interrompus",
    distractors: [
      "Les appareils déjà enrôlés perdent APNs",
      "Conditional Access est désactivé",
      "Les profils Wi-Fi sont supprimés",
    ],
    explanation:
      "Un token ABM expiré bloque la sync et les nouveaux ADE ; les appareils déjà enrôlés restent gérés mais l'inventaire stagne.",
    relatedModuleSlug: "intune-apple-advanced/enrollment-tokens",
  },
  {
    id: "iaa-enrollment-tokens03",
    domain: "enrollment-tokens",
    difficulty: "hard",
    text: "Renouvellement du token ABM : quelle bonne pratique entreprise ?",
    correct: "Renouveler dans ABM avec le même compte, re-télécharger le .p7m et le remplacer dans Intune avant expiration",
    distractors: [
      "Créer un nouveau tenant ABM à chaque renouvellement",
      "Attendre l'expiration puis réimporter tous les serials manuellement",
      "Renouveler uniquement le certificat APNs, pas le token ABM",
    ],
    explanation:
      "Le token ABM expire tous les ans ; un renouvellement proactif évite la rupture de sync ADE.",
    relatedModuleSlug: "intune-apple-advanced/enrollment-tokens",
  },
  {
    id: "iaa-enrollment-tokens04",
    domain: "enrollment-tokens",
    difficulty: "medium",
    text: "Où téléchargez-vous le fichier token (.p7m) à importer dans Intune ?",
    correct: "Apple Business Manager > Paramètres > Gestion des appareils > Serveur MDM > Télécharger le token",
    distractors: [
      "Portail Azure > Intune > Certificats",
      "Apple Push Certificates Portal",
      "App Store Connect > Users and Access",
    ],
    explanation:
      "Le token de serveur MDM est généré dans ABM après liaison avec Intune et uploadé côté console Intune.",
    relatedModuleSlug: "intune-apple-advanced/enrollment-tokens",
  },
  {
    id: "iaa-enrollment-tokens05",
    domain: "enrollment-tokens",
    difficulty: "easy",
    text: "Fréquence de renouvellement recommandée du token ABM dans Intune ?",
    correct: "Avant expiration annuelle, idéalement avec alerte à J-30",
    distractors: ["Tous les 5 ans", "Jamais une fois importé", "Chaque semaine"],
    explanation: "Le token ABM a une durée de vie limitée (typiquement 1 an) et doit être renouvelé régulièrement.",
    relatedModuleSlug: "intune-apple-advanced/enrollment-tokens",
  },
  {
    id: "iaa-enrollment-tokens06",
    domain: "enrollment-tokens",
    difficulty: "medium",
    text: "Un nouveau lot de Mac est visible dans ABM mais pas dans Intune après 24 h. Cause probable ?",
    correct: "Sync ABM non déclenchée ou token ABM invalide/expiré",
    distractors: [
      "Certificat SCEP expiré",
      "Profil Platform SSO manquant",
      "Licence Defender insuffisante",
    ],
    explanation:
      "L'inventaire ABM remonte dans Intune via le token ; un token invalide ou une sync manquée retarde l'apparition.",
    relatedModuleSlug: "intune-apple-advanced/enrollment-tokens",
  },
  {
    id: "iaa-enrollment-tokens07",
    domain: "enrollment-tokens",
    difficulty: "hard",
    text: "Vous gérez ABM et ASM (Apple School Manager) séparément. Configuration Intune ?",
    correct: "Importer un token ABM et un token ASM distincts si les deux organisations existent",
    distractors: [
      "Un seul token couvre ABM et ASM automatiquement",
      "ASM ne supporte pas Intune",
      "Seul APNs est requis, pas de token ABM pour ASM",
    ],
    explanation:
      "Chaque portail Apple (ABM/ASM) génère son propre token MDM à associer à Intune.",
    relatedModuleSlug: "intune-apple-advanced/enrollment-tokens",
  },
  {
    id: "iaa-enrollment-tokens08",
    domain: "enrollment-tokens",
    difficulty: "medium",
    text: "Après import du token ABM, quelle action déclenche la première sync inventaire dans Intune ?",
    correct: "Synchroniser maintenant depuis Appareils > Inscription Apple > Tokens de programme d'inscription",
    distractors: [
      "Redémarrer tous les Mac du parc",
      "Renouveler le certificat APNs",
      "Créer une compliance policy",
    ],
    explanation:
      "Intune propose une sync manuelle du token ABM ; la sync automatique peut prendre plusieurs heures sans action.",
    relatedModuleSlug: "intune-apple-advanced/enrollment-tokens",
  },

  // ── Configuration profiles (12) ────────────────────────────────────────────
  {
    id: "iaa-configuration-profiles01",
    domain: "configuration-profiles",
    difficulty: "easy",
    text: "Un profil Wi-Fi 802.1X EAP-TLS pour Mac dans Intune nécessite typiquement :",
    correct: "Un profil certificat SCEP ou PKCS associé pour l'authentification client",
    distractors: [
      "Uniquement le SSID en clair",
      "Un Apple ID personnel",
      "Un token ABM renouvelé",
    ],
    explanation: "EAP-TLS exige un certificat client déployé via SCEP/PKCS avant le profil Wi-Fi.",
    relatedModuleSlug: "intune-apple-advanced/configuration-profiles",
  },
  {
    id: "iaa-configuration-profiles02",
    domain: "configuration-profiles",
    difficulty: "medium",
    text: "Profil PPPC (Privacy Preferences Policy Control) sur macOS sert à :",
    correct: "Pré-approuver les autorisations TCC (FDA, caméra, micro) pour les apps gérées",
    distractors: [
      "Configurer le Wi-Fi entreprise",
      "Renouveler le certificat APNs",
      "Forcer Platform SSO Entra",
    ],
    explanation:
      "PPPC évite les prompts utilisateur pour apps comme Defender ou agents de backup en déployant des autorisations TCC.",
    relatedModuleSlug: "intune-apple-advanced/configuration-profiles",
  },
  {
    id: "iaa-configuration-profiles03",
    domain: "configuration-profiles",
    difficulty: "hard",
    text: "Un profil FileVault Intune ne déclenche pas le chiffrement sur Mac ADE. Cause fréquente ?",
    correct: "Bootstrap Token absent ou compte admin sans Secure Token pour escrow",
    distractors: [
      "Certificat APNs expiré",
      "Token ABM manquant",
      "Conditional Access bloquant FileVault",
    ],
    explanation:
      "FileVault via MDM sur Mac ADE requiert Bootstrap Token et un flux d'escrow clé compatible.",
    relatedModuleSlug: "intune-apple-advanced/configuration-profiles",
  },
  {
    id: "iaa-configuration-profiles04",
    domain: "configuration-profiles",
    difficulty: "medium",
    text: "Profil VPN Always On macOS Intune : comportement attendu ?",
    correct: "Tunnel VPN permanent avec règles de trafic (full tunnel ou split tunnel selon config)",
    distractors: [
      "VPN optionnel déclenché manuellement uniquement",
      "Remplace Conditional Access",
      "Désactive APNs pour économiser la batterie",
    ],
    explanation:
      "Les profils VPN Always On Intune maintiennent la connectivité entreprise selon les règles définies.",
    relatedModuleSlug: "intune-apple-advanced/configuration-profiles",
  },
  {
    id: "iaa-configuration-profiles05",
    domain: "configuration-profiles",
    difficulty: "easy",
    text: "Restrictions macOS via profil Intune peuvent empêcher :",
    correct: "La modification des paramètres système sensibles (ex. désactiver pare-feu, iCloud Drive)",
    distractors: [
      "Le démarrage du Mac",
      "La connexion Wi-Fi domestique uniquement",
      "L'utilisation d'un clavier externe",
    ],
    explanation:
      "Les payloads Restrictions macOS verrouillent des fonctionnalités système selon la politique entreprise.",
    relatedModuleSlug: "intune-apple-advanced/configuration-profiles",
  },
  {
    id: "iaa-configuration-profiles06",
    domain: "configuration-profiles",
    difficulty: "medium",
    text: "Profil SCEP Intune pour certificat client : composant clé côté PKI ?",
    correct: "URL du serveur SCEP, thumbprint CA et nom du sujet (Subject) configurés",
    distractors: [
      "Serial number ABM de l'appareil",
      "Apple ID de l'utilisateur",
      "Topic ID APNs",
    ],
    explanation:
      "Le profil SCEP automatise l'émission de certificats via la CA entreprise pour Wi-Fi, VPN ou auth.",
    relatedModuleSlug: "intune-apple-advanced/configuration-profiles",
  },
  {
    id: "iaa-configuration-profiles07",
    domain: "configuration-profiles",
    difficulty: "hard",
    text: "Conflit entre deux profils Wi-Fi Intune assignés au même Mac. Comportement Intune ?",
    correct: "Le profil le plus récent ou la priorité d'assignation détermine le profil actif ; conflits à éviter par ciblage",
    distractors: [
      "Intune fusionne automatiquement les SSID",
      "Le Mac refuse tout Wi-Fi",
      "Seul le profil le plus ancien s'applique toujours",
    ],
    explanation:
      "Les profils dupliqués créent des conflits ; le ciblage par groupes dynamiques évite les chevauchements.",
    relatedModuleSlug: "intune-apple-advanced/configuration-profiles",
  },
  {
    id: "iaa-configuration-profiles08",
    domain: "configuration-profiles",
    difficulty: "medium",
    text: "Profil Edge/macOS ou restrictions Safari via Intune servent à :",
    correct: "Imposer proxy, homepage, extensions autorisées ou mode managed browser",
    distractors: [
      "Remplacer Conditional Access",
      "Configurer APNs",
      "Gérer les licences VPP",
    ],
    explanation:
      "Les profils navigateur macOS standardisent l'expérience web entreprise et les contrôles de sécurité.",
    relatedModuleSlug: "intune-apple-advanced/configuration-profiles",
  },
  {
    id: "iaa-configuration-profiles09",
    domain: "configuration-profiles",
    difficulty: "easy",
    text: "Où créez-vous un profil de configuration macOS dans Intune ?",
    correct: "Appareils > macOS > Profils de configuration > Créer un profil",
    distractors: [
      "Applications > Apps macOS",
      "Rapports > Analyses",
      "Apple Business Manager > Devices",
    ],
    explanation:
      "Les profils macOS (Wi-Fi, VPN, restrictions, certs) se créent sous Profils de configuration macOS.",
    relatedModuleSlug: "intune-apple-advanced/configuration-profiles",
  },
  {
    id: "iaa-configuration-profiles10",
    domain: "configuration-profiles",
    difficulty: "hard",
    text: "System Extension vs Kernel Extension sur macOS géré Intune : bonne pratique 2025 ?",
    correct: "Privilégier System Extensions avec profils System Extension Policy MDM",
    distractors: [
      "Continuer à déployer des kexts non signés",
      "Désactiver SIP pour installer les extensions",
      "Utiliser Apple Configurator sur chaque poste",
    ],
    explanation:
      "Apple déprécie les kexts ; les System Extensions se gèrent via payloads MDM dédiés.",
    relatedModuleSlug: "intune-apple-advanced/configuration-profiles",
  },
  {
    id: "iaa-configuration-profiles11",
    domain: "configuration-profiles",
    difficulty: "medium",
    text: "Profil iOS restrictions supervisé via Intune peut bloquer :",
    correct: "App Store, AirDrop, effacement contenu et réglages, selon la politique",
    distractors: [
      "Uniquement le mode sombre",
      "La langue du clavier sans supervision",
      "Le certificat APNs",
    ],
    explanation:
      "En supervision ADE, les restrictions iOS offrent un contrôle granulaire des fonctionnalités.",
    relatedModuleSlug: "intune-apple-advanced/configuration-profiles",
  },
  {
    id: "iaa-configuration-profiles12",
    domain: "configuration-profiles",
    difficulty: "medium",
    text: "Custom settings (OMA-URI) profil macOS Intune s'utilise quand :",
    correct: "Une clé plist macOS n'a pas encore de template Intune natif",
    distractors: [
      "Pour renouveler le token ABM",
      "Pour créer des comptes Entra locaux",
      "Pour remplacer APNs par Graph API",
    ],
    explanation:
      "Les OMA-URI permettent de pousser des clés com.apple.* non couvertes par l'UI Intune standard.",
    relatedModuleSlug: "intune-apple-advanced/configuration-profiles",
  },

  // ── Compliance (12) ────────────────────────────────────────────────────────
  {
    id: "iaa-compliance01",
    domain: "compliance",
    difficulty: "easy",
    text: "Une compliance policy Intune macOS peut vérifier :",
    correct: "Version OS minimale, FileVault activé, System Integrity Protection (SIP)",
    distractors: [
      "La couleur du MacBook",
      "Le nom du compte iCloud personnel",
      "Le modèle de clavier uniquement",
    ],
    explanation:
      "Les policies de conformité macOS contrôlent l'état sécurité : OS, chiffrement, SIP, jailbreak, etc.",
    relatedModuleSlug: "intune-apple-advanced/compliance",
  },
  {
    id: "iaa-compliance02",
    domain: "compliance",
    difficulty: "medium",
    text: "Mac compliant hier, non compliant aujourd'hui après update macOS automatique. Cause typique ?",
    correct: "La version OS dépasse ou ne respecte plus la plage min/max définie dans la policy",
    distractors: [
      "APNs expiré",
      "Token ABM révoqué",
      "Company Portal désinstallé sur macOS ADE",
    ],
    explanation:
      "Une mise à jour OS peut faire sortir l'appareil de la plage autorisée jusqu'à ajuster la policy ou la version cible.",
    relatedModuleSlug: "intune-apple-advanced/compliance",
  },
  {
    id: "iaa-compliance03",
    domain: "compliance",
    difficulty: "hard",
    text: "FileVault ON mais appareil non compliant « chiffrement requis ». Diagnostic ?",
    correct: "Escrow de la clé FileVault non confirmée ou délai de reporting Intune",
    distractors: [
      "Gatekeeper désactivé",
      "Serial ABM non synchronisé",
      "Defender non installé",
    ],
    explanation:
      "Certaines policies exigent FileVault actif ET clé escrowed vers Intune ; l'escrow peut prendre un cycle de check-in.",
    relatedModuleSlug: "intune-apple-advanced/compliance",
  },
  {
    id: "iaa-compliance04",
    domain: "compliance",
    difficulty: "medium",
    text: "Action « Marquer comme non conforme » avec délai de grâce 24 h sert à :",
    correct: "Laisser le temps à l'utilisateur de corriger avant blocage CA ou actions",
    distractors: [
      "Supprimer l'appareil d'ABM",
      "Renouveler APNs automatiquement",
      "Désactiver FileVault",
    ],
    explanation:
      "Le grace period évite les blocages immédiats lors de changements de policy ou délais de sync.",
    relatedModuleSlug: "intune-apple-advanced/compliance",
  },
  {
    id: "iaa-compliance05",
    domain: "compliance",
    difficulty: "easy",
    text: "Compliance policy iOS Intune peut détecter :",
    correct: "Jailbreak/root, version OS minimale, absence de code PIN",
    distractors: [
      "Le wallpaper choisi par l'utilisateur",
      "La marque de la coque",
      "Le niveau de batterie uniquement",
    ],
    explanation:
      "Les contrôles iOS incluent intégrité appareil, PIN/passcode et version système.",
    relatedModuleSlug: "intune-apple-advanced/compliance",
  },
  {
    id: "iaa-compliance06",
    domain: "compliance",
    difficulty: "medium",
    text: "Microsoft Defender for Endpoint « healthy » peut être exigé dans compliance macOS via :",
    correct: "Condition de conformité liée à l'état antivirus / threat protection",
    distractors: [
      "Profil Wi-Fi uniquement",
      "Token enrollment ABM",
      "Platform SSO registration",
    ],
    explanation:
      "Intune peut intégrer l'état Defender dans la compliance macOS pour les parcs protégés MDE.",
    relatedModuleSlug: "intune-apple-advanced/compliance",
  },
  {
    id: "iaa-compliance07",
    domain: "compliance",
    difficulty: "hard",
    text: "Plusieurs compliance policies assignées à un même Mac. Résultat ?",
    correct: "Toutes doivent être satisfaites ; la plus restrictive l'emporte (AND logique)",
    distractors: [
      "Seule la première créée s'applique",
      "Intune choisit aléatoirement une policy",
      "Les policies s'annulent mutuellement",
    ],
    explanation:
      "Intune évalue toutes les policies assignées ; un seul critère non satisfait rend l'appareil non compliant.",
    relatedModuleSlug: "intune-apple-advanced/compliance",
  },
  {
    id: "iaa-compliance08",
    domain: "compliance",
    difficulty: "medium",
    text: "Fréquence de check-in compliance typique sur Mac géré Intune ?",
    correct: "Environ 8 h par défaut, accélérée lors d'événements ou sync manuelle",
    distractors: ["Temps réel chaque seconde", "Une fois par an", "Uniquement au login Entra"],
    explanation:
      "Le check-in MDM périodique remonte l'état compliance ; les événements peuvent déclencher un sync plus rapide.",
    relatedModuleSlug: "intune-apple-advanced/compliance",
  },
  {
    id: "iaa-compliance09",
    domain: "compliance",
    difficulty: "easy",
    text: "Où consultez-vous le rapport de conformité d'un Mac dans Intune ?",
    correct: "Appareils > Tous les appareils > [Mac] > Conformité",
    distractors: [
      "Apple Business Manager > Devices",
      "Entra ID > Users > Devices (sans lien Intune)",
      "Microsoft 365 admin center > Billing",
    ],
    explanation:
      "La blade Conformité de l'appareil détaille chaque policy et le statut pass/fail.",
    relatedModuleSlug: "intune-apple-advanced/compliance",
  },
  {
    id: "iaa-compliance10",
    domain: "compliance",
    difficulty: "hard",
    text: "Managed Device Attestation (MDA) iOS dans compliance Entra exige typiquement :",
    correct: "Appareil supervisé ADE, OS minimum supporté et policy attestation activée",
    distractors: [
      "BYOD user enrollment sans supervision",
      "Apple ID personnel",
      "macOS Monterey uniquement",
    ],
    explanation:
      "MDA vérifie l'intégrité matérielle/logicielle ; requis pour les scénarios Zero Trust avancés.",
    relatedModuleSlug: "intune-apple-advanced/compliance",
  },
  {
    id: "iaa-compliance11",
    domain: "compliance",
    difficulty: "medium",
    text: "Action automatique « Envoyer email push » sur non-conformité sert à :",
    correct: "Notifier l'utilisateur qu'il doit corriger l'état de son appareil",
    distractors: [
      "Supprimer l'appareil d'Entra ID",
      "Renouveler le certificat SCEP",
      "Réinitialiser le mot de passe Entra",
    ],
    explanation:
      "Les actions de non-conformité incluent notification, blocage CA et effacement selon la sévérité.",
    relatedModuleSlug: "intune-apple-advanced/compliance",
  },
  {
    id: "iaa-compliance12",
    domain: "compliance",
    difficulty: "medium",
    text: "SIP (System Integrity Protection) OFF sur Mac — impact compliance entreprise ?",
    correct: "Non compliant si la policy exige SIP activé (recommandé sécurité Apple)",
    distractors: [
      "Aucun impact, SIP est optionnel pour MDM",
      "Seul iOS est concerné",
      "Intune réactive SIP automatiquement",
    ],
    explanation:
      "SIP protège l'intégrité système ; de nombreuses policies macOS enterprise l'exigent activé.",
    relatedModuleSlug: "intune-apple-advanced/compliance",
  },

  // ── Conditional Access (12) ────────────────────────────────────────────────
  {
    id: "iaa-conditional-access01",
    domain: "conditional-access",
    difficulty: "easy",
    text: "Conditional Access avec Intune pour Mac exige typiquement :",
    correct: "Exiger un appareil marqué compliant Intune pour accéder aux apps M365",
    distractors: [
      "Un Apple ID personnel vérifié",
      "Un certificat APNs par utilisateur",
      "Désactiver MFA Entra",
    ],
    explanation:
      "CA Entra peut bloquer l'accès si l'appareil n'est pas compliant aux policies Intune.",
    relatedModuleSlug: "intune-apple-advanced/conditional-access",
  },
  {
    id: "iaa-conditional-access02",
    domain: "conditional-access",
    difficulty: "medium",
    text: "Policy CA « Exiger appareil compliant » — un Mac ADE sans check-in Intune depuis 48 h :",
    correct: "Peut être bloqué car Intune ne peut pas confirmer la conformité",
    distractors: [
      "Reste toujours autorisé car ADE",
      "CA ignore les appareils Apple",
      "Entra accorde un bypass permanent",
    ],
    explanation:
      "CA s'appuie sur le signal Intune compliance ; un appareil hors sync peut perdre le statut compliant.",
    relatedModuleSlug: "intune-apple-advanced/conditional-access",
  },
  {
    id: "iaa-conditional-access03",
    domain: "conditional-access",
    difficulty: "hard",
    text: "Mac compliant Intune mais CA bloque encore l'accès Exchange Online. Vérification ?",
    correct: "Délai de propagation Entra, assignation CA correcte et licence Intune active",
    distractors: [
      "Renouveler le token ABM",
      "Réinstaller Safari",
      "Changer le serial number ABM",
    ],
    explanation:
      "CA dépend du signal compliance remonté à Entra ; propagation, scope et licensing sont des causes fréquentes.",
    relatedModuleSlug: "intune-apple-advanced/conditional-access",
  },
  {
    id: "iaa-conditional-access04",
    domain: "conditional-access",
    difficulty: "medium",
    text: "CA + Platform SSO sur macOS : avantage principal ?",
    correct: "Accès transparent aux apps M365 avec identité Entra sans re-auth constante",
    distractors: [
      "Remplace le certificat APNs",
      "Supprime le besoin de compliance",
      "Permet le jailbreak supervisé",
    ],
    explanation:
      "Platform SSO alimente le token Entra utilisé par CA pour évaluer device state et user identity.",
    relatedModuleSlug: "intune-apple-advanced/conditional-access",
  },
  {
    id: "iaa-conditional-access05",
    domain: "conditional-access",
    difficulty: "easy",
    text: "Où configure-t-on une policy Conditional Access utilisant la conformité Intune ?",
    correct: "Microsoft Entra admin center > Protection > Conditional Access",
    distractors: [
      "Intune > Appareils > Profils",
      "Apple Business Manager > Settings",
      "Defender portal > Policies",
    ],
    explanation:
      "Les policies CA se créent dans Entra ID ; Intune fournit le signal « device compliant ».",
    relatedModuleSlug: "intune-apple-advanced/conditional-access",
  },
  {
    id: "iaa-conditional-access06",
    domain: "conditional-access",
    difficulty: "medium",
    text: "Grant control « Approuver l'application client » pour Mac géré sert à :",
    correct: "Autoriser uniquement apps conformes (ex. Outlook managed) sur appareil compliant",
    distractors: [
      "Installer apps VPP automatiquement",
      "Renouveler SCEP",
      "Bypass MFA pour tous",
    ],
    explanation:
      "App protection + CA peuvent exiger une app broker (Company Portal / Edge managed) sur macOS/iOS.",
    relatedModuleSlug: "intune-apple-advanced/conditional-access",
  },
  {
    id: "iaa-conditional-access07",
    domain: "conditional-access",
    difficulty: "hard",
    text: "Scénario BYOD Mac user enrollment + CA « compliant device required » :",
    correct: "User enrollment fournit un état compliance limité ; certaines exigences CA peuvent échouer",
    distractors: [
      "BYOD est toujours fully compliant comme ADE",
      "CA ne s'applique pas au BYOD",
      "ADE est requis pour tout accès M365",
    ],
    explanation:
      "User enrollment BYOD n'offre pas la même visibilité qu'ADE ; les policies CA doivent être adaptées.",
    relatedModuleSlug: "intune-apple-advanced/conditional-access",
  },
  {
    id: "iaa-conditional-access08",
    domain: "conditional-access",
    difficulty: "medium",
    text: "Sign-in logs Entra montrent « Failure reason: Device not compliant ». Action IT ?",
    correct: "Vérifier compliance Intune de l'appareil et policies CA assignées au user/groupe",
    distractors: [
      "Renouveler APNs immédiatement",
      "Supprimer le Mac d'ABM",
      "Désactiver FileVault",
    ],
    explanation:
      "Le log Entra indique un blocage CA lié au signal compliance Intune ; diagnostiquer côté Intune d'abord.",
    relatedModuleSlug: "intune-apple-advanced/conditional-access",
  },
  {
    id: "iaa-conditional-access09",
    domain: "conditional-access",
    difficulty: "easy",
    text: "CA policy en mode « Report-only » permet :",
    correct: "Simuler l'impact sans bloquer les utilisateurs",
    distractors: [
      "Appliquer le wipe immédiat",
      "Renouveler les tokens ABM",
      "Désactiver Intune",
    ],
    explanation:
      "Report-only est essentiel pour tester CA sur parc Mac avant activation enforce.",
    relatedModuleSlug: "intune-apple-advanced/conditional-access",
  },
  {
    id: "iaa-conditional-access10",
    domain: "conditional-access",
    difficulty: "hard",
    text: "Exiger « Hybrid Azure AD joined » pour Mac ADE-only cloud :",
    correct: "Inadapté — les Mac ADE Intune sont Azure AD joined / registered, pas hybrid join classique",
    distractors: [
      "Requis pour tous les Mac Apple Silicon",
      "Remplace Platform SSO",
      "Automatique via token ABM",
    ],
    explanation:
      "Les Mac cloud-only rejoignent Entra via ADE/Company Portal ; hybrid join nécessite AD on-prem différent.",
    relatedModuleSlug: "intune-apple-advanced/conditional-access",
  },
  {
    id: "iaa-conditional-access11",
    domain: "conditional-access",
    difficulty: "medium",
    text: "CA + MFA + compliant device pour accès SharePoint depuis Mac : ordre d'évaluation ?",
    correct: "Entra évalue toutes les policies assignées ; toutes les conditions grant doivent être satisfaites",
    distractors: [
      "MFA uniquement si compliant échoue",
      "Compliance ignorée si MFA réussit",
      "Intune évalue CA avant Entra",
    ],
    explanation:
      "Entra agrège les policies CA ; device compliance et MFA sont des contrôles cumulatifs selon config.",
    relatedModuleSlug: "intune-apple-advanced/conditional-access",
  },
  {
    id: "iaa-conditional-access12",
    domain: "conditional-access",
    difficulty: "medium",
    text: "Filtrer CA sur « Cloud apps » Exchange + SharePoint pour Mac géré : objectif ?",
    correct: "Limiter l'exigence de conformité aux workloads sensibles, pas à toute authentification",
    distractors: [
      "Désactiver APNs pour ces apps",
      "Bypass compliance pour Outlook",
      "Empêcher Platform SSO",
    ],
    explanation:
      "Le ciblage par cloud app permet une montée en charge progressive de CA sur le parc Apple.",
    relatedModuleSlug: "intune-apple-advanced/conditional-access",
  },

  // ── Platform SSO (10) ──────────────────────────────────────────────────────
  {
    id: "iaa-platform-sso01",
    domain: "platform-sso",
    difficulty: "easy",
    text: "Platform SSO sur macOS avec Entra ID utilise :",
    correct: "Microsoft Enterprise SSO plug-in (extensible SSO extension)",
    distractors: [
      "Kerberos on-prem uniquement",
      "Apple ID fédéré iCloud",
      "Certificat APNs utilisateur",
    ],
    explanation:
      "Platform SSO macOS s'appuie sur l'extension SSO Microsoft installée via MDM pour l'identité Entra.",
    relatedModuleSlug: "intune-apple-advanced/platform-sso",
  },
  {
    id: "iaa-platform-sso02",
    domain: "platform-sso",
    difficulty: "medium",
    text: "Prérequis Platform SSO macOS Intune typiques ?",
    correct: "Mac ADE supervisé, Company Portal, profil SSO MDM et enregistrement Entra",
    distractors: [
      "Apple ID personnel et jailbreak",
      "Token ABM uniquement sans MDM",
      "Gatekeeper désactivé",
    ],
    explanation:
      "Platform SSO requiert la stack MDM + CP + profil extensible SSO sur macOS Ventura+ / Sonoma+.",
    relatedModuleSlug: "intune-apple-advanced/platform-sso",
  },
  {
    id: "iaa-platform-sso03",
    domain: "platform-sso",
    difficulty: "hard",
    text: "Platform SSO échoue après changement mot de passe Entra. Cause fréquente ?",
    correct: "Token SSO cache expiré — reconnexion Company Portal ou logout/login session macOS",
    distractors: [
      "APNs expiré",
      "Serial ABM changé",
      "FileVault désactivé",
    ],
    explanation:
      "Les tokens Platform SSO doivent être rafraîchis après certains événements identité Entra.",
    relatedModuleSlug: "intune-apple-advanced/platform-sso",
  },
  {
    id: "iaa-platform-sso04",
    domain: "platform-sso",
    difficulty: "medium",
    text: "Profil Extensible SSO (Kerberos SSO extension) diffère de Platform SSO car :",
    correct: "Kerberos SSO cible l'auth Kerberos/AD ; Platform SSO cible les apps OAuth/OIDC Entra modernes",
    distractors: [
      "Ce sont des synonymes identiques",
      "Platform SSO ne fonctionne que sur iOS",
      "Kerberos SSO remplace APNs",
    ],
    explanation:
      "Deux extensions distinctes : Kerberos pour domaine AD, Platform SSO pour identité cloud Entra.",
    relatedModuleSlug: "intune-apple-advanced/platform-sso",
  },
  {
    id: "iaa-platform-sso05",
    domain: "platform-sso",
    difficulty: "easy",
    text: "Avantage Platform SSO pour utilisateur Mac entreprise ?",
    correct: "Connexion transparente aux apps Microsoft sans saisie répétée des identifiants",
    distractors: [
      "Suppression de Conditional Access",
      "Chiffrement iCloud automatique",
      "Bypass Activation Lock",
    ],
    explanation:
      "Platform SSO améliore l'UX tout en maintenant l'identité Entra pour CA et audit.",
    relatedModuleSlug: "intune-apple-advanced/platform-sso",
  },
  {
    id: "iaa-platform-sso06",
    domain: "platform-sso",
    difficulty: "medium",
    text: "Déploiement Platform SSO via Intune : quel type de profil macOS ?",
    correct: "Profil de configuration avec payload Extensible SSO / Platform SSO Microsoft",
    distractors: [
      "Compliance policy uniquement",
      "App protection iOS",
      "Token enrollment ABM",
    ],
    explanation:
      "Le profil MDM installe l'extension SSO et les clés de configuration Team ID Microsoft.",
    relatedModuleSlug: "intune-apple-advanced/platform-sso",
  },
  {
    id: "iaa-platform-sso07",
    domain: "platform-sso",
    difficulty: "hard",
    text: "Platform SSO + Secure Enclave sur Apple Silicon : bénéfice sécurité ?",
    correct: "Stockage protégé des clés et tokens SSO dans l'enclave matérielle",
    distractors: [
      "Stocke les profils MDM en clair",
      "Remplace FileVault",
      "Désactive SIP",
    ],
    explanation:
      "Apple Silicon associe Platform SSO à Secure Enclave pour protéger les secrets d'authentification.",
    relatedModuleSlug: "intune-apple-advanced/platform-sso",
  },
  {
    id: "iaa-platform-sso08",
    domain: "platform-sso",
    difficulty: "medium",
    text: "Company Portal macOS rôle dans Platform SSO ?",
    correct: "Enregistre l'appareil Entra et amorce le flux SSO avec l'extension Microsoft",
    distractors: [
      "Remplace Intune MDM agent",
      "Installe les apps VPP uniquement",
      "Configure APNs",
    ],
    explanation:
      "Company Portal est le broker utilisateur pour enregistrement et refresh du contexte SSO Entra.",
    relatedModuleSlug: "intune-apple-advanced/platform-sso",
  },
  {
    id: "iaa-platform-sso09",
    domain: "platform-sso",
    difficulty: "easy",
    text: "Platform SSO est supporté sur quelles plateformes Apple via Intune ?",
    correct: "macOS principalement ; extensions SSO similaires existent sur iOS/iPadOS",
    distractors: [
      "watchOS uniquement",
      "tvOS enterprise seulement",
      "Aucune plateforme Apple",
    ],
    explanation:
      "Microsoft Platform SSO cible macOS en priorité ; des scénarios SSO existent aussi sur iOS managed.",
    relatedModuleSlug: "intune-apple-advanced/platform-sso",
  },
  {
    id: "iaa-platform-sso10",
    domain: "platform-sso",
    difficulty: "hard",
    text: "Troubleshooting Platform SSO : log clé côté Mac ?",
    correct: "Console.app — processus companyportal et Microsoft SSO extension",
    distractors: [
      "ABM audit log uniquement",
      "APNs push log dans Intune",
      "Logs VPP App Store Connect",
    ],
    explanation:
      "Les logs système macOS (Company Portal + extension SSO) diagnostiquent les échecs d'enregistrement token.",
    relatedModuleSlug: "intune-apple-advanced/platform-sso",
  },

  // ── Defender macOS (10) ──────────────────────────────────────────────────────
  {
    id: "iaa-defender-macos01",
    domain: "defender-macos",
    difficulty: "easy",
    text: "Microsoft Defender for Endpoint sur macOS se déploie via Intune avec :",
    correct: "App macOS Defender + profils MDM (onboarding, FDA/PPPC, exclusions)",
    distractors: [
      "Uniquement Group Policy AD",
      "Apple Configurator USB",
      "Certificat APNs dédié Defender",
    ],
    explanation:
      "Defender macOS nécessite l'app, le package onboarding et les autorisations TCC via profils Intune.",
    relatedModuleSlug: "intune-apple-advanced/defender-macos",
  },
  {
    id: "iaa-defender-macos02",
    domain: "defender-macos",
    difficulty: "medium",
    text: "Defender macOS affiche « Unhealthy » dans MDE portal. Cause #1 Intune ?",
    correct: "Full Disk Access non accordé — profil PPPC manquant ou incorrect",
    distractors: [
      "Token ABM expiré",
      "Platform SSO désactivé",
      "Wi-Fi 802.1X mal configuré",
    ],
    explanation:
      "Defender requiert FDA pour scanner ; le profil PPPC Intune doit cibler com.microsoft.wdav.",
    relatedModuleSlug: "intune-apple-advanced/defender-macos",
  },
  {
    id: "iaa-defender-macos03",
    domain: "defender-macos",
    difficulty: "hard",
    text: "Onboarding package Defender macOS contient :",
    correct: "Script/paramètres liant l'appareil au tenant MDE (org ID, onboarding blob)",
    distractors: [
      "Le certificat APNs Apple",
      "Le token ABM enrollment",
      "La clé FileVault recovery",
    ],
    explanation:
      "L'onboarding MDE enregistre le Mac dans le tenant Defender ; déployé via profil ou script Intune.",
    relatedModuleSlug: "intune-apple-advanced/defender-macos",
  },
  {
    id: "iaa-defender-macos04",
    domain: "defender-macos",
    difficulty: "medium",
    text: "Defender + compliance Intune : intérêt ?",
    correct: "Bloquer l'accès CA si antivirus unhealthy ou menaces actives non résolues",
    distractors: [
      "Remplacer APNs",
      "Gérer les apps VPP",
      "Configurer ADE",
    ],
    explanation:
      "L'intégration MDE alimente compliance et CA pour Zero Trust endpoint.",
    relatedModuleSlug: "intune-apple-advanced/defender-macos",
  },
  {
    id: "iaa-defender-macos05",
    domain: "defender-macos",
    difficulty: "easy",
    text: "Quelle licence Microsoft inclut Defender for Endpoint macOS ?",
    correct: "M365 E5 / E5 Security ou licence MDE standalone",
    distractors: [
      "Apple Business Essentials uniquement",
      "VPP token Apple",
      "Intune Plan 1 seul sans MDE",
    ],
    explanation:
      "MDE macOS requiert une licence Microsoft incluant Defender for Endpoint.",
    relatedModuleSlug: "intune-apple-advanced/defender-macos",
  },
  {
    id: "iaa-defender-macos06",
    domain: "defender-macos",
    difficulty: "medium",
    text: "Exclusion path Defender macOS pour dossier dev interne se configure :",
    correct: "Dans MDE portal ou policy Intune Antivirus exclusions macOS",
    distractors: [
      "Dans Apple Business Manager",
      "Via token enrollment ABM",
      "Uniquement en désactivant SIP",
    ],
    explanation:
      "Les exclusions antivirus se gèrent côté MDE/Intune pour éviter faux positifs sur outils dev.",
    relatedModuleSlug: "intune-apple-advanced/defender-macos",
  },
  {
    id: "iaa-defender-macos07",
    domain: "defender-macos",
    difficulty: "hard",
    text: "Conflit Defender macOS + autre AV tiers déjà installé :",
    correct: "Un seul AV temps réel recommandé — désinstaller l'ancien AV avant Defender",
    distractors: [
      "Les deux AV peuvent scanner simultanément sans impact",
      "Defender remplace APNs",
      "Intune installe les deux en parallèle par défaut",
    ],
    explanation:
      "Coexistence de plusieurs AV temps réel provoque conflits performance et détection.",
    relatedModuleSlug: "intune-apple-advanced/defender-macos",
  },
  {
    id: "iaa-defender-macos08",
    domain: "defender-macos",
    difficulty: "medium",
    text: "Tamper Protection Defender macOS empêche :",
    correct: "La désactivation non autorisée de Defender par l'utilisateur ou un malware",
    distractors: [
      "Le déploiement de profils Wi-Fi",
      "La sync ABM",
      "Platform SSO registration",
    ],
    explanation:
      "Tamper Protection verrouille les paramètres Defender ; géré via policy MDE/Intune.",
    relatedModuleSlug: "intune-apple-advanced/defender-macos",
  },
  {
    id: "iaa-defender-macos09",
    domain: "defender-macos",
    difficulty: "easy",
    text: "Network protection Defender macOS (web threat protection) requiert :",
    correct: "Extension réseau système approuvée via profil System Extension MDM",
    distractors: [
      "Désactivation Gatekeeper",
      "Apple ID admin",
      "Token SCEP Wi-Fi",
    ],
    explanation:
      "Les filtres web Defender utilisent une system extension déployée et approuvée via Intune.",
    relatedModuleSlug: "intune-apple-advanced/defender-macos",
  },
  {
    id: "iaa-defender-macos10",
    domain: "defender-macos",
    difficulty: "hard",
    text: "Defender macOS EDR sensor data remonte à MDE via :",
    correct: "Canal cloud MDE (HTTPS) indépendant du canal MDM APNs",
    distractors: [
      "Uniquement via commandes APNs push",
      "Sync ABM nightly",
      "Graph API Conditional Access",
    ],
    explanation:
      "MDE communique avec le cloud Microsoft en parallèle du management Intune MDM.",
    relatedModuleSlug: "intune-apple-advanced/defender-macos",
  },

  // ── Managed apps (8) ─────────────────────────────────────────────────────────
  {
    id: "iaa-managed-apps01",
    domain: "managed-apps",
    difficulty: "easy",
    text: "Apps & Books (VPP) dans ABM lié à Intune permet :",
    correct: "Acheter et assigner des licences d'apps aux utilisateurs ou appareils gérés",
    distractors: [
      "Jailbreaker les iPhone supervisés",
      "Renouveler le certificat APNs",
      "Créer des comptes locaux macOS",
    ],
    explanation:
      "VPP/Apps & Books synchronise les licences avec Intune pour déploiement apps managed.",
    relatedModuleSlug: "intune-apple-advanced/managed-apps",
  },
  {
    id: "iaa-managed-apps02",
    domain: "managed-apps",
    difficulty: "medium",
    text: "Assignation app VPP « device » vs « user » sur iPad ADE :",
    correct: "Device = licence liée à l'appareil ; User = licence liée au Managed Apple ID / compte",
    distractors: [
      "Identique sans différence",
      "User requis uniquement pour macOS",
      "Device interdit sur iOS supervisé",
    ],
    explanation:
      "Le mode d'assignation VPP impacte la consommation de licence et la récupération au reassignment.",
    relatedModuleSlug: "intune-apple-advanced/managed-apps",
  },
  {
    id: "iaa-managed-apps03",
    domain: "managed-apps",
    difficulty: "hard",
    text: "App LOB macOS (.pkg) déployée via Intune : prérequis courant ?",
    correct: "App macOS LOB uploadée Intune + assignation groupe + app supervisée ou CP macOS",
    distractors: [
      "Publication App Store Connect obligatoire",
      "Token ABM uniquement",
      "Désactivation Gatekeeper global",
    ],
    explanation:
      "Les pkg entreprise se distribuent via Intune macOS LOB apps avec signature développeur valide.",
    relatedModuleSlug: "intune-apple-advanced/managed-apps",
  },
  {
    id: "iaa-managed-apps04",
    domain: "managed-apps",
    difficulty: "medium",
    text: "App Protection Policy (MAM) sans enrollment MDM sur iOS :",
    correct: "Protège les données dans apps managed (ex. Outlook) sans gestion complète de l'appareil",
    distractors: [
      "Remplace ADE supervision",
      "Configure APNs",
      "Installe FileVault",
    ],
    explanation:
      "MAM applique des contrôles DLP sur apps sans MDM device management — scénario BYOD.",
    relatedModuleSlug: "intune-apple-advanced/managed-apps",
  },
  {
    id: "iaa-managed-apps05",
    domain: "managed-apps",
    difficulty: "easy",
    text: "Microsoft Office macOS déployé via Intune + VPP : avantage ?",
    correct: "Installation managed avec identité Entra et mises à jour contrôlées",
    distractors: [
      "Bypass Conditional Access",
      "Licence Apple gratuite",
      "Suppression de Platform SSO",
    ],
    explanation:
      "Office macOS managed via Intune/VPP s'intègre à l'identité Entra et policies org.",
    relatedModuleSlug: "intune-apple-advanced/managed-apps",
  },
  {
    id: "iaa-managed-apps06",
    domain: "managed-apps",
    difficulty: "medium",
    text: "Retrait licence VPP app device-assigned d'un iPhone reassigned :",
    correct: "La licence est récupérable pour réassignation à un autre appareil",
    distractors: [
      "La licence est perdue définitivement",
      "Nécessite wipe ABM",
      "Impossible sans Apple ID perso",
    ],
    explanation:
      "Les licences device-based VPP se récupèrent lors du unassign pour réutilisation parc.",
    relatedModuleSlug: "intune-apple-advanced/managed-apps",
  },
  {
    id: "iaa-managed-apps07",
    domain: "managed-apps",
    difficulty: "hard",
    text: "Managed App Configuration (App Config) iOS via Intune sert à :",
    correct: "Pousser des clés config (URL, tenant ID) aux apps managed au lancement",
    distractors: [
      "Renouveler certificat SCEP",
      "Modifier serial ABM",
      "Configurer APNs push",
    ],
    explanation:
      "App Config injecte des paramètres métier dans apps supportant managed configuration.",
    relatedModuleSlug: "intune-apple-advanced/managed-apps",
  },
  {
    id: "iaa-managed-apps08",
    domain: "managed-apps",
    difficulty: "medium",
    text: "Company Portal macOS permet à l'utilisateur de :",
    correct: "Installer des apps assignées et vérifier conformité appareil",
    distractors: [
      "Renouveler le token ABM",
      "Modifier les policies CA Entra",
      "Créer des certificats APNs",
    ],
    explanation:
      "Company Portal est le self-service apps et statut compliance pour utilisateurs Mac/iOS.",
    relatedModuleSlug: "intune-apple-advanced/managed-apps",
  },

  // ── Troubleshooting (8) ──────────────────────────────────────────────────────
  {
    id: "iaa-troubleshooting01",
    domain: "troubleshooting",
    difficulty: "easy",
    text: "Première étape dépannage Mac non compliant Intune ?",
    correct: "Consulter la blade Conformité de l'appareil et le dernier check-in MDM",
    distractors: [
      "Wipe immédiat",
      "Supprimer le tenant Entra",
      "Désactiver ABM",
    ],
    explanation:
      "Identifier la policy en échec et la fraîcheur du check-in oriente le diagnostic.",
    relatedModuleSlug: "intune-apple-advanced/troubleshooting",
  },
  {
    id: "iaa-troubleshooting02",
    domain: "troubleshooting",
    difficulty: "medium",
    text: "Forcer sync MDM sur Mac géré Intune :",
    correct: "Company Portal > Paramètres > Sync ou commande Sync Devices depuis Intune",
    distractors: [
      "Réinstaller macOS uniquement",
      "Renouveler VPP token",
      "Modifier Conditional Access report-only",
    ],
    explanation:
      "La sync manuelle accélère le déploiement profils et remontée compliance.",
    relatedModuleSlug: "intune-apple-advanced/troubleshooting",
  },
  {
    id: "iaa-troubleshooting03",
    domain: "troubleshooting",
    difficulty: "hard",
    text: "Mac ADE « Enrollment failed » au Setup Assistant. Logs à collecter ?",
    correct: "Intune enrollment status + logs Setup Assistant (syslog) + vérifier assignation ABM",
    distractors: [
      "Logs VPP App Store uniquement",
      "Historique facturation M365",
      "Captures écran Gatekeeper",
    ],
    explanation:
      "Les échecs ADE initial impliquent MDM assignation ABM, profil enrollment et connectivité.",
    relatedModuleSlug: "intune-apple-advanced/troubleshooting",
  },
  {
    id: "iaa-troubleshooting04",
    domain: "troubleshooting",
    difficulty: "medium",
    text: "Profil Wi-Fi Intune non appliqué sur Mac — vérification réseau ?",
    correct: "Mac en ligne, check-in MDM récent, profil assigné au bon groupe dynamique",
    distractors: [
      "Apple ID utilisateur expiré",
      "Token ABM se renouvelle seul",
      "Defender tamper protection",
    ],
    explanation:
      "Les profils nécessitent assignation correcte et sync MDM ; vérifier groupes et statut profil Intune.",
    relatedModuleSlug: "intune-apple-advanced/troubleshooting",
  },
  {
    id: "iaa-troubleshooting05",
    domain: "troubleshooting",
    difficulty: "easy",
    text: "Troubleshooting APNs : indicateur Intune clé ?",
    correct: "Statut certificat APNs expiré ou proche expiration dans Inscription Apple",
    distractors: [
      "Nombre de licences VPP",
      "Score Secure Score uniquement",
      "Quota OneDrive utilisateur",
    ],
    explanation:
      "Un APNs invalide explique les appareils ne répondant plus aux commandes MDM.",
    relatedModuleSlug: "intune-apple-advanced/troubleshooting",
  },
  {
    id: "iaa-troubleshooting06",
    domain: "troubleshooting",
    difficulty: "medium",
    text: "Collecte logs Company Portal macOS pour support Microsoft :",
    correct: "Company Portal > Aide > Collect diagnostic logs",
    distractors: [
      "ABM > Activity > Download logs",
      "Apple Push Certificates Portal",
      "Defender > quarantine export",
    ],
    explanation:
      "Company Portal génère un bundle diagnostic pour escalade Intune/Entra.",
    relatedModuleSlug: "intune-apple-advanced/troubleshooting",
  },
  {
    id: "iaa-troubleshooting07",
    domain: "troubleshooting",
    difficulty: "hard",
    text: "Mac perdu du parc — accès M365 toujours possible via navigateur perso. Mitigation ?",
    correct: "CA exige compliant device + revoke sessions Entra + remote wipe Intune",
    distractors: [
      "Renouveler token ABM seulement",
      "Désactiver APNs",
      "Supprimer profil Wi-Fi",
    ],
    explanation:
      "La réponse incident combine wipe MDM, revocation refresh tokens et CA device-bound.",
    relatedModuleSlug: "intune-apple-advanced/troubleshooting",
  },
  {
    id: "iaa-troubleshooting08",
    domain: "troubleshooting",
    difficulty: "medium",
    text: "Méthode de dépannage Intune Apple recommandée en entreprise ?",
    correct: "Couches : APNs/ABM → enrollment → profils → compliance → CA → apps, avec pilote avant prod",
    distractors: [
      "Tout déployer en production day one",
      "Ignorer les logs device",
      "Dépanner uniquement via forums Apple",
    ],
    explanation:
      "Une approche structurée par couche et un groupe pilote réduisent les incidents massifs.",
    relatedModuleSlug: "intune-apple-advanced/troubleshooting",
  },
];

export const intuneAppleAdvancedBank: Question[] = buildExamBank(inputs);
