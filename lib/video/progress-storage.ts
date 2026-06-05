/** Progression et notes vidéo — localStorage côté client */

export type VideoProgress = {
  videoSlug: string;
  currentSeconds: number;
  completed: boolean;
  updatedAt: number;
};

export type VideoNote = {
  id: string;
  videoSlug: string;
  timestampSeconds: number;
  text: string;
  createdAt: number;
};

const PROGRESS_PREFIX = "apple-mdm-video-progress-";
const NOTES_PREFIX = "apple-mdm-video-notes-";
const LAST_CONTENT_KEY = "apple-mdm-last-content";

export type LastContent = {
  type: "video" | "lesson" | "lab";
  slug: string;
  title: string;
  href: string;
  updatedAt: number;
};

export function loadVideoProgress(videoSlug: string): VideoProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${PROGRESS_PREFIX}${videoSlug}`);
    return raw ? (JSON.parse(raw) as VideoProgress) : null;
  } catch {
    return null;
  }
}

export function saveVideoProgress(progress: VideoProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${PROGRESS_PREFIX}${progress.videoSlug}`, JSON.stringify(progress));
}

export function loadVideoNotes(videoSlug: string): VideoNote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${NOTES_PREFIX}${videoSlug}`);
    return raw ? (JSON.parse(raw) as VideoNote[]) : [];
  } catch {
    return [];
  }
}

export function saveVideoNotes(videoSlug: string, notes: VideoNote[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${NOTES_PREFIX}${videoSlug}`, JSON.stringify(notes));
}

export function saveLastContent(content: LastContent): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LAST_CONTENT_KEY, JSON.stringify(content));
}

export function loadLastContent(): LastContent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LAST_CONTENT_KEY);
    return raw ? (JSON.parse(raw) as LastContent) : null;
  } catch {
    return null;
  }
}

export function loadAllVideoProgress(): VideoProgress[] {
  if (typeof window === "undefined") return [];
  const results: VideoProgress[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith(PROGRESS_PREFIX)) continue;
    try {
      const raw = localStorage.getItem(key);
      if (raw) results.push(JSON.parse(raw) as VideoProgress);
    } catch {
      /* skip */
    }
  }
  return results.sort((a, b) => b.updatedAt - a.updatedAt);
}
