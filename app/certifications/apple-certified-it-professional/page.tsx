import Link from "next/link";
import { PageShell } from "@/components/layout";
import { Breadcrumb, Badge, ButtonLink, Card, ProgressBar } from "@/components/ui";
import { TrackLogo } from "@/components/ui/track-logo";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  ACITP_CURRICULUM,
  ACITP_REQUIRED_LAB_SLUGS,
  ACITP_SKILLS,
} from "@/lib/data/acitp/curriculum";
import { ACITP_EXAM_TOTAL, ACITP_EXAM_DURATION_MINUTES, ACITP_PASSING_SCORE } from "@/lib/data/acitp/domains";
import { getCommercialCertPath } from "@/lib/data/commercial-certification-paths";
import { appleTrainingResources } from "@/lib/data/official-cert-links";
import { labs } from "@/lib/labs";

export const metadata = buildPageMetadata({
  title: "Apple Certified IT Professional — Préparation certification",
  description:
    "Parcours complet francophone Apple Certified IT Professional : compétences Apple, labs, examen blanc 200 questions.",
  path: "/certifications/apple-certified-it-professional",
});

const path = getCommercialCertPath("apple-certified-it-professional")!;

export default function AcitpCertificationPage() {
  const acitpLabs = ACITP_REQUIRED_LAB_SLUGS.map((slug) => labs.find((l) => l.slug === slug)).filter(Boolean);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <Breadcrumb
          items={[
            { label: "Certifications", href: "/examens" },
            { label: path.title },
          ]}
        />

        <header className="rounded-3xl border border-border-light bg-gradient-to-br from-blue-600/10 to-indigo-600/10 p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <TrackLogo logo={path.logo} size={32} alt={path.title} className="h-14 w-14" />
            <Badge>{path.level}</Badge>
            <Badge variant="accent">Préparation alignée Apple</Badge>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-ink md:text-4xl">{path.title}</h1>
          <p className="mt-4 max-w-3xl text-lg text-ink-secondary">{path.description}</p>
          <p className="mt-3 text-sm text-ink-tertiary">
            {path.duration} · Examen blanc {ACITP_EXAM_TOTAL} questions · {ACITP_EXAM_DURATION_MINUTES} min · Seuil {ACITP_PASSING_SCORE} %
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/cours/apple-it-professional">Commencer les cours</ButtonLink>
            <ButtonLink href="/examens/apple-it-professional" variant="secondary">
              Examen blanc {ACITP_EXAM_TOTAL} Q
            </ButtonLink>
            <ButtonLink href="/examens/preparation-report" variant="secondary">
              Rapport de préparation
            </ButtonLink>
          </div>
        </header>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-ink">Présentation</h2>
          <p className="mt-3 max-w-3xl text-ink-secondary">
            Apple MDM Academy propose la meilleure préparation francophone à la certification{" "}
            <strong>Apple Certified IT Professional</strong>. Le parcours couvre macOS, apps Apple,
            sécurité, Apple Business Manager, MDM et dépannage enterprise — aligné sur les compétences
            réellement évaluées par Apple.
          </p>
        </section>

        <section className="mt-10 rounded-2xl border border-border-light bg-surface-elevated p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">À savoir avant l&apos;examen officiel</p>
          <h2 className="mt-2 text-xl font-bold text-ink">Règles Apple Training</h2>
          <div className="mt-4 grid gap-4 text-sm text-ink-secondary md:grid-cols-2">
            <p>
              Les examens Apple sont planifiés via Pearson VUE / OnVUE ou, selon disponibilité locale,
              dans certains centres physiques. L&apos;inscription officielle, l&apos;identité requise et les
              consignes de passage viennent de Pearson VUE.
            </p>
            <p>
              Si vous échouez, Apple indique un délai de {appleTrainingResources.retakeDelayDays} jours avant
              une nouvelle tentative, avec {appleTrainingResources.maxAttempts} tentatives maximum pour réussir
              l&apos;examen. Les badges Apple sont émis et vérifiés via Credly.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
            <a href={appleTrainingResources.resourcesUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              Ressources Apple
            </a>
            <a href={appleTrainingResources.pearsonVueUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              Planifier via Pearson VUE
            </a>
            <a href={appleTrainingResources.identityGuidelinesUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              Guidelines identité Apple
            </a>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-ink">Compétences évaluées</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {ACITP_SKILLS.map((skill) => (
              <li key={skill} className="flex items-start gap-2 text-sm text-ink-secondary">
                <span className="text-accent">✓</span> {skill}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-ink">Modules requis ({ACITP_CURRICULUM.length})</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ACITP_CURRICULUM.map((mod) => (
              <Card key={mod.id} className="p-4" hover>
                <div id={mod.id}>
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">{mod.category}</p>
                <h3 className="mt-1 font-bold text-ink">{mod.title}</h3>
                <p className="mt-2 text-xs text-ink-secondary">{mod.description}</p>
                <p className="mt-2 text-xs text-ink-tertiary">
                  {mod.lessonSlugs.length} leçons
                  {mod.labSlug ? " · Lab requis" : ""}
                </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-ink">Labs requis ({ACITP_REQUIRED_LAB_SLUGS.length})</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {acitpLabs.map((lab) => (
              <Link
                key={lab!.slug}
                href={`/labs/${lab!.slug}`}
                className="rounded-2xl border border-border-light bg-surface-elevated p-5 transition hover:border-accent/40"
              >
                <h3 className="font-bold text-ink">{lab!.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-ink-secondary">{lab!.description}</p>
                <span className="mt-3 inline-block text-xs font-semibold text-accent">Commencer le lab →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-border-light bg-surface-elevated p-6">
          <h2 className="text-xl font-bold text-ink">Examens blancs</h2>
          <p className="mt-2 text-sm text-ink-secondary">
            Simulation {ACITP_EXAM_TOTAL} questions · chronomètre {ACITP_EXAM_DURATION_MINUTES} min (2h30) ·
            reprise automatique · mode plein écran · sauvegarde session.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <ButtonLink href="/examens/apple-it-professional">Examen blanc ACITP</ButtonLink>
            <ButtonLink href="/quiz/quiz-abm-certification" variant="secondary">
              Quiz ABM (30 Q)
            </ButtonLink>
            <ButtonLink href="/quiz/quiz-ade-certification" variant="secondary">
              Quiz ADE
            </ButtonLink>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-ink">Score de préparation & certificat interne</h2>
          <p className="mt-2 text-sm text-ink-secondary">
            Obtenez le certificat <strong>Apple IT Professional Ready</strong> (Apple MDM Academy) avec{" "}
            {ACITP_PASSING_SCORE} % minimum à l&apos;examen blanc et les 10 labs terminés. Ce certificat interne
            atteste votre préparation sur la plateforme, pas la certification officielle Apple ni le badge Credly.
          </p>
          <div className="mt-4">
            <ButtonLink href="/dashboard" variant="secondary">
              Voir ma progression → Dashboard
            </ButtonLink>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-ink">Progression globale certification</h2>
          <p className="mt-2 text-sm text-ink-tertiary">
            Connectez-vous pour suivre cours, labs et score examen sur votre dashboard (Certification Readiness).
          </p>
          <div className="mt-4 max-w-md">
            <ProgressBar value={0} />
            <p className="mt-2 text-xs text-ink-tertiary">Progression synchronisée après connexion</p>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
