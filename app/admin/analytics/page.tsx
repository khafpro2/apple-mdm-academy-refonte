import { PageShell } from "@/components/layout";
import { SectionHeading, Card, Badge } from "@/components/ui";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { ProgressionChart } from "@/components/dashboard/progression-chart";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Analytics — Admin",
  description: "Statistiques apprenants, taux de complétion et performance des examens.",
  path: "/admin/analytics",
  noIndex: true,
});

async function getStats() {
  const supabase = await createClient();
  if (!supabase) return null;

  const [
    { count: totalUsers },
    { count: totalResults },
    { data: recentResults },
    { data: topQuizzes },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("quiz_results").select("*", { count: "exact", head: true }),
    supabase
      .from("quiz_results")
      .select("quiz_slug, score, passed, completed_at")
      .order("completed_at", { ascending: false })
      .limit(100),
    supabase
      .from("quiz_results")
      .select("quiz_slug")
      .limit(500),
  ]);

  // Compute stats from results
  const passRate =
    recentResults && recentResults.length > 0
      ? Math.round(
          (recentResults.filter((r) => r.passed).length / recentResults.length) * 100
        )
      : 0;

  const avgScore =
    recentResults && recentResults.length > 0
      ? Math.round(
          recentResults.reduce((s, r) => s + r.score, 0) / recentResults.length
        )
      : 0;

  // Quiz popularity
  const quizCounts =
    topQuizzes?.reduce(
      (acc, r) => {
        acc[r.quiz_slug] = (acc[r.quiz_slug] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ) ?? {};

  const topQuizList = Object.entries(quizCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([slug, count]) => ({ slug, count }));

  // Daily attempts (last 7 days)
  const now = new Date();
  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString("fr-FR", { weekday: "short" });
    const count =
      recentResults?.filter((r) => {
        const rd = new Date(r.completed_at);
        return rd.toDateString() === d.toDateString();
      }).length ?? 0;
    return { label, value: count };
  });

  return {
    totalUsers: totalUsers ?? 0,
    totalResults: totalResults ?? 0,
    passRate,
    avgScore,
    topQuizList,
    dailyData,
  };
}

export default async function AdminAnalyticsPage() {
  const stats = await getStats();

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Admin"
          title="Analytics Apprenants"
          description="Vue globale de l'engagement et des performances sur la plateforme."
        />

        {!stats ? (
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-700">
            Supabase non configuré — connectez la base de données pour voir les analytics.
          </div>
        ) : (
          <>
            {/* KPIs */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Apprenants inscrits", value: stats.totalUsers.toLocaleString("fr-FR"), icon: "👥", color: "text-blue-600" },
                { label: "Examens passés", value: stats.totalResults.toLocaleString("fr-FR"), icon: "📝", color: "text-purple-600" },
                { label: "Taux de réussite", value: `${stats.passRate}%`, icon: "🎯", color: stats.passRate >= 70 ? "text-emerald-600" : "text-amber-600" },
                { label: "Score moyen", value: `${stats.avgScore}%`, icon: "📊", color: stats.avgScore >= 70 ? "text-emerald-600" : "text-amber-600" },
              ].map((kpi) => (
                <Card key={kpi.label} className="text-center">
                  <p className="text-3xl" aria-hidden>{kpi.icon}</p>
                  <p className={`mt-2 text-3xl font-extrabold ${kpi.color}`}>{kpi.value}</p>
                  <p className="mt-1 text-sm text-ink-secondary">{kpi.label}</p>
                </Card>
              ))}
            </div>

            {/* Chart + Top quizzes */}
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <Card>
                <p className="text-sm font-semibold text-ink">Tentatives (7 derniers jours)</p>
                <div className="mt-4">
                  {stats.dailyData.some((d) => d.value > 0) ? (
                    <ProgressionChart
                      data={stats.dailyData}
                      title="Tentatives"
                      color="#0071e3"
                      height={160}
                    />
                  ) : (
                    <p className="py-8 text-center text-sm text-ink-tertiary">Pas encore de données</p>
                  )}
                </div>
              </Card>

              <Card>
                <p className="text-sm font-semibold text-ink">Examens les plus populaires</p>
                <div className="mt-4 space-y-3">
                  {stats.topQuizList.length > 0 ? (
                    stats.topQuizList.map(({ slug, count }, i) => (
                      <div key={slug} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-ink-tertiary">#{i + 1}</span>
                          <span className="text-sm font-medium text-ink">{slug}</span>
                        </div>
                        <Badge variant="accent">{count} fois</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="py-4 text-center text-sm text-ink-tertiary">Pas encore de données</p>
                  )}
                </div>
              </Card>
            </div>

            {/* Status */}
            <div className="mt-6 flex items-center gap-2 text-xs text-ink-tertiary">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Données en direct depuis Supabase · Actualisez la page pour mettre à jour
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}
