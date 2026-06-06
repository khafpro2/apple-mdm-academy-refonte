"use client";

import type { ArchitectureConnection, ArchitectureNode, IllustrationName } from "@/src/lib/video-lessons";

type AnimatedArchitectureProps = {
  nodes: ArchitectureNode[];
  connections: ArchitectureConnection[];
  activeStep: number;
  title?: string;
  description?: string;
};

function IllustrationIcon({ name }: { name?: IllustrationName }) {
  if (!name) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/illustrations/${name}.svg`} alt="" width={28} height={28} className="mx-auto mb-2 opacity-90" />
  );
}

export function AnimatedArchitecture({
  nodes,
  connections,
  activeStep,
  title,
  description,
}: AnimatedArchitectureProps) {
  const activeConnectionIndex = Math.max(0, activeStep - 1);

  return (
    <div className="rounded-2xl border border-border-light bg-surface-elevated p-6">
      {title && <h3 className="text-center text-sm font-bold uppercase tracking-wide text-ink-tertiary">{title}</h3>}
      {description && <p className="mt-2 text-center text-sm text-ink-secondary">{description}</p>}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:gap-4">
        {nodes.map((node, index) => {
          const active = index <= activeStep;
          return (
            <div key={node.id} className="flex items-center gap-3">
              <div
                className={`min-w-[120px] rounded-xl border px-4 py-3 text-center transition-all duration-500 ${
                  active
                    ? "scale-105 border-accent bg-accent/10 shadow-md"
                    : "border-border-light bg-surface opacity-60"
                }`}
              >
                <IllustrationIcon name={node.icon} />
                <p className="text-xs font-semibold text-ink">{node.label}</p>
              </div>
              {index < nodes.length - 1 && (
                <div
                  className={`hidden text-xl transition-opacity duration-500 md:block ${
                    index < activeConnectionIndex + 1 ? "animate-pulse text-accent opacity-100" : "text-ink-tertiary opacity-30"
                  }`}
                  aria-hidden="true"
                >
                  →
                </div>
              )}
            </div>
          );
        })}
      </div>
      {connections.length > 0 && (
        <p className="mt-4 text-center text-xs text-ink-tertiary">
          {connections[Math.min(activeConnectionIndex, connections.length - 1)]?.label ??
            `${connections.length} liaison${connections.length > 1 ? "s" : ""} MDM`}
        </p>
      )}
    </div>
  );
}
