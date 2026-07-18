import type { ExamDisplayMetadata } from "@/lib/exams/ui-metadata-adapter";

type Props = {
  metadata: ExamDisplayMetadata | null;
};

function verificationLabel(status: ExamDisplayMetadata["official"]["verificationStatus"]): string {
  switch (status) {
    case "official-verified":
      return "Format officiel vérifié";
    case "official-partial":
      return "Format officiel partiellement vérifié";
    case "needs-review":
      return "Format à vérifier";
    case "internal":
      return "Examen interne Apple MDM Academy";
  }
}

/**
 * Cursor UI shell — data from Codex getExamDisplayMetadata only.
 * Does not recompute availability, official status, or bank deficits.
 */
export function ExamFormatPanels({ metadata }: Props) {
  if (!metadata) return null;

  const { official, simulation } = metadata;
  const showOfficialDetails = official.verificationStatus !== "internal";
  const fullSimulationLabel = simulation.fullSimulationAvailable
    ? `${simulation.targetQuestionCount ?? simulation.effectiveQuestionCount ?? "—"} questions`
    : "Simulation complète indisponible";

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-2">
      <section
        className="rounded-2xl border border-border-light bg-surface px-5 py-4"
        aria-labelledby="exam-official-format-heading"
        data-testid="exam-official-panel"
      >
        <h2 id="exam-official-format-heading" className="text-sm font-semibold text-ink">
          {verificationLabel(official.verificationStatus)}
        </h2>
        {official.verificationStatus === "official-partial" && (
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
            Certaines informations ne sont pas publiées ou doivent être confirmées.
          </p>
        )}
        {official.verificationStatus === "official-verified" && (
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
            Référence éditeur associée — durées, volumes et barèmes issus du registre d’examens sourcé.
          </p>
        )}
        {official.verificationStatus === "internal" && (
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
            Format interne Apple MDM Academy — ce n’est pas une certification officielle éditeur.
          </p>
        )}
        {official.verificationStatus === "needs-review" && (
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
            Les informations officielles doivent encore être confirmées avant affichage comme format vérifié.
          </p>
        )}

        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">Nom</dt>
            <dd className="mt-0.5 font-medium text-ink">{official.officialName}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">Fournisseur</dt>
            <dd className="mt-0.5 text-ink-secondary">{official.vendor}</dd>
          </div>
          {showOfficialDetails && (
            <>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">
                  Durée officielle
                </dt>
                <dd className="mt-0.5 text-ink-secondary">{official.durationLabel}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">
                  Questions officielles
                </dt>
                <dd className="mt-0.5 text-ink-secondary">{official.questionCountLabel}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">
                  Seuil officiel
                </dt>
                <dd className="mt-0.5 text-ink-secondary">{official.passingScoreLabel}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">Types</dt>
                <dd className="mt-0.5 text-ink-secondary">{official.questionTypesLabel}</dd>
              </div>
            </>
          )}
        </dl>

        {showOfficialDetails && official.sources.length > 0 && (
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
        {showOfficialDetails && official.verifiedAt && (
          <p className="mt-2 text-xs text-ink-tertiary">Vérifié le {official.verifiedAt}.</p>
        )}
        <p className="mt-2 text-xs text-ink-tertiary" data-testid="exam-codex-disclaimer">
          {metadata.disclaimer}
        </p>
      </section>

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
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">Disponibilité</dt>
            <dd className="mt-0.5 font-medium text-ink">{fullSimulationLabel}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">
              Questions disponibles
            </dt>
            <dd className="mt-0.5 font-medium text-ink">
              {simulation.availableQuestionCount ?? "—"}
              {simulation.targetQuestionCount != null
                ? ` sur une cible de ${simulation.targetQuestionCount}`
                : " questions uniques"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">Durée interne</dt>
            <dd className="mt-0.5 font-medium text-ink">
              {simulation.durationMinutes ? `${simulation.durationMinutes} min` : "Non configurée"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">Seuil interne</dt>
            <dd className="mt-0.5 font-medium text-ink">{simulation.passingScore}%</dd>
          </div>
        </dl>
        {simulation.warning && (
          <p
            className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900"
            data-testid="exam-bank-warning"
          >
            {simulation.warning}
          </p>
        )}
        {simulation.trainingAvailable && (
          <p className="mt-3 text-xs text-ink-tertiary" data-testid="exam-training-available">
            Entraînement limité disponible.
          </p>
        )}
      </section>
    </div>
  );
}
