import { PageShell } from "@/components/layout";
import { SectionHeading, Badge, ButtonLink } from "@/components/ui";
import { getExams } from "@/lib/data/quizzes";
import { getExamRouteSlugs, examRouteToQuizSlug } from "@/lib/data/exams/pools";
import { getQuiz } from "@/lib/data/quizzes";
import { appleTrainingResources } from "@/lib/data/official-cert-links";

export const metadata = { title: "Examens blancs" };

const examRoutes = getExamRouteSlugs().map((routeSlug) => {
  const quizSlug = examRouteToQuizSlug[routeSlug]!;
  const quiz = getQuiz(quizSlug);
  return { routeSlug, quiz };
});

export default function ExamensPage() {
  const legacyExams = getExams().filter(
    (e) => !Object.values(examRouteToQuizSlug).includes(e.slug)
  );

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Certification"
          title="Examens blancs"
          description="Mode examen, chronomètre, correction détaillée et historique des tentatives."
        />

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

        <div className="grid gap-5 sm:grid-cols-2">
          {examRoutes.map(({ routeSlug, quiz }) =>
            quiz ? (
              <article
                key={routeSlug}
                className="flex flex-col rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm"
              >
                <Badge variant="accent">Examen blanc</Badge>
                <h2 className="mt-3 text-xl font-bold text-ink">{quiz.title}</h2>
                <p className="mt-2 flex-1 text-sm text-ink-secondary">{quiz.description}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-ink-tertiary">
                  <span>{quiz.duration}</span>
                  <span>·</span>
                  <span>Seuil {quiz.passingScore}%</span>
                  {quiz.examQuestionCount && (
                    <>
                      <span>·</span>
                      <span>{quiz.examQuestionCount} questions</span>
                    </>
                  )}
                </div>
                <ButtonLink href={`/examens/${routeSlug}`} className="mt-6 w-full text-center">
                  Démarrer l&apos;examen
                </ButtonLink>
              </article>
            ) : null
          )}
        </div>

        {legacyExams.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-bold text-ink">Autres examens</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {legacyExams.map((quiz) => (
                <article
                  key={quiz.slug}
                  className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm"
                >
                  <h3 className="font-bold text-ink">{quiz.title}</h3>
                  <ButtonLink href={`/quiz/${quiz.slug}`} size="sm" className="mt-4">
                    Accéder
                  </ButtonLink>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
