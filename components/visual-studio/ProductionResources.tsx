import type { ProductionResource, StoryboardScene } from "@/lib/visual-studio/types";
import { visualStudioColors } from "@/lib/visual-studio/visual-tokens";

type ProductionResourcesProps = {
  resources: ProductionResource[];
  className?: string;
};

const TOOL_LABELS: Record<ProductionResource["tool"], string> = {
  canva: "Canva",
  firefly: "Adobe Firefly",
  heygen: "HeyGen",
  freeform: "Apple Freeform",
  playwright: "Playwright",
};

export function ProductionResources({ resources, className = "" }: ProductionResourcesProps) {
  return (
    <section className={className} aria-labelledby="production-resources-title">
      <h3
        id="production-resources-title"
        className="text-lg font-semibold"
        style={{ color: visualStudioColors.navy }}
      >
        Ressources de production
      </h3>
      <p className="mt-1 text-sm" style={{ color: visualStudioColors.muted }}>
        Plan de montage pour Canva, Adobe Firefly, HeyGen et Freeform.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {resources.map((resource) => (
          <article
            key={resource.id}
            className="rounded-2xl border p-5"
            style={{ backgroundColor: visualStudioColors.surface, borderColor: visualStudioColors.border }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: visualStudioColors.blue }}>
              {TOOL_LABELS[resource.tool]}
            </p>
            <h4 className="mt-1 text-sm font-semibold" style={{ color: visualStudioColors.text }}>
              {resource.title}
            </h4>
            <ul className="mt-3 space-y-1.5">
              {resource.instructions.map((item) => (
                <li key={item} className="text-sm leading-relaxed" style={{ color: visualStudioColors.muted }}>
                  · {item}
                </li>
              ))}
            </ul>
            {resource.prompt ? (
              <pre
                className="mt-3 overflow-x-auto rounded-xl p-3 text-[11px] leading-relaxed"
                style={{ backgroundColor: visualStudioColors.background, color: visualStudioColors.text }}
              >
                {resource.prompt}
              </pre>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

type SceneProductionToolsProps = {
  scene: StoryboardScene;
};

export function SceneProductionTools({ scene }: SceneProductionToolsProps) {
  const hasAny =
    scene.fireflyPrompt ||
    (scene.canvaInstructions && scene.canvaInstructions.length > 0) ||
    (scene.heygenInstructions && scene.heygenInstructions.length > 0);

  if (!hasAny) return null;

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wide" style={{ color: visualStudioColors.muted }}>
        Outils de production
      </h4>
      {scene.fireflyPrompt ? (
        <details className="rounded-xl border p-3" style={{ borderColor: visualStudioColors.border }}>
          <summary
            className="cursor-pointer text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: visualStudioColors.purple, outlineColor: visualStudioColors.blue }}
          >
            Adobe Firefly
          </summary>
          <pre className="mt-2 whitespace-pre-wrap text-[11px] leading-relaxed" style={{ color: visualStudioColors.text }}>
            {scene.fireflyPrompt}
          </pre>
        </details>
      ) : null}
      {scene.canvaInstructions?.length ? (
        <details className="rounded-xl border p-3" style={{ borderColor: visualStudioColors.border }}>
          <summary
            className="cursor-pointer text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: visualStudioColors.blue, outlineColor: visualStudioColors.blue }}
          >
            Canva
          </summary>
          <ul className="mt-2 space-y-1">
            {scene.canvaInstructions.map((item) => (
              <li key={item} className="text-sm" style={{ color: visualStudioColors.muted }}>
                · {item}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
      {scene.heygenInstructions?.length ? (
        <details className="rounded-xl border p-3" style={{ borderColor: visualStudioColors.border }}>
          <summary
            className="cursor-pointer text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: visualStudioColors.cyan, outlineColor: visualStudioColors.blue }}
          >
            HeyGen
          </summary>
          <ul className="mt-2 space-y-1">
            {scene.heygenInstructions.map((item) => (
              <li key={item} className="text-sm" style={{ color: visualStudioColors.muted }}>
                · {item}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}
