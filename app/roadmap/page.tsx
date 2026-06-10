import Link from "next/link";
import { PageShell } from "@/components/layout";
import { SectionHeading, Badge } from "@/components/ui";
import { currentVersion, roadmapVersions } from "@/lib/data/roadmap-v2";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Roadmap V2",
  description:
    "Feuille de route Apple MDM Academy V2 — Vidéos HeyGen, espace membre, paiement Stripe, certificats PDF, suivi progression avancé, Jamf 300/400 et plus.",
  path: "/roadmap",
});

const statusStyles: Record<string, "accent" | "dark" | "default"> = {
  done: "accent",
  in_progress: "dark",
  planned: "default",
};

const statusLabels: Record<string, string> = {
  done: "✅ Terminé",
  in_progress: "🔄 En cours",
  planned: "📋 Prévu",
};

// 5 éléments V2 prioritaires mis en avant
const V2_PRIORITY_TITLES = [
  "Vidéos HeyGen",
  "Espace membre & Profil avancé",
  "Paiement Stripe",
  "Suivi de progression avancé",
];

export default function RoadmapPage() {
  const v2 = roadmapVersions.find((v) => v.version === "2.0");
  const priorityItems = v2?.items.filter((i) => V2_PRIORITY_TITLES.includes(i.title)) ?? [];

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Roadmap"
          title="Ce qui arrive dans la V2"
          description="Les grandes évolutions prévues pour Apple MDM Academy — de la vidéo à l'espace membre en passant par Stripe."
        />

        {/* ── 5 features prioritaires ───────────────────────────────────── */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {priorityItems.map((item) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {item.tag && (
                <span className="absolute right-4 top-4 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                  {item.tag}
                </span>
              )}
              <div className="flex items-start gap-4">
                {item.icon && (
                  <span className="shrink-0 text-3xl" aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                <div>
                  <h3 className="font-bold text-ink">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-secondary">
                    {item.description}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <Badge variant={statusStyles[item.status] ?? "default"}>
                      {statusLabels[item.status]}
                    </Badge>
                    {item.quarter && (
                      <span className="text-xs font-medium text-ink-tertiary">
                        {item.quarter}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Toutes les versions ───────────────────────────────────────── */}
        {roadmapVersions.map((version) => (
          <section key={version.version} className="mt-14">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-ink">{version.label}</h2>
              {version.version === currentVersion && (
                <Badge variant="accent">En prod</Badge>
              )}
            </div>

            <div className="mt-5 divide-y divide-border-light overflow-hidden rounded-2xl border border-border-light bg-surface-elevated shadow-sm">
              {version.items.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-surface"
                >
                  {item.icon && (
                    <span className="mt-0.5 text-xl" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-ink">{item.title}</p>
                      {item.tag && (
                        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm leading-relaxed text-ink-secondary">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <Badge variant={statusStyles[item.status] ?? "default"}>
                      {statusLabels[item.status]}
                    </Badge>
                    {item.quarter && (
                      <span className="text-xs text-ink-tertiary">{item.quarter}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <div className="mt-14 rounded-3xl border border-accent/20 bg-accent/5 px-8 py-8 text-center">
          <h3 className="text-lg font-bold text-ink">
            Une suggestion pour la V2 ?
          </h3>
          <p className="mt-2 text-ink-secondary">
            Votez pour les fonctionnalités, signalez un bug ou proposez une idée.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Nous contacter
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-full border border-border-light bg-surface-elevated px-6 py-3 text-sm font-semibold text-ink-secondary transition hover:text-ink"
            >
              Voir les plans
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
