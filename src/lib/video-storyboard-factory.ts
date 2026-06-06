import {
  buildNarrationFromScenes,
  collectAllScreenshots,
  defaultHeygenMeta,
  estimateDurationSeconds,
  formatDuration,
  type ArchitectureConnection,
  type ArchitectureNode,
  type VideoScene,
  type VideoSceneVisualType,
  type VideoStoryboard,
} from "@/src/lib/video-lessons";
import type { VideoLevel } from "@/src/lib/video-scripts";
import type { VideoProductionPhase } from "@/src/lib/video-publish-status";
import { getVideoPublishMeta } from "@/src/lib/video-publish-status";

export type SceneInput = {
  narration: string;
  visual: string;
  animation: string;
  visualType?: VideoSceneVisualType;
  requiredScreenshots?: string[];
  onScreenText?: string[];
  durationSeconds?: number;
  nodes?: ArchitectureNode[];
  connections?: ArchitectureConnection[];
  checklistItems?: string[];
  comparison?: { left: string; right: string };
};

export type ProductionStoryboardInput = {
  slug: string;
  title: string;
  module: string;
  level: VideoLevel;
  objective: string;
  courseSlug: string;
  labSlug: string;
  quizSlug: string;
  visualType: VideoSceneVisualType;
  intro: SceneInput;
  architecture: SceneInput;
  demo: SceneInput;
  errors: SceneInput;
  recap: SceneInput;
};

function toScene(
  id: string,
  title: string,
  defaults: { durationSeconds: number; visualType: VideoSceneVisualType },
  input: SceneInput
): VideoScene {
  const requiredScreenshots = input.requiredScreenshots ?? [];
  return {
    id,
    title,
    durationSeconds: input.durationSeconds ?? defaults.durationSeconds,
    narration: input.narration,
    visual: input.visual,
    animation: input.animation,
    visualType: input.visualType ?? defaults.visualType,
    requiredScreenshots,
    onScreenText: input.onScreenText ?? [],
    visualHint: input.visual,
    screenshotTarget: requiredScreenshots[0],
    nodes: input.nodes,
    connections: input.connections,
    checklistItems: input.checklistItems,
    comparison: input.comparison,
  };
}

export function createProductionStoryboard(input: ProductionStoryboardInput): VideoStoryboard {
  const scenes: VideoScene[] = [
    toScene("s1", "Intro visuelle", { durationSeconds: 20, visualType: "avatar" }, input.intro),
    toScene("s2", "Architecture", { durationSeconds: 45, visualType: "architecture" }, input.architecture),
    toScene("s3", "Démonstration", { durationSeconds: input.demo.durationSeconds ?? 150, visualType: "screenshot" }, input.demo),
    toScene("s4", "Erreurs fréquentes", { durationSeconds: 60, visualType: "checklist" }, input.errors),
    toScene("s5", "Résumé", { durationSeconds: 30, visualType: "recap" }, input.recap),
  ];

  const durationSeconds = estimateDurationSeconds(scenes);
  const publish = getVideoPublishMeta(input.slug);

  return {
    slug: input.slug,
    title: input.title,
    module: input.module,
    level: input.level,
    objective: input.objective,
    visualType: input.visualType,
    courseSlug: input.courseSlug,
    labSlug: input.labSlug,
    quizSlug: input.quizSlug,
    relatedCourse: input.courseSlug,
    relatedLab: input.labSlug,
    scenes,
    durationSeconds,
    duration: formatDuration(durationSeconds),
    narration: buildNarrationFromScenes(scenes),
    allScreenshots: collectAllScreenshots(scenes),
    status: publish.status,
    videoUrl: publish.videoUrl,
    heygen: defaultHeygenMeta(),
  };
}
