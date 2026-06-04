import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout";
import { Breadcrumb } from "@/components/ui";
import { QuizEngine } from "@/components/quiz/quiz-engine";
import { getQuiz, quizzes } from "@/lib/data";
import { getUser } from "@/lib/supabase/server";

export function generateStaticParams() {
  return quizzes.map((q) => ({ slug: q.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quiz = getQuiz(slug);
  return { title: quiz?.title ?? "Quiz" };
}

export default async function QuizDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quiz = getQuiz(slug);
  if (!quiz) notFound();

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
        <QuizEngine quiz={quiz} isAuthenticated={!!user} />
      </div>
    </PageShell>
  );
}
