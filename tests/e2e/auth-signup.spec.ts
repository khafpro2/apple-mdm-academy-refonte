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
  const setupAlert = page.getByRole("alert").filter({ hasText: "Configuration Supabase requise" });
  const missing = await setupAlert.waitFor({ state: "visible", timeout: 1_000 }).then(
    () => true,
    () => false
  );
  if (missing) {
    testInfo.skip(true, "Supabase non configuré — rebuild E2E requis (scripts/start-e2e-server.sh)");
    return true;
  }

  return false;
}

async function openSignup(page: Page, testInfo: TestInfo) {
  await page.goto(SIGNUP_PATH, { waitUntil: "domcontentloaded" });
  await dismissCookieBanner(page);
  return skipIfSupabaseMissing(page, testInfo);
}

async function fillValidSignup(page: Page, email: string) {
  await page.getByLabel("Nom complet").fill("E2E Test User");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Mot de passe", { exact: true }).fill("ValidPass1");
  await page.getByLabel("Confirmer le mot de passe").fill("ValidPass1");
  await page.getByRole("checkbox").check();
}

test.describe("Page d'inscription", () => {
  test("affiche le formulaire complet sans erreur JS", async ({ page }, testInfo) => {
    if (await openSignup(page, testInfo)) return;

    await expect(page.getByRole("heading", { name: "Créer un compte" })).toBeVisible();
    await expect(page.getByLabel("Nom complet")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Mot de passe", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Confirmer le mot de passe")).toBeVisible();
    await expect(page.getByRole("button", { name: "Créer mon compte" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Continuer avec Google" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Se connecter" })).toHaveAttribute("href", /\/auth\/login/);
  });

  test("validation locale — mot de passe faible", async ({ page }, testInfo) => {
    if (await openSignup(page, testInfo)) return;

    await page.getByLabel("Nom complet").fill("Test User");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Mot de passe", { exact: true }).fill("abc");
    await page.getByLabel("Confirmer le mot de passe").fill("abc");

    await expect(page.getByRole("button", { name: "Créer mon compte" })).toBeDisabled();
    await expect(page.locator("#password-rules")).toContainText(/8 caractères/i);
  });

  test("validation locale — mots de passe différents", async ({ page }, testInfo) => {
    if (await openSignup(page, testInfo)) return;

    await page.getByLabel("Nom complet").fill("Test User");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Mot de passe", { exact: true }).fill("ValidPass1");
    await page.getByLabel("Confirmer le mot de passe").fill("OtherPass1");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Créer mon compte" }).click();

    await expect(page.getByRole("alert").filter({ hasText: /ne correspondent pas/i })).toBeVisible();
  });

  test("validation locale — champs obligatoires HTML5", async ({ page }, testInfo) => {
    if (await openSignup(page, testInfo)) return;

    await expect(page.getByLabel("Nom complet")).toHaveAttribute("required", "");
    await expect(page.getByLabel("Email")).toHaveAttribute("required", "");
    await expect(page.getByLabel("Mot de passe", { exact: true })).toHaveAttribute("required", "");
    await expect(page.getByLabel("Confirmer le mot de passe")).toHaveAttribute("required", "");
  });

  test("double soumission empêchée pendant l'envoi", async ({ page }, testInfo) => {
    if (await openSignup(page, testInfo)) return;

    await page.route("**/*", async (route) => {
      if (route.request().method() === "POST") {
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
      await route.continue();
    });

    await fillValidSignup(page, `test-${Date.now()}@example.com`);

    const submit = page.getByRole("button", { name: /Créer mon compte|Création en cours/i });
    await submit.click();
    await expect(page.getByRole("button", { name: /Création en cours/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Création en cours/i })).toBeDisabled();
  });

  test("lien vers connexion conserve la redirection", async ({ page }, testInfo) => {
    await page.goto(`${SIGNUP_PATH}?redirect=/dashboard`, { waitUntil: "domcontentloaded" });
    await dismissCookieBanner(page);
    if (await skipIfSupabaseMissing(page, testInfo)) return;

    const loginLink = page.getByRole("link", { name: "Se connecter" });
    await expect(loginLink).toHaveAttribute("href", /redirect=%2Fdashboard/);
  });

  test("dashboard redirige vers login si non connecté", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/auth\/login\?redirect=%2Fdashboard/);
  });

  test("page login accessible avec Google", async ({ page }, testInfo) => {
    await page.goto(LOGIN_PATH, { waitUntil: "domcontentloaded" });
    await dismissCookieBanner(page);
    if (await skipIfSupabaseMissing(page, testInfo)) return;

    await expect(page.getByRole("heading", { name: "Connexion" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Continuer avec Google" })).toBeVisible();
    await expect(page.locator("#main-content").getByRole("link", { name: "S'inscrire" })).toHaveAttribute(
      "href",
      /\/auth\/signup/
    );
  });

  test("autocomplete correct sur les champs d'inscription", async ({ page }, testInfo) => {
    if (await openSignup(page, testInfo)) return;

    await expect(page.getByLabel("Nom complet")).toHaveAttribute("autocomplete", "name");
    await expect(page.getByLabel("Email")).toHaveAttribute("autocomplete", "email");
    await expect(page.getByLabel("Mot de passe", { exact: true })).toHaveAttribute("autocomplete", "new-password");
    await expect(page.getByLabel("Confirmer le mot de passe")).toHaveAttribute("autocomplete", "new-password");
  });
});

test.describe("Parcours auth E2E (compte de test)", () => {
  const email = process.env.E2E_AUTH_EMAIL;
  const password = process.env.E2E_AUTH_PASSWORD;
  const runLive = Boolean(email && password);

  test.skip(!runLive, "Définir E2E_AUTH_EMAIL et E2E_AUTH_PASSWORD pour les parcours live");

  test("login → dashboard → logout", async ({ page }, testInfo) => {
    await page.goto(LOGIN_PATH, { waitUntil: "domcontentloaded" });
    await dismissCookieBanner(page);
    if (await skipIfSupabaseMissing(page, testInfo)) return;

    await page.getByLabel("Email").fill(email!);
    await page.getByLabel("Mot de passe", { exact: true }).fill(password!);
    await page.getByRole("button", { name: "Se connecter" }).click();

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 20_000 });
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/dashboard/);

    await page.locator('form[action="/auth/signout"]').getByRole("button").first().click();
    await expect(page).not.toHaveURL(/\/dashboard/, { timeout: 15_000 });

    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("signup email déjà utilisé", async ({ page }, testInfo) => {
    if (await openSignup(page, testInfo)) return;
    await fillValidSignup(page, email!);
    await page.getByRole("button", { name: "Créer mon compte" }).click();
    await expect(page.getByRole("alert")).toContainText(/existe déjà|déjà/i, { timeout: 20_000 });
  });

  test("reset password page accessible", async ({ page }, testInfo) => {
    await page.goto("/auth/forgot-password", { waitUntil: "domcontentloaded" });
    await dismissCookieBanner(page);
    if (await skipIfSupabaseMissing(page, testInfo)) return;
    await expect(page.getByRole("heading", { name: /mot de passe/i })).toBeVisible();
  });
});

test.describe("Google OAuth bouton", () => {
  test("déclenche signInWithOAuth (mock réseau)", async ({ page }, testInfo) => {
    if (await openSignup(page, testInfo)) return;

    let oauthCalled = false;
    await page.route("**/auth/v1/authorize**", async (route) => {
      oauthCalled = true;
      await route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<html><body>oauth-mock</body></html>",
      });
    });

    await page.getByRole("button", { name: "Continuer avec Google" }).click();
    await expect.poll(() => oauthCalled, { timeout: 10_000 }).toBe(true);
  });
});
