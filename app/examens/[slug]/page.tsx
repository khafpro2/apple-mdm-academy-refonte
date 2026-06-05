import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout";
import { Breadcrumb } from "@/components/ui";
import { QuizEngine } from "@/components/quiz/quiz-engine";
import { ExamEngine } from "@/components/quiz/exam-engine";
import { getQuiz, getExamPool } from "@/lib/data";
import { getQuizSlugFromExamRoute } from "@/lib/data/exams/pools";
import { getUser } from "@/lib/supabase/server";

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
  return { title: quiz?.title ?? "Examen blanc" };
}

export default async function ExamDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quizSlug = getQuizSlugFromExamRoute(slug);
  if (!quizSlug) notFound();

  const quiz = getQuiz(quizSlug);
  if (!quiz) notFound();

  const user = await getUser();

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8 lg:py-16">
        <Breadcrumb
          items={[
            { label: "Examens", href: "/examens" },
            { label: quiz.title },
          ]}
        />
        {quiz.examMode && quiz.examQuestionCount ? (
          <ExamEngine
            quiz={quiz}
            basePool={getExamPool(quiz.slug) ?? quiz.questions}
            questionCount={quiz.examQuestionCount}
            isAuthenticated={!!user}
          />
        ) : (
          <QuizEngine quiz={quiz} isAuthenticated={!!user} />
        )}
      </div>
    </PageShell>
  );
}
