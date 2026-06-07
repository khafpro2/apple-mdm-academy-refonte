import { labs } from "@/lib/labs";
import { courses } from "@/lib/data/courses";
import { getFlatLessons } from "@/lib/course/helpers";
import { getQuiz } from "@/lib/data/quizzes";
import { videoScripts } from "@/src/lib/video-scripts";
import { productionVideoStoryboards } from "@/src/lib/video-storyboard-modules";
import { jamfTrainingStoryboards } from "@/lib/data/jamf/jamf-training-storyboards";
import { jamfFundamentalsPremiumStoryboards } from "@/lib/data/jamf/jamf-fundamentals-premium-storyboards";
import { getJamfFundamentalsResource } from "@/lib/data/jamf/jamf-fundamentals-premium-resources";
import {
  JAMF_FUNDAMENTALS_MODULES,
  JAMF_PILOT_VIDEOS,
  JAMF_SCREENSHOT_PLACEHOLDERS,
  type JamfContentStatus,
  type JamfFundamentalsModule,
} from "@/lib/data/jamf/jamf-fundamentals-premium";
import { JAMF_FUNDAMENTALS_PREMIUM_CONTENT } from "@/lib/data/jamf/jamf-fundamentals-premium-content";
import { existsSync } from "node:fs";
import path from "node:path";

export type JamfContentStatusRow = {
  moduleId: string;
  order: number;
  title: string;
  courseStatus: JamfContentStatus;
  quizStatus: JamfContentStatus;
  labStatus: JamfContentStatus;
  scriptStatus: JamfContentStatus;
  storyboardStatus: JamfContentStatus;
  screenshotStatus: JamfContentStatus;
  videoStatus: JamfContentStatus;
  pdfStatus: JamfContentStatus;
  overallStatus: JamfContentStatus;
  lessonSlug: string;
  videoSlug: string;
  quizSlug: string;
  labSlug: string;
  resourceSlug: string;
  quizQuestionCount: number;
};

export type JamfContentStatusReport = {
  generatedAt: string;
  totalModules: number;
  doneCount: number;
  inProgressCount: number;
  todoCount: number;
  jamf100Readiness: number;
  jamf200Readiness: number;
  pilotVideos: Array<{ slug: string; script: JamfContentStatus; storyboard: JamfContentStatus; quiz: JamfContentStatus }>;
  rows: JamfContentStatusRow[];
};

const storyboardSlugs = new Set([
  ...productionVideoStoryboards.map((s) => s.slug),
  ...jamfTrainingStoryboards.map((s) => s.slug),
  ...jamfFundamentalsPremiumStoryboards.map((s) => s.slug),
]);

const videoScriptSlugs = new Set(videoScripts.map((v) => v.slug));

function lessonExists(slug: string): boolean {
  return courses.some((c) => getFlatLessons(c).some((f) => f.lesson.slug === slug));
}

function screenshotExists(slug: string): boolean {
  const file = path.join(process.cwd(), "public/video-assets/screenshots", `${slug}.webp`);
  return existsSync(file);
}

function statusFromFlags(flags: boolean[]): JamfContentStatus {
  const done = flags.filter(Boolean).length;
  if (done === flags.length) return "done";
  if (done === 0) return "todo";
  return "in-progress";
}

function analyzeModule(mod: JamfFundamentalsModule): JamfContentStatusRow {
  const content = JAMF_FUNDAMENTALS_PREMIUM_CONTENT[mod.id];
  const courseOk =
    lessonExists(mod.lessonSlug) &&
    content.introduction.length >= 2 &&
    content.heygenScript.length > 100;
  const quiz = getQuiz(mod.quizSlug);
  const quizOk = (quiz?.questions.length ?? 0) >= 5;
  const labOk = labs.some((l) => l.slug === mod.labSlug);
  const scriptOk = videoScriptSlugs.has(mod.videoSlug) && content.heygenScript.length > 200;
  const storyboardOk = storyboardSlugs.has(mod.storyboardSlug);
  const screenshotOk = screenshotExists(mod.screenshotSlug);
  const videoOk = scriptOk && storyboardOk;
  const pdfOk = !!getJamfFundamentalsResource(mod.resourceSlug);

  const flags = [courseOk, quizOk, labOk, scriptOk, storyboardOk, screenshotOk, videoOk, pdfOk];
  const overallStatus = statusFromFlags(flags);

  return {
    moduleId: mod.id,
    order: mod.order,
    title: mod.title,
    courseStatus: courseOk ? "done" : content.introduction.length ? "in-progress" : "todo",
    quizStatus: quizOk ? "done" : quiz ? "in-progress" : "todo",
    labStatus: labOk ? "done" : "todo",
    scriptStatus: scriptOk ? "done" : content.heygenScript.length > 50 ? "in-progress" : "todo",
    storyboardStatus: storyboardOk ? "done" : "todo",
    screenshotStatus: screenshotOk ? "done" : "todo",
    videoStatus: videoOk ? "done" : scriptOk || storyboardOk ? "in-progress" : "todo",
    pdfStatus: pdfOk ? "done" : "todo",
    overallStatus,
    lessonSlug: mod.lessonSlug,
    videoSlug: mod.videoSlug,
    quizSlug: mod.quizSlug,
    labSlug: mod.labSlug,
    resourceSlug: mod.resourceSlug,
    quizQuestionCount: quiz?.questions.length ?? 0,
  };
}

function computeReadiness(rows: JamfContentStatusRow[], level: "Jamf 100" | "Jamf 200"): number {
  const filtered = JAMF_FUNDAMENTALS_MODULES.filter((m) =>
    level === "Jamf 100" ? m.certificationLevel !== "Jamf 200" : m.certificationLevel === "Jamf 200" || m.trackSlug === "jamf-200"
  );
  const moduleIds = new Set(filtered.map((m) => m.id));
  const relevant = rows.filter((r) => moduleIds.has(r.moduleId as typeof filtered[number]["id"]));
  if (!relevant.length) return 0;
  const score = relevant.reduce((acc, row) => {
    const flags = [
      row.courseStatus === "done",
      row.quizStatus === "done",
      row.labStatus === "done",
      row.scriptStatus === "done",
      row.storyboardStatus === "done",
      row.pdfStatus === "done",
    ];
    return acc + (flags.filter(Boolean).length / flags.length) * 100;
  }, 0);
  return Math.round(score / relevant.length);
}

export function runJamfContentStatusAudit(): JamfContentStatusReport {
  const rows = JAMF_FUNDAMENTALS_MODULES.map(analyzeModule);
  const doneCount = rows.filter((r) => r.overallStatus === "done").length;
  const inProgressCount = rows.filter((r) => r.overallStatus === "in-progress").length;
  const todoCount = rows.filter((r) => r.overallStatus === "todo").length;

  const pilotVideos = JAMF_PILOT_VIDEOS.map((slug) => {
    const mod = JAMF_FUNDAMENTALS_MODULES.find((m) => m.videoSlug === slug);
    const quiz = mod ? getQuiz(mod.quizSlug) : undefined;
    return {
      slug,
      script: videoScriptSlugs.has(slug) ? "done" : ("todo" as JamfContentStatus),
      storyboard: storyboardSlugs.has(slug) ? "done" : ("todo" as JamfContentStatus),
      quiz: (quiz?.questions.length ?? 0) >= 5 ? "done" : quiz ? "in-progress" : ("todo" as JamfContentStatus),
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    totalModules: rows.length,
    doneCount,
    inProgressCount,
    todoCount,
    jamf100Readiness: computeReadiness(rows, "Jamf 100"),
    jamf200Readiness: computeReadiness(rows, "Jamf 200"),
    pilotVideos,
    rows,
  };
}

export { JAMF_SCREENSHOT_PLACEHOLDERS };
