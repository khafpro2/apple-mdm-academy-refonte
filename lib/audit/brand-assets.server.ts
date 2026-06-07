import fs from "node:fs";
import path from "node:path";
import { BRAND_REGISTRY } from "@/lib/brands/registry";

export type BrandAssetStatus = "ok" | "review";

export type BrandAssetAuditRow = {
  id: string;
  name: string;
  logoPresent: boolean;
  componentPresent: boolean;
  pages: string[];
  legalNoticePresent: boolean;
  isPlaceholder: boolean;
  status: BrandAssetStatus;
};

export type BrandAssetsAuditReport = {
  generatedAt: string;
  rows: BrandAssetAuditRow[];
  summary: {
    total: number;
    ok: number;
    review: number;
    placeholders: number;
  };
};

const COMPONENT_FILES: Record<string, string> = {
  JamfLogo: "components/brands/JamfLogo.tsx",
  MicrosoftLogo: "components/brands/MicrosoftLogo.tsx",
  IntuneLogo: "components/brands/IntuneLogo.tsx",
  EntraLogo: "components/brands/EntraLogo.tsx",
  MicrosoftLearnLogo: "components/brands/MicrosoftLearnLogo.tsx",
};

function publicPath(relative: string): string {
  return path.join(process.cwd(), "public", relative.replace(/^\//, ""));
}

function fileExists(relativePublicPath: string): boolean {
  try {
    return fs.existsSync(publicPath(relativePublicPath));
  } catch {
    return false;
  }
}

function componentExists(componentName: string): boolean {
  const rel = COMPONENT_FILES[componentName];
  if (!rel) return componentName.includes("LogoIcon");
  return fs.existsSync(path.join(process.cwd(), rel));
}

export function runBrandAssetsAudit(): BrandAssetsAuditReport {
  const rows: BrandAssetAuditRow[] = BRAND_REGISTRY.map((brand) => {
    const logoPresent = fileExists(brand.logoPath);
    const componentPresent = componentExists(brand.componentName);
    const legalNoticePresent = brand.legalNoticeKey === "jamf" || brand.legalNoticeKey === "microsoft";

    const status: BrandAssetStatus =
      logoPresent && componentPresent && !brand.isPlaceholder ? "ok" : "review";

    return {
      id: brand.id,
      name: brand.name,
      logoPresent,
      componentPresent,
      pages: brand.pagePatterns,
      legalNoticePresent,
      isPlaceholder: brand.isPlaceholder,
      status,
    };
  });

  const ok = rows.filter((r) => r.status === "ok").length;
  const review = rows.filter((r) => r.status === "review").length;
  const placeholders = rows.filter((r) => r.isPlaceholder).length;

  return {
    generatedAt: new Date().toISOString(),
    rows,
    summary: { total: rows.length, ok, review, placeholders },
  };
}
