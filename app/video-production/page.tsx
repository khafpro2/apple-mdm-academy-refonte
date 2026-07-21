import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/ui";
import { VideoProductionCard, VideoValidationSummary } from "@/components/video-production/video-production-cards";
import { getVideoProductionEntries } from "@/lib/video/data/video-production-registry";
import { validateVideoProductionEntries } from "@/lib/video/validation/validate-video-entry";

export const metadata = {
  title: "Video Production",
  robots: { index: false, follow: false },
};

export default function VideoProductionPage() {
  const entries = getVideoProductionEntries();
  const validation = validateVideoProductionEntries(entries, { repoRoot: process.cwd() });

  return (
    <PageShell>
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Production interne"
          title="Video Production"
          description="Registre technique des pilotes video. Ces entrees ne sont pas des cours publies."
        />

        <VideoValidationSummary issues={[...validation.errors, ...validation.warnings]} />

        <section className="mt-8 grid gap-5 lg:grid-cols-2">
          {entries.map((entry) => (
            <VideoProductionCard key={entry.id} entry={entry} />
          ))}
        </section>
      </main>
    </PageShell>
  );
}
