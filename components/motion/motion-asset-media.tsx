import type { AssetMetadata } from "@/lib/motion/asset-types";
import { isPreviewableMotionFormat } from "@/lib/motion/media-path";

function MotionAssetPlaceholder({
  asset,
  reason,
}: {
  asset: AssetMetadata;
  reason: "missing-path" | "missing-file" | "unsupported-format";
}) {
  const copy =
    reason === "unsupported-format"
      ? {
          title: "Aperçu non disponible",
          detail: `Format ${asset.format.toUpperCase()} non prévisualisable ici`,
        }
      : reason === "missing-file"
        ? {
            title: "Fichier absent sur disque",
            detail: asset.path ?? "chemin manquant",
          }
        : {
            title: "Asset non encore produit",
            detail: `${asset.format.toUpperCase()} attendu`,
          };

  return (
    <div className="flex aspect-square min-h-40 items-center justify-center rounded-lg border border-dashed border-border-light bg-surface text-center">
      <div className="px-4">
        <p className="text-sm font-semibold text-ink">{copy.title}</p>
        <p className="mt-1 break-all text-xs text-ink-tertiary">{copy.detail}</p>
      </div>
    </div>
  );
}

/**
 * Loads a Motion asset preview from its registry `path` when the file exists.
 * Supports SVG, WebP, PNG, and JPG via a plain `<img>` (no fabricated media).
 */
export function MotionAssetMedia({
  asset,
  fileExistsOnDisk = false,
}: {
  asset: AssetMetadata;
  fileExistsOnDisk?: boolean;
}) {
  if (!asset.path) {
    return <MotionAssetPlaceholder asset={asset} reason="missing-path" />;
  }

  if (!fileExistsOnDisk) {
    return <MotionAssetPlaceholder asset={asset} reason="missing-file" />;
  }

  if (!isPreviewableMotionFormat(asset.format)) {
    return <MotionAssetPlaceholder asset={asset} reason="unsupported-format" />;
  }

  return (
    <div className="flex aspect-square min-h-40 items-center justify-center rounded-lg border border-border-light bg-white p-4">
      {/* eslint-disable-next-line @next/next/no-img-element -- registry paths are local public URLs; formats include SVG */}
      <img
        src={asset.path}
        alt={asset.decorative ? "" : asset.altText}
        className="max-h-full max-w-full object-contain"
        loading="lazy"
        decoding="async"
        data-motion-format={asset.format}
      />
    </div>
  );
}
