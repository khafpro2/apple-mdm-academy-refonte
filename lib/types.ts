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

export type ScreenshotCategory =
  | "apple-business-manager"
  | "ade"
  | "intune"
  | "apns"
  | "apps-books"
  | "managed-apple-id"
  | "platform-sso"
  | "jamf"
  | "security"
  | "filevault"
  | "exams";

export type LessonScreenshot = {
  id: string;
  title: string;
  description: string;
  src: string;
  /** Légende pédagogique affichée sous la description */
  caption: string;
  /** Scène EN pour génération d'image (sans style global) */
  scenePrompt?: string;
  /** Prompt complet : style global + scène */
  generationPrompt?: string;
  /** Asset officiel éditeur (ex. Jamf marketing public) */
  isOfficial?: boolean;
  officialSource?: string;
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
  /** Lien vers le module/leçon associé (correction examen) */
  moduleHref?: string;
  moduleLabel?: string;
};

export type Quiz = {
  slug: string;
  trackSlug: string;
  title: string;
  type: "quiz" | "examen";
  description: string;
  duration: string;
  /** Durée chronomètre en minutes (mode examen) */
  durationMinutes?: number;
  passingScore: number;
  questions: Question[];
  /** Nombre de questions en mode examen (pool aléatoire) */
  examQuestionCount?: number;
  /** Active le mode examen strict (chrono, pas de retour) */
  examMode?: boolean;
};

export type LearnerStats = {
  globalPercent: number;
  timeSpentMinutes: number;
  modulesCompleted: number;
  averageScore: number;
  lastActivity: { label: string; date: string } | null;
  certificatesCount: number;
  labsCompleted?: number;
  labsInProgress?: number;
  practicePercent?: number;
};

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  name: string;
  bestScore: number;
  avgScore: number;
  modulesCompleted: number;
  fastestMinutes: number | null;
  certsEarned?: number;
  labsCompleted?: number;
  highlight?: boolean;
};

export type LabLevel = "Débutant" | "Intermédiaire" | "Avancé";

export type LabTechnology =
  | "ABM + Intune"
  | "ADE + Intune"
  | "APNs + Apple"
  | "Apps & Books"
  | "Managed Apple ID"
  | "Platform SSO"
  | "Platform SSO + MFA"
  | "Jamf Pro"
  | "Jamf Protect"
  | "FileVault"
  | "Sécurité macOS"
  | "Intune Compliance"
  | "Managed Apple ID + Federation";

export type LabProgressSummary = {
  completedCount: number;
  inProgressCount: number;
  totalCount: number;
  practicePercent: number;
  lastLabSlug: string | null;
  lastLabTitle: string | null;
};

export type TrackCertificateDef = {
  id: string;
  title: string;
  trackSlug: string;
  examQuizSlug: string;
  passingScore: number;
};

export type LabStep = {
  id: string;
  title: string;
  instruction: string;
  expectedResult: string;
};

export type Lab = {
  slug: string;
  title: string;
  description: string;
  level: LabLevel;
  duration: string;
  technology: LabTechnology;
  trackSlug: string;
  /** Premier objectif — rétrocompat */
  objective: string;
  objectives: string[];
  prerequisites: string[];
  steps: LabStep[];
  expectedResult: string;
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

export type HeyGenGenerationStatus = "draft" | "queued" | "generating" | "ready" | "failed";

export type HeyGenConfig = {
  avatarId?: string;
  voiceId?: string;
  script: string;
  language: string;
  durationEstimate?: string;
  status: HeyGenGenerationStatus;
  videoUrl?: string;
  sessionUrl?: string;
};

export type VideoChapter = {
  id: string;
  title: string;
  startSeconds: number;
};

export type DownloadResourceType = "pdf" | "checklist" | "terminal" | "config" | "script";

export type DownloadResource = {
  slug: string;
  title: string;
  type: DownloadResourceType;
  description: string;
  /** Chemin public ou API de téléchargement */
  href: string;
  fileSize?: string;
};

export type AnimationSlug =
  | "abm-intune"
  | "ade-enrollment"
  | "apns-push"
  | "apps-books"
  | "platform-sso"
  | "jamf-policies"
  | "filevault";

export type AcademyVideo = {
  slug: string;
  title: string;
  description: string;
  duration: string;
  durationSeconds: number;
  moduleSlug: string;
  moduleTitle: string;
  lessonSlug?: string;
  courseSlug: string;
  trackSlug: string;
  thumbnail?: string;
  playbackUrl?: string;
  heygen: HeyGenConfig;
  chapters: VideoChapter[];
  resources: DownloadResource[];
  quizSlug?: string;
  animationSlug?: AnimationSlug;
  popular?: boolean;
  tags?: string[];
  relatedLabSlug?: string;
  level?: string;
};
