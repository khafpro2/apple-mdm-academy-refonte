/** Favoris vidéo — localStorage */

const FAVORITES_KEY = "apple-mdm-video-favorites";
export const VIDEO_FAVORITES_EVENT = "apple-mdm-video-favorites-updated";

let favoritesCacheRaw: string | null = null;
let favoritesCacheValue: string[] = [];

function readFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (favoritesCacheRaw === raw) return favoritesCacheValue;
    const value = raw ? (JSON.parse(raw) as string[]) : [];
    favoritesCacheRaw = raw;
    favoritesCacheValue = Array.isArray(value) ? value : [];
    return favoritesCacheValue;
  } catch {
    favoritesCacheRaw = null;
    favoritesCacheValue = [];
    return [];
  }
}

function writeFavorites(slugs: string[]): void {
  if (typeof window === "undefined") return;
  const unique = [...new Set(slugs)];
  const raw = JSON.stringify(unique);
  favoritesCacheRaw = raw;
  favoritesCacheValue = unique;
  localStorage.setItem(FAVORITES_KEY, raw);
  window.dispatchEvent(new CustomEvent(VIDEO_FAVORITES_EVENT));
}

export function subscribeVideoFavorites(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => onStoreChange();
  window.addEventListener(VIDEO_FAVORITES_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(VIDEO_FAVORITES_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function loadVideoFavorites(): string[] {
  return readFavorites();
}

export function isVideoFavorite(slug: string): boolean {
  return readFavorites().includes(slug);
}

export function toggleVideoFavorite(slug: string): boolean {
  const current = readFavorites();
  const next = current.includes(slug)
    ? current.filter((item) => item !== slug)
    : [...current, slug];
  writeFavorites(next);
  return next.includes(slug);
}

export function setVideoFavorite(slug: string, favorite: boolean): void {
  const current = readFavorites();
  const has = current.includes(slug);
  if (favorite && !has) writeFavorites([...current, slug]);
  if (!favorite && has) writeFavorites(current.filter((item) => item !== slug));
}
