import { notFound } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import {
  getCourseStoryboard,
  listCourseStoryboards,
  buildExportPlan,
  buildProductionMarkdown,
  architectureLinearFlowToSvg,
} from "@/lib/visual-studio";
import { CourseVisualHeader } from "@/components/visual-studio/CourseVisualHeader";
import { StoryboardSceneCard } from "@/components/visual-studio/StoryboardSceneCard";
import { ArchitectureDiagram } from "@/components/visual-studio/ArchitectureDiagram";
import { FlowConnectorLegend } from "@/components/visual-studio/FlowConnector";
import { ProductionResources } from "@/components/visual-studio/ProductionResources";
import { FreeformBoard } from "@/components/visual-studio/FreeformBoard";
import { visualStudioColors } from "@/lib/visual-studio/visual-tokens";
import { buildPageMetadata } from "@/lib/seo/metadata";

type PageProps = {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ view?: string; scene?: string }>;
};

export async function generateStaticParams() {
  return listCourseStoryboards().map((b) => ({ courseId: b.courseId }));
}

export async function generateMetadata({ params }: PageProps) {
  const { courseId } = await params;
  const board = getCourseStoryboard(courseId);
  if (!board) {
    return buildPageMetadata({
      title: "Studio visuel",
      description: "Storyboard introuvable",
      path: `/studio-visuel/${courseId}`,
      noIndex: true,
    });
  }
  return buildPageMetadata({
    title: `${board.courseTitle} — Studio visuel`,
    description: board.learningObjective,
    path: `/studio-visuel/${board.courseId}`,
  });
}

export default async function StudioVisuelCoursePage({ params, searchParams }: PageProps) {
  const { courseId } = await params;
  const { view, scene: sceneFilter } = await searchParams;
  const storyboard = getCourseStoryboard(courseId);
  if (!storyboard) notFound();

  const exportPlan = buildExportPlan(storyboard);
  const isPrint = view === "print";
  const isFreeform = view === "freeform";
  const scenes = sceneFilter
    ? storyboard.scenes.filter((s) => s.id === sceneFilter)
    : storyboard.scenes;

  const svg = architectureLinearFlowToSvg(
    storyboard.architecture.title,
    storyboard.architecture.linearFlow,
  );

  return (
    <PageShell>
      <div
        className={`mx-auto px-6 py-12 lg:px-8 lg:py-16 ${isPrint ? "max-w-5xl print:max-w-none print:px-0 print:py-0" : "max-w-7xl"}`}
      >
        <nav className="mb-6 print:hidden" aria-label="Fil d’Ariane">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-secondary">
            <li>
              <Link href="/studio-visuel" className="hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                Studio visuel
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-ink">{storyboard.courseTitle}</li>
          </ol>
        </nav>

        {!isFreeform && <CourseVisualHeader storyboard={storyboard} />}

        {isFreeform ? (
          <div className="mt-6">
            <div className="mb-4 print:hidden">
              <Link
                href={`/studio-visuel/${courseId}`}
                className="text-sm font-semibold text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                ← Retour au storyboard
              </Link>
            </div>
            <FreeformBoard storyboard={storyboard} />
          </div>
        ) : (
          <>
            <section className="mt-10" aria-labelledby="architecture-heading">
              <h2 id="architecture-heading" className="text-xl font-bold text-ink">
                Diagramme d’architecture
              </h2>
              <p className="mt-1 text-sm text-ink-secondary">
                Services cloud, appareils, administrateurs et flux ADE.
              </p>
              <div className="mt-4">
                <ArchitectureDiagram architecture={storyboard.architecture} />
              </div>
              <FlowConnectorLegend className="mt-4" />
            </section>

            <section className="mt-12" aria-labelledby="storyboard-heading">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 id="storyboard-heading" className="text-xl font-bold text-ink">
                    Storyboard ({scenes.length} scènes)
                  </h2>
                  <p className="mt-1 text-sm text-ink-secondary">
                    Cartes 16:9 · narration · animations · consignes production
                  </p>
                </div>
                <Link
                  href={`/studio-visuel/${courseId}?view=freeform`}
                  className="text-sm font-semibold text-accent hover:underline print:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Ouvrir Freeform
                </Link>
              </div>

              <div className="mt-6 space-y-8">
                {scenes.map((scene) => (
                  <StoryboardSceneCard
                    key={scene.id}
                    scene={scene}
                    architecture={storyboard.architecture}
                    mode={isPrint ? "export" : "preview"}
                  />
                ))}
              </div>
            </section>

            <div className="mt-12">
              <ProductionResources resources={storyboard.productionResources} />
            </div>

            <section className="mt-12 print:hidden" aria-labelledby="exports-heading">
              <h2 id="exports-heading" className="text-xl font-bold text-ink">
                Exports
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-ink-secondary">
                <li>
                  PNG scènes :{" "}
                  {exportPlan.scenes.map((s) => s.pngFilename).join(", ")} via{" "}
                  <code className="rounded bg-surface px-1">npm run export:storyboards</code>
                </li>
                <li>
                  SVG diagramme :{" "}
                  <code className="rounded bg-surface px-1">{exportPlan.svgDiagrams[0]?.svgFilename}</code>
                </li>
                <li>
                  Imprimable :{" "}
                  <Link href={exportPlan.printableUrl} className="font-semibold text-accent hover:underline">
                    ?view=print
                  </Link>
                </li>
              </ul>

              <details className="mt-4 rounded-2xl border border-border-light bg-surface-elevated p-4">
                <summary className="cursor-pointer text-sm font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                  Aperçu SVG du flux linéaire
                </summary>
                <div
                  className="mt-3 overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
              </details>

              <details className="mt-4 rounded-2xl border border-border-light bg-surface-elevated p-4">
                <summary className="cursor-pointer text-sm font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                  Plan de montage Markdown
                </summary>
                <pre
                  className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl p-3 text-[11px] leading-relaxed"
                  style={{ backgroundColor: visualStudioColors.background, color: visualStudioColors.text }}
                >
                  {buildProductionMarkdown(storyboard)}
                </pre>
              </details>
            </section>
          </>
        )}
      </div>
    </PageShell>
  );
}
