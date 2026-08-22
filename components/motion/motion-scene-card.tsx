import Link from "next/link";
import type { MotionScene } from "@/lib/motion/asset-types";
import { MotionStatusBadge } from "@/components/motion/motion-status";

export function MotionSceneCard({ scene }: { scene: MotionScene }) {
  return (
    <article className="rounded-lg border border-border-light bg-surface-elevated p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-ink-tertiary">{scene.id}</p>
          <h2 className="mt-1 text-lg font-bold text-ink">
            <Link
              href={`/admin/motion-assets?scene=${encodeURIComponent(scene.slug)}`}
              className="hover:text-accent"
            >
              {scene.title}
            </Link>
          </h2>
        </div>
        <MotionStatusBadge status={scene.status} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{scene.objective}</p>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <div className="rounded-lg border border-border-light bg-surface p-3">
          <p className="text-xs font-semibold text-ink-tertiary">Duree cible</p>
          <p className="mt-1 font-semibold text-ink">{scene.durationSeconds} s</p>
        </div>
        <div className="rounded-lg border border-border-light bg-surface p-3">
          <p className="text-xs font-semibold text-ink-tertiary">Assets</p>
          <p className="mt-1 font-semibold text-ink">{scene.assetIds.length}</p>
        </div>
        <div className="rounded-lg border border-border-light bg-surface p-3">
          <p className="text-xs font-semibold text-ink-tertiary">Version</p>
          <p className="mt-1 font-semibold text-ink">{scene.version}</p>
        </div>
      </div>
    </article>
  );
}

export function MotionSceneMetadata({ scene }: { scene: MotionScene }) {
  return (
    <section className="rounded-lg border border-border-light bg-surface-elevated p-5">
      <h2 className="text-lg font-bold text-ink">Metadonnees de scene</h2>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <dt className="font-semibold text-ink-tertiary">Message principal</dt>
          <dd className="mt-1 text-ink-secondary">{scene.mainMessage}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink-tertiary">Cours lies</dt>
          <dd className="mt-1 text-ink-secondary">{scene.courseIds.join(", ")}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink-tertiary">Accessibilite</dt>
          <dd className="mt-1">
            <MotionStatusBadge status={scene.accessibilityStatus} />
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-ink-tertiary">Revue technique</dt>
          <dd className="mt-1">
            <MotionStatusBadge status={scene.technicalReviewStatus} />
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-ink-tertiary">Medias</dt>
          <dd className="mt-1">
            <MotionStatusBadge status={scene.mediaStatus} />
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-ink-tertiary">Chemin cours</dt>
          <dd className="mt-1 break-all text-ink-secondary">{scene.courseLessonPath ?? "Non renseigne"}</dd>
        </div>
      </dl>
    </section>
  );
}
