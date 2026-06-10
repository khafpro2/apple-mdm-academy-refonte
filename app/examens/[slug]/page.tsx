import { buildPageMetadata } from "@/lib/seo/metadata";
import { examPageJsonLd, breadcrumbJsonLd } from "@/lib/seo/course-schema";
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
  if (!quiz) {
    return buildPageMetadata({
      title: "Examen blanc",
      description: "Examen blanc Apple MDM Academy.",
      path: `/examens/${slug}`,
    });
  }
  return buildPageMetadata({
    title: quiz.title,
    description: quiz.description,
    path: `/examens/${slug}`,
  });
}

export default async function ExamIntroPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ctx = await requireExamPageContext(slug);
  const quiz = ctx.quiz;
  const ldExam = examPageJsonLd({
    name: quiz.title,
    description: quiz.description,
    slug,
    questionCount: quiz.examQuestionCount,
  });
  const ldBreadcrumb = breadcrumbJsonLd([
    { name: "Examens", path: "/examens" },
    { name: quiz.title, path: `/examens/${slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldExam) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBreadcrumb) }} />
      <ExamPageShell ctx={ctx} viewMode="intro" />
    </>
  );
}
