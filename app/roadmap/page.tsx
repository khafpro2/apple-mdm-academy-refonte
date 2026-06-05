import Link from "next/link";
import { PageShell } from "@/components/layout";
import { SectionHeading, Card, Badge } from "@/components/ui";
import { currentVersion, roadmapVersions } from "@/lib/data/roadmap-v2";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Roadmap V2",
  description: "Feuille de route Apple MDM Academy — Jamf 300/400, Platform Deployment, Kandji, Mosyle et plus.",
  path: "/roadmap",
});

const statusStyles = {
  done: "accent" as const,
  in_progress: "dark" as const,
  planned: "default" as const,
};

const statusLabels = {
  done: "Terminé",
  in_progress: "En cours",
  planned: "Prévu",
};

export default function RoadmapPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Roadmap"
          title="Évolution de la plateforme"
          description={`Version actuelle : ${currentVersion} — découvrez les fonctionnalités V2 à venir.`}
          align="center"
        />
        <div className="mt-12 space-y-16">
          {roadmapVersions.map((version) => (
            <div key={version.version}>
              <div className="mb-6 flex items-center gap-3">
                <h2 className="text-2xl font-bold text-ink">{version.label}</h2>
                <Badge variant={version.version === currentVersion ? "accent" : "default"}>v{version.version}</Badge>
              </div>
              <div className="space-y-4">
                {version.items.map((item) => (
                  <Card key={item.title} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-bold text-ink">{item.title}</h3>
                      <p className="mt-1 text-sm text-ink-secondary">{item.description}</p>
                      {item.quarter && <p className="mt-1 text-xs text-ink-tertiary">{item.quarter}</p>}
                    </div>
                    <Badge variant={statusStyles[item.status]}>{statusLabels[item.status]}</Badge>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-12 text-center text-sm text-ink-tertiary">
          <Link href="/mobile-roadmap" className="text-accent hover:underline">
            Voir la roadmap mobile →
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
