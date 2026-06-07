import type { DashboardData } from "@/lib/supabase/queries";
import { badgeCatalog, premiumBadgeIds } from "@/lib/badges-config";
import { trackCertificates, evaluateCertification, evaluateAllCertificationPaths } from "@/lib/certifications";
import { labs } from "@/lib/labs";

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
  "ade-iphone",
  "apns-certificats",
  "architecture-jamf",
  "smart-groups",
  "filevault-chiffrement",
  "profils-configuration",
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
    ["examen-jamf-100-blanc", 62],
  ]);

  const maxExamScores: Record<string, number> = {
    "quiz-abm-certification": 88,
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
    { slug: "intune-mac", title: "Intune Apple", percent: 60 },
    { slug: "jamf-100", title: "Jamf 100", percent: 40 },
    { slug: "apple-enterprise-expert", title: "Apple Security", percent: 25 },
  ];

  const globalPercent = Math.round(tracks.reduce((s, t) => s + t.percent, 0) / tracks.length);

  const recentActivity = [
    { label: "Examen blanc Jamf 100 — 62% (en cours)", date: "6 juin 2026", type: "examen" },
    { label: "Quiz Apple Business Manager — 88%", date: "5 juin 2026", type: "quiz" },
    { label: "Lab : Connecter ABM à Intune", date: "4 juin 2026", type: "lab" },
    { label: "Leçon : Device Enrollment Program", date: "3 juin 2026", type: "cours" },
    { label: "Quiz Jamf 100 — 92%", date: "2 juin 2026", type: "quiz" },
    { label: "Lab : ADE iPhone", date: "1 juin 2026", type: "lab" },
  ];

  const certificates = [
    {
      quizSlug: "quiz-abm-certification",
      name: "Apple Business Manager — Certification",
      score: "88%",
      date: "5 juin 2026",
      status: "available" as const,
    },
    {
      quizSlug: "examen-jamf-100-blanc",
      name: "Jamf 100 — Examen blanc",
      score: "62%",
      date: "6 juin 2026",
      status: "locked" as const,
    },
  ];

  const stats = {
    globalPercent,
    timeSpentMinutes: 1240,
    modulesCompleted: completedLessonSlugs.size,
    averageScore: 82,
    lastActivity: { label: recentActivity[0].label, date: recentActivity[0].date },
    certificatesCount: 1 + trackCertifications.filter((c) => c.eligible).length,
    labsCompleted: completedLabSlugs.length,
    labsInProgress: Math.max(0, labs.length - completedLabSlugs.length),
    practicePercent: Math.round((completedLabSlugs.length / Math.max(labs.length, 1)) * 100),
  };

  const leaderboard = [
    { rank: 1, userId: "u1", name: "Marie L.", bestScore: 2840, avgScore: 91, modulesCompleted: 42, fastestMinutes: 38, highlight: false },
    { rank: 2, userId: "u2", name: "Thomas K.", bestScore: 2650, avgScore: 88, modulesCompleted: 38, fastestMinutes: 42, highlight: false },
    { rank: 3, userId, name: "Apprenant Démo", bestScore: 1920, avgScore: 82, modulesCompleted: stats.modulesCompleted, fastestMinutes: 55, highlight: true },
    { rank: 4, userId: "u4", name: "Sophie R.", bestScore: 1780, avgScore: 79, modulesCompleted: 30, fastestMinutes: null, highlight: false },
  ];

  return {
    fromDatabase: true,
    isDemo: true,
    globalPercent,
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
