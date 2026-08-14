import Link from "next/link";
import { SectionHeading, Badge } from "@/components/ui";
import { TrackCard } from "@/components/cards";
import { getVisibleTracks } from "@/lib/data";

const INTUNE_DOMAINS = [
  "Intune Apple",
  "macOS",
  "iPhone",
  "iPad",
  "Windows",
  "Apple Business Manager",
  "APNs",
  "Compliance",
  "Conditional Access",
  "Microsoft Entra ID",
  "Platform SSO",
  "Defender",
];

export function IntuneSection() {
  const tracks = getVisibleTracks().filter((track) => track.category === "intune");

  return (
    <section id="intune" className="scroll-mt-24 border-t border-border-light bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <SectionHeading
          label="Microsoft Intune"
          title="Microsoft Intune"
          description="Gérez les environnements Apple et Microsoft depuis une stratégie moderne."
        />
        <div className="flex flex-wrap gap-2">
          {INTUNE_DOMAINS.map((domain) => (
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
        <Link
          href="/parcours?category=intune"
          className="mt-10 inline-flex min-h-12 items-center justify-center rounded-full bg-[#2564cf] px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-[#1e50a8] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#2564cf]"
        >
          Explorer Intune
        </Link>
      </div>
    </section>
  );
}
