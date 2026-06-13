import { test, expect, Page } from "@playwright/test";

const BASE = "https://apple-mdm-academy-refonte.vercel.app";

// ── Pages à tester ──────────────────────────────────────────────────────────
const PAGES = [
  { url: "/", name: "Accueil" },
  { url: "/cours", name: "Catalogue cours" },
  { url: "/cours/jamf-100", name: "Cours Jamf 100" },
  { url: "/cours/apple-it-professional", name: "Cours Apple IT Pro" },
  { url: "/cours/intune-mac", name: "Cours Intune Mac" },
  { url: "/cours/apple-fundamentals", name: "Cours Apple Fundamentals" },
  { url: "/parcours", name: "Parcours" },
  { url: "/parcours/jamf-100", name: "Parcours Jamf 100" },
  { url: "/certifications", name: "Certifications" },
  { url: "/examens", name: "Examens" },
  { url: "/examens/jamf-100", name: "Examen Jamf 100" },
  { url: "/quiz", name: "Quiz" },
  { url: "/labs", name: "Labs" },
  { url: "/videos", name: "Vidéos" },
  { url: "/resources", name: "Ressources" },
  { url: "/contact", name: "Contact" },
  { url: "/auth/login", name: "Connexion" },
  { url: "/auth/signup", name: "Inscription" },
  { url: "/pricing", name: "Tarifs" },
  { url: "/support", name: "Support" },
  { url: "/legal", name: "Mentions légales" },
  { url: "/terms", name: "CGU" },
  { url: "/privacy", name: "Confidentialité" },
  { url: "/roadmap", name: "Roadmap" },
  { url: "/revision", name: "Révision" },
];

async function checkPage(page: Page, url: string, name: string) {
  const errors: string[] = [];
  const consoleErrors: string[] = [];
  const networkErrors: string[] = [];

  // Capture console errors
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  // Capture failed requests
  page.on("requestfailed", (req) => {
    networkErrors.push(`${req.url()} — ${req.failure()?.errorText}`);
  });

  const response = await page.goto(BASE + url, { waitUntil: "networkidle", timeout: 20_000 });

  // Status check
  if (response && response.status() >= 400) {
    errors.push(`HTTP ${response.status()}`);
  }

  // Check for blank page
  const bodyText = await page.locator("body").innerText().catch(() => "");
  if (bodyText.trim().length < 50) {
    errors.push("Page appears blank");
  }

  // Check logo visible
  const logo = page.locator('[aria-label*="Apple MDM Academy"]').first();
  const logoVisible = await logo.isVisible().catch(() => false);
  if (!logoVisible) errors.push("Logo not visible");

  // Check no collapse arrow overlapping logo
  const arrowBtn = page.locator('button[aria-label*="sidebar"], button[aria-label*="Réduire"], button[aria-label*="Ouvrir la sidebar"]');
  const arrowCount = await arrowBtn.count();
  if (arrowCount > 0) errors.push(`Found ${arrowCount} sidebar arrow button(s)`);

  // Check dev banner not visible
  const banner = page.locator('text="phase de développement"');
  const bannerVisible = await banner.isVisible().catch(() => false);
  if (bannerVisible) errors.push("Dev phase banner still visible");

  // Check email
  const oldEmail = page.locator('text="contact@apple-mdm-academy.fr"');
  const oldEmailVisible = await oldEmail.isVisible().catch(() => false);
  if (oldEmailVisible) errors.push("Old email still visible");

  return { url, name, status: response?.status(), errors, consoleErrors: consoleErrors.slice(0, 3), networkErrors: networkErrors.slice(0, 3) };
}

test.describe("Audit production — Desktop", () => {
  for (const p of PAGES) {
    test(`${p.name} (${p.url})`, async ({ page }) => {
      page.setDefaultTimeout(20_000);
      const result = await checkPage(page, p.url, p.name);

      // Report
      if (result.errors.length || result.consoleErrors.length) {
        console.log(`\n[${p.name}] Errors:`, result.errors);
        console.log(`[${p.name}] Console:`, result.consoleErrors);
      }

      expect(result.errors).toEqual([]);
    });
  }
});

test.describe("Audit production — Mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  const mobilePages = ["/", "/cours", "/certifications", "/contact", "/auth/login"];

  for (const url of mobilePages) {
    test(`Mobile ${url}`, async ({ page }) => {
      const errors: string[] = [];
      await page.goto(BASE + url, { waitUntil: "networkidle", timeout: 20_000 });
      const body = await page.locator("body").innerText().catch(() => "");
      if (body.trim().length < 50) errors.push("Blank page");
      expect(errors).toEqual([]);
    });
  }
});
