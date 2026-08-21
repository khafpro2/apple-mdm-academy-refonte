/**
 * Apple Enterprise Learning Visual System — types stricts du Studio visuel.
 * Aucun `any` : les composants consomment uniquement ces contrats.
 */

export type VerificationStatus =
  | "source-verified"
  | "technically-reviewed"
  | "draft-needs-review"
  | "to-verify";

export type VisualActorType =
  | "admin"
  | "user"
  | "device"
  | "cloud-service"
  | "identity"
  | "security"
  | "application"
  | "configuration"
  | "certificate";

export type FlowConnectorVariant =
  | "action"
  | "synchronization"
  | "dependency"
  | "validation"
  | "error"
  | "secure";

export type VisualDomain =
  | "apple"
  | "jamf"
  | "microsoft"
  | "compliance"
  | "security"
  | "warning"
  | "error"
  | "inactive";

export type ProductionTool = "canva" | "firefly" | "heygen" | "freeform" | "playwright";

export type VisualLayoutPreset =
  | "problem-split"
  | "definition-cards"
  | "architecture-horizontal"
  | "process-steps"
  | "boot-sequence"
  | "config-cascade"
  | "comparison"
  | "recap-flow";

export interface VisualActor {
  id: string;
  label: string;
  type: VisualActorType;
  domain: VisualDomain;
  description?: string;
}

export interface VisualFlowEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  variant: FlowConnectorVariant;
}

export interface VisualArchitecture {
  id: string;
  title: string;
  description: string;
  actors: VisualActor[];
  edges: VisualFlowEdge[];
  /** Flux linéaire résumé (Achat → ABM → …) pour Freeform / récap */
  linearFlow: string[];
}

export interface StoryboardScene {
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
  fireflyPrompt?: string;
  canvaInstructions?: string[];
  heygenInstructions?: string[];
  /** Contenu structuré pour le rendu VideoFrame */
  sceneContent: SceneContent;
}

export type SceneContent =
  | ProblemSceneContent
  | DefinitionSceneContent
  | ArchitectureSceneContent
  | ProcessStepsSceneContent
  | BootSequenceSceneContent
  | ConfigCascadeSceneContent
  | ComparisonSceneContent
  | RecapSceneContent;

export interface ProblemSceneContent {
  kind: "problem";
  question: string;
  leftLabel: string;
  centerSteps: string[];
  rightLabel: string;
  timeIndicator: string;
  riskIndicator: string;
}

export interface DefinitionSceneContent {
  kind: "definition";
  headline: string;
  functions: string[];
}

export interface ArchitectureSceneContent {
  kind: "architecture";
  diagramId: string;
}

export interface ProcessStepsSceneContent {
  kind: "process-steps";
  steps: string[];
}

export interface BootSequenceSceneContent {
  kind: "boot-sequence";
  steps: string[];
}

export interface ConfigCascadeSceneContent {
  kind: "config-cascade";
  items: string[];
}

export interface ComparisonSceneContent {
  kind: "comparison";
  leftTitle: string;
  leftItems: string[];
  rightTitle: string;
  rightItems: string[];
}

export interface RecapSceneContent {
  kind: "recap";
  flow: string[];
  finalQuestion: string;
}

export interface ProductionResource {
  id: string;
  tool: ProductionTool;
  title: string;
  instructions: string[];
  prompt?: string;
}

export interface CourseStoryboard {
  courseId: string;
  moduleId: string;
  moduleTitle: string;
  courseTitle: string;
  learningObjective: string;
  centralMessage: string;
  visualStyle: string;
  verificationStatus: VerificationStatus;
  scenes: StoryboardScene[];
  architecture: VisualArchitecture;
  productionResources: ProductionResource[];
  /** Lien pédagogique vers le cours plateforme (slug) */
  relatedCourseSlug?: string;
  relatedLessonSlug?: string;
  disclaimer?: string;
}

export type VideoFrameMode = "preview" | "export";

export interface StoryboardExportPlan {
  courseId: string;
  scenes: Array<{
    sceneId: string;
    order: number;
    pngFilename: string;
    exportUrl: string;
  }>;
  svgDiagrams: Array<{
    diagramId: string;
    svgFilename: string;
  }>;
  printableUrl: string;
  freeformUrl: string;
  viewport: { width: number; height: number };
}
