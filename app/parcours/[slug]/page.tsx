import { notFound } from "next/navigation";
import Link from "next/link";
import { EntraLogo } from "@/components/brands/EntraLogo";
import { IntuneLogo } from "@/components/brands/IntuneLogo";
import { JamfLogo } from "@/components/brands/JamfLogo";
import { PageShell } from "@/components/layout";
import { Breadcrumb, Badge, ButtonLink } from "@/components/ui";
import { TrackLogo } from "@/components/ui/track-logo";
import { getTrack, tracks, getQuizzesByTrack, getLabsByTrack } from "@/lib/data";
import { resolveTrackCourseHref, trackHasCourse } from "@/lib/navigation/track-links";

export function generateStaticParams() {
  return tracks.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const track = getTrack(slug);
  return { title: track?.title ?? "Parcours" };
}

export default async function TrackDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const track = getTrack(slug);
  if (!track) notFound();

  const trackQuizzes = getQuizzesByTrack(slug);
  const trackLabs = getLabsByTrack(slug);
  const courseHref = resolveTrackCourseHref(slug);
  const hasCourse = trackHasCourse(slug);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <Breadcrumb items={[{ label: "Parcours", href: "/parcours" }, { label: track.title }]} />

        <header className="rounded-3xl border border-border-light bg-surface-elevated p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            {track.logo === "jamf" ? (
              <JamfLogo variant="full" size={28} alt={track.title} />
            ) : track.logo === "intune" ? (
              <IntuneLogo size={28} showLabel alt={track.title} />
            ) : track.logo === "microsoft" && slug === "azure-for-apple-admins" ? (
              <EntraLogo size={28} showLabel alt={track.title} />
            ) : (
              <TrackLogo logo={track.logo} trackSlug={slug} size={32} alt={track.title} className="h-14 w-14" />
            )}
            <Badge>{track.level}</Badge>
            <span className="text-sm text-ink-tertiary">{track.lessons} leçons · {track.duration}</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-ink md:text-4xl">{track.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-secondary">{track.description}</p>
          {track.certification && (
            <p className="mt-3 text-sm font-semibold text-accent">Certification : {track.certification}</p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            {hasCourse ? (
              <ButtonLink href={courseHref}>Commencer le cours</ButtonLink>
            ) : (
              <ButtonLink href="/parcours" variant="secondary">
                Retour au catalogue
              </ButtonLink>
            )}
            {trackQuizzes[0] && (
              <ButtonLink href={`/quiz/${trackQuizzes[0].slug}`} variant="secondary">
                Passer le quiz
              </ButtonLink>
            )}
          </div>
        </header>

        {trackLabs.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-ink">Labs associés</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {trackLabs.map((lab) => (
                <Link
                  key={lab.slug}
                  href={`/labs/${lab.slug}`}
                  className="group rounded-2xl border border-border-light bg-surface-elevated p-4 transition hover:border-accent/30"
                >
                  <p className="font-semibold text-ink group-hover:text-accent">{lab.title}</p>
                  <p className="mt-1 text-sm text-ink-tertiary">{lab.duration} · {lab.level}</p>
                  <p className="mt-2 text-xs font-semibold text-accent">Accéder au Lab →</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}
