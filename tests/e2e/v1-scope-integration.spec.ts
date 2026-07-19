import { test, expect, type Page } from "@playwright/test";

const OUT_OF_SCOPE = /kandji|mosyle|addigy|workspace\s*one|vmware workspace|comparatif mdm|alternative mdm/i;
const INDEPENDENCE =
  /préparation indépendante|Simulation de préparation indépendante/i;
const APPLE_BUSINESS_MANAGER = /Apple Business Manager/;

const CORE_ROUTES = ["/", "/parcours", "/cours", "/examens", "/resources"];

async function collectPageText(page: Page): Promise<string> {
  return page.locator("body").innerText();
}

async function assertNoEmptyBadgesOrUndefined(page: Page) {
  await expect(page.locator('[data-empty-badge="true"], .badge:empty')).toHaveCount(0);
  const panelText = await page
    .locator('[data-testid="exam-official-panel"], [data-testid="exam-simulation-panel"]')
    .allInnerTexts();
  for (const text of panelText) {
    expect(text).not.toMatch(/\bundefined\b/i);
    expect(text).not.toMatch(/\bnull\b/i);
    expect(text).not.toMatch(/0\s*minute/i);
  }
}

test.describe("Phase 8 — Codex exam integration shell", () => {
  for (const path of CORE_ROUTES) {
    test(`catalog/scope ok on ${path}`, async ({ page }) => {
      const response = await page.goto(path, { waitUntil: "domcontentloaded", timeout: 30_000 });
      expect(response).not.toBeNull();
      expect(response!.status()).toBeLessThan(400);
      expect(await collectPageText(page)).not.toMatch(OUT_OF_SCOPE);
    });
  }

  test("Jamf 100: official panel + disclaimer from Codex adapter", async ({ page }) => {
    await page.goto("/examens/jamf-100", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("exam-official-panel")).toBeVisible();
    await expect(page.getByTestId("exam-simulation-panel")).toBeVisible();
    await expect(page.getByTestId("exam-independence-disclaimer")).toBeVisible();
    expect(await collectPageText(page)).toMatch(INDEPENDENCE);
    await expect(page.getByTestId("exam-codex-disclaimer")).toHaveCount(0);
    await assertNoEmptyBadgesOrUndefined(page);
  });

  test("Apple Device Support: 10/80 + training + blocked simulation", async ({ page }) => {
    await page.goto("/examens/apple-device-support", { waitUntil: "domcontentloaded" });
    const sim = page.getByTestId("exam-simulation-panel");
    await expect(sim).toBeVisible();
    expect(await sim.innerText()).toMatch(/10/);
    expect(await sim.innerText()).toMatch(/80|cible/i);
    expect(await sim.innerText()).toMatch(/Simulation complète indisponible/i);
    await expect(page.getByTestId("exam-training-available")).toBeVisible();
    await expect(page.getByTestId("exam-simulation-blocked")).toBeVisible();
    await expect(page.getByTestId("exam-simulation-blocked-reason")).toBeVisible();
    await expect(page.getByRole("button", { name: /Mode entraînement/i })).toBeVisible();
    await assertNoEmptyBadgesOrUndefined(page);
  });

  test("Intune Apple: internal + incomplete bank", async ({ page }) => {
    await page.goto("/examens/intune-apple", { waitUntil: "domcontentloaded" });
    const official = page.getByTestId("exam-official-panel");
    expect(await official.innerText()).toMatch(/Examen interne Apple MDM Academy/i);
    expect(await official.innerText()).toMatch(/Évaluation interne/i);
    expect(await official.innerText()).not.toMatch(/Microsoft 365 Certified/i);
    const sim = await page.getByTestId("exam-simulation-panel").innerText();
    expect(sim).toMatch(/35/);
    expect(sim).toMatch(/60|cible/i);
    expect(sim).toMatch(/Simulation complète indisponible/i);
    await expect(page.getByTestId("exam-simulation-blocked")).toBeVisible();
  });

  test("Apple Enterprise Expert: internal 65/100", async ({ page }) => {
    await page.goto("/examens/apple-enterprise-expert", { waitUntil: "domcontentloaded" });
    const official = await page.getByTestId("exam-official-panel").innerText();
    expect(official).toMatch(/Examen interne Apple MDM Academy/i);
    expect(official).not.toMatch(/Certification officielle Apple Enterprise Expert/i);
    const sim = await page.getByTestId("exam-simulation-panel").innerText();
    expect(sim).toMatch(/65/);
    expect(sim).toMatch(/100|cible/i);
    expect(sim).toMatch(/Simulation complète indisponible/i);
  });

  test("needs-review / partial statuses render", async ({ page }) => {
    await page.goto("/examens/jamf-200", { waitUntil: "domcontentloaded" });
    expect(await page.getByTestId("exam-official-panel").innerText()).toMatch(
      /Format à vérifier|partiellement vérifié|Format officiel/
    );
  });

  test("FileVault pilot lesson", async ({ page }) => {
    await page.goto("/cours/apple-fundamentals/filevault-chiffrement", {
      waitUntil: "domcontentloaded",
    });
    expect(await collectPageText(page)).toMatch(/FileVault/i);
  });

  test("terminology Apple Business Manager", async ({ page }) => {
    await page.goto("/parcours", { waitUntil: "domcontentloaded" });
    expect(await collectPageText(page)).toMatch(APPLE_BUSINESS_MANAGER);
  });

  test("redirects /modules and /ressources", async ({ page }) => {
    await page.goto("/modules", { waitUntil: "domcontentloaded" });
    expect(page.url()).toMatch(/\/cours\/?$/);
    await page.goto("/ressources", { waitUntil: "domcontentloaded" });
    expect(page.url()).toMatch(/\/resources\/?$/);
  });

  test("mobile 390×844 panels readable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/examens/jamf-100", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("exam-official-panel")).toBeVisible();
    await expect(page.getByTestId("exam-simulation-panel")).toBeVisible();
    await assertNoEmptyBadgesOrUndefined(page);
  });

  test("keyboard: skip link + training CTA", async ({ page }) => {
    await page.goto("/examens/jamf-100", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("link", { name: /Aller au contenu principal/i })).toBeAttached();
    await expect(page.getByRole("button", { name: /Mode entraînement|Commencer l'examen/i })).toBeVisible();
  });

  test("no lib/exam/exam-metadata second source (disclaimer from adapter only)", async ({ page }) => {
    await page.goto("/examens/jamf-100", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("exam-independence-disclaimer")).toHaveCount(1);
  });
});
