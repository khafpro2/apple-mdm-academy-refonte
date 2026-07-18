import { NextResponse, type NextRequest } from "next/server";
import { V1_REMOVED_TRACK_SLUGS } from "@/lib/data/v1-scope";

/** Segments d'URL liés aux parcours retirés / masqués hors V1. */
const BLOCKED_SEGMENTS = new Set<string>([...V1_REMOVED_TRACK_SLUGS]);

const BLOCKED_PREFIXES = [
  "/parcours/",
  "/cours/",
  "/quiz/",
  "/labs/",
  "/examens/",
  "/resources/",
  "/videos/",
  "/revision/",
] as const;

function isBlockedSegment(segment: string): boolean {
  if (BLOCKED_SEGMENTS.has(segment)) return true;
  if (/^(kandji|mosyle|addigy|workspace-one)(-|$)/i.test(segment)) return true;
  if (/^(examen|quiz)-(kandji|mosyle|addigy|workspace-one)/i.test(segment)) return true;
  return false;
}

/**
 * Renvoie une 404 HTTP réelle pour les contenus hors périmètre V1
 * (évite le status 200 lié au streaming + notFound()).
 */
export function blockRemovedV1Paths(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  for (const prefix of BLOCKED_PREFIXES) {
    if (!pathname.startsWith(prefix)) continue;
    const rest = pathname.slice(prefix.length);
    const segment = rest.split("/")[0] ?? "";
    if (!segment) continue;
    if (!isBlockedSegment(segment)) continue;

    const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"/><title>Page introuvable | Apple MDM Academy</title><meta name="robots" content="noindex"/></head><body style="font-family:system-ui;max-width:40rem;margin:4rem auto;padding:0 1rem"><h1>Page introuvable</h1><p>Ce contenu n'existe pas ou a été retiré du catalogue V1 (Apple, Jamf, Microsoft Intune).</p><p><a href="/parcours">Voir les parcours</a> · <a href="/">Accueil</a></p></body></html>`;
    return new NextResponse(html, {
      status: 404,
      statusText: "Not Found",
      headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex" },
    });
  }
  return null;
}
