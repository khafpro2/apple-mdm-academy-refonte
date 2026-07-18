import type { ExamAvailability, ExamFormat, ExamMode } from "@/lib/exams/exam-types";

export function getRequiredQuestionCount(format: ExamFormat, mode: ExamMode = "simulation"): number {
  return format.modes[mode].questionCount ?? format.questionCount ?? 0;
}

export function calculateExamAvailability(format: ExamFormat, availableQuestions: number, mode: ExamMode = "simulation"): ExamAvailability {
  const available = Math.max(0, availableQuestions);
  const required = getRequiredQuestionCount(format, mode);
  const deficit = Math.max(0, required - available);
  const trainingAvailable = available > 0 && Boolean(format.modes.training);
  const fullSimulationAvailable = required > 0 && available >= required;

  return {
    available,
    required,
    deficit,
    fullSimulationAvailable,
    trainingAvailable,
    reason:
      deficit > 0
        ? `Banque incomplète : ${available} questions uniques disponibles sur ${required} requises.`
        : available === 0
          ? "Banque vide : aucune tentative disponible."
          : undefined,
  };
}
