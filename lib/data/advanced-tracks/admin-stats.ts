import { advancedTrackMeta } from "@/lib/data/advanced-tracks/module-definitions";
import { getLabsByTrack } from "@/lib/labs";
import type { AdminExamStat } from "@/lib/supabase/admin";

export type AdvancedTrackAdminStat = {
  trackSlug: string;
  title: string;
  enrolled: number;
  avgProgress: number;
  examPassRate: number;
  labsCompleted: number;
};

const TRACK_EXAM_SLUG: Record<string, string> = {
  "jamf-300": "examen-jamf-300",
  "jamf-400": "examen-jamf-400",
  "apple-enterprise-expert": "examen-apple-enterprise-expert",
  "apple-enterprise-architect": "examen-apple-enterprise-architect",
  "intune-apple-advanced": "examen-intune-apple-advanced",
};

export const expertLabSlugs = [
  "jamf-api",
  "jamf-webhooks",
  "jamf-extension-attributes",
  "jamf-advanced-scripts",
  "jamf-migration",
  "declarative-device-management",
  "managed-device-attestation",
  "platform-sso-advanced",
  "intune-conditional-access",
  "microsoft-defender-macos",
  "aea-architecture-stack",
  "aea-identity-architecture",
  "aea-jamf-500-mac",
  "aea-intune-global",
  "aea-security-audit",
  "aea-automation-deploy",
  "aea-troubleshooting-lab",
  "aea-capstone-projects",
];

export function buildAdvancedTrackStats(
  trackStats: { track_slug: string; avg_percent: number; learners: number }[],
  examStats: AdminExamStat[],
  labCompletions: Map<string, number>
): AdvancedTrackAdminStat[] {
  return advancedTrackMeta.map((track) => {
    const ts = trackStats.find((t) => t.track_slug === track.slug);
    const examSlug = TRACK_EXAM_SLUG[track.slug];
    const exam = examStats.find((e) => e.quizSlug === examSlug);
    const trackLabSlugs = getLabsByTrack(track.slug).map((l) => l.slug);
    const labsCompleted = trackLabSlugs.reduce((sum, slug) => sum + (labCompletions.get(slug) ?? 0), 0);

    return {
      trackSlug: track.slug,
      title: track.title,
      enrolled: ts?.learners ?? 0,
      avgProgress: ts?.avg_percent ?? 0,
      examPassRate: exam?.passRate ?? 0,
      labsCompleted,
    };
  });
}

export function advancedStatsToCsv(stats: AdvancedTrackAdminStat[]): string {
  const header = "track,enrolled,avgProgress,examPassRate,labsCompleted";
  return [header, ...stats.map((s) => [s.title, s.enrolled, s.avgProgress, s.examPassRate, s.labsCompleted].join(","))].join("\n");
}

/** Fallback démo si Supabase indisponible */
export const demoAdvancedTrackAdminStats: AdvancedTrackAdminStat[] = [
  { trackSlug: "jamf-300", title: "Jamf 300 Prep", enrolled: 24, avgProgress: 42, examPassRate: 68, labsCompleted: 89 },
  { trackSlug: "jamf-400", title: "Jamf 400 Prep", enrolled: 12, avgProgress: 28, examPassRate: 55, labsCompleted: 34 },
  { trackSlug: "apple-enterprise-expert", title: "Apple Enterprise Expert", enrolled: 31, avgProgress: 51, examPassRate: 72, labsCompleted: 67 },
  { trackSlug: "intune-apple-advanced", title: "Intune Apple Advanced", enrolled: 19, avgProgress: 38, examPassRate: 64, labsCompleted: 45 },
];
