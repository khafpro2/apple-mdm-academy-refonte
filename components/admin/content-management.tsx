import Link from "next/link";
import { videoScripts } from "@/src/lib/video-scripts";
import { courses } from "@/lib/data/courses";
import { quizzes, getQuiz } from "@/lib/data/quizzes";
import { getVisibleTracks, isTrackVisible } from "@/lib/data/tracks";
import { getExamRouteSlugs, getQuizSlugFromExamRoute } from "@/lib/data/exams/pools";
import { Badge } from "@/components/ui";

export function AdminContentManagement() {
  const visibleTracks = getVisibleTracks();
  const visibleCourses = courses.filter((c) => isTrackVisible(c.trackSlug));
  const visibleQuizzes = quizzes.filter((q) => isTrackVisible(q.trackSlug));
  const examSlugs = getExamRouteSlugs().filter((slug) => {
    const quizSlug = getQuizSlugFromExamRoute(slug);
    const quiz = quizSlug ? getQuiz(quizSlug) : undefined;
    return quiz ? isTrackVisible(quiz.trackSlug) : false;
  });
  const lessonCount = visibleCourses.reduce(
    (acc, c) => acc + c.modules.reduce((a, m) => a + m.lessons.length, 0),
    0,
  );

  return (
    <div className="mt-10 space-y-8">
      <div className="flex flex-wrap gap-3">
        <Link href="/admin" className="rounded-full border border-border-light px-4 py-2 text-sm font-semibold text-ink-secondary hover:text-ink">
          Stats
        </Link>
        <span className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">Contenu</span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Parcours", value: visibleTracks.length },
          { label: "Leçons", value: lessonCount },
          { label: "Vidéos", value: videoScripts.length },
          { label: "Quiz", value: visibleQuizzes.length },
          { label: "Examens blancs", value: examSlugs.length },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border-light bg-surface-elevated p-5">
            <p className="text-sm text-ink-tertiary">{s.label}</p>
            <p className="mt-1 text-3xl font-bold text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
        <h2 className="text-lg font-bold text-ink">Gestion modules</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light text-left text-ink-tertiary">
                <th className="py-2 pr-4">Cours</th>
                <th className="py-2 pr-4">Module</th>
                <th className="py-2">Leçons</th>
              </tr>
            </thead>
            <tbody>
              {visibleCourses.flatMap((c) =>
                c.modules.map((m) => (
                  <tr key={`${c.slug}-${m.title}`} className="border-b border-border-light">
                    <td className="py-3 pr-4 font-medium text-ink">{c.title}</td>
                    <td className="py-3 pr-4 text-ink-secondary">{m.title}</td>
                    <td className="py-3 text-ink-secondary">{m.lessons.length}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
        <h2 className="text-lg font-bold text-ink">Gestion vidéos (HeyGen)</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light text-left text-ink-tertiary">
                <th className="py-2 pr-4">Titre</th>
                <th className="py-2 pr-4">Module</th>
                <th className="py-2 pr-4">Durée</th>
                <th className="py-2 pr-4">Statut HeyGen</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videoScripts.map((v) => (
                <tr key={v.slug} className="border-b border-border-light">
                  <td className="py-3 pr-4 font-medium text-ink">{v.title}</td>
                  <td className="py-3 pr-4 text-ink-secondary">{v.module}</td>
                  <td className="py-3 pr-4 text-ink-secondary">{v.duration}</td>
                  <td className="py-3 pr-4">
                    <Badge variant="default">draft</Badge>
                  </td>
                  <td className="py-3">
                    <Link href={`/videos/${v.slug}`} className="font-semibold text-accent hover:underline">
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
        <h2 className="text-lg font-bold text-ink">Gestion examens</h2>
        <ul className="mt-4 divide-y divide-border-light">
          {examSlugs.map((slug) => {
            const quizSlug = getQuizSlugFromExamRoute(slug);
            const quiz = quizSlug ? quizzes.find((q) => q.slug === quizSlug) : undefined;
            return (
              <li key={slug} className="flex items-center justify-between py-3">
                <div>
                  <span className="font-medium text-ink">{quiz?.title ?? slug}</span>
                  <p className="text-xs text-ink-tertiary">{slug}</p>
                </div>
                <Link href={`/examens/${slug}`} className="text-sm font-semibold text-accent hover:underline">
                  Ouvrir
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
        <h2 className="text-lg font-bold text-ink">Progression contenu (aperçu)</h2>
        <p className="mt-2 text-sm text-ink-secondary">
          Les statistiques détaillées par utilisateur sont disponibles dans le tableau de bord principal via Supabase.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {visibleTracks.slice(0, 3).map((t) => (
            <div key={t.slug} className="rounded-xl bg-surface p-4">
              <p className="font-semibold text-ink">{t.title}</p>
              <p className="mt-1 text-xs text-ink-tertiary">{t.lessons} leçons · {t.level}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
