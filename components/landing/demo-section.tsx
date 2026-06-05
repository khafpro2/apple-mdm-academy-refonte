import { SectionHeading } from "@/components/ui";

const FEATURES = [
  { icon: "📊", title: "Dashboard progression", desc: "Suivi par parcours, modules et examens en temps réel." },
  { icon: "🎬", title: "Vidéos & cours", desc: "Contenu structuré avec captures officielles Apple, Jamf et Intune." },
  { icon: "🧪", title: "Labs guidés", desc: "Exercices pas à pas dans un environnement simulé." },
  { icon: "🎯", title: "Examens blancs", desc: "Simulations proches des certifications Pearson VUE et Jamf." },
  { icon: "🏅", title: "Certificats PDF", desc: "Attestations téléchargeables après réussite." },
  { icon: "🏢", title: "Mode entreprise", desc: "Reporting équipes, export CSV/PDF et centre de formation." },
];

export function DemoSection() {
  return (
    <section id="demo" className="border-y border-border-light bg-surface-elevated py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          label="Plateforme"
          title="Une expérience SaaS premium"
          description="Inspirée des meilleures interfaces Apple, Notion, Linear et Stripe — conçue pour convertir et retenir."
          align="center"
        />
        <div className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-3xl border border-border-light bg-ink p-1 shadow-2xl">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-yellow-400" />
            <span className="h-3 w-3 rounded-full bg-green-400" />
            <span className="ml-4 text-xs text-zinc-400">app.apple-mdm-academy.com/dashboard</span>
          </div>
          <div className="grid gap-px bg-white/5 sm:grid-cols-3">
            {FEATURES.slice(0, 3).map((f) => (
              <div key={f.title} className="bg-ink p-6">
                <span className="text-2xl">{f.icon}</span>
                <h3 className="mt-3 font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border-light bg-surface p-6">
              <span className="text-2xl">{f.icon}</span>
              <h3 className="mt-3 font-bold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-secondary">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
