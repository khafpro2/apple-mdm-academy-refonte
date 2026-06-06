import { courses } from "@/lib/data/courses";
import { getFlatLessons } from "@/lib/course/helpers";
import { getLessonContent } from "@/lib/data/lesson-content";
import { getProModuleLessonContent } from "@/lib/data/pro-modules/lesson-content";
import { getAdvancedLessonContent } from "@/lib/data/advanced-tracks/lesson-content";
import { getAltMdmLessonContent } from "@/lib/data/alternative-mdm-tracks/lesson-content";
import { getCustomLesson } from "@/lib/data/lessons/custom-lessons";
import { labs } from "@/lib/labs";
import { academyVideos } from "@/lib/data/videos";
import { academyResources } from "@/src/lib/resources";
import { quizzes, getExams } from "@/lib/data/quizzes";
import { runQuizQualityAudit } from "@/lib/quiz/run-audit";
import { commercialCertificationPaths } from "@/lib/data/commercial-certification-paths";
import { trackCertificates } from "@/lib/certifications";
import { getLabsByTrack } from "@/lib/labs";
import { isGeneratedLabSlug } from "@/lib/data/alternative-mdm-tracks/lab-factory";
import { allAltMdmModules } from "@/lib/data/alternative-mdm-tracks/module-definitions";
import {
  type ContentAuditItem,
  type ContentCompleteness,
  aggregateScore,
  countByStatus,
} from "@/lib/audit/content-status";
import { runScreenshotAudit, type ScreenshotAuditReport } from "@/lib/audit/screenshot-audit";
import type { Lab, LessonContent } from "@/lib/types";

const GENERIC_MARKERS = [
  /placeholder/i,
  /à ajouter/i,
  /Bienvenue dans le module/i,
  /Exercice pratique guidé/i,
  /Module expert «/,
  /TCO placeholder/i,
  /€€€/,
];

function hasGenericMarker(text: string): boolean {
  return GENERIC_MARKERS.some((re) => re.test(text));
}

function theoryCharCount(content: LessonContent): number {
  return content.theory.reduce((n, t) => n + t.body.join(" ").length, 0);
}

function detectLessonSource(slug: string, courseSlug: string): string {
  if (getCustomLesson(courseSlug, slug)) return "premium-custom";
  if (getProModuleLessonContent(slug)) return "pro-module";
  if (getAdvancedLessonContent(slug)) return isAdvancedCustomTheory(slug) ? "expert-handcrafted" : "expert-template";
  if (getAltMdmLessonContent(slug)) return isAltCustomTheory(slug) ? "alt-handcrafted" : "alt-template";
  return "topic-generated";
}

function isAdvancedCustomTheory(_slug: string): boolean {
  return true;
}

function isAltCustomTheory(slug: string): boolean {
  return allAltMdmModules.some((m) => m.slug === slug);
}

function scoreLessonContent(content: LessonContent, source: string): { score: number; issues: string[] } {
  const issues: string[] = [];
  let score = 100;

  const chars = theoryCharCount(content);
  if (chars < 400) {
    issues.push("Texte théorique trop court");
    score -= 25;
  } else if (chars < 900) {
    issues.push("Contenu partiel — approfondir théorie");
    score -= 12;
  }

  if (content.objectives.length < 3) {
    issues.push("Objectifs insuffisants");
    score -= 10;
  }
  if (content.steps.length < 3) {
    issues.push("Étapes pratiques insuffisantes");
    score -= 10;
  }
  if (content.troubleshooting.length < 2) {
    issues.push("Section dépannage incomplète");
    score -= 8;
  }
  if (content.screenshots.length === 0) {
    issues.push("Aucune capture d'écran");
    score -= 15;
  }

  const allText = [
    ...content.objectives,
    ...content.theory.flatMap((t) => t.body),
    ...content.steps.map((s) => s.description),
  ].join(" ");

  if (hasGenericMarker(allText)) {
    issues.push("Contenu générique ou placeholder détecté");
    score -= 20;
  }

  if (source.includes("template") || source === "topic-generated") {
    issues.push(`Source ${source} — enrichissement recommandé`);
    score -= 15;
  }

  return { score: Math.max(0, score), issues };
}

function lessonStatus(score: number, source: string, issues: string[]): ContentCompleteness {
  if (issues.some((i) => i.includes("placeholder"))) return "placeholder";
  if (score >= 85 && (source === "premium-custom" || source === "expert-handcrafted" || source === "alt-handcrafted"))
    return "complet";
  if (score >= 75) return "partiellement complet";
  if (score >= 50) return "à améliorer";
  if (score < 30) return "vide";
  return "placeholder";
}

export function auditLessons(): ContentAuditItem[] {
  const items: ContentAuditItem[] = [];

  for (const course of courses) {
    const flat = getFlatLessons(course);
    for (const item of flat) {
      const content = getLessonContent(
        course,
        course.modules[item.moduleIndex]!,
        item.lesson,
        item.globalIndex,
        flat.length
      );
      const source = detectLessonSource(item.lesson.slug, course.slug);
      const { score, issues } = scoreLessonContent(content, source);
      items.push({
        id: `${course.slug}/${item.lesson.slug}`,
        type: "lesson",
        title: item.lesson.title,
        trackSlug: course.trackSlug,
        status: lessonStatus(score, source, issues),
        score,
        issues,
        meta: { source, theoryChars: theoryCharCount(content), module: item.moduleTitle },
      });
    }
  }
  return items;
}

function scoreLab(lab: Lab): { score: number; issues: string[]; status: ContentCompleteness } {
  const issues: string[] = [];
  let score = 100;

  if (!lab.objective || lab.objective.length < 20) {
    issues.push("Objectif manquant ou trop court");
    score -= 20;
  }
  if (lab.prerequisites.length < 2) {
    issues.push("Prérequis insuffisants");
    score -= 10;
  }
  if (lab.steps.length < 4) {
    issues.push("Moins de 4 étapes");
    score -= 15;
  }
  for (const step of lab.steps) {
    if (!step.expectedResult || step.expectedResult.length < 10) {
      issues.push(`Étape « ${step.title} » sans résultat attendu clair`);
      score -= 5;
      break;
    }
  }

  const text = [lab.description, lab.objective, ...lab.steps.map((s) => s.instruction)].join(" ");
  const enrichedFactory =
    isGeneratedLabSlug(lab.slug) &&
    (text.toLowerCase().includes("scénario entreprise") || text.toLowerCase().includes("runbook"));

  if (hasGenericMarker(text)) {
    issues.push("Lab générique — ajouter contexte entreprise");
    score -= 25;
  } else if (isGeneratedLabSlug(lab.slug) && !enrichedFactory) {
    issues.push("Lab factory — enrichir scénario entreprise");
    score -= 15;
  }
  if (!text.toLowerCase().includes("pilote") && !text.toLowerCase().includes("entreprise")) {
    issues.push("Contexte entreprise faible");
    score -= 10;
  }

  score = Math.max(0, score);
  let status: ContentCompleteness = "complet";
  if (isGeneratedLabSlug(lab.slug) && !enrichedFactory) status = "placeholder";
  else if (score >= 80) status = "complet";
  else if (score >= 65) status = "partiellement complet";
  else if (score >= 45) status = "à améliorer";
  else status = "placeholder";

  return { score, issues, status };
}

export function auditLabs(): ContentAuditItem[] {
  return labs.map((lab) => {
    const { score, issues, status } = scoreLab(lab);
    return {
      id: lab.slug,
      type: "lab",
      title: lab.title,
      trackSlug: lab.trackSlug,
      status,
      score,
      issues,
      meta: { steps: lab.steps.length, level: lab.level },
    };
  });
}

export function auditVideos(): ContentAuditItem[] {
  return academyVideos.map((v) => {
    const issues: string[] = [];
    let score = 100;

    if (v.heygen.status !== "ready") {
      issues.push(`Vidéo HeyGen en statut « ${v.heygen.status} »`);
      score -= 30;
    }
    if (v.heygen.script.includes("Bienvenue dans le module") && !v.heygen.script.includes("Objectifs pédagogiques")) {
      issues.push("Script template générique");
      score -= 25;
    }
    if (!v.heygen.script.includes("Objectifs pédagogiques") && !v.heygen.script.includes("Scénario entreprise")) {
      issues.push("Script sans objectifs ni scénario entreprise");
      score -= 15;
    }
    if (!v.relatedLabSlug) {
      issues.push("Pas de lab associé");
      score -= 10;
    }
    if (v.durationSeconds < 60) {
      issues.push("Durée très courte");
      score -= 10;
    }
    if (v.chapters.length < 2) {
      issues.push("Chapitrage pédagogique insuffisant");
      score -= 8;
    }

    score = Math.max(0, score);
    const status: ContentCompleteness =
      score >= 85 ? "complet" : score >= 65 ? "partiellement complet" : score >= 45 ? "à améliorer" : "placeholder";

    return {
      id: v.slug,
      type: "video",
      title: v.title,
      trackSlug: v.trackSlug,
      status,
      score,
      issues,
      meta: { duration: v.duration, heygenStatus: v.heygen.status, relatedLab: v.relatedLabSlug ?? "" },
    };
  });
}

export function auditResources(): ContentAuditItem[] {
  return academyResources.map((r) => {
    const issues: string[] = [];
    let score = 100;
    const itemCount = r.sections.reduce((n, s) => n + s.items.length, 0);

    if (itemCount < 5) {
      issues.push("Peu d'éléments dans la ressource");
      score -= 20;
    }
    if (r.description.includes("Checklist validation") && r.sections.length === 3) {
      issues.push("Ressource auto-générée (template checklist)");
      score -= 25;
    }
    if (!r.relatedLabSlug && !r.relatedCourseSlug) {
      issues.push("Pas de lien cours/lab");
      score -= 10;
    }

    score = Math.max(0, score);
    const status: ContentCompleteness =
      score >= 80 ? "complet" : score >= 60 ? "partiellement complet" : score >= 40 ? "à améliorer" : "placeholder";

    return {
      id: r.slug,
      type: "resource",
      title: r.title,
      trackSlug: r.relatedCourseSlug,
      status,
      score,
      issues,
      meta: { category: r.category, items: itemCount },
    };
  });
}

export function auditExams(): ContentAuditItem[] {
  const quizAudit = runQuizQualityAudit();
  return getExams().map((exam) => {
    const poolResult = quizAudit.runtime.quizResults.find((r) => r.quizSlug === exam.slug);
    const score = poolResult?.qualityScore ?? 70;
    const issues = poolResult?.issues.slice(0, 5).map((i) => i.message) ?? [];
    return {
      id: exam.slug,
      type: "exam",
      title: exam.title,
      trackSlug: exam.trackSlug,
      status: score >= 85 ? "complet" : score >= 65 ? "partiellement complet" : "à améliorer",
      score,
      issues,
      meta: { questionCount: exam.examQuestionCount ?? exam.questions.length },
    };
  });
}

export type CertificationAuditItem = {
  slug: string;
  title: string;
  trackSlug: string;
  modulesLinked: number;
  labsLinked: number;
  examsLinked: number;
  score: number;
  issues: string[];
  status: ContentCompleteness;
};

const TARGET_CERTS = [
  "apple-certified-it-professional",
  "jamf-100",
  "jamf-200",
  "intune-apple-specialist",
  "apple-security-expert",
];

export function auditCertifications(): CertificationAuditItem[] {
  return TARGET_CERTS.map((slug) => {
    const path = commercialCertificationPaths.find((p) => p.slug === slug);
    if (!path) {
      return {
        slug,
        title: slug,
        trackSlug: "",
        modulesLinked: 0,
        labsLinked: 0,
        examsLinked: 0,
        score: 0,
        issues: ["Parcours certification introuvable"],
        status: "vide" as ContentCompleteness,
      };
    }

    const trackCourses = courses.filter((c) => c.trackSlug === path.trackSlug);
    const lessonsLinked = trackCourses.reduce(
      (n, c) => n + c.modules.reduce((m, mod) => m + mod.lessons.length, 0),
      0
    );
    const modulesLinked = lessonsLinked;
    const labsLinked = getLabsByTrack(path.trackSlug).length;
    const examsLinked = getExams().filter((e) => e.trackSlug === path.trackSlug).length;
    const trackCert = trackCertificates.find((t) => t.trackSlug === path.trackSlug);

    const issues: string[] = [];
    let score = 100;

    if (modulesLinked === 0) {
      issues.push("Aucun module cours lié au track");
      score -= 40;
    }
    if (labsLinked < path.labsCount) {
      issues.push(`Labs insuffisants (${labsLinked}/${path.labsCount} attendus)`);
      score -= 15;
    }
    if (examsLinked === 0 && !path.examRouteSlug) {
      issues.push("Examen blanc non lié");
      score -= 25;
    }
    if (!trackCert) {
      issues.push("Certificat track non défini dans trackCertificates");
      score -= 10;
    }

    score = Math.max(0, score);
    const status: ContentCompleteness =
      score >= 90 ? "complet" : score >= 70 ? "partiellement complet" : "à améliorer";

    return {
      slug,
      title: path.title,
      trackSlug: path.trackSlug,
      modulesLinked,
      labsLinked,
      examsLinked,
      score,
      issues,
      status,
    };
  });
}

export type PedagogicalAuditReport = {
  generatedAt: string;
  counts: {
    modules: number;
    lessons: number;
    labs: number;
    videos: number;
    quizzes: number;
    questions: number;
    resources: number;
    exams: number;
  };
  scores: {
    global: number;
    lessons: number;
    labs: number;
    videos: number;
    resources: number;
    exams: number;
    certifications: number;
    screenshots: number;
  };
  lessons: ContentAuditItem[];
  labs: ContentAuditItem[];
  videos: ContentAuditItem[];
  resources: ContentAuditItem[];
  exams: ContentAuditItem[];
  certifications: CertificationAuditItem[];
  screenshots: ScreenshotAuditReport;
  lessonStatusCounts: Record<ContentCompleteness, number>;
  labStatusCounts: Record<ContentCompleteness, number>;
};

export function runPedagogicalAudit(): PedagogicalAuditReport {
  const lessons = auditLessons();
  const labItems = auditLabs();
  const videos = auditVideos();
  const resources = auditResources();
  const exams = auditExams();
  const certifications = auditCertifications();
  const screenshots = runScreenshotAudit();

  const quizList = quizzes.filter((q) => q.type === "quiz");
  const questionCount = quizzes.reduce((n, q) => n + q.questions.length, 0);
  const moduleCount = courses.reduce((n, c) => n + c.modules.length, 0);

  const scores = {
    lessons: aggregateScore(lessons),
    labs: aggregateScore(labItems),
    videos: aggregateScore(videos),
    resources: aggregateScore(resources),
    exams: aggregateScore(exams),
    certifications: aggregateScore(
      certifications.map((c) => ({
        id: c.slug,
        type: "lesson" as const,
        title: c.title,
        status: c.status,
        score: c.score,
        issues: c.issues,
      }))
    ),
    screenshots: screenshots.score,
    global: 0,
  };

  scores.global = Math.round(
    scores.lessons * 0.25 +
      scores.labs * 0.15 +
      scores.exams * 0.2 +
      scores.videos * 0.1 +
      scores.resources * 0.1 +
      scores.certifications * 0.1 +
      scores.screenshots * 0.1
  );

  return {
    generatedAt: new Date().toISOString(),
    counts: {
      modules: moduleCount,
      lessons: lessons.length,
      labs: labItems.length,
      videos: videos.length,
      quizzes: quizList.length,
      questions: questionCount,
      resources: resources.length,
      exams: exams.length,
    },
    scores,
    lessons,
    labs: labItems,
    videos,
    resources,
    exams,
    certifications,
    screenshots,
    lessonStatusCounts: countByStatus(lessons),
    labStatusCounts: countByStatus(labItems),
  };
}
