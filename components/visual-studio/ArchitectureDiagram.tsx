import type { VisualArchitecture } from "@/lib/visual-studio/types";
import { visualStudioColors } from "@/lib/visual-studio/visual-tokens";
import { ActorFromData } from "@/components/visual-studio/DeviceNode";
import { FlowConnector } from "@/components/visual-studio/FlowConnector";

type ArchitectureDiagramProps = {
  architecture: VisualArchitecture;
  /** Sous-ensemble d’acteurs à afficher (ids). Si omis : vue pédagogique condensée. */
  highlightIds?: string[];
  compact?: boolean;
  className?: string;
};

const DEFAULT_ROW = ["reseller", "abm", "jamf", "intune", "mac", "user"];

/**
 * Diagramme d’architecture accessible et responsive (HTML + SVG connectors).
 */
export function ArchitectureDiagram({
  architecture,
  highlightIds,
  compact = false,
  className = "",
}: ArchitectureDiagramProps) {
  const ids = highlightIds ?? DEFAULT_ROW;
  const actors = ids
    .map((id) => architecture.actors.find((a) => a.id === id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const edgeFor = (fromId: string, toId: string) =>
    architecture.edges.find((e) => e.from === fromId && e.to === toId) ??
    architecture.edges.find((e) => e.from === fromId || e.to === toId);

  return (
    <section
      className={`rounded-2xl border p-4 sm:p-6 ${className}`}
      style={{
        backgroundColor: visualStudioColors.surface,
        borderColor: visualStudioColors.border,
      }}
      aria-labelledby={`arch-${architecture.id}-title`}
    >
      <h4
        id={`arch-${architecture.id}-title`}
        className="text-sm font-semibold sm:text-base"
        style={{ color: visualStudioColors.navy }}
      >
        {architecture.title}
      </h4>
      <p className="mt-1 text-xs sm:text-sm" style={{ color: visualStudioColors.muted }}>
        {architecture.description}
      </p>

      {/* Desktop / tablette : rangée horizontale */}
      <div
        className="mt-5 hidden items-stretch justify-center gap-1 overflow-x-auto pb-2 md:flex"
        role="list"
        aria-label="Composants du flux"
      >
        {actors.map((actor, index) => {
          const next = actors[index + 1];
          const edge = next ? edgeFor(actor.id, next.id) : undefined;
          return (
            <div key={actor.id} className="flex items-center gap-1">
              <ActorFromData actor={actor} />
              {next ? (
                <FlowConnector
                  variant={edge?.variant ?? "action"}
                  label={edge?.label}
                  className={compact ? "scale-90" : ""}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Mobile : pile verticale simplifiée */}
      <ol className="mt-4 space-y-2 md:hidden" aria-label="Composants du flux (mobile)">
        {actors.map((actor, index) => {
          const next = actors[index + 1];
          const edge = next ? edgeFor(actor.id, next.id) : undefined;
          return (
            <li key={actor.id} className="flex flex-col items-center">
              <ActorFromData actor={actor} />
              {next ? (
                <FlowConnector
                  variant={edge?.variant ?? "action"}
                  label={edge?.label}
                  direction="vertical"
                />
              ) : null}
            </li>
          );
        })}
      </ol>

      {/* Flux linéaire résumé */}
      <div className="mt-6 overflow-x-auto">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide" style={{ color: visualStudioColors.muted }}>
          Flux résumé
        </p>
        <ol className="flex min-w-max items-center gap-1" aria-label="Flux linéaire ADE">
          {architecture.linearFlow.map((step, i) => (
            <li key={step} className="flex items-center gap-1">
              <span
                className="rounded-lg border px-2.5 py-1.5 text-[11px] font-medium sm:text-xs"
                style={{
                  backgroundColor: visualStudioColors.background,
                  borderColor: visualStudioColors.border,
                  color: visualStudioColors.text,
                }}
              >
                <span className="sr-only">Étape {i + 1} : </span>
                {step}
              </span>
              {i < architecture.linearFlow.length - 1 ? (
                <span aria-hidden="true" className="text-sm font-semibold" style={{ color: visualStudioColors.blue }}>
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-4 text-[10px]" style={{ color: visualStudioColors.muted }}>
        Apple MDM Academy est une plateforme indépendante. Les noms de produits identifient des services
        pédagogiques — aucun logo officiel n’est reproduit ici.
      </p>
    </section>
  );
}
