import type { Course } from "@/lib/types";
import { altMdmTrackMeta } from "@/lib/data/alternative-mdm-tracks/module-definitions";

export const altMdmCourses: Course[] = altMdmTrackMeta.map((track) => ({
  slug: track.slug,
  trackSlug: track.slug,
  title: track.title,
  description: track.description,
  duration: track.duration,
  objectives: track.modules.map((m) => `Maîtriser : ${m.title}`),
  modules: track.modules.map((m) => ({
    title: m.title,
    lessons: [{ slug: m.slug, title: m.title, duration: m.duration, points: 25 }],
  })),
}));
