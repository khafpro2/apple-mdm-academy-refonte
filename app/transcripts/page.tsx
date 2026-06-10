import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/ui";
import { getAllVideoTranscripts } from "@/src/lib/video-transcripts";
import { TranscriptsLibrary } from "@/components/transcripts/transcripts-library";

export const metadata = {
  title: "Transcripts vidéo",
  description: "Transcripts complets des vidéos Apple MDM Academy — recherche et copie.",
};

export default function TranscriptsPage() {
  const transcripts = getAllVideoTranscripts();

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Transcripts"
          title="Bibliothèque de transcripts vidéo"
          description={`${transcripts.length} vidéos · recherche texte · copie en un clic`}
        />
        <TranscriptsLibrary transcripts={transcripts} />
      </div>
    </PageShell>
  );
}
