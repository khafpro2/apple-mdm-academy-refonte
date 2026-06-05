import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { PageShell } from "@/components/layout";
import { Breadcrumb, Badge, ButtonLink } from "@/components/ui";
import { LabDetailClient } from "@/components/labs/lab-detail-client";
import { LabStartButton } from "@/components/labs/lab-start-button";
import { getLab, labs } from "@/lib/data";
import { getUser } from "@/lib/supabase/server";

export function generateStaticParams() {
  return labs.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lab = getLab(slug);
  return { title: lab?.title ?? "Lab" };
}

export default async function LabDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ start?: string }>;
}) {
  const { slug } = await params;
  const { start } = await searchParams;
  const lab = getLab(slug);
  if (!lab) notFound();

  const user = await getUser();
  const autoStart = start === "1";

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
        <Breadcrumb items={[{ label: "Labs", href: "/labs" }, { label: lab.title }]} />

        <header className="rounded-3xl border border-border-light bg-surface-elevated p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="accent">{lab.difficulty}</Badge>
            <span className="text-sm text-ink-tertiary">{lab.duration}</span>
            <Link
              href={`/parcours/${lab.trackSlug}`}
              className="text-sm font-medium text-accent hover:underline"
            >
              Parcours associé →
            </Link>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-ink">{lab.title}</h1>
          <p className="mt-4 text-lg text-ink-secondary">
            <span className="font-semibold text-ink">Objectif : </span>
            {lab.objective}
          </p>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
            <h2 className="text-lg font-bold text-ink">Prérequis</h2>
            <ul className="mt-4 space-y-2">
              {lab.prerequisites.map((req) => (
                <li key={req} className="flex items-start gap-2 text-sm text-ink-secondary">
                  <span className="text-accent">✓</span> {req}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
            <h2 className="text-lg font-bold text-ink">Étapes</h2>
            <ol className="mt-4 space-y-3">
              {lab.steps.map((step, i) => (
                <li key={step} className="flex gap-3 rounded-xl bg-surface px-4 py-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-sm text-ink-secondary">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <LabStartButton slug={lab.slug} />
          <ButtonLink href={`/labs/${lab.slug}?start=1#session`} variant="secondary">
            Accéder au Lab
          </ButtonLink>
          <Link
            href="/labs"
            className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-ink hover:bg-surface"
          >
            ← Retour aux labs
          </Link>
        </div>

        <div className="mt-10">
          <Suspense fallback={null}>
            <LabDetailClient lab={lab} isAuthenticated={!!user} autoStart={autoStart} />
          </Suspense>
        </div>
      </div>
    </PageShell>
  );
}
