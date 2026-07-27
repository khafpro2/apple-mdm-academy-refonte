import {
  buildNarrationFromScenes,
  collectAllScreenshots,
  defaultHeygenMeta,
  estimateDurationSeconds,
  formatDuration,
  type VideoScene,
  type VideoStoryboard,
} from "@/src/lib/video-lessons";
import { productionVideoStoryboards } from "@/src/lib/video-storyboard-modules";

/** Alias slug legacy → storyboard production */
const SLUG_ALIASES: Record<string, string> = {
  "automated-device-enrollment": "ade-iphone",
  "ios-ipados-profiles": "ios-ipados-profiles",
  gatekeeper: "gatekeeper-xprotect-sip",
  xprotect: "gatekeeper-xprotect-sip",
};

function buildTranscriptStoryboard(input: {
  slug: string;
  title: string;
  module: string;
  objective: string;
  courseSlug: string;
  labSlug: string;
  quizSlug: string;
  scenes: VideoScene[];
}): VideoStoryboard {
  const durationSeconds = estimateDurationSeconds(input.scenes);
  return {
    slug: input.slug,
    title: input.title,
    module: input.module,
    duration: formatDuration(durationSeconds),
    durationSeconds,
    level: "Intermédiaire",
    objective: input.objective,
    visualType: "process",
    scenes: input.scenes,
    narration: buildNarrationFromScenes(input.scenes),
    courseSlug: input.courseSlug,
    labSlug: input.labSlug,
    quizSlug: input.quizSlug,
    allScreenshots: collectAllScreenshots(input.scenes),
    status: "screenshots-missing",
    heygen: defaultHeygenMeta(),
  };
}

const missingTranscriptStoryboards: VideoStoryboard[] = [
  buildTranscriptStoryboard({
    slug: "enrollment-program-token",
    title: "Importer l'Enrollment Program Token",
    module: "Automated Device Enrollment",
    objective: "Comprendre le rôle du token ADE entre Apple Business Manager et Microsoft Intune.",
    courseSlug: "intune-mac",
    labSlug: "enrollment-program-token",
    quizSlug: "quiz-intune-mac",
    scenes: [
      {
        id: "ept-context",
        title: "Pourquoi le token existe",
        durationSeconds: 34,
        narration:
          "L'Enrollment Program Token relie Apple Business Manager à Microsoft Intune pour synchroniser les appareils affectés à votre serveur MDM. Sans ce token, Intune ne peut pas recevoir la liste des Mac, iPhone ou iPad prêts pour Automated Device Enrollment.",
        visual: "Schéma Apple Business Manager vers Intune avec flux token",
        animation: "Apparition progressive ABM, token, Intune",
        visualType: "architecture",
        requiredScreenshots: ["abm-mdm-servers", "intune-enrollment-program-tokens"],
        onScreenText: ["ABM", "Enrollment Program Token", "Intune"],
      },
      {
        id: "ept-download",
        title: "Télécharger le token dans ABM",
        durationSeconds: 36,
        narration:
          "Dans Apple Business Manager, ouvrez les réglages MDM, sélectionnez le serveur associé à Intune, puis téléchargez le token serveur. Ce fichier représente la confiance entre ABM et Intune; il doit rester protégé et renouvelé avant expiration.",
        visual: "Capture cible ABM MDM Servers",
        animation: "Zoom sur bouton de téléchargement du token",
        visualType: "screenshot",
        requiredScreenshots: ["abm-mdm-servers"],
        onScreenText: ["Télécharger le token", "Protéger le fichier", "Surveiller l'expiration"],
      },
      {
        id: "ept-upload",
        title: "Importer dans Intune",
        durationSeconds: 38,
        narration:
          "Dans Intune, ouvrez Apple enrollment puis Enrollment Program Tokens. Importez le fichier téléchargé depuis ABM, renseignez l'Apple ID utilisé pour le renouvellement, puis enregistrez. Intune peut ensuite synchroniser les appareils assignés au serveur MDM.",
        visual: "Capture cible Intune Enrollment Program Tokens",
        animation: "Zoom Screen Studio sur formulaire d'import",
        visualType: "screenshot",
        requiredScreenshots: ["intune-apple-enrollment", "intune-enrollment-program-tokens"],
        onScreenText: ["Importer le token", "Apple ID de renouvellement", "Synchroniser"],
      },
      {
        id: "ept-sync",
        title: "Synchronisation et assignation",
        durationSeconds: 34,
        narration:
          "Après l'import, lancez une synchronisation. Les appareils apparaissent dans Intune si leur assignation ABM pointe vers le bon serveur MDM. En cas d'absence, vérifiez l'assignation côté ABM, la date de validité du token et les journaux d'enrollment.",
        visual: "Liste d'appareils synchronisés dans Intune",
        animation: "Checklist de dépannage",
        visualType: "checklist",
        requiredScreenshots: ["abm-devices", "intune-devices"],
        onScreenText: ["Assignation ABM", "Token valide", "Sync Intune"],
        checklistItems: [
          "Vérifier le serveur MDM assigné dans ABM",
          "Contrôler l'expiration du token",
          "Relancer la synchronisation Intune",
        ],
      },
      {
        id: "ept-recap",
        title: "Récapitulatif opérationnel",
        durationSeconds: 28,
        narration:
          "Le token n'inscrit pas directement les appareils; il autorise Intune à connaître les appareils Apple affectés à votre organisation. Le bon réflexe admin est de documenter l'Apple ID de renouvellement, surveiller l'expiration et tester la synchronisation après chaque changement ABM.",
        visual: "Slide récapitulatif token ADE",
        animation: "Trois points clés en apparition",
        visualType: "recap",
        requiredScreenshots: [],
        onScreenText: ["Documenter", "Renouveler", "Tester la synchronisation"],
      },
    ],
  }),
  buildTranscriptStoryboard({
    slug: "defender-macos",
    title: "Microsoft Defender pour macOS",
    module: "Sécurité macOS avec Intune",
    objective: "Comprendre le déploiement de Microsoft Defender for Endpoint sur macOS avec Intune.",
    courseSlug: "intune-mac",
    labSlug: "defender-macos-intune",
    quizSlug: "quiz-intune-mac",
    scenes: [
      {
        id: "defender-role",
        title: "Rôle de Defender sur macOS",
        durationSeconds: 34,
        narration:
          "Microsoft Defender for Endpoint complète la gestion MDM macOS en apportant protection, détection et remontée de signaux sécurité. Pour un administrateur Apple, l'objectif n'est pas seulement d'installer une app, mais de vérifier onboarding, permissions système et reporting.",
        visual: "Architecture macOS, Intune, Defender portal",
        animation: "Flux macOS vers Microsoft Defender",
        visualType: "architecture",
        requiredScreenshots: ["intune-devices", "macos-privacy-security"],
        onScreenText: ["Protection", "Onboarding", "Reporting"],
      },
      {
        id: "defender-prereqs",
        title: "Préparer les prérequis",
        durationSeconds: 36,
        narration:
          "Avant le déploiement, préparez les profils nécessaires: extensions système, notifications, accès disque complet et préférences de confidentialité. Sur macOS, ces autorisations conditionnent le bon fonctionnement de Defender et évitent une installation silencieusement incomplète.",
        visual: "Checklist profils macOS requis",
        animation: "Cases cochées successivement",
        visualType: "checklist",
        requiredScreenshots: ["intune-configuration-profiles", "macos-profiles"],
        onScreenText: ["System Extensions", "Full Disk Access", "Notifications"],
        checklistItems: [
          "Déployer les profils de confidentialité",
          "Autoriser les extensions système Microsoft",
          "Tester sur un groupe pilote macOS",
        ],
      },
      {
        id: "defender-deploy",
        title: "Déployer l'application",
        durationSeconds: 34,
        narration:
          "Dans Intune, déployez Microsoft Defender sur un groupe macOS ciblé. Utilisez un groupe pilote avant l'affectation large, surveillez l'état d'installation, puis confirmez que l'app est présente et que le service démarre correctement sur le Mac.",
        visual: "Affectation Intune vers groupe macOS pilote",
        animation: "Zoom sur affectation groupe",
        visualType: "process",
        requiredScreenshots: ["intune-devices", "intune-configuration-profiles"],
        onScreenText: ["Groupe pilote", "Installation", "Service actif"],
      },
      {
        id: "defender-onboarding",
        title: "Valider l'onboarding",
        durationSeconds: 38,
        narration:
          "L'installation ne suffit pas. Le Mac doit être onboardé dans Microsoft Defender for Endpoint. Vérifiez le statut dans les portails Microsoft, contrôlez les erreurs de profil et confirmez que l'appareil remonte bien ses signaux de sécurité.",
        visual: "Parcours de validation onboarding",
        animation: "Flèches de contrôle entre Intune et Defender",
        visualType: "checklist",
        requiredScreenshots: ["intune-compliance-policies", "intune-devices"],
        onScreenText: ["Onboarding", "Santé appareil", "Signal sécurité"],
        checklistItems: [
          "Confirmer le statut Defender",
          "Vérifier les profils macOS",
          "Contrôler les rapports d'appareil",
        ],
      },
      {
        id: "defender-recap",
        title: "Dépannage courant",
        durationSeconds: 30,
        narration:
          "Si Defender apparaît installé mais non opérationnel, cherchez d'abord les permissions macOS manquantes, une mauvaise affectation de groupe ou un onboarding absent. Le succès se mesure par trois éléments: application installée, autorisations actives et appareil visible dans le reporting.",
        visual: "Récapitulatif dépannage Defender macOS",
        animation: "Trois colonnes diagnostic",
        visualType: "recap",
        requiredScreenshots: [],
        onScreenText: ["Installé", "Autorisé", "Reporté"],
      },
    ],
  }),
  buildTranscriptStoryboard({
    slug: "conditional-access-apple",
    title: "Conditional Access pour appareils Apple",
    module: "Conformité et accès Microsoft",
    objective: "Comprendre comment Conditional Access protège les accès Microsoft 365 depuis les appareils Apple.",
    courseSlug: "intune-mac",
    labSlug: "intune-conditional-access-mac",
    quizSlug: "quiz-intune-mac",
    scenes: [
      {
        id: "ca-principle",
        title: "Principe d'accès conditionnel",
        durationSeconds: 34,
        narration:
          "Conditional Access décide si un utilisateur peut accéder à une ressource selon son identité, son appareil, son risque et sa conformité. Pour les appareils Apple, Intune fournit le signal de conformité que Microsoft Entra ID peut utiliser dans la décision d'accès.",
        visual: "Architecture Entra ID, Intune compliance, application cloud",
        animation: "Flux décisionnel identité appareil application",
        visualType: "architecture",
        requiredScreenshots: ["intune-compliance-policies", "intune-devices"],
        onScreenText: ["Identité", "Appareil conforme", "Accès cloud"],
      },
      {
        id: "ca-compliance",
        title: "Préparer la conformité",
        durationSeconds: 36,
        narration:
          "Avant de créer une règle, définissez ce que signifie conforme pour macOS, iOS ou iPadOS. Chiffrement, version minimale, mot de passe et état de menace peuvent devenir des critères. Sans stratégie de conformité fiable, l'accès conditionnel manque de signal exploitable.",
        visual: "Capture stratégie de conformité Intune",
        animation: "Mise en évidence des critères conformité",
        visualType: "screenshot",
        requiredScreenshots: ["intune-compliance-policies", "macos-filevault"],
        onScreenText: ["Version minimale", "Chiffrement", "Mot de passe", "Risque"],
      },
      {
        id: "ca-policy",
        title: "Créer une règle ciblée",
        durationSeconds: 38,
        narration:
          "Créez une règle Conditional Access ciblée sur un groupe pilote. Choisissez les applications cloud, les plateformes Apple concernées et l'exigence d'appareil conforme. Commencez en mode report-only pour observer l'impact avant de bloquer réellement les accès.",
        visual: "Processus règle report-only puis enforcement",
        animation: "Étapes report-only, analyse, activation",
        visualType: "process",
        requiredScreenshots: ["intune-compliance-policies", "intune-devices"],
        onScreenText: ["Groupe pilote", "Report-only", "Require compliant device"],
      },
      {
        id: "ca-test",
        title: "Tester et dépanner",
        durationSeconds: 36,
        narration:
          "Testez avec un appareil conforme et un appareil non conforme. Si le résultat surprend, vérifiez l'appartenance au groupe, la plateforme détectée, l'état de conformité Intune et les journaux de connexion Entra ID. Les logs expliquent quelle condition a été appliquée.",
        visual: "Checklist de dépannage Conditional Access",
        animation: "Déroulé sign-in logs vers cause racine",
        visualType: "checklist",
        requiredScreenshots: ["intune-devices", "intune-compliance-policies"],
        onScreenText: ["Groupes", "Plateforme", "Conformité", "Sign-in logs"],
        checklistItems: [
          "Comparer appareil conforme et non conforme",
          "Lire les journaux de connexion Entra ID",
          "Vérifier les exclusions de comptes d'urgence",
        ],
      },
      {
        id: "ca-recap",
        title: "Bonnes pratiques Apple Admin",
        durationSeconds: 30,
        narration:
          "Une règle efficace reste progressive: pilote, report-only, analyse, puis enforcement. Pour les environnements Apple, gardez au moins un compte d'urgence exclu, documentez les critères de conformité et surveillez l'expérience utilisateur après activation.",
        visual: "Récapitulatif des bonnes pratiques",
        animation: "Timeline de déploiement progressif",
        visualType: "recap",
        requiredScreenshots: [],
        onScreenText: ["Piloter", "Observer", "Activer", "Surveiller"],
      },
    ],
  }),
];

/**
 * Pilotes de la relance vidéo (docs/motion-design/pilots/*.md) — storyboard écrit,
 * aucune capture/narration enregistrée/montage. Statut "screenshots-missing" reflète
 * l'état réel : le storyboard existe, aucun asset physique n'est encore produit.
 */
const pilotVideoStoryboards: VideoStoryboard[] = [
  buildTranscriptStoryboard({
    slug: "abm-ade-enrollment",
    title: "Comprendre Apple Business Manager et Automated Device Enrollment",
    module: "Apple Business Manager",
    objective:
      "Expliquer comment un appareil est affecté depuis Apple Business Manager à un serveur MDM, puis activé automatiquement via Automated Device Enrollment.",
    courseSlug: "apple-it-professional",
    labSlug: "abm-intune",
    quizSlug: "quiz-abm-certification",
    scenes: [
      {
        id: "abm-ade-s1-problem",
        title: "Le problème",
        durationSeconds: 8,
        narration:
          "Imaginez cinq cents Mac qui arrivent demain. Les configurer un par un ralentit l'entreprise et multiplie les erreurs. Automated Device Enrollment existe pour supprimer cette étape manuelle.",
        visual: "Technicien + pile de Mac, étapes manuelles en fondu, entreprise en attente",
        animation: "Entrée pile de Mac à gauche, étapes manuelles en fondu successif",
        visualType: "avatar",
        requiredScreenshots: [],
        onScreenText: ["Comment préparer 500 Mac sans les configurer manuellement ?"],
      },
      {
        id: "abm-ade-s2-definition",
        title: "La définition",
        durationSeconds: 10,
        narration:
          "Automated Device Enrollment rattache automatiquement l'appareil à l'organisation, l'attribue à un serveur MDM, et lance l'inscription pendant l'assistant de configuration.",
        visual: "Trois cartes d'information",
        animation: "Apparition séquentielle gauche vers droite",
        visualType: "diagram",
        requiredScreenshots: [],
        onScreenText: ["Rattachement automatique", "Attribution MDM", "Inscription pendant Setup Assistant"],
      },
      {
        id: "abm-ade-s3-components",
        title: "Les composants",
        durationSeconds: 12,
        narration:
          "Le flux relie le canal d'achat, Apple Business Manager, le serveur MDM — Jamf Pro ou Microsoft Intune — les appareils Apple, et enfin l'utilisateur.",
        visual: "Diagramme horizontal des acteurs (scene-003-abm-ade-enrollment-flow)",
        animation: "Apparition séquentielle des nœuds, connecteurs allumés progressivement",
        visualType: "architecture",
        requiredScreenshots: [],
        onScreenText: ["Revendeur", "Apple Business Manager", "Jamf Pro / Intune", "Appareils", "Utilisateur"],
      },
      {
        id: "abm-ade-s4-abm-assignment",
        title: "Attribution dans Apple Business Manager",
        durationSeconds: 12,
        narration:
          "Dans Apple Business Manager, l'appareil apparaît dans l'inventaire. L'administrateur le sélectionne, l'attribue au serveur MDM, et l'état passe à attribué.",
        visual: "Capture Screen Studio réelle : ABM → Inventaire → Attribution MDM",
        animation: "4 étapes séquentielles",
        visualType: "screenshot",
        requiredScreenshots: ["abm-01", "abm-02"],
        onScreenText: ["1. Apparaît dans l'inventaire", "2. Sélection", "3. Attribution MDM", "4. Attribué"],
      },
      {
        id: "abm-ade-s5-first-boot",
        title: "Premier démarrage",
        durationSeconds: 15,
        narration:
          "Au premier démarrage, le Mac contacte les services d'activation Apple. Apple identifie l'organisation, renvoie les informations du serveur MDM, et l'inscription commence.",
        visual: "Capture Screen Studio réelle : Setup Assistant, écran de supervision",
        animation: "Séquence de démarrage",
        visualType: "screenshot",
        requiredScreenshots: ["ade-01", "ade-02"],
        onScreenText: ["Allumage", "Activation", "Identification org.", "Redirection MDM"],
      },
      {
        id: "abm-ade-s6-auto-config",
        title: "Configuration automatique",
        durationSeconds: 15,
        narration:
          "Une fois inscrit, le MDM déploie progressivement le Wi-Fi, les certificats, FileVault, les applications, les restrictions, la configuration de compte et les politiques de sécurité. Depuis macOS 14, le MDM peut même imposer l'activation de FileVault dès l'inscription ADE.",
        visual: "Cascade de cartes de configuration",
        animation: "Apparition en cascade, dernière carte FileVault mise en avant avec badge « macOS 14+ »",
        visualType: "process",
        requiredScreenshots: [],
        onScreenText: ["Wi-Fi", "Certificats", "FileVault (macOS 14+)", "Applications", "Restrictions", "Politiques"],
      },
      {
        id: "abm-ade-s7-best-practice",
        title: "Bonne pratique",
        durationSeconds: 12,
        narration:
          "L'inscription manuelle dépend du technicien, risque l'oubli et produit des configurations incohérentes. Automated Device Enrollment est automatique, reproductible, supervisé, et adapté au déploiement à grande échelle.",
        visual: "Comparaison deux colonnes",
        animation: "Mise en évidence progressive",
        visualType: "comparison",
        requiredScreenshots: [],
        onScreenText: ["Manuel", "Automated Device Enrollment"],
        comparison: { left: "Inscription manuelle", right: "Automated Device Enrollment" },
      },
      {
        id: "abm-ade-s8-recap",
        title: "Résumé",
        durationSeconds: 10,
        narration:
          "Achat, Apple Business Manager, attribution MDM, activation, inscription, configuration, utilisateur. Quel élément relie l'appareil à l'organisation avant même son premier démarrage ?",
        visual: "Flux récapitulatif complet",
        animation: "Ligne du temps complète",
        visualType: "recap",
        requiredScreenshots: [],
        onScreenText: ["Achat → ABM → Attribution → Activation → Inscription → Configuration → Utilisateur"],
      },
    ],
  }),
  buildTranscriptStoryboard({
    slug: "intune-apns-enrollment",
    title: "Microsoft Intune, le certificat APNs et l'inscription des appareils Apple",
    module: "APNs",
    objective:
      "Expliquer le rôle du certificat APNs entre Microsoft Intune et les appareils Apple, et la règle de renouvellement avec le même identifiant Apple.",
    courseSlug: "intune-mac",
    labSlug: "apns",
    quizSlug: "quiz-abm-certification",
    scenes: [
      {
        id: "intune-apns-b1-problem",
        title: "Le problème",
        durationSeconds: 12,
        narration: "Comment Intune gère-t-il des appareils Apple qu'il ne contrôle pas nativement ?",
        visual: "Administrateur + icône Intune + icône Apple",
        animation: "Point d'interrogation entre les deux icônes",
        visualType: "avatar",
        requiredScreenshots: [],
        onScreenText: ["Comment gérer un Mac depuis Intune ?"],
      },
      {
        id: "intune-apns-b2-role",
        title: "Le rôle d'APNs",
        durationSeconds: 15,
        narration:
          "APNs est un prérequis Apple pour tout MDM, pas une spécificité Intune : sans certificat APNs, aucun serveur MDM ne peut gérer un appareil Apple.",
        visual: "Schéma administrateur → Intune → certificat APNs → service push Apple → appareil",
        animation: "Flux séquentiel gauche vers droite",
        visualType: "architecture",
        requiredScreenshots: [],
        onScreenText: ["APNs : prérequis Apple pour tout MDM"],
      },
      {
        id: "intune-apns-b3-certificate",
        title: "Création du certificat",
        durationSeconds: 20,
        narration:
          "Le certificat se crée depuis le centre d'administration Intune, puis via l'Apple Push Certificates Portal, avec un identifiant Apple dédié — idéalement partagé, pas personnel.",
        visual: "Capture Screen Studio réelle : Intune admin center → Apple Push Certificates Portal",
        animation: "Zoom sur les boutons de création",
        visualType: "screenshot",
        requiredScreenshots: ["int-01", "int-02"],
        onScreenText: ["Identifiant Apple dédié recommandé"],
      },
      {
        id: "intune-apns-b4-flow",
        title: "Le flux de notification",
        durationSeconds: 20,
        narration:
          "La notification APNs ne transporte pas la commande de gestion : elle indique à l'appareil de se connecter directement à Intune, qui lui transmet alors les commandes en HTTPS.",
        visual: "Animation flux : notification silencieuse puis connexion directe",
        animation: "Deux flèches distinctes : notification puis connexion HTTPS",
        visualType: "diagram",
        requiredScreenshots: [],
        onScreenText: ["Notification silencieuse", "Connexion directe HTTPS"],
      },
      {
        id: "intune-apns-b5-renewal",
        title: "Le renouvellement",
        durationSeconds: 20,
        narration:
          "Le certificat se renouvelle chaque année avec le même identifiant Apple. Créer un nouveau certificat au lieu de le renouveler force la ré-inscription de tous les appareils.",
        visual: "Badge certificat expirant + rappel identifiant Apple",
        animation: "Mise en évidence de la date d'expiration",
        visualType: "screenshot",
        requiredScreenshots: ["int-03"],
        onScreenText: ["Même identifiant Apple à chaque renouvellement"],
      },
      {
        id: "intune-apns-b6-recap",
        title: "Résumé",
        durationSeconds: 15,
        narration:
          "Apple Business Manager affecte l'appareil, le certificat APNs autorise le dialogue avec Apple, et Intune gère l'appareil au quotidien.",
        visual: "Flux complet récapitulatif",
        animation: "Ligne du temps complète",
        visualType: "recap",
        requiredScreenshots: [],
        onScreenText: ["ABM assigne", "APNs autorise", "Intune gère"],
      },
    ],
  }),
  buildTranscriptStoryboard({
    slug: "jamf-smart-groups-filevault-escrow",
    title: "Smart Groups et séquestre des clés FileVault dans Jamf Pro",
    module: "Jamf Smart Groups",
    objective:
      "Expliquer comment un Smart Group cible les Mac non conformes pour appliquer FileVault, jusqu'au séquestre de la clé de récupération et au contrôle de conformité.",
    courseSlug: "jamf-100",
    labSlug: "jamf-smart-groups",
    quizSlug: "quiz-jamf-100",
    scenes: [
      {
        id: "jamf-sg-fv-p01-hook",
        title: "Accroche",
        durationSeconds: 15,
        narration: "Comment cibler les bons Mac et vérifier l'escrow FileVault sans exposer de secret ?",
        visual: "Titre + logos Smart Groups / FileVault",
        animation: "Fade-in titre",
        visualType: "avatar",
        requiredScreenshots: [],
        onScreenText: ["Smart Groups", "FileVault escrow", "Lab uniquement"],
      },
      {
        id: "jamf-sg-fv-p02-context",
        title: "Cadrer Jamf Pro et l'inventaire",
        durationSeconds: 30,
        narration:
          "Le flux relie l'inventaire Jamf Pro, les groupes dynamiques et les critères qui déterminent leur composition.",
        visual: "Capture Screen Studio réelle : connexion, liste des ordinateurs, Smart Computer Groups",
        animation: "Zoom navigation",
        visualType: "screenshot",
        requiredScreenshots: ["sg-01", "sg-02", "sg-03"],
        onScreenText: ["Inventaire", "Critères", "Membership dynamique"],
      },
      {
        id: "jamf-sg-fv-p03-create-group",
        title: "Créer un Smart Group de laboratoire",
        durationSeconds: 165,
        narration:
          "Créer un Smart Group : nom clair, critère stable, opérateur compréhensible, valeur de démonstration, preview obligatoire avant enregistrement.",
        visual: "Capture Screen Studio réelle : création complète du Smart Group",
        animation: "Zoom sur chaque champ du formulaire",
        visualType: "screenshot",
        requiredScreenshots: ["sg-04", "sg-05", "sg-06", "sg-07", "sg-08", "sg-09", "sg-10"],
        onScreenText: ["Nom clair", "Critère stable", "Preview obligatoire"],
      },
      {
        id: "jamf-sg-fv-p04-membership",
        title: "Membership dynamique",
        durationSeconds: 60,
        narration: "Le Smart Group liste ses membres et se met à jour automatiquement selon l'inventaire.",
        visual: "Capture Screen Studio réelle : liste des membres, mise à jour dynamique",
        animation: "Mise en évidence du changement de membership",
        visualType: "screenshot",
        requiredScreenshots: ["sg-11", "sg-12"],
        onScreenText: ["Membership", "Inventaire", "Mise à jour"],
      },
      {
        id: "jamf-sg-fv-p05-transition",
        title: "Transition vers FileVault",
        durationSeconds: 45,
        narration:
          "FileVault chiffre le volume macOS. Jamf Pro ne chiffre pas à sa place : il configure la politique, collecte l'état, et gère l'escrow de la clé selon la configuration.",
        visual: "Illustration motion design abstraite (scene-005-jamf-smart-groups-filevault-escrow-flow) — aucune capture",
        animation: "Transition motion design pure, aucune clé visible",
        visualType: "diagram",
        requiredScreenshots: ["fv-03"],
        onScreenText: ["FileVault chiffre", "Jamf gère la configuration", "Escrow de clé"],
      },
      {
        id: "jamf-sg-fv-p06-configuration",
        title: "Configuration FileVault et inventaire",
        durationSeconds: 165,
        narration:
          "La politique FileVault se configure via un profil : Jamf Pro chiffre la clé de récupération personnelle avec un certificat avant de la recevoir, puis affiche l'état du chiffrement et la confirmation d'escrow.",
        visual: "Capture Screen Studio réelle : profil FileVault, inventaire, état du chiffrement",
        animation: "Zoom état chiffrement et statut clé",
        visualType: "screenshot",
        requiredScreenshots: ["fv-01", "fv-02", "fv-04", "fv-05", "fv-06", "fv-07"],
        onScreenText: ["Configuration", "État du chiffrement", "Escrow confirmé"],
      },
      {
        id: "jamf-sg-fv-p07-compliance",
        title: "Escrow et conformité",
        durationSeconds: 90,
        narration:
          "Un second Smart Group cible les Mac selon leur état de conformité FileVault, pour piloter la remédiation.",
        visual: "Capture Screen Studio réelle : Smart Group de conformité, résultat conforme/non conforme",
        animation: "Mise en évidence du critère de conformité",
        visualType: "screenshot",
        requiredScreenshots: ["fv-08", "fv-09"],
        onScreenText: ["Conformité", "Remédiation", "Pilotage"],
      },
      {
        id: "jamf-sg-fv-p08-recap",
        title: "Résumé",
        durationSeconds: 30,
        narration:
          "Smart Groups ciblent, FileVault chiffre, Jamf Pro gère la configuration et l'escrow selon les prérequis.",
        visual: "Checklist finale",
        animation: "Fade-out",
        visualType: "recap",
        requiredScreenshots: [],
        onScreenText: ["Ciblage", "Chiffrement", "Escrow", "Sécurité"],
      },
    ],
  }),
];

export const illustratedVideoStoryboards: VideoStoryboard[] = [
  ...productionVideoStoryboards,
  ...missingTranscriptStoryboards,
  ...pilotVideoStoryboards,
];

export function getVideoStoryboard(slug: string): VideoStoryboard | undefined {
  const resolved = SLUG_ALIASES[slug] ?? slug;
  return illustratedVideoStoryboards.find((s) => s.slug === resolved);
}

export function getAllIllustratedVideoSlugs(): string[] {
  return illustratedVideoStoryboards.map((s) => s.slug);
}

export function getIllustratedVideoLessons(): VideoStoryboard[] {
  return illustratedVideoStoryboards;
}

export function getRecommendedVideoLessons(limit = 4): VideoStoryboard[] {
  return illustratedVideoStoryboards.slice(0, limit);
}

export function getVideosForCourse(courseSlug: string): VideoStoryboard[] {
  return illustratedVideoStoryboards.filter((s) => s.courseSlug === courseSlug);
}

export {
  exportStoryboardMarkdown,
  exportStoryboardToMarkdown,
} from "@/src/lib/video-lessons";
