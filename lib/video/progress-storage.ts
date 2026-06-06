/** Progression vidéo — localStorage + sync Supabase optionnelle */

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
export const VIDEO_PROGRESS_EVENT = "apple-mdm-video-progress-updated";

export type LastContent = {
  type: "video" | "lesson" | "lab";
  slug: string;
  title: string;
  href: string;
  updatedAt: number;
};

export function subscribeVideoProgress(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => onStoreChange();
  window.addEventListener(VIDEO_PROGRESS_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(VIDEO_PROGRESS_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

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
  window.dispatchEvent(new CustomEvent(VIDEO_PROGRESS_EVENT));
}

export function markVideoComplete(videoSlug: string, durationSeconds: number): void {
  saveVideoProgress({
    videoSlug,
    currentSeconds: durationSeconds,
    completed: true,
    updatedAt: Date.now(),
  });
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
  window.dispatchEvent(new CustomEvent(VIDEO_PROGRESS_EVENT));
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

export function getTotalWatchMinutes(durationBySlug: Record<string, number>): number {
  const progress = loadAllVideoProgress();
  let totalSeconds = 0;
  for (const p of progress) {
    const duration = durationBySlug[p.videoSlug];
    if (!duration) continue;
    totalSeconds += p.completed ? duration : Math.min(p.currentSeconds, duration);
  }
  return Math.round(totalSeconds / 60);
}

export function formatWatchTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} h ${m} min` : `${h} h`;
}

export function getContinueVideoProgress(): VideoProgress | null {
  const inProgress = loadAllVideoProgress().filter((p) => !p.completed && p.currentSeconds > 10);
  return inProgress[0] ?? null;
}

export function getGlobalVideoProgressPercent(
  durationBySlug: Record<string, number>,
  totalVideos: number
): number {
  if (totalVideos === 0) return 0;
  const progress = loadAllVideoProgress();
  let sum = 0;
  for (const p of progress) {
    const duration = durationBySlug[p.videoSlug];
    if (!duration) continue;
    sum += p.completed ? 100 : Math.min(100, Math.round((p.currentSeconds / duration) * 100));
  }
  return Math.round(sum / totalVideos);
}

export function getStartedVideoCount(): number {
  return loadAllVideoProgress().filter((p) => p.currentSeconds > 0 || p.completed).length;
}

export function getCompletedVideoCount(): number {
  return loadAllVideoProgress().filter((p) => p.completed).length;
}
