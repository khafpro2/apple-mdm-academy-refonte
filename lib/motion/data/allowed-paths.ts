/**
 * Préfixes de chemins autorisés pour les assets / médias motion.
 * Tout chemin hors de cette liste est rejeté par les validateurs.
 */
export const ALLOWED_MOTION_PATH_PREFIXES = [
  "/media/motion/",
  "/video-assets/",
  "/videos/",
  "/images/courses/",
  "/illustrations/",
  "/visual-assets/",
  "/resources/",
] as const;

export function isAllowedMotionPath(path: string): boolean {
  if (!path.startsWith("/")) return false;
  if (path.includes("..")) return false;
  if (path.includes("://")) return false;
  return ALLOWED_MOTION_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));
}

/** Racine publique attendue pour les médias motion dédiés. */
export const MOTION_MEDIA_ROOT = "/media/motion";
