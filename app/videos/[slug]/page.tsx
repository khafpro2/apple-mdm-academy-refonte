import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { PremiumVideoPlayer } from "@/components/video/premium-video-player";
import { getVideo, getVideoSlugs } from "@/lib/data/videos";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getVideoSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const video = getVideo(slug);
  if (!video) return { title: "Vidéo introuvable" };
  return {
    title: video.title,
    description: video.description,
  };
}

export default async function VideoDetailPage({ params }: Props) {
  const { slug } = await params;
  const video = getVideo(slug);
  if (!video) notFound();

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <PremiumVideoPlayer video={video} />
      </div>
    </PageShell>
  );
}
