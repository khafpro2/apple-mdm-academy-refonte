import { notFound } from "next/navigation";
import Link from "next/link";
import { Nav, Footer } from "@/components/nav";
import { Breadcrumb } from "@/components/cards";
import { getLab, labs } from "@/lib/data";

export function generateStaticParams() {
  return labs.map((l) => ({ slug: l.slug }));
}

export default async function LabPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lab = getLab(slug);
  if (!lab) notFound();

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <Nav />
        <div className="py-12">
          <Breadcrumb items={[{ label: "Labs", href: "/labs" }, { label: lab.title }]} />

          <header className="mb-10 rounded-3xl bg-white p-8 shadow-sm">
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium">{lab.duration}</span>
            <h1 className="mt-4 text-4xl font-bold">{lab.title}</h1>
            <p className="mt-4 text-lg text-zinc-600">
              <span className="font-semibold text-zinc-900">Objectif : </span>
              {lab.objective}
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Prérequis</h2>
              <ul className="mt-4 space-y-2">
                {lab.prerequisites.map((req) => (
                  <li key={req} className="flex items-start gap-2 text-zinc-600">
                    <span className="mt-1 text-zinc-400">✓</span>
                    {req}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Étapes</h2>
              <ol className="mt-4 space-y-3">
                {lab.steps.map((step, i) => (
                  <li key={step} className="flex gap-3 rounded-xl bg-[#f5f5f7] px-4 py-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <button className="rounded-full bg-black px-6 py-3 font-semibold text-white">Démarrer le lab</button>
            <Link href="/labs" className="rounded-full border border-zinc-300 bg-white px-6 py-3 font-semibold">
              ← Retour aux labs
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
