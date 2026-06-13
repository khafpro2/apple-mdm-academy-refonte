import fs from "node:fs";
import path from "node:path";
import { expect, test } from "playwright/test";

const root = process.cwd();
const baseURL = process.env.COURSE_AUDIT_BASE_URL ?? "http://localhost:3010";

async function getCourseRoutes(): Promise<string[]> {
  const response = await fetch(new URL("/sitemap.xml", baseURL));
  expect(response.ok).toBeTruthy();
  const xml = await response.text();
  const routes = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((match) => new URL(match[1]).pathname)
    .filter((pathname) => pathname === "/cours" || pathname.startsWith("/cours/"));

  const manifestPath = path.join(root, ".next/server/app-paths-manifest.json");
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as Record<string, string>;
    for (const key of Object.keys(manifest)) {
      if (key.endsWith("/page") && key.startsWith("/cours") && !key.includes("[")) {
        routes.push(key.slice(0, -"/page".length) || "/");
      }
    }
  }

  return [...new Set(routes)].sort();
}

test.describe("cours pages", () => {
  let routes: string[] = [];

  test.beforeAll(async () => {
    routes = await getCourseRoutes();
    expect(routes.length).toBeGreaterThan(0);
  });

  test("all /cours routes render without browser errors", async ({ page }) => {
    const failures: string[] = [];

    for (const route of routes) {
      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];
      const criticalNetwork: string[] = [];

      page.removeAllListeners();
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      page.on("pageerror", (error) => pageErrors.push(error.message));
      page.on("response", (response) => {
        const status = response.status();
        if (status < 400) return;
        const request = response.request();
        const type = request.resourceType();
        if (status >= 500 || ["document", "script", "stylesheet", "xhr", "fetch", "image"].includes(type)) {
          criticalNetwork.push(`${status} ${type} ${response.url()}`);
        }
      });
      page.on("requestfailed", (request) => {
        const failure = request.failure();
        if (
          request.resourceType() === "fetch" &&
          failure?.errorText === "net::ERR_ABORTED" &&
          (request.url().includes("_rsc=") || request.url().includes("/auth/login?redirect=%2Fdashboard"))
        ) {
          return;
        }
        if (["document", "script", "stylesheet", "xhr", "fetch"].includes(request.resourceType())) {
          criticalNetwork.push(`${failure?.errorText ?? "request failed"} ${request.resourceType()} ${request.url()}`);
        }
      });

      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle", { timeout: 5_000 }).catch(() => undefined);

      const bodyText = await page.locator("body").innerText();
      const mainText = await page.locator("#main-content").innerText();
      const broken =
        /Application error|Unhandled Runtime Error|Hydration failed|Internal Server Error|Page introuvable/i.test(bodyText);

      const routeFailures = [
        response && response.status() >= 400 ? `HTTP ${response.status()}` : "",
        consoleErrors.length ? `Console: ${consoleErrors.join(" | ")}` : "",
        pageErrors.length ? `Page errors: ${pageErrors.join(" | ")}` : "",
        criticalNetwork.length ? `Network: ${criticalNetwork.join(" | ")}` : "",
        broken ? "Broken text detected" : "",
        mainText.trim().length < 80 ? "Main content too small" : "",
      ].filter(Boolean);

      if (routeFailures.length) failures.push(`${route}: ${routeFailures.join("; ")}`);
    }

    expect(failures, failures.join("\n")).toEqual([]);
  });
});
