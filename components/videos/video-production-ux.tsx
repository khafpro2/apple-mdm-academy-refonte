import Link from "next/link";
import { DEMO_VIDEO_MESSAGE } from "@/src/lib/video-display-status";
import { VideoStatusBadges } from "@/components/videos/VideoStatusBadges";
import type { VideoDisplayBadge } from "@/src/lib/video-display-status";

/** Bandeau bibliothèque /videos — explique le mode préparation */
export function VideoProductionLibraryBanner({
  publishedCount,
  inProductionCount,
  totalPilot,
}: {
  publishedCount: number;
  inProductionCount: number;
  totalPilot: number;
}) {
  if (inProductionCount === 0) return null;

  return (
    <section className="mt-8 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/60 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">Mode préparation</p>
          <h2 className="mt-1 text-lg font-bold text-ink">
            {publishedCount} vidéo{publishedCount > 1 ? "s" : ""} publiée{publishedCount > 1 ? "s" : ""} ·{" "}
            {inProductionCount} en production
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{DEMO_VIDEO_MESSAGE}</p>
          <p className="mt-2 text-xs text-ink-tertiary">
            En attendant le MP4 final, chaque module propose storyboard animé, script HeyGen, transcript, cours, lab et
            quiz.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/cours"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Continuer avec les cours
          </Link>
          <Link
            href="/labs"
            className="rounded-full border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-amber-50"
          >
            Faire un lab
          </Link>
          <Link
            href="/resources"
            className="rounded-full border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-amber-50"
          >
            Ressources PDF
          </Link>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-ink-tertiary">
        <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-green-800">
          Publiée = MP4 disponible
        </span>
        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-900">
          En production = mode démo + contenus associés
        </span>
        <span className="rounded-full border border-border-light bg-white px-3 py-1">
          {totalPilot} modules pilotes LMS
        </span>
      </div>
    </section>
  );
}

/** Liens cours · lab · quiz · ressource — réutilisable sur fiches vidéo */
export function VideoAlternateLearningLinks({
  courseSlug,
  labSlug,
  quizSlug,
  resourceSlug,
  variant = "default",
}: {
  courseSlug: string;
  labSlug: string;
  quizSlug: string;
  resourceSlug?: string;
  variant?: "default" | "compact" | "cards";
}) {
  const links = [
    { href: `/cours/${courseSlug}`, label: "Cours", hint: "Leçons complètes" },
    { href: `/labs/${labSlug}`, label: "Lab", hint: "Pratique terrain" },
    { href: `/quiz/${quizSlug}`, label: "Quiz", hint: "Valider" },
    resourceSlug && { href: `/resources/${resourceSlug}`, label: "Ressource", hint: "PDF / checklist" },
  ].filter(Boolean) as { href: string; label: string; hint: string }[];

  if (variant === "cards") {
    return (
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-xl border border-border-light bg-surface p-3 transition hover:border-accent/30 hover:bg-accent/5"
          >
            <p className="text-sm font-semibold text-ink">{link.label}</p>
            <p className="text-xs text-ink-tertiary">{link.hint}</p>
          </Link>
        ))}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <p className="text-xs text-ink-tertiary">
        En attendant la vidéo :{" "}
        {links.map((link, i) => (
          <span key={link.href}>
            {i > 0 && " · "}
            <Link href={link.href} className="font-semibold text-accent hover:underline">
              {link.label}
            </Link>
          </span>
        ))}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="inline-flex flex-col rounded-xl border border-border-light bg-surface px-3 py-2 transition hover:border-accent/30"
        >
          <span className="text-sm font-semibold text-ink">{link.label}</span>
          <span className="text-[10px] text-ink-tertiary">{link.hint}</span>
        </Link>
      ))}
    </div>
  );
}

/** Encadré mode démo — détail vidéo */
export function VideoDemoModeExplainer({
  badges,
  resourceSlug,
  courseSlug,
  labSlug,
  quizSlug,
}: {
  badges: VideoDisplayBadge[];
  courseSlug: string;
  labSlug: string;
  quizSlug: string;
  resourceSlug?: string;
}) {
  return (
    <section className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/80 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
          Mode démo
        </span>
        <VideoStatusBadges badges={badges} size="md" />
      </div>
      <h2 className="mt-3 text-base font-bold text-ink">Vidéo finale en cours de montage</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{DEMO_VIDEO_MESSAGE}</p>
      <ul className="mt-3 space-y-1 text-sm text-ink-secondary">
        <li>· Storyboard animé — parcours scène par scène ci-dessous</li>
        <li>· Script HeyGen prêt à copier pour la narration officielle</li>
        <li>· Transcript et notes de cours disponibles sur cette page</li>
      </ul>
      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-tertiary">
          Continuer la formation sans attendre
        </p>
        <VideoAlternateLearningLinks
          courseSlug={courseSlug}
          labSlug={labSlug}
          quizSlug={quizSlug}
          resourceSlug={resourceSlug}
          variant="cards"
        />
      </div>
    </section>
  );
}

/** Légende statuts — pages admin (vue apprenant) */
export function VideoProductionStatusLegend() {
  return (
    <section className="mb-8 rounded-2xl border border-blue-200 bg-blue-50/80 p-6">
      <h2 className="text-lg font-bold text-ink">Ce que voit l&apos;apprenant</h2>
      <p className="mt-2 text-sm text-ink-secondary">
        Tant que le MP4 n&apos;est pas publié, la page vidéo reste accessible en mode démo : storyboard, script,
        transcript et liens vers cours, lab, quiz et ressource.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Publiée", desc: "Lecteur MP4 officiel actif", className: "border-green-200 bg-green-50 text-green-800" },
          { label: "En production", desc: "Bandeau amber + mode démo", className: "border-amber-200 bg-amber-50 text-amber-900" },
          { label: "Storyboard prêt", desc: "Scènes + animation disponibles", className: "border-border-light bg-white text-ink-secondary" },
          { label: "Script prêt", desc: "Script HeyGen copiable", className: "border-blue-100 bg-blue-50 text-blue-900" },
        ].map((item) => (
          <div key={item.label} className={`rounded-xl border p-3 text-sm ${item.className}`}>
            <p className="font-semibold">{item.label}</p>
            <p className="mt-1 text-xs opacity-90">{item.desc}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-ink-tertiary">
        Prévisualiser une vidéo en production :{" "}
        <Link href="/videos/abm-intune" className="font-semibold text-accent hover:underline">
          /videos/abm-intune
        </Link>
      </p>
    </section>
  );
}
