import Link from "next/link";
import { Nav, Footer } from "@/components/nav";
import { TrackCard, LabCard, ExamCard, ProgressCard } from "@/components/cards";
import { tracks, labs, exams } from "@/lib/data";

export function HomePage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] text-zinc-950">
      <section className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-8 lg:px-8">
        <Nav />

        <header className="grid items-center gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm">
              Formation Apple, Jamf & Intune en français
            </p>
            <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
              Deviens expert Apple MDM, Jamf Pro et Intune.
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-zinc-600">
              Une plateforme moderne pour préparer Apple Device Support, Apple IT Professional, Jamf 100/200 et la
              gestion Apple en entreprise avec cours, labs, quiz et certificats.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/parcours" className="rounded-full bg-black px-6 py-3 font-semibold text-white">
                Voir les parcours
              </Link>
              <Link href="/examens" className="rounded-full border border-zinc-300 bg-white px-6 py-3 font-semibold">
                Passer un examen blanc
              </Link>
            </div>
          </div>
          <ProgressCard />
        </header>
      </section>

      <section id="parcours" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-semibold text-zinc-500">Parcours certifiants</p>
            <h2 className="text-4xl font-bold">Choisis ton objectif</h2>
          </div>
          <p className="max-w-xl text-zinc-600">
            Chaque parcours contient des cours, quiz, labs pratiques, fiches de révision et examen blanc.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track) => (
            <TrackCard key={track.slug} track={track} />
          ))}
        </div>
      </section>

      <section id="labs" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-4xl font-bold">Labs pratiques</h2>
            <Link href="/labs" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900">
              Voir tous →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {labs.map((lab, index) => (
              <LabCard key={lab.slug} slug={lab.slug} title={lab.title} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section id="examens" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-4xl font-bold">Examens blancs</h2>
          <Link href="/examens" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900">
            Voir tous →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {exams.map((exam) => (
            <ExamCard key={exam.slug} slug={exam.slug} title={exam.title} />
          ))}
        </div>
      </section>

      <section id="dashboard" className="bg-zinc-950 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-1">
            <p className="font-semibold text-zinc-400">Espace apprenant</p>
            <h2 className="mt-2 text-4xl font-bold">Dashboard premium</h2>
            <p className="mt-4 text-zinc-300">Suivi de progression, badges, certificats PDF et historique des examens.</p>
            <Link href="/dashboard" className="mt-6 inline-block rounded-full bg-white px-6 py-3 font-semibold text-zinc-950">
              Accéder au dashboard
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3 lg:col-span-2">
            {["Badges", "Certificats", "Classement"].map((item) => (
              <div key={item} className="rounded-3xl bg-white/10 p-6 backdrop-blur">
                <p className="text-3xl font-bold">{item}</p>
                <p className="mt-3 text-sm text-zinc-300">Connecté à Supabase — bientôt disponible.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
