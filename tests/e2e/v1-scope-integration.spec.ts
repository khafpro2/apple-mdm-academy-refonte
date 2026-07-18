import { test, expect, type Page } from "@playwright/test";

const OUT_OF_SCOPE = /kandji|mosyle|addigy|workspace\s*one|vmware workspace|comparatif mdm|alternative mdm/i;
const INDEPENDENCE =
  /Cette simulation est une préparation indépendante\. Elle n'est ni fournie,\s*ni approuvée,\s*ni administrée par Apple, Jamf ou Microsoft/;

const CORE_ROUTES = [
  "/",
  "/parcours",
  "/cours",
  "/examens",
  "/quiz",
  "/labs",
  "/resources",
  "/sitemap.xml",
  "/manifest.webmanifest",
];

const SAMPLE_ROUTES = [
  "/parcours/apple-fundamentals",
  "/parcours/jamf-100",
  "/parcours/intune-mac",
  "/cours/apple-fundamentals",
  "/cours/jamf-100",
  "/cours/intune-mac",
  "/cours/apple-fundamentals/filevault-chiffrement",
  "/examens/jamf-100",
];

async function collectPageText(page: Page): Promise<string> {
  return page.locator("body").innerText();
}

test.describe("V1 scope and integration shells", () => {
  for (const path of [...CORE_ROUTES, ...SAMPLE_ROUTES]) {
    test(`no out-of-scope MDM on ${path}`, async ({ page }) => {
      const response = await page.goto(path, { waitUntil: "domcontentloaded", timeout: 30_000 });
      expect(response, `response for ${path}`).not.toBeNull();
      const status = response!.status();
      expect(status, `${path} status`).toBeLessThan(400);

      const text = await collectPageText(page);
      expect(text, `${path} should not be blank`).toMatch(/\S/);
      expect(text).not.toMatch(OUT_OF_SCOPE);
    });
  }

  test("main navigation exposes Apple, Jamf and Intune families", async ({ page }) => {
    await page.goto("/parcours", { waitUntil: "domcontentloaded" });
    const text = await collectPageText(page);
    expect(text).toMatch(/Fondamentaux Apple|Apple Fundamentals/i);
    expect(text).toMatch(/Jamf 100/i);
    expect(text).toMatch(/Intune/i);
    expect(text).not.toMatch(OUT_OF_SCOPE);
  });

  test("exam page shows independence notice and format panels", async ({ page }) => {
    await page.goto("/examens/jamf-100", { waitUntil: "domcontentloaded" });
    const text = await collectPageText(page);
    expect(text).toMatch(INDEPENDENCE);
    expect(text).toContain("Format officiel vérifié");
    expect(text).toContain("Configuration de la simulation Apple MDM Academy");
    expect(text).not.toMatch(/badge\s*vide/i);
  });

  test("pilot FileVault lesson renders without empty version badges", async ({ page }) => {
    await page.goto("/cours/apple-fundamentals/filevault-chiffrement", {
      waitUntil: "domcontentloaded",
    });
    const text = await collectPageText(page);
    expect(text).toMatch(/FileVault/i);
    expect(text).toMatch(/Sources officielles|Compatibilité plateforme|Enrôlement/i);
    // Empty badge anti-pattern: no lone "—" version chips without platform context
    const emptyBadge = page.locator('[data-empty-badge="true"], .badge:empty');
    await expect(emptyBadge).toHaveCount(0);
  });

  test("removed MDM paths do not resolve as live catalog pages", async ({ page }) => {
    for (const path of [
      "/parcours/kandji-fundamentals",
      "/parcours/mosyle-fundamentals",
      "/parcours/addigy-fundamentals",
      "/parcours/workspace-one-apple",
      "/parcours/mdm-comparatif-apple",
    ]) {
      const response = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(response, path).not.toBeNull();
      expect([404, 308, 307, 301].includes(response!.status()) || response!.status() >= 400).toBeTruthy();
    }
  });

  test("mobile viewport keeps search and nav usable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/parcours", { waitUntil: "domcontentloaded" });
    const search = page.getByRole("searchbox").first();
    await expect(search).toBeVisible();
    const text = await collectPageText(page);
    expect(text).not.toMatch(OUT_OF_SCOPE);
  });
});
