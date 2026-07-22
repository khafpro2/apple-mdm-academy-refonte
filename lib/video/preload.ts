import type { VideoMetadata, VideoSource } from "@/lib/video/types";

const preloaded = new Set<string>();

/** Choisit la source optimale selon la largeur d'écran et la connexion */
export function selectPreferredSource(
  sources: VideoSource[] | undefined,
  viewportWidth: number
): VideoSource | undefined {
  if (!sources?.length) return undefined;
  if (sources.length === 1) return sources[0];

  const connection = typeof navigator !== "undefined"
    ? (navigator as Navigator & { connection?: { effectiveType?: string } }).connection
    : undefined;
  const slow = connection?.effectiveType === "2g" || connection?.effectiveType === "slow-2g";

  const sorted = [...sources].sort((a, b) => (a.bandwidthKbps ?? 0) - (b.bandwidthKbps ?? 0));
  if (slow || viewportWidth < 640) return sorted[0];
  if (viewportWidth < 1024) return sorted[Math.floor(sorted.length / 2)] ?? sorted[0];
  return sorted[sorted.length - 1];
}

/** Précharge poster + première source (une seule fois par slug) */
export function preloadVideoAssets(metadata: VideoMetadata): void {
  if (typeof document === "undefined" || preloaded.has(metadata.slug)) return;
  preloaded.add(metadata.slug);

  if (metadata.posterUrl) {
    const img = new Image();
    img.decoding = "async";
    img.src = metadata.posterUrl;
  }

  const source = metadata.sources?.[0];
  if (source?.format === "mp4" || source?.format === "webm") {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = source.src;
    document.head.appendChild(link);
  }
}

/** Réinitialise le cache de préchargement (tests) */
export function resetPreloadCache(): void {
  preloaded.clear();
}
