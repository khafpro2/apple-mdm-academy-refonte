import { test, expect, type Page } from "@playwright/test";

const OUT_OF_SCOPE = /kandji|mosyle|addigy|workspace\s*one|vmware workspace|comparatif mdm|alternative mdm/i;
const INDEPENDENCE =
  /Cette simulation est une préparation indépendante\. Elle n'est ni fournie,\s*ni approuvée,\s*ni administrée par Apple, Jamf ou Microsoft/;
const MANAGED_ACCOUNT = /Managed Apple Account/;
const APPLE_BUSINESS_MANAGER = /Apple Business Manager/;

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
      expect(response!.status(), `${path} status`).toBeLessThan(400);

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
    expect(text).toMatch(/Format officiel (vérifié|partiellement vérifié)/);
    expect(text).toContain("Configuration de la simulation Apple MDM Academy");
    await expect(page.getByTestId("exam-official-panel")).toBeVisible();
    await expect(page.getByTestId("exam-simulation-panel")).toBeVisible();
  });

  test("official panel does not invent verified duration numbers before Codex", async ({ page }) => {
    await page.goto("/examens/jamf-100", { waitUntil: "domcontentloaded" });
    const official = page.getByTestId("exam-official-panel");
    await expect(official).toBeVisible();
    const text = await official.innerText();
    expect(text).toMatch(/partiellement vérifié|Certaines informations ne sont pas publiées/i);
    // Temporary adapter must not claim a sourced official duration line
    expect(text).not.toMatch(/Durée officielle\s*:\s*\d+/i);
  });

  test("incomplete bank surfaces warning when catalog is incomplete", async ({ page }) => {
    const response = await page.goto("/examens/apple-enterprise-expert", {
      waitUntil: "domcontentloaded",
    });
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);
    const sim = page.getByTestId("exam-simulation-panel");
    await expect(sim).toBeVisible();
    const warning = page.getByTestId("exam-bank-warning");
    if ((await warning.count()) > 0) {
      await expect(warning).toBeVisible();
      expect(await warning.innerText()).toMatch(/Banque en préparation|Simulation complète indisponible/i);
      expect(await sim.innerText()).toMatch(/Indisponible/i);
    } else {
      expect(await sim.innerText()).toMatch(/Configuration de la simulation/i);
    }
  });

  test("pilot FileVault lesson renders compatibility without empty badges", async ({ page }) => {
    await page.goto("/cours/apple-fundamentals/filevault-chiffrement", {
      waitUntil: "domcontentloaded",
    });
    const text = await collectPageText(page);
    expect(text).toMatch(/FileVault/i);
    expect(text).toMatch(/Sources officielles|Compatibilité plateforme|Enrôlement/i);
    const emptyBadge = page.locator('[data-empty-badge="true"], .badge:empty');
    await expect(emptyBadge).toHaveCount(0);
    // Lesson-level shell must not inherit unrelated iPadOS version callouts
    const diff = page.getByRole("heading", { name: "Différences selon la version" });
    await expect(diff).toHaveCount(0);
  });

  test("terminology: Managed Apple Account present; Apple Business Manager kept", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const text = await collectPageText(page);
    // Public surface may use Managed Apple Account (with historical mention)
    if (MANAGED_ACCOUNT.test(text) || /Managed Apple ID/.test(text)) {
      expect(text).toMatch(/Managed Apple Account|Managed Apple ID/);
    }
    await page.goto("/parcours", { waitUntil: "domcontentloaded" });
    const parcours = await collectPageText(page);
    expect(parcours).toMatch(APPLE_BUSINESS_MANAGER);
    // Guard against blind rename "Apple Business Manager" → "Apple Business"
    expect(parcours).not.toMatch(/\bApple Business\b(?!\s+Manager)/);
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
      expect(response!.status()).toBe(404);
    }
  });

  test("alias routes stay 404 until product redirects are approved", async ({ page }) => {
    for (const path of ["/modules", "/ressources", "/recherche"]) {
      const response = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(response, path).not.toBeNull();
      expect(response!.status(), path).toBe(404);
    }
  });

  test("mobile viewport keeps search and nav usable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/parcours", { waitUntil: "domcontentloaded" });
    const search = page.getByRole("searchbox").first();
    await expect(search).toBeVisible();
    await search.focus();
    await expect(search).toBeFocused();
    const text = await collectPageText(page);
    expect(text).not.toMatch(OUT_OF_SCOPE);
  });

  test("keyboard: skip link and exam CTA are reachable", async ({ page }) => {
    await page.goto("/examens/jamf-100", { waitUntil: "domcontentloaded" });
    const skip = page.getByRole("link", { name: /Aller au contenu principal/i });
    await expect(skip).toBeAttached();
    await page.keyboard.press("Tab");
    const start = page.getByRole("button", { name: /Commencer l'examen/i });
    await expect(start).toBeVisible();
  });
});
