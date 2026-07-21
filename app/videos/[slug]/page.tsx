import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/layout/page-shell";
import { ContentPreparationFallback } from "@/components/ui/empty-state";
import { AnimatedLesson } from "@/components/videos/AnimatedLesson";
import { PremiumVideoPlayer } from "@/components/video/premium-video-player";
import { getVideoStoryboard, getAllIllustratedVideoSlugs } from "@/src/lib/video-storyboards";
import { getVideoScript, getVideoScriptSlugs } from "@/src/lib/video-scripts";
import { getVideo } from "@/lib/data/videos";
import { getValidScreenshotFiles, getScreenshotInventoryAsync } from "@/src/lib/video-screenshot-inventory.server";
import { enrichStoryboardWithPublishMeta } from "@/src/lib/video-publish-status";
import {
  resolveMp4Url,
  resolvePublishableMp4Url,
} from "@/src/lib/video-production.server";
import { resolveCaptionsSrc } from "@/lib/video/captions";
import { buildVideoCatalog } from "@/lib/video/catalog";
import { getRelatedVideoEntries } from "@/lib/video/related";
import { getMp4AvailabilityMap } from "@/src/lib/video-production.server";
import {
  getOfficialVideo,
  getVideoCourseNotes,
} from "@/src/lib/video-production";
import { getVideoTranscript } from "@/src/lib/video-transcripts";

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
  const found = Boolean(storyboard || script || video);
  const title = storyboard?.title ?? script?.title ?? video?.title ?? "Vidéo introuvable";
  const description =
    storyboard?.objective ?? script?.description ?? video?.description ??
    "Cette vidéo n'existe pas ou a été déplacée.";
  return buildPageMetadata({
    title,
    description,
    path: `/videos/${slug}`,
    noIndex: !found,
  });
}

export default async function VideoDetailPage({ params }: Props) {
  const { slug } = await params;
  const rawStoryboard = getVideoStoryboard(slug);
  const script = getVideoScript(slug);
  const legacyVideo = getVideo(slug);

  if (!rawStoryboard && !legacyVideo && !script) notFound();

  const inventory = await getScreenshotInventoryAsync();
  const validFiles = getValidScreenshotFiles(inventory);
  const mp4Url = resolveMp4Url(slug);
  const publishableMp4Url = resolvePublishableMp4Url(slug);
  const official = getOfficialVideo(slug);
  const transcript = getVideoTranscript(slug);
  const courseNotes = getVideoCourseNotes(slug);
  const captionsSrc = resolveCaptionsSrc(slug, { hasTranscript: Boolean(transcript) });
  const catalog = buildVideoCatalog(getMp4AvailabilityMap());
  const currentEntry = catalog.find((entry) => entry.slug === slug);
  const relatedVideos = currentEntry
    ? getRelatedVideoEntries(catalog, currentEntry)
    : catalog.filter((entry) => entry.slug !== slug).slice(0, 8);

  let storyboard = rawStoryboard;
  if (rawStoryboard) {
    storyboard = enrichStoryboardWithPublishMeta(rawStoryboard, { validScreenshotFiles: validFiles });
    if (publishableMp4Url) {
      storyboard = {
        ...storyboard,
        status: "published",
        videoUrl: publishableMp4Url,
      };
    } else if (mp4Url) {
      storyboard = {
        ...storyboard,
        videoUrl: mp4Url,
      };
    }
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        {storyboard ? (
          <AnimatedLesson
            storyboard={storyboard}
            script={script}
            mp4Url={mp4Url}
            captionsSrc={captionsSrc}
            transcript={transcript}
            courseNotes={courseNotes}
            certificationLabel={official?.certificationLabel}
            certificationSlug={official?.certificationSlug}
            relatedVideos={relatedVideos}
          />
        ) : legacyVideo ? (
          <PremiumVideoPlayer key={legacyVideo.slug} video={legacyVideo} />
        ) : script ? (
          <div className="mx-auto max-w-2xl">
            <p className="text-sm font-semibold text-accent">{script.module}</p>
            <h1 className="mt-2 text-3xl font-bold text-ink">{script.title}</h1>
            <p className="mt-3 text-ink-secondary">{script.description}</p>
            <div className="mt-10">
              <ContentPreparationFallback backHref="/videos" backLabel="Retour aux vidéos" />
            </div>
          </div>
        ) : (
          <ContentPreparationFallback backHref="/videos" backLabel="Retour aux vidéos" />
        )}
      </div>
    </PageShell>
  );
}
