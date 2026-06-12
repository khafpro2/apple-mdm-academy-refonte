import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout";
import { Breadcrumb } from "@/components/ui";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getQuiz } from "@/lib/data/quizzes";
import { getExamPool, getExamRouteFromQuizSlug } from "@/lib/data/exams/pools";
import { ReadinessWidget } from "@/components/revision/readiness-widget";
import { RevisionSessionWrapper } from "@/components/revision/revision-session-wrapper";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const quiz = getQuiz(slug);
  return buildPageMetadata({
    title: quiz ? `Révision — ${quiz.title}` : "Mode Révision",
    description: quiz
      ? `Révisez ${quiz.title} avec la répétition espacée SM-2.`
      : "Mode révision Apple MDM Academy.",
    path: `/revision/${slug}`,
  });
}

export default async function RevisionSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const quiz = getQuiz(slug);
  const pool = getExamPool(slug);
  const examRoute = getExamRouteFromQuizSlug(slug);

  if (!quiz || !pool || pool.length === 0) notFound();

  // Serialize only the needed question fields (no functions)
  const questions = pool.slice(0, 50).map((q) => ({
    id: q.id,
    text: q.text,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: q.explanation ?? "",
  }));

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-6 py-12 lg:px-8 lg:py-16">
        <Breadcrumb
          items={[
            { label: "Révision", href: "/revision" },
            { label: quiz.title, href: `/revision/${slug}` },
          ]}
        />
        <h1 className="mt-6 text-2xl font-bold text-ink">Révision — {quiz.title}</h1>
        <p className="mt-2 text-sm text-ink-secondary">
          {questions.length} cartes · répétition espacée SM-2
        </p>

        <div className="mt-6">
          <ReadinessWidget
            quizSlug={slug}
            examHref={examRoute ? `/examens/${examRoute}` : "/examens"}
          />
        </div>

        <div className="mt-8">
          <RevisionSessionWrapper questions={questions} quizSlug={slug} />
        </div>
      </div>
    </PageShell>
  );
}
