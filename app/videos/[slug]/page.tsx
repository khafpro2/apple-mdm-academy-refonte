import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { AnimatedLesson } from "@/components/videos/AnimatedLesson";
import { PremiumVideoPlayer } from "@/components/video/premium-video-player";
import { getVideoStoryboard, getAllIllustratedVideoSlugs } from "@/src/lib/video-storyboards";
import { getVideoScript, getVideoScriptSlugs } from "@/src/lib/video-scripts";
import { getVideo } from "@/lib/data/videos";
import { getValidScreenshotFiles, getScreenshotInventoryAsync } from "@/src/lib/video-screenshot-inventory.server";
import { enrichStoryboardWithPublishMeta } from "@/src/lib/video-publish-status";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = new Set([...getVideoScriptSlugs(), ...getAllIllustratedVideoSlugs()]);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const storyboard = getVideoStoryboard(slug);
  const script = getVideoScript(slug);
  const video = getVideo(slug);
  const title = storyboard?.title ?? script?.title ?? video?.title ?? "Vidéo introuvable";
  const description = storyboard?.objective ?? script?.description ?? video?.description ?? "";
  return { title, description };
}

export default async function VideoDetailPage({ params }: Props) {
  const { slug } = await params;
  const rawStoryboard = getVideoStoryboard(slug);
  const script = getVideoScript(slug);
  const legacyVideo = getVideo(slug);

  if (!rawStoryboard && !legacyVideo) notFound();

  let storyboard = rawStoryboard;
  if (rawStoryboard) {
    const inventory = await getScreenshotInventoryAsync();
    const validFiles = getValidScreenshotFiles(inventory);
    storyboard = enrichStoryboardWithPublishMeta(rawStoryboard, { validScreenshotFiles: validFiles });
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        {storyboard ? (
          <AnimatedLesson storyboard={storyboard} script={script} />
        ) : legacyVideo ? (
          <PremiumVideoPlayer key={legacyVideo.slug} video={legacyVideo} />
        ) : null}
      </div>
    </PageShell>
  );
}
