import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading, Badge } from "@/components/ui";
import { OFFICIAL_MP4_FILENAMES } from "@/src/lib/video-production";

export const metadata = {
  title: "Workflow HeyGen + Screen Studio",
  description: "Guide rapide pour produire les vidéos Apple MDM Academy avec HeyGen, Screen Studio et CapCut.",
};

const STEPS = [
  {
    title: "Copier le script",
    detail:
      "Ouvrir /admin/video-pipeline/production-packs, choisir la vidéo, cliquer « Copier script HeyGen » ou « Exporter script .txt ». Le texte est nettoyé pour une voix professionnelle.",
  },
  {
    title: "Générer la voix / avatar dans HeyGen",
    detail:
      "Coller le script dans HeyGen · avatar professionnel · voix fr-FR · format 16:9 · sous-titres français activés.",
  },
  {
    title: "Exporter l'audio ou la vidéo HeyGen",
    detail: "Télécharger la piste audio ou la vidéo présentateur pour l'importer dans CapCut.",
  },
  {
    title: "Enregistrer les captures Screen Studio",
    detail:
      "Suivre la checklist Screen Studio du pack · 1920×1080 · zoom 120 % · flouter emails et serial numbers · exporter en .webp.",
  },
  {
    title: "Monter dans CapCut",
    detail:
      "Intro 5 s · logo · voix HeyGen · captures animées · sous-titres FR · lower thirds · outro 5 s. Voir checklist CapCut dans le pack.",
  },
  {
    title: "Exporter en MP4",
    detail: "1080p · H.264 · 30 fps · qualité maximale.",
  },
  {
    title: "Déposer dans /public/videos/",
    detail: "Utiliser le nom canonique indiqué dans le pack (ex. apple-business-manager.mp4, automated-device-enrollment.mp4).",
  },
  {
    title: "Vérifier le pipeline",
    detail:
      "node scripts/check-video-screenshots.mjs · /admin/video-pipeline · statut « Publiée » uniquement si script, ressource, transcript, captures et MP4 sont OK.",
  },
];

export default function HeyGenScreenStudioWorkflowPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8 lg:py-16">
        <Link href="/resources" className="text-sm font-semibold text-accent hover:underline">
          ← Ressources
        </Link>

        <div className="mt-6">
          <SectionHeading
            label="Production vidéo"
            title="Workflow rapide HeyGen + Screen Studio"
            description="Produire une vidéo officielle LMS en 8 étapes — de la copie du script à la publication."
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Badge>HeyGen</Badge>
          <Badge>Screen Studio</Badge>
          <Badge>CapCut</Badge>
          <Badge variant="accent">1080p MP4</Badge>
        </div>

        <section className="mt-10 rounded-2xl border border-border-light bg-surface-elevated p-6">
          <h2 className="text-lg font-bold text-ink">Noms MP4 canoniques</h2>
          <ul className="mt-4 space-y-2 font-mono text-sm text-ink-secondary">
            {Object.entries(OFFICIAL_MP4_FILENAMES).map(([slug, file]) => (
              <li key={slug}>
                <span className="text-ink-tertiary">{slug}</span> → /public/videos/{file}
              </li>
            ))}
          </ul>
        </section>

        <ol className="mt-10 space-y-6">
          {STEPS.map((step, i) => (
            <li key={step.title} className="rounded-2xl border border-border-light bg-surface-elevated p-6">
              <p className="text-xs font-semibold uppercase text-accent">Étape {i + 1}</p>
              <h2 className="mt-1 text-lg font-bold text-ink">{step.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{step.detail}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/admin/video-pipeline/production-packs"
            className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Ouvrir les production packs
          </Link>
          <Link
            href="/resources/guide-captures-video"
            className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink"
          >
            Guide captures
          </Link>
          <Link
            href="/resources/video-production-guide"
            className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink"
          >
            Guide montage complet
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
