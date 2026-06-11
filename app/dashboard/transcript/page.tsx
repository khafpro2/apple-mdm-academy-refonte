import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout";
import { Breadcrumb, Badge } from "@/components/ui";
import { getUser } from "@/lib/supabase/server";
import { fetchTranscriptData } from "@/lib/supabase/queries";
import { formatDuration } from "@/lib/data/exams/exam-utils";

import { buildPageMetadata } from "@/lib/seo/metadata";
export const metadata = buildPageMetadata({
  title: "Transcript",
  description: "Historique complet de vos examens, scores et certifications Apple MDM Academy.",
  path: "/dashboard/transcript",
});

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function TranscriptPage() {
  const user = await getUser();
  if (!user) redirect("/auth/login?redirect=/dashboard/transcript");

  const transcript = await fetchTranscriptData(user.id);
  const displayName =
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Apprenant";

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Transcript" },
          ]}
        />

        <header className="mt-6 rounded-3xl border border-border-light bg-surface-elevated p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Relevé de formation</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">{displayName}</h1>
          <p className="mt-2 text-ink-secondary">
            Modules, labs, badges, examens blancs et certificats obtenus sur Apple MDM Academy.
          </p>
        </header>

        {!transcript && (
          <p className="mt-8 text-sm text-ink-secondary">Impossible de charger le transcript — vérifiez Supabase.</p>
        )}

        {transcript && (
          <div className="mt-10 space-y-10">
            <section>
              <h2 className="text-lg font-bold text-ink">Certificats ({transcript.certificates.length})</h2>
              {transcript.certificates.length === 0 ? (
                <p className="mt-3 text-sm text-ink-secondary">Aucun certificat — réussissez un examen blanc.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {transcript.certificates.map((c) => (
                    <li key={c.resultId} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border-light bg-surface-elevated p-4">
                      <div>
                        <p className="font-semibold text-ink">{c.title}</p>
                        <p className="text-sm text-ink-tertiary">{fmtDate(c.date)} · {c.score}%</p>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`/api/certificates/${c.quizSlug}?resultId=${c.resultId}`}
                          className="text-sm font-semibold text-accent hover:underline"
                        >
                          PDF ↓
                        </a>
                        <Link href={`/certificat/verify?id=${c.resultId}`} className="text-sm font-semibold text-ink-secondary hover:underline">
                          Vérifier
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink">Examens ({transcript.exams.length})</h2>
              {transcript.exams.length === 0 ? (
                <p className="mt-3 text-sm text-ink-secondary">Aucun examen passé.</p>
              ) : (
                <ul className="mt-4 divide-y divide-border-light rounded-2xl border border-border-light bg-surface-elevated">
                  {transcript.exams.map((e) => (
                    <li key={e.id} className="flex items-center justify-between gap-4 px-4 py-3">
                      <div>
                        <p className="font-medium text-ink">{e.title}</p>
                        <p className="text-xs text-ink-tertiary">
                          {fmtDate(e.completedAt)}
                          {e.durationSeconds ? ` · ${formatDuration(e.durationSeconds)}` : ""}
                        </p>
                      </div>
                      <Badge variant={e.passed ? "accent" : "default"}>{e.score}%</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink">Badges ({transcript.badges.length})</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {transcript.badges.map((b) => (
                  <div key={b.id} className="rounded-2xl bg-ink px-4 py-3 text-center text-white shadow-sm">
                    <span className="text-2xl">{b.icon}</span>
                    <p className="mt-1 text-xs font-semibold">{b.name}</p>
                  </div>
                ))}
                {transcript.badges.length === 0 && (
                  <p className="text-sm text-ink-secondary">Aucun badge obtenu.</p>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink">Labs ({transcript.labs.length})</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {transcript.labs.map((l) => (
                  <li key={l.slug}>
                    <Link href={`/labs/${l.slug}`} className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-ink-secondary hover:text-accent">
                      {l.slug}
                    </Link>
                  </li>
                ))}
                {transcript.labs.length === 0 && (
                  <p className="text-sm text-ink-secondary">Aucun lab complété.</p>
                )}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink">Modules ({transcript.modules.length})</h2>
              <p className="mt-1 text-xs text-ink-tertiary">Leçons complétées avec score enregistré.</p>
              <ul className="mt-4 max-h-64 overflow-y-auto divide-y divide-border-light rounded-2xl border border-border-light bg-surface-elevated text-sm">
                {transcript.modules.slice(0, 50).map((m) => (
                  <li key={`${m.courseSlug}-${m.slug}`} className="flex justify-between px-4 py-2">
                    <Link href={`/cours/${m.courseSlug}/${m.slug}`} className="text-ink hover:text-accent">
                      {m.slug}
                    </Link>
                    <span className="text-ink-tertiary">{m.score}%</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </div>
    </PageShell>
  );
}
