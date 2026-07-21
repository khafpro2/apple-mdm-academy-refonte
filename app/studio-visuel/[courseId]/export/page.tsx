import { notFound } from "next/navigation";
import { getCourseStoryboard, getScene } from "@/lib/visual-studio";
import { VideoFrame } from "@/components/visual-studio/VideoFrame";
import { SceneVisual } from "@/components/visual-studio/SceneVisual";
import { visualStudioColors } from "@/lib/visual-studio/visual-tokens";

type PageProps = {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ scene?: string }>;
};

/**
 * Page minimale pour capture Playwright (sans shell / nav).
 * Viewport cible : 1920×1080 — zone [data-export-frame].
 */
export default async function StudioVisuelExportPage({ params, searchParams }: PageProps) {
  const { courseId } = await params;
  const { scene: sceneId } = await searchParams;
  const storyboard = getCourseStoryboard(courseId);
  if (!storyboard) notFound();

  const scene = sceneId ? getScene(courseId, sceneId) : storyboard.scenes[0];
  if (!scene) notFound();

  return (
    <main
      className="flex min-h-screen items-center justify-center p-8"
      style={{ backgroundColor: visualStudioColors.background }}
    >
      <div className="w-full max-w-[1760px]">
        <VideoFrame
          title={scene.title}
          sceneNumber={scene.order}
          mode="export"
          exportId={`${storyboard.courseId}-${scene.id}`}
        >
          <SceneVisual scene={scene} architecture={storyboard.architecture} />
        </VideoFrame>
      </div>
    </main>
  );
}
