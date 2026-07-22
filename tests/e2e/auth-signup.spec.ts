import { test, expect, type Page, type TestInfo } from "@playwright/test";

const SIGNUP_PATH = "/auth/signup";
const LOGIN_PATH = "/auth/login";

async function dismissCookieBanner(page: Page) {
  const accept = page.getByRole("button", { name: "Accepter" });
  if (await accept.isVisible().catch(() => false)) {
    await accept.click();
  }
}

async function skipIfSupabaseMissing(page: Page, testInfo: TestInfo) {
  const missing = await page.getByText("Configuration Supabase requise").isVisible().catch(() => false);
  if (missing) {
    testInfo.skip(true, "Supabase non configuré — rebuild E2E requis (scripts/start-e2e-server.sh)");
  }
}

async function openSignup(page: Page, testInfo: TestInfo) {
  await page.goto(SIGNUP_PATH, { waitUntil: "domcontentloaded" });
  await dismissCookieBanner(page);
  await skipIfSupabaseMissing(page, testInfo);
}

test.describe("Page d'inscription", () => {
  test("affiche le formulaire complet sans erreur JS", async ({ page }, testInfo) => {
    await openSignup(page, testInfo);

    await expect(page.getByRole("heading", { name: "Créer un compte" })).toBeVisible();
    await expect(page.getByLabel("Nom complet")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Mot de passe", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Confirmer le mot de passe")).toBeVisible();
    await expect(page.getByRole("button", { name: "Créer mon compte" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Se connecter" })).toHaveAttribute("href", /\/auth\/login/);
  });

  test("validation locale — mot de passe faible", async ({ page }, testInfo) => {
    await openSignup(page, testInfo);

    await page.getByLabel("Nom complet").fill("Test User");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Mot de passe", { exact: true }).fill("abc");
    await page.getByLabel("Confirmer le mot de passe").fill("abc");

    await expect(page.getByRole("button", { name: "Créer mon compte" })).toBeDisabled();
    await expect(page.locator("#password-rules")).toContainText(/8 caractères/i);
  });

  test("validation locale — mots de passe différents", async ({ page }, testInfo) => {
    await openSignup(page, testInfo);

    await page.getByLabel("Nom complet").fill("Test User");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Mot de passe", { exact: true }).fill("ValidPass1");
    await page.getByLabel("Confirmer le mot de passe").fill("OtherPass1");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Créer mon compte" }).click();

    await expect(page.getByRole("alert").filter({ hasText: /ne correspondent pas/i })).toBeVisible();
  });

  test("validation locale — champs obligatoires HTML5", async ({ page }, testInfo) => {
    await openSignup(page, testInfo);

    await expect(page.getByLabel("Nom complet")).toHaveAttribute("required", "");
    await expect(page.getByLabel("Email")).toHaveAttribute("required", "");
    await expect(page.getByLabel("Mot de passe", { exact: true })).toHaveAttribute("required", "");
    await expect(page.getByLabel("Confirmer le mot de passe")).toHaveAttribute("required", "");
  });

  test("double soumission empêchée pendant l'envoi", async ({ page }, testInfo) => {
    await openSignup(page, testInfo);

    await page.route("**/*", async (route) => {
      if (route.request().method() === "POST") {
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
      await route.continue();
    });

    await page.getByLabel("Nom complet").fill("Test User");
    await page.getByLabel("Email").fill(`test-${Date.now()}@example.com`);
    await page.getByLabel("Mot de passe", { exact: true }).fill("ValidPass1");
    await page.getByLabel("Confirmer le mot de passe").fill("ValidPass1");
    await page.getByRole("checkbox").check();

    const submit = page.getByRole("button", { name: /Créer mon compte|Création en cours/i });
    await submit.click();
    await expect(page.getByRole("button", { name: /Création en cours/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Création en cours/i })).toBeDisabled();
  });

  test("lien vers connexion conserve la redirection", async ({ page }, testInfo) => {
    await page.goto(`${SIGNUP_PATH}?redirect=/dashboard`, { waitUntil: "domcontentloaded" });
    await dismissCookieBanner(page);
    await skipIfSupabaseMissing(page, testInfo);

    const loginLink = page.getByRole("link", { name: "Se connecter" });
    await expect(loginLink).toHaveAttribute("href", /redirect=%2Fdashboard/);
  });

  test("dashboard redirige vers login si non connecté", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/auth\/login\?redirect=%2Fdashboard/);
  });

  test("page login accessible", async ({ page }, testInfo) => {
    await page.goto(LOGIN_PATH, { waitUntil: "domcontentloaded" });
    await dismissCookieBanner(page);
    await skipIfSupabaseMissing(page, testInfo);

    await expect(page.getByRole("heading", { name: "Connexion" })).toBeVisible();
    await expect(page.locator("#main-content").getByRole("link", { name: "S'inscrire" })).toHaveAttribute(
      "href",
      /\/auth\/signup/
    );
  });

  test("autocomplete correct sur les champs d'inscription", async ({ page }, testInfo) => {
    await openSignup(page, testInfo);

    await expect(page.getByLabel("Nom complet")).toHaveAttribute("autocomplete", "name");
    await expect(page.getByLabel("Email")).toHaveAttribute("autocomplete", "email");
    await expect(page.getByLabel("Mot de passe", { exact: true })).toHaveAttribute("autocomplete", "new-password");
    await expect(page.getByLabel("Confirmer le mot de passe")).toHaveAttribute("autocomplete", "new-password");
  });

  test("bouton Continuer avec Google présent (signup + login)", async ({ page }, testInfo) => {
    await openSignup(page, testInfo);
    const googleSignup = page.getByRole("button", { name: /Continuer avec Google/i });
    await expect(googleSignup).toBeVisible();
    await expect(googleSignup).toHaveAttribute("aria-label", /Continuer avec Google/i);

    await page.goto(LOGIN_PATH, { waitUntil: "domcontentloaded" });
    await dismissCookieBanner(page);
    await skipIfSupabaseMissing(page, testInfo);
    await expect(page.getByRole("button", { name: /Continuer avec Google/i })).toBeVisible();
  });

  test("consentement Google refusé affiché via ?error=access_denied", async ({ page }, testInfo) => {
    await page.goto(`${LOGIN_PATH}?error=access_denied`, { waitUntil: "domcontentloaded" });
    await dismissCookieBanner(page);
    await skipIfSupabaseMissing(page, testInfo);

    await expect(page.getByRole("alert").filter({ hasText: /consentement|refusé|annul/i })).toBeVisible();
  });

  test("inscription avec confirmation email — pas de faux échec profil (live)", async ({ page }, testInfo) => {
    if (process.env.E2E_AUTH_LIVE !== "1") {
      testInfo.skip(true, "Définir E2E_AUTH_LIVE=1 avec un projet Supabase (confirmation email ON)");
    }

    await openSignup(page, testInfo);

    const email = `e2e-${Date.now()}@example.com`;
    await page.getByLabel("Nom complet").fill("E2E User");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Mot de passe", { exact: true }).fill("ValidPass1");
    await page.getByLabel("Confirmer le mot de passe").fill("ValidPass1");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Créer mon compte" }).click();

    await expect(page).toHaveURL(/\/auth\/check-email/, { timeout: 20_000 });
    await expect(page.getByText(/Impossible de créer le compte/i)).toHaveCount(0);
  });

  test("login / logout / reconnexion (démo)", async ({ page }, testInfo) => {
    await page.goto(LOGIN_PATH, { waitUntil: "domcontentloaded" });
    await dismissCookieBanner(page);
    await skipIfSupabaseMissing(page, testInfo);

    const demo = page.getByRole("button", { name: /Connexion démo/i });
    await demo.waitFor({ state: "visible", timeout: 5_000 }).catch(() => null);
    if (!(await demo.isVisible().catch(() => false))) {
      testInfo.skip(true, "Bouton démo indisponible");
    }

    await demo.scrollIntoViewIfNeeded();
    await demo.click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 20_000 });

    const logout = page.getByRole("button", { name: /Déconnexion/i });
    await expect(logout).toBeVisible();
    await logout.click();

    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/auth\/login\?redirect=%2Fdashboard/);

    await dismissCookieBanner(page);
    const demoAgain = page.getByRole("button", { name: /Connexion démo/i });
    await demoAgain.waitFor({ state: "visible", timeout: 5_000 });
    await demoAgain.click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 20_000 });
  });
});
