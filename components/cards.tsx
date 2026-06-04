import Link from "next/link";
import type { Track } from "@/lib/data";

export function TrackCard({ track }: { track: Track }) {
  return (
    <article className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium">{track.level}</span>
        <span className="text-sm text-zinc-500">{track.lessons} leçons</span>
      </div>
      <h3 className="text-2xl font-bold">{track.title}</h3>
      <p className="mt-3 text-zinc-600">{track.desc}</p>
      <Link
        href={`/parcours/${track.slug}`}
        className="mt-6 inline-block rounded-full bg-zinc-950 px-5 py-2 text-sm font-semibold text-white"
      >
        Ouvrir le parcours
      </Link>
    </article>
  );
}

export function LabCard({ slug, title, index }: { slug: string; title: string; index: number }) {
  return (
    <Link href={`/labs/${slug}`} className="block rounded-2xl bg-[#f5f5f7] p-5 transition hover:bg-zinc-200">
      <p className="text-sm font-semibold text-zinc-500">Lab {index + 1}</p>
      <h3 className="mt-2 text-xl font-bold">{title}</h3>
      <p className="mt-2 text-zinc-600">Objectif, prérequis, étapes guidées et validation finale.</p>
    </Link>
  );
}

export function ExamCard({ slug, title }: { slug: string; title: string }) {
  return (
    <Link href={`/examens/${slug}`} className="block rounded-3xl bg-black p-6 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-3 text-sm text-zinc-300">100 questions, score immédiat, corrections détaillées.</p>
    </Link>
  );
}

export function ProgressCard() {
  const items = [
    ["Jamf 100", "100%"],
    ["Apple Device Support", "82%"],
    ["Apple IT Professional", "64%"],
    ["Jamf 200", "38%"],
  ] as const;

  return (
    <div className="rounded-[2rem] bg-black p-6 text-white shadow-2xl">
      <div className="rounded-[1.5rem] bg-zinc-900 p-6">
        <p className="text-sm text-zinc-400">Progression globale</p>
        <div className="mt-3 text-5xl font-bold">78%</div>
        {items.map(([name, value]) => (
          <div key={name} className="mt-6">
            <div className="mb-2 flex justify-between text-sm">
              <span>{name}</span>
              <span>{value}</span>
            </div>
            <div className="h-2 rounded-full bg-zinc-700">
              <div className="h-2 rounded-full bg-white" style={{ width: value }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageHeader({ label, title, description }: { label?: string; title: string; description?: string }) {
  return (
    <header className="mb-10">
      {label && <p className="font-semibold text-zinc-500">{label}</p>}
      <h1 className="mt-1 text-4xl font-bold md:text-5xl">{title}</h1>
      {description && <p className="mt-4 max-w-2xl text-lg text-zinc-600">{description}</p>}
    </header>
  );
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-2">
          {i > 0 && <span>/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-zinc-900">
              {item.label}
            </Link>
          ) : (
            <span className="text-zinc-900">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
