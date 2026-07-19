import { appleTrainingResources, getOfficialCertLinkForExamRoute } from "@/lib/data/official-cert-links";

type Props = {
  examRouteSlug: string;
  examTitle: string;
  /** From Codex `getExamDisplayMetadata(...).disclaimer` — single source. */
  disclaimer?: string | null;
};

export function ExamPrepDisclaimer({ examRouteSlug, examTitle, disclaimer }: Props) {
  const official = getOfficialCertLinkForExamRoute(examRouteSlug);

  return (
    <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
      <p className="font-semibold">Examen blanc — préparation uniquement</p>
      <p className="mt-2 leading-relaxed">
        « {examTitle} » est une <strong>simulation pédagogique</strong> Apple MDM Academy.
        Il ne remplace pas une certification officielle Pearson VUE, Jamf ou Microsoft.
      </p>
      {hasText(disclaimer) && (
        <p className="mt-3 leading-relaxed text-amber-950/90" data-testid="exam-independence-disclaimer">
          {disclaimer}
        </p>
      )}
      {official && (
        <p className="mt-3">
          Certification officielle associée :{" "}
          <a
            href={official.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-amber-900 underline hover:no-underline"
          >
            {official.label} ({official.provider})
          </a>
          {" — "}
          {official.note}
        </p>
      )}
      <p className="mt-3 text-xs text-amber-800">
        Le certificat PDF obtenu ici atteste votre réussite sur la plateforme, pas une certification vendor.
        Pour les certifications Apple, consultez Apple Training : examens via Pearson VUE / OnVUE, retake après{" "}
        {appleTrainingResources.retakeDelayDays} jours et {appleTrainingResources.maxAttempts} tentatives maximum.
        Les badges Apple officiels sont vérifiés dans Credly.
      </p>
    </div>
  );
}

function hasText(value: string | undefined | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
