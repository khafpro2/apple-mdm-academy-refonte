/** URL de base du site (prod Vercel ou local) */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "http://localhost:3000";
}

/** Chemin de callback auth — toujours /auth/callback */
export function getAuthCallbackPath(redirect = "/dashboard"): string {
  const safe = sanitizeRedirectPath(redirect);
  return `/auth/callback?redirect=${encodeURIComponent(safe)}`;
}

/** URL complète du callback pour emailRedirectTo Supabase */
export function getAuthCallbackUrl(redirect = "/dashboard"): string {
  return `${getSiteUrl()}${getAuthCallbackPath(redirect)}`;
}

/** Empêche les open-redirects */
export function sanitizeRedirectPath(path: string | null, fallback = "/dashboard"): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return fallback;
  }
  return path;
}
