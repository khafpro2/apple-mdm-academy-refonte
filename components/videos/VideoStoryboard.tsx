"use client";

import { useMemo, useState } from "react";
import type { VideoStoryboard } from "@/src/lib/video-lessons";
import { exportStoryboardToMarkdown } from "@/src/lib/video-lessons";
import { VideoSceneView } from "@/components/videos/VideoScene";
import { AnimatedArchitecture } from "@/components/videos/AnimatedArchitecture";

type VideoStoryboardProps = {
  storyboard: VideoStoryboard;
  activeSceneIndex?: number;
  playing?: boolean;
};

export function VideoStoryboardPanel({ storyboard, activeSceneIndex = 0, playing = false }: VideoStoryboardProps) {
  const [expanded, setExpanded] = useState(true);
  const activeScene = storyboard.scenes[activeSceneIndex] ?? storyboard.scenes[0];
  const archStep = playing ? activeSceneIndex : 0;

  const progressPercent = useMemo(() => {
    if (storyboard.scenes.length <= 1) return 100;
    return Math.round(((activeSceneIndex + 1) / storyboard.scenes.length) * 100);
  }, [activeSceneIndex, storyboard.scenes.length]);

  return (
    <section className="space-y-4" aria-label="Storyboard animé">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-ink">Storyboard pédagogique</h2>
          <p className="text-sm text-ink-secondary">
            {storyboard.scenes.length} scènes · {storyboard.duration} · {progressPercent}% parcouru
          </p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="rounded-lg border border-border-light px-3 py-1.5 text-sm font-medium text-ink-secondary hover:bg-surface"
        >
          {expanded ? "Replier" : "Déplier"}
        </button>
      </div>

      {activeScene?.nodes && activeScene.connections && (
        <AnimatedArchitecture
          nodes={activeScene.nodes}
          connections={activeScene.connections}
          activeStep={archStep}
          title={activeScene.title}
          description={activeScene.visual ?? activeScene.visualHint}
        />
      )}

      {expanded && (
        <div className="space-y-4">
          {storyboard.scenes.map((scene, index) => (
            <VideoSceneView
              key={scene.id}
              scene={scene}
              index={index}
              active={index === activeSceneIndex}
              activeStep={index === activeSceneIndex ? archStep : 0}
            />
          ))}
        </div>
      )}

      <details className="rounded-2xl border border-dashed border-border-light bg-surface p-4">
        <summary className="cursor-pointer text-sm font-semibold text-ink">Aperçu export Markdown</summary>
        <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap text-xs text-ink-secondary">
          {exportStoryboardToMarkdown(storyboard).slice(0, 800)}…
        </pre>
      </details>
    </section>
  );
}
