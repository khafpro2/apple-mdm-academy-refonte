import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { VideoScriptDetail } from "@/components/video/video-script-detail";
import { getVideoScript, getVideoScriptSlugs } from "@/src/lib/video-scripts";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getVideoScriptSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const video = getVideoScript(slug);
  if (!video) return { title: "Vidéo introuvable" };
  return {
    title: video.title,
    description: video.description ?? video.script.split("\n")[0],
  };
}

export default async function VideoDetailPage({ params }: Props) {
  const { slug } = await params;
  const video = getVideoScript(slug);
  if (!video) notFound();

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <VideoScriptDetail video={video} />
      </div>
    </PageShell>
  );
}
