"use client";

import { getLabSimulation } from "@/lib/labs/simulator";

type Props = {
  labSlug: string;
  stepId: string;
};

export function LabSimulatorPanel({ labSlug, stepId }: Props) {
  const sim = getLabSimulation(labSlug, stepId);
  if (!sim) return null;

  return (
    <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
        Sandbox simulé — pas d&apos;instance Jamf/Intune requise
      </p>
      <p className="mt-1 text-sm font-medium text-indigo-950">{sim.title}</p>
      {sim.command && (
        <pre className="mt-3 overflow-x-auto rounded-lg bg-ink p-3 text-xs text-green-300">
          {sim.command}
        </pre>
      )}
      <pre className="mt-2 overflow-x-auto rounded-lg bg-white/80 p-3 text-xs text-ink-secondary">
        {sim.output}
      </pre>
      <p className="mt-2 text-xs text-indigo-700">
        En production, reproduisez ces résultats sur votre tenant pilote.
      </p>
    </div>
  );
}
