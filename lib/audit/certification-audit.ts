import { courses } from "@/lib/data/courses";
import { getFlatLessons } from "@/lib/course/helpers";
import { ACITP_CURRICULUM } from "@/lib/data/acitp/curriculum";
import { getAcitpBaseQuestionCount } from "@/lib/data/acitp/exam-pool";
import { commercialCertificationPaths } from "@/lib/data/commercial-certification-paths";
import { examQuestionCounts } from "@/lib/data/exams/pools";
import { labs } from "@/lib/labs";
import { quizzes, getExams } from "@/lib/data/quizzes";

export type ProgramCoverage = {
  program: string;
  slug: string;
  coveragePercent: number;
  items: { label: string; status: "ok" | "partial" | "missing" }[];
};

export type CertificationAuditReport = {
  generatedAt: string;
  globalCoverage: number;
  acitpModulesCovered: number;
  acitpModulesTotal: number;
  examQuestionCount: number;
  examBaseUnique: number;
  programs: ProgramCoverage[];
};

function lessonExists(slug: string): boolean {
  return courses.some((c) => getFlatLessons(c).some((f) => f.lesson.slug === slug));
}

function auditAcitp(): ProgramCoverage {
  const items = ACITP_CURRICULUM.map((mod) => {
    const lessonsOk = mod.lessonSlugs.filter(lessonExists).length;
    const labOk = mod.labSlug ? labs.some((l) => l.slug === mod.labSlug) : true;
    let status: "ok" | "partial" | "missing" = "missing";
    if (lessonsOk >= mod.lessonSlugs.length && labOk) status = "ok";
    else if (lessonsOk > 0 || labOk) status = "partial";
    return { label: mod.title, status };
  });
  const ok = items.filter((i) => i.status === "ok").length;
  const partial = items.filter((i) => i.status === "partial").length;
  const coverage = Math.round(((ok + partial * 0.5) / items.length) * 100);
  return { program: "Apple Certified IT Professional", slug: "apple-certified-it-professional", coveragePercent: coverage, items };
}

function auditJamf(): ProgramCoverage {
  const jamfTracks = ["jamf-100", "jamf-170", "jamf-200"];
  const items = jamfTracks.map((slug) => {
    const course = courses.find((c) => c.trackSlug === slug);
    const lessonCount = course ? getFlatLessons(course).length : 0;
    const trackLabs = labs.filter((l) => l.trackSlug === slug).length;
    const exam = getExams().find((e) => e.trackSlug === slug);
    const status =
      lessonCount >= 3 && trackLabs >= 1 && exam ? "ok" : lessonCount > 0 ? "partial" : "missing";
    return {
      label: course?.title ?? slug,
      status: status as "ok" | "partial" | "missing",
    };
  });
  const ok = items.filter((i) => i.status === "ok").length;
  const coverage = Math.round((ok / items.length) * 100);
  return { program: "Jamf Certification", slug: "jamf-100", coveragePercent: coverage, items };
}

function auditIntune(): ProgramCoverage {
  const intuneCourse = courses.find((c) => c.trackSlug === "intune-mac");
  const advanced = courses.find((c) => c.trackSlug === "intune-apple-advanced");
  const items = [
    {
      label: "Intune Mac fundamentals",
      status: (intuneCourse && getFlatLessons(intuneCourse).length >= 10
        ? "ok"
        : intuneCourse
          ? "partial"
          : "missing") as "ok" | "partial" | "missing",
    },
    {
      label: "Intune Apple Advanced",
      status: (advanced ? "partial" : "missing") as "ok" | "partial" | "missing",
    },
    {
      label: "Examen blanc Intune Apple",
      status: (getExams().some((e) => e.slug === "examen-intune-apple") ? "ok" : "missing") as
        | "ok"
        | "partial"
        | "missing",
    },
    {
      label: "Labs Intune Apple",
      status: (labs.filter((l) => l.trackSlug === "intune-mac").length >= 5
        ? "ok"
        : "partial") as "ok" | "partial" | "missing",
    },
  ];
  const ok = items.filter((i) => i.status === "ok").length;
  const partial = items.filter((i) => i.status === "partial").length;
  const coverage = Math.round(((ok + partial * 0.5) / items.length) * 100);
  return { program: "Intune Apple", slug: "intune-apple-specialist", coveragePercent: coverage, items };
}

export function runCertificationAudit(): CertificationAuditReport {
  const programs = [auditAcitp(), auditJamf(), auditIntune()];
  const globalCoverage = Math.round(
    programs.reduce((s, p) => s + p.coveragePercent, 0) / programs.length
  );
  const acitpOk = programs[0]!.items.filter((i) => i.status === "ok").length;

  return {
    generatedAt: new Date().toISOString(),
    globalCoverage,
    acitpModulesCovered: acitpOk,
    acitpModulesTotal: ACITP_CURRICULUM.length,
    examQuestionCount: examQuestionCounts["examen-apple-it-pro"] ?? 0,
    examBaseUnique: getAcitpBaseQuestionCount(),
    programs,
  };
}

export function getCommercialPathsForAudit() {
  return commercialCertificationPaths;
}
