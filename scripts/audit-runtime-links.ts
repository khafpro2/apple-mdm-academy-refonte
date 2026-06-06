import { pathToFileURL } from "node:url";
import path from "node:path";

type Check = {
  url: string;
  status: number | "error";
  ok: boolean;
  title?: string;
  reason?: string;
};

const root = process.cwd();
const baseUrl = process.env.AUDIT_BASE_URL ?? "http://localhost:3000";

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function titleOf(html: string): string | undefined {
  return html.match(/<title>(.*?)<\/title>/i)?.[1]?.trim();
}

async function main() {
  const data = await import(pathToFileURL(path.join(root, "lib/data/index.ts")).href);
  const urls: string[] = [
    "/",
    "/fr",
    "/en",
    "/parcours",
    "/cours",
    "/labs",
    "/quiz",
    "/examens",
    "/videos",
    "/resources",
    "/pricing",
    "/tarifs",
    "/enterprise",
    "/enterprise/dashboard",
    "/contact-sales",
    "/contact",
    "/support",
    "/status",
    "/roadmap",
    "/mobile-roadmap",
    "/assistant",
    "/training-center",
    "/dashboard",
    "/dashboard/transcript",
    "/account/billing",
    "/checkout?plan=pro",
    "/checkout?plan=enterprise",
    "/checkout/success",
    "/auth/login",
    "/auth/signup",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/privacy",
    "/terms",
    "/legal",
    "/api-docs",
    "/api/openapi",
    "/api/v1/courses",
    "/admin",
    "/admin/content",
    "/admin/production-checklist",
    "/admin/final-audit",
    "/admin/quiz-quality",
    "/admin/content-audit",
    "/admin/pedagogical-report",
  ];

  for (const course of data.courses ?? []) {
    urls.push(`/cours/${course.slug}`);
    for (const courseModule of course.modules ?? []) {
      for (const lesson of courseModule.lessons ?? []) {
        urls.push(`/cours/${course.slug}/${lesson.slug}`);
      }
    }
  }
  for (const track of data.tracks ?? []) urls.push(`/parcours/${track.slug}`);
  for (const lab of data.labs ?? []) urls.push(`/labs/${lab.slug}`);
  for (const quiz of data.quizzes ?? []) urls.push(`/quiz/${quiz.slug}`);
  for (const exam of data.getExams?.() ?? []) urls.push(`/examens/${exam.slug}`);
  for (const video of data.academyVideos ?? []) urls.push(`/videos/${video.slug}`);
  for (const resource of data.academyResources ?? []) urls.push(`/resources/${resource.slug}`);
  for (const cert of data.certificationPaths ?? []) urls.push(`/certification/${cert.slug}`);

  const checks: Check[] = [];
  const deduped = unique(urls);
  for (const url of deduped) {
    try {
      const res = await fetch(`${baseUrl}${url}`, { redirect: "manual" });
      const contentType = res.headers.get("content-type") ?? "";
      const body = contentType.includes("text/html") || contentType.includes("json") ? await res.text() : "";
      const pageTitle = titleOf(body);
      const soft404 =
        res.status === 200 &&
        (pageTitle === "Page introuvable | Apple MDM Academy" ||
          /<h1[^>]*>\s*(Page introuvable|Not Found)\s*<\/h1>/i.test(body));
      const nextError = /Application error|Unhandled Runtime Error|Internal Server Error/.test(body);
      checks.push({
        url,
        status: res.status,
        ok: res.status >= 200 && res.status < 400 && !soft404 && !nextError,
        title: pageTitle,
        reason: soft404 ? "Soft 404 dans le HTML" : nextError ? "Erreur applicative dans le HTML" : undefined,
      });
    } catch (error) {
      checks.push({
        url,
        status: "error",
        ok: false,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const failures = checks.filter((check) => !check.ok);
  console.log(JSON.stringify({
    baseUrl,
    checked: checks.length,
    failures,
  }, null, 2));
}

void main();
