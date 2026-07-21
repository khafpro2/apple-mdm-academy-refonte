import { PageShell } from "@/components/layout/page-shell";
import { MotionSceneCard } from "@/components/motion/motion-scene-card";
import { MotionValidationSummary } from "@/components/motion/motion-validation-summary";
import { getMotionScenes, getMotionValidationIssues, motionAssets } from "@/lib/motion/registry";

export const metadata = {
  title: "Motion Library",
  robots: { index: false, follow: false },
};

export default function MotionLibraryPage() {
  const scenes = getMotionScenes();
  const issues = getMotionValidationIssues();

  return (
    <PageShell>
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase text-accent">Production interne</p>
            <h1 className="mt-2 text-3xl font-bold text-ink">Motion Library</h1>
            <p className="mt-3 max-w-3xl text-ink-secondary">
              Source de suivi des scenes et assets Motion Design utilises pour preparer les illustrations de cours.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-border-light bg-surface-elevated p-3 text-center">
              <p className="text-xs font-semibold text-ink-tertiary">Scenes</p>
              <p className="mt-1 text-xl font-bold text-ink">{scenes.length}</p>
            </div>
            <div className="rounded-lg border border-border-light bg-surface-elevated p-3 text-center">
              <p className="text-xs font-semibold text-ink-tertiary">Assets</p>
              <p className="mt-1 text-xl font-bold text-ink">{motionAssets.length}</p>
            </div>
          </div>
        </div>

        <MotionValidationSummary issues={issues} />

        <section className="mt-8 grid gap-5 lg:grid-cols-2">
          {scenes.map((scene) => (
            <MotionSceneCard key={scene.id} scene={scene} />
          ))}
        </section>
      </main>
    </PageShell>
  );
}
