import type { Course, Lesson, LessonContent, Module } from "@/lib/types";
import { getQuizzesByTrack } from "@/lib/data/quizzes";
import { getTrack } from "@/lib/data/tracks";
import {
  abmIntuneBestPractices,
  abmIntuneObjectives,
  abmIntunePrerequisites,
  abmIntuneSteps,
  abmIntuneTheory,
  abmIntuneTroubleshooting,
} from "@/lib/data/lessons/abm-intune-content";

function getAbmIntuneFallbackContent(): LessonContent {
  return {
    objectives: abmIntuneObjectives,
    prerequisites: abmIntunePrerequisites,
    theory: abmIntuneTheory,
    steps: abmIntuneSteps.map((s) => ({ title: s.title, description: s.steps.join(" ") })),
    screenshots: [],
    bestPractices: abmIntuneBestPractices,
    troubleshooting: abmIntuneTroubleshooting,
  };
}

const SCREENSHOT_GRADIENTS = [
  "from-slate-100 via-slate-50 to-blue-50",
  "from-gray-100 via-white to-indigo-50",
  "from-zinc-100 via-slate-50 to-sky-50",
];

const SCREENSHOT_ICONS = ["🖥️", "⚙️", "📱", "🔐", "📊", "🛠️"];

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

function generateObjectives(ctx: ReturnType<typeof topicContext>): string[] {
  return [
    `Comprendre les concepts clés de « ${ctx.lessonTitle} » dans un contexte ${ctx.domain}.`,
    `Appliquer les procédures recommandées par Apple et ${ctx.domain} en environnement entreprise.`,
    `Identifier les erreurs courantes et les résoudre avec une méthode structurée.`,
    `Valider vos acquis via le quiz de fin de module ou de parcours.`,
  ];
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

function generateTheory(ctx: ReturnType<typeof topicContext>): LessonContent["theory"] {
  return [
    {
      title: "Vue d'ensemble",
      body: [
        `${ctx.lessonTitle} s'inscrit dans le module « ${ctx.moduleTitle} » du parcours ${ctx.courseTitle}. Cette leçon couvre les fondamentaux nécessaires aux administrateurs Apple en entreprise.`,
        `Dans un déploiement ${ctx.domain}, la maîtrise de ce sujet permet de réduire les tickets support, d'harmoniser les configurations et d'accélérer l'onboarding des appareils.`,
      ],
    },
    {
      title: "Concepts essentiels",
      body: [
        `Les appareils Apple (Mac, iPhone, iPad) partagent une pile de sécurité unifiée : Secure Enclave, activation des services système, et politiques de conformité pilotées par MDM.`,
        `Les payloads de configuration et les commandes distantes doivent respecter le principe du moindre privilège : une policy par objectif, un scope minimal, une traçabilité complète.`,
        `La documentation officielle Apple Platform Deployment Guide et les ressources ${ctx.domain} restent la référence pour valider chaque choix d'architecture.`,
      ],
    },
    {
      title: "Contexte entreprise",
      body: [
        "Planifiez toujours un groupe pilote avant un déploiement global. Documentez les versions OS cibles, les apps critiques et les contraintes réseau (proxy, TLS inspection, Wi‑Fi enterprise).",
        "Intégrez les équipes sécurité (SOC, IAM) dès la conception : conformité, journalisation et réponse aux incidents font partie du cycle de vie MDM.",
      ],
    },
  ];
}

function generateSteps(ctx: ReturnType<typeof topicContext>): LessonContent["steps"] {
  return [
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

function generateScreenshots(
  lesson: Lesson,
  ctx: ReturnType<typeof topicContext>
): LessonContent["screenshots"] {
  return [
    {
      caption: `Console ${ctx.domain} — vue principale`,
      alt: `Interface d'administration ${ctx.domain} pour ${lesson.title}`,
      gradient: SCREENSHOT_GRADIENTS[0],
      icon: SCREENSHOT_ICONS[0],
    },
    {
      caption: `Profil ou policy — ${ctx.lessonTitle}`,
      alt: `Configuration détaillée pour ${lesson.title}`,
      gradient: SCREENSHOT_GRADIENTS[1],
      icon: SCREENSHOT_ICONS[2],
    },
    {
      caption: "Rapport de conformité appareil",
      alt: "Statut de conformité et inventaire appareil",
      gradient: SCREENSHOT_GRADIENTS[2],
      icon: SCREENSHOT_ICONS[4],
    },
  ];
}

function generateBestPractices(ctx: ReturnType<typeof topicContext>): string[] {
  return [
    "Nommez clairement vos profils, policies et groupes (préfixe site + fonction + version).",
    "Testez chaque modification sur un lab isolé avant la production.",
    "Maintenez un calendrier de mise à jour OS aligné sur les release notes Apple.",
    "Sauvegardez les certificats push (APNs) et tokens d'enrollment avant expiration.",
    `Documentez les décisions d'architecture ${ctx.domain} pour faciliter les audits.`,
    "Communiquez les changements aux utilisateurs finaux avec une fenêtre de maintenance.",
  ];
}

function generateTroubleshooting(ctx: ReturnType<typeof topicContext>): LessonContent["troubleshooting"] {
  return [
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
  ];
}

export function getLessonContent(
  course: Course,
  module: Module,
  lesson: Lesson,
  globalIndex: number,
  totalLessons: number
): LessonContent {
  if (course.slug === "intune-mac" && lesson.slug === "abm-intune") {
    return getAbmIntuneFallbackContent();
  }

  const ctx = topicContext(course, module, lesson);
  const trackQuizzes = getQuizzesByTrack(course.trackSlug);
  const isLastLesson = globalIndex === totalLessons - 1;

  return {
    objectives: generateObjectives(ctx),
    prerequisites: generatePrerequisites(globalIndex, course, ctx),
    theory: generateTheory(ctx),
    steps: generateSteps(ctx),
    screenshots: generateScreenshots(lesson, ctx),
    bestPractices: generateBestPractices(ctx),
    troubleshooting: generateTroubleshooting(ctx),
    finalQuizSlug: isLastLesson ? trackQuizzes[0]?.slug : trackQuizzes[0]?.slug,
  };
}
