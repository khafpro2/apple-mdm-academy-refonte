/**
 * Contrats UX Video Experience V1 — aucune donnée métier / aucune API.
 * Codex branchera ces types sur l’infrastructure quand elle sera prête.
 */

export const VIDEO_AVAILABILITY_STATES = [
  "loading",
  "processing",
  "available",
  "deprecated",
  "missing",
] as const;

export type VideoAvailabilityState = (typeof VIDEO_AVAILABILITY_STATES)[number];

export type VideoChapterModel = {
  id: string;
  title: string;
  startSeconds: number;
  endSeconds: number;
  summary?: string;
};

export type VideoTranscriptCue = {
  id: string;
  startSeconds: number;
  endSeconds: number;
  text: string;
};

export type VideoTranscriptModel = {
  language: string;
  cues: VideoTranscriptCue[];
};

export type VideoResourceModel = {
  id: string;
  label: string;
  href: string;
  kind?: "course" | "lab" | "quiz" | "checklist" | "pdf" | "external";
  downloadable?: boolean;
};

export type VideoPlaylistItemModel = {
  slug: string;
  title: string;
  durationLabel?: string;
  availability: VideoAvailabilityState;
  href: string;
  posterSrc?: string;
};

export type VideoExperienceModel = {
  slug: string;
  title: string;
  description?: string;
  durationSeconds?: number;
  durationLabel?: string;
  module?: string;
  level?: string;
  /** URL média réelle uniquement — jamais inventée. */
  mediaSrc?: string;
  posterSrc?: string;
  captionsSrc?: string;
  availability: VideoAvailabilityState;
  chapters?: VideoChapterModel[];
  transcript?: VideoTranscriptModel;
  resources?: VideoResourceModel[];
  playlist?: VideoPlaylistItemModel[];
  related?: VideoPlaylistItemModel[];
};

export type VideoLibraryItemModel = {
  slug: string;
  title: string;
  description?: string;
  module?: string;
  durationLabel?: string;
  availability: VideoAvailabilityState;
  href: string;
  posterSrc?: string;
};

export type VideoProgressModel = {
  slug: string;
  currentSeconds: number;
  completed: boolean;
  updatedAt: number;
};

export type VideoBookmarkModel = {
  slug: string;
  seconds: number;
  label?: string;
  createdAt: number;
};
