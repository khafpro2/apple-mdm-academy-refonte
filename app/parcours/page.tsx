import Link from "next/link";
import { PageShell } from "@/components/layout";
import { SectionHeading, Badge, Card } from "@/components/ui";
import { TrackCard } from "@/components/cards";
import { TrackLogo } from "@/components/ui/track-logo";
import { tracks } from "@/lib/data";
import { certificationPaths } from "@/lib/data/pro-modules/paths";

export const metadata = { title: "Parcours" };

export default function ParcoursPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Certifications"
          title="Parcours de formation"
          description={`${tracks.length} parcours complets — Apple, Jamf, Intune, MDM alternatifs (Kandji, Mosyle, Addigy, Workspace ONE) et certifications expert.`}
        />

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
            {tracks.map((track) => (
              <TrackCard key={track.slug} track={track} />
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
