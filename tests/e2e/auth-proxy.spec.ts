import { test, expect } from "@playwright/test";

test.describe("Proxy / middleware auth", () => {
  test("GET /dashboard sans session → redirect login", async ({ request }) => {
    const response = await request.get("/dashboard", { maxRedirects: 0 });
    expect([302, 303, 307, 308]).toContain(response.status());
    const location = response.headers().location ?? "";
    expect(location).toMatch(/\/auth\/login/);
    expect(location).toMatch(/redirect=/);
  });

  test("page login accessible sans session", async ({ request }) => {
    const response = await request.get("/auth/login", { maxRedirects: 0 });
    expect(response.status()).toBe(200);
  });
});
