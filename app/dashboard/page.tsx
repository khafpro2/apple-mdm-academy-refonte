import Link from "next/link";
import { PageShell } from "@/components/layout";
import { SectionHeading, ProgressBar } from "@/components/ui";
import { ProgressOverview } from "@/components/cards";
import { LearnerStatsGrid } from "@/components/dashboard/learner-stats";
import { LeaderboardPanel } from "@/components/dashboard/leaderboard-panel";
import { ContinueLearningPanel } from "@/components/dashboard/continue-learning-panel";
import { SubscriptionStatusBanner } from "@/components/dashboard/subscription-status-banner";
import { DemoAccountBanner } from "@/components/dashboard/demo-account-banner";
import { ResourcesPanel } from "@/components/dashboard/resources-panel";
import { LabsProgressPanel } from "@/components/dashboard/labs-progress-panel";
import { AdvancedTracksPanel } from "@/components/dashboard/advanced-tracks-panel";
import { AltMdmTracksPanel } from "@/components/dashboard/alt-mdm-tracks-panel";
import { CertificationReadinessPanel } from "@/components/dashboard/certification-readiness-panel";
import { AppleTrainingProgressPanel } from "@/components/dashboard/apple-training-progress-panel";
import { VideoProgressPanel } from "@/components/dashboard/video-progress-panel";
import { ContinueWithoutVideoPanel } from "@/components/dashboard/ContinueWithoutVideoPanel";
import { getMp4AvailabilityMap } from "@/src/lib/video-production.server";
import { PILOT_VIDEO_SLUGS } from "@/src/lib/video-production";
import { userProgress as mockProgress, badges as mockBadges, certificates as mockCertificates, leaderboard, tracks } from "@/lib/data";
import { premiumBadgeIds, badgeCatalog } from "@/lib/badges-config";
import { getUser } from "@/lib/supabase/server";
import { fetchDashboardData } from "@/lib/supabase/queries";
import { isDemoUser } from "@/lib/demo/demo-user";
import { getDemoDashboardData } from "@/lib/demo/demo-dashboard-data";
import type { LearnerStats, LeaderboardEntry } from "@/lib/types";

export const metadata = { title: "Dashboard" };

const defaultStats: LearnerStats = {
  globalPercent: 0,
  timeSpentMinutes: 0,
  modulesCompleted: 0,
  averageScore: 0,
  lastActivity: null,
  certificatesCount: 0,
};

export default async function DashboardPage() {
  const user = await getUser();
  const displayName = isDemoUser(user)
    ? "Apprenant Démo"
    : user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Apprenant";

  const dbData = user
    ? isDemoUser(user)
      ? getDemoDashboardData(user.id)
      : await fetchDashboardData(user.id)
    : null;

  const globalPercent = dbData?.fromDatabase ? dbData.globalPercent : user ? 0 : mockProgress.globalPercent;
  const trackProgress = dbData?.fromDatabase ? dbData.tracks : user ? [] : mockProgress.tracks;
  const recentActivity = dbData?.fromDatabase ? dbData.recentActivity : user ? [] : mockProgress.recentActivity;
  const badges = dbData?.fromDatabase
    ? dbData.badges
    : user
      ? badgeCatalog.filter((b) => premiumBadgeIds.includes(b.id))
      : mockBadges;
  const certificates = dbData?.fromDatabase ? dbData.certificates : user ? [] : mockCertificates;
  const stats = dbData?.stats ?? (user ? { ...defaultStats, globalPercent } : { ...defaultStats, globalPercent: mockProgress.globalPercent, certificatesCount: mockCertificates.filter((c) => c.status === "available").length });
  const leaderboardEntries: LeaderboardEntry[] = dbData?.leaderboard ?? leaderboard.map((e, i) => ({
    rank: e.rank,
    userId: `mock-${i}`,
    name: e.name,
    bestScore: e.points,
    avgScore: e.points,
    modulesCompleted: 0,
    fastestMinutes: null,
    highlight: e.highlight,
  }));

  const completedLabSlugs = dbData?.completedLabSlugs ?? [];
  const completedLessonSlugs = dbData?.completedLessonSlugs ?? [];
  const maxExamScores = new Map(Object.entries(dbData?.maxExamScores ?? {}));
  const trackCertifications = dbData?.trackCertifications ?? [];
  const pathCertifications = dbData?.pathCertifications ?? [];

  const mp4Map = getMp4AvailabilityMap();
  const publishedVideoCount = PILOT_VIDEO_SLUGS.filter((slug) => mp4Map[slug]).length;

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Espace apprenant"
          title={`Bonjour, ${displayName}`}
          description={
            user
              ? dbData?.fromDatabase
                ? "Tableau de bord — progression synchronisée."
                : "Connecté — exécutez supabase/schema.sql et schema-phase2.sql."
              : "Connectez-vous pour synchroniser votre progression."
          }
        />
        {user && (
          <div className="mt-4">
            <Link
              href="/dashboard/transcript"
              className="text-sm font-semibold text-accent hover:underline"
            >
              Voir mon transcript complet →
            </Link>
          </div>
        )}

        {user && isDemoUser(user) && <DemoAccountBanner />}

        {user && dbData?.fromDatabase && !isDemoUser(user) && (
          <div className="mb-8 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            Connecté · <strong>{user.email}</strong> · données en temps réel
          </div>
        )}

        {!user && (
          <div className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl border border-border-light bg-surface-elevated p-4">
            <p className="text-sm text-ink-secondary">
              Connectez-vous pour sauvegarder scores, badges et certificats PDF.
            </p>
            <Link href="/auth/login?redirect=/dashboard" className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white">
              Se connecter
            </Link>
          </div>
        )}

        <div className="mb-8">
          <LearnerStatsGrid stats={stats} />
        </div>

        <SubscriptionStatusBanner />

        <CertificationReadinessPanel
          completedLessonSlugs={completedLessonSlugs}
          completedLabSlugs={completedLabSlugs}
          examScores={maxExamScores}
        />

        <AppleTrainingProgressPanel
          completedLessonSlugs={completedLessonSlugs}
          completedLabSlugs={completedLabSlugs}
          examScores={maxExamScores}
        />

        <div className="mb-8 grid gap-8 lg:grid-cols-2">
          <ContinueLearningPanel />
          <ResourcesPanel trackProgress={trackProgress} />
        </div>

        <div className="mb-8">
          <VideoProgressPanel publishedVideoCount={publishedVideoCount} />
        </div>

        <div className="mb-8">
          <ContinueWithoutVideoPanel />
        </div>

        <div className="mb-8">
          <LabsProgressPanel completedLabSlugsFromDb={completedLabSlugs} />
        </div>

        <div className="mb-8">
          <AdvancedTracksPanel />
          <AltMdmTracksPanel />
        </div>

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
                <Link href="/quiz" className="font-semibold text-accent hover:underline">passez un examen</Link>.
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
                    <p className="text-xs capitalize text-ink-tertiary">{activity.type}</p>
                  </div>
                  <span className="text-sm text-ink-tertiary">{activity.date}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm lg:col-span-2">
            <h2 className="text-lg font-bold text-ink">Badges</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`rounded-2xl p-4 text-center transition ${badge.earned ? "bg-ink text-white shadow-md" : "bg-surface text-ink-tertiary opacity-70"}`}
                  title={badge.description}
                >
                  <span className="text-2xl" aria-hidden="true">{badge.icon}</span>
                  <p className="mt-2 text-xs font-semibold leading-tight">{badge.name}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
            <h2 className="text-lg font-bold text-ink">Certificats PDF</h2>
            <div className="mt-4 space-y-3">
              {certificates.length === 0 &&
              trackCertifications.filter((c) => c.eligible).length === 0 &&
              pathCertifications.filter((c) => c.eligible).length === 0 ? (
                <p className="text-sm text-ink-secondary">Réussissez un examen blanc pour obtenir un certificat.</p>
              ) : (
                <>
                  {certificates.map((cert) => (
                    <div key={cert.name} className="rounded-2xl bg-surface p-4">
                      <p className="font-semibold text-ink">{cert.name}</p>
                      <div className="mt-1 flex justify-between text-sm text-ink-tertiary">
                        <span>{cert.score}</span>
                        <span>{cert.date}</span>
                      </div>
                      {"quizSlug" in cert && cert.quizSlug && cert.status === "available" && (
                        <a href={`/api/certificates/${cert.quizSlug}`} className="mt-3 inline-flex text-sm font-semibold text-accent hover:underline">
                          Télécharger PDF ↓
                        </a>
                      )}
                    </div>
                  ))}
                  {trackCertifications.map(({ cert, eligible, lessonsPercent, labsPercent, examPassed }) => (
                    <div key={cert.id} className="rounded-2xl bg-surface p-4">
                      <p className="font-semibold text-ink">{cert.title}</p>
                      <p className="mt-1 text-xs text-ink-tertiary">
                        Cours {lessonsPercent}% · Labs {labsPercent}% · Examen {examPassed ? "✓" : "—"}
                      </p>
                      {eligible ? (
                        <a href={`/api/certificates/track/${cert.id}`} className="mt-3 inline-flex text-sm font-semibold text-accent hover:underline">
                          Télécharger certificat parcours ↓
                        </a>
                      ) : (
                        <p className="mt-2 text-xs text-ink-tertiary">100% cours + labs + examen ≥ {cert.passingScore}% requis</p>
                      )}
                    </div>
                  ))}
                  {pathCertifications.map(({ path, eligible, modulesPercent, labsPercent, examPassed }) => (
                    <div key={path.slug} className="rounded-2xl bg-surface p-4">
                      <p className="font-semibold text-ink">{path.title}</p>
                      <p className="mt-1 text-xs text-ink-tertiary">
                        Modules {modulesPercent}% · Labs {labsPercent}% · Examen {examPassed ? "✓" : "—"}
                      </p>
                      {eligible ? (
                        <Link
                          href={`/certification/${path.slug}`}
                          className="mt-3 inline-flex text-sm font-semibold text-accent hover:underline"
                        >
                          Voir certificat parcours →
                        </Link>
                      ) : (
                        <p className="mt-2 text-xs text-ink-tertiary">
                          Modules + labs + examen ≥ {path.passingScore}% requis
                        </p>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
          <h2 className="text-lg font-bold text-ink">Classement</h2>
          <LeaderboardPanel entries={leaderboardEntries} />
        </section>

        <section className="mt-8 rounded-3xl bg-ink p-6 text-white">
          <h2 className="text-lg font-bold">Continuer à apprendre</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.slice(0, 3).map((track) => (
              <Link key={track.slug} href={`/cours/${track.slug}`} className="rounded-2xl bg-white/10 p-4 backdrop-blur transition hover:bg-white/20">
                <p className="font-semibold">{track.title}</p>
                <p className="mt-1 text-sm text-zinc-400">{track.lessons} leçons · {track.level}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
