import { getCourse, getCoursesByTrack } from "@/lib/data";

/** Route cours la plus pertinente pour un parcours (évite les 404 si slug cours ≠ slug track). */
export function resolveTrackCourseHref(trackSlug: string): string {
  const exact = getCourse(trackSlug);
  if (exact) return `/cours/${exact.slug}`;
  const related = getCoursesByTrack(trackSlug);
  if (related[0]) return `/cours/${related[0].slug}`;
  return `/parcours/${trackSlug}`;
}

export function trackHasCourse(trackSlug: string): boolean {
  return Boolean(getCourse(trackSlug) || getCoursesByTrack(trackSlug).length > 0);
}
