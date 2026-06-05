import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve("public/images/courses/intune-originals");

const captures = [
  {
    url: "https://learn.microsoft.com/en-us/mem/intune-service/enrollment/apple-mdm-push-certificate-get",
    selector: 'img[src*="create-mdm-push-certificate.png"]',
    file: "29-apns-certificate-intune-official.png",
  },
  {
    url: "https://learn.microsoft.com/en-us/intune/intune-service/enrollment/device-enrollment-program-enroll-macos",
    selector: 'img[src*="macos-account-settings-intune.png"]',
    file: "37-macos-account-settings-intune-official.png",
  },
  {
    url: "https://learn.microsoft.com/en-us/intune/device-enrollment/apple/setup-apple-token",
    selector: 'img[src*="image03.png"]',
    file: "30-ios-ade-token-intune-official.png",
  },
  {
    url: "https://learn.microsoft.com/en-us/intune/intune-service/configuration/device-profile-create",
    selector: 'img[src*="devices-overview.png"]',
    file: "32-devices-overview-intune-official.png",
  },
  {
    url: "https://learn.microsoft.com/en-us/intune/intune-service/configuration/device-profile-create",
    selector: 'img[src*="applicability-rules.png"]',
    file: "39-applicability-rules-intune-official.png",
  },
  {
    url: "https://learn.microsoft.com/en-us/intune/intune-service/configuration/platform-sso-macos",
    selector: 'img[src*="intune-psso-device-profile.png"]',
    file: "37-platform-sso-device-profile-intune-official.png",
  },
  {
    url: "https://learn.microsoft.com/en-us/intune/intune-service/configuration/platform-sso-macos",
    selector: 'img[src*="settings-picker-authentication-extensible-sso.png"]',
    file: "60-platform-sso-settings-picker-intune-official.png",
  },
  {
    url: "https://learn.microsoft.com/en-us/intune/intune-service/configuration/platform-sso-macos",
    selector: 'img[src*="platform-sso-macos-registration-required.png"]',
    file: "61-platform-sso-registration-required-official.png",
  },
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 });

for (const capture of captures) {
  await page.goto(capture.url, { waitUntil: "networkidle", timeout: 60000 });
  const image = page.locator(capture.selector).first();
  await image.waitFor({ state: "visible", timeout: 30000 });
  await image.screenshot({ path: path.join(outDir, capture.file) });
  console.log(`${capture.file}\t${capture.url}`);
}

await browser.close();
