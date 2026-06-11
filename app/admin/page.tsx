import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading, Badge } from "@/components/ui";
import { fetchAdminStats } from "@/lib/supabase/admin";
import { quizzes } from "@/lib/data/quizzes";
import { tracks } from "@/lib/data/tracks";
import { AdvancedAdminPanel } from "@/components/admin/advanced-admin-panel";
import { AltMdmAdminPanel } from "@/components/admin/alt-mdm-admin-panel";
import { runCertificationAudit } from "@/lib/audit/certification-audit";

export const dynamic = "force-dynamic";

export const metadata = { title: "Administration" };

function getQuizTitle(slug: string) {
  return quizzes.find((q) => q.slug === slug)?.title ?? slug;
}

function getTrackTitle(slug: string) {
  return tracks.find((t) => t.slug === slug)?.title ?? slug;
}

export default async function AdminPage() {
  const stats = await fetchAdminStats();
  const certAudit = runCertificationAudit();

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
            href="/admin/content"
            className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink"
          >
            Gestion contenu
          </Link>
          <Link
            href="/admin/video-production"
            className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink"
          >
            Production vidéo
          </Link>
          <Link
            href="/admin/video-production-checklist"
            className="rounded-full border border-amber-300 bg-amber-50 px-5 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100"
          >
            Checklist médias vidéo
          </Link>
          <Link
            href="/admin/media-readiness"
            className="rounded-full border border-amber-200 bg-amber-50 px-5 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100"
          >
            Préparation médias
          </Link>
          <Link
            href="/admin/media-production-plan"
            className="rounded-full border border-amber-300 bg-amber-50 px-5 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100"
          >
            Plan médias
          </Link>
          <Link
            href="/admin/video-pipeline"
            className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink"
          >
            Pipeline vidéo
          </Link>
          <Link
            href="/admin/video-library"
            className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink"
          >
            Bibliothèque vidéo
          </Link>
          <Link
            href="/admin/runtime-env-check"
            className="rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-semibold text-blue-900 hover:bg-blue-100"
          >
            Runtime env check
          </Link>
          <Link
            href="/admin/supabase-diagnostics"
            className="rounded-full border border-red-200 bg-red-50 px-5 py-2 text-sm font-semibold text-red-900 hover:bg-red-100"
          >
            Diagnostics Supabase
          </Link>
          <Link
            href="/admin/production-checklist"
            className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink"
          >
            Checklist production
          </Link>
          <Link
            href="/admin/final-audit"
            className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink"
          >
            Audit final
          </Link>
          <Link
            href="/admin/quiz-quality"
            className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink"
          >
            Audit QCM
          </Link>
          <Link
            href="/admin/exam-audit"
            className="rounded-full border border-purple-200 bg-purple-50 px-5 py-2 text-sm font-semibold text-purple-900 hover:bg-purple-100"
          >
            Audit examens
          </Link>
          <Link
            href="/admin/certification-audit"
            className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink"
          >
            Audit certification
          </Link>
          <Link
            href="/admin/lms-audit"
            className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink"
          >
            Audit LMS
          </Link>
          <Link
            href="/admin/brand-assets"
            className="rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-semibold text-blue-900 hover:bg-blue-100"
          >
            Audit marques & logos
          </Link>
          <Link
            href="/admin/jamf-content-status"
            className="rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-100"
          >
            Statut Jamf Premium
          </Link>
          <Link
            href="/admin/content-gap-analysis"
            className="rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-100"
          >
            Analyse écarts Jamf Training
          </Link>
          <Link
            href="/admin/content-audit"
            className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink"
          >
            Audit pédagogique
          </Link>
          <Link
            href="/admin/pedagogical-report"
            className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink"
          >
            Rapport pédagogique
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink"
          >
            ← Dashboard apprenant
          </Link>
        </div>

        <div className="mt-8 rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
          <h2 className="text-lg font-bold text-ink">Certification — couverture programmes</h2>
          <p className="mt-1 text-sm text-ink-tertiary">
            Couverture globale {certAudit.globalCoverage} % · ACITP {certAudit.acitpModulesCovered}/
            {certAudit.acitpModulesTotal} modules · Examen {certAudit.examQuestionCount} questions
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {certAudit.programs.map((p) => (
              <div key={p.slug} className="rounded-2xl border border-border-light p-4 text-sm">
                <p className="font-semibold text-ink">{p.program}</p>
                <p className="text-accent">{p.coveragePercent} %</p>
              </div>
            ))}
          </div>
          <Link href="/admin/certification-audit" className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
            Audit certification détaillé →
          </Link>
        </div>

        {!stats && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
            Impossible de charger les stats — vérifiez Supabase et exécutez{" "}
            <code className="rounded bg-amber-100 px-1">supabase/schema-admin.sql</code>.
          </div>
        )}

        {stats && (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Apprenants", value: stats.totalUsers },
                { label: "Tentatives quiz", value: stats.totalQuizAttempts },
                { label: "Labs terminés", value: stats.totalLabsCompleted },
                { label: "Cours terminés", value: stats.totalCoursesCompleted },
                { label: "Badges obtenus", value: stats.totalBadgesEarned },
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
              <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
                <h2 className="text-lg font-bold text-ink">Labs populaires</h2>
                {stats.popularLabs.length === 0 ? (
                  <p className="mt-4 text-sm text-ink-secondary">Aucun lab terminé.</p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {stats.popularLabs.map((m) => (
                      <li key={m.lesson_slug} className="flex justify-between text-sm">
                        <span className="font-medium text-ink">{m.lesson_slug}</span>
                        <span className="text-ink-tertiary">{m.completions} complétion{m.completions > 1 ? "s" : ""}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            <section className="mt-10 rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
              <h2 className="text-lg font-bold text-ink">Statistiques examens blancs</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-light text-left text-ink-tertiary">
                      <th className="py-2 pr-4">Examen</th>
                      <th className="py-2 pr-4">Tentatives</th>
                      <th className="py-2 pr-4">Taux réussite</th>
                      <th className="py-2">Score moyen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.examStats.map((e) => (
                      <tr key={e.quizSlug} className="border-b border-border-light">
                        <td className="py-3 pr-4 font-medium text-ink">{getQuizTitle(e.quizSlug)}</td>
                        <td className="py-3 pr-4 text-ink-secondary">{e.attempts}</td>
                        <td className="py-3 pr-4 text-ink-secondary">{e.passRate}%</td>
                        <td className="py-3 text-ink-secondary">{e.avgScore}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        <AdvancedAdminPanel
          stats={stats?.advancedTrackStats}
          fromDatabase={Boolean(stats)}
        />

        <AltMdmAdminPanel
          stats={stats?.altMdmTrackStats}
          fromDatabase={Boolean(stats)}
        />

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
