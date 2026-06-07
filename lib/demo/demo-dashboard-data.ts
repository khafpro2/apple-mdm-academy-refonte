import type { DashboardData } from "@/lib/supabase/queries";
import { badgeCatalog, premiumBadgeIds } from "@/lib/badges-config";
import { trackCertificates, evaluateCertification, evaluateAllCertificationPaths } from "@/lib/certifications";
import { labs } from "@/lib/labs";

const DEMO_GLOBAL_PERCENT = 68;
const DEMO_MODULES_COMPLETED = 12;
const DEMO_LABS_COMPLETED = 8;
const DEMO_AVERAGE_SCORE = 82;
const DEMO_EARNED_BADGES = ["first-quiz", "first-lab", "badge-abm"] as const;

const DEMO_COMPLETED_LABS = [
  "abm-intune",
  "ade-iphone",
  "ade-macos",
  "apns",
  "apps-books",
  "managed-apple-ids",
  "platform-sso",
  "ios-configuration-profile",
] as const;

const DEMO_COMPLETED_LESSONS = [
  "abm-creation-roles",
  "dep-enrollment",
  "apps-books",
  "abm-intune",
  "filevault-chiffrement",
  "profils-configuration",
  "apns-certificats",
  "icloud-comptes",
  "managed-apple-ids",
  "macos-ios-ipados",
  "commandes-mdm",
  "services-entreprise",
] as const;

const DEMO_PASSED_QUIZZES: { slug: string; score: number }[] = [
  { slug: "quiz-abm-certification", score: 88 },
  { slug: "quiz-jamf-100", score: 92 },
  { slug: "quiz-intune-mac", score: 85 },
  { slug: "quiz-module-11-intune-apple", score: 79 },
  { slug: "quiz-module-12-jamf-fundamentals", score: 84 },
  { slug: "quiz-module-13-smart-groups", score: 90 },
  { slug: "quiz-module-14-policies", score: 81 },
  { slug: "quiz-module-15-scripts", score: 77 },
  { slug: "quiz-module-16-patch", score: 83 },
  { slug: "quiz-module-17-protect", score: 86 },
  { slug: "quiz-module-18-security", score: 80 },
  { slug: "quiz-azure-for-apple-admins", score: 78 },
];

export function getDemoDashboardData(userId = "demo-user"): DashboardData {
  const completedLessonSlugs = new Set<string>(DEMO_COMPLETED_LESSONS);
  const completedLabSlugs = [...DEMO_COMPLETED_LABS];

  const examScores = new Map<string, number>([
    ["quiz-abm-certification", 88],
    ["examen-apple-it-pro", 58],
    ["examen-jamf-100-blanc", 62],
  ]);

  const maxExamScores: Record<string, number> = {
    "quiz-abm-certification": 88,
    "examen-apple-it-pro": 58,
    "examen-jamf-100-blanc": 62,
  };

  const trackCertifications = trackCertificates.map((cert) =>
    evaluateCertification(cert, completedLessonSlugs, new Set(completedLabSlugs), examScores)
  );

  const pathCertifications = evaluateAllCertificationPaths(
    completedLessonSlugs,
    new Set(completedLabSlugs),
    examScores
  );

  const badges = badgeCatalog.map((b) => ({
    ...b,
    earned: (DEMO_EARNED_BADGES as readonly string[]).includes(b.id),
    earnedAt: (DEMO_EARNED_BADGES as readonly string[]).includes(b.id) ? "1 juin 2026" : undefined,
  }));

  const tracks = [
    { slug: "apple-it-professional", title: "Apple Business Manager", percent: 75 },
    { slug: "intune-mac", title: "Intune Apple", percent: 70 },
    { slug: "jamf-100", title: "Jamf 100", percent: 65 },
    { slug: "apple-enterprise-expert", title: "Apple Security", percent: 62 },
  ];

  const recentActivity = [
    { label: "Certification Apple IT Professional — 58% (en cours)", date: "7 juin 2026", type: "certification" },
    { label: "Quiz Apple Business Manager — 88%", date: "5 juin 2026", type: "quiz" },
    { label: "Lab : Connecter ABM à Intune", date: "4 juin 2026", type: "lab" },
    { label: "Leçon : Device Enrollment Program", date: "3 juin 2026", type: "cours" },
    { label: "Quiz Jamf 100 — 92%", date: "2 juin 2026", type: "quiz" },
    { label: "Lab : ADE iPhone", date: "1 juin 2026", type: "lab" },
  ];

  const certificates = [
    {
      quizSlug: "examen-apple-it-pro",
      name: "Apple IT Professional — Certification",
      score: "58%",
      date: "7 juin 2026",
      status: "locked" as const,
    },
    {
      quizSlug: "quiz-abm-certification",
      name: "Apple Business Manager — Quiz",
      score: "88%",
      date: "5 juin 2026",
      status: "available" as const,
    },
  ];

  const stats = {
    globalPercent: DEMO_GLOBAL_PERCENT,
    timeSpentMinutes: 1240,
    modulesCompleted: DEMO_MODULES_COMPLETED,
    averageScore: DEMO_AVERAGE_SCORE,
    lastActivity: { label: recentActivity[0].label, date: recentActivity[0].date },
    certificatesCount: 1,
    labsCompleted: DEMO_LABS_COMPLETED,
    labsInProgress: Math.max(0, labs.length - completedLabSlugs.length),
    practicePercent: Math.round((DEMO_LABS_COMPLETED / Math.max(labs.length, 1)) * 100),
  };

  const leaderboard = [
    { rank: 1, userId: "u1", name: "Marie L.", bestScore: 2840, avgScore: 91, modulesCompleted: 42, fastestMinutes: 38, highlight: false },
    { rank: 2, userId: "u2", name: "Thomas K.", bestScore: 2650, avgScore: 88, modulesCompleted: 38, fastestMinutes: 42, highlight: false },
    {
      rank: 3,
      userId,
      name: "Apprenant Démo",
      bestScore: 1920,
      avgScore: DEMO_AVERAGE_SCORE,
      modulesCompleted: DEMO_MODULES_COMPLETED,
      fastestMinutes: 55,
      highlight: true,
    },
    { rank: 4, userId: "u4", name: "Sophie R.", bestScore: 1780, avgScore: 79, modulesCompleted: 30, fastestMinutes: null, highlight: false },
  ];

  return {
    fromDatabase: true,
    isDemo: true,
    globalPercent: DEMO_GLOBAL_PERCENT,
    tracks,
    recentActivity,
    badges: badges.filter((b) => premiumBadgeIds.includes(b.id) || b.earned),
    certificates,
    stats,
    leaderboard,
    completedLabSlugs,
    completedLessonSlugs: [...completedLessonSlugs],
    maxExamScores,
    trackCertifications,
    pathCertifications,
  };
}
