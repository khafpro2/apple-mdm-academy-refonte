import type { ExamDisplayMetadata } from "@/lib/exams/ui-metadata-adapter";
import type { ExamFormatPanelsProps } from "@/components/exams/exam-format-panels";

function statusHeading(
  status: ExamDisplayMetadata["official"]["verificationStatus"]
): { status: string; statusHint: string; showOfficialDetails: boolean } {
  switch (status) {
    case "official-verified":
      return {
        status: "Format officiel vérifié",
        statusHint: "Référence éditeur associée — durées, volumes et barèmes issus du registre d’examens sourcé.",
        showOfficialDetails: true,
      };
    case "official-partial":
      return {
        status: "Format officiel partiellement vérifié",
        statusHint: "Certaines informations ne sont pas publiées ou doivent être confirmées.",
        showOfficialDetails: true,
      };
    case "needs-review":
      return {
        status: "Format à vérifier",
        statusHint:
          "Les informations officielles doivent encore être confirmées avant affichage comme format vérifié.",
        showOfficialDetails: true,
      };
    case "internal":
      return {
        status: "Examen interne Apple MDM Academy",
        statusHint: "Format interne Apple MDM Academy — ce n’est pas une certification officielle éditeur.",
        showOfficialDetails: false,
      };
  }
}

/**
 * Maps Codex display metadata → presentational panel props.
 * No business recalculation — passthrough + labels only.
 */
export function mapExamDisplayToPanelProps(
  metadata: ExamDisplayMetadata | null
): ExamFormatPanelsProps {
  if (!metadata) return { official: null, simulation: null };

  const heading = statusHeading(metadata.official.verificationStatus);
  const durationMinutes = metadata.simulation.durationMinutes;

  return {
    official: {
      title: metadata.official.officialName || undefined,
      provider: metadata.official.vendor || undefined,
      duration: metadata.official.durationLabel || undefined,
      questionCount: metadata.official.questionCountLabel || undefined,
      passingScore: metadata.official.passingScoreLabel || undefined,
      questionTypes: metadata.official.questionTypesLabel || undefined,
      status: heading.status,
      statusHint: heading.statusHint,
      verifiedAt: metadata.official.verifiedAt ?? undefined,
      sources: metadata.official.sources.map((s) => ({ title: s.title, url: s.url })),
      showOfficialDetails: heading.showOfficialDetails,
    },
    simulation: {
      mode: undefined,
      duration:
        durationMinutes != null && durationMinutes > 0 ? `${durationMinutes} min` : undefined,
      availableQuestions: metadata.simulation.availableQuestionCount ?? undefined,
      targetQuestions: metadata.simulation.targetQuestionCount ?? undefined,
      fullSimulationAvailable: metadata.simulation.fullSimulationAvailable,
      trainingAvailable: metadata.simulation.trainingAvailable,
      passingScore:
        metadata.simulation.passingScore != null
          ? `${metadata.simulation.passingScore}%`
          : undefined,
      warning: metadata.simulation.warning ?? undefined,
    },
  };
}
