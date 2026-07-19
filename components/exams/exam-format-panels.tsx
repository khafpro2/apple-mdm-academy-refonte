/**
 * Presentational exam format panels — Cursor UI only.
 * Consumes Codex adapter shapes (`ExamCursorOfficialPanel` / `ExamCursorSimulationPanel`).
 * No bank/scoring/timer imports and no business recalculation.
 */

import type {
  ExamCursorOfficialPanel,
  ExamCursorSimulationPanel,
} from "@/lib/exams/ui-metadata-adapter";
import type { ExamVerificationStatus } from "@/lib/exams/exam-types";

export type ExamFormatPanelsProps = {
  officialPanel?: ExamCursorOfficialPanel | null;
  simulationPanel?: ExamCursorSimulationPanel | null;
  /** Required when officialPanel is null (internal exams). */
  verificationStatus?: ExamVerificationStatus;
  officialName?: string;
  certification?: string;
};

function hasText(value: string | undefined | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function formatMinutes(value: number | null | undefined): string | null {
  if (value == null || !Number.isFinite(value) || value <= 0) return null;
  return `${value} min`;
}

function formatCount(value: number | null | undefined): string | null {
  if (value == null || !Number.isFinite(value) || value < 0) return null;
  return String(value);
}

function formatPassingScore(value: number | null | undefined): string | null {
  if (value == null || !Number.isFinite(value) || value <= 0) return null;
  return `${value}%`;
}

function statusCopy(
  status: ExamVerificationStatus | undefined
): { heading: string; hint: string; showOfficialDetails: boolean } {
  switch (status) {
    case "official-verified":
      return {
        heading: "Format officiel vérifié",
        hint: "Référence éditeur associée — durées, volumes et barèmes issus du registre d’examens sourcé.",
        showOfficialDetails: true,
      };
    case "official-partial":
      return {
        heading: "Format officiel partiellement vérifié",
        hint: "Certaines informations ne sont pas publiées ou doivent être confirmées.",
        showOfficialDetails: true,
      };
    case "needs-review":
      return {
        heading: "Format à vérifier",
        hint: "Les informations officielles doivent encore être confirmées avant affichage comme format vérifié.",
        showOfficialDetails: true,
      };
    case "internal":
      return {
        heading: "Examen interne Apple MDM Academy",
        hint: "Format interne Apple MDM Academy — ce n’est pas une certification officielle éditeur.",
        showOfficialDetails: false,
      };
    default:
      return {
        heading: "Format officiel",
        hint: "",
        showOfficialDetails: true,
      };
  }
}

/**
 * Pure UI panels — null-safe, no engine imports, no empty badges.
 */
export function ExamFormatPanels({
  officialPanel,
  simulationPanel,
  verificationStatus,
  officialName,
  certification,
}: ExamFormatPanelsProps) {
  const status = verificationStatus ?? officialPanel?.verificationStatus;
  const showOfficialSection = Boolean(officialPanel) || status === "internal";
  if (!showOfficialSection && !simulationPanel) return null;

  const copy = statusCopy(status);
  const showOfficialDetails = copy.showOfficialDetails && officialPanel != null;

  const availableLabel = formatCount(simulationPanel?.availableQuestions);
  const targetLabel = formatCount(simulationPanel?.targetQuestions);

  let questionsLine: string | null = null;
  if (availableLabel && targetLabel) {
    questionsLine = `${availableLabel} sur une cible de ${targetLabel}`;
  } else if (availableLabel) {
    questionsLine = `${availableLabel} questions uniques`;
  }

  const availabilityLabel =
    simulationPanel?.fullSimulationAvailable === true
      ? hasText(targetLabel)
        ? `${targetLabel} questions`
        : hasText(availableLabel)
          ? `${availableLabel} questions`
          : null
      : simulationPanel?.fullSimulationAvailable === false
        ? "Simulation complète indisponible"
        : null;

  const official = officialPanel ?? null;
  const durationLabel = formatMinutes(official?.duration);
  const questionCountLabel = formatCount(official?.questionCount);
  const passingScoreLabel = formatPassingScore(official?.passingScore);
  const simulationDuration = formatMinutes(simulationPanel?.duration);
  const simulationPassing = formatPassingScore(simulationPanel?.passingScore);

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-2">
      {showOfficialSection && (
        <section
          className="rounded-2xl border border-border-light bg-surface px-5 py-4"
          aria-labelledby="exam-official-format-heading"
          data-testid="exam-official-panel"
        >
          <h2 id="exam-official-format-heading" className="text-sm font-semibold text-ink">
            {copy.heading}
          </h2>
          {hasText(copy.hint) && (
            <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{copy.hint}</p>
          )}

          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            {hasText(officialName ?? official?.title) && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">Nom</dt>
                <dd className="mt-0.5 font-medium text-ink">{officialName ?? official?.title}</dd>
              </div>
            )}
            {status === "internal" && hasText(certification) && (
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">
                  Statut
                </dt>
                <dd className="mt-0.5 text-ink-secondary" data-testid="exam-internal-certification">
                  {certification}
                </dd>
              </div>
            )}
            {showOfficialDetails && official && hasText(official.provider) && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">
                  Fournisseur
                </dt>
                <dd className="mt-0.5 text-ink-secondary">{official.provider}</dd>
              </div>
            )}
            {showOfficialDetails && hasText(durationLabel) && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">
                  Durée officielle
                </dt>
                <dd className="mt-0.5 text-ink-secondary">{durationLabel}</dd>
              </div>
            )}
            {showOfficialDetails && hasText(questionCountLabel) && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">
                  Questions officielles
                </dt>
                <dd className="mt-0.5 text-ink-secondary">{questionCountLabel}</dd>
              </div>
            )}
            {showOfficialDetails && hasText(passingScoreLabel) && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">
                  Seuil officiel
                </dt>
                <dd className="mt-0.5 text-ink-secondary">{passingScoreLabel}</dd>
              </div>
            )}
          </dl>

          {showOfficialDetails && official && official.sources.length > 0 && (
            <div className="mt-3 space-y-1">
              {official.sources.map((source) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm font-semibold text-accent underline hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {source.title}
                </a>
              ))}
            </div>
          )}
          {showOfficialDetails && official && hasText(official.verifiedAt) && (
            <p className="mt-2 text-xs text-ink-tertiary">Vérifié le {official.verifiedAt}.</p>
          )}
        </section>
      )}

      {simulationPanel && (
        <section
          className="rounded-2xl border border-border-light bg-surface-elevated px-5 py-4"
          aria-labelledby="exam-simulation-config-heading"
          data-testid="exam-simulation-panel"
        >
          <h2 id="exam-simulation-config-heading" className="text-sm font-semibold text-ink">
            Configuration de la simulation Apple MDM Academy
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
            Paramètres internes de préparation — distincts du format officiel éditeur.
          </p>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            {hasText(availabilityLabel) && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">
                  Disponibilité
                </dt>
                <dd className="mt-0.5 font-medium text-ink">{availabilityLabel}</dd>
              </div>
            )}
            {hasText(questionsLine) && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">
                  Questions disponibles
                </dt>
                <dd className="mt-0.5 font-medium text-ink">{questionsLine}</dd>
              </div>
            )}
            {hasText(simulationDuration) && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">
                  Durée interne
                </dt>
                <dd className="mt-0.5 font-medium text-ink">{simulationDuration}</dd>
              </div>
            )}
            {hasText(simulationPassing) && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">
                  Seuil interne
                </dt>
                <dd className="mt-0.5 font-medium text-ink">{simulationPassing}</dd>
              </div>
            )}
            {hasText(simulationPanel.mode) && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">Mode</dt>
                <dd className="mt-0.5 text-ink-secondary">{simulationPanel.mode}</dd>
              </div>
            )}
          </dl>
          {hasText(simulationPanel.warning) && (
            <p
              className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900"
              data-testid="exam-bank-warning"
            >
              {simulationPanel.warning}
            </p>
          )}
          {simulationPanel.trainingAvailable === true && (
            <p className="mt-3 text-xs text-ink-tertiary" data-testid="exam-training-available">
              Entraînement limité disponible.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
