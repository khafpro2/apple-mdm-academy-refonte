import { notFound } from "next/navigation";
import Link from "next/link";
import { Nav, Footer } from "@/components/nav";
import { Breadcrumb } from "@/components/cards";
import { getExam, exams } from "@/lib/data";

export function generateStaticParams() {
  return exams.map((e) => ({ slug: e.slug }));
}

export default async function ExamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const exam = getExam(slug);
  if (!exam) notFound();

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <Nav />
        <div className="py-12">
          <Breadcrumb items={[{ label: "Examens", href: "/examens" }, { label: exam.title }]} />

          <header className="mb-10 rounded-3xl bg-black p-8 text-white shadow-2xl">
            <h1 className="text-4xl font-bold">{exam.title}</h1>
            <div className="mt-6 flex flex-wrap gap-6 text-zinc-300">
              <span>{exam.questions} questions</span>
              <span>{exam.duration}</span>
              <span>Score immédiat</span>
            </div>
          </header>

          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Domaines couverts</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {exam.topics.map((topic) => (
                <li key={topic} className="flex items-center gap-2 rounded-xl bg-[#f5f5f7] px-4 py-3">
                  <span className="text-zinc-400">●</span>
                  {topic}
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-6">
            <p className="font-semibold text-amber-900">Mode démo</p>
            <p className="mt-2 text-amber-800">
              Le moteur de quiz complet sera connecté à Supabase. Pour l&apos;instant, l&apos;examen démarre en mode
              aperçu avec 5 questions d&apos;exemple.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="rounded-full bg-black px-6 py-3 font-semibold text-white">Lancer l&apos;examen</button>
            <Link href="/examens" className="rounded-full border border-zinc-300 bg-white px-6 py-3 font-semibold">
              ← Retour aux examens
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
