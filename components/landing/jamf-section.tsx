import { SectionHeading, Badge, ButtonLink } from "@/components/ui";
import { TrackCard } from "@/components/cards";
import { getVisibleTracks } from "@/lib/data";

const JAMF_DOMAINS = [
  "Jamf 100",
  "Jamf 170",
  "Jamf 200",
  "Jamf 300",
  "Jamf 400",
  "Jamf Pro",
  "Jamf Protect",
  "Scripts",
  "Smart Groups",
  "Policies",
  "Packages",
  "Self Service",
  "API",
  "Automatisation",
];

const JAMF_DASHBOARD_STATS = [
  { label: "DEVICES", value: "1,248" },
  { label: "COMPLIANT", value: "98.4%" },
  { label: "POLICIES", value: "42" },
  { label: "APPLICATIONS", value: "86" },
];

function JamfDashboardPreview() {
  return (
    <div className="rounded-3xl bg-ink p-6 text-white shadow-2xl sm:p-8">
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {JAMF_DASHBOARD_STATS.map((stat) => (
          <div key={stat.label}>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs text-zinc-500">Exemple d&apos;interface Jamf Pro — données de démonstration.</p>
    </div>
  );
}

export function JamfSection() {
  const tracks = getVisibleTracks().filter((track) => track.category === "jamf");

  return (
    <section id="jamf" className="scroll-mt-24 border-t border-border-light bg-surface-elevated">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <SectionHeading
          label="Jamf"
          title="Jamf"
          description="Passez de l'administration Jamf aux architectures Apple Enterprise."
        />
        <div className="flex flex-wrap gap-2">
          {JAMF_DOMAINS.map((domain) => (
            <Badge key={domain}>{domain}</Badge>
          ))}
        </div>
        <div className="mt-10">
          <JamfDashboardPreview />
        </div>
        {tracks.length > 0 && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.map((track, index) => (
              <div
                key={track.slug}
                className={`animate-[fadeInUp_0.6s_ease-out_both] ${index === 0 ? "sm:col-span-2" : ""}`}
                style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
              >
                <TrackCard track={track} />
              </div>
            ))}
          </div>
        )}
        <ButtonLink href="/parcours?category=jamf" size="lg" className="mt-10">
          Explorer Jamf
        </ButtonLink>
      </div>
    </section>
  );
}
