import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading, Badge } from "@/components/ui";
import { requireAdmin } from "@/lib/supabase/admin";
import {
  getMediaProductionStatus,
  MEDIA_REQUIRED_MESSAGE,
} from "@/src/lib/media-production-status.server";
import { VideoProductionStatusLegend } from "@/components/videos/video-production-ux";
import { DEMO_VIDEO_MESSAGE } from "@/src/lib/video-display-status";

export const metadata = { title: "Plan production médias", robots: { index: false, follow: false } };

const PRODUCTION_STEPS = [
  {
    step: 1,
    title: "Produire les 29 captures .webp",
    detail: "Enregistrer chaque écran avec Screen Studio, exporter en WebP 1920×1080 dans public/video-assets/screenshots/.",
  },
  {
    step: 2,
    title: "Générer les 8 narrations HeyGen",
    detail: "Copier le script depuis chaque page /videos/[slug], générer la voix officielle HeyGen.",
  },
  {
    step: 3,
    title: "Monter les 8 vidéos",
    detail: "Assembler captures + narration dans CapCut ou Screen Studio. Vérifier rythme, transitions et lisibilité.",
  },
  {
    step: 4,
    title: "Déposer les MP4 dans /public/videos/",
    detail: "Nommer exactement les fichiers attendus (voir checklist ci-dessous). Poids > 1 MB, 1080p recommandé.",
  },
  {
    step: 5,
    title: "Lancer les validations",
    detail: "Exécuter npm run check:screenshots puis npm run check:mp4 avant publication.",
  },
];

const MP4_RULES = [
  "Format MP4",
  "Poids > 1 MB",
  "1080p recommandé",
  "Son clair",
  "Sous-titres recommandés",
];

const HOW_TO_STEPS = [
  "Ouvrir /videos/[slug]",
  "Copier le script HeyGen",
  "Générer la narration",
  "Ouvrir Screen Studio",
  "Enregistrer les captures",
  "Monter dans CapCut ou Screen Studio",
  "Exporter en MP4",
  "Déposer le fichier dans /public/videos/",
  "Lancer npm run check:mp4",
];

function StatusIcon({ present }: { present: boolean }) {
  return (
    <span className={present ? "text-green-700" : "text-amber-700"} aria-hidden>
      {present ? "✅" : "○"}
    </span>
  );
}

export default async function MediaProductionPlanPage() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    redirect(auth.reason === "unauthenticated" ? "/auth/login?redirect=/admin/media-production-plan" : "/dashboard");
  }

  const status = getMediaProductionStatus();

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            label="Production manuelle"
            title="Plan de production médias"
            description="Guide pas à pas pour finaliser les 8 vidéos pilotes LMS."
          />
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/video-pipeline" className="text-sm font-semibold text-accent hover:underline">
              Pipeline →
            </Link>
            <Link href="/admin/video-library" className="text-sm font-semibold text-accent hover:underline">
              Bibliothèque →
            </Link>
            <Link href="/admin" className="text-sm font-semibold text-accent hover:underline">
              ← Admin
            </Link>
          </div>
        </div>

        {status.mediaRequired && (
          <section className="mb-8 rounded-2xl border-2 border-amber-400 bg-amber-50 p-6">
            <Badge variant="default">MEDIA REQUIRED</Badge>
            <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{MEDIA_REQUIRED_MESSAGE}</p>
            <p className="mt-2 text-xs text-ink-tertiary">
              MP4 : {status.mp4Present}/{status.mp4Total} · Captures : {status.capturesPresent}/{status.capturesTotal}
            </p>
          </section>
        )}

        <VideoProductionStatusLegend />

        <section className="mb-8 rounded-2xl border border-border-light bg-surface-elevated p-6">
          <h2 className="text-lg font-bold text-ink">Plan d&apos;action</h2>
          <ol className="mt-6 space-y-4">
            {PRODUCTION_STEPS.map(({ step, title, detail }) => (
              <li key={step} className="flex gap-4 rounded-xl border border-border-light bg-surface p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                  {step}
                </span>
                <div>
                  <p className="font-semibold text-ink">{title}</p>
                  <p className="mt-1 text-sm text-ink-secondary">{detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-8 rounded-2xl border border-border-light bg-surface-elevated p-6">
          <h2 className="text-lg font-bold text-ink">Commandes de validation</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <code className="rounded-lg bg-surface px-4 py-2 text-sm text-ink-secondary">npm run check:screenshots</code>
            <code className="rounded-lg bg-surface px-4 py-2 text-sm text-ink-secondary">npm run check:mp4</code>
          </div>
        </section>

        <section className="mb-8 rounded-2xl border border-border-light bg-surface-elevated p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-ink">Checklist MP4 ({status.mp4Present}/{status.mp4Total})</h2>
              <p className="mt-1 text-sm text-ink-secondary">Dossier cible : public/videos/</p>
            </div>
            <ul className="text-xs text-ink-tertiary">
              {MP4_RULES.map((rule) => (
                <li key={rule}>· {rule}</li>
              ))}
            </ul>
          </div>
          <ul className="mt-6 space-y-2">
            {status.pilotMp4.map((video) => (
              <li
                key={video.filename}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-border-light bg-surface px-4 py-3 text-sm"
              >
                <StatusIcon present={video.present} />
                <code className="font-mono text-ink">/public/videos/{video.filename}</code>
                <span className="text-ink-secondary">{video.title}</span>
                <Link href={`/videos/${video.slug}`} className="ml-auto text-xs font-semibold text-accent hover:underline">
                  Page vidéo →
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8 rounded-2xl border border-border-light bg-surface-elevated p-6">
          <h2 className="text-lg font-bold text-ink">
            Checklist captures ({status.capturesPresent}/{status.capturesTotal})
          </h2>
          <p className="mt-1 text-sm text-ink-secondary">Dossier cible : public/video-assets/screenshots/</p>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {["Apple Business Manager", "Microsoft Intune", "Jamf Pro", "macOS"].map((category) => {
              const items = status.expectedCaptures.filter((c) => c.category === category);
              if (items.length === 0) return null;
              return (
                <div key={category}>
                  <h3 className="text-sm font-bold text-ink">{category}</h3>
                  <ul className="mt-3 space-y-1.5">
                    {items.map((capture) => (
                      <li
                        key={capture.file}
                        className="flex items-center gap-2 rounded-lg bg-surface px-3 py-2 text-xs"
                      >
                        <StatusIcon present={capture.present} />
                        <code className="font-mono text-ink-secondary">{capture.file}</code>
                        <span className="text-ink-tertiary">{capture.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-dashed border-accent/40 bg-accent/5 p-6">
          <h2 className="text-lg font-bold text-ink">Expérience apprenant pendant la production</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{DEMO_VIDEO_MESSAGE}</p>
          <ul className="mt-4 space-y-2 text-sm text-ink-secondary">
            <li>· Bandeau « Mode démo » + badges En production / Storyboard prêt / Script prêt</li>
            <li>· Liens directs vers cours, lab, quiz et ressource PDF sur chaque fiche vidéo</li>
            <li>· Storyboard animé et script HeyGen accessibles sans MP4</li>
          </ul>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-ink-secondary">
            {HOW_TO_STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="mt-6 text-sm font-semibold text-ink">Comment produire une vidéo</p>
          <p className="mt-6 text-sm text-ink-secondary">
            Le site public reste accessible en mode préparation : storyboard, transcript, script HeyGen et ressources
            associées sont visibles même sans MP4.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/videos/abm-intune" className="text-sm font-semibold text-accent hover:underline">
              Exemple mode démo →
            </Link>
            <Link
              href="/resources/heygen-screen-studio-workflow"
              className="text-sm font-semibold text-accent hover:underline"
            >
              Workflow HeyGen + Screen Studio →
            </Link>
            <Link href="/resources/guide-captures-video" className="text-sm font-semibold text-accent hover:underline">
              Guide captures vidéo →
            </Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
