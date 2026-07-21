"use client";

import { useMemo, useState, useCallback } from "react";
import { Badge, Card } from "@/components/ui";
import type {
  VisualAsset,
  VisualAssetEcosystem,
  VisualAssetType,
  VisualAssetVerificationStatus,
} from "@/lib/visual-assets/asset-types";
import {
  filterVisualAssets,
  getVisualAssetCategories,
  visualAssetStats,
} from "@/lib/visual-assets/asset-registry";

const ECOSYSTEMS: VisualAssetEcosystem[] = ["apple", "jamf", "microsoft", "neutral"];
const TYPES: VisualAssetType[] = ["icon", "component", "connector", "badge", "logo", "freeform-board"];
const STATUSES: VisualAssetVerificationStatus[] = ["original", "official-asset", "to-verify"];
const PREVIEW_SIZES = [24, 32, 48, 64] as const;

const ECOSYSTEM_LABEL: Record<VisualAssetEcosystem, string> = {
  apple: "Apple",
  jamf: "Jamf",
  microsoft: "Microsoft",
  neutral: "Neutre",
};

const STATUS_VARIANT: Record<VisualAssetVerificationStatus, "default" | "accent" | "dark"> = {
  original: "dark",
  "official-asset": "default",
  "to-verify": "accent",
};

export function VisualAssetGallery() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [ecosystem, setEcosystem] = useState<VisualAssetEcosystem | "">("");
  const [type, setType] = useState<VisualAssetType | "">("");
  const [freeformOnly, setFreeformOnly] = useState(false);
  const [status, setStatus] = useState<VisualAssetVerificationStatus | "">("");
  const [darkBg, setDarkBg] = useState(false);
  const [previewSize, setPreviewSize] = useState<(typeof PREVIEW_SIZES)[number]>(48);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = useMemo(() => getVisualAssetCategories(), []);

  const filtered = useMemo(
    () =>
      filterVisualAssets({
        query,
        category: category || undefined,
        ecosystem: ecosystem || undefined,
        type: type || undefined,
        freeformReady: freeformOnly ? true : undefined,
        verificationStatus: status || undefined,
      }),
    [query, category, ecosystem, type, freeformOnly, status]
  );

  const copyPath = useCallback(async (asset: VisualAsset) => {
    await navigator.clipboard.writeText(asset.path);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="p-4">
          <p className="text-sm text-ink-tertiary">Total assets</p>
          <p className="text-2xl font-bold text-accent">{visualAssetStats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-ink-tertiary">Freeform ready</p>
          <p className="text-2xl font-bold text-accent">{visualAssetStats.freeformReady}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-ink-tertiary">Icônes</p>
          <p className="text-2xl font-bold text-accent">{visualAssetStats.byType.icon ?? 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-ink-tertiary">Composants</p>
          <p className="text-2xl font-bold text-accent">
            {(visualAssetStats.byType.component ?? 0) +
              (visualAssetStats.byType.connector ?? 0) +
              (visualAssetStats.byType.badge ?? 0)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-ink-tertiary">Résultats filtrés</p>
          <p className="text-2xl font-bold text-accent">{filtered.length}</p>
        </Card>
      </div>

      <Card className="space-y-4 p-5">
        <div className="flex flex-wrap gap-3">
          <input
            type="search"
            placeholder="Rechercher par nom, tag, chemin…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-w-[220px] flex-1 rounded-xl border border-border-light bg-surface px-4 py-2 text-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-border-light bg-surface px-3 py-2 text-sm"
          >
            <option value="">Toutes catégories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={ecosystem}
            onChange={(e) => setEcosystem(e.target.value as VisualAssetEcosystem | "")}
            className="rounded-xl border border-border-light bg-surface px-3 py-2 text-sm"
          >
            <option value="">Tous écosystèmes</option>
            {ECOSYSTEMS.map((e) => (
              <option key={e} value={e}>
                {ECOSYSTEM_LABEL[e]}
              </option>
            ))}
          </select>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as VisualAssetType | "")}
            className="rounded-xl border border-border-light bg-surface px-3 py-2 text-sm"
          >
            <option value="">Tous types</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as VisualAssetVerificationStatus | "")}
            className="rounded-xl border border-border-light bg-surface px-3 py-2 text-sm"
          >
            <option value="">Tous statuts</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={freeformOnly}
              onChange={(e) => setFreeformOnly(e.target.checked)}
            />
            Compatible Freeform
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={darkBg} onChange={(e) => setDarkBg(e.target.checked)} />
            Fond sombre
          </label>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-ink-tertiary">Aperçu :</span>
            {PREVIEW_SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setPreviewSize(s)}
                className={`rounded-lg px-2 py-1 ${previewSize === s ? "bg-accent text-white" : "bg-surface text-ink-secondary"}`}
              >
                {s}px
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            darkBg={darkBg}
            previewSize={previewSize}
            copied={copiedId === asset.id}
            onCopy={() => copyPath(asset)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-ink-tertiary">Aucun asset ne correspond aux filtres.</p>
      )}
    </div>
  );
}

function AssetCard({
  asset,
  darkBg,
  previewSize,
  copied,
  onCopy,
}: {
  asset: VisualAsset;
  darkBg: boolean;
  previewSize: number;
  copied: boolean;
  onCopy: () => void;
}) {
  const isWide = asset.type === "component" || asset.type === "connector" || asset.type === "freeform-board";

  return (
    <Card className="flex flex-col overflow-hidden">
      <div
        className={`flex min-h-[120px] items-center justify-center p-4 ${darkBg ? "bg-gray-900" : "bg-surface"}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset.path}
          alt={asset.name}
          width={isWide ? previewSize * 2 : previewSize}
          height={previewSize}
          className={`max-h-24 object-contain ${darkBg ? "brightness-0 invert" : ""}`}
          style={{ width: isWide ? "auto" : previewSize, height: previewSize }}
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="font-semibold text-ink line-clamp-2">{asset.name}</p>
        <p className="font-mono text-xs text-ink-tertiary break-all">{asset.path}</p>
        <div className="flex flex-wrap gap-1">
          <Badge variant="default">{ECOSYSTEM_LABEL[asset.ecosystem]}</Badge>
          <Badge variant={STATUS_VARIANT[asset.verificationStatus]}>{asset.verificationStatus}</Badge>
          {asset.freeformReady && <Badge variant="accent">Freeform</Badge>}
        </div>
        <p className="text-xs text-ink-secondary line-clamp-2">{asset.description}</p>
        <div className="mt-auto flex gap-2 pt-2">
          <button
            type="button"
            onClick={onCopy}
            className="rounded-lg border border-border-light px-3 py-1.5 text-xs font-semibold hover:bg-surface"
          >
            {copied ? "Copié ✓" : "Copier chemin"}
          </button>
          <a
            href={asset.path}
            download
            className="rounded-lg border border-border-light px-3 py-1.5 text-xs font-semibold hover:bg-surface"
          >
            Télécharger
          </a>
        </div>
      </div>
    </Card>
  );
}
