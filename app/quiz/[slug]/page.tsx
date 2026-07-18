import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/layout";
import { Breadcrumb } from "@/components/ui";
import { QuizEngine } from "@/components/quiz/quiz-engine";
import { ExamEngine } from "@/components/quiz/exam-engine";
import { getExamRouteFromQuizSlug } from "@/lib/data/exams/exam-routes";
import { getQuiz, getExamPool, quizzes, isTrackVisible } from "@/lib/data";
import { getUser } from "@/lib/supabase/server";

export const dynamicParams = false;

export function generateStaticParams() {
  return quizzes.filter((q) => isTrackVisible(q.trackSlug)).map((q) => ({ slug: q.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quiz = getQuiz(slug);
  const visible = quiz && isTrackVisible(quiz.trackSlug);
  return buildPageMetadata({
    title: visible ? quiz.title : "Quiz introuvable",
    description: visible ? quiz.description : "Ce quiz n'existe pas ou a été déplacé.",
    path: `/quiz/${slug}`,
    noIndex: !visible,
  });
}

export default async function QuizDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quiz = getQuiz(slug);
  if (!quiz || !isTrackVisible(quiz.trackSlug)) notFound();

  const user = await getUser();

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8 lg:py-16">
        <Breadcrumb
          items={[
            { label: "Quiz", href: "/quiz" },
            { label: quiz.title },
          ]}
        />
        {quiz.examMode && quiz.examQuestionCount ? (
          <ExamEngine
            quiz={quiz}
            basePool={getExamPool(quiz.slug) ?? quiz.questions}
            questionCount={quiz.examQuestionCount}
            isAuthenticated={!!user}
            routeSlug={getExamRouteFromQuizSlug(quiz.slug) ?? quiz.slug}
          />
        ) : (
          <QuizEngine quiz={quiz} isAuthenticated={!!user} />
        )}
      </div>
    </PageShell>
  );
}
