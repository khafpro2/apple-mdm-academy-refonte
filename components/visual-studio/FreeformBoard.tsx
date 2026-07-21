"use client";

import { useState, type ReactNode } from "react";
import type { CourseStoryboard } from "@/lib/visual-studio/types";
import { visualStudioColors } from "@/lib/visual-studio/visual-tokens";
import { VideoFrame } from "@/components/visual-studio/VideoFrame";
import { SceneVisual } from "@/components/visual-studio/SceneVisual";
import { VerificationBadge } from "@/components/visual-studio/VerificationBadge";

type FreeformBoardProps = {
  storyboard: CourseStoryboard;
};

/**
 * Vue type Apple Freeform : bande horizontale défilable avec zoom.
 * Mobile : pile verticale simplifiée.
 */
export function FreeformBoard({ storyboard }: FreeformBoardProps) {
  const [zoom, setZoom] = useState(1);

  return (
    <section
      className="rounded-3xl border p-4 sm:p-6 print:border-0 print:p-0"
      style={{ backgroundColor: "#E8ECF4", borderColor: visualStudioColors.border }}
      aria-label="Tableau Freeform du storyboard"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: visualStudioColors.navy }}>
            Vue Freeform
          </h2>
          <p className="text-sm" style={{ color: visualStudioColors.muted }}>
            Défilement horizontal · zoom · impression · capture
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="freeform-zoom" className="text-xs font-medium" style={{ color: visualStudioColors.muted }}>
            Zoom
          </label>
          <input
            id="freeform-zoom"
            type="range"
            min={0.6}
            max={1.2}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-28 accent-[#2563EB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
            aria-valuetext={`${Math.round(zoom * 100)} pour cent`}
          />
          <span className="w-10 text-xs tabular-nums" style={{ color: visualStudioColors.text }}>
            {Math.round(zoom * 100)}%
          </span>
        </div>
      </div>

      {/* Desktop / tablette : horizontal scroll */}
      <div className="hidden overflow-x-auto pb-4 md:block" tabIndex={0} role="region" aria-label="Storyboard horizontal">
        <div
          className="flex origin-top-left items-start gap-4 transition-transform duration-200"
          style={{ transform: `scale(${zoom})`, width: `${100 / zoom}%` }}
        >
          <FreeformCard title="En-tête du cours" wide>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: visualStudioColors.purple }}>
              {storyboard.moduleTitle}
            </p>
            <h3 className="mt-2 text-base font-bold" style={{ color: visualStudioColors.navy }}>
              {storyboard.courseTitle}
            </h3>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: visualStudioColors.muted }}>
              {storyboard.centralMessage}
            </p>
            <div className="mt-3">
              <VerificationBadge status={storyboard.verificationStatus} />
            </div>
          </FreeformCard>

          {storyboard.scenes.map((scene) => (
            <FreeformCard key={scene.id} title={`Scène ${scene.order}`} subtitle={scene.title}>
              <div className="w-[320px]">
                <VideoFrame title={scene.title} sceneNumber={scene.order} mode="preview" exportId={`freeform-${scene.id}`}>
                  <SceneVisual scene={scene} architecture={storyboard.architecture} />
                </VideoFrame>
              </div>
              <p className="mt-2 text-[11px] leading-snug" style={{ color: visualStudioColors.muted }}>
                {scene.durationSeconds}s · {scene.purpose}
              </p>
            </FreeformCard>
          ))}

          <FreeformCard title="Ressources de production" wide>
            <ul className="space-y-2">
              {storyboard.productionResources.map((r) => (
                <li key={r.id} className="text-xs" style={{ color: visualStudioColors.text }}>
                  <span className="font-semibold capitalize">{r.tool}</span> — {r.title}
                </li>
              ))}
            </ul>
          </FreeformCard>
        </div>
      </div>

      {/* Mobile : pile */}
      <div className="space-y-4 md:hidden">
        <FreeformCard title="En-tête du cours">
          <h3 className="text-base font-bold" style={{ color: visualStudioColors.navy }}>
            {storyboard.courseTitle}
          </h3>
          <p className="mt-2 text-xs" style={{ color: visualStudioColors.muted }}>
            {storyboard.centralMessage}
          </p>
        </FreeformCard>
        {storyboard.scenes.map((scene) => (
          <FreeformCard key={scene.id} title={`Scène ${scene.order}`} subtitle={scene.title}>
            <VideoFrame title={scene.title} sceneNumber={scene.order}>
              <SceneVisual scene={scene} architecture={storyboard.architecture} />
            </VideoFrame>
          </FreeformCard>
        ))}
        <FreeformCard title="Ressources de production">
          <ul className="space-y-1">
            {storyboard.productionResources.map((r) => (
              <li key={r.id} className="text-xs" style={{ color: visualStudioColors.text }}>
                {r.title}
              </li>
            ))}
          </ul>
        </FreeformCard>
      </div>
    </section>
  );
}

function FreeformCard({
  title,
  subtitle,
  children,
  wide,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={`shrink-0 rounded-2xl border p-4 shadow-sm ${wide ? "w-[280px]" : "w-[360px] max-w-[90vw]"}`}
      style={{ backgroundColor: visualStudioColors.surface, borderColor: visualStudioColors.border }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: visualStudioColors.muted }}>
        {title}
      </p>
      {subtitle ? (
        <p className="mt-0.5 text-sm font-semibold" style={{ color: visualStudioColors.navy }}>
          {subtitle}
        </p>
      ) : null}
      <div className="mt-3">{children}</div>
    </div>
  );
}
