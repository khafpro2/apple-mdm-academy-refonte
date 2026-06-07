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

export const illustratedVideoStoryboards: VideoStoryboard[] = [
  ...productionVideoStoryboards,
  ...missingTranscriptStoryboards,
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
