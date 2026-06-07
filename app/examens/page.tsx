import { PageShell } from "@/components/layout";
import { SectionHeading } from "@/components/ui";
import { ExamFeatureCard } from "@/components/exams/exam-feature-card";
import { ExamCatalogGrid } from "@/components/exams/exam-catalog-grid";
import { buildExamCatalog } from "@/lib/exam/exam-catalog";
import { appleTrainingResources } from "@/lib/data/official-cert-links";

export const metadata = { title: "Examens blancs" };

export default function ExamensPage() {
  const catalog = buildExamCatalog();
  const priority = catalog.filter((item) => item.priority);
  const others = catalog.filter((item) => !item.priority);

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Certification"
          title="Examens blancs"
          description="Mode examen, chronomètre, correction détaillée et historique des tentatives."
        />

        <ExamFeatureCard className="mb-8" />

        <section className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
          <p className="font-semibold">Examens blancs — préparation uniquement</p>
          <p className="mt-2 leading-relaxed">
            Les examens Apple MDM Academy simulent les conditions de préparation. Les certifications Apple
            officielles se planifient via Pearson VUE / OnVUE. Apple indique un délai de{" "}
            {appleTrainingResources.retakeDelayDays} jours avant retake et{" "}
            {appleTrainingResources.maxAttempts} tentatives maximum.
          </p>
          <div className="mt-3 flex flex-wrap gap-3 font-semibold">
            <a href={appleTrainingResources.resourcesUrl} target="_blank" rel="noopener noreferrer" className="text-amber-900 underline hover:no-underline">
              Ressources Apple Training
            </a>
            <a href={appleTrainingResources.pearsonVueUrl} target="_blank" rel="noopener noreferrer" className="text-amber-900 underline hover:no-underline">
              Pearson VUE Apple
            </a>
          </div>
        </section>

        <h2 className="mb-4 text-lg font-bold text-ink">Examens prioritaires</h2>
        <ExamCatalogGrid items={priority} />

        {others.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-bold text-ink">Autres examens</h2>
            <div className="mt-4">
              <ExamCatalogGrid items={others} />
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
