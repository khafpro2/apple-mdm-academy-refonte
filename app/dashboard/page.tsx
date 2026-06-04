import Link from "next/link";
import { PageShell } from "@/components/layout";
import { SectionHeading, ProgressBar } from "@/components/ui";
import { ProgressOverview } from "@/components/cards";
import { userProgress as mockProgress, badges as mockBadges, certificates as mockCertificates, leaderboard, tracks } from "@/lib/data";
import { getUser } from "@/lib/supabase/server";
import { fetchDashboardData } from "@/lib/supabase/queries";
import { badgeCatalog } from "@/lib/badges-config";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await getUser();
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Apprenant";

  const dbData = user ? await fetchDashboardData(user.id) : null;

  const globalPercent = dbData?.fromDatabase ? dbData.globalPercent : user ? 0 : mockProgress.globalPercent;
  const trackProgress = dbData?.fromDatabase ? dbData.tracks : user ? [] : mockProgress.tracks;
  const recentActivity = dbData?.fromDatabase ? dbData.recentActivity : user ? [] : mockProgress.recentActivity;
  const badges = dbData?.fromDatabase ? dbData.badges : user ? badgeCatalog : mockBadges;
  const certificates: {
    quizSlug?: string;
    name: string;
    score: string;
    date: string;
    status: "available" | "locked";
  }[] = dbData?.fromDatabase ? dbData.certificates : user ? [] : mockCertificates;

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Espace apprenant"
          title={`Bonjour, ${displayName}`}
          description={
            user
              ? dbData?.fromDatabase
                ? "Progression synchronisée avec Supabase."
                : "Connecté — exécutez supabase/schema.sql pour activer la sauvegarde."
              : "Connecte-toi pour synchroniser ta progression."
          }
        />

        {user && dbData?.fromDatabase && (
          <div className="mb-8 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            Connecté en tant que <strong>{user.email}</strong> · données en temps réel
          </div>
        )}

        {user && !dbData?.fromDatabase && (
          <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Supabase connecté mais tables absentes — exécutez <code className="rounded bg-amber-100 px-1">supabase/schema.sql</code> dans le SQL Editor.
          </div>
        )}

        {!user && (
          <div className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl border border-border-light bg-surface-elevated p-4">
            <p className="text-sm text-ink-secondary">
              Connectez-vous pour sauvegarder vos scores de quiz et débloquer des badges.
            </p>
            <Link href="/auth/login?redirect=/dashboard" className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white">
              Se connecter
            </Link>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <ProgressOverview
            percent={globalPercent}
            tracks={trackProgress.map((t) => ({ title: t.title, percent: t.percent }))}
          />

          <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
            <h2 className="text-lg font-bold text-ink">Parcours en cours</h2>
            {trackProgress.length === 0 ? (
              <p className="mt-4 text-sm text-ink-secondary">
                Aucune progression —{" "}
                <Link href="/quiz" className="font-semibold text-accent hover:underline">
                  passez un quiz
                </Link>{" "}
                pour commencer.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {trackProgress.map((track) => (
                  <div key={track.slug}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-ink">{track.title}</span>
                      <span className="text-ink-tertiary">{track.percent}%</span>
                    </div>
                    <ProgressBar value={track.percent} />
                  </div>
                ))}
              </div>
            )}
            <Link href="/parcours" className="mt-6 inline-block text-sm font-semibold text-accent hover:underline">
              Voir tous les parcours →
            </Link>
          </section>
        </div>

        <section className="mt-8 rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
          <h2 className="text-lg font-bold text-ink">Activité récente</h2>
          {recentActivity.length === 0 ? (
            <p className="mt-4 text-sm text-ink-secondary">Aucune activité pour le moment.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border-light">
              {recentActivity.map((activity) => (
                <li key={`${activity.label}-${activity.date}`} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-ink">{activity.label}</p>
                    <p className="text-xs text-ink-tertiary capitalize">{activity.type}</p>
                  </div>
                  <span className="text-sm text-ink-tertiary">{activity.date}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
            <h2 className="text-lg font-bold text-ink">Badges</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`rounded-2xl p-4 text-center ${badge.earned ? "bg-ink text-white" : "bg-surface text-ink-tertiary"}`}
                  title={badge.description}
                >
                  <span className="text-2xl" aria-hidden="true">{badge.icon}</span>
                  <p className="mt-2 text-xs font-semibold">{badge.name}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
            <h2 className="text-lg font-bold text-ink">Certificats</h2>
            <div className="mt-4 space-y-3">
              {certificates.length === 0 ? (
                <p className="text-sm text-ink-secondary">Réussissez un examen blanc pour obtenir un certificat.</p>
              ) : (
                certificates.map((cert) => (
                  <div
                    key={cert.quizSlug ?? cert.name}
                    className={`rounded-2xl p-4 ${cert.status === "locked" ? "bg-surface opacity-60" : "bg-surface"}`}
                  >
                    <p className="font-semibold text-ink">{cert.name}</p>
                    <div className="mt-1 flex justify-between text-sm text-ink-tertiary">
                      <span>{cert.score}</span>
                      <span>{cert.date}</span>
                    </div>
                    {cert.quizSlug && cert.status === "available" && (
                      <a
                        href={`/api/certificates/${cert.quizSlug}`}
                        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
                      >
                        Télécharger PDF ↓
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
            {dbData?.fromDatabase && certificates.length > 0 && (
              <p className="mt-4 text-xs text-ink-tertiary">Certificats générés automatiquement après réussite.</p>
            )}
          </section>

          <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
            <h2 className="text-lg font-bold text-ink">Classement</h2>
            <ol className="mt-4 space-y-2">
              {leaderboard.map((entry) => (
                <li
                  key={entry.rank}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
                    entry.highlight ? "bg-ink text-white" : "bg-surface"
                  }`}
                >
                  <span className="w-6 font-bold">{entry.rank}</span>
                  <span className="flex-1 font-medium">{entry.name}</span>
                  <span className="text-sm opacity-80">{entry.points} pts</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs text-ink-tertiary">Classement global — bientôt</p>
          </section>
        </div>

        <section className="mt-8 rounded-3xl bg-ink p-6 text-white">
          <h2 className="text-lg font-bold">Continuer à apprendre</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.slice(0, 3).map((track) => (
              <Link
                key={track.slug}
                href={`/cours/${track.slug}`}
                className="rounded-2xl bg-white/10 p-4 backdrop-blur transition hover:bg-white/20"
              >
                <p className="font-semibold">{track.title}</p>
                <p className="mt-1 text-sm text-zinc-400">
                  {track.lessons} leçons · {track.level}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
