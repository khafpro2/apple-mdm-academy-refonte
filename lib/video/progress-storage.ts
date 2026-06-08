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
const EMPTY_VIDEO_PROGRESS: VideoProgress[] = [];
const EMPTY_VIDEO_NOTES: VideoNote[] = [];

export type LastContent = {
  type: "video" | "lesson" | "lab";
  slug: string;
  title: string;
  href: string;
  updatedAt: number;
};

const progressCache = new Map<string, { raw: string | null; value: VideoProgress | null }>();
const notesCache = new Map<string, { raw: string | null; value: VideoNote[] }>();
let allProgressCacheKey: string | null = null;
let allProgressCacheValue: VideoProgress[] = EMPTY_VIDEO_PROGRESS;
let lastContentRaw: string | null = null;
let lastContentValue: LastContent | null = null;

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
    const cached = progressCache.get(videoSlug);
    if (cached?.raw === raw) return cached.value;

    const value = raw ? (JSON.parse(raw) as VideoProgress) : null;
    progressCache.set(videoSlug, { raw, value });
    return value;
  } catch {
    progressCache.set(videoSlug, { raw: null, value: null });
    return null;
  }
}

export function saveVideoProgress(progress: VideoProgress): void {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(progress);
  progressCache.set(progress.videoSlug, { raw, value: progress });
  allProgressCacheKey = null;
  localStorage.setItem(`${PROGRESS_PREFIX}${progress.videoSlug}`, raw);
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
  if (typeof window === "undefined") return EMPTY_VIDEO_NOTES;
  try {
    const raw = localStorage.getItem(`${NOTES_PREFIX}${videoSlug}`);
    const cached = notesCache.get(videoSlug);
    if (cached?.raw === raw) return cached.value;

    const value = raw ? (JSON.parse(raw) as VideoNote[]) : EMPTY_VIDEO_NOTES;
    notesCache.set(videoSlug, { raw, value });
    return value;
  } catch {
    notesCache.set(videoSlug, { raw: null, value: EMPTY_VIDEO_NOTES });
    return EMPTY_VIDEO_NOTES;
  }
}

export function saveVideoNotes(videoSlug: string, notes: VideoNote[]): void {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(notes);
  notesCache.set(videoSlug, { raw, value: notes });
  localStorage.setItem(`${NOTES_PREFIX}${videoSlug}`, raw);
}

export function saveLastContent(content: LastContent): void {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(content);
  lastContentRaw = raw;
  lastContentValue = content;
  localStorage.setItem(LAST_CONTENT_KEY, raw);
  window.dispatchEvent(new CustomEvent(VIDEO_PROGRESS_EVENT));
}

export function loadLastContent(): LastContent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LAST_CONTENT_KEY);
    if (raw === lastContentRaw) return lastContentValue;

    lastContentRaw = raw;
    lastContentValue = raw ? (JSON.parse(raw) as LastContent) : null;
    return lastContentValue;
  } catch {
    lastContentRaw = null;
    lastContentValue = null;
    return null;
  }
}

export function loadAllVideoProgress(): VideoProgress[] {
  if (typeof window === "undefined") return EMPTY_VIDEO_PROGRESS;
  const entries: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith(PROGRESS_PREFIX)) continue;
    entries.push(`${key}:${localStorage.getItem(key) ?? ""}`);
  }

  entries.sort();
  const cacheKey = entries.join("\n");
  if (cacheKey === allProgressCacheKey) return allProgressCacheValue;

  const results: VideoProgress[] = [];
  for (const entry of entries) {
    const separator = entry.indexOf(":");
    const key = entry.slice(0, separator);
    const raw = entry.slice(separator + 1);
    try {
      if (raw) {
        const slug = key.slice(PROGRESS_PREFIX.length);
        const cached = progressCache.get(slug);
        if (cached?.raw === raw && cached.value) {
          results.push(cached.value);
        } else {
          const value = JSON.parse(raw) as VideoProgress;
          progressCache.set(slug, { raw, value });
          results.push(value);
        }
      }
    } catch {
      /* skip */
    }
  }
  allProgressCacheKey = cacheKey;
  allProgressCacheValue = results.sort((a, b) => b.updatedAt - a.updatedAt);
  return allProgressCacheValue;
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
