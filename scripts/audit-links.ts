import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

type Finding = {
  href: string;
  source: string;
  reason: string;
};

const root = process.cwd();
const sourceDirs = ["app", "components", "lib", "src"];

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(tsx?|jsx?)$/.test(entry.name) ? [full] : [];
  });
}

function appRouteFromFile(file: string): string | null {
  const rel = path.relative(path.join(root, "app"), file);
  if (!/(^|\/)(page|route)\.tsx?$/.test(rel)) return null;
  const segments = rel
    .replace(/\/(page|route)\.tsx?$/, "")
    .split(path.sep)
    .filter(Boolean)
    .filter((segment) => !segment.startsWith("("));
  if (segments.length === 0) return "/";
  return `/${segments.join("/")}`;
}

function routeMatches(route: string, hrefPath: string): boolean {
  if (route === hrefPath) return true;
  const routeParts = route.split("/").filter(Boolean);
  const hrefParts = hrefPath.split("/").filter(Boolean);
  const catchAllIndex = routeParts.findIndex((part) => part.startsWith("[..."));
  if (catchAllIndex >= 0) {
    if (hrefParts.length < catchAllIndex + 1) return false;
    return routeParts.slice(0, catchAllIndex).every((part, index) => part === hrefParts[index]);
  }
  if (routeParts.length !== hrefParts.length) return false;
  return routeParts.every((part, index) => part.startsWith("[") || part === hrefParts[index]);
}

function stripHref(href: string): string {
  return href.split("#")[0]?.split("?")[0] || "/";
}

function collectLiteralHrefs(file: string): { href: string; line: number }[] {
  const text = fs.readFileSync(file, "utf8");
  const results: { href: string; line: number }[] = [];
  const regex = /\b(?:href|actionHref|ctaHref|router\.push)\s*=?\s*\(?\s*["'`]([^"'`{}]+)["'`]/g;
  for (const match of text.matchAll(regex)) {
    const before = text.slice(0, match.index);
    results.push({ href: match[1], line: before.split("\n").length });
  }
  return results;
}

async function main() {
  const appFiles = walk(path.join(root, "app"));
  const routes = appFiles.map(appRouteFromFile).filter(Boolean) as string[];

  const data = await import(pathToFileURL(path.join(root, "lib/data/index.ts")).href);
  const dynamicUrls = new Set<string>();

  for (const course of data.courses ?? []) {
    dynamicUrls.add(`/cours/${course.slug}`);
    for (const module of course.modules ?? []) {
      for (const lesson of module.lessons ?? []) {
        dynamicUrls.add(`/cours/${course.slug}/${lesson.slug}`);
      }
    }
  }
  for (const track of data.tracks ?? []) dynamicUrls.add(`/parcours/${track.slug}`);
  for (const lab of data.labs ?? []) dynamicUrls.add(`/labs/${lab.slug}`);
  for (const quiz of data.quizzes ?? []) dynamicUrls.add(`/quiz/${quiz.slug}`);
  for (const exam of data.getExams?.() ?? []) dynamicUrls.add(`/examens/${exam.slug}`);
  for (const video of data.academyVideos ?? []) dynamicUrls.add(`/videos/${video.slug}`);
  for (const resource of data.academyResources ?? []) dynamicUrls.add(`/resources/${resource.slug}`);
  for (const cert of data.certificationPaths ?? []) dynamicUrls.add(`/certification/${cert.slug}`);

  const files = sourceDirs.flatMap((dir) => walk(path.join(root, dir)));
  const findings: Finding[] = [];
  const hrefs = new Map<string, string[]>();

  for (const file of files) {
    for (const { href, line } of collectLiteralHrefs(file)) {
      const source = `${path.relative(root, file)}:${line}`;
      if (!href.startsWith("/") || href.startsWith("//")) continue;
      hrefs.set(href, [...(hrefs.get(href) ?? []), source]);
      const hrefPath = stripHref(href);
      if (hrefPath.startsWith("/api/")) continue;
      if (routes.some((route) => routeMatches(route, hrefPath))) continue;
      if (dynamicUrls.has(hrefPath)) continue;
      findings.push({ href, source, reason: "Aucune route ou donnée dynamique correspondante" });
    }
  }

  const dynamicFindings: Finding[] = [];
  for (const video of data.academyVideos ?? []) {
    if (video.relatedLabSlug && !dynamicUrls.has(`/labs/${video.relatedLabSlug}`)) {
      dynamicFindings.push({
        href: `/labs/${video.relatedLabSlug}`,
        source: `academyVideos:${video.slug}`,
        reason: "Lab associé introuvable",
      });
    }
    if (video.courseSlug && !dynamicUrls.has(`/cours/${video.courseSlug}`)) {
      dynamicFindings.push({
        href: `/cours/${video.courseSlug}`,
        source: `academyVideos:${video.slug}`,
        reason: "Cours associé introuvable",
      });
    }
  }
  for (const resource of data.academyResources ?? []) {
    if (resource.relatedLabSlug && !dynamicUrls.has(`/labs/${resource.relatedLabSlug}`)) {
      dynamicFindings.push({
        href: `/labs/${resource.relatedLabSlug}`,
        source: `academyResources:${resource.slug}`,
        reason: "Lab associé introuvable",
      });
    }
    if (resource.relatedCourseSlug && !dynamicUrls.has(`/cours/${resource.relatedCourseSlug}`)) {
      dynamicFindings.push({
        href: `/cours/${resource.relatedCourseSlug}`,
        source: `academyResources:${resource.slug}`,
        reason: "Cours associé introuvable",
      });
    }
  }

  console.log(JSON.stringify({
    routeCount: routes.length,
    dynamicUrlCount: dynamicUrls.size,
    literalInternalHrefCount: hrefs.size,
    findings,
    dynamicFindings,
  }, null, 2));
}

void main();
