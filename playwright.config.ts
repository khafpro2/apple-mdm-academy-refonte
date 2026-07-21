import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const useWebServer = !process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  retries: 0,
  workers: 1,
  reporter: [["list"], ["json", { outputFile: "tests/e2e/results.json" }]],
  use: {
    baseURL,
    screenshot: "only-on-failure",
    video: "off",
    ignoreHTTPSErrors: true,
  },
  webServer: useWebServer
    ? {
        command: "bash scripts/start-e2e-server.sh",
        url: baseURL,
        reuseExistingServer: false,
        timeout: 180_000,
      }
    : undefined,
  projects: [
    {
      name: "Desktop Chrome",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
