import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/ui";
import { listCourseStoryboards } from "@/lib/visual-studio";
import { formatDurationLabel, totalDurationSeconds } from "@/lib/visual-studio/storyboard-generator";
import { VerificationBadge } from "@/components/visual-studio/VerificationBadge";
import { visualStudioColors, visualStudioMeta } from "@/lib/visual-studio/visual-tokens";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Studio visuel de cours",
  description:
    "Storyboards pédagogiques, diagrammes techniques et scènes 16:9 pour la production vidéo Apple MDM Academy.",
  path: "/studio-visuel",
});

export default function StudioVisuelIndexPage() {
  const boards = listCourseStoryboards();

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16" style={{ backgroundColor: "transparent" }}>
        <SectionHeading
          label="Production visuelle"
          title="Studio visuel de cours"
          description="Transformez chaque cours en storyboard pédagogique, diagrammes techniques, scènes 16:9 et plan de montage Canva / Firefly / HeyGen / Freeform."
        />

        <p className="mt-4 text-sm text-ink-secondary">
          Direction artistique : <strong className="text-ink">{visualStudioMeta.name}</strong>.{" "}
          {visualStudioMeta.disclaimer}
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => {
            const duration = totalDurationSeconds(board);
            return (
              <Link
                key={board.courseId}
                href={`/studio-visuel/${board.courseId}`}
                className="group block rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-tertiary">
                    {board.moduleTitle}
                  </span>
                  <VerificationBadge status={board.verificationStatus} />
                </div>
                <h2 className="mt-3 text-lg font-bold tracking-tight text-ink group-hover:text-accent">
                  {board.courseTitle}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm text-ink-secondary">{board.centralMessage}</p>
                <p className="mt-4 text-xs text-ink-tertiary">
                  {board.scenes.length} scènes · {formatDurationLabel(duration)} · ID{" "}
                  <code className="rounded bg-surface px-1">{board.courseId}</code>
                </p>
              </Link>
            );
          })}
        </div>

        {boards.length === 0 ? (
          <p className="mt-8 text-sm text-ink-secondary">Aucun storyboard disponible pour le moment.</p>
        ) : null}

        <aside
          className="mt-12 rounded-2xl border p-5 text-sm"
          style={{ borderColor: visualStudioColors.border, backgroundColor: visualStudioColors.background }}
        >
          <h2 className="font-semibold text-ink">Exports</h2>
          <p className="mt-2 text-ink-secondary">
            Captures PNG via <code className="rounded bg-white px-1">npm run export:storyboards</code> (Playwright,
            viewport 1920×1080). SVG de diagrammes et version imprimable disponibles sur chaque fiche cours.
          </p>
        </aside>
      </div>
    </PageShell>
  );
}
