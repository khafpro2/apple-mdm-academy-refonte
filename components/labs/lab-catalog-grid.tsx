"use client";

import type { Lab } from "@/lib/types";
import { Card, Badge, ButtonLink, ProgressBar } from "@/components/ui";
import { useLabProgressSummary } from "@/lib/labs/use-lab-progress";
import { STATUS_LABELS, STATUS_STYLES, TECHNOLOGY_STYLES } from "@/lib/labs/badges";

function LabCatalogCard({ lab, index }: { lab: Lab; index: number }) {
  const totalSteps = lab.steps.length;
  const { status, percent } = useLabProgressSummary(lab.slug, totalSteps);

  return (
    <Card hover className="flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge variant="accent">Lab {index + 1}</Badge>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[status]}`}
        >
          {STATUS_LABELS[status]}
        </span>
      </div>

      <span
        className={`mt-3 inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${TECHNOLOGY_STYLES[lab.technology]}`}
      >
        {lab.technology}
      </span>

      <h3 className="mt-3 text-lg font-bold text-ink">{lab.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-secondary">{lab.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-ink-tertiary">
        <span>{lab.level}</span>
        <span>·</span>
        <span>{lab.duration}</span>
      </div>

      {status !== "not_started" && (
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-ink-tertiary">
            <span>Progression</span>
            <span>{percent}%</span>
          </div>
          <ProgressBar value={percent} />
        </div>
      )}

      <ButtonLink href={`/labs/${lab.slug}`} size="sm" className="mt-6 w-full text-center">
        Accéder au Lab
      </ButtonLink>
    </Card>
  );
}

export function LabCatalogGrid({ labs }: { labs: Lab[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {labs.map((lab, index) => (
        <LabCatalogCard key={lab.slug} lab={lab} index={index} />
      ))}
    </div>
  );
}
