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

const TRACK_EXAM_SLUG: Record<string, string> = {
  "kandji-fundamentals": "examen-kandji-fundamentals",
  "mosyle-fundamentals": "examen-mosyle-fundamentals",
  "addigy-fundamentals": "examen-addigy-fundamentals",
  "workspace-one-apple": "examen-workspace-one-apple",
};

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

export const demoAltMdmTrackAdminStats: AltMdmTrackAdminStat[] = [
  { trackSlug: "kandji-fundamentals", title: "Kandji Fundamentals", enrolled: 18, avgProgress: 35, examPassRate: 62, labsCompleted: 42 },
  { trackSlug: "mosyle-fundamentals", title: "Mosyle Fundamentals", enrolled: 22, avgProgress: 41, examPassRate: 68, labsCompleted: 55 },
  { trackSlug: "addigy-fundamentals", title: "Addigy Fundamentals", enrolled: 14, avgProgress: 29, examPassRate: 58, labsCompleted: 28 },
  { trackSlug: "workspace-one-apple", title: "Workspace ONE Apple", enrolled: 16, avgProgress: 33, examPassRate: 61, labsCompleted: 31 },
  { trackSlug: "mdm-comparatif-apple", title: "Comparatif MDM Apple", enrolled: 45, avgProgress: 58, examPassRate: 0, labsCompleted: 38 },
];

export function altMdmStatsToCsv(stats: AltMdmTrackAdminStat[]): string {
  const header = "track,enrolled,avgProgress,examPassRate,labsCompleted";
  return [header, ...stats.map((s) => [s.title, s.enrolled, s.avgProgress, s.examPassRate, s.labsCompleted].join(","))].join("\n");
}
