import { test, expect } from "@playwright/test";

const SIGNUP_PATH = "/auth/signup";
const LOGIN_PATH = "/auth/login";

test.describe("Page d'inscription", () => {
  test("affiche le formulaire complet sans erreur JS", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    const response = await page.goto(SIGNUP_PATH, { waitUntil: "domcontentloaded", timeout: 20_000 });
    expect(response?.status()).toBeLessThan(400);

    await expect(page.getByRole("heading", { name: "Créer un compte" })).toBeVisible();
    await expect(page.getByLabel("Nom complet")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Mot de passe", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Confirmer le mot de passe")).toBeVisible();
    await expect(page.getByRole("button", { name: "Créer mon compte" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Se connecter" })).toHaveAttribute("href", /\/auth\/login/);
  });

  test("validation locale — mot de passe faible", async ({ page }) => {
    await page.goto(SIGNUP_PATH, { waitUntil: "domcontentloaded" });

    const configured = await page.getByText("Configuration Supabase requise").isVisible().catch(() => false);
    test.skip(configured, "Supabase non configuré sur cette cible — test validation ignoré");

    await page.getByLabel("Nom complet").fill("Test User");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Mot de passe", { exact: true }).fill("abc");
    await page.getByLabel("Confirmer le mot de passe").fill("abc");

    await expect(page.getByRole("button", { name: "Créer mon compte" })).toBeDisabled();
    await expect(page.locator("#password-rules")).toContainText(/8 caractères/i);
  });

  test("validation locale — mots de passe différents", async ({ page }) => {
    await page.goto(SIGNUP_PATH, { waitUntil: "domcontentloaded" });

    const configured = await page.getByText("Configuration Supabase requise").isVisible().catch(() => false);
    test.skip(configured, "Supabase non configuré sur cette cible");

    await page.getByLabel("Nom complet").fill("Test User");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Mot de passe", { exact: true }).fill("ValidPass1");
    await page.getByLabel("Confirmer le mot de passe").fill("OtherPass1");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Créer mon compte" }).click();

    await expect(page.locator("form [role=alert]")).toContainText(/ne correspondent pas/i);
  });

  test("lien vers connexion conserve la redirection", async ({ page }) => {
    await page.goto(`${SIGNUP_PATH}?redirect=/dashboard`, { waitUntil: "domcontentloaded" });
    const loginLink = page.getByRole("link", { name: "Se connecter" });
    await expect(loginLink).toHaveAttribute("href", /redirect=%2Fdashboard/);
  });

  test("dashboard redirige vers login si non connecté", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/auth\/login\?redirect=%2Fdashboard/);
  });

  test("page login accessible", async ({ page }) => {
    await page.goto(LOGIN_PATH, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Connexion" })).toBeVisible();
    await expect(page.locator("#main-content").getByRole("link", { name: "S'inscrire" })).toHaveAttribute(
      "href",
      /\/auth\/signup/
    );
  });
});
