"use client";

import type { ReactNode } from "react";
import { DiagramPlaceholder } from "@/components/illustrations/DiagramPlaceholder";

export type DiagramNode = {
  id: string;
  label: string;
  x?: number;
  y?: number;
  variant?: "default" | "accent" | "muted";
};

export type DiagramConnection = {
  from: string;
  to: string;
  label?: string;
};

export type AnimatedDiagramProps = {
  title?: string;
  description?: string;
  nodes?: DiagramNode[];
  connections?: DiagramConnection[];
  illustrationSlot?: ReactNode;
  className?: string;
};

const NODE_STYLES: Record<NonNullable<DiagramNode["variant"]>, string> = {
  default: "border-border-light bg-white text-ink",
  accent: "border-accent/30 bg-accent/5 text-accent",
  muted: "border-border-light bg-surface text-ink-secondary",
};

/** Diagramme animé — structure prête, contenu injecté via nodes ou illustrationSlot */
export function AnimatedDiagram({
  title,
  description,
  nodes = [],
  connections = [],
  illustrationSlot,
  className = "",
}: AnimatedDiagramProps) {
  const hasStructure = nodes.length > 0;

  if (!hasStructure && !illustrationSlot) {
    return <DiagramPlaceholder title={title} description={description} className={className} />;
  }

  return (
    <figure
      className={`overflow-hidden rounded-2xl border border-border-light bg-surface-elevated ${className}`}
      aria-labelledby={title ? "diagram-title" : undefined}
    >
      {(title || description) && (
        <figcaption className="border-b border-border-light px-5 py-4">
          {title && (
            <p id="diagram-title" className="font-bold text-ink">
              {title}
            </p>
          )}
          {description && <p className="mt-1 text-sm text-ink-secondary">{description}</p>}
        </figcaption>
      )}

      <div className="relative p-5">
        {illustrationSlot ?? (
          <div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            role="img"
            aria-label={title ?? "Diagramme d'architecture"}
          >
            {nodes.map((node) => (
              <div
                key={node.id}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold shadow-sm transition hover:shadow-md ${NODE_STYLES[node.variant ?? "default"]}`}
                style={
                  node.x != null && node.y != null
                    ? { gridColumn: node.x, gridRow: node.y }
                    : undefined
                }
              >
                {node.label}
              </div>
            ))}
          </div>
        )}

        {connections.length > 0 && (
          <ul className="mt-4 space-y-1 text-xs text-ink-tertiary" aria-label="Connexions du diagramme">
            {connections.map((c) => (
              <li key={`${c.from}-${c.to}`}>
                {c.from} → {c.to}
                {c.label ? ` · ${c.label}` : ""}
              </li>
            ))}
          </ul>
        )}
      </div>
    </figure>
  );
}
