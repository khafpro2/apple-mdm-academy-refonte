import type { LessonContent, OfficialSource, VersionDifference, ApplePlatformName, CourseVersionStatus } from "@/lib/types";

/** Editorial status for modular lesson modules (Claude drafts → production). */
export type LessonEditorialStatus =
  | "draft"
  | "pilot"
  | "reviewed"
  | "published"
  | "needs-verification";

export type ModularLessonMeta = {
  slug: string;
  courseSlug: string;
  family: "apple" | "jamf" | "intune";
  title: string;
  editorialStatus: LessonEditorialStatus;
  platforms?: ApplePlatformName[];
  primaryVersion?: string;
  versionStatus?: CourseVersionStatus;
  lastVerifiedAt?: string;
  requiresSupervision?: boolean;
  enrollmentTypes?: string[];
  officialSources?: OfficialSource[];
  versionDifferences?: VersionDifference[];
  /** Marker for Claude draft provenance — never delete source markdown. */
  draftSourcePath?: string;
};

export type ModularLessonModule = {
  meta: ModularLessonMeta;
  content: LessonContent;
};
