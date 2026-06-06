import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { AnimatedLesson } from "@/components/videos/AnimatedLesson";
import { PremiumVideoPlayer } from "@/components/video/premium-video-player";
import { getVideoStoryboard, getAllIllustratedVideoSlugs } from "@/src/lib/video-storyboards";
import { getVideoScript, getVideoScriptSlugs } from "@/src/lib/video-scripts";
import { getVideo } from "@/lib/data/videos";

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
  const storyboard = getVideoStoryboard(slug);
  const script = getVideoScript(slug);
  const legacyVideo = getVideo(slug);

  if (!storyboard && !legacyVideo) notFound();

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
