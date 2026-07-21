import type { ReactNode } from "react";
import type { VideoFrameMode } from "@/lib/visual-studio/types";
import { visualStudioColors, visualStudioMeta } from "@/lib/visual-studio/visual-tokens";

type VideoFrameProps = {
  title: string;
  sceneNumber?: number;
  mode?: VideoFrameMode;
  children: ReactNode;
  className?: string;
  /** Identifiant pour Playwright / capture */
  exportId?: string;
};

/**
 * Cadre vidéo 16:9 avec zone de sécurité, modes aperçu et export.
 */
export function VideoFrame({
  title,
  sceneNumber,
  mode = "preview",
  children,
  className = "",
  exportId,
}: VideoFrameProps) {
  const isExport = mode === "export";
  const inset = visualStudioMeta.safetyInsetPercent;

  return (
    <figure
      data-export-frame={exportId ?? "true"}
      data-mode={mode}
      className={`relative w-full overflow-hidden rounded-2xl border print:rounded-none print:border-0 ${className}`}
      style={{
        aspectRatio: visualStudioMeta.aspectRatio,
        backgroundColor: visualStudioColors.background,
        borderColor: visualStudioColors.border,
        boxShadow: isExport ? "none" : "0 1px 3px rgba(15, 23, 42, 0.06)",
      }}
      aria-label={sceneNumber ? `Scène ${sceneNumber} — ${title}` : title}
    >
      <div
        className="absolute inset-0 flex flex-col"
        style={{
          padding: `${inset}%`,
        }}
      >
        <header className="mb-2 flex shrink-0 items-baseline justify-between gap-3">
          <h3
            className="text-sm font-semibold tracking-tight sm:text-base md:text-lg"
            style={{ color: visualStudioColors.navy }}
          >
            {sceneNumber != null ? (
              <span className="mr-2 tabular-nums" style={{ color: visualStudioColors.muted }}>
                {String(sceneNumber).padStart(2, "0")}
              </span>
            ) : null}
            {title}
          </h3>
          {!isExport && (
            <span className="hidden text-[10px] font-medium uppercase tracking-wider sm:inline" style={{ color: visualStudioColors.muted }}>
              16:9 · zone de sécurité {inset}%
            </span>
          )}
        </header>

        {/* Zone de sécurité visuelle (guidelines) — masquée en export */}
        {!isExport && (
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl border border-dashed opacity-40 print:hidden"
            style={{
              borderColor: visualStudioColors.cyan,
              margin: `${inset * 0.35}%`,
            }}
            aria-hidden="true"
          />
        )}

        <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </figure>
  );
}
