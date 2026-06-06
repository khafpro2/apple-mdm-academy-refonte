import type { Question } from "@/lib/types";
import type { AcitpExamDomain } from "@/lib/data/acitp/domains";
import { ACITP_DOMAIN_LABELS } from "@/lib/data/acitp/domains";
import { ACITP_CURRICULUM } from "@/lib/data/acitp/curriculum";
import { ACITP_REQUIRED_LAB_SLUGS } from "@/lib/data/acitp/curriculum";
import { isAnswerCorrect, type UserAnswer } from "@/lib/quiz/scoring";

export type DomainScore = {
  domain: AcitpExamDomain;
  label: string;
  correct: number;
  total: number;
  percent: number;
};

export type PreparationReport = {
  overallScore: number;
  passed: boolean;
  strengths: string[];
  weaknesses: string[];
  domainScores: DomainScore[];
  recommendedModules: { title: string; href: string }[];
  recommendedLabs: { title: string; href: string }[];
};

const DOMAIN_MODULE_MAP: Partial<Record<AcitpExamDomain, string[]>> = {
  macos: ["macos-fundamentals", "finder", "dock", "spotlight"],
  abm: ["apple-business-manager"],
  security: ["security"],
  deployment: ["device-management", "apple-business-manager"],
  network: ["macos-fundamentals"],
  productivity: ["mail", "safari", "calendar", "notes"],
  troubleshooting: ["macos-fundamentals", "device-management"],
};

const LAB_TITLES: Record<string, string> = {
  "acitp-lab-01-mac-setup": "Configuration Mac neuf",
  "acitp-lab-03-filevault": "Sécurisation FileVault",
  "acitp-lab-09-mdm-enrollment": "Inscription MDM",
  "acitp-lab-10-macos-diagnostic": "Diagnostic macOS",
  "acitp-lab-02-enterprise-connect": "Connexion entreprise",
  "acitp-lab-08-managed-apple-id": "Managed Apple ID",
};

export function buildPreparationReport(
  questions: Question[],
  answers: Record<string, UserAnswer>,
  passingScore = 80
): PreparationReport {
  const byDomain = new Map<AcitpExamDomain, { correct: number; total: number }>();

  for (const q of questions) {
    const domain = (q.moduleLabel as AcitpExamDomain) ?? "macos";
    const entry = byDomain.get(domain) ?? { correct: 0, total: 0 };
    entry.total++;
    const ans = answers[q.id];
    if (ans !== undefined && isAnswerCorrect(q, ans)) entry.correct++;
    byDomain.set(domain, entry);
  }

  const domainScores: DomainScore[] = (
    Object.keys(ACITP_DOMAIN_LABELS) as AcitpExamDomain[]
  ).map((domain) => {
    const { correct, total } = byDomain.get(domain) ?? { correct: 0, total: 0 };
    return {
      domain,
      label: ACITP_DOMAIN_LABELS[domain],
      correct,
      total,
      percent: total ? Math.round((correct / total) * 100) : 0,
    };
  });

  const overallCorrect = domainScores.reduce((s, d) => s + d.correct, 0);
  const overallTotal = domainScores.reduce((s, d) => s + d.total, 0);
  const overallScore = overallTotal ? Math.round((overallCorrect / overallTotal) * 100) : 0;
  const passed = overallScore >= passingScore;

  const sorted = [...domainScores].sort((a, b) => a.percent - b.percent);
  const strengths = sorted
    .filter((d) => d.total > 0 && d.percent >= 80)
    .slice(-3)
    .reverse()
    .map((d) => `${d.label} (${d.percent} %)`);
  const weaknesses = sorted
    .filter((d) => d.total > 0 && d.percent < 70)
    .slice(0, 3)
    .map((d) => `${d.label} (${d.percent} %)`);

  const weakDomains = sorted.filter((d) => d.percent < 70).map((d) => d.domain);
  const moduleIds = new Set(
    weakDomains.flatMap((d) => DOMAIN_MODULE_MAP[d] ?? [])
  );

  const recommendedModules = ACITP_CURRICULUM.filter((m) => moduleIds.has(m.id)).map(
    (m) => ({
      title: m.title,
      href: `/certifications/apple-certified-it-professional#${m.id}`,
    })
  );

  const labSlugs =
    weakDomains.includes("security") || weakDomains.includes("deployment")
      ? ["acitp-lab-03-filevault", "acitp-lab-09-mdm-enrollment"]
      : weakDomains.includes("macos") || weakDomains.includes("troubleshooting")
        ? ["acitp-lab-01-mac-setup", "acitp-lab-10-macos-diagnostic"]
        : ["acitp-lab-02-enterprise-connect", "acitp-lab-08-managed-apple-id"];

  const recommendedLabs = [...new Set(labSlugs)].map((slug) => ({
    title: LAB_TITLES[slug] ?? slug,
    href: `/labs/${slug}`,
  }));

  if (recommendedModules.length === 0) {
    recommendedModules.push({
      title: "Parcours ACITP complet",
      href: "/certifications/apple-certified-it-professional",
    });
  }

  return {
    overallScore,
    passed,
    strengths,
    weaknesses,
    domainScores,
    recommendedModules,
    recommendedLabs,
  };
}

export { ACITP_REQUIRED_LAB_SLUGS };
