import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { MotionAssetCard } from "@/components/motion/motion-asset-card";
import { MotionSceneMetadata } from "@/components/motion/motion-scene-card";
import { MotionStatusBadge } from "@/components/motion/motion-status";
import { MotionValidationSummary } from "@/components/motion/motion-validation-summary";
import {
  getMotionAssetsForScene,
  getMotionIssuesForScene,
  getMotionSceneBySlug,
} from "@/lib/motion/registry";

export const metadata = {
  title: "Motion Library — FileVault",
  robots: { index: false, follow: false },
};

export default function FileVaultMotionScenePage() {
  const scene = getMotionSceneBySlug("filevault-encryption");
  if (!scene) notFound();

  const assets = getMotionAssetsForScene(scene);
  const issues = getMotionIssuesForScene(scene);
  const availableAssets = assets.filter((asset) => Boolean(asset.path)).length;

  return (
    <PageShell>
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <Link
          href="/motion-library"
          className="inline-flex min-h-10 items-center text-sm font-semibold text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Retour Motion Library
        </Link>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase text-accent">{scene.id}</p>
            <h1 className="mt-2 text-3xl font-bold text-ink">{scene.title}</h1>
            <p className="mt-3 max-w-3xl text-ink-secondary">{scene.objective}</p>
          </div>
          <MotionStatusBadge status={scene.status} />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border-light bg-surface-elevated p-4">
            <p className="text-xs font-semibold text-ink-tertiary">Assets disponibles</p>
            <p className="mt-1 text-2xl font-bold text-ink">
              {availableAssets}/{assets.length}
            </p>
          </div>
          <div className="rounded-lg border border-border-light bg-surface-elevated p-4">
            <p className="text-xs font-semibold text-ink-tertiary">Duree cible</p>
            <p className="mt-1 text-2xl font-bold text-ink">{scene.durationSeconds} s</p>
          </div>
          <div className="rounded-lg border border-border-light bg-surface-elevated p-4">
            <p className="text-xs font-semibold text-ink-tertiary">Media final</p>
            <p className="mt-1 text-sm font-semibold text-ink-secondary">Non produit</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-bold text-ink">Assets requis</h2>
              <div className="mt-4 grid gap-5 md:grid-cols-2">
                {assets.map((asset) => (
                  <MotionAssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <MotionSceneMetadata scene={scene} />
            <MotionValidationSummary issues={issues} />
          </aside>
        </div>
      </main>
    </PageShell>
  );
}
