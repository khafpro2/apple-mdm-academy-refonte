import { PageShell } from "@/components/layout";
import { ButtonLink, SectionHeading } from "@/components/ui";
import { TrackCard, ProgressOverview } from "@/components/cards";
import { tracks, labs, quizzes } from "@/lib/data";
import Link from "next/link";

export default function HomePage() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full border border-border-light bg-surface-elevated px-4 py-2 text-sm font-medium text-ink-secondary shadow-sm">
              Formation Apple, Jamf & Intune en français
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-ink md:text-6xl lg:text-7xl">
              Deviens expert Apple MDM.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-secondary md:text-xl">
              Prépare tes certifications Apple Device Support, Apple IT Professional, Jamf 100/170/200 et Intune
              avec cours structurés, labs pratiques et examens blancs.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/parcours" size="lg">
                Voir les parcours
              </ButtonLink>
              <ButtonLink href="/quiz" variant="secondary" size="lg">
                Passer un quiz
              </ButtonLink>
            </div>
          </div>
          <ProgressOverview
            percent={78}
            tracks={[
              { title: "Jamf 100", percent: 100 },
              { title: "Apple Device Support", percent: 82 },
              { title: "Apple IT Professional", percent: 64 },
              { title: "Jamf 200", percent: 38 },
            ]}
          />
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border-light bg-surface-elevated py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "📚", title: "Cours structurés", desc: "Modules progressifs par certification" },
              { icon: "🧪", title: "Labs pratiques", desc: "Exercices guidés pas à pas" },
              { icon: "🎯", title: "Quiz & examens", desc: "Score automatique et corrections" },
              { icon: "🏆", title: "Badges & certificats", desc: "Progression et réussites" },
            ].map((f) => (
              <div key={f.title} className="text-center">
                <span className="text-3xl" aria-hidden="true">{f.icon}</span>
                <h3 className="mt-3 font-bold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm text-ink-secondary">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parcours preview */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionHeading
            label="Parcours certifiants"
            title="7 parcours professionnels"
            description="Chaque parcours contient cours, quiz, labs et examen blanc."
          />
          <Link href="/parcours" className="shrink-0 text-sm font-semibold text-accent hover:underline">
            Tous les parcours →
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tracks.map((track) => (
            <TrackCard key={track.slug} track={track} />
          ))}
        </div>
      </section>

      {/* Labs preview */}
      <section className="bg-surface-elevated py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <SectionHeading label="Pratique" title="Labs pratiques" />
            <Link href="/labs" className="text-sm font-semibold text-accent hover:underline">
              Voir tous →
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {labs.slice(0, 4).map((lab, i) => (
              <Link
                key={lab.slug}
                href={`/labs/${lab.slug}?start=1#session`}
                className="group rounded-2xl border border-border-light bg-surface p-5 transition hover:border-accent/30 hover:shadow-md"
              >
                <p className="text-xs font-semibold text-accent">Lab {i + 1}</p>
                <h3 className="mt-2 font-bold text-ink group-hover:text-accent">{lab.title}</h3>
                <p className="mt-1 text-xs text-ink-tertiary">{lab.duration}</p>
                <p className="mt-3 text-xs font-semibold text-accent">Accéder au Lab →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz preview */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <SectionHeading
          label="Évaluation"
          title="Quiz & examens blancs"
          description="Teste tes connaissances avec score automatique et corrections détaillées."
          align="center"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.slice(0, 3).map((q) => (
            <Link
              key={q.slug}
              href={`/quiz/${q.slug}`}
              className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="text-xs font-semibold uppercase text-accent">{q.type}</span>
              <h3 className="mt-2 text-lg font-bold text-ink">{q.title}</h3>
              <p className="mt-2 text-sm text-ink-secondary">{q.questions.length} questions · {q.duration}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink py-16 text-white lg:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold md:text-4xl">Prêt à commencer ?</h2>
          <p className="mt-4 text-lg text-zinc-300">
            Accède gratuitement aux bases ou passe au plan Pro pour débloquer tous les parcours.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/parcours" size="lg" className="bg-white text-ink hover:bg-zinc-100">
              Commencer gratuitement
            </ButtonLink>
            <ButtonLink href="/tarifs" variant="secondary" size="lg" className="border-zinc-600 text-white hover:bg-white/10">
              Voir les tarifs
            </ButtonLink>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
