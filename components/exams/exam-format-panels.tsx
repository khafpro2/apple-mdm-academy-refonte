/**
 * Presentational props for exam format panels.
 * Cursor UI only — no bank/scoring/timer imports. Parent maps Codex metadata here.
 */

export type OfficialPanelProps = {
  title?: string;
  provider?: string;
  duration?: string;
  questionCount?: string;
  passingScore?: string;
  questionTypes?: string;
  /** Display heading derived by parent from Codex verification status. */
  status?: string;
  /** Short helper under the heading (partial / internal / needs-review). */
  statusHint?: string;
  verifiedAt?: string;
  sources?: Array<{ title: string; url: string }>;
  /** When false, hide duration/count/score/sources (e.g. internal exams). */
  showOfficialDetails?: boolean;
};

export type SimulationPanelProps = {
  mode?: string;
  duration?: string;
  availableQuestions?: number;
  targetQuestions?: number;
  fullSimulationAvailable?: boolean;
  trainingAvailable?: boolean;
  passingScore?: string;
  warning?: string;
};

export type ExamFormatPanelsProps = {
  official?: OfficialPanelProps | null;
  simulation?: SimulationPanelProps | null;
};

function hasText(value: string | undefined | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function formatOptionalCount(value: number | undefined): string | null {
  if (value == null || !Number.isFinite(value) || value < 0) return null;
  return String(value);
}

/**
 * Pure UI panels — null-safe, no engine imports, no empty badges.
 */
export function ExamFormatPanels({ official, simulation }: ExamFormatPanelsProps) {
  if (!official && !simulation) return null;

  const showOfficialDetails = official?.showOfficialDetails !== false;
  const availableLabel = formatOptionalCount(simulation?.availableQuestions);
  const targetLabel = formatOptionalCount(simulation?.targetQuestions);

  let questionsLine: string | null = null;
  if (availableLabel && targetLabel) {
    questionsLine = `${availableLabel} sur une cible de ${targetLabel}`;
  } else if (availableLabel) {
    questionsLine = `${availableLabel} questions uniques`;
  }

  const availabilityLabel =
    simulation?.fullSimulationAvailable === true
      ? hasText(targetLabel)
        ? `${targetLabel} questions`
        : hasText(availableLabel)
          ? `${availableLabel} questions`
          : null
      : simulation?.fullSimulationAvailable === false
        ? "Simulation complète indisponible"
        : null;

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-2">
      {official && (
        <section
          className="rounded-2xl border border-border-light bg-surface px-5 py-4"
          aria-labelledby="exam-official-format-heading"
          data-testid="exam-official-panel"
        >
          <h2 id="exam-official-format-heading" className="text-sm font-semibold text-ink">
            {hasText(official.status) ? official.status : "Format officiel"}
          </h2>
          {hasText(official.statusHint) && (
            <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{official.statusHint}</p>
          )}

          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            {hasText(official.title) && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">Nom</dt>
                <dd className="mt-0.5 font-medium text-ink">{official.title}</dd>
              </div>
            )}
            {hasText(official.provider) && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">
                  Fournisseur
                </dt>
                <dd className="mt-0.5 text-ink-secondary">{official.provider}</dd>
              </div>
            )}
            {showOfficialDetails && hasText(official.duration) && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">
                  Durée officielle
                </dt>
                <dd className="mt-0.5 text-ink-secondary">{official.duration}</dd>
              </div>
            )}
            {showOfficialDetails && hasText(official.questionCount) && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">
                  Questions officielles
                </dt>
                <dd className="mt-0.5 text-ink-secondary">{official.questionCount}</dd>
              </div>
            )}
            {showOfficialDetails && hasText(official.passingScore) && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">
                  Seuil officiel
                </dt>
                <dd className="mt-0.5 text-ink-secondary">{official.passingScore}</dd>
              </div>
            )}
            {showOfficialDetails && hasText(official.questionTypes) && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">Types</dt>
                <dd className="mt-0.5 text-ink-secondary">{official.questionTypes}</dd>
              </div>
            )}
          </dl>

          {showOfficialDetails && official.sources && official.sources.length > 0 && (
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
          {showOfficialDetails && hasText(official.verifiedAt) && (
            <p className="mt-2 text-xs text-ink-tertiary">Vérifié le {official.verifiedAt}.</p>
          )}
        </section>
      )}

      {simulation && (
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
            {hasText(simulation.duration) && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">
                  Durée interne
                </dt>
                <dd className="mt-0.5 font-medium text-ink">{simulation.duration}</dd>
              </div>
            )}
            {hasText(simulation.passingScore) && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">
                  Seuil interne
                </dt>
                <dd className="mt-0.5 font-medium text-ink">{simulation.passingScore}</dd>
              </div>
            )}
            {hasText(simulation.mode) && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">Mode</dt>
                <dd className="mt-0.5 text-ink-secondary">{simulation.mode}</dd>
              </div>
            )}
          </dl>
          {hasText(simulation.warning) && (
            <p
              className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900"
              data-testid="exam-bank-warning"
            >
              {simulation.warning}
            </p>
          )}
          {simulation.trainingAvailable === true && (
            <p className="mt-3 text-xs text-ink-tertiary" data-testid="exam-training-available">
              Entraînement limité disponible.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
