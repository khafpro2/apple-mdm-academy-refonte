import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading, Badge, ProgressBar } from "@/components/ui";
import { requireAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { getVideoProductionStatus, getVideoAssets } from "@/src/lib/video-assets";
import { VideoThumbnail } from "@/components/videos/VideoThumbnail";

export const metadata = { title: "Production vidéo", robots: { index: false, follow: false } };

export default async function VideoProductionAdminPage() {
  const auth = await requireAdmin();
  if (!auth.ok) redirect(auth.reason === "unauthenticated" ? "/auth/login?redirect=/admin/video-production" : "/dashboard");

  const status = getVideoProductionStatus();
  const withoutThumbnail = status.videos.filter((v) => !v.hasThumbnail);
  const withoutStoryboard = status.videos.filter((v) => !v.hasStoryboard);
  const withoutDiagram = status.videos.filter((v) => !v.hasDiagram);
  const missingScreenshots = status.videos.filter((v) => v.screenshotCount === 0);
  const missingAssets = status.videos.filter((v) => v.missingAssets.length > 0);
  const ready = status.videos.filter((v) => v.productionReady);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            label="Production vidéo"
            title="Assets vidéos illustrées"
            description={`${status.totalVideos} vidéos · ${ready.length} production ready · score global ${status.productionReadyPercent} %`}
          />
          <Link href="/admin" className="text-sm font-semibold text-accent hover:underline">
            ← Admin
          </Link>
        </div>

        <div
          className={`mb-8 rounded-2xl p-6 ${status.productionReadyPercent >= 80 ? "border border-green-200 bg-green-50" : "border border-amber-200 bg-amber-50"}`}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase text-ink-tertiary">Production Ready</p>
              <p className="text-4xl font-bold text-ink">{status.productionReadyPercent} %</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <div>
                <p className="text-ink-tertiary">Storyboards</p>
                <p className="font-bold text-ink">{status.withStoryboard}/{status.totalVideos}</p>
              </div>
              <div>
                <p className="text-ink-tertiary">Miniatures</p>
                <p className="font-bold text-ink">{status.withThumbnail}/{status.totalVideos}</p>
              </div>
              <div>
                <p className="text-ink-tertiary">Diagrammes</p>
                <p className="font-bold text-ink">{status.withDiagram}/{status.totalVideos}</p>
              </div>
              <div>
                <p className="text-ink-tertiary">Prêtes</p>
                <p className="font-bold text-accent">{ready.length}</p>
              </div>
            </div>
          </div>
          <ProgressBar value={status.productionReadyPercent} className="mt-4" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <AlertSection
            title="Vidéos sans miniature"
            items={withoutThumbnail.map((v) => v.title)}
            empty="Toutes les miniatures sont définies"
            variant="warning"
          />
          <AlertSection
            title="Vidéos sans storyboard"
            items={withoutStoryboard.map((v) => v.title)}
            empty="Tous les storyboards sont complets"
            variant="warning"
          />
          <AlertSection
            title="Vidéos sans diagramme workflow"
            items={withoutDiagram.map((v) => v.title)}
            empty="Diagrammes optionnels — OK si concept non architectural"
            variant="info"
          />
          <AlertSection
            title="Captures manquantes (liste vide)"
            items={missingScreenshots.map((v) => v.title)}
            empty="Toutes les vidéos ont des captures listées"
            variant="warning"
          />
          <AlertSection
            title="Assets manquants"
            items={missingAssets.flatMap((v) => v.missingAssets)}
            empty="Tous les packs assets sont configurés"
            variant="error"
          />
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-ink">Détail par vidéo</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border-light">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border-light bg-surface text-left text-ink-tertiary">
                  <th className="px-4 py-3">Vidéo</th>
                  <th className="px-4 py-3">Storyboard</th>
                  <th className="px-4 py-3">Miniature</th>
                  <th className="px-4 py-3">Diagramme</th>
                  <th className="px-4 py-3">Captures</th>
                  <th className="px-4 py-3">Assets</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {status.videos.map((v) => {
                  const pack = getVideoAssets(v.slug);
                  return (
                    <tr key={v.slug} className="border-b border-border-light last:border-0">
                      <td className="px-4 py-3">
                        <p className="font-medium text-ink">{v.title}</p>
                        <p className="text-xs text-ink-tertiary">{v.module}</p>
                      </td>
                      <td className="px-4 py-3">{v.hasStoryboard ? "✓" : "—"}</td>
                      <td className="px-4 py-3">{v.hasThumbnail ? "✓" : "—"}</td>
                      <td className="px-4 py-3">{v.hasDiagram ? "✓" : "—"}</td>
                      <td className="px-4 py-3">{v.screenshotCount}</td>
                      <td className="px-4 py-3">{v.assetCount}</td>
                      <td className="px-4 py-3">
                        <Badge variant={v.productionReady ? "accent" : "default"}>{v.readyScore} %</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/videos/${v.slug}`} className="font-semibold text-accent hover:underline">
                          Ouvrir
                        </Link>
                        {pack && (
                          <div className="mt-2 w-24">
                            <VideoThumbnail
                              title={v.title}
                              module={v.module}
                              icon={pack.icon}
                              background={pack.background}
                              level={v.level}
                              thumbnailPath={pack.thumbnailPath}
                              compact
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-border-light bg-surface-elevated p-6">
          <h2 className="font-bold text-ink">Bibliothèque assets</h2>
          <ul className="mt-3 space-y-1 font-mono text-xs text-ink-secondary">
            <li>/public/video-assets/icons/ — 20 icônes SVG</li>
            <li>/public/video-assets/backgrounds/ — 5 fonds</li>
            <li>/public/video-assets/diagrams/ — 8 workflows</li>
            <li>/public/video-assets/lower-thirds/ — 4 templates</li>
            <li>/public/video-assets/thumbnails/ — 18 miniatures</li>
            <li>/public/video-assets/screenshots/ — captures à ajouter</li>
          </ul>
          <p className="mt-3 text-sm text-ink-secondary">
            Régénérer : <code className="rounded bg-surface px-1">node scripts/generate-video-assets.mjs</code>
          </p>
        </section>
      </div>
    </PageShell>
  );
}

function AlertSection({
  title,
  items,
  empty,
  variant,
}: {
  title: string;
  items: string[];
  empty: string;
  variant: "warning" | "info" | "error";
}) {
  const colors = {
    warning: "border-amber-200 bg-amber-50",
    info: "border-blue-200 bg-blue-50",
    error: "border-red-200 bg-red-50",
  };
  return (
    <div className={`rounded-2xl border p-5 ${colors[variant]}`}>
      <h3 className="font-bold text-ink">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-ink-secondary">{empty}</p>
      ) : (
        <ul className="mt-2 space-y-1 text-sm text-ink-secondary">
          {items.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
