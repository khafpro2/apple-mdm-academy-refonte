import { altMdmTrackMeta, allAltMdmModules } from "@/lib/data/alternative-mdm-tracks/module-definitions";
import { getLabsByTrack } from "@/lib/labs";
import type { AdminExamStat } from "@/lib/supabase/admin";

export type AltMdmTrackAdminStat = {
  trackSlug: string;
  title: string;
  enrolled: number;
  avgProgress: number;
  examPassRate: number;
  labsCompleted: number;
};

const TRACK_EXAM_SLUG: Record<string, string> = {};

export const altMdmLabSlugs = allAltMdmModules.map((m) => m.labSlug).filter(Boolean) as string[];

export function buildAltMdmTrackStats(
  trackStats: { track_slug: string; avg_percent: number; learners: number }[],
  examStats: AdminExamStat[],
  labCompletions: Map<string, number>
): AltMdmTrackAdminStat[] {
  return altMdmTrackMeta.map((track) => {
    const ts = trackStats.find((t) => t.track_slug === track.slug);
    const examSlug = TRACK_EXAM_SLUG[track.slug];
    const exam = examSlug ? examStats.find((e) => e.quizSlug === examSlug) : undefined;
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

/** Stats démo — V1 : comparatif masqué, pas de faux chiffres Kandji/Mosyle/etc. */
export const demoAltMdmTrackAdminStats: AltMdmTrackAdminStat[] = [];

export function altMdmStatsToCsv(stats: AltMdmTrackAdminStat[]): string {
  const header = "track,enrolled,avgProgress,examPassRate,labsCompleted";
  return [header, ...stats.map((s) => [s.title, s.enrolled, s.avgProgress, s.examPassRate, s.labsCompleted].join(","))].join("\n");
}
