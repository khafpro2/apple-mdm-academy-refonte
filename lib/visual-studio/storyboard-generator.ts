import type {
  CourseStoryboard,
  SceneContent,
  StoryboardScene,
  VerificationStatus,
  VisualArchitecture,
  VisualLayoutPreset,
} from "./types";
import { visualStudioMeta } from "./visual-tokens";

const FIREFLY_BASE =
  "Professional enterprise IT training illustration, modern Apple-inspired visual language without copying Apple branding, clean white and pale blue background, rounded interface cards, simple geometric characters, premium technical infographic, strong visual hierarchy, 16:9 composition, no text, no logos, no watermark.";

export function buildFireflyPrompt(subject: string): string {
  return `${FIREFLY_BASE} Subject: ${subject}`;
}

type SceneDraft = {
  id: string;
  order: number;
  title: string;
  purpose: string;
  onScreenText: string[];
  narration: string;
  durationSeconds: number;
  visualLayout: VisualLayoutPreset | string;
  animationInstructions: string[];
  transition: string;
  diagramId?: string;
  fireflySubject?: string;
  canvaInstructions?: string[];
  heygenInstructions?: string[];
  sceneContent: SceneContent;
};

export function createScene(draft: SceneDraft): StoryboardScene {
  return {
    id: draft.id,
    order: draft.order,
    title: draft.title,
    purpose: draft.purpose,
    onScreenText: draft.onScreenText,
    narration: draft.narration,
    durationSeconds: draft.durationSeconds,
    visualLayout: draft.visualLayout,
    animationInstructions: draft.animationInstructions,
    transition: draft.transition,
    diagramId: draft.diagramId,
    fireflyPrompt: draft.fireflySubject ? buildFireflyPrompt(draft.fireflySubject) : undefined,
    canvaInstructions: draft.canvaInstructions,
    heygenInstructions: draft.heygenInstructions,
    sceneContent: draft.sceneContent,
  };
}

type StoryboardDraft = {
  courseId: string;
  moduleId: string;
  moduleTitle: string;
  courseTitle: string;
  learningObjective: string;
  centralMessage: string;
  visualStyle?: string;
  verificationStatus?: VerificationStatus;
  scenes: StoryboardScene[];
  architecture: VisualArchitecture;
  productionResources: CourseStoryboard["productionResources"];
  relatedCourseSlug?: string;
  relatedLessonSlug?: string;
};

export function createCourseStoryboard(draft: StoryboardDraft): CourseStoryboard {
  const scenes = [...draft.scenes].sort((a, b) => a.order - b.order);
  if (scenes.length < 5 || scenes.length > 8) {
    throw new Error(
      `Storyboard ${draft.courseId}: attendu 5–8 scènes, reçu ${scenes.length}.`,
    );
  }

  return {
    courseId: draft.courseId,
    moduleId: draft.moduleId,
    moduleTitle: draft.moduleTitle,
    courseTitle: draft.courseTitle,
    learningObjective: draft.learningObjective,
    centralMessage: draft.centralMessage,
    visualStyle: draft.visualStyle ?? visualStudioMeta.name,
    verificationStatus: draft.verificationStatus ?? "draft-needs-review",
    scenes,
    architecture: draft.architecture,
    productionResources: draft.productionResources,
    relatedCourseSlug: draft.relatedCourseSlug,
    relatedLessonSlug: draft.relatedLessonSlug,
    disclaimer: visualStudioMeta.disclaimer,
  };
}

export function totalDurationSeconds(storyboard: CourseStoryboard): number {
  return storyboard.scenes.reduce((sum, scene) => sum + scene.durationSeconds, 0);
}

export function formatDurationLabel(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return s === 0 ? `${m} min` : `${m} min ${s}s`;
}
