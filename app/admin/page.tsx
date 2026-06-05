import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading, Badge } from "@/components/ui";
import { fetchAdminStats } from "@/lib/supabase/admin";
import { quizzes } from "@/lib/data/quizzes";
import { tracks } from "@/lib/data/tracks";

export const metadata = { title: "Administration" };

function getQuizTitle(slug: string) {
  return quizzes.find((q) => q.slug === slug)?.title ?? slug;
}

function getTrackTitle(slug: string) {
  return tracks.find((t) => t.slug === slug)?.title ?? slug;
}

export default async function AdminPage() {
  const stats = await fetchAdminStats();

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            label="Administration"
            title="Tableau de bord admin"
            description="Vue d'ensemble des apprenants, quiz et progression."
          />
          <Link
            href="/dashboard"
            className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink"
          >
            ← Dashboard apprenant
          </Link>
        </div>

        {!stats ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
            Impossible de charger les stats — vérifiez Supabase et exécutez{" "}
            <code className="rounded bg-amber-100 px-1">supabase/schema-admin.sql</code>.
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Apprenants", value: stats.totalUsers },
                { label: "Tentatives quiz", value: stats.totalQuizAttempts },
                { label: "Taux de réussite", value: `${stats.passRate}%` },
                { label: "Temps moyen examen", value: `${stats.avgDurationMinutes} min` },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm"
                >
                  <p className="text-sm text-ink-tertiary">{stat.label}</p>
                  <p className="mt-2 text-4xl font-bold text-ink">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
                <h2 className="text-lg font-bold text-ink">Résultats récents</h2>
                {stats.recentResults.length === 0 ? (
                  <p className="mt-4 text-sm text-ink-secondary">Aucun résultat pour le moment.</p>
                ) : (
                  <ul className="mt-4 divide-y divide-border-light">
                    {stats.recentResults.map((r) => (
                      <li key={r.id} className="flex items-center justify-between gap-4 py-3">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-ink">
                            {r.profile_name ?? "Utilisateur"}
                          </p>
                          <p className="truncate text-sm text-ink-secondary">
                            {getQuizTitle(r.quiz_slug)}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <Badge variant={r.passed ? "accent" : "default"}>{r.score}%</Badge>
                          <p className="mt-1 text-xs text-ink-tertiary">
                            {new Date(r.completed_at).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
                <h2 className="text-lg font-bold text-ink">Progression par parcours</h2>
                {stats.trackStats.length === 0 ? (
                  <p className="mt-4 text-sm text-ink-secondary">Aucune progression enregistrée.</p>
                ) : (
                  <ul className="mt-4 space-y-4">
                    {stats.trackStats.map((t) => (
                      <li key={t.track_slug}>
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="font-medium text-ink">{getTrackTitle(t.track_slug)}</span>
                          <span className="text-ink-tertiary">
                            {t.avg_percent}% · {t.learners} apprenant{t.learners > 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-border-light">
                          <div
                            className="h-2 rounded-full bg-accent"
                            style={{ width: `${t.avg_percent}%` }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
                <h2 className="text-lg font-bold text-ink">Modules populaires</h2>
                {stats.popularModules.length === 0 ? (
                  <p className="mt-4 text-sm text-ink-secondary">Aucune complétion enregistrée.</p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {stats.popularModules.map((m) => (
                      <li key={m.lesson_slug} className="flex justify-between text-sm">
                        <span className="font-medium text-ink">{m.lesson_slug}</span>
                        <span className="text-ink-tertiary">{m.completions} complétion{m.completions > 1 ? "s" : ""}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </>
        )}

        <div className="mt-10 rounded-2xl border border-border-light bg-surface p-5 text-sm text-ink-secondary">
          <p className="font-semibold text-ink">Accès admin</p>
          <p className="mt-2">
            Définissez <code className="rounded bg-white px-1">ADMIN_EMAILS</code> dans Vercel ou{" "}
            <code className="rounded bg-white px-1">UPDATE profiles SET is_admin = true WHERE …</code>{" "}
            dans Supabase.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
