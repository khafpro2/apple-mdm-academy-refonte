import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const root = process.cwd();
const baseUrl = process.env.CRAWL_BASE_URL ?? "http://localhost:3000";
const maxPages = Number(process.env.CRAWL_MAX_PAGES ?? "1200");
const reportDir = path.join(root, "audit");
const jsonReportPath = path.join(reportDir, "playwright-crawl-report.json");
const mdReportPath = path.join(reportDir, "playwright-crawl-report.md");

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
const consoleErrorPatterns = [
  /error/i,
  /hydration/i,
  /failed/i,
  /exception/i,
  /not found/i,
  /cannot/i,
];

function normalizePathname(urlLike) {
  try {
    const url = new URL(urlLike, baseUrl);
    if (url.origin !== new URL(baseUrl).origin) return null;
    if (url.pathname.startsWith("/_next/")) return null;
    if (url.pathname.match(/\.(png|jpe?g|gif|webp|svg|ico|pdf|zip|mp4|webm|mp3|woff2?|ttf|css|js)$/i)) return null;
    const pathname = url.pathname.replace(/\/+$/, "") || "/";
    return `${pathname}${url.search}`;
  } catch {
    return null;
  }
}

function appRouteFromManifestKey(key) {
  if (!key.endsWith("/page")) return null;
  if (key.startsWith("/_")) return null;
  if (key.includes("[") || key.includes("]")) return null;
  const route = key.slice(0, -"/page".length) || "/";
  return normalizePathname(route);
}

function readManifestRoutes() {
  const manifestPath = path.join(root, ".next/server/app-paths-manifest.json");
  if (!fs.existsSync(manifestPath)) return [];
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  return Object.keys(manifest).map(appRouteFromManifestKey).filter(Boolean);
}

async function readSitemapRoutes() {
  try {
    const response = await fetch(new URL("/sitemap.xml", baseUrl));
    if (!response.ok) return [];
    const xml = await response.text();
    return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
      .map((match) => normalizePathname(match[1]))
      .filter(Boolean);
  } catch {
    return [];
  }
}

function isCriticalNetworkIssue(issue) {
  if (
    issue.kind === "requestfailed" &&
    issue.resourceType === "fetch" &&
    issue.errorText === "net::ERR_ABORTED" &&
    issue.url.includes("_rsc=")
  ) {
    return false;
  }
  if (issue.kind === "requestfailed") return criticalResourceTypes.has(issue.resourceType);
  if (issue.status >= 500) return true;
  if (issue.status === 404) return criticalResourceTypes.has(issue.resourceType);
  return false;
}

function renderMarkdown(report) {
  const lines = [
    "# Playwright Crawl Report",
    "",
    `- Base URL: ${report.baseUrl}`,
    `- Started: ${report.startedAt}`,
    `- Finished: ${report.finishedAt}`,
    `- Pages checked: ${report.summary.checked}`,
    `- Console errors: ${report.summary.consoleErrors}`,
    `- Critical network errors: ${report.summary.criticalNetworkErrors}`,
    `- Broken pages: ${report.summary.brokenPages}`,
    `- HTTP failures: ${report.summary.httpFailures}`,
    `- Status: ${report.ok ? "OK" : "FAILED"}`,
    "",
  ];

  const failures = report.pages.filter((page) => !page.ok);
  if (!failures.length) {
    lines.push("No page failures found.");
  } else {
    lines.push("## Failures", "");
    for (const page of failures) {
      lines.push(`### ${page.url}`, "");
      lines.push(`- Status: ${page.status ?? "unknown"}`);
      if (page.title) lines.push(`- Title: ${page.title}`);
      for (const error of page.consoleErrors) lines.push(`- Console: ${error.text}`);
      for (const error of page.pageErrors) lines.push(`- Page error: ${error.message}`);
      for (const error of page.criticalNetworkErrors) {
        lines.push(`- Network: ${error.status ?? error.errorText} ${error.resourceType} ${error.url}`);
      }
      for (const error of page.brokenSignals) lines.push(`- Broken signal: ${error}`);
      lines.push("");
    }
  }

  return `${lines.join("\n")}\n`;
}

async function crawlPage(browser, pathOrUrl) {
  const url = new URL(pathOrUrl, baseUrl).toString();
  const page = await browser.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const networkErrors = [];

  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (!consoleErrorPatterns.some((pattern) => pattern.test(text))) return;
    consoleErrors.push({
      type: message.type(),
      text,
      location: message.location(),
    });
  });

  page.on("pageerror", (error) => {
    pageErrors.push({
      message: error.message,
      stack: error.stack,
    });
  });

  page.on("requestfailed", (request) => {
    networkErrors.push({
      kind: "requestfailed",
      url: request.url(),
      resourceType: request.resourceType(),
      errorText: request.failure()?.errorText ?? "request failed",
    });
  });

  page.on("response", (response) => {
    const status = response.status();
    if (status < 400) return;
    const request = response.request();
    networkErrors.push({
      kind: "response",
      url: response.url(),
      status,
      resourceType: request.resourceType(),
    });
  });

  let status = null;
  let title = "";
  let discoveredLinks = [];
  let brokenSignals = [];

  try {
    const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    status = response?.status() ?? null;
    await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => undefined);
    title = await page.title().catch(() => "");
    const bodyText = await page.locator("body").innerText({ timeout: 5000 }).catch(() => "");
    brokenSignals = brokenTextPatterns.filter((pattern) => pattern.test(bodyText)).map((pattern) => pattern.source);
    discoveredLinks = await page
      .locator("a[href]")
      .evaluateAll((links) => links.map((link) => link.href))
      .catch(() => []);
  } catch (error) {
    pageErrors.push({
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  } finally {
    await page.close().catch(() => undefined);
  }

  const criticalNetworkErrors = networkErrors.filter(isCriticalNetworkIssue);
  const httpFailure = status === null || status >= 400;
  const ok =
    !httpFailure &&
    consoleErrors.length === 0 &&
    pageErrors.length === 0 &&
    criticalNetworkErrors.length === 0 &&
    brokenSignals.length === 0;

  return {
    url,
    path: normalizePathname(url),
    status,
    title,
    ok,
    httpFailure,
    consoleErrors,
    pageErrors,
    criticalNetworkErrors,
    networkWarnings: networkErrors.filter((issue) => !isCriticalNetworkIssue(issue)),
    brokenSignals,
    discoveredLinks: discoveredLinks.map(normalizePathname).filter(Boolean),
  };
}

async function main() {
  fs.mkdirSync(reportDir, { recursive: true });
  const startedAt = new Date().toISOString();
  const seeds = new Set(["/", ...readManifestRoutes(), ...(await readSitemapRoutes())]);
  const queue = [...seeds];
  const seen = new Set();
  const pages = [];
  const browser = await chromium.launch({ headless: true });

  try {
    while (queue.length && seen.size < maxPages) {
      const next = queue.shift();
      if (!next || seen.has(next)) continue;
      seen.add(next);
      const result = await crawlPage(browser, next);
      pages.push(result);
      for (const link of result.discoveredLinks) {
        if (!seen.has(link) && !queue.includes(link) && seen.size + queue.length < maxPages) {
          queue.push(link);
        }
      }
      const status = result.ok ? "ok" : "fail";
      console.log(`[${pages.length}/${seen.size + queue.length}] ${status} ${result.path}`);
    }
  } finally {
    await browser.close();
  }

  const summary = {
    checked: pages.length,
    consoleErrors: pages.reduce((sum, page) => sum + page.consoleErrors.length, 0),
    criticalNetworkErrors: pages.reduce((sum, page) => sum + page.criticalNetworkErrors.length, 0),
    brokenPages: pages.filter((page) => page.brokenSignals.length || page.pageErrors.length).length,
    httpFailures: pages.filter((page) => page.httpFailure).length,
  };
  const report = {
    ok:
      summary.consoleErrors === 0 &&
      summary.criticalNetworkErrors === 0 &&
      summary.brokenPages === 0 &&
      summary.httpFailures === 0,
    baseUrl,
    startedAt,
    finishedAt: new Date().toISOString(),
    summary,
    pages: pages.map(({ discoveredLinks, ...page }) => page),
  };

  fs.writeFileSync(jsonReportPath, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(mdReportPath, renderMarkdown(report));
  console.log(`Report written to ${jsonReportPath}`);
  console.log(`Report written to ${mdReportPath}`);
  if (!report.ok) process.exitCode = 1;
}

await main();
