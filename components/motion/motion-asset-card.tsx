import type { AssetMetadata } from "@/lib/motion/asset-types";
import { MotionStatusBadge } from "@/components/motion/motion-status";

function MotionAssetPlaceholder({ asset }: { asset: AssetMetadata }) {
  return (
    <div className="flex aspect-square min-h-40 items-center justify-center rounded-lg border border-dashed border-border-light bg-surface text-center">
      <div className="px-4">
        <p className="text-sm font-semibold text-ink">Asset non encore produit</p>
        <p className="mt-1 text-xs text-ink-tertiary">{asset.format.toUpperCase()} attendu</p>
      </div>
    </div>
  );
}

export function MotionAssetCard({
  asset,
  fileExistsOnDisk = false,
}: {
  asset: AssetMetadata;
  /** Server-verified existence under media/motion/assets — never invent a path. */
  fileExistsOnDisk?: boolean;
}) {
  const canPreview = Boolean(asset.path) && fileExistsOnDisk;

  return (
    <article className="rounded-lg border border-border-light bg-surface-elevated p-4">
      {canPreview ? (
        <div className="flex aspect-square min-h-40 items-center justify-center rounded-lg border border-border-light bg-white p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset.path}
            alt={asset.decorative ? "" : asset.altText}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      ) : (
        <MotionAssetPlaceholder asset={asset} />
      )}

      <div className="mt-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-ink">{asset.name}</h3>
          <p className="mt-1 break-all text-xs text-ink-tertiary">{asset.id}</p>
        </div>
        <MotionStatusBadge status={asset.status} />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{asset.description}</p>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <dt className="font-semibold text-ink-tertiary">Categorie</dt>
          <dd className="mt-1 text-ink">{asset.category}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink-tertiary">Format</dt>
          <dd className="mt-1 text-ink">{asset.format}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink-tertiary">Dimensions</dt>
          <dd className="mt-1 text-ink">{asset.dimensions}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink-tertiary">Source</dt>
          <dd className="mt-1 text-ink">{asset.source}</dd>
        </div>
      </dl>

      <div className="mt-4 rounded-lg border border-border-light bg-surface p-3">
        <p className="text-xs font-semibold text-ink-tertiary">Alt text</p>
        <p className="mt-1 text-sm text-ink-secondary">
          {asset.decorative ? "Decoratif : alt text vide" : asset.altText}
        </p>
      </div>

      {asset.path && !fileExistsOnDisk && (
        <p className="mt-3 text-xs font-medium text-red-800">
          Chemin declare mais fichier absent sur disque — corriger le registre ou ajouter le fichier.
        </p>
      )}

      {!asset.path && (
        <p className="mt-3 text-xs font-medium text-amber-800">
          Fichier manquant volontairement : aucun chemin n&apos;est declare tant que l&apos;asset
          n&apos;existe pas.
        </p>
      )}
    </article>
  );
}
