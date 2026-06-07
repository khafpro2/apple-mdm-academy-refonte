import { labs } from "@/lib/labs";
import { courses } from "@/lib/data/courses";
import { getFlatLessons } from "@/lib/course/helpers";
import { proModules } from "@/lib/data/pro-modules";
import { getQuiz } from "@/lib/data/quizzes";
import { getResource } from "@/src/lib/resources";
import { videoScripts } from "@/src/lib/video-scripts";
import { productionVideoStoryboards } from "@/src/lib/video-storyboard-modules";
import { jamfTrainingStoryboards, jamfTrainingStoryboardSlugs } from "@/lib/data/jamf/jamf-training-storyboards";
import {
  JAMF_TRAINING_TOPICS,
  type JamfTrainingTopic,
  type JamfTrainingTopicId,
} from "@/lib/data/jamf/jamf-training-registry";
import { JAMF_TRAINING_CONTENT } from "@/lib/data/jamf/jamf-training-content";
import { JAMF_TRAINING_TOPIC_QUIZZES } from "@/lib/data/jamf/jamf-training-quizzes";
import { getJamfTrainingResource } from "@/lib/data/jamf/jamf-training-resources";
import { resolveJamf116Topic } from "@/lib/data/jamf/jamf-pro-11-16-content";

export type JamfContentGapRow = {
  topicId: JamfTrainingTopicId;
  title: string;
  priority: string;
  topicCovered: boolean;
  topicMissing: boolean;
  sourceVideoIdentified: boolean;
  sourceVideoTitle: string;
  courseCreated: boolean;
  courseLessonCount: number;
  quizCreated: boolean;
  quizQuestionCount: number;
  labCreated: boolean;
  storyboardCreated: boolean;
  heygenScriptCreated: boolean;
  frenchSummaryCreated: boolean;
  pdfResourceCreated: boolean;
  videoScriptCreated: boolean;
  lessonSlugs: string[];
  labSlug: string;
  videoSlug: string;
  quizSlug: string;
  resourceSlug: string;
};

export type JamfContentGapReport = {
  generatedAt: string;
  channelReference: string;
  totalTopics: number;
  coveredCount: number;
  missingCount: number;
  fullyCompleteCount: number;
  rows: JamfContentGapRow[];
};

const productionStoryboardSlugs = new Set([
  ...productionVideoStoryboards.map((s) => s.slug),
  ...jamfTrainingStoryboards.map((s) => s.slug),
]);

const videoScriptSlugs = new Set(videoScripts.map((v) => v.slug));

function lessonExists(slug: string): boolean {
  if (courses.some((c) => getFlatLessons(c).some((f) => f.lesson.slug === slug))) return true;
  for (const mod of proModules) {
    if (mod.lessons.some((l) => l.slug === slug)) return true;
  }
  return false;
}

function analyzeTopic(topic: JamfTrainingTopic): JamfContentGapRow {
  const content = JAMF_TRAINING_CONTENT[topic.id];
  const trainingQuiz = JAMF_TRAINING_TOPIC_QUIZZES[topic.id] ?? [];
  const moduleQuiz = getQuiz(topic.quizSlug);
  const quizQuestions = trainingQuiz.length + (moduleQuiz?.questions.length ?? 0);

  const lessonHits = topic.lessonSlugs.filter(lessonExists).length;
  const jamf116Topic = resolveJamf116Topic(topic.lessonSlugs[0] ?? "", topic.moduleSlug);
  const topicCovered = lessonHits > 0 || jamf116Topic !== null;

  const frenchSummaryCreated = content.frenchSummary.length >= 3;
  const heygenScriptCreated = content.heygenScript.length > 200;
  const quizCreated = trainingQuiz.length >= 5 || !!moduleQuiz;
  const labCreated = labs.some((l) => l.slug === topic.labSlug);
  const storyboardCreated = productionStoryboardSlugs.has(topic.videoSlug);
  const videoScriptCreated = videoScriptSlugs.has(topic.videoSlug);
  const pdfResourceCreated = !!getResource(topic.resourceSlug) || !!getJamfTrainingResource(topic.resourceSlug);
  const courseCreated = lessonHits > 0;

  const deliverablesComplete =
    frenchSummaryCreated &&
    heygenScriptCreated &&
    quizCreated &&
    labCreated &&
    storyboardCreated &&
    pdfResourceCreated &&
    videoScriptCreated;

  const topicMissing = !topicCovered || !deliverablesComplete;

  return {
    topicId: topic.id,
    title: topic.title,
    priority: topic.priority,
    topicCovered,
    topicMissing,
    sourceVideoIdentified: !!topic.sourceVideoTitle,
    sourceVideoTitle: topic.sourceVideoTitle,
    courseCreated,
    courseLessonCount: lessonHits,
    quizCreated,
    quizQuestionCount: quizQuestions,
    labCreated,
    storyboardCreated,
    heygenScriptCreated,
    frenchSummaryCreated,
    pdfResourceCreated,
    videoScriptCreated,
    lessonSlugs: topic.lessonSlugs,
    labSlug: topic.labSlug,
    videoSlug: topic.videoSlug,
    quizSlug: topic.quizSlug,
    resourceSlug: topic.resourceSlug,
  };
}

export function runJamfContentGapAnalysis(): JamfContentGapReport {
  const rows = JAMF_TRAINING_TOPICS.map(analyzeTopic);
  const coveredCount = rows.filter((r) => r.topicCovered).length;
  const missingCount = rows.filter((r) => r.topicMissing).length;
  const fullyCompleteCount = rows.filter(
    (r) =>
      r.frenchSummaryCreated &&
      r.heygenScriptCreated &&
      r.quizCreated &&
      r.labCreated &&
      r.storyboardCreated &&
      r.pdfResourceCreated &&
      r.videoScriptCreated &&
      r.courseCreated
  ).length;

  return {
    generatedAt: new Date().toISOString(),
    channelReference: "https://www.youtube.com/@JamfTrainingAndSupport",
    totalTopics: rows.length,
    coveredCount,
    missingCount,
    fullyCompleteCount,
    rows,
  };
}

export { jamfTrainingStoryboardSlugs };
