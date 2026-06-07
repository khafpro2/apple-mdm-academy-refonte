import Link from "next/link";
import { ProgressBar } from "@/components/ui";
import { VideoStatusBadges } from "@/components/videos/VideoStatusBadges";
import { getVideoDisplayBadges } from "@/src/lib/video-display-status";
import { getIllustratedVideoLessons } from "@/src/lib/video-storyboards";
import { getMp4AvailabilityMap } from "@/src/lib/video-production.server";
import { getVideoScript } from "@/src/lib/video-scripts";

export function VideoProductionSummary() {
  const mp4Map = getMp4AvailabilityMap();
  const illustrated = getIllustratedVideoLessons();
  const items = illustrated.map((lesson) => {
    const hasMp4 = Boolean(mp4Map[lesson.slug]);
    const script = getVideoScript(lesson.slug);
    const badges = getVideoDisplayBadges({
      slug: lesson.slug,
      hasMp4,
      storyboard: lesson,
      scriptText: script?.script ?? lesson.narration,
    });
    return { slug: lesson.slug, title: lesson.title, module: lesson.module, hasMp4, badges };
  });

  const published = items.filter((i) => i.hasMp4).length;
  const inProduction = items.length - published;
  const percent = items.length ? Math.round((published / items.length) * 100) : 0;

  return (
    <section className="mb-8 rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">Production vidéo</p>
          <h2 className="text-xl font-bold text-ink">Vidéos illustrées — statut publication</h2>
          <p className="mt-1 text-sm text-ink-secondary">
            {published} publiées · {inProduction} en production · {items.length} modules storyboard
          </p>
        </div>
        <Link href="/videos" className="text-sm font-semibold text-accent hover:underline">
          Bibliothèque →
        </Link>
      </div>

      <div className="mt-5">
        <div className="flex justify-between text-xs text-ink-tertiary">
          <span>Taux de publication</span>
          <span>{percent}%</span>
        </div>
        <ProgressBar value={percent} className="mt-2" />
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        {items.slice(0, 8).map((item) => (
          <Link
            key={item.slug}
            href={`/videos/${item.slug}`}
            className="flex items-start justify-between gap-3 rounded-xl border border-border-light bg-surface p-3 transition hover:border-accent/30"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{item.title}</p>
              <p className="text-xs text-ink-tertiary">{item.module}</p>
            </div>
            <VideoStatusBadges badges={item.badges} />
          </Link>
        ))}
      </div>

      {items.length > 8 && (
        <p className="mt-4 text-center text-xs text-ink-tertiary">
          + {items.length - 8} modules ·{" "}
          <Link href="/admin/video-production" className="font-semibold text-accent hover:underline">
            Vue admin production
          </Link>
        </p>
      )}
    </section>
  );
}
