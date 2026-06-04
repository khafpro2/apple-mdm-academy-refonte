import { Nav, Footer } from "@/components/nav";
import { ExamCard, PageHeader } from "@/components/cards";
import { exams } from "@/lib/data";

export default function ExamensPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] text-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <Nav />
        <div className="py-12">
          <PageHeader
            label="Certification"
            title="Examens blancs"
            description="Simule les conditions réelles : 100 questions, chronomètre, score immédiat et corrections détaillées."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <ExamCard key={exam.slug} slug={exam.slug} title={exam.title} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
