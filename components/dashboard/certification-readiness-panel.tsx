import Link from "next/link";
import { ProgressBar, Badge } from "@/components/ui";
import { evaluateAcitpReadiness } from "@/lib/data/acitp/readiness";
import { ACITP_PASSING_SCORE } from "@/lib/data/acitp/domains";

type Props = {
  completedLessonSlugs: string[];
  completedLabSlugs: string[];
  examScores: Map<string, number>;
};

function getBestExamScore(scores: Map<string, number>, slug: string): number | null {
  return scores.has(slug) ? scores.get(slug)! : null;
}

function readinessFromTrack(
  label: string,
  href: string,
  lessonsPct: number,
  labsPct: number,
  examScore: number | null,
  passingScore: number
) {
  const examPct = examScore !== null && examScore >= passingScore ? 100 : examScore ?? 0;
  const overall = Math.round(lessonsPct * 0.35 + labsPct * 0.35 + examPct * 0.3);
  return { label, href, overall, lessonsPct, labsPct, examScore, passingScore };
}

export function CertificationReadinessPanel({
  completedLessonSlugs,
  completedLabSlugs,
  examScores,
}: Props) {
  const lessonSet = new Set(completedLessonSlugs);
  const labSet = new Set(completedLabSlugs);

  const acitp = evaluateAcitpReadiness(
    lessonSet,
    labSet,
    getBestExamScore(examScores, "examen-apple-it-pro")
  );

  const items = [
    readinessFromTrack(
      "Apple IT Professional",
      "/certifications/apple-certified-it-professional",
      acitp.lessonsPercent,
      acitp.labsPercent,
      acitp.examScore,
      ACITP_PASSING_SCORE
    ),
    readinessFromTrack(
      "Jamf 100",
      "/examens/jamf-100",
      examScores.has("examen-jamf-100-blanc") ? 70 : 20,
      labSet.has("jamf-smart-groups") ? 80 : 30,
      getBestExamScore(examScores, "examen-jamf-100-blanc"),
      75
    ),
    readinessFromTrack(
      "Jamf 200",
      "/examens/jamf-200",
      40,
      labSet.has("jamf-patch-management") ? 70 : 25,
      getBestExamScore(examScores, "examen-jamf-200"),
      75
    ),
    readinessFromTrack(
      "Intune Apple",
      "/examens/intune-apple",
      lessonSet.has("abm-intune") ? 75 : 35,
      labSet.has("abm-intune") ? 85 : 40,
      getBestExamScore(examScores, "examen-intune-apple"),
      80
    ),
  ];

  return (
    <section className="mb-8 rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-lg font-bold text-ink">Certification Readiness</h2>
        <Link href="/examens/preparation-report" className="text-sm font-semibold text-accent hover:underline">
          Rapport préparation →
        </Link>
      </div>
      <div className="mt-4 space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2 text-sm">
              <Link href={item.href} className="font-medium text-ink hover:text-accent">
                {item.label}
              </Link>
              <span className="text-ink-tertiary">
                {item.overall} % · Cours {item.lessonsPct} % · Labs {item.labsPct} %
                {item.examScore !== null ? ` · Exam ${item.examScore} %` : " · Exam —"}
              </span>
            </div>
            <ProgressBar value={item.overall} />
          </div>
        ))}
      </div>
      {acitp.eligibleForCertificate && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4">
          <Badge variant="dark">Ready</Badge>
          <span className="text-sm text-green-800">Apple IT Professional Ready — certificat disponible</span>
          {/* PDF download — href API, not a page route */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/api/certificates/acitp-ready"
            className="text-sm font-semibold text-accent hover:underline"
          >
            Télécharger PDF →
          </a>
        </div>
      )}
    </section>
  );
}
