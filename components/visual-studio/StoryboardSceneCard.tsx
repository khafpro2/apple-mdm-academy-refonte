import type { CourseStoryboard, StoryboardScene, VideoFrameMode } from "@/lib/visual-studio/types";
import { visualStudioColors } from "@/lib/visual-studio/visual-tokens";
import { VideoFrame } from "@/components/visual-studio/VideoFrame";
import { SceneVisual } from "@/components/visual-studio/SceneVisual";
import { AnimationNotes } from "@/components/visual-studio/AnimationNotes";
import { SceneProductionTools } from "@/components/visual-studio/ProductionResources";

type StoryboardSceneCardProps = {
  scene: StoryboardScene;
  architecture: CourseStoryboard["architecture"];
  mode?: VideoFrameMode;
  className?: string;
};

export function StoryboardSceneCard({
  scene,
  architecture,
  mode = "preview",
  className = "",
}: StoryboardSceneCardProps) {
  return (
    <article
      id={`scene-${scene.id}`}
      className={`scroll-mt-24 rounded-3xl border p-5 sm:p-6 ${className}`}
      style={{ backgroundColor: visualStudioColors.surface, borderColor: visualStudioColors.border }}
      aria-labelledby={`scene-title-${scene.id}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: visualStudioColors.muted }}>
            Scène {scene.order}
          </p>
          <h3
            id={`scene-title-${scene.id}`}
            className="mt-1 text-xl font-semibold tracking-tight"
            style={{ color: visualStudioColors.navy }}
          >
            {scene.title}
          </h3>
          <p className="mt-1 text-sm" style={{ color: visualStudioColors.muted }}>
            {scene.purpose}
          </p>
        </div>
        <span
          className="rounded-full border px-3 py-1 text-xs font-semibold tabular-nums"
          style={{ borderColor: visualStudioColors.border, color: visualStudioColors.text }}
        >
          {scene.durationSeconds}s
        </span>
      </div>

      <div className="mt-5">
        <VideoFrame
          title={scene.title}
          sceneNumber={scene.order}
          mode={mode}
          exportId={`${scene.id}-frame`}
        >
          <SceneVisual scene={scene} architecture={architecture} />
        </VideoFrame>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide" style={{ color: visualStudioColors.muted }}>
            Texte à l’écran
          </h4>
          <ul className="mt-2 space-y-1">
            {scene.onScreenText.map((text) => (
              <li key={text} className="text-sm" style={{ color: visualStudioColors.text }}>
                · {text}
              </li>
            ))}
          </ul>
          <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide" style={{ color: visualStudioColors.muted }}>
            Narration
          </h4>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: visualStudioColors.text }}>
            {scene.narration}
          </p>
        </div>
        <div className="space-y-4">
          <AnimationNotes instructions={scene.animationInstructions} transition={scene.transition} />
          <SceneProductionTools scene={scene} />
        </div>
      </div>
    </article>
  );
}
