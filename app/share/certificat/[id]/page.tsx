import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site-config";
import { getQuiz } from "@/lib/data/quizzes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) return { title: "Certificat" };

  const { data } = await supabase
    .from("quiz_results")
    .select("quiz_slug, score, completed_at")
    .eq("id", id)
    .eq("passed", true)
    .maybeSingle();

  if (!data) return buildPageMetadata({ title: "Certificat non trouvé", description: "Ce certificat est introuvable.", path: "/share" });

  const quiz = getQuiz(data.quiz_slug);
  const title = quiz?.title ?? "Apple MDM Academy";

  return {
    title: `Certification ${title} — Apple MDM Academy`,
    description: `Score ${data.score}% — Certification vérifiable Apple MDM Academy.`,
    openGraph: {
      title: `J'ai obtenu la certification ${title} !`,
      description: `Score : ${data.score}% — Certification Apple MDM Academy vérifiable en ligne.`,
      type: "website" as const,
      images: [`${siteConfig.url}/api/og/certificat/${id}`],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: `Certification ${title} obtenue !`,
    },
  };
}

export default async function ShareCertificatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) notFound();

  const { data } = await supabase
    .from("quiz_results")
    .select("quiz_slug, score, completed_at")
    .eq("id", id)
    .eq("passed", true)
    .maybeSingle();

  if (!data) notFound();

  const quiz = getQuiz(data.quiz_slug);
  const title = quiz?.title ?? "Certification Apple MDM";
  const completedAt = new Date(data.completed_at).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });

  const shareUrl = `${siteConfig.url}/share/certificat/${id}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Certification "${title}" obtenue sur Apple MDM Academy ! Score : ${data.score}%`)}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center">
      {/* Carte */}
      <div className="overflow-hidden rounded-3xl border-2 border-accent/20 bg-gradient-to-br from-blue-50 via-white to-purple-50 px-8 py-12 shadow-lg">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 text-5xl">🏆</div>
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">Certification obtenue</p>
        <h1 className="mt-2 text-2xl font-bold text-ink">{title}</h1>
        <p className="mt-1 text-3xl font-extrabold text-accent">{data.score}%</p>
        <p className="mt-1 text-sm text-ink-tertiary">Obtenu le {completedAt}</p>
        <div className="mt-6 flex justify-center gap-2 text-xs text-ink-tertiary">
          <span>Apple MDM Academy</span>
          <span>·</span>
          <span>#{id.slice(0, 8).toUpperCase()}</span>
        </div>
      </div>

      {/* Partage */}
      <div className="mt-8">
        <p className="mb-4 text-sm font-semibold text-ink">Partager ma certification</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href={linkedInUrl} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 rounded-full bg-[#0a66c2] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition">
            LinkedIn
          </a>
          <a href={twitterUrl} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 rounded-full bg-[#1da1f2] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition">
            X / Twitter
          </a>
        </div>
        <div className="mt-6 rounded-2xl border border-border-light bg-surface p-4 text-left">
          <p className="text-xs font-semibold text-ink-secondary">🔐 Certificat vérifiable</p>
          <p className="mt-1 text-xs text-ink-tertiary">Vérifiable en ligne via son identifiant unique.</p>
          <Link href={`/certificat/verify?id=${id}`}
                className="mt-2 inline-block text-xs font-medium text-accent hover:underline">
            Vérifier l&apos;authenticité →
          </Link>
        </div>
      </div>
    </div>
  );
}
