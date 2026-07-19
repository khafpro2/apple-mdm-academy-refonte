/**
 * Lightweight Node assertions for presentational mapping (no timer/scoring).
 * Run: npx tsx tests/unit/exam-format-panels-props.test.ts
 */
import assert from "node:assert/strict";
import { mapExamDisplayToPanelProps } from "../../components/exams/map-exam-display-to-panels";
import type { ExamDisplayMetadata } from "../../lib/exams/ui-metadata-adapter";

function baseMeta(
  overrides: {
    official?: Partial<ExamDisplayMetadata["official"]>;
    simulation?: Partial<ExamDisplayMetadata["simulation"]>;
  } = {}
): ExamDisplayMetadata {
  const official: ExamDisplayMetadata["official"] = {
    officialName: "Test Exam",
    certification: "Test Cert",
    vendor: "Jamf",
    durationLabel: "90 min",
    questionCountLabel: "environ 60 questions",
    passingScoreLabel: "80%",
    questionTypesLabel: "choix unique",
    verificationStatus: "official-verified",
    verifiedAt: "2026-01-01",
    sources: [
      {
        title: "Docs",
        publisher: "Jamf",
        url: "https://example.com",
        checkedAt: "2026-01-01",
      },
    ],
    notes: [],
    ...overrides.official,
  };

  const simulation: ExamDisplayMetadata["simulation"] = {
    durationMinutes: 90,
    availableQuestionCount: 60,
    targetQuestionCount: 60,
    effectiveQuestionCount: 60,
    passingScore: 80,
    providerLabel: "Jamf",
    modes: ["training", "simulation"],
    bankStatus: "complete",
    fullSimulationAvailable: true,
    trainingAvailable: false,
    warning: null,
    ...overrides.simulation,
  };

  return {
    routeSlug: "test",
    official,
    simulation,
    officialPanel: {
      title: official.officialName,
      provider: official.vendor,
      duration: 90,
      questionCount: 60,
      passingScore: 80,
      verificationStatus: official.verificationStatus,
      verifiedAt: official.verifiedAt,
      sources: official.sources,
    },
    simulationPanel: {
      mode: "simulation",
      duration: 90,
      availableQuestions: 60,
      targetQuestions: 60,
      passingScore: 80,
      fullSimulationAvailable: true,
      warning: null,
    },
    disclaimer: "unused by Cursor panels",
  };
}

// null metadata
{
  const props = mapExamDisplayToPanelProps(null);
  assert.equal(props.official, null);
  assert.equal(props.simulation, null);
}

// full official
{
  const props = mapExamDisplayToPanelProps(baseMeta());
  assert.equal(props.official?.status, "Format officiel vérifié");
  assert.equal(props.official?.title, "Test Exam");
  assert.equal(props.official?.showOfficialDetails, true);
  assert.equal(props.simulation?.duration, "90 min");
  assert.equal(props.simulation?.fullSimulationAvailable, true);
}

// partial / empty labels → undefined (no empty strings)
{
  const props = mapExamDisplayToPanelProps(
    baseMeta({
      official: {
        officialName: "",
        durationLabel: "",
        passingScoreLabel: "",
        verificationStatus: "official-partial",
        sources: [],
        verifiedAt: null,
      },
    })
  );
  assert.equal(props.official?.title, undefined);
  assert.equal(props.official?.duration, undefined);
  assert.equal(props.official?.passingScore, undefined);
  assert.equal(props.official?.verifiedAt, undefined);
  assert.equal(props.official?.status, "Format officiel partiellement vérifié");
  assert.deepEqual(props.official?.sources, []);
}

// needs-review
{
  const props = mapExamDisplayToPanelProps(
    baseMeta({ official: { verificationStatus: "needs-review" } })
  );
  assert.equal(props.official?.status, "Format à vérifier");
}

// internal — hide official details
{
  const props = mapExamDisplayToPanelProps(
    baseMeta({ official: { verificationStatus: "internal" } })
  );
  assert.equal(props.official?.showOfficialDetails, false);
  assert.match(props.official?.status ?? "", /interne/i);
}

// no duration / incomplete bank
{
  const props = mapExamDisplayToPanelProps(
    baseMeta({
      simulation: {
        durationMinutes: 0,
        availableQuestionCount: 10,
        targetQuestionCount: 80,
        fullSimulationAvailable: false,
        trainingAvailable: true,
        bankStatus: "incomplete",
        warning: "Banque insuffisante",
      },
    })
  );
  assert.equal(props.simulation?.duration, undefined);
  assert.equal(props.simulation?.availableQuestions, 10);
  assert.equal(props.simulation?.fullSimulationAvailable, false);
  assert.equal(props.simulation?.warning, "Banque insuffisante");
}

console.log("exam-format-panels-props: all assertions passed");
