import dynamic from "next/dynamic";
import { PageShell } from "@/components/layout";
import { Breadcrumb } from "@/components/ui";
import { SubscriptionGate } from "@/components/subscription/subscription-gate";
import { ExamPrepDisclaimer } from "@/components/exams/exam-prep-disclaimer";
import { ExamFormatPanels } from "@/components/exams/exam-format-panels";
import { examJsonLd } from "@/lib/seo/exam-schema";
import { getExamDisplayMetadata } from "@/lib/exams/ui-metadata-adapter";
import type { ExamPageContext } from "@/lib/exam/exam-page-data";

const ExamEngine = dynamic(
  () => import("@/components/quiz/exam-engine").then((m) => m.ExamEngine),
  { loading: () => <p className="text-center text-ink-secondary">Chargement de l&apos;examen…</p> }
);

const ExamResultPageClient = dynamic(
  () => import("@/components/exams/exam-result-page-client").then((m) => m.ExamResultPageClient),
  { loading: () => <p className="text-center text-ink-secondary">Chargement du résultat…</p> }
);

type ExamContext = ExamPageContext;

/**
 * Cursor page shell — metadata via Codex public adapter only
 * (getExamDisplayMetadata → officialPanel / simulationPanel / disclaimer).
 */
export function ExamPageShell({
  ctx,
  viewMode,
}: {
  ctx: ExamContext;
  viewMode: "intro" | "start" | "result";
}) {
  const { routeSlug, quiz, basePool, questionCount, examTier, isAuthenticated } = ctx;
  const examMetadata =
    viewMode === "intro" ? getExamDisplayMetadata(routeSlug, basePool.length) : null;

  const jsonLd =
    quiz.examQuestionCount && quiz.durationMinutes
      ? examJsonLd({
          title: quiz.title,
          description: quiz.description,
          routeSlug,
          durationMinutes: quiz.durationMinutes,
          questionCount: quiz.examQuestionCount,
        })
      : null;

  return (
    <PageShell>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
        <Breadcrumb
          items={[
            { label: "Examens", href: "/examens" },
            { label: quiz.title, href: `/examens/${routeSlug}` },
            ...(viewMode === "start" ? [{ label: "Session" }] : []),
            ...(viewMode === "result" ? [{ label: "Résultat" }] : []),
          ].filter(Boolean) as { label: string; href?: string }[]}
        />
        <ExamPrepDisclaimer examRouteSlug={routeSlug} examTitle={quiz.title} />
        {viewMode === "intro" && <ExamFormatPanels metadata={examMetadata} />}
        <SubscriptionGate requiredTier={examTier} featureLabel="examens blancs">
          {viewMode === "result" ? (
            <ExamResultPageClient routeSlug={routeSlug} quiz={quiz} />
          ) : (
            <ExamEngine
              key={`${routeSlug}-${viewMode}`}
              quiz={quiz}
              examFormat={ctx.examFormat}
              basePool={basePool}
              questionCount={questionCount}
              isAuthenticated={isAuthenticated}
              routeSlug={routeSlug}
              viewMode={viewMode === "start" ? "exam" : "intro"}
            />
          )}
        </SubscriptionGate>
      </div>
    </PageShell>
  );
}
