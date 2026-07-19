import { test, expect, type Page } from "@playwright/test";

const OUT_OF_SCOPE = /kandji|mosyle|addigy|workspace\s*one|vmware workspace|comparatif mdm|alternative mdm/i;
const INDEPENDENCE =
  /Cette simulation est une préparation indépendante\. Elle n'est ni fournie,\s*ni approuvée,\s*ni administrée par Apple, Jamf ou Microsoft/;
const APPLE_BUSINESS_MANAGER = /Apple Business Manager/;
const MANAGED_APPLE_ACCOUNT = /Managed Apple Account/;

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

async function collectPageText(page: Page): Promise<string> {
  return page.locator("body").innerText();
}

/** Assert no empty badge-like UI nodes and no literal "undefined" in panels. */
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

test.describe("V1 scope + Codex exam shell (Phase 7)", () => {
  for (const path of CORE_ROUTES) {
    test(`no out-of-scope MDM on ${path}`, async ({ page }) => {
      const response = await page.goto(path, { waitUntil: "domcontentloaded", timeout: 30_000 });
      expect(response).not.toBeNull();
      expect(response!.status()).toBeLessThan(400);
      const text = await collectPageText(page);
      expect(text).toMatch(/\S/);
      expect(text).not.toMatch(OUT_OF_SCOPE);
    });
  }

  test("official panel complete (Jamf 100) + disclaimer + no empty badges", async ({ page }) => {
    await page.goto("/examens/jamf-100", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("exam-official-panel")).toBeVisible();
    await expect(page.getByTestId("exam-simulation-panel")).toBeVisible();
    await expect(page.getByTestId("exam-independence-disclaimer")).toBeVisible();
    await expect(page.getByTestId("exam-independence-disclaimer")).toHaveText(INDEPENDENCE);
    const text = await collectPageText(page);
    expect(text).toMatch(/Format officiel vérifié|Format officiel partiellement vérifié|Format à vérifier/);
    expect(text).toContain("Configuration de la simulation Apple MDM Academy");
    expect(text).not.toMatch(OUT_OF_SCOPE);
    await assertNoEmptyBadgesOrUndefined(page);
  });

  test("official panel partial / needs-review (Jamf 200)", async ({ page }) => {
    await page.goto("/examens/jamf-200", { waitUntil: "domcontentloaded" });
    const official = page.getByTestId("exam-official-panel");
    await expect(official).toBeVisible();
    const text = await official.innerText();
    expect(text).toMatch(/Format à vérifier|partiellement vérifié|Format officiel vérifié/);
    await assertNoEmptyBadgesOrUndefined(page);
  });

  test("internal exam (Intune Apple) + incomplete bank", async ({ page }) => {
    await page.goto("/examens/intune-apple", { waitUntil: "domcontentloaded" });
    const official = page.getByTestId("exam-official-panel");
    const sim = page.getByTestId("exam-simulation-panel");
    await expect(official).toBeVisible();
    await expect(sim).toBeVisible();
    expect(await official.innerText()).toMatch(/Examen interne Apple MDM Academy/i);
    expect(await official.innerText()).not.toMatch(/Format officiel vérifié$/m);
    const simText = await sim.innerText();
    expect(simText).toMatch(/35/);
    expect(simText).toMatch(/60|cible/i);
    expect(simText).toMatch(/Simulation complète indisponible/i);
    await assertNoEmptyBadgesOrUndefined(page);
  });

  test("Apple Device Support incomplete bank", async ({ page }) => {
    await page.goto("/examens/apple-device-support", { waitUntil: "domcontentloaded" });
    const sim = page.getByTestId("exam-simulation-panel");
    await expect(sim).toBeVisible();
    const simText = await sim.innerText();
    expect(simText).toMatch(/10/);
    expect(simText).toMatch(/80|cible/i);
    expect(simText).toMatch(/Simulation complète indisponible/i);
    await expect(page.getByTestId("exam-training-available")).toBeVisible();
    await assertNoEmptyBadgesOrUndefined(page);
  });

  test("Apple Enterprise Expert internal + incomplete bank", async ({ page }) => {
    await page.goto("/examens/apple-enterprise-expert", { waitUntil: "domcontentloaded" });
    const official = page.getByTestId("exam-official-panel");
    await expect(official).toBeVisible();
    expect(await official.innerText()).toMatch(/Examen interne Apple MDM Academy/i);
    expect(await official.innerText()).not.toMatch(/certification officielle/i);
    const simText = await page.getByTestId("exam-simulation-panel").innerText();
    expect(simText).toMatch(/65/);
    expect(simText).toMatch(/100|cible/i);
    expect(simText).toMatch(/Simulation complète indisponible/i);
    await expect(page.getByTestId("exam-independence-disclaimer")).toBeVisible();
    await assertNoEmptyBadgesOrUndefined(page);
  });

  test("single independence disclaimer (not duplicated across panels)", async ({ page }) => {
    await page.goto("/examens/jamf-100", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("exam-independence-disclaimer")).toHaveCount(1);
    await expect(page.getByTestId("exam-codex-disclaimer")).toHaveCount(0);
  });

  test("pilot FileVault lesson + no empty badges", async ({ page }) => {
    await page.goto("/cours/apple-fundamentals/filevault-chiffrement", {
      waitUntil: "domcontentloaded",
    });
    const text = await collectPageText(page);
    expect(text).toMatch(/FileVault/i);
    expect(text).toMatch(/Sources officielles|Compatibilité plateforme|Enrôlement/i);
    await expect(page.locator('[data-empty-badge="true"], .badge:empty')).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Différences selon la version" })).toHaveCount(0);
  });

  test("terminology: Apple Business Manager", async ({ page }) => {
    await page.goto("/parcours", { waitUntil: "domcontentloaded" });
    const text = await collectPageText(page);
    expect(text).toMatch(APPLE_BUSINESS_MANAGER);
    expect(text).not.toMatch(/\bApple Business\b(?!\s+Manager)/);
  });

  test("terminology: Managed Apple Account on exam/course surfaces", async ({ page }) => {
    await page.goto("/examens", { waitUntil: "domcontentloaded" });
    const examensText = await collectPageText(page);
    // Soft: if the catalogue mentions Managed Apple Account, it must be the canonical form
    if (/Managed Apple|Apple ID géré|compte Apple géré/i.test(examensText)) {
      expect(examensText).toMatch(MANAGED_APPLE_ACCOUNT);
    }
    await page.goto("/cours", { waitUntil: "domcontentloaded" });
    const coursText = await collectPageText(page);
    if (/Managed Apple|Apple ID géré|compte Apple géré/i.test(coursText)) {
      expect(coursText).toMatch(MANAGED_APPLE_ACCOUNT);
    }
  });

  test("removed MDM paths return 404", async ({ page }) => {
    for (const path of [
      "/parcours/kandji-fundamentals",
      "/parcours/mosyle-fundamentals",
      "/parcours/addigy-fundamentals",
    ]) {
      const response = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(response!.status()).toBe(404);
    }
  });

  test("redirects: /modules → /cours, /ressources → /resources", async ({ page }) => {
    const modules = await page.goto("/modules", { waitUntil: "domcontentloaded" });
    expect(modules).not.toBeNull();
    expect(page.url()).toMatch(/\/cours\/?$/);
    const ressources = await page.goto("/ressources", { waitUntil: "domcontentloaded" });
    expect(ressources).not.toBeNull();
    expect(page.url()).toMatch(/\/resources\/?$/);
  });

  test("mobile viewport: search focus + panels readable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/examens", { waitUntil: "domcontentloaded" });
    const search = page.getByRole("searchbox").first();
    await expect(search).toBeVisible();
    await search.focus();
    await expect(search).toBeFocused();

    await page.goto("/examens/jamf-100", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("exam-official-panel")).toBeVisible();
    await expect(page.getByTestId("exam-simulation-panel")).toBeVisible();
    await assertNoEmptyBadgesOrUndefined(page);
  });

  test("keyboard: skip link + exam start CTA", async ({ page }) => {
    await page.goto("/examens/jamf-100", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("link", { name: /Aller au contenu principal/i })).toBeAttached();
    await expect(page.getByRole("button", { name: /Commencer l'examen/i })).toBeVisible();
  });

  test("no out-of-scope MDM links on exam intro", async ({ page }) => {
    await page.goto("/examens/jamf-100", { waitUntil: "domcontentloaded" });
    const hrefs = await page.locator("a[href]").evaluateAll((anchors) =>
      anchors.map((a) => (a as HTMLAnchorElement).href)
    );
    for (const href of hrefs) {
      expect(href).not.toMatch(/kandji|mosyle|addigy/i);
    }
  });
});
