"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  academyResources,
  getCategoryLabel,
  getPopularResources,
  getResourcesByCourse,
} from "@/src/lib/resources";
import { loadResourceViews, subscribeToResourceViews } from "@/lib/resources/progress-storage";
import { tracks } from "@/lib/data/tracks";

type TrackProgress = { slug: string; title: string; percent: number };

type Props = {
  trackProgress?: TrackProgress[];
};

export function ResourcesPanel({ trackProgress = [] }: Props) {
  const recentViews = useSyncExternalStore(
    subscribeToResourceViews,
    () => loadResourceViews(),
    () => loadResourceViews()
  );

  const popular = getPopularResources().slice(0, 4);
  const inProgressTracks = trackProgress.filter((t) => t.percent > 0 && t.percent < 100);

  const moduleResources = inProgressTracks.flatMap((track) => {
    const courseSlug = tracks.find((tr) => tr.slug === track.slug)?.slug ?? track.slug;
    return getResourcesByCourse(courseSlug).slice(0, 2);
  });

  const uniqueModuleResources = moduleResources.filter(
    (r, i, arr) => arr.findIndex((x) => x.slug === r.slug) === i
  ).slice(0, 4);

  const recentResources = recentViews
    .map((v) => academyResources.find((r) => r.slug === v.resourceSlug))
    .filter(Boolean)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-ink">Ressources recommandées</h2>
          <Link href="/resources" className="text-sm font-semibold text-accent hover:underline">
            Voir tout →
          </Link>
        </div>
        <ul className="mt-4 space-y-3">
          {popular.map((r) => (
            <li key={r.slug}>
              <Link href={`/resources/${r.slug}`} className="flex justify-between gap-4 text-sm hover:text-accent">
                <span className="font-medium text-ink">{r.title}</span>
                <span className="shrink-0 text-ink-tertiary">{r.badge}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {recentResources.length > 0 && (
        <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
          <h2 className="text-lg font-bold text-ink">Dernières ressources consultées</h2>
          <ul className="mt-4 space-y-3">
            {recentResources.map((r) => r && (
              <li key={r.slug}>
                <Link href={`/resources/${r.slug}`} className="block text-sm">
                  <span className="font-medium text-ink">{r.title}</span>
                  <p className="text-xs text-ink-tertiary">{getCategoryLabel(r.category)} · {r.level}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {uniqueModuleResources.length > 0 && (
        <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
          <h2 className="text-lg font-bold text-ink">Ressources liées à vos modules en cours</h2>
          <ul className="mt-4 space-y-3">
            {uniqueModuleResources.map((r) => (
              <li key={r.slug}>
                <Link href={`/resources/${r.slug}`} className="flex justify-between text-sm hover:text-accent">
                  <span className="font-medium text-ink">{r.title}</span>
                  <span className="text-ink-tertiary">{r.module}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
