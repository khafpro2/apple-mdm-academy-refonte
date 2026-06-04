import { notFound } from "next/navigation";
import Link from "next/link";
import { Nav, Footer } from "@/components/nav";
import { Breadcrumb } from "@/components/cards";
import { getTrack, tracks } from "@/lib/data";

export function generateStaticParams() {
  return tracks.map((t) => ({ slug: t.slug }));
}

export default async function TrackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const track = getTrack(slug);
  if (!track) notFound();

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <Nav />
        <div className="py-12">
          <Breadcrumb items={[{ label: "Parcours", href: "/parcours" }, { label: track.title }]} />

          <header className="mb-10 rounded-3xl bg-white p-8 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium">{track.level}</span>
              <span className="text-sm text-zinc-500">{track.lessons} leçons</span>
            </div>
            <h1 className="mt-4 text-4xl font-bold">{track.title}</h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-600">{track.desc}</p>
            <button className="mt-6 rounded-full bg-black px-6 py-3 font-semibold text-white">
              Commencer le parcours
            </button>
          </header>

          <div className="space-y-6">
            {track.modules.map((mod, i) => (
              <section key={mod.title} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold">
                  Module {i + 1} — {mod.title}
                </h2>
                <ul className="mt-4 space-y-2">
                  {mod.lessons.map((lesson, j) => (
                    <li key={lesson} className="flex items-center gap-3 rounded-xl bg-[#f5f5f7] px-4 py-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold">
                        {j + 1}
                      </span>
                      <span>{lesson}</span>
                      <span className="ml-auto text-xs text-zinc-400">Bientôt</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/labs" className="rounded-full border border-zinc-300 bg-white px-6 py-3 font-semibold">
              Labs associés
            </Link>
            <Link href="/examens" className="rounded-full bg-black px-6 py-3 font-semibold text-white">
              Examen blanc
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
