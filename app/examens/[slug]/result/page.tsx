import { buildPageMetadata } from "@/lib/seo/metadata";
import { EXAM_ROUTE_SLUGS } from "@/lib/exam/exam-config";
import { requireExamPageContext } from "@/lib/exam/exam-page-data";
import { ExamPageShell } from "@/components/exams/exam-page-shell";
import { getQuizSlugFromExamRoute } from "@/lib/data/exams/pools";
import { getQuiz } from "@/lib/data/quizzes";

export function generateStaticParams() {
  return EXAM_ROUTE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quizSlug = getQuizSlugFromExamRoute(slug);
  const quiz = quizSlug ? getQuiz(quizSlug) : undefined;
  return buildPageMetadata({
    title: quiz ? `${quiz.title} — Résultat` : "Résultat examen",
    description: "Résultat et correction de l'examen blanc.",
    path: `/examens/${slug}/result`,
    noIndex: true,
  });
}

export default async function ExamResultPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ctx = await requireExamPageContext(slug);
  return <ExamPageShell ctx={ctx} viewMode="result" />;
}
