import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/ui";
import { MotionAssetCard } from "@/components/motion/motion-asset-card";
import { MotionSceneCard } from "@/components/motion/motion-scene-card";
import { MotionValidationSummary } from "@/components/motion/motion-validation-summary";
import {
  getMotionAssetsForScene,
  getMotionIssuesForScene,
  getMotionScenes,
  getMotionValidationIssues,
  motionAssets,
} from "@/lib/motion/registry";
import { motionAssetFileExists } from "@/lib/motion/media-path";

export const metadata = {
  title: "Motion Design assets (admin)",
  description: "Galerie interne de contrôle du registre Motion Design — non publique.",
  robots: { index: false, follow: false },
};

function fileExistsForAssetPath(assetPath: string | undefined): boolean {
  return motionAssetFileExists(process.cwd(), assetPath);
}

type SearchParams = Promise<{ scene?: string; status?: string; category?: string }>;

export default async function AdminMotionAssetsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const scenes = getMotionScenes();
  const selectedScene =
    scenes.find((scene) => scene.slug === params.scene) ??
    scenes.find((scene) => scene.id === "scene-002-filevault-encryption") ??
    scenes[0];

  const sceneAssets = selectedScene ? getMotionAssetsForScene(selectedScene) : [];
  const filteredAssets = sceneAssets.filter((asset) => {
    if (params.status && asset.status !== params.status) return false;
    if (params.category && asset.category !== params.category) return false;
    return true;
  });

  const issues = selectedScene
    ? getMotionIssuesForScene(selectedScene)
    : getMotionValidationIssues();

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/admin" className="text-sm font-semibold text-accent hover:underline">
            ← Admin
          </Link>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
            Interne — non indexé
          </span>
        </div>

        <div className="mt-6">
          <SectionHeading
            label="Motion Design"
            title="Galerie de contrôle des assets"
            description="Source de vérité : media/motion/registry/*.json. Médias physiques : public/motion/**. Aucun média fictif n’est affiché."
          />
        </div>

        <p className="mt-4 text-sm text-ink-secondary">
          Protection : <code className="rounded bg-surface px-1">requireAdmin</code> via{" "}
          <code className="rounded bg-surface px-1">app/admin/layout.tsx</code> +{" "}
          <code className="rounded bg-surface px-1">robots: noindex</code>. Audit CLI :{" "}
          <code className="rounded bg-surface px-1">npm run audit:motion-assets</code>.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {scenes.map((scene) => (
            <MotionSceneCard key={scene.id} scene={scene} />
          ))}
        </div>

        {selectedScene && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-ink">{selectedScene.title}</h2>
                <p className="mt-1 text-sm text-ink-secondary">
                  {filteredAssets.length} / {sceneAssets.length} assets · registre global :{" "}
                  {motionAssets.length}
                </p>
              </div>
              <form className="flex flex-wrap gap-2" method="get">
                <input type="hidden" name="scene" value={selectedScene.slug} />
                <label className="text-xs font-semibold text-ink-tertiary">
                  Statut
                  <select
                    name="status"
                    defaultValue={params.status ?? ""}
                    className="mt-1 block rounded-lg border border-border-light bg-surface px-3 py-2 text-sm text-ink"
                  >
                    <option value="">Tous</option>
                    <option value="missing">missing</option>
                    <option value="brief-ready">brief-ready</option>
                    <option value="generated">generated</option>
                    <option value="review">review</option>
                    <option value="approved">approved</option>
                    <option value="deprecated">deprecated</option>
                  </select>
                </label>
                <label className="text-xs font-semibold text-ink-tertiary">
                  Catégorie
                  <select
                    name="category"
                    defaultValue={params.category ?? ""}
                    className="mt-1 block rounded-lg border border-border-light bg-surface px-3 py-2 text-sm text-ink"
                  >
                    <option value="">Toutes</option>
                    <option value="device">device</option>
                    <option value="security">security</option>
                    <option value="data-flow">data-flow</option>
                    <option value="identity">identity</option>
                  </select>
                </label>
                <button
                  type="submit"
                  className="self-end rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                >
                  Filtrer
                </button>
              </form>
            </div>

            <MotionValidationSummary issues={issues} />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredAssets.map((asset) => (
                <MotionAssetCard
                  key={asset.id}
                  asset={asset}
                  fileExistsOnDisk={fileExistsForAssetPath(asset.path)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
