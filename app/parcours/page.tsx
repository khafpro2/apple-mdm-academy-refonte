import Link from "next/link";
import { PageShell } from "@/components/layout";
import { SectionHeading, Badge, Card } from "@/components/ui";
import { TrackCard } from "@/components/cards";
import { TrackLogo } from "@/components/ui/track-logo";
import { getVisibleTracks } from "@/lib/data";
import { certificationPaths } from "@/lib/data/pro-modules/paths";
import { AppleCurriculumMap } from "@/components/course/AppleCurriculumMap";

import { buildPageMetadata } from "@/lib/seo/metadata";
export const metadata = buildPageMetadata({
  title: "Parcours de formation",
  description: "Parcours certifiants Apple MDM — Apple Platform Deployment, Jamf, Intune et Entra ID pour les appareils Apple.",
  path: "/parcours",
});

type Props = {
  searchParams?: Promise<{ q?: string }>;
};

export default async function ParcoursPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params?.q?.trim() ?? "";
  const visibleTracks = getVisibleTracks();
  const normalizedQuery = query.toLowerCase();
  const filteredTracks = normalizedQuery
    ? visibleTracks.filter((track) =>
        [track.title, track.description, track.certification ?? "", track.level]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      )
    : visibleTracks;

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Certifications"
          title="Parcours de formation"
          description={`${visibleTracks.length} parcours complets — Apple Platform Deployment, Jamf, Intune et Entra ID pour l'administration des appareils Apple.`}
        />

        <AppleCurriculumMap />

        <form action="/parcours" method="get" role="search" className="mb-10 mt-10 max-w-2xl">
          <label htmlFor="parcours-search" className="text-sm font-medium text-ink">
            Rechercher dans les parcours
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              id="parcours-search"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Apple Business Manager, Jamf 100, Intune..."
              className="min-h-12 flex-1 rounded-xl border border-border bg-surface px-4 text-base text-ink outline-none transition placeholder:text-ink-tertiary focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <button
              type="submit"
              className="min-h-12 rounded-xl bg-accent px-5 text-sm font-semibold text-white transition hover:bg-accent-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Rechercher
            </button>
          </div>
        </form>

        <section>
          <h2 className="text-lg font-bold text-ink">Parcours certification</h2>
          <p className="mt-1 text-sm text-ink-secondary">
            Modules 11–18 avec quiz, labs, badges et certificat final.
          </p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {certificationPaths.map((path) => (
              <Link key={path.slug} href={`/certification/${path.slug}`} className="group block">
                <Card hover className="flex h-full flex-col">
                  <div className="mb-4 flex items-start justify-between">
                    <TrackLogo logo={path.logo} alt={path.title} />
                    <Badge>{path.level}</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-ink group-hover:text-accent">{path.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-secondary">
                    {path.description}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-ink-tertiary">
                    <span>{path.moduleNumbers.length} modules</span>
                    <span>·</span>
                    <span>{path.duration}</span>
                  </div>
                  <p className="mt-2 text-xs font-medium text-accent">
                    Examen : {path.passingScore} % requis
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-lg font-bold text-ink">Parcours par technologie</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTracks.map((track) => (
              <TrackCard key={track.slug} track={track} />
            ))}
          </div>
          {filteredTracks.length === 0 && (
            <p className="mt-6 rounded-xl border border-border bg-surface p-4 text-sm text-ink-secondary">
              Aucun parcours public ne correspond à cette recherche.
            </p>
          )}
        </section>
      </div>
    </PageShell>
  );
}
