import type { LessonContent } from "@/lib/types";
import { proModules, type ProModule } from "@/lib/data/pro-modules/index";
import { getScreenshotsForLesson } from "@/lib/data/lesson-screenshots";

function findModuleForLesson(lessonSlug: string): ProModule | undefined {
  return proModules.find((m) => m.lessons.some((l) => l.slug === lessonSlug));
}

function buildContent(proModule: ProModule, lessonTitle: string, lessonSlug: string): LessonContent {
  const domain = proModule.number <= 11 ? "Microsoft Intune" : proModule.number >= 18 ? "Apple Security" : "Jamf Pro";

  return {
    objectives: [
      `Maîtriser « ${lessonTitle} » dans le module ${proModule.number} — ${proModule.title}.`,
      `Appliquer les procédures ${domain} en environnement enterprise.`,
      `Préparer le quiz « ${proModule.quizSlug} » et le lab « ${proModule.labSlug} ».`,
      `Obtenir le badge ${proModule.badgeName} après validation (score ≥ 80 %).`,
    ],
    prerequisites: [
      proModule.number > 11 ? `Avoir complété le module ${proModule.number - 1} ou posséder l'expérience équivalente.` : "Compte Intune Administrator et accès Apple Business Manager.",
      "Environnement de lab ou tenant de test disponible.",
      "Connexion internet stable.",
    ],
    theory: [
      {
        title: "Contexte",
        body: [
          `${lessonTitle} fait partie du parcours professionnel Jamf & Apple Enterprise (module ${proModule.number}/18).`,
          `${proModule.description}`,
          `Cette leçon s'appuie sur les bonnes pratiques ${domain} documentées par Apple Platform Deployment Guide et les ressources officielles Jamf.`,
        ],
      },
      {
        title: "Concepts clés",
        body: proModule.lessons.map((l) => `• ${l.title} — composante essentielle du module.`).slice(0, 4),
      },
      {
        title: "Intégration LMS",
        body: [
          "Progression enregistrée via Supabase (leçons, quiz, labs).",
          `Quiz associé : ${proModule.quizSlug} · Lab : ${proModule.labSlug} · Badge : ${proModule.badgeName}.`,
          "Certificat disponible après complétion du parcours certification correspondant.",
        ],
      },
    ],
    steps: [
      { title: "Préparer", description: `Vérifiez les accès admin ${domain} et consultez les prérequis du module ${proModule.number}.` },
      { title: "Étudier", description: `Lisez la théorie et prenez des notes sur ${lessonTitle}.` },
      { title: "Pratiquer", description: `Reproduisez les scénarios dans votre tenant de lab.` },
      { title: "Lab", description: `Complétez le lab « ${proModule.labSlug} » avec validation étape par étape.` },
      { title: "Quiz", description: `Passez le quiz ${proModule.quizSlug} (seuil 80 %) pour débloquer le badge.` },
    ],
    screenshots: getScreenshotsForLesson(lessonSlug.replace(/^m\d+-/, "").replace(/^m\d\d-/, ""), {
      courseSlug: "parcours-professionnel",
      lesson: { slug: lessonSlug, title: lessonTitle, duration: "30 min" },
      domain,
    }),
    bestPractices: [
      "Documentez chaque configuration dans un runbook interne.",
      "Testez sur un groupe pilote avant déploiement global.",
      "Maintenez un calendrier de renouvellement certificats et tokens.",
      `Alignez les décisions avec le parcours certification (modules ${proModule.number}).`,
    ],
    troubleshooting: [
      {
        problem: "Le profil ou la policy ne s'applique pas.",
        solution: "Vérifiez le scope, le check-in MDM, le certificat APNs et les conflits de profils.",
      },
      {
        problem: "Erreur de synchronisation ABM/ADE.",
        solution: "Renouvelez le token serveur, forcez une sync et vérifiez l'assignation des appareils.",
      },
      {
        problem: "Quiz ou badge non débloqué.",
        solution: "Assurez-vous d'être connecté, d'avoir score ≥ 80 % et d'avoir complété le lab associé.",
      },
    ],
    finalQuizSlug: proModule.quizSlug,
  };
}

export function isProModuleLesson(lessonSlug: string): boolean {
  return proModules.some((m) => m.lessons.some((l) => l.slug === lessonSlug));
}

export function getProModuleLessonContent(lessonSlug: string): LessonContent | null {
  const proModule = findModuleForLesson(lessonSlug);
  if (!proModule) return null;
  const lesson = proModule.lessons.find((l) => l.slug === lessonSlug);
  if (!lesson) return null;
  return buildContent(proModule, lesson.title, lessonSlug);
}

export function getProModuleForLesson(lessonSlug: string): ProModule | undefined {
  return findModuleForLesson(lessonSlug);
}
