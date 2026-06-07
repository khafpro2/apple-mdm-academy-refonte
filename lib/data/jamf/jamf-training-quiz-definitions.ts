import type { Quiz } from "@/lib/types";
import type { JamfTrainingTopicId } from "@/lib/data/jamf/jamf-training-registry";
import { JAMF_TRAINING_TOPICS } from "@/lib/data/jamf/jamf-training-registry";
import { JAMF_TRAINING_TOPIC_QUIZZES } from "@/lib/data/jamf/jamf-training-quizzes";

/** Quiz déjà couverts par pro-modules/quizzes.ts */
const EXISTING_MODULE_QUIZ_SLUGS = new Set([
  "quiz-module-13-smart-groups",
  "quiz-module-14-policies",
  "quiz-module-15-scripts",
  "quiz-module-16-patch",
]);

/** Quiz standalone pour sujets Jamf Training */
export const jamfTrainingStandaloneQuizzes: Quiz[] = JAMF_TRAINING_TOPICS.filter(
  (t) => !EXISTING_MODULE_QUIZ_SLUGS.has(t.quizSlug)
).map((topic) => ({
  slug: topic.quizSlug,
  trackSlug: topic.courseSlug,
  title: `Quiz — Jamf ${topic.title}`,
  type: "quiz" as const,
  description: `5 questions alignées Jamf Pro 11.16 — ${topic.title}. Référence pédagogique Jamf Training.`,
  duration: "10 min",
  passingScore: 80,
  questions: JAMF_TRAINING_TOPIC_QUIZZES[topic.id as JamfTrainingTopicId],
}));
