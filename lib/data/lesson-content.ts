import type { Course, Lesson, LessonContent, Module } from "@/lib/types";
import { getQuizzesByTrack } from "@/lib/data/quizzes";
import { getTrack } from "@/lib/data/tracks";
import { getScreenshotsForLesson } from "@/lib/data/lesson-screenshots";
import { getProModuleLessonContent } from "@/lib/data/pro-modules/lesson-content";
import { getAdvancedLessonContent } from "@/lib/data/advanced-tracks/lesson-content";
import { getAltMdmLessonContent } from "@/lib/data/alternative-mdm-tracks/lesson-content";
import { APPLE_PLATFORM_DEPLOYMENT_TOPICS } from "@/lib/data/apple-platform-deployment/topic-overrides";
import {
  abmIntuneBestPractices,
  abmIntuneObjectives,
  abmIntunePrerequisites,
  abmIntuneSteps,
  abmIntuneTheory,
  abmIntuneTroubleshooting,
} from "@/lib/data/lessons/abm-intune-content";
import { buildIntuneLearnLessonContent } from "@/lib/data/intune/microsoft-learn-content";
import { getJamfFundamentalsLessonContent } from "@/lib/data/jamf/jamf-fundamentals-lesson-content";

function getAbmIntuneFallbackContent(): LessonContent {
  return {
    objectives: abmIntuneObjectives,
    prerequisites: abmIntunePrerequisites,
    theory: abmIntuneTheory,
    steps: abmIntuneSteps.map((s) => ({ title: s.title, description: s.steps.join(" ") })),
    screenshots: getScreenshotsForLesson("abm-intune"),
    bestPractices: abmIntuneBestPractices,
    troubleshooting: abmIntuneTroubleshooting,
  };
}


function topicContext(course: Course, module: Module, lesson: Lesson) {
  const track = getTrack(course.trackSlug);
  const domain = course.trackSlug.includes("jamf")
    ? "Jamf Pro"
    : course.trackSlug.includes("intune")
      ? "Microsoft Intune"
      : "Apple";

  return {
    track,
    domain,
    lessonTitle: lesson.title,
    moduleTitle: module.title,
    courseTitle: course.title,
    certification: track?.certification ?? course.title,
  };
}

type LessonTopic = {
  focus: string;
  outcomes: string[];
  concepts: string[];
  actions: string[];
  validation: string[];
  risks: string[];
  tools?: string[];
  enterpriseScenario?: string[];
  procedure?: string[];
  troubleshooting?: { problem: string; solution: string }[];
  officialReferences?: string[];
};

const LESSON_TOPICS: Record<string, LessonTopic> = {
  "historique-ecosysteme": {
    focus: "l'évolution d'Apple depuis le poste créatif isolé jusqu'à la plateforme enterprise intégrée",
    outcomes: [
      "Situer macOS, iOS et iPadOS dans une stratégie IT moderne.",
      "Expliquer pourquoi Apple Business Manager, MDM et identité sont devenus centraux.",
      "Identifier les ruptures importantes : iPhone, iPad, Apple Silicon, services cloud et sécurité matérielle.",
    ],
    concepts: [
      "Apple construit une expérience où matériel, système, sécurité et services sont conçus ensemble.",
      "L'entreprise ne gère plus seulement des Mac : elle orchestre un parc multi-OS avec inventaire, identité, conformité et apps.",
      "Les choix d'architecture Apple privilégient l'enrôlement automatisé, la supervision, les profils déclaratifs et la séparation vie pro/vie perso.",
    ],
    actions: [
      "Cartographier les usages Apple dans l'entreprise : créatifs, dirigeants, développeurs, front-line, mobilité.",
      "Relier chaque usage à un besoin MDM : enrollment, sécurité, apps, inventaire, support.",
      "Lister les dépendances : Apple Business Manager, fournisseur MDM, IdP, réseau, PKI et support.",
    ],
    validation: [
      "Vous savez expliquer la place d'Apple dans un SI d'entreprise.",
      "Vous distinguez les services Apple grand public des services administrés pour l'entreprise.",
    ],
    risks: [
      "Confondre compte Apple personnel et Managed Apple Account.",
      "Sous-estimer l'importance d'ABM dans les achats, l'enrôlement et les licences d'apps.",
    ],
    tools: ["Apple Business Manager", "MDM", "Apple Platform Deployment"],
  },
  "macos-ios-ipados": {
    focus: "les différences d'administration entre macOS, iOS, iPadOS et tvOS",
    outcomes: [
      "Comparer les capacités MDM disponibles selon la plateforme.",
      "Choisir les bons profils et restrictions selon le type d'appareil.",
      "Anticiper les écarts d'expérience utilisateur entre Mac, iPhone, iPad et Apple TV.",
    ],
    concepts: [
      "macOS accepte des scénarios plus proches du poste de travail : scripts, packages, FileVault, comptes locaux et extensions système.",
      "iOS et iPadOS reposent davantage sur la supervision, les restrictions, les apps gérées et les commandes MDM.",
      "tvOS se pilote surtout par supervision, restrictions, apps et configuration réseau, avec beaucoup moins de surface poste de travail.",
      "La même intention de sécurité peut nécessiter des payloads différents selon l'OS.",
    ],
    actions: [
      "Créer une matrice Mac/iPhone/iPad/Apple TV avec enrollment, sécurité, apps, réseau et support.",
      "Définir les payloads communs puis les variantes spécifiques à chaque OS.",
      "Préparer un groupe pilote par plateforme pour éviter les surprises de comportement.",
    ],
    validation: [
      "Vous savez dire si une exigence relève d'un profil macOS, iOS/iPadOS ou des deux.",
      "Vous savez quand la supervision est indispensable.",
    ],
    risks: [
      "Déployer une restriction iOS comme si elle existait à l'identique sur macOS.",
      "Oublier les versions minimales d'OS pour certaines capacités récentes.",
    ],
  },
  "apple-silicon": {
    focus: "l'impact d'Apple Silicon sur performance, sécurité et support Mac",
    outcomes: [
      "Comprendre les implications d'Apple Silicon pour le déploiement Mac.",
      "Préparer les apps Intel, Universal et Rosetta 2.",
      "Adapter les procédures Recovery, sécurité et effacement.",
    ],
    concepts: [
      "Apple Silicon intègre CPU, GPU, Neural Engine, Secure Enclave et contrôleurs système dans une architecture unifiée.",
      "La chaîne de démarrage sécurisée et les volumes système signés changent la manière de dépanner et réinstaller macOS.",
      "La compatibilité applicative se pilote avec inventaire, tests Universal Binary et politique Rosetta 2.",
    ],
    actions: [
      "Auditer les apps métier pour identifier Intel, Universal et extensions système.",
      "Préparer l'installation de Rosetta 2 si des apps Intel restent nécessaires.",
      "Tester Recovery, Erase All Content and Settings et réenrôlement ADE sur un Mac de lab.",
    ],
    validation: [
      "Les applications critiques sont qualifiées sur Apple Silicon.",
      "Le support sait réinstaller ou effacer un Mac Apple Silicon sans casser l'enrôlement.",
    ],
    risks: [
      "Découvrir trop tard une dépendance kernel extension non compatible.",
      "Appliquer d'anciens réflexes Intel à la récupération Apple Silicon.",
    ],
  },
  "filevault-chiffrement": {
    focus: "le chiffrement FileVault et la gestion des clés de secours",
    outcomes: [
      "Expliquer le rôle de FileVault dans la protection des données au repos.",
      "Configurer l'escrow de clé personnelle dans le MDM.",
      "Prévoir une procédure de récupération support.",
    ],
    concepts: [
      "FileVault chiffre le volume de données et protège l'accès hors session utilisateur.",
      "En entreprise, la clé de secours doit être séquestrée dans le MDM ou un coffre approuvé.",
      "La rotation de clé après usage limite l'exposition en cas d'incident support.",
    ],
    actions: [
      "Créer le profil FileVault avec escrow de clé de secours.",
      "Appliquer le profil à un groupe pilote puis vérifier la remontée de la clé.",
      "Tester une récupération contrôlée et documenter la rotation post-intervention.",
    ],
    validation: [
      "Le Mac est chiffré et la clé est visible dans l'outil MDM.",
      "Le support connaît le chemin de récupération et les règles d'audit.",
    ],
    risks: [
      "Activer FileVault sans escrow opérationnel.",
      "Laisser des clés utilisées sans rotation.",
    ],
    tools: ["FileVault", "MDM", "SecureToken"],
  },
  "touch-id-face-id": {
    focus: "Touch ID, Face ID, Secure Enclave et authentification locale",
    outcomes: [
      "Comprendre ce que Secure Enclave protège réellement.",
      "Distinguer biométrie locale, mot de passe et authentification cloud.",
      "Définir une politique biométrique compatible sécurité et expérience utilisateur.",
    ],
    concepts: [
      "Les données biométriques restent locales à l'appareil et ne sont pas envoyées au MDM.",
      "Secure Enclave protège des secrets, participe au démarrage sécurisé et renforce l'authentification.",
      "Touch ID et Face ID remplacent des gestes fréquents, mais ne suppriment pas le besoin d'un code fort.",
    ],
    actions: [
      "Définir les exigences de code, délai de verrouillage et biométrie autorisée.",
      "Tester les scénarios après redémarrage, changement de mot de passe et verrouillage distant.",
      "Documenter ce que l'IT peut et ne peut pas voir côté biométrie.",
    ],
    validation: [
      "Les utilisateurs peuvent utiliser la biométrie sans affaiblir la politique de code.",
      "Les équipes support savent répondre aux questions de confidentialité.",
    ],
    risks: [
      "Présenter la biométrie comme un secret stocké dans le cloud.",
      "Créer une politique de code trop agressive qui dégrade l'adoption.",
    ],
  },
  "gatekeeper-notarisation": {
    focus: "Gatekeeper, notarisation et contrôle d'exécution des apps macOS",
    outcomes: [
      "Expliquer le rôle de Gatekeeper dans la protection contre les apps non fiables.",
      "Comprendre notarisation, signature développeur et quarantaine.",
      "Préparer une stratégie pour les apps internes.",
    ],
    concepts: [
      "Gatekeeper vérifie les apps téléchargées et s'appuie sur signature, notarisation et attribut de quarantaine.",
      "La notarisation n'est pas une validation fonctionnelle : elle confirme qu'Apple n'a pas détecté de contenu malveillant connu.",
      "Les apps internes doivent être signées et distribuées proprement pour éviter des contournements utilisateurs.",
    ],
    actions: [
      "Inventorier les apps non signées ou non notarized utilisées en production.",
      "Mettre en place un processus de signature pour les apps internes.",
      "Tester le premier lancement, les extensions système et les prompts sécurité.",
    ],
    validation: [
      "Les apps métier s'ouvrent sans demander de contournement manuel.",
      "Les exceptions sont documentées et approuvées.",
    ],
    risks: [
      "Désactiver Gatekeeper globalement au lieu de traiter la cause.",
      "Confondre notarisation, validation sécurité complète et conformité interne.",
    ],
  },
  "wifi-ethernet": {
    focus: "la connectivité réseau Apple en environnement entreprise",
    outcomes: [
      "Déployer des profils Wi-Fi fiables.",
      "Préparer les certificats 802.1X et contraintes proxy.",
      "Diagnostiquer les pannes réseau courantes sur Mac et iPhone.",
    ],
    concepts: [
      "Un profil Wi-Fi enterprise combine SSID, méthode EAP, certificats de confiance et parfois identité machine ou utilisateur.",
      "Les appareils Apple valident strictement la confiance TLS : la chaîne CA doit être propre.",
      "Les proxys, captive portals et inspections TLS peuvent casser enrollment, APNs ou activation.",
    ],
    actions: [
      "Créer un profil Wi-Fi pilote avec certificats racine et paramètres EAP.",
      "Tester enrollment sur réseau interne, invité et hors site.",
      "Documenter les endpoints Apple/MDM autorisés au firewall.",
    ],
    validation: [
      "L'appareil rejoint le Wi-Fi sans intervention manuelle.",
      "Les commandes MDM et notifications APNs fonctionnent sur le réseau cible.",
    ],
    risks: [
      "Oublier le renouvellement des certificats 802.1X.",
      "Bloquer APNs ou les services d'activation Apple via filtrage réseau.",
    ],
  },
  "icloud-comptes": {
    focus: "iCloud, comptes Apple personnels et Managed Apple IDs",
    outcomes: [
      "Distinguer usage personnel, usage professionnel et compte géré.",
      "Définir ce qui doit être autorisé ou restreint.",
      "Préparer la communication utilisateur autour des données.",
    ],
    concepts: [
      "Un Apple Account personnel appartient à l'utilisateur ; un Managed Apple ID appartient à l'organisation.",
      "Certaines fonctions iCloud ne sont pas identiques entre compte personnel et compte géré.",
      "La séparation des données est un sujet autant juridique et RH que technique.",
    ],
    actions: [
      "Lister les services nécessaires : iCloud Drive, Photos, Find My, Keychain, Messages, Continuity.",
      "Choisir les restrictions MDM adaptées aux appareils corporate et BYOD.",
      "Rédiger une note simple sur propriété des données et support.",
    ],
    validation: [
      "Les utilisateurs savent quel compte utiliser pour quel usage.",
      "Les restrictions ne bloquent pas les workflows métiers légitimes.",
    ],
    risks: [
      "Utiliser des comptes personnels pour acheter ou gérer des apps d'entreprise.",
      "Bloquer iCloud sans alternative de synchronisation ou sauvegarde.",
    ],
  },
  "services-entreprise": {
    focus: "les services Apple utiles à l'entreprise",
    outcomes: [
      "Identifier les briques Apple Business Manager, ADE, Apps & Books et Managed Apple IDs.",
      "Relier chaque service au cycle de vie appareil dans un scénario enterprise concret.",
      "Préparer une architecture Apple enterprise cohérente avec Jamf ou Intune.",
    ],
    concepts: [
      "Cas TechCorp (800 Mac) : ABM centralise achats revendeur, ADE zero-touch, VPP pour apps métier, Jamf Pro comme MDM.",
      "Managed Apple IDs fédérés Entra ID remplacent les comptes @icloud.com pour les services corporate.",
      "Apple Business Essentials offre MDM intégré PME ; Jamf/Intune pour ETI et grand compte.",
    ],
    actions: [
      "Vérifier que les achats Apple sont rattachés à ABM via revendeur agréé.",
      "Créer les rôles admin minimaux (Device Manager, Content Manager).",
      "Relier ABM au MDM, tester ADE sur Mac neuf et documenter flux offboarding.",
    ],
    validation: [
      "Un appareil acheté arrive automatiquement dans ABM puis dans le MDM sans config manuelle.",
      "Les licences VPP sont visibles, assignables et récupérables au remplacement device.",
    ],
    risks: [
      "Multiplier les comptes admin globaux ABM sans moindre privilège.",
      "Acheter du matériel hors canaux reliés à ABM — perte ADE automatique.",
      "Utilisateur lie compte Apple perso à apps corporate — perte accès au départ.",
    ],
    tools: ["Apple Business Manager", "Jamf Pro", "Microsoft Intune", "Managed Apple IDs"],
  },
  "diagnostic-systeme": {
    focus: "les outils de diagnostic système macOS",
    outcomes: [
      "Choisir le bon outil de diagnostic selon le symptôme.",
      "Collecter des informations utiles sans exposer inutilement les données utilisateur.",
      "Construire une hypothèse avant de réinstaller.",
    ],
    concepts: [
      "Le diagnostic macOS combine informations système, logs, profils installés, état disque, réseau et processus.",
      "Un bon ticket support contient symptômes, périmètre, horodatage, changements récents et preuves.",
      "La réinstallation est rarement la première étape : il faut isoler compte, réseau, app ou système.",
    ],
    actions: [
      "Collecter modèle, version macOS, stockage, batterie et profils installés.",
      "Reproduire le problème sur un autre compte ou en mode sans échec si pertinent.",
      "Exporter les éléments nécessaires au ticket niveau 2 ou éditeur.",
    ],
    validation: [
      "Le diagnostic aboutit à une cause probable ou à une escalade documentée.",
      "Les données sensibles sont masquées avant partage.",
    ],
    risks: [
      "Effacer un Mac sans avoir capturé les preuves.",
      "Se fier uniquement à un symptôme utilisateur sans reproduction.",
    ],
  },
  "console-logs": {
    focus: "l'analyse des logs macOS avec Console et log show",
    outcomes: [
      "Filtrer les logs par processus, subsystem et période.",
      "Repérer les erreurs répétitives et les corréler à un événement.",
      "Préparer une collecte exploitable pour support.",
    ],
    concepts: [
      "Le système Unified Logging est volumineux : la valeur vient du filtre et de l'horodatage.",
      "Console aide à explorer, tandis que log show et log stream permettent une collecte précise.",
      "Les logs doivent être interprétés avec contexte : beaucoup d'erreurs visibles ne sont pas la cause racine.",
    ],
    actions: [
      "Noter l'heure exacte de reproduction du problème.",
      "Filtrer par app, subsystem ou catégorie.",
      "Exporter un extrait court avec les lignes avant et après l'échec.",
    ],
    validation: [
      "Vous pouvez isoler une erreur liée au problème reproduit.",
      "L'extrait contient assez de contexte pour une escalade.",
    ],
    risks: [
      "Partager des logs complets contenant des données personnelles.",
      "Interpréter une erreur bénigne comme cause principale.",
    ],
  },
  "mode-recovery": {
    focus: "Recovery macOS, réinstallation et effacement sécurisé",
    outcomes: [
      "Choisir entre Recovery, Safe Mode, réinstallation et effacement.",
      "Préserver l'enrôlement ADE quand l'appareil est corporate.",
      "Réinstaller macOS en limitant l'impact utilisateur.",
    ],
    concepts: [
      "Recovery donne accès à Disk Utility, réinstallation macOS, sécurité de démarrage et restauration.",
      "Sur Apple Silicon, l'accès Recovery et la sécurité de démarrage diffèrent des Mac Intel.",
      "Erase All Content and Settings peut être préférable à un effacement disque complet sur Mac récents.",
    ],
    actions: [
      "Vérifier sauvegarde, statut ADE et FileVault avant intervention.",
      "Choisir la procédure selon modèle Intel ou Apple Silicon.",
      "Après réinstallation, confirmer activation, enrollment et profils MDM.",
    ],
    validation: [
      "Le Mac redémarre proprement et revient sous gestion MDM.",
      "Les données et clés ont été traitées selon la politique interne.",
    ],
    risks: [
      "Casser l'enrôlement en supprimant l'appareil du MDM ou d'ABM.",
      "Réinstaller sans traiter la cause initiale.",
    ],
  },
  "comptes-locaux-managed": {
    focus: "les comptes locaux macOS et les Managed Apple IDs",
    outcomes: [
      "Distinguer identité locale, IdP et Managed Apple ID.",
      "Comprendre le rôle des comptes admin et standard.",
      "Préparer une stratégie de création de compte au premier démarrage.",
    ],
    concepts: [
      "Le compte local ouvre la session macOS ; le Managed Apple ID donne accès aux services Apple gérés.",
      "Platform SSO et IdP modernes réduisent l'écart entre identité cloud et session locale.",
      "Les droits admin doivent être limités, temporaires et audités.",
    ],
    actions: [
      "Définir qui crée le premier compte : Setup Assistant, prestage, outil MDM ou IdP.",
      "Configurer les rôles standard/admin et les exceptions support.",
      "Tester changement de mot de passe et récupération de compte.",
    ],
    validation: [
      "Le bon type de compte est créé au bon moment.",
      "Les droits admin sont justifiés et traçables.",
    ],
    risks: [
      "Confondre suppression du compte local et désactivation de l'identité cloud.",
      "Distribuer un compte admin partagé non audité.",
    ],
  },
  "sso-kerberos": {
    focus: "SSO, Kerberos et intégration identité sur macOS",
    outcomes: [
      "Comprendre les scénarios Kerberos encore pertinents.",
      "Comparer Kerberos SSO Extension et Platform SSO.",
      "Diagnostiquer les problèmes de tickets et de mot de passe.",
    ],
    concepts: [
      "Kerberos reste fréquent avec Active Directory, partages SMB et applications internes.",
      "Les extensions SSO macOS améliorent l'expérience en renouvelant tickets et sessions.",
      "Platform SSO modernise le lien entre compte local et IdP cloud.",
    ],
    actions: [
      "Identifier les services qui exigent Kerberos.",
      "Configurer realm, domaines associés et extension SSO si nécessaire.",
      "Tester accès aux ressources après connexion, verrouillage et changement de mot de passe.",
    ],
    validation: [
      "Les tickets Kerberos sont obtenus sans demande répétitive.",
      "Les changements de mot de passe restent synchronisés selon le design choisi.",
    ],
    risks: [
      "Déployer Kerberos sans DNS et heure système fiables.",
      "Utiliser une approche legacy alors que Platform SSO répond mieux au besoin.",
    ],
  },
  "profils-utilisateur": {
    focus: "profils utilisateur, données locales et migration macOS",
    outcomes: [
      "Identifier où vivent les données utilisateur importantes.",
      "Préparer migration, sauvegarde et restauration.",
      "Éviter les pertes lors d'un changement de Mac ou de compte.",
    ],
    concepts: [
      "Le profil utilisateur contient données, préférences, trousseau, caches et réglages applicatifs.",
      "Les données synchronisées cloud ne remplacent pas toujours une sauvegarde complète.",
      "Les migrations doivent tenir compte de FileVault, permissions, apps et identité.",
    ],
    actions: [
      "Lister les emplacements critiques : Desktop, Documents, app data, trousseau, profils navigateur.",
      "Choisir une méthode : Migration Assistant, sauvegarde cloud, outil entreprise ou réinstallation propre.",
      "Valider l'accès aux apps et données après migration.",
    ],
    validation: [
      "L'utilisateur retrouve ses données métier et accès essentiels.",
      "Les anciennes données sont supprimées selon la politique de sécurité.",
    ],
    risks: [
      "Migrer des corruptions ou agents obsolètes vers un nouveau Mac.",
      "Oublier les données stockées hors dossiers standards.",
    ],
  },
};

const GENERATED_TOPIC_OVERRIDES: Record<string, Partial<LessonTopic>> = {
  "abm-creation-roles": {
    focus: "la création d'Apple Business Manager et la délégation des rôles",
    concepts: [
      "ABM est le point d'entrée pour appareils, apps, serveurs MDM et identifiants gérés.",
      "Les rôles doivent suivre le moindre privilège : administrateur, gestionnaire d'appareils, contenu, personnes.",
      "La gouvernance ABM conditionne la qualité des enrollments et des audits.",
    ],
    actions: ["Créer ou vérifier l'organisation ABM.", "Configurer rôles, sites et administrateurs de secours.", "Activer les notifications et documenter les comptes critiques."],
  },
  "dep-enrollment": {
    focus: "Automated Device Enrollment via Apple Business Manager",
    concepts: [
      "ADE rattache un appareil à l'organisation avant même sa première configuration utilisateur.",
      "Le profil d'enrôlement contrôle Setup Assistant, supervision et gestion obligatoire.",
      "L'assignation ABM vers le serveur MDM doit être synchronisée avant le test.",
    ],
    actions: ["Assigner un appareil au serveur MDM.", "Créer un profil d'enrôlement avec supervision.", "Effacer l'appareil puis vérifier l'enrôlement au premier démarrage."],
  },
  "apps-books": {
    focus: "Apps & Books et l'achat de licences applicatives",
    concepts: [
      "Apps & Books permet d'acheter des licences au nom de l'organisation.",
      "Les apps gérées peuvent être assignées à un appareil ou à un utilisateur selon le scénario.",
      "La récupération de licence évite la perte lors du remplacement d'appareil.",
    ],
    actions: ["Acheter ou récupérer des licences.", "Synchroniser le token contenu dans le MDM.", "Assigner l'app à un groupe pilote et vérifier l'installation."],
  },
  "profils-configuration": {
    focus: "les profils de configuration MDM",
    concepts: [
      "Un profil transporte un ou plusieurs payloads : Wi-Fi, restrictions, sécurité, certificats, extensions.",
      "La priorité opérationnelle vient du scope, de la lisibilité et du découpage par objectif.",
      "Les conflits se diagnostiquent côté appareil et côté console MDM.",
    ],
    actions: ["Créer un profil par objectif.", "Limiter le scope au pilote.", "Vérifier l'installation et les payloads réellement appliqués."],
  },
  "commandes-mdm": {
    focus: "les commandes MDM et payloads Apple",
    concepts: [
      "Les commandes MDM exécutent des actions ponctuelles : lock, wipe, inventory, install profile, install app.",
      "Les payloads décrivent un état de configuration plus durable.",
      "APNs réveille l'appareil, mais l'appareil contacte ensuite le serveur MDM pour récupérer la commande.",
    ],
    actions: ["Envoyer une commande non destructive en lab.", "Observer le statut pending/acknowledged/error.", "Documenter les commandes sensibles et leur processus d'approbation."],
  },
  "apns-certificats": {
    focus: "le certificat Apple Push Notification service du MDM",
    concepts: [
      "APNs permet au MDM de notifier l'appareil qu'une commande est disponible.",
      "Le certificat doit être renouvelé avec le même Apple Account pour conserver la relation MDM.",
      "Une expiration APNs bloque la gestion sans supprimer les profils déjà installés.",
    ],
    actions: ["Identifier le compte propriétaire du certificat.", "Planifier le renouvellement avant expiration.", "Tester une commande MDM après renouvellement."],
  },
  "architecture-jamf": {
    focus: "l'architecture Jamf Pro 11.16 et ses composants",
    concepts: [
      "Jamf Pro 11.16 : Computers/Mobile Devices, Policies, Packages, Configuration Profiles, Patch Management, Self Service.",
      "Chaîne push : Jamf Pro → APNs → check-in → commandes MDM (doc 11.16).",
      "ADE/ABM token, PreStage Enrollment, Distribution Points et Sites pour scale enterprise.",
    ],
    actions: [
      "Vérifier APNs et token ADE (Settings → Global Management).",
      "Cartographier rôles admin RBAC et convention de nommage.",
      "Ouvrir inventaire Mac pilote : General, Software, Management History.",
    ],
  },
  "inventaire-recherche": {
    focus: "l'inventaire et la recherche avancée Jamf Pro",
    concepts: [
      "L'inventaire Jamf agrège matériel, logiciels, profils, sécurité et attributs d'extension.",
      "Les recherches avancées alimentent audits, exports et diagnostics.",
      "La fraîcheur d'inventaire dépend des check-ins et des reconstructions d'inventory.",
    ],
    actions: ["Ouvrir un Computer Record.", "Créer une recherche avancée avec colonnes utiles.", "Exporter un inventaire pilote et vérifier les données manquantes."],
  },
  "smart-groups": {
    focus: "les Smart Groups Jamf Pro 11.16",
    concepts: [
      "Smart Groups : membership dynamique selon inventaire (Computers → Smart Computer Groups).",
      "Jamf 11.16 : utiliser pour scope/déploiement — Advanced Search pour reporting.",
      "Éviter critères circulaires entre deux Smart Groups interdépendants.",
    ],
    actions: [
      "Computers → Smart Computer Groups → New → critères AND/OR.",
      "Preview membership avant scope production.",
      "Scope policy pilote ; valider membre vs non-membre.",
    ],
  },
  "config-profiles-jamf": {
    focus: "les Configuration Profiles dans Jamf Pro",
    concepts: [
      "Jamf distribue des profils Apple signés et suivis par scope.",
      "Les payloads sensibles comme FileVault, PPPC ou System Extensions doivent être testés finement.",
      "Un profil doit avoir un propriétaire, une version et un objectif clair.",
    ],
    actions: ["Créer un profil avec un seul objectif.", "Déployer à un Smart Group pilote.", "Vérifier l'état dans le Computer Record et sur macOS."],
  },
  "policies-base": {
    focus: "les policies Jamf de base",
    concepts: [
      "Une policy Jamf combine trigger, fréquence, scope et payloads comme packages, scripts ou maintenance.",
      "Les triggers Recurring Check-in, Enrollment Complete et Self Service répondent à des usages différents.",
      "Les logs de policy sont la première source de diagnostic.",
    ],
    actions: ["Créer une policy pilote avec trigger manuel.", "Ajouter un package ou script simple.", "Lire les logs et corriger les erreurs de scope."],
  },
  "scope-deploiement": {
    focus: "le scope et les stratégies de déploiement Jamf",
    concepts: [
      "Le scope détermine précisément qui reçoit une policy, un profil ou une app.",
      "Les exclusions sont aussi importantes que les inclusions.",
      "Un déploiement mature progresse par lab, pilote, vagues et production.",
    ],
    actions: ["Définir groupes pilote et exclusions.", "Planifier les vagues de déploiement.", "Surveiller échecs et retours avant extension."],
  },
  "extension-attributes": {
    focus: "les Extension Attributes Jamf",
    concepts: [
      "Un Extension Attribute ajoute une donnée personnalisée à l'inventaire.",
      "Il peut être manuel, LDAP, pop-up ou scripté.",
      "Les EA scriptés doivent être rapides, fiables et peu coûteux côté client.",
    ],
    actions: ["Créer un EA de lab.", "Renseigner ou script le résultat.", "Utiliser l'EA comme critère de Smart Group."],
  },
  "scripts-policies": {
    focus: "les scripts et policies avancées Jamf",
    concepts: [
      "Les scripts Jamf s'exécutent souvent en root et doivent être idempotents.",
      "Les paramètres 4 à 11 permettent de réutiliser un script sans hardcoder les valeurs.",
      "La journalisation et les codes retour rendent les policies supportables.",
    ],
    actions: ["Écrire un script idempotent.", "Le publier avec paramètres documentés.", "Tester logs, code retour et rollback."],
  },
  "self-service": {
    focus: "Jamf Self Service 11.16",
    concepts: [
      "Settings → Self Service macOS : branding, catégories, policies utilisateur.",
      "Policy → onglet Self Service : display name, description Markdown.",
      "Patch policies en Self Service n'apparaissent pas dans la recherche (doc 11.16).",
    ],
    actions: [
      "Configurer branding et catégories catalogue.",
      "Publier policy pilote non destructive dans Self Service.",
      "Tester deferrals et Policy Logs sur Mac utilisateur.",
    ],
  },
  "workflows-enrollment": {
    focus: "les workflows d'enrollment Jamf",
    concepts: [
      "L'enrollment combine PreStage, profils initiaux, policies Enrollment Complete et expérience Setup Assistant.",
      "Les workflows doivent être rapides, observables et tolérants aux réseaux imparfaits.",
      "La première heure d'un Mac conditionne fortement la perception utilisateur.",
    ],
    actions: ["Créer un PreStage pilote.", "Définir les policies Enrollment Complete indispensables.", "Mesurer le temps jusqu'à Mac prêt."],
  },
  "patch-management-intro": {
    focus: "Patch Management Jamf Pro 11.16",
    concepts: [
      "Software Titles → Patch Policy : version cible, eligible computers, Patch Unknown Versions.",
      "Install automatique vs disponibilité Self Service (hors recherche SS).",
      "Dashboard Patch Management pour conformité et échecs.",
    ],
    actions: [
      "Vérifier Software Update Inventory.",
      "Create Patch Policy → preview eligible computers.",
      "Scope pilote → rapport conformité avant production.",
    ],
  },
  "api-jamf": {
    focus: "l'API Jamf Pro REST",
    concepts: [
      "L'API Jamf Pro automatise inventaire, objets, groupes, policies et intégrations.",
      "L'authentification moderne utilise des clients API et jetons à durée limitée.",
      "Les scripts doivent gérer pagination, erreurs, limites et secrets.",
    ],
    actions: ["Créer un client API à droits minimaux.", "Tester un appel inventaire.", "Documenter rotation des secrets et journalisation."],
  },
  "patch-management": {
    focus: "le Patch Management avancé dans Jamf",
    concepts: [
      "Une stratégie patch mature sépare criticité, population, fenêtre et méthode d'installation.",
      "Les logiciels sans mécanisme silencieux demandent des workflows spécifiques.",
      "La conformité se mesure par version cible et délai de correction.",
    ],
    actions: ["Classer les apps par criticité.", "Définir SLAs patch.", "Construire rapports et remédiations par Smart Groups."],
  },
  "integrations-tierces": {
    focus: "les intégrations Jamf avec IdP, SIEM et outils enterprise",
    concepts: [
      "Jamf s'intègre avec identité, sécurité endpoint, SIEM, ITSM et outils d'automatisation.",
      "Chaque intégration doit avoir un propriétaire, un secret rotatif et un périmètre de données.",
      "Les webhooks et API créent de la valeur seulement si les erreurs sont supervisées.",
    ],
    actions: ["Lister les intégrations nécessaires.", "Créer comptes/API à privilèges minimaux.", "Tester flux, logs et alertes d'échec."],
  },
  "supervised-mode": {
    focus: "le mode supervisé iOS et macOS",
    concepts: [
      "La supervision donne accès à des restrictions et commandes avancées.",
      "ADE supervise automatiquement les appareils appartenant à l'organisation.",
      "La supervision doit être prévue avant distribution, car elle influence l'expérience de configuration.",
    ],
    actions: ["Vérifier le statut supervisé.", "Comparer capacités supervisées et non supervisées.", "Tester une restriction réservée aux appareils supervisés."],
  },
  "enrollment-token": {
    focus: "l'Enrollment Program Token entre ABM et Intune",
    concepts: [
      "Le token ADE relie Apple Business Manager au service d'enrôlement Intune.",
      "Il permet à Intune de synchroniser appareils, profils et assignations.",
      "Son expiration ou mauvais renouvellement bloque les nouveaux enrollments.",
    ],
    actions: ["Vérifier expiration et compte Apple utilisé.", "Forcer une synchronisation.", "Documenter le renouvellement et les contacts responsables."],
  },
  "compliance-policies": {
    focus: "les compliance policies Intune pour appareils Apple",
    concepts: [
      "La conformité exprime les exigences minimales avant accès aux ressources.",
      "Sur macOS, elle peut couvrir OS minimum, FileVault, firewall, SIP, password et Defender.",
      "Conditional Access consomme l'état compliant/non compliant pour autoriser ou bloquer.",
    ],
    actions: ["Créer une policy de conformité pilote.", "Associer notifications utilisateur.", "Tester l'état dans Intune et Entra sign-in logs."],
  },
  "conditional-access": {
    focus: "Conditional Access avec Intune et Entra ID",
    concepts: [
      "Conditional Access applique des décisions d'accès selon utilisateur, app, risque, appareil et conformité.",
      "Les politiques doivent être testées en report-only avant enforcement.",
      "Les comptes break-glass doivent rester protégés mais exclus des blocages risqués.",
    ],
    actions: ["Créer une policy report-only.", "Exiger un appareil compliant pour un groupe pilote.", "Lire les sign-in logs avant activation."],
  },
  "app-protection": {
    focus: "App Protection Policies pour les apps Microsoft",
    concepts: [
      "Les App Protection Policies protègent les données dans l'application, même sans gestion complète de l'appareil.",
      "Elles contrôlent copier/coller, sauvegarde, PIN, chiffrement et transfert de données.",
      "Elles complètent la gestion MDM, surtout en BYOD.",
    ],
    actions: ["Créer une policy pour Outlook/Teams/Office.", "Définir restrictions de transfert de données.", "Tester scénario personnel/professionnel sur iOS."],
  },
};

function buildFallbackTopic(ctx: ReturnType<typeof topicContext>): LessonTopic {
  const override = GENERATED_TOPIC_OVERRIDES[ctx.lessonTitle] ?? GENERATED_TOPIC_OVERRIDES[ctx.lessonTitle.toLowerCase()];
  void override;
  return {
    focus: `le sujet « ${ctx.lessonTitle} » dans ${ctx.domain}`,
    outcomes: [
      `Comprendre à quoi sert « ${ctx.lessonTitle} » dans le module « ${ctx.moduleTitle} ».`,
      `Savoir préparer, configurer et valider ce sujet dans un environnement ${ctx.domain}.`,
      "Être capable d'expliquer les impacts support, sécurité et expérience utilisateur.",
    ],
    concepts: [
      `« ${ctx.lessonTitle} » doit être traité comme une brique du cycle de vie Apple : préparation, enrollment, configuration, validation et support.`,
      `Dans ${ctx.domain}, la réussite dépend du scope, de la qualité des prérequis et de la capacité à lire les états remontés par la console.`,
      "La documentation interne doit compléter la configuration technique : propriétaire, périmètre, rollback, dates de renouvellement et critères de succès.",
    ],
    actions: [
      "Définir l'objectif opérationnel et le groupe pilote.",
      `Configurer le réglage ou l'objet correspondant dans ${ctx.domain}.`,
      "Vérifier le résultat côté console, côté appareil et côté utilisateur.",
      "Documenter la procédure et préparer l'extension en production.",
    ],
    validation: [
      "Le comportement attendu est visible sur un appareil pilote.",
      "Les équipes support disposent d'une procédure claire.",
    ],
    risks: [
      "Déployer trop largement avant validation.",
      "Ne pas prévoir de rollback ou d'exclusion pour les appareils sensibles.",
    ],
  };
}

function getLessonTopic(ctx: ReturnType<typeof topicContext>, lesson: Lesson): LessonTopic {
  const direct = LESSON_TOPICS[lesson.slug];
  const generated = GENERATED_TOPIC_OVERRIDES[lesson.slug];
  const platform = APPLE_PLATFORM_DEPLOYMENT_TOPICS[lesson.slug];
  const base = direct ?? buildFallbackTopic(ctx);

  const merged = { ...base, ...generated, ...platform };

  return {
    ...merged,
    outcomes: platform?.outcomes ?? generated?.outcomes ?? base.outcomes,
    concepts: platform?.concepts ?? generated?.concepts ?? base.concepts,
    actions: platform?.actions ?? generated?.actions ?? base.actions,
    validation: platform?.validation ?? generated?.validation ?? base.validation,
    risks: platform?.risks ?? generated?.risks ?? base.risks,
    tools: platform?.tools ?? generated?.tools ?? base.tools,
    enterpriseScenario: platform?.enterpriseScenario,
    procedure: platform?.procedure,
    troubleshooting: platform?.troubleshooting,
    officialReferences: platform?.officialReferences,
  };
}

function generateScreenshots(
  course: Course,
  lesson: Lesson,
  ctx: ReturnType<typeof topicContext>
): LessonContent["screenshots"] {
  return getScreenshotsForLesson(lesson.slug, {
    courseSlug: course.slug,
    lesson,
    domain: ctx.domain,
  });
}

function generateObjectives(ctx: ReturnType<typeof topicContext>, topic: LessonTopic): string[] {
  return [
    ...topic.outcomes,
    `Relier ce sujet aux objectifs de certification ${ctx.certification}.`,
    `Valider vos acquis via le quiz de fin de module ou de parcours.`,
  ].slice(0, 5);
}

function generatePrerequisites(
  globalIndex: number,
  course: Course,
  ctx: ReturnType<typeof topicContext>
): string[] {
  const base = [
    `Avoir suivi le module « ${ctx.moduleTitle} » ou posséder une expérience équivalente.`,
    "Disposer d'un Mac administrateur ou d'un accès à un environnement de lab.",
  ];

  if (globalIndex === 0) {
    return [
      "Aucun prérequis technique obligatoire pour cette première leçon.",
      "Une connexion internet stable et un navigateur récent.",
      `Intérêt pour la certification ${ctx.certification}.`,
    ];
  }

  return [
    ...base,
    `Avoir terminé la leçon précédente du parcours ${ctx.courseTitle}.`,
  ];
}

function generateTheory(ctx: ReturnType<typeof topicContext>, topic: LessonTopic): LessonContent["theory"] {
  const sections: LessonContent["theory"] = [
    {
      title: "Vue d'ensemble",
      body: [
        `Cette leçon traite ${topic.focus}. Elle s'inscrit dans le module « ${ctx.moduleTitle} » du parcours ${ctx.courseTitle}.`,
        `L'objectif n'est pas seulement de connaître l'option dans la console : vous devez comprendre son effet sur l'appareil, l'utilisateur, le support et la sécurité.`,
        topic.tools?.length
          ? `Outils principaux : ${topic.tools.join(", ")}.`
          : `Le travail se fait principalement dans ${ctx.domain}, avec vérification sur un appareil Apple de test.`,
      ],
    },
    {
      title: "Concepts essentiels",
      body: topic.concepts,
    },
  ];

  if (topic.enterpriseScenario?.length) {
    sections.push({
      title: "Scénario entreprise",
      body: topic.enterpriseScenario,
    });
  } else {
    sections.push({
      title: "Contexte entreprise",
      body: [
        `Dans une organisation réelle, « ${ctx.lessonTitle} » doit être lié à un propriétaire, un périmètre, une méthode de validation et une procédure de support.`,
        "Planifiez toujours un groupe pilote avant le déploiement global. Documentez versions OS cibles, apps critiques, contraintes réseau, exceptions et critères d'arrêt.",
        "Intégrez sécurité, identité et support dès la conception : conformité, journalisation et réponse aux incidents font partie du cycle de vie Apple.",
      ],
    });
  }

  if (topic.procedure?.length) {
    sections.push({
      title: "Procédure opérationnelle",
      body: topic.procedure,
    });
  }

  sections.push({
    title: "Critères de réussite",
    body: topic.validation,
  });

  if (topic.officialReferences?.length) {
    sections.push({
      title: "Documentation Apple officielle",
      body: topic.officialReferences,
    });
  }

  return sections;
}

function generateSteps(ctx: ReturnType<typeof topicContext>, topic: LessonTopic): LessonContent["steps"] {
  if (topic.procedure?.length) {
    return topic.procedure.map((step, index) => ({
      title: index === 0 ? "Préparer" : index === topic.procedure!.length - 1 ? "Valider" : `Étape ${index + 1}`,
      description: step,
    }));
  }

  const actionSteps = topic.actions.map((action, index) => ({
    title: index === 0 ? "Cadrer" : index === 1 ? "Configurer" : index === 2 ? "Vérifier" : `Étape ${index + 1}`,
    description: action,
  }));

  return actionSteps.length >= 4 ? actionSteps : [
    {
      title: "Préparer l'environnement",
      description: `Vérifiez les accès administrateur, les certificats et la connectivité vers ${ctx.domain}. Exportez la configuration actuelle si vous modifiez un parc existant.`,
    },
    {
      title: "Configurer les paramètres",
      description: `Appliquez les réglages liés à « ${ctx.lessonTitle} » via l'interface ${ctx.domain} ou les outils natifs macOS (Réglages Système, Utilitaire Apple Configurator, Terminal si nécessaire).`,
    },
    {
      title: "Déployer sur un groupe pilote",
      description: "Ciblez 5 à 10 appareils représentatifs (modèles, versions OS, profils utilisateur). Surveillez les check-in MDM et les logs pendant 24 à 48 h.",
    },
    {
      title: "Valider et documenter",
      description: "Contrôlez les critères de succès (conformité, expérience utilisateur, performance). Rédigez une fiche procédure interne et communiquez aux équipes support.",
    },
    {
      title: "Étendre le déploiement",
      description: "Élargissez progressivement le scope par smart groups ou groupes dynamiques. Prévoyez un plan de rollback en cas de régression.",
    },
  ];
}

function generateBestPractices(ctx: ReturnType<typeof topicContext>, topic: LessonTopic): string[] {
  return [
    ...topic.validation.map((item) => `Critère de succès : ${item}`),
    "Nommez clairement vos profils, policies et groupes (préfixe site + fonction + version).",
    "Testez chaque modification sur un lab isolé avant la production.",
    "Maintenez un calendrier de mise à jour OS aligné sur les release notes Apple.",
    "Sauvegardez les certificats push (APNs) et tokens d'enrollment avant expiration.",
    `Documentez les décisions d'architecture ${ctx.domain} pour faciliter les audits.`,
    "Communiquez les changements aux utilisateurs finaux avec une fenêtre de maintenance.",
  ].slice(0, 7);
}

function generateTroubleshooting(ctx: ReturnType<typeof topicContext>, topic: LessonTopic): LessonContent["troubleshooting"] {
  const specific = topic.troubleshooting?.map((t) => ({ problem: t.problem, solution: t.solution })) ?? [];
  const fromRisks = topic.risks.map((risk) => ({
    problem: risk,
    solution:
      "Revenez au groupe pilote, vérifiez le scope, comparez l'état attendu avec l'état réel sur l'appareil, puis documentez la correction avant de reprendre le déploiement.",
  }));

  return [
    ...specific,
    ...fromRisks,
    {
      problem: "L'appareil ne reçoit pas le profil ou la commande MDM.",
      solution:
        "Vérifiez le check-in MDM, le certificat APNs, le scope de la policy et l'état réseau. Forcez un « Update Inventory » puis relancez la commande.",
    },
    {
      problem: "Erreur de certificat ou de confiance lors du déploiement.",
      solution:
        "Renouvelez le certificat push, validez la chaîne PKI interne et assurez-vous que l'heure système est synchronisée (NTP).",
    },
    {
      problem: "Conflit entre plusieurs profils ou restrictions.",
      solution:
        "Isolez les payloads un par un sur un appareil test. Utilisez la vue « Configuration Profiles » côté appareil pour identifier le profil gagnant.",
    },
    {
      problem: `Comportement inattendu après mise à jour ${ctx.domain}.`,
      solution:
        "Consultez les release notes, videz le cache navigateur admin, vérifiez les permissions du compte service et ouvrez un ticket support si nécessaire.",
    },
  ].slice(0, 5);
}

export function getLessonContent(
  course: Course,
  module: Module,
  lesson: Lesson,
  globalIndex: number,
  totalLessons: number
): LessonContent {
  if (course.slug === "jamf-fundamentals") {
    const jfContent = getJamfFundamentalsLessonContent(course.slug, lesson.slug);
    if (jfContent) return jfContent;
  }

  const proContent = getProModuleLessonContent(lesson.slug);
  if (proContent) return proContent;

  const advancedContent = getAdvancedLessonContent(lesson.slug);
  if (advancedContent) return advancedContent;

  const altMdmContent = getAltMdmLessonContent(lesson.slug);
  if (altMdmContent) return altMdmContent;

  if (course.slug === "intune-mac" && lesson.slug === "abm-intune") {
    return getAbmIntuneFallbackContent();
  }

  if (course.slug === "intune-mac") {
    const intuneEnriched = buildIntuneLearnLessonContent(lesson.title, lesson.slug, {
      finalQuizSlug: getQuizzesByTrack(course.trackSlug)[0]?.slug,
    });
    if (intuneEnriched) {
      return {
        ...intuneEnriched,
        screenshots: generateScreenshots(course, lesson, topicContext(course, module, lesson)),
      };
    }
  }

  const ctx = topicContext(course, module, lesson);
  const topic = getLessonTopic(ctx, lesson);
  const trackQuizzes = getQuizzesByTrack(course.trackSlug);
  const isLastLesson = globalIndex === totalLessons - 1;

  return {
    objectives: generateObjectives(ctx, topic),
    prerequisites: generatePrerequisites(globalIndex, course, ctx),
    theory: generateTheory(ctx, topic),
    steps: generateSteps(ctx, topic),
    screenshots: generateScreenshots(course, lesson, ctx),
    bestPractices: generateBestPractices(ctx, topic),
    troubleshooting: generateTroubleshooting(ctx, topic),
    finalQuizSlug: isLastLesson ? trackQuizzes[0]?.slug : trackQuizzes[0]?.slug,
  };
}
