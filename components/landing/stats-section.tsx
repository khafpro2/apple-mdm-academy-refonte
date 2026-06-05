import { SectionHeading } from "@/components/ui";

const STATS = [
  { value: "2 400+", label: "Apprenants actifs" },
  { value: "93%", label: "Taux de réussite examens" },
  { value: "5", label: "Parcours certifiants" },
  { value: "40+", label: "Labs pratiques" },
  { value: "120+", label: "Heures de contenu" },
  { value: "4.9/5", label: "Satisfaction moyenne" },
];

export function StatsSection() {
  return (
    <section className="border-y border-border-light py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading label="Impact" title="Des résultats mesurables" align="center" />
        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold tracking-tight text-ink md:text-4xl">{s.value}</p>
              <p className="mt-2 text-sm text-ink-secondary">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
