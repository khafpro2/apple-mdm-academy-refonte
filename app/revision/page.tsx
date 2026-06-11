import { PageShell } from "@/components/layout";
import { SectionHeading } from "@/components/ui";
import { buildPageMetadata } from "@/lib/seo/metadata";
import Link from "next/link";

export const metadata = buildPageMetadata({
  title: "Mode Révision",
  description: "Révisez avec la répétition espacée (SM-2) — cartes dues, prédiction de score, maîtrise par domaine.",
  path: "/revision",
});

const QUIZ_TRACKS = [
  { slug: "jamf-100", title: "Jamf 100", icon: "🛠️", color: "from-blue-50 to-indigo-50" },
  { slug: "jamf-200", title: "Jamf 200", icon: "⚙️", color: "from-indigo-50 to-purple-50" },
  { slug: "examen-apple-it-pro", title: "Apple IT Pro", icon: "🍎", color: "from-gray-50 to-blue-50" },
  { slug: "intune-apple", title: "Intune Apple", icon: "🪟", color: "from-sky-50 to-blue-50" },
  { slug: "apple-security", title: "Sécurité Apple", icon: "🔒", color: "from-red-50 to-orange-50" },
];

export default function RevisionPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Révision intelligente"
          title="Mode Révision"
          description="La répétition espacée (algorithme SM-2) — révisez au bon moment, maximisez votre mémorisation."
        />

        {/* How it works */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { icon: "🧠", title: "Répétition espacée", desc: "SM-2 planifie vos révisions au moment optimal pour la mémorisation long terme." },
            { icon: "📈", title: "Prédiction de score", desc: "Estimez votre score d'examen basé sur votre maîtrise des questions." },
            { icon: "🎯", title: "Cartes dues", desc: "Révisez uniquement les cartes dues aujourd'hui — pas plus, pas moins." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-border-light bg-surface-elevated p-5">
              <span className="text-2xl" aria-hidden="true">{item.icon}</span>
              <p className="mt-2 font-semibold text-ink">{item.title}</p>
              <p className="mt-1 text-sm text-ink-secondary">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Quiz selection */}
        <h2 className="mt-12 text-lg font-bold text-ink">Choisir un examen à réviser</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUIZ_TRACKS.map((track) => (
            <Link
              key={track.slug}
              href={`/revision/${track.slug}`}
              className={`group rounded-3xl bg-gradient-to-br ${track.color} border border-border-light p-6 transition-all hover:-translate-y-1 hover:shadow-md`}
            >
              <span className="text-3xl" aria-hidden="true">{track.icon}</span>
              <h3 className="mt-3 font-bold text-ink group-hover:text-accent transition-colors">
                {track.title}
              </h3>
              <p className="mt-1 text-sm text-ink-secondary">Réviser les questions →</p>
            </Link>
          ))}
        </div>

        {/* Info SM-2 */}
        <div className="mt-12 rounded-2xl border border-border-light bg-surface p-6 text-sm text-ink-secondary">
          <p className="font-semibold text-ink">Comment fonctionne SM-2 ?</p>
          <p className="mt-2">
            Après chaque révision, vous notez votre réponse de 1 (raté) à 5 (parfait).
            L&apos;algorithme calcule le prochain intervalle de révision optimisé :
            1 jour → 6 jours → exponentiellement plus long selon votre maîtrise.
            Les cartes difficiles reviennent plus souvent.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
