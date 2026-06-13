import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const root = process.cwd();
const baseUrl = process.env.COURSE_AUDIT_BASE_URL ?? process.env.CRAWL_BASE_URL ?? "http://localhost:3000";
const reportDir = path.join(root, "audit", "cours");
const screenshotsDir = path.join(reportDir, "screenshots");
const jsonReportPath = path.join(reportDir, "report.json");
const mdReportPath = path.join(reportDir, "report.md");

const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
];

const criticalResourceTypes = new Set(["document", "script", "stylesheet", "xhr", "fetch"]);
const brokenTextPatterns = [
  /Application error/i,
  /Unhandled Runtime Error/i,
  /Hydration failed/i,
  /Text content does not match server-rendered HTML/i,
  /Minified React error/i,
  /Internal Server Error/i,
  /This page could not be found/i,
  /Page introuvable/i,
];

function normalizePathname(urlLike) {
  try {
    const url = new URL(urlLike, baseUrl);
    if (url.origin !== new URL(baseUrl).origin) return null;
    if (url.pathname.startsWith("/_next/")) return null;
    if (url.pathname.match(/\.(png|jpe?g|gif|webp|svg|ico|pdf|zip|mp4|webm|mp3|woff2?|ttf|css|js)$/i)) return null;
    return `${url.pathname.replace(/\/+$/, "") || "/"}${url.search}`;
  } catch {
    return null;
  }
}

function isCourseRelatedPath(pathname) {
  return (
    pathname === "/cours" ||
    pathname.startsWith("/cours/") ||
    pathname.startsWith("/quiz/") ||
    pathname.startsWith("/examens/")
  );
}

function appCourseRoutes() {
  const manifestPath = path.join(root, ".next/server/app-paths-manifest.json");
  if (!fs.existsSync(manifestPath)) return [];
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  return Object.keys(manifest)
    .filter((key) => key.endsWith("/page") && key.startsWith("/cours") && !key.includes("["))
    .map((key) => normalizePathname(key.slice(0, -"/page".length) || "/"))
    .filter(Boolean);
}

async function sitemapCourseRoutes() {
  const response = await fetch(new URL("/sitemap.xml", baseUrl));
  if (!response.ok) throw new Error(`Impossible de lire /sitemap.xml (${response.status})`);
  const xml = await response.text();
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((match) => normalizePathname(match[1]))
    .filter(Boolean)
    .filter(isCourseRelatedPath);
}

function isCriticalNetworkIssue(issue) {
  if (
    issue.kind === "requestfailed" &&
    issue.resourceType === "fetch" &&
    issue.errorText === "net::ERR_ABORTED" &&
    (issue.url.includes("_rsc=") || issue.url.includes("/auth/login?redirect=%2Fdashboard"))
  ) {
    return false;
  }
  if (issue.kind === "requestfailed") return criticalResourceTypes.has(issue.resourceType);
  if (issue.status >= 500) return true;
  if (issue.status === 404) return criticalResourceTypes.has(issue.resourceType) || issue.resourceType === "image";
  return false;
}

async function auditUrl(browser, pathname, viewport) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  const consoleErrors = [];
  const pageErrors = [];
  const networkIssues = [];
  const screenshotName = `${viewport.name}-${pathname.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "home"}.png`;
  const screenshotPath = path.join(screenshotsDir, screenshotName);

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push({ text: message.text(), location: message.location() });
    }
  });
  page.on("pageerror", (error) => {
    pageErrors.push({ message: error.message, stack: error.stack });
  });
  page.on("requestfailed", (request) => {
    networkIssues.push({
      kind: "requestfailed",
      url: request.url(),
      resourceType: request.resourceType(),
      errorText: request.failure()?.errorText ?? "request failed",
    });
  });
  page.on("response", (response) => {
    const status = response.status();
    if (status < 400) return;
    networkIssues.push({
      kind: "response",
      url: response.url(),
      status,
      resourceType: response.request().resourceType(),
    });
  });

  let status = null;
  let title = "";
  let headerVisible = false;
  let mainVisible = false;
  let mainTextLength = 0;
  let brokenSignals = [];
  let discoveredCourseLinks = [];

  try {
    const response = await page.goto(new URL(pathname, baseUrl).toString(), {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    status = response?.status() ?? null;
    await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => undefined);
    title = await page.title().catch(() => "");
    const bodyText = await page.locator("body").innerText({ timeout: 5000 }).catch(() => "");
    brokenSignals = brokenTextPatterns.filter((pattern) => pattern.test(bodyText)).map((pattern) => pattern.source);
    headerVisible = await page.locator("header").first().isVisible({ timeout: 2000 }).catch(() => false);
    mainVisible = await page.locator("#main-content").isVisible({ timeout: 2000 }).catch(() => false);
    mainTextLength = await page
      .locator("#main-content")
      .innerText({ timeout: 2000 })
      .then((text) => text.trim().length)
      .catch(() => 0);
    discoveredCourseLinks = await page
      .locator("a[href]")
      .evaluateAll((links) => links.map((link) => link.href))
      .then((links) => links.map(normalizePathname).filter(Boolean).filter(isCourseRelatedPath))
      .catch(() => []);
  } catch (error) {
    pageErrors.push({ message: error instanceof Error ? error.message : String(error) });
  }

  const criticalNetworkErrors = networkIssues.filter(isCriticalNetworkIssue);
  const failures = [];
  if (status === null || status >= 400) failures.push(`HTTP ${status ?? "unknown"}`);
  if (consoleErrors.length) failures.push(`${consoleErrors.length} console error(s)`);
  if (pageErrors.length) failures.push(`${pageErrors.length} React/page error(s)`);
  if (criticalNetworkErrors.length) failures.push(`${criticalNetworkErrors.length} critical network error(s)`);
  if (brokenSignals.length) failures.push(`Broken content: ${brokenSignals.join(", ")}`);
  if (!headerVisible) failures.push("Header/navbar non visible");
  if (!mainVisible || mainTextLength < 80) failures.push("Contenu principal insuffisant ou invisible");

  if (failures.length) {
    await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => undefined);
  }
  await page.close().catch(() => undefined);

  return {
    url: new URL(pathname, baseUrl).toString(),
    path: pathname,
    viewport: viewport.name,
    ok: failures.length === 0,
    status,
    title,
    headerVisible,
    mainVisible,
    mainTextLength,
    failures,
    consoleErrors,
    pageErrors,
    criticalNetworkErrors,
    networkWarnings: networkIssues.filter((issue) => !isCriticalNetworkIssue(issue)),
    brokenSignals,
    screenshot: failures.length ? screenshotPath : null,
    discoveredCourseLinks,
  };
}

function renderMarkdown(report) {
  const lines = [
    "# Audit Cours Playwright",
    "",
    `- Base URL: ${report.baseUrl}`,
    `- Pages cours/quiz/examens testées: ${report.summary.totalPages}`,
    `- Checks viewport: ${report.summary.totalChecks}`,
    `- OK: ${report.summary.okChecks}`,
    `- KO: ${report.summary.failedChecks}`,
    `- Statut: ${report.ok ? "OK" : "FAILED"}`,
    "",
  ];
  const failures = report.results.filter((result) => !result.ok);
  if (!failures.length) {
    lines.push("Aucun échec détecté.");
  } else {
    lines.push("## Échecs", "");
    for (const result of failures) {
      lines.push(`### ${result.viewport} ${result.path}`, "");
      lines.push(`- URL: ${result.url}`);
      lines.push(`- Status: ${result.status ?? "unknown"}`);
      lines.push(`- Titre: ${result.title}`);
      for (const failure of result.failures) lines.push(`- Erreur: ${failure}`);
      for (const issue of result.criticalNetworkErrors) {
        lines.push(`- Réseau: ${issue.status ?? issue.errorText} ${issue.resourceType} ${issue.url}`);
      }
      for (const error of result.consoleErrors) lines.push(`- Console: ${error.text}`);
      if (result.screenshot) lines.push(`- Capture: ${result.screenshot}`);
      lines.push("");
    }
  }
  return `${lines.join("\n")}\n`;
}

async function main() {
  fs.mkdirSync(screenshotsDir, { recursive: true });
  const initialRoutes = new Set(["/cours", ...appCourseRoutes(), ...(await sitemapCourseRoutes())]);
  const browser = await chromium.launch({ headless: true });
  const queue = [...initialRoutes];
  const seenPages = new Set();
  const results = [];

  try {
    while (queue.length) {
      const pathname = queue.shift();
      if (!pathname || seenPages.has(pathname)) continue;
      seenPages.add(pathname);

      for (const viewport of viewports) {
        const result = await auditUrl(browser, pathname, viewport);
        results.push(result);
        for (const link of result.discoveredCourseLinks) {
          if (!seenPages.has(link) && !queue.includes(link)) queue.push(link);
        }
        console.log(`${result.ok ? "ok" : "fail"} ${viewport.name} ${pathname}`);
      }
    }
  } finally {
    await browser.close().catch(() => undefined);
  }

  const report = {
    ok: results.every((result) => result.ok),
    baseUrl,
    generatedAt: new Date().toISOString(),
    routes: [...seenPages].sort(),
    summary: {
      totalPages: seenPages.size,
      totalChecks: results.length,
      okChecks: results.filter((result) => result.ok).length,
      failedChecks: results.filter((result) => !result.ok).length,
    },
    results: results.map(({ discoveredCourseLinks, ...result }) => result),
  };
  fs.writeFileSync(jsonReportPath, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(mdReportPath, renderMarkdown(report));
  console.log(`Report written to ${jsonReportPath}`);
  console.log(`Report written to ${mdReportPath}`);
  if (!report.ok) process.exitCode = 1;
}

await main();
