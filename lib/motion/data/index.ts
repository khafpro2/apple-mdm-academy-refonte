/**
 * Source de vérité motion — Option A (fichiers TypeScript).
 *
 * Choix documenté :
 * - Le dépôt utilise déjà des registres typés (`lib/data/**`, `src/lib/video-*`).
 * - Pas de dossier `content/` ni de MDX.
 * - Les JSON sous `data/` servent aux inventaires fichiers (screenshots, pilot MP4),
 *   pas aux graphes de scènes riches.
 *
 * Une seule source : `lib/motion/data/**`. Pas de registre généré dupliqué.
 * Importer via `@/lib/motion/registry`.
 */
export { motionScenes, filevaultScene } from "@/lib/motion/data/scenes";
export { motionAssets, filevaultAssets } from "@/lib/motion/data/assets";
export { ALLOWED_MOTION_PATH_PREFIXES, isAllowedMotionPath, MOTION_MEDIA_ROOT } from "@/lib/motion/data/allowed-paths";
