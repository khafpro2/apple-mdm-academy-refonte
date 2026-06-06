import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading, Badge, ProgressBar } from "@/components/ui";
import { requireAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { getVideoProductionStatus, getVideoAssets } from "@/src/lib/video-assets";
import { getScreenshotInventory, getScreenshotCompletionPercent } from "@/src/lib/video-screenshot-inventory.server";
import { SCREENSHOT_CATALOG } from "@/src/lib/video-screenshots";
import { VideoThumbnail } from "@/components/videos/VideoThumbnail";

export const metadata = { title: "Production vidéo", robots: { index: false, follow: false } };

export default async function VideoProductionAdminPage() {
  const auth = await requireAdmin();
  if (!auth.ok) redirect(auth.reason === "unauthenticated" ? "/auth/login?redirect=/admin/video-production" : "/dashboard");

  const inventory = getScreenshotInventory();
  const presentFiles = new Set(inventory.filter((i) => i.status === "present").map((i) => i.file));
  const status = getVideoProductionStatus({ presentScreenshotFiles: presentFiles });
  const screenshotPercent = getScreenshotCompletionPercent();
  const ready = status.videos.filter((v) => v.productionReady);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            label="Production vidéo"
            title="Captures réelles & montage"
            description={`${status.totalVideos} vidéos · ${ready.length} production ready · ${status.screenshotsPresent}/${status.screenshotsRequired} captures`}
          />
          <div className="flex flex-wrap gap-3">
            <Link href="/resources/video-production-guide" className="text-sm font-semibold text-accent hover:underline">
              Guide montage →
            </Link>
            <Link href="/admin" className="text-sm font-semibold text-accent hover:underline">
              ← Admin
            </Link>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Production Ready" value={`${status.productionReadyPercent} %`} highlight />
          <StatCard label="Captures .webp" value={`${status.screenshotsPresent}/${status.screenshotsRequired}`} sub={`${screenshotPercent} % complétion`} />
          <StatCard label="Storyboards" value={`${status.withStoryboard}/${status.totalVideos}`} />
          <StatCard label="Scripts HeyGen" value={`${status.videos.filter((v) => v.hasScript).length}/${status.totalVideos}`} />
        </div>

        <div className={`mb-8 rounded-2xl p-6 ${status.productionReadyPercent >= 75 ? "border border-green-200 bg-green-50" : "border border-amber-200 bg-amber-50"}`}>
          <p className="text-sm font-semibold uppercase text-ink-tertiary">Score global</p>
          <ProgressBar value={status.productionReadyPercent} className="mt-3" />
        </div>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-ink">Checklist captures par outil</h2>
          <p className="mt-1 text-sm text-ink-secondary">
            Déposer dans <code className="rounded bg-surface px-1">/public/video-assets/screenshots/</code> · 1920×1080 · .webp
          </p>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            {SCREENSHOT_CATALOG.categories.map((cat) => (
              <div key={cat.id} className="rounded-2xl border border-border-light bg-surface-elevated p-5">
                <h3 className="font-bold text-ink">{cat.label}</h3>
                <ul className="mt-3 space-y-2">
                  {cat.items.map((item) => {
                    const inv = inventory.find((i) => i.id === item.id);
                    const icon = inv?.status === "present" ? "✅" : inv?.status === "missing" ? "⚠️" : "❌";
                    return (
                      <li key={item.id} className="flex items-start gap-2 text-sm">
                        <span aria-hidden="true">{icon}</span>
                        <div>
                          <code className="text-xs text-accent">{item.file}</code>
                          <p className="text-ink-secondary">{item.label}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">Statut par vidéo</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border-light">
            <table className="w-full min-w-[960px] text-sm">
              <thead>
                <tr className="border-b border-border-light bg-surface text-left text-ink-tertiary">
                  <th className="px-4 py-3">Vidéo</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Script</th>
                  <th className="px-4 py-3">Assets</th>
                  <th className="px-4 py-3">Captures</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Actions</th>
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
                      <td className="px-4 py-3">
                        <Badge variant={v.status === "published" ? "accent" : "default"}>{v.statusLabel}</Badge>
                      </td>
                      <td className="px-4 py-3">{v.hasScript ? "✓" : "—"}</td>
                      <td className="px-4 py-3">{v.hasThumbnail && v.assetCount > 0 ? "✓" : "—"}</td>
                      <td className="px-4 py-3">
                        {v.screenshotFilesRequired > 0
                          ? `${v.screenshotFilesPresent}/${v.screenshotFilesRequired}`
                          : "—"}
                        {v.missingScreenshotFiles.length > 0 && (
                          <p className="mt-1 text-xs text-amber-700">{v.missingScreenshotFiles.length} manquante(s)</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={v.productionReady ? "accent" : "default"}>{v.readyScore} %</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/videos/${v.slug}`} className="font-semibold text-accent hover:underline">
                          Ouvrir · Pack
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
          <h2 className="font-bold text-ink">Commandes production</h2>
          <ul className="mt-3 space-y-1 font-mono text-xs text-ink-secondary">
            <li>node scripts/generate-video-assets.mjs</li>
            <li>node scripts/check-video-screenshots.mjs</li>
          </ul>
          <p className="mt-3 text-sm text-ink-secondary">
            Vidéos finales → <code className="rounded bg-surface px-1">/public/videos/{"{slug}"}.mp4</code>
          </p>
        </section>
      </div>
    </PageShell>
  );
}

function StatCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-5 ${highlight ? "border-accent/30 bg-accent/5" : "border-border-light bg-surface-elevated"}`}>
      <p className="text-xs font-semibold uppercase text-ink-tertiary">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${highlight ? "text-accent" : "text-ink"}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-ink-secondary">{sub}</p>}
    </div>
  );
}
