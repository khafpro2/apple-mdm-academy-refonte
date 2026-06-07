import Link from "next/link";
import { ProgressBar } from "@/components/ui";
import { VideoStatusBadges } from "@/components/videos/VideoStatusBadges";
import { VideoAlternateLearningLinks } from "@/components/videos/video-production-ux";
import { getVideoDisplayBadges, DEMO_VIDEO_MESSAGE } from "@/src/lib/video-display-status";
import { getIllustratedVideoLessons } from "@/src/lib/video-storyboards";
import { getMp4AvailabilityMap } from "@/src/lib/video-production.server";
import { getVideoScript } from "@/src/lib/video-scripts";
import { getOfficialVideo } from "@/src/lib/video-production";
import { PILOT_VIDEO_SLUGS } from "@/src/lib/video-production";

export function VideoProductionSummary() {
  const mp4Map = getMp4AvailabilityMap();
  const illustrated = getIllustratedVideoLessons().filter((l) => PILOT_VIDEO_SLUGS.includes(l.slug));

  const items = illustrated.map((lesson) => {
    const hasMp4 = Boolean(mp4Map[lesson.slug]);
    const script = getVideoScript(lesson.slug);
    const official = getOfficialVideo(lesson.slug);
    const badges = getVideoDisplayBadges({
      slug: lesson.slug,
      hasMp4,
      storyboard: lesson,
      scriptText: script?.script ?? lesson.narration,
    });
    return {
      slug: lesson.slug,
      title: lesson.title,
      module: lesson.module,
      hasMp4,
      badges,
      courseSlug: lesson.courseSlug,
      labSlug: lesson.labSlug,
      quizSlug: lesson.quizSlug,
      resourceSlug: official?.resourceSlug,
    };
  });

  const published = items.filter((i) => i.hasMp4).length;
  const inProduction = items.length - published;
  const percent = items.length ? Math.round((published / items.length) * 100) : 0;

  return (
    <section className="mb-8 rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">Vidéos LMS</p>
          <h2 className="text-xl font-bold text-ink">Publication & mode préparation</h2>
          <p className="mt-1 text-sm text-ink-secondary">
            {published} publiées · {inProduction} en production · {items.length} modules pilotes
          </p>
        </div>
        <Link href="/videos" className="text-sm font-semibold text-accent hover:underline">
          Bibliothèque →
        </Link>
      </div>

      {inProduction > 0 && (
        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-ink-secondary">{DEMO_VIDEO_MESSAGE}</p>
      )}

      <div className="mt-4">
        <div className="flex justify-between text-xs text-ink-tertiary">
          <span>Taux de publication MP4</span>
          <span>{percent}%</span>
        </div>
        <ProgressBar value={percent} className="mt-2" />
      </div>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div
            key={item.slug}
            className="rounded-xl border border-border-light bg-surface p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <Link href={`/videos/${item.slug}`} className="font-semibold text-ink hover:text-accent">
                  {item.title}
                </Link>
                <p className="text-xs text-ink-tertiary">{item.module}</p>
              </div>
              <VideoStatusBadges badges={item.badges} />
            </div>
            {!item.hasMp4 && (
              <div className="mt-3">
                <VideoAlternateLearningLinks
                  courseSlug={item.courseSlug}
                  labSlug={item.labSlug}
                  quizSlug={item.quizSlug}
                  resourceSlug={item.resourceSlug}
                  variant="compact"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
