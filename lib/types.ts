export type Track = {
  slug: string;
  title: string;
  level: "Débutant" | "Intermédiaire" | "Avancé" | "Pro" | "Expert";
  lessons: number;
  description: string;
  duration: string;
  icon: string;
  certification?: string;
};

export type LessonStatus = "en-cours" | "termine" | "verrouille";

export type Lesson = {
  slug: string;
  title: string;
  duration: string;
  points?: number;
  completed?: boolean;
};

export type LessonScreenshot = {
  caption: string;
  alt: string;
  /** Dégradé CSS pour l'aperçu visuel */
  gradient: string;
  icon: string;
};

export type LessonStep = {
  title: string;
  description: string;
};

export type LessonTroubleshooting = {
  problem: string;
  solution: string;
};

export type LessonContent = {
  objectives: string[];
  prerequisites: string[];
  theory: { title: string; body: string[] }[];
  steps: LessonStep[];
  screenshots: LessonScreenshot[];
  bestPractices: string[];
  troubleshooting: LessonTroubleshooting[];
  finalQuizSlug?: string;
};

export type Module = {
  title: string;
  lessons: Lesson[];
};

export type Course = {
  slug: string;
  trackSlug: string;
  title: string;
  description: string;
  duration: string;
  objectives: string[];
  modules: Module[];
};

export type Question = {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type Quiz = {
  slug: string;
  trackSlug: string;
  title: string;
  type: "quiz" | "examen";
  description: string;
  duration: string;
  passingScore: number;
  questions: Question[];
};

export type Lab = {
  slug: string;
  title: string;
  trackSlug: string;
  objective: string;
  prerequisites: string[];
  steps: string[];
  duration: string;
  difficulty: "Débutant" | "Intermédiaire" | "Avancé";
};

export type PricingPlan = {
  slug: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
};

export type Badge = {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  earnedAt?: string;
};

export type UserProgress = {
  globalPercent: number;
  tracks: { slug: string; title: string; percent: number }[];
  recentActivity: { label: string; date: string; type: string }[];
};
