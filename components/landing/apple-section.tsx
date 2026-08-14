import { SectionHeading, Badge, ButtonLink } from "@/components/ui";
import { TrackCard } from "@/components/cards";
import { getVisibleTracks } from "@/lib/data";

const APPLE_DOMAINS = [
  "Apple Business Manager",
  "Automated Device Enrollment",
  "Apple MDM",
  "macOS",
  "iOS",
  "iPadOS",
  "Managed Apple Accounts",
  "Platform SSO",
  "Apple Security",
  "FileVault",
  "Declarative Device Management",
];

export function AppleSection() {
  const tracks = getVisibleTracks().filter((track) => track.category === "apple");

  return (
    <section id="apple" className="scroll-mt-24 border-t border-border-light bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <SectionHeading
          label="Apple"
          title="Apple"
          description="Devenez expert de l'écosystème Apple en entreprise."
        />
        <div className="flex flex-wrap gap-2">
          {APPLE_DOMAINS.map((domain) => (
            <Badge key={domain}>{domain}</Badge>
          ))}
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
        <ButtonLink href="/parcours?category=apple" variant="dark" size="lg" className="mt-10">
          Voir les formations Apple
        </ButtonLink>
      </div>
    </section>
  );
}
