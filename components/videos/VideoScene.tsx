"use client";

import type { VideoScene } from "@/src/lib/video-lessons";
import { AnimatedArchitecture } from "@/components/videos/AnimatedArchitecture";

type VideoSceneProps = {
  scene: VideoScene;
  index: number;
  active: boolean;
  activeStep: number;
};

const TYPE_LABELS: Record<VideoScene["visualType"], string> = {
  diagram: "Diagramme",
  screenshot: "Capture écran",
  avatar: "Narrateur HeyGen",
  comparison: "Comparaison",
  checklist: "Checklist",
  process: "Processus",
  architecture: "Architecture",
  recap: "Récapitulatif",
};

export function VideoSceneView({ scene, index, active, activeStep }: VideoSceneProps) {
  return (
    <article
      className={`rounded-2xl border p-5 transition-all duration-300 ${
        active ? "border-accent bg-accent/5 shadow-sm" : "border-border-light bg-surface-elevated"
      }`}
      aria-current={active ? "step" : undefined}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-bold text-ink-tertiary">
          {index + 1}
        </span>
        <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
          {TYPE_LABELS[scene.visualType]}
        </span>
        <span className="text-xs text-ink-tertiary">{scene.durationSeconds}s</span>
      </div>
      <h3 className="mt-3 font-bold text-ink">{scene.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{scene.narration}</p>
      <p className="mt-3 rounded-lg bg-surface px-3 py-2 text-xs text-ink-tertiary">
        <span className="font-semibold text-ink-secondary">Visuel :</span> {scene.visualHint}
      </p>

      {scene.nodes && scene.connections && (
        <div className="mt-4">
          <AnimatedArchitecture
            nodes={scene.nodes}
            connections={scene.connections}
            activeStep={active ? activeStep : 0}
            title={scene.title}
          />
        </div>
      )}

      {scene.checklistItems && (
        <ul className="mt-4 space-y-2">
          {scene.checklistItems.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-ink-secondary">
              <span className="mt-0.5 text-accent" aria-hidden="true">✓</span>
              {item}
            </li>
          ))}
        </ul>
      )}

      {scene.comparison && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border-light bg-surface p-4 text-sm font-medium text-ink">
            {scene.comparison.left}
          </div>
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm font-medium text-indigo-900">
            {scene.comparison.right}
          </div>
        </div>
      )}

      {scene.screenshotTarget && (
        <p className="mt-3 text-xs font-medium text-accent">
          Capture : {scene.screenshotTarget}
        </p>
      )}
    </article>
  );
}
