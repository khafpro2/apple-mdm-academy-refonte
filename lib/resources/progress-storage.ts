/** Progression et historique ressources — localStorage côté client */

export type ResourceView = {
  resourceSlug: string;
  title: string;
  href: string;
  viewedAt: number;
};

const VIEWS_KEY = "apple-mdm-resource-views";
const MAX_VIEWS = 20;

export function saveResourceView(view: Omit<ResourceView, "viewedAt">): void {
  if (typeof window === "undefined") return;
  const existing = loadResourceViews().filter((v) => v.resourceSlug !== view.resourceSlug);
  const updated = [{ ...view, viewedAt: Date.now() }, ...existing].slice(0, MAX_VIEWS);
  localStorage.setItem(VIEWS_KEY, JSON.stringify(updated));
}

export function loadResourceViews(): ResourceView[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VIEWS_KEY);
    return raw ? (JSON.parse(raw) as ResourceView[]) : [];
  } catch {
    return [];
  }
}

export function getRecentlyViewedResourceSlugs(limit = 5): string[] {
  return loadResourceViews().slice(0, limit).map((v) => v.resourceSlug);
}
