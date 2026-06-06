import { notFound } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/layout";
import { Breadcrumb, Badge, ButtonLink } from "@/components/ui";
import { TrackLogo } from "@/components/ui/track-logo";
import {
  certificationPaths,
  getCertificationPath,
} from "@/lib/data/pro-modules/paths";
import { getProModulesForPath } from "@/lib/data/pro-modules/index";
import { getQuiz } from "@/lib/data";
import { getExamRouteFromQuizSlug } from "@/lib/data/exams/exam-routes";

export function generateStaticParams() {
  return certificationPaths.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const path = getCertificationPath(slug);
  return { title: path?.title ?? "Certification" };
}

export default async function CertificationPathPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const path = getCertificationPath(slug);
  if (!path) notFound();

  const modules = getProModulesForPath(path.moduleNumbers.filter((n) => n >= 11));
  const exam = getQuiz(path.examQuizSlug);
  const examRoute = exam ? getExamRouteFromQuizSlug(exam.slug) : undefined;

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <Breadcrumb
          items={[
            { label: "Parcours", href: "/parcours" },
            { label: path.title },
          ]}
        />

        <header className="rounded-3xl border border-border-light bg-surface-elevated p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <TrackLogo logo={path.logo} size={32} alt={path.title} className="h-14 w-14" />
            <Badge>{path.level}</Badge>
            <span className="text-sm text-ink-tertiary">
              {path.moduleNumbers.length} modules · {path.duration}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-ink md:text-4xl">{path.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-secondary">{path.description}</p>
          <p className="mt-3 text-sm font-semibold text-accent">
            Seuil examen : {path.passingScore} % · Certificat : {path.certId}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/cours/parcours-professionnel">Commencer le parcours</ButtonLink>
            {examRoute && (
              <ButtonLink href={`/examens/${examRoute}`} variant="secondary">
                Passer l&apos;examen
              </ButtonLink>
            )}
          </div>
        </header>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-ink">Modules du parcours</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {modules.map((mod) => (
              <div
                key={mod.slug}
                className="rounded-2xl border border-border-light bg-surface-elevated p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                  Module {mod.number}
                </p>
                <h3 className="mt-1 text-lg font-bold text-ink">{mod.title}</h3>
                <p className="mt-2 text-sm text-ink-secondary">{mod.description}</p>
                <ul className="mt-3 space-y-1 text-xs text-ink-tertiary">
                  <li>{mod.lessons.length} leçons · {mod.duration}</li>
                  <li>Quiz : {mod.quizSlug}</li>
                  <li>Lab : {mod.labSlug}</li>
                  <li>Badge : {mod.badgeName}</li>
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/cours/parcours-professionnel/${mod.lessons[0]?.slug}`}
                    className="text-xs font-semibold text-accent hover:underline"
                  >
                    Commencer →
                  </Link>
                  <Link
                    href={`/quiz/${mod.quizSlug}`}
                    className="text-xs font-semibold text-ink-secondary hover:underline"
                  >
                    Quiz
                  </Link>
                  <Link
                    href={`/labs/${mod.labSlug}`}
                    className="text-xs font-semibold text-ink-secondary hover:underline"
                  >
                    Lab
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {path.moduleNumbers.some((n) => n <= 10) && (
          <section className="mt-10 rounded-2xl border border-dashed border-border-light bg-surface p-6">
            <h2 className="text-lg font-bold text-ink">Modules fondations (1–10)</h2>
            <p className="mt-2 text-sm text-ink-secondary">
              Les modules 1 à 10 couvrent Apple Fundamentals, Device Support, IT Professional,
              Intune Mac et Jamf 100. Consultez les parcours correspondants sur la page Parcours.
            </p>
            <ButtonLink href="/parcours" variant="secondary" size="sm" className="mt-4">
              Voir les parcours fondations
            </ButtonLink>
          </section>
        )}
      </div>
    </PageShell>
  );
}
