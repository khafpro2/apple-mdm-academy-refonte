import Link from "next/link";
import { Nav, Footer } from "@/components/nav";
import { PageHeader, ProgressCard } from "@/components/cards";
import { progressData, tracks } from "@/lib/data";

const badges = [
  { name: "Premier lab", icon: "🧪", earned: true },
  { name: "Jamf 100", icon: "🏆", earned: true },
  { name: "Streak 7 jours", icon: "🔥", earned: false },
  { name: "Apple Pro", icon: "🍏", earned: false },
];

const certificates = [
  { name: "Jamf 100 — Examen blanc", score: "92%", date: "12 mai 2026" },
  { name: "Apple Device Support — Partiel", score: "78%", date: "3 mai 2026" },
];

const leaderboard = [
  { rank: 1, name: "Marie L.", points: 2840 },
  { rank: 2, name: "Thomas K.", points: 2650 },
  { rank: 3, name: "Toi", points: 1920, highlight: true },
  { rank: 4, name: "Sophie R.", points: 1780 },
  { rank: 5, name: "Alex M.", points: 1540 },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] text-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <Nav />
        <div className="py-12">
          <PageHeader
            label="Espace apprenant"
            title="Dashboard"
            description="Suis ta progression, débloque des badges et télécharge tes certificats."
          />

          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            <ProgressCard />

            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Parcours en cours</h2>
              <div className="mt-4 space-y-4">
                {progressData.map((item) => (
                  <div key={item.name}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span className="text-zinc-500">{item.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-zinc-100">
                      <div className="h-2 rounded-full bg-black" style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/parcours" className="mt-6 inline-block text-sm font-semibold text-zinc-600 hover:text-zinc-900">
                Voir tous les parcours →
              </Link>
            </section>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Badges</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {badges.map((badge) => (
                  <div
                    key={badge.name}
                    className={`rounded-2xl p-4 text-center ${badge.earned ? "bg-zinc-950 text-white" : "bg-zinc-100 text-zinc-400"}`}
                  >
                    <span className="text-2xl">{badge.icon}</span>
                    <p className="mt-2 text-xs font-semibold">{badge.name}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Certificats</h2>
              <div className="mt-4 space-y-3">
                {certificates.map((cert) => (
                  <div key={cert.name} className="rounded-2xl bg-[#f5f5f7] p-4">
                    <p className="font-semibold">{cert.name}</p>
                    <div className="mt-1 flex justify-between text-sm text-zinc-500">
                      <span>{cert.score}</span>
                      <span>{cert.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-zinc-400">Export PDF — bientôt via Supabase</p>
            </section>

            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Classement</h2>
              <ol className="mt-4 space-y-2">
                {leaderboard.map((entry) => (
                  <li
                    key={entry.rank}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 ${entry.highlight ? "bg-black text-white" : "bg-[#f5f5f7]"}`}
                  >
                    <span className="w-6 font-bold">{entry.rank}</span>
                    <span className="flex-1">{entry.name}</span>
                    <span className="text-sm">{entry.points} pts</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <section className="mt-8 rounded-3xl bg-zinc-950 p-6 text-white">
            <h2 className="text-xl font-bold">Prochaines leçons recommandées</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tracks.slice(0, 3).map((track) => (
                <Link
                  key={track.slug}
                  href={`/parcours/${track.slug}`}
                  className="rounded-2xl bg-white/10 p-4 backdrop-blur transition hover:bg-white/20"
                >
                  <p className="font-semibold">{track.title}</p>
                  <p className="mt-1 text-sm text-zinc-400">{track.lessons} leçons · {track.level}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
