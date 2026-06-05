import { notFound } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/layout";
import { Breadcrumb, Badge } from "@/components/ui";
import { LabWorkspace } from "@/components/labs/lab-workspace";
import { getLab, labs } from "@/lib/labs";
import { getUser } from "@/lib/supabase/server";
import { TECHNOLOGY_STYLES } from "@/lib/labs/badges";

export function generateStaticParams() {
  return labs.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lab = getLab(slug);
  return { title: lab?.title ?? "Lab" };
}

export default async function LabDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lab = getLab(slug);
  if (!lab) notFound();

  const user = await getUser();

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
        <Breadcrumb items={[{ label: "Labs", href: "/labs" }, { label: lab.title }]} />

        <header className="rounded-3xl border border-border-light bg-surface-elevated p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${TECHNOLOGY_STYLES[lab.technology]}`}>
              {lab.technology}
            </span>
            <Badge>{lab.level}</Badge>
            <span className="text-sm text-ink-tertiary">{lab.duration}</span>
            <Link
              href={`/parcours/${lab.trackSlug}`}
              className="text-sm font-medium text-accent hover:underline"
            >
              Parcours associé →
            </Link>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink md:text-4xl">{lab.title}</h1>
          <p className="mt-4 text-lg text-ink-secondary">{lab.description}</p>

          <div className="mt-6">
            <p className="text-sm font-semibold text-ink">Objectifs</p>
            <ul className="mt-2 space-y-1">
              {lab.objectives.map((obj) => (
                <li key={obj} className="flex gap-2 text-sm text-ink-secondary">
                  <span className="text-accent">✓</span> {obj}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-2xl border border-border-light bg-surface p-5">
            <p className="text-sm font-semibold text-ink">Prérequis</p>
            <ul className="mt-2 grid gap-1 sm:grid-cols-2">
              {lab.prerequisites.map((req) => (
                <li key={req} className="text-sm text-ink-secondary">· {req}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50/50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-800">Résultat final attendu</p>
            <p className="mt-2 text-sm leading-relaxed text-green-900">{lab.expectedResult}</p>
          </div>
        </header>

        <div className="mt-10">
          <LabWorkspace lab={lab} isAuthenticated={!!user} />
        </div>div>
      </div>div></PageShell>
  );
}
