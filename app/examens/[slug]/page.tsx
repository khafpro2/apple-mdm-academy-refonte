import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout";
import { Breadcrumb } from "@/components/ui";
import { SubscriptionGate } from "@/components/subscription/subscription-gate";
import { getQuiz, getExamPool } from "@/lib/data";
import { getQuizSlugFromExamRoute } from "@/lib/data/exams/pools";
import { examJsonLd } from "@/lib/seo/exam-schema";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getUser } from "@/lib/supabase/server";

const ExamEngine = dynamic(
  () => import("@/components/quiz/exam-engine").then((m) => m.ExamEngine),
  { loading: () => <p className="text-center text-ink-secondary">Chargement de l&apos;examen…</p> }
);

export function generateStaticParams() {
  return [
    { slug: "apple-it-professional" },
    { slug: "jamf-100" },
    { slug: "jamf-200" },
    { slug: "intune-apple" },
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quizSlug = getQuizSlugFromExamRoute(slug);
  const quiz = quizSlug ? getQuiz(quizSlug) : undefined;
  if (!quiz) return buildPageMetadata({ title: "Examen blanc", description: "Examen blanc Apple MDM Academy.", path: `/examens/${slug}` });
  return buildPageMetadata({
    title: quiz.title,
    description: quiz.description,
    path: `/examens/${slug}`,
  });
}

export default async function ExamDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quizSlug = getQuizSlugFromExamRoute(slug);
  if (!quizSlug) notFound();

  const quiz = getQuiz(quizSlug);
  if (!quiz) notFound();

  const user = await getUser();

  const jsonLd =
    quiz.examQuestionCount && quiz.durationMinutes
      ? examJsonLd({
          title: quiz.title,
          description: quiz.description,
          routeSlug: slug,
          durationMinutes: quiz.durationMinutes,
          questionCount: quiz.examQuestionCount,
        })
      : null;

  return (
    <PageShell>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
        <Breadcrumb
          items={[
            { label: "Examens", href: "/examens" },
            { label: quiz.title },
          ]}
        />
        {quiz.examMode && quiz.examQuestionCount ? (
          <SubscriptionGate requiredTier="pro" featureLabel="examens blancs">
            <ExamEngine
              quiz={quiz}
              basePool={getExamPool(quiz.slug) ?? quiz.questions}
              questionCount={quiz.examQuestionCount}
              isAuthenticated={!!user}
              examRouteSlug={slug}
            />
          </SubscriptionGate>
        ) : null}
      </div>
    </PageShell>
  );
}
