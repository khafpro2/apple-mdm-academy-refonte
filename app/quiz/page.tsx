import { PageShell } from "@/components/layout";
import { SectionHeading } from "@/components/ui";
import { QuizCard } from "@/components/cards";
import { quizzes, getExams, getQuizList } from "@/lib/data";

export const metadata = { title: "Quiz & Examens" };

export default function QuizPage() {
  const quizList = getQuizList();
  const exams = getExams();

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Évaluation"
          title="Quiz & examens blancs"
          description="Teste tes connaissances avec score automatique, corrections détaillées et badges de réussite."
        />

        <section className="mb-16">
          <h2 className="mb-6 text-xl font-bold text-ink">Quiz par parcours</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {quizList.map((q) => (
              <QuizCard
                key={q.slug}
                slug={q.slug}
                title={q.title}
                type={q.type}
                questions={q.questions.length}
                duration={q.duration}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-xl font-bold text-ink">Examens blancs</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {exams.map((q) => (
              <QuizCard
                key={q.slug}
                slug={q.slug}
                title={q.title}
                type={q.type}
                questions={q.questions.length}
                duration={q.duration}
                examQuestionCount={q.examQuestionCount}
              />
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
