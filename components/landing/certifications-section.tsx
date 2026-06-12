import Link from "next/link";
import { SectionHeading, Card, ProgressBar } from "@/components/ui";
import { ExamFeatureCard } from "@/components/exams/exam-feature-card";
import { TrackLogo } from "@/components/ui/track-logo";
import { commercialCertificationPaths } from "@/lib/data/commercial-certification-paths";

export function CertificationsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
      <SectionHeading
        label="Certifications"
        title="Préparez les certifications reconnues"
        description="Parcours complets alignés sur Apple, Jamf et Microsoft — modules, labs, examens blancs et certificat."
        align="center"
      />
      <ExamFeatureCard className="mx-auto mt-8 max-w-3xl" />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {commercialCertificationPaths.map((path) => (
          <Card key={path.slug} hover className={`bg-gradient-to-br ${path.color}`}>
            <div className="flex items-start justify-between">
              <TrackLogo logo={path.logo} trackSlug={path.trackSlug} alt={path.title} />
              <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-ink-secondary">
                {path.level}
              </span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-ink">{path.title}</h3>
            <p className="mt-2 text-sm text-ink-secondary">{path.description}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-ink-tertiary">
              <span>{path.modulesCount} modules</span>
              <span>·</span>
              <span>{path.labsCount} labs</span>
              <span>·</span>
              <span>{path.examsCount} examen</span>
              <span>·</span>
              <span>{path.duration}</span>
            </div>
            <ProgressBar value={0} className="mt-4" />
            {(() => {
              // Les parcours sans piste de cours dédiée (réutilisant apple-it-professional)
              // pointent vers leur examen spécifique plutôt qu'un parcours générique dupliqué.
              const isExamFocused =
                path.trackSlug === "apple-it-professional" &&
                path.slug !== "apple-certified-it-professional" &&
                Boolean(path.examRouteSlug);
              const href = isExamFocused
                ? `/examens/${path.examRouteSlug}`
                : `/parcours/${path.trackSlug}`;
              return (
                <Link href={href} className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
                  {isExamFocused ? "Voir l'examen →" : "Voir le parcours →"}
                </Link>
              );
            })()}
          </Card>
        ))}
      </div>
    </section>
  );
}
