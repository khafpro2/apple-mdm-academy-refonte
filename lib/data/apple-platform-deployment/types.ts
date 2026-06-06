/** Types contenus Apple Platform Deployment — référence Apple Business Manager User Guide */

export type AppleDeploymentTopicExtension = {
  focus: string;
  outcomes: string[];
  concepts: string[];
  actions: string[];
  validation: string[];
  risks: string[];
  tools?: string[];
  /** Scénario entreprise documenté (Apple Platform Deployment) */
  enterpriseScenario?: string[];
  /** Procédure pas-à-pas opérationnelle */
  procedure?: string[];
  /** Dépannage spécifique module */
  troubleshooting?: { problem: string; solution: string }[];
  /** Références documentation Apple officielle */
  officialReferences?: string[];
};

export type LmsModuleSpec = {
  id: string;
  title: string;
  trackSlugs: string[];
  lessonSlugs: string[];
  labSlugs: string[];
  quizSlugs: string[];
  examSlugs: string[];
  resourceSlugs: string[];
  /** Poids pour score LMS */
  weight: number;
};
