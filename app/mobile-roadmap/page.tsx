import Link from "next/link";
import { PageShell } from "@/components/layout";
import { SectionHeading, Badge } from "@/components/ui";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "App Mobile — Roadmap",
  description: "Application mobile Apple MDM Academy pour iOS et Android — progression, examens, notifications push. Roadmap et inscriptions bêta.",
  path: "/mobile-roadmap",
});

const FEATURES = [
  {
    icon: "📚",
    title: "Cours & Parcours",
    desc: "Accédez à tous vos cours, reprenez là où vous vous êtes arrêté, mode hors-ligne.",
    status: "planned" as const,
  },
  {
    icon: "📝",
    title: "Examens blancs",
    desc: "Passez les examens blancs depuis votre téléphone — chronomètre et correction.",
    status: "planned" as const,
  },
  {
    icon: "🔔",
    title: "Notifications push",
    desc: "Rappels de révision personnalisés, badges débloqués, mises à jour des cours.",
    status: "planned" as const,
  },
  {
    icon: "🧠",
    title: "Mode révision",
    desc: "Cartes de révision SM-2 optimisées pour les sessions courtes en mobilité.",
    status: "planned" as const,
  },
  {
    icon: "🏆",
    title: "Certificats & Badges",
    desc: "Téléchargez vos certificats PDF, partagez vos badges sur LinkedIn.",
    status: "planned" as const,
  },
  {
    icon: "📊",
    title: "Dashboard de progression",
    desc: "Graphiques de progression, prédiction de score examen, recommandations IA.",
    status: "planned" as const,
  },
];

const TIMELINE = [
  { quarter: "Q3 2026", title: "Bêta fermée iOS", desc: "App Expo/React Native — parcours, quiz, notifications push. 100 testeurs invités." },
  { quarter: "Q3 2026", title: "Bêta fermée Android", desc: "Version Android parallèle au déploiement iOS." },
  { quarter: "Q4 2026", title: "Lancement public", desc: "App Store + Google Play. Mode hors-ligne, examens blancs complets." },
  { quarter: "Q1 2027", title: "V2 mobile", desc: "Mode révision SM-2, notifications intelligentes, certificats partagés." },
];

export default function MobileRoadmapPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
        {/* Hero */}
        <div className="text-center">
          <p className="text-6xl" aria-hidden="true">📱</p>
          <SectionHeading
            label="Roadmap mobile"
            title="Apple MDM Academy sur iOS & Android"
            description="L'application mobile est en développement — bêta prévue Q3 2026. Inscrivez-vous pour être parmi les premiers testeurs."
            align="center"
          />
        </div>

        {/* Beta signup */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/5 to-purple-50 px-8 py-8 text-center">
          <Badge variant="warning" className="mb-3">Bêta fermée — Q3 2026</Badge>
          <h2 className="text-xl font-bold text-ink">Rejoindre la liste bêta</h2>
          <p className="mt-2 text-sm text-ink-secondary">
            Soyez parmi les 100 premiers testeurs — accès gratuit à la bêta + feedback direct avec l&apos;équipe.
          </p>
          <Link
            href="/contact?subject=Inscription bêta mobile"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            S&apos;inscrire à la bêta →
          </Link>
        </div>

        {/* Features */}
        <h2 className="mt-14 text-xl font-bold text-ink">Fonctionnalités prévues</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border-light bg-surface-elevated p-5 transition hover:shadow-sm"
            >
              <span className="text-2xl" aria-hidden="true">{f.icon}</span>
              <h3 className="mt-2 font-semibold text-ink">{f.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-secondary">{f.desc}</p>
              <div className="mt-3">
                <Badge variant="default">Prévu</Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <h2 className="mt-14 text-xl font-bold text-ink">Calendrier de déploiement</h2>
        <div className="mt-4 space-y-4">
          {TIMELINE.map((t) => (
            <div
              key={t.title}
              className="flex gap-5 rounded-2xl border border-border-light bg-surface-elevated px-6 py-5"
            >
              <div className="shrink-0">
                <Badge variant="accent">{t.quarter}</Badge>
              </div>
              <div>
                <p className="font-semibold text-ink">{t.title}</p>
                <p className="mt-0.5 text-sm text-ink-secondary">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stack technique */}
        <div className="mt-12 rounded-2xl border border-border-light bg-surface p-6">
          <p className="text-sm font-semibold text-ink">Stack technique</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["React Native", "Expo", "TypeScript", "Supabase", "Push Notifications", "Offline First"].map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-surface-elevated border border-border-light px-3 py-1 text-xs font-medium text-ink-secondary"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/roadmap" className="text-sm font-medium text-accent hover:underline">
            ← Voir la roadmap complète
          </Link>
          <span className="text-ink-tertiary">·</span>
          <Link href="/contact" className="text-sm font-medium text-accent hover:underline">
            Une question sur la bêta ?
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
