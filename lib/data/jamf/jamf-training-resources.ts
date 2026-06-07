import type { AcademyResource } from "@/src/lib/resources";
import type { JamfTrainingTopicId } from "@/lib/data/jamf/jamf-training-registry";
import { JAMF_TRAINING_CONTENT } from "@/lib/data/jamf/jamf-training-content";
import { JAMF_TRAINING_TOPICS } from "@/lib/data/jamf/jamf-training-registry";

function buildResource(
  topicId: JamfTrainingTopicId,
  level: "Fondamental" | "Intermédiaire" | "Avancé"
): AcademyResource {
  const topic = JAMF_TRAINING_TOPICS.find((t) => t.id === topicId)!;
  const content = JAMF_TRAINING_CONTENT[topicId];
  return {
    slug: topic.resourceSlug,
    title: `Guide Jamf Pro 11.16 — ${topic.title}`,
    description: `Procédure PDF ${topic.title} alignée Jamf Pro ${topic.jamfDocRef}. Référence pédagogique Jamf Training — contenu original Apple MDM Academy.`,
    objective: content.enterpriseScenario,
    category: "procedure",
    level,
    badge: "Jamf",
    module: topic.title,
    relatedCourseSlug: topic.courseSlug,
    relatedLabSlug: topic.labSlug,
    relatedVideoSlug: topic.videoSlug,
    sections: [
      {
        title: "Résumé pédagogique",
        items: content.frenchSummary,
      },
      {
        title: "Scénario entreprise",
        items: [content.enterpriseScenario],
      },
      {
        title: "Étapes lab recommandées",
        items: content.labOutline,
      },
      {
        title: "Référence officielle",
        items: [
          topic.jamfDocRef,
          `Chaîne référence : Jamf Training & Support (sans intégration YouTube)`,
          `Vidéo source identifiée : ${topic.sourceVideoTitle}`,
        ],
      },
      {
        title: "Contrôles certification",
        items: [
          `Priorité : ${topic.priority}`,
          `Quiz associé : ${topic.quizSlug}`,
          `Examen blanc : /examens/jamf-100 ou /examens/jamf-200 selon parcours`,
        ],
      },
    ],
  };
}

export const jamfTrainingResources: AcademyResource[] = [
  buildResource("smart-groups", "Fondamental"),
  buildResource("policies", "Fondamental"),
  buildResource("configuration-profiles", "Fondamental"),
  buildResource("self-service", "Fondamental"),
  buildResource("packages", "Intermédiaire"),
  buildResource("inventory", "Fondamental"),
  buildResource("enrollment", "Fondamental"),
  buildResource("scripts", "Avancé"),
  buildResource("patch-management", "Avancé"),
];

export function getJamfTrainingResource(slug: string): AcademyResource | undefined {
  return jamfTrainingResources.find((r) => r.slug === slug);
}
