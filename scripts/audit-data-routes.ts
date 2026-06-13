/**
 * Valide la cohérence des slugs de données (parcours, examens, labs).
 * Usage: npm run check:data-routes
 */
import { tracks } from "../lib/data/tracks";
import { courses } from "../lib/data/courses";
import { quizzes } from "../lib/data/quizzes";
import { labs } from "../lib/labs";
import { examRouteToQuizSlug, getExamRouteSlugs } from "../lib/data/exams/pools";
import { getExamRouteFromQuizSlug } from "../lib/data/exams/exam-routes";
import { certificationPaths } from "../lib/data/pro-modules/paths";
import { getResourceSlugs } from "../src/lib/resources";
import { getVideoSlugs } from "../lib/data/videos";

const trackSlugs = new Set(tracks.map((t) => t.slug));
const courseSlugs = new Set(courses.map((c) => c.slug));
const quizSlugs = new Set(quizzes.map((q) => q.slug));
const labSlugs = new Set(labs.map((l) => l.slug));
const examRoutes = new Set(getExamRouteSlugs());

const issues: string[] = [];
const warnings: string[] = [];

for (const q of quizzes.filter((q) => q.type === "examen")) {
  const route = getExamRouteFromQuizSlug(q.slug);
  if (!route) {
    warnings.push(`EXAM_INLINE_ONLY: ${q.slug} (accessible via /quiz/${q.slug})`);
  } else if (!examRoutes.has(route)) {
    issues.push(`EXAM_ROUTE_MISSING: ${route}`);
  }
}

for (const [route, quiz] of Object.entries(examRouteToQuizSlug)) {
  if (!quizSlugs.has(quiz)) issues.push(`EXAM_QUIZ_MISSING: ${route} -> ${quiz}`);
}

for (const lab of labs) {
  if (lab.trackSlug && !trackSlugs.has(lab.trackSlug)) {
    issues.push(`LAB_BAD_TRACK: ${lab.slug} -> ${lab.trackSlug}`);
  }
}

for (const path of certificationPaths) {
  if (!quizSlugs.has(path.examQuizSlug)) {
    issues.push(`CERT_EXAM_MISSING: ${path.slug} -> ${path.examQuizSlug}`);
  }
}

for (const slug of getResourceSlugs()) {
  if (!slug.trim()) issues.push("RESOURCE_EMPTY_SLUG");
}

for (const slug of getVideoSlugs()) {
  if (!slug.trim()) issues.push("VIDEO_EMPTY_SLUG");
}

for (const course of courses) {
  if (!trackSlugs.has(course.trackSlug)) {
    warnings.push(`COURSE_ORPHAN_TRACK: ${course.slug} -> ${course.trackSlug}`);
  }
}

console.log(`Tracks: ${trackSlugs.size} | Courses: ${courseSlugs.size} | Quizzes: ${quizSlugs.size}`);
console.log(`Exam routes: ${examRoutes.size} | Labs: ${labSlugs.size}`);
console.log(`Resources: ${getResourceSlugs().length} | Videos: ${getVideoSlugs().length}`);

if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}):`);
  warnings.forEach((w) => console.log(`  ⚠ ${w}`));
}

if (issues.length) {
  console.error(`\nErrors (${issues.length}):`);
  issues.forEach((e) => console.error(`  ✗ ${e}`));
  process.exit(1);
}

console.log("\nOK: data routes consistent");
process.exit(0);
