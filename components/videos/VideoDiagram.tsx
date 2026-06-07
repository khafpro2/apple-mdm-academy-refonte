"use client";

import { IntuneLogo } from "@/components/brands/IntuneLogo";
import { JamfLogo } from "@/components/brands/JamfLogo";
import type { ArchitectureConnection, ArchitectureNode } from "@/src/lib/video-lessons";
import type { IllustrationName } from "@/src/lib/video-lessons";

type VideoDiagramProps = {
  nodes: ArchitectureNode[];
  connections: ArchitectureConnection[];
  activeNode?: number;
  title?: string;
  description?: string;
  /** Static SVG diagram path (optional) */
  diagramPath?: string;
  className?: string;
};

function NodeIcon({ name }: { name?: IllustrationName | string }) {
  if (!name) return null;
  if (name === "jamf") {
    return (
      <div className="mx-auto mb-2 flex justify-center">
        <JamfLogo variant="mark" size={32} alt="Jamf" />
      </div>
    );
  }
  if (name === "intune") {
    return (
      <div className="mx-auto mb-2 flex justify-center">
        <IntuneLogo size={32} alt="Microsoft Intune" />
      </div>
    );
  }
  const legacy = `/illustrations/${name}.svg`;
  const asset = `/video-assets/icons/${name}.svg`;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={name.includes("-") || ["abm", "intune", "jamf", "apns", "ade"].includes(name) ? asset : legacy}
      alt=""
      width={32}
      height={32}
      className="mx-auto mb-2 opacity-90"
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src.includes("/video-assets/")) img.src = legacy;
      }}
    />
  );
}

export function VideoDiagram({
  nodes,
  connections,
  activeNode = 0,
  title,
  description,
  diagramPath,
  className = "",
}: VideoDiagramProps) {
  if (diagramPath) {
    return (
      <figure className={`overflow-hidden rounded-2xl border border-border-light bg-surface-elevated ${className}`}>
        {title && (
          <figcaption className="border-b border-border-light px-5 py-3">
            <p className="text-sm font-bold text-ink">{title}</p>
            {description && <p className="mt-1 text-xs text-ink-secondary">{description}</p>}
          </figcaption>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={diagramPath} alt={title ?? "Diagramme workflow"} className="w-full" />
      </figure>
    );
  }

  const activeConnectionIndex = Math.max(0, activeNode - 1);

  return (
    <figure className={`rounded-2xl border border-border-light bg-surface-elevated p-6 ${className}`}>
      {title && (
        <figcaption>
          <p className="text-center text-sm font-bold uppercase tracking-wide text-ink-tertiary">{title}</p>
          {description && <p className="mt-2 text-center text-sm text-ink-secondary">{description}</p>}
        </figcaption>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:gap-4">
        {nodes.map((node, index) => {
          const active = index <= activeNode;
          return (
            <div key={node.id} className="flex items-center gap-3">
              <div
                className={`min-w-[120px] rounded-xl border px-4 py-3 text-center shadow-sm transition-all duration-500 ${
                  active
                    ? "scale-105 border-accent bg-accent/10 shadow-md"
                    : "border-border-light bg-surface opacity-60"
                }`}
              >
                <NodeIcon name={node.icon} />
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
            `${connections.length} liaison${connections.length > 1 ? "s" : ""}`}
        </p>
      )}
    </figure>
  );
}
