import { existsSync } from "node:fs";
import path from "node:path";
import {
  getStaticCaptionsPublicPath,
} from "@/lib/video/captions-shared";

export {
  buildWebVttFromTranscript,
  formatWebVttTimestamp,
  getStaticCaptionsPublicPath,
} from "@/lib/video/captions-shared";

export function staticCaptionsFileExists(
  repoRoot: string,
  slug: string,
  locale = "fr"
): boolean {
  const relative = getStaticCaptionsPublicPath(slug, locale).replace(/^\//, "");
  return existsSync(path.join(repoRoot, "public", relative));
}

/**
 * URL de captions à brancher sur `<track>`.
 * Priorité : fichier statique → route API dérivée du transcript.
 * Server-only (filesystem).
 */
export function resolveCaptionsSrc(
  slug: string,
  options: { repoRoot?: string; hasTranscript?: boolean; locale?: string } = {}
): string | undefined {
  const locale = options.locale ?? "fr";
  const root = options.repoRoot ?? process.cwd();
  if (staticCaptionsFileExists(root, slug, locale)) {
    return getStaticCaptionsPublicPath(slug, locale);
  }
  if (options.hasTranscript) {
    return `/api/videos/${encodeURIComponent(slug)}/captions`;
  }
  return undefined;
}
