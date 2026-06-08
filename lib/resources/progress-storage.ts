/** Progression et historique ressources — localStorage côté client */

export type ResourceView = {
  resourceSlug: string;
  title: string;
  href: string;
  viewedAt: number;
};

const VIEWS_KEY = "apple-mdm-resource-views";
const MAX_VIEWS = 20;
const RESOURCE_VIEWS_UPDATED_EVENT = "apple-mdm-resource-views-updated";
const EMPTY_RESOURCE_VIEWS: ResourceView[] = [];

let cachedRaw: string | null = null;
let cachedViews: ResourceView[] = EMPTY_RESOURCE_VIEWS;

export function saveResourceView(view: Omit<ResourceView, "viewedAt">): void {
  if (typeof window === "undefined") return;
  const existing = loadResourceViews().filter((v) => v.resourceSlug !== view.resourceSlug);
  const updated = [{ ...view, viewedAt: Date.now() }, ...existing].slice(0, MAX_VIEWS);
  const raw = JSON.stringify(updated);
  cachedRaw = raw;
  cachedViews = updated;
  localStorage.setItem(VIEWS_KEY, raw);
  window.dispatchEvent(new CustomEvent(RESOURCE_VIEWS_UPDATED_EVENT));
}

export function loadResourceViews(): ResourceView[] {
  if (typeof window === "undefined") return EMPTY_RESOURCE_VIEWS;
  try {
    const raw = localStorage.getItem(VIEWS_KEY);
    if (raw === cachedRaw) return cachedViews;

    cachedRaw = raw;
    cachedViews = raw ? (JSON.parse(raw) as ResourceView[]) : EMPTY_RESOURCE_VIEWS;
    return cachedViews;
  } catch {
    cachedRaw = null;
    cachedViews = EMPTY_RESOURCE_VIEWS;
    return EMPTY_RESOURCE_VIEWS;
  }
}

export function subscribeToResourceViews(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = (event: StorageEvent) => {
    if (event.key === VIEWS_KEY) callback();
  };
  const onCustom = () => callback();
  window.addEventListener("storage", onStorage);
  window.addEventListener(RESOURCE_VIEWS_UPDATED_EVENT, onCustom);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(RESOURCE_VIEWS_UPDATED_EVENT, onCustom);
  };
}

export function getRecentlyViewedResourceSlugs(limit = 5): string[] {
  return loadResourceViews().slice(0, limit).map((v) => v.resourceSlug);
}
