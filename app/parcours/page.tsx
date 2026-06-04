import { PageShell } from "@/components/layout";
import { SectionHeading } from "@/components/ui";
import { TrackCard } from "@/components/cards";
import { tracks } from "@/lib/data";

export const metadata = { title: "Parcours" };

export default function ParcoursPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Certifications"
          title="Parcours de formation"
          description="7 parcours complets pour maîtriser Apple MDM, Jamf Pro et Microsoft Intune."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track) => (
            <TrackCard key={track.slug} track={track} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}
